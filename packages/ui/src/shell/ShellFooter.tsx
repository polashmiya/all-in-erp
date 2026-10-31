import { Typography } from 'antd';

export function ShellFooter({ appName, version }: { appName: string; version?: string }) {
  return (
    <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '16px 0', fontSize: 12 }}>
      © {new Date().getFullYear()} {appName}
      {version ? ` · v${version}` : ''}
    </Typography.Text>
  );
}
