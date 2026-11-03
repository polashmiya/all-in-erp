import { Spin } from 'antd';

export function FullPageLoader() {
  return (
    <div className="erp-page-loader">
      <Spin size="large" />
    </div>
  );
}
