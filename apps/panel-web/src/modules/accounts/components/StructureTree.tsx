import { ApartmentOutlined, InboxOutlined, ShopOutlined } from '@ant-design/icons';
import { Empty, Tag, Tree, Typography, type TreeDataNode } from 'antd';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { STRUCTURE_TINT, type StructureLeaf, type StructureUnit } from './structure';

function NodeTitle({ node }: { node: StructureLeaf }) {
  const { t } = useTranslation();
  return (
    <span className="acc-node">
      {node.code && (
        <Tag bordered={false} className="erp-code erp-flush">
          {node.code}
        </Tag>
      )}
      <Typography.Text ellipsis type={node.name ? undefined : 'secondary'}>
        {node.name || t('setup.untitled')}
      </Typography.Text>
    </span>
  );
}

const warehouseNode = (w: StructureLeaf): TreeDataNode => ({
  key: w.key,
  title: <NodeTitle node={w} />,
  icon: <InboxOutlined className={`erp-fg--${STRUCTURE_TINT.warehouse}`} />,
  isLeaf: true,
});

export function StructureTree({ units, empty }: { units: StructureUnit[]; empty?: ReactNode }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const { treeData, branchKeys } = useMemo(() => {
    const branches: string[] = [];
    const data = units.map<TreeDataNode>((unit) => {
      branches.push(unit.key);
      return {
        key: unit.key,
        title: <NodeTitle node={unit} />,
        icon: <ApartmentOutlined className={`erp-fg--${STRUCTURE_TINT.unit}`} />,
        children: [
          ...unit.offices.map<TreeDataNode>((office) => {
            if (office.warehouses.length) branches.push(office.key);
            return {
              key: office.key,
              title: <NodeTitle node={office} />,
              icon: <ShopOutlined className={`erp-fg--${STRUCTURE_TINT.office}`} />,
              children: office.warehouses.map(warehouseNode),
            };
          }),
          ...unit.warehouses.map(warehouseNode),
        ],
      };
    });
    return { treeData: data, branchKeys: branches };
  }, [units]);

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
