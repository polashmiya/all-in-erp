import { RightOutlined } from '@ant-design/icons';
import { useSelectBusinessUnit } from '@erp/api-client';
import { App, Avatar, Button, Card, Flex, Spin, Tag, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { AuthFrame } from '@/components/AuthFrame';
import { redirectTarget } from '@/routes/redirect';
import { useAuthStore } from '@/state/auth-store';

/** Shown after sign-in when the user can work in more than one business unit. */
export function SelectUnitPage() {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, businessUnits, lastBusinessUnitId, selectUnit, signOut } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      businessUnits: s.businessUnits,
      lastBusinessUnitId: s.lastBusinessUnitId,
      selectUnit: s.selectUnit,
      signOut: s.signOut,
    })),
  );
  const select = useSelectBusinessUnit();

  const choose = async (businessUnitId: string) => {
    if (select.isPending) return;
    try {
      selectUnit(await select.mutateAsync({ data: { businessUnitId } }));
      navigate(redirectTarget(location.state), { replace: true });
    } catch {
      void message.error(t('auth.switchFailed'));
    }
  };

  return (
    <AuthFrame>
      <Typography.Title level={3} style={{ marginBottom: 4 }}>
        {t('auth.selectUnitTitle')}
      </Typography.Title>
      <Typography.Text type="secondary">
        {t('auth.selectUnitSubtitle', { account: user?.accountName ?? '', count: businessUnits.length })}
      </Typography.Text>

      <Flex vertical gap={12} style={{ marginTop: 24 }}>
        {businessUnits.map((unit) => {
          const loading = select.isPending && select.variables?.data.businessUnitId === unit.id;
          return (
            <Card
              key={unit.id}
              hoverable
              role="button"
              tabIndex={0}
              aria-label={unit.name}
              onClick={() => void choose(unit.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && void choose(unit.id)}
              styles={{ body: { padding: '14px 16px' } }}
            >
              <Flex align="center" gap={14}>
                <Avatar
                  shape="square"
                  size={44}
                  style={{ background: token.colorPrimaryBg, color: token.colorPrimary, fontWeight: 600, flexShrink: 0 }}
                >
                  {unit.code}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Flex align="center" gap={8}>
                    <Typography.Text strong>{unit.name}</Typography.Text>
                    {unit.id === lastBusinessUnitId && (
                      <Tag color="blue" bordered={false}>
                        {t('auth.lastUsed')}
                      </Tag>
                    )}
                  </Flex>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {unit.code} · {unit.roleName}
                  </Typography.Text>
                </div>
                {loading ? <Spin size="small" /> : <RightOutlined style={{ color: token.colorTextTertiary }} />}
              </Flex>
            </Card>
          );
        })}
      </Flex>

      <Button type="link" onClick={signOut} style={{ marginTop: 16, paddingInline: 0 }}>
        {t('auth.useAnotherAccount')}
      </Button>
    </AuthFrame>
  );
}
