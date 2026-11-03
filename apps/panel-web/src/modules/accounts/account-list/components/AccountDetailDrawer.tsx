import { ApartmentOutlined, EditOutlined, InboxOutlined, ShopOutlined } from '@ant-design/icons';
import { useGetAccount } from '@erp/api-client';
import {
  AppDrawer,
  DescriptionList,
  DotValue,
  EmptyState,
  formatDateTime,
  InitialsTile,
  SectionCard,
  StatusTag,
  TitleCell,
  useDisclosure,
  useLanguageStore,
} from '@erp/ui';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { FeatureAccessSummary } from '../../components/FeatureAccess';
import { structureFromDetail } from '../../components/structure';
import { StructureTree } from '../../components/StructureTree';
import { countryName } from '../../utils/format';
import { MenuAccessModal } from './MenuAccessModal';

export function AccountDetailDrawer({
  accountId,
  onClose,
}: {
  accountId: string | undefined;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const menus = useDisclosure();
  const query = useGetAccount(accountId ?? '', { query: { enabled: !!accountId } });
  const account = query.data;

  const counts = account && {
    units: account.businessUnits.length,
    offices: account.businessUnits.reduce((sum, b) => sum + b.offices.length, 0),
    warehouses: account.businessUnits.reduce(
      (sum, b) =>
        sum + b.warehouses.length + b.offices.reduce((s, o) => s + o.warehouses.length, 0),
      0,
    ),
  };

  return (
    <AppDrawer
      open={!!accountId}
      onClose={onClose}
      size="lg"
      loading={query.isPending}
      title={t('detail.title')}
    >
      {query.isError && <EmptyState title={t('detail.loadFailed')} />}
      {account && counts && (
        <div className="erp-stack is-loose">
          <TitleCell
            leading={<InitialsTile name={account.name} />}
            title={
              <span className="erp-page__titlerow">
                <span className="erp-page__title">{account.name}</span>
                <StatusTag>{account.code}</StatusTag>
                <StatusTag tone={account.isActive ? 'success' : 'neutral'} dot>
                  {account.isActive ? t('accounts.status.active') : t('accounts.status.inactive')}
                </StatusTag>
              </span>
            }
            subtitle={[account.industry, account.city, countryName(account.country, language)]
              .filter(Boolean)
              .join(' · ')}
          />

          <SectionCard title={t('detail.profile')} padding="lg">
            <DescriptionList
              items={[
                {
                  key: 'email',
                  label: t('field.email'),
                  value: account.email && <a href={`mailto:${account.email}`}>{account.email}</a>,
                },
                { key: 'phone', label: t('field.phone'), value: account.phone },
                {
                  key: 'website',
                  label: t('field.website'),
                  value: account.website && (
                    <a href={account.website} target="_blank" rel="noreferrer">
                      {account.website}
                    </a>
                  ),
                },
                { key: 'tax', label: t('field.taxId'), value: account.taxId },
                { key: 'address', label: t('field.address'), value: account.address },
                { key: 'currency', label: t('field.baseCurrency'), value: account.baseCurrency },
                { key: 'tz', label: t('field.timeZone'), value: account.timeZone },
                {
                  key: 'created',
                  label: t('detail.created'),
                  value: formatDateTime(account.createdAt),
                },
              ]}
            />
          </SectionCard>

          <SectionCard title={t('detail.admin')} padding="lg">
            {account.admin ? (
              <DescriptionList
                items={[
                  {
                    key: 'name',
                    label: account.admin.fullName,
                    value: (
                      <Typography.Text copyable={{ text: account.admin.email }}>
                        {account.admin.email}
                      </Typography.Text>
                    ),
                  },
                  {
                    key: 'login',
                    label: t('detail.lastLogin'),
                    value: account.admin.lastLoginAt
                      ? formatDateTime(account.admin.lastLoginAt)
                      : t('detail.never'),
                  },
                ]}
              />
            ) : (
              <EmptyState title={t('detail.noAdmin')} />
            )}
          </SectionCard>

          <SectionCard
            title={t('detail.structure')}
            padding="lg"
            extra={
              <span className="erp-inline-stats">
                <DotValue tone="primary" label={t('accounts.stat.businessUnits')}>
                  <ApartmentOutlined /> {counts.units}
                </DotValue>
                <DotValue tone="info" label={t('accounts.stat.offices')}>
                  <ShopOutlined /> {counts.offices}
                </DotValue>
                <DotValue tone="warning" label={t('accounts.stat.warehouses')}>
                  <InboxOutlined /> {counts.warehouses}
                </DotValue>
              </span>
            }
          >
            <StructureTree units={structureFromDetail(account.businessUnits)} />
          </SectionCard>

          <SectionCard
            title={t('menus.title')}
            padding="lg"
            actions={[
              {
                key: 'edit',
                label: t('menus.edit'),
                icon: <EditOutlined />,
                variant: 'link',
                onClick: () => menus.onOpen(),
              },
            ]}
          >
            <FeatureAccessSummary codes={account.featureCodes} />
          </SectionCard>

          <MenuAccessModal
            accountId={account.id}
            accountName={account.name}
            initial={account.featureCodes}
            open={menus.open}
            onClose={menus.onClose}
          />
        </div>
      )}
    </AppDrawer>
  );
}
