import { ApartmentOutlined, InboxOutlined, ShopOutlined } from '@ant-design/icons';
import { Empty, Flex, Tag, Tree, Typography, type TreeDataNode } from 'antd';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { StructureLeaf, StructureUnit } from './structure';
import { useStructureColors } from './structure-colors';

function NodeTitle({ node }: { node: StructureLeaf }) {
  const { t } = useTranslation();
  return (
    <Flex component="span" align="center" gap={6} style={{ display: 'inline-flex', minWidth: 0, verticalAlign: 'middle' }}>
      {node.code && (
        <Tag bordered={false} style={{ marginInlineEnd: 0, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
          {node.code}
        </Tag>
      )}
      <Typography.Text ellipsis type={node.name ? undefined : 'secondary'}>
        {node.name || t('setup.untitled')}
      </Typography.Text>
    </Flex>
  );
}

export function StructureTree({ units, empty }: { units: StructureUnit[]; empty?: ReactNode }) {
  const colors = useStructureColors();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const { treeData, branchKeys } = useMemo(() => {
    const branches: string[] = [];
    const warehouse = (w: StructureLeaf): TreeDataNode => ({
      key: w.key,
      title: <NodeTitle node={w} />,
      icon: <InboxOutlined style={{ color: colors.warehouse }} />,
      isLeaf: true,
    });

    const data = units.map<TreeDataNode>((unit) => {
      branches.push(unit.key);
      return {
        key: unit.key,
        title: <NodeTitle node={unit} />,
        icon: <ApartmentOutlined style={{ color: colors.unit }} />,
        children: [
          ...unit.offices.map<TreeDataNode>((office) => {
            if (office.warehouses.length) branches.push(office.key);
            return {
              key: office.key,
              title: <NodeTitle node={office} />,
              icon: <ShopOutlined style={{ color: colors.office }} />,
              children: office.warehouses.map(warehouse),
            };
          }),
          ...unit.warehouses.map(warehouse),
        ],
      };
    });

    return { treeData: data, branchKeys: branches };
  }, [units, colors]);

  if (units.length === 0) return <>{empty ?? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</>;

  return (
    <Tree
      showIcon
      blockNode
      selectable={false}
      treeData={treeData}
      expandedKeys={branchKeys.filter((key) => !collapsed.has(key))}
      onExpand={(keys) => setCollapsed(new Set(branchKeys.filter((key) => !keys.includes(key))))}
    />
  );
}
