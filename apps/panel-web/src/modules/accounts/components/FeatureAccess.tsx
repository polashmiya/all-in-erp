import { AppstoreOutlined, FileTextOutlined } from '@ant-design/icons';
import type { LocalizedLabel } from '@erp/api-client';
import { localize, resolveIcon, useLanguageStore } from '@erp/ui';
import { Button, Empty, Flex, Skeleton, Space, Tag, Tree, Typography, theme, type TreeDataNode } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeatureCatalog } from './feature-catalog';

function useLabel() {
  const language = useLanguageStore((s) => s.language);
  return (label: LocalizedLabel) => localize({ en: label.en, ...(label.bn ? { bn: label.bn } : {}) }, language);
}

export function FeatureAccessTree({ value, onChange }: { value?: string[]; onChange?: (codes: string[]) => void }) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const label = useLabel();
  const { modules, allCodes, loading } = useFeatureCatalog();
  const selected = useMemo(() => value ?? [], [value]);

  const treeData = useMemo<TreeDataNode[]>(
    () =>
      modules.map((module) => {
        const codes = module.subModules.flatMap((s) => s.features.map((f) => f.code));
        const chosen = codes.filter((c) => selected.includes(c)).length;
        return {
          key: `module:${module.key}`,
          icon: resolveIcon(module.icon) ?? <AppstoreOutlined />,
          title: (
            <Space size={8}>
              <Typography.Text strong>{label(module.label)}</Typography.Text>
              <Tag bordered={false} color={chosen ? 'processing' : 'default'} style={{ marginInlineEnd: 0 }}>
                {chosen}/{codes.length}
              </Tag>
            </Space>
          ),
          children: module.subModules.map((subModule) => ({
            key: `sub:${module.key}.${subModule.key}`,
            icon: resolveIcon(subModule.icon) ?? <AppstoreOutlined />,
            title: <Typography.Text>{label(subModule.label)}</Typography.Text>,
            children: subModule.features.map((feature) => ({
              key: feature.code,
              isLeaf: true,
              icon: <FileTextOutlined style={{ color: token.colorTextTertiary }} />,
              title: (
                <Space size={8}>
                  {label(feature.label)}
                  <Typography.Text type="secondary" style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>
                    {feature.code}
                  </Typography.Text>
                </Space>
              ),
            })),
          })),
        };
      }),
    [modules, selected, label, token.colorTextTertiary],
  );

  return (
    <div>
      <Flex justify="space-between" align="center" gap={12} wrap style={{ marginBottom: 12 }}>
        <Typography.Text type="secondary">{t('menus.selected', { count: selected.length, total: allCodes.length })}</Typography.Text>
        <Space>
          <Button size="small" onClick={() => onChange?.(allCodes)} disabled={loading}>
            {t('menus.selectAll')}
          </Button>
          <Button size="small" onClick={() => onChange?.([])} disabled={loading}>
            {t('menus.clear')}
          </Button>
        </Space>
      </Flex>
      <div style={{ border: `1px solid ${token.colorBorderSecondary}`, borderRadius: token.borderRadiusLG, padding: '10px 8px' }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} title={false} />
        ) : modules.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('menus.empty')} />
        ) : (
          <Tree
            checkable
            showIcon
            blockNode
            selectable={false}
            defaultExpandAll
            treeData={treeData}
            checkedKeys={selected}
            onCheck={(checked) => {
              const keys = Array.isArray(checked) ? checked : checked.checked;
              onChange?.(keys.map(String).filter((key) => allCodes.includes(key)));
            }}
          />
        )}
      </div>
    </div>
  );
}

export function FeatureAccessSummary({ codes }: { codes: string[] }) {
  const { t } = useTranslation();
  const label = useLabel();
  const { modules, loading } = useFeatureCatalog();

  if (loading) return <Skeleton active paragraph={{ rows: 2 }} title={false} />;

  const groups = modules.flatMap((module) =>
    module.subModules
      .map((subModule) => ({
        key: `${module.key}.${subModule.key}`,
        title: `${label(module.label)} › ${label(subModule.label)}`,
        features: subModule.features.filter((f) => codes.includes(f.code)),
      }))
      .filter((group) => group.features.length > 0),
  );

  if (groups.length === 0) return <Typography.Text type="secondary">{t('menus.none')}</Typography.Text>;

  return (
    <Flex vertical gap={10}>
      {groups.map((group) => (
        <div key={group.key}>
          <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>
            {group.title}
          </Typography.Text>
          <div>
            {group.features.map((feature) => (
              <Tag key={feature.code} bordered={false} color="processing" style={{ marginBottom: 6 }}>
                {label(feature.label)}
              </Tag>
            ))}
          </div>
        </div>
      ))}
    </Flex>
  );
}
