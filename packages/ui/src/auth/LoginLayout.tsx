import { CheckCircleFilled } from '@ant-design/icons';
import { Flex, Grid, Space, Tag, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { BrandMark } from '../components/BrandMark';
import { LanguageSwitch, ThemeToggle } from '../components/HeaderActions';
import { LoginIllustration } from './LoginIllustration';

export interface LoginLayoutProps {
  appName: string;
  appBadge: string;
  headline: string;
  description: string;
  highlights: string[];
  children: ReactNode;
}

/**
 * Split-screen frame for sign-in and business-unit selection: brand panel on the left (desktop only),
 * the form on the right with language and theme switches.
 */
export function LoginLayout({ appName, appBadge, headline, description, highlights, children }: LoginLayoutProps) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const showBrand = screens.lg === true;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: showBrand ? 'minmax(0, 1.1fr) minmax(0, 1fr)' : 'minmax(0, 1fr)',
        background: token.colorBgContainer,
      }}
    >
      {showBrand && (
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '40px 56px',
            display: 'flex',
            flexDirection: 'column',
            color: '#fff',
            background: 'linear-gradient(145deg, #2F54EB 0%, #1D39C4 55%, #10239E 100%)',
          }}
        >
          <Flex align="center" gap={10}>
            <BrandMark size={34} />
            <Typography.Text style={{ color: '#fff', fontSize: 20, fontWeight: 600 }}>{appName}</Typography.Text>
            <Tag bordered={false} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', marginInlineStart: 4 }}>
              {appBadge}
            </Tag>
          </Flex>

          <Flex vertical justify="center" style={{ flex: 1, maxWidth: 520, paddingBlock: 32 }}>
            <LoginIllustration />
            <Typography.Title level={2} style={{ color: '#fff', margin: '32px 0 12px', lineHeight: 1.3 }}>
              {headline}
            </Typography.Title>
            <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 20 }}>
              {description}
            </Typography.Paragraph>
            <Space direction="vertical" size={10}>
              {highlights.map((item) => (
                <Typography.Text key={item} style={{ color: 'rgba(255,255,255,0.92)' }}>
                  <CheckCircleFilled style={{ marginInlineEnd: 10, color: '#ADC6FF' }} />
                  {item}
                </Typography.Text>
              ))}
            </Space>
          </Flex>

          <Typography.Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            © {new Date().getFullYear()} {appName}
          </Typography.Text>
        </section>
      )}

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: screens.sm ? '20px 24px' : '16px',
          background: token.colorBgLayout,
        }}
      >
        <Flex justify={showBrand ? 'flex-end' : 'space-between'} align="center" gap={4}>
          {!showBrand && (
            <Flex align="center" gap={8}>
              <BrandMark size={28} />
              <Typography.Text strong style={{ fontSize: 16 }}>
                {appName}
              </Typography.Text>
              <Tag color="blue" bordered={false}>
                {appBadge}
              </Tag>
            </Flex>
          )}
          <Flex gap={4}>
            <LanguageSwitch />
            <ThemeToggle />
          </Flex>
        </Flex>

        <Flex justify="center" align="center" style={{ flex: 1, paddingBlock: 32 }}>
          <div style={{ width: '100%', maxWidth: 420 }}>{children}</div>
        </Flex>
      </section>
    </div>
  );
}
