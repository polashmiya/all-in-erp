import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  ActionGroup,
  downloadCsv,
  ForbiddenResult,
  formatDateTime,
  ListPageLayout,
  StatusTag,
  type ActionItem,
  type CsvColumn,
  type ListFilterDef,
  type ListState,
} from '@erp/ui';
import { App, type TableColumnsType } from 'antd';
import { useState, type Key, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeatureAccess } from '@/common/hooks/useFeatureAccess';
import { problemMessage } from '@/common/utils/api-errors';
import type { MasterList, MasterRow, StatusView } from '../master-data';

export interface MasterListPageProps<T extends MasterRow, F extends Record<string, unknown>> {
  feature: string;
  title: string;
  subtitle: ReactNode;
  newLabel: string;
  search: { label: string; placeholder: string };
  list: ListState<F, StatusView>;
  filters?: ListFilterDef<F>[];
  data?: MasterList<T>;
  loading: boolean;
  onRefresh: () => void;
  columns: TableColumnsType<T>;
  csvColumns: CsvColumn<T>[];
  exportFile: string;
  fetchAll: () => Promise<T[]>;
  empty: { title: string; description: string };
  onCreate: () => void;
  onEdit: (row: T) => void;
  onSetStatus: (ids: number[], isActive: boolean) => Promise<unknown>;
  onDelete: (ids: number[]) => Promise<unknown>;
  children?: ReactNode;
}

export function MasterListPage<T extends MasterRow, F extends Record<string, unknown>>({
  feature,
  title,
  subtitle,
  newLabel,
  search,
  list,
  filters,
  data,
  loading,
  onRefresh,
  columns,
  csvColumns,
  exportFile,
  fetchAll,
  empty,
  onCreate,
  onEdit,
  onSetStatus,
  onDelete,
  children,
}: MasterListPageProps<T, F>) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const access = useFeatureAccess(feature);
  const [working, setWorking] = useState<string | null>(null);

  if (!access.view) return <ForbiddenResult />;

  const run = async (key: string, work: () => Promise<unknown>, success: string) => {
    setWorking(key);
    try {
      await work();
      void message.success(success);
      return true;
    } catch (error) {
      void message.error(problemMessage(error, t('master.failed')));
      return false;
    } finally {
      setWorking(null);
    }
  };

  const unselect = (ids: number[]) =>
    list.setSelected(list.selected.filter((k) => !ids.includes(Number(k))));

  const changeStatus = async (ids: number[], isActive: boolean) => {
    const done = await run(
      isActive ? 'activate' : 'deactivate',
      () => onSetStatus(ids, isActive),
      t(isActive ? 'master.activated' : 'master.deactivated', { count: ids.length }),
    );
    if (done) unselect(ids);
  };

  const remove = async (ids: number[]) => {
    const done = await run(
      'delete',
      () => onDelete(ids),
      t('master.deleted', { count: ids.length }),
    );
    if (done) unselect(ids);
  };

  const exportRows = async (ids?: Key[]) => {
    try {
      const rows = await fetchAll();
      const selected = ids?.map(Number);
      downloadCsv(exportFile, selected ? rows.filter((r) => selected.includes(r.id)) : rows, [
        ...csvColumns,
        {
          header: t('master.colStatus'),
          value: (r) => (r.isActive ? t('master.active') : t('master.inactive')),
        },
        {
          header: t('master.colUpdated'),
          value: (r) => formatDateTime(r.modifiedAt ?? r.createdAt),
        },
      ]);
    } catch (error) {
      void message.error(problemMessage(error, t('master.failed')));
    }
  };

  const rowActions = (row: T): ActionItem[] => [
    {
      key: 'edit',
      label: t('master.edit'),
      icon: <EditOutlined />,
      variant: 'text',
      iconOnly: true,
      hidden: !access.edit,
      onClick: () => onEdit(row),
    },
    {
      key: 'toggle',
      label: row.isActive ? t('master.deactivate') : t('master.activate'),
      hidden: !access.edit,
      onClick: () => changeStatus([row.id], !row.isActive),
    },
    { key: 'divider', label: '', divider: true, hidden: !access.edit || !access.delete },
    {
      key: 'delete',
      label: t('master.delete'),
      danger: true,
      hidden: !access.delete,
      confirm: {
        title: t('master.deleteOne', { name: row.name }),
        description: t('master.deleteHint'),
        okText: t('master.delete'),
        danger: true,
      },
      onClick: () => remove([row.id]),
    },
  ];

  const allColumns: TableColumnsType<T> = [
    ...columns,
    {
      key: 'status',
      title: t('master.colStatus'),
      render: (_, row) => (
        <StatusTag tone={row.isActive ? 'success' : 'neutral'} dot>
          {row.isActive ? t('master.active') : t('master.inactive')}
        </StatusTag>
      ),
    },
    {
      key: 'modifiedAt',
      title: t('master.colUpdated'),
      sorter: true,
      render: (_, row) => formatDateTime(row.modifiedAt ?? row.createdAt),
    },
  ];

  if (access.edit || access.delete) {
    allColumns.push({
      key: 'actions',
      title: t('master.colActions'),
      fixed: 'right',
      render: (_, row) => <ActionGroup actions={rowActions(row)} size="small" overflowAfter={1} />,
    });
  }

  const newAction: ActionItem = {
    key: 'new',
    label: newLabel,
    icon: <PlusOutlined />,
    variant: 'primary',
    hidden: !access.create,
    onClick: onCreate,
  };

  return (
    <>
      <ListPageLayout<T, F, StatusView>
        title={title}
        subtitle={subtitle}
        actions={[
          {
            key: 'export',
            label: t('master.export'),
            icon: <DownloadOutlined />,
            hidden: !access.export,
            onClick: () => exportRows(),
          },
          newAction,
        ]}
        state={list}
        search={search}
        filters={filters}
        views={[
          { key: 'all', label: t('master.viewAll'), count: data?.counts.all },
          { key: 'active', label: t('master.viewActive'), count: data?.counts.active },
          { key: 'inactive', label: t('master.viewInactive'), count: data?.counts.inactive },
        ]}
        columns={allColumns}
        rows={data?.items}
        rowKey={(row) => row.id}
        total={data?.total}
        loading={loading}
        onRefresh={onRefresh}
        selectable={access.edit || access.delete || access.export}
        bulkActions={(keys) => {
          const ids = keys.map(Number);
          return [
            {
              key: 'activate',
              label: t('master.activate'),
              icon: <CheckCircleOutlined />,
              hidden: !access.edit,
              loading: working === 'activate',
              onClick: () => changeStatus(ids, true),
            },
            {
              key: 'deactivate',
              label: t('master.deactivate'),
              icon: <StopOutlined />,
              hidden: !access.edit,
              loading: working === 'deactivate',
              onClick: () => changeStatus(ids, false),
            },
            {
              key: 'export',
              label: t('master.export'),
              icon: <DownloadOutlined />,
              hidden: !access.export,
              onClick: () => exportRows(keys),
            },
            {
              key: 'delete',
              label: t('master.delete'),
              icon: <DeleteOutlined />,
              variant: 'danger',
              hidden: !access.delete,
              loading: working === 'delete',
              confirm: {
                title: t('master.deleteMany', { count: ids.length }),
                description: t('master.deleteHint'),
                okText: t('master.delete'),
                danger: true,
              },
              onClick: () => remove(ids),
            },
          ];
        }}
        empty={{
          title: empty.title,
          description: empty.description,
          actions: access.create ? [newAction] : undefined,
        }}
      />
      {children}
    </>
  );
}
