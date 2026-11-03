import { ArrowLeftOutlined, ArrowRightOutlined, ShopOutlined } from '@ant-design/icons';
import { useSelectBusinessUnit } from '@erp/api-client';
import { StatusTag } from '@erp/ui';
import { App, Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { AuthLayout } from '../components/AuthLayout';
import { redirectTarget } from '@/common/guards/redirect';
import { useAuthStore } from '@/common/store/auth-store';

export function SelectUnitPage() {
  const { t } = useTranslation();
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
  const [chosen, setChosen] = useState<string | undefined>(
    () => businessUnits.find((u) => u.id === lastBusinessUnitId)?.id ?? businessUnits[0]?.id,
  );
  const chosenUnit = businessUnits.find((u) => u.id === chosen);
  const firstName = user?.fullName.split(' ')[0] ?? '';

  const proceed = async () => {
    if (!chosen || select.isPending) return;
    try {
      selectUnit(await select.mutateAsync({ data: { businessUnitId: chosen } }));
      navigate(redirectTarget(location.state), { replace: true });
    } catch {
      void message.error(t('auth.switchFailed'));
    }
  };

  return (
    <AuthLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <button
          type="button"
          className="erp-linkbtn is-muted"
          style={{ alignSelf: 'flex-start', paddingInline: 0, display: 'inline-flex', gap: 6 }}
          onClick={signOut}
        >
          <ArrowLeftOutlined /> {t('selectUnit.back')}
        </button>

        <div>
          <h1>{t('selectUnit.title')}</h1>
          <p className="erp-login__lead">
            {t('selectUnit.lead', { name: firstName, count: businessUnits.length })}
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label={t('shell.businessUnit')}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {businessUnits.map((unit) => (
            <button
              key={unit.id}
              type="button"
              role="radio"
              aria-checked={unit.id === chosen}
              className="erp-bucard"
              onClick={() => setChosen(unit.id)}
              onDoubleClick={() => void proceed()}
            >
              <span className="erp-bucard__tile">
                <ShopOutlined />
              </span>
              <span className="erp-bucard__text">
                <span className="erp-bucard__name">{unit.name}</span>
                <span className="erp-bucard__meta">
                  {unit.code} · {unit.roleName}
                </span>
              </span>
              {unit.id === lastBusinessUnitId && (
                <StatusTag tone="info">{t('auth.lastUsed')}</StatusTag>
              )}
              <span className="erp-bucard__radio" aria-hidden="true" />
            </button>
          ))}
        </div>

        <Button
          type="primary"
          size="large"
          block
          disabled={!chosenUnit}
          loading={select.isPending}
          onClick={() => void proceed()}
          style={{ height: 48, fontSize: 15, fontWeight: 600, borderRadius: 10 }}
        >
          {t('selectUnit.continue', { name: chosenUnit?.name ?? '' })} <ArrowRightOutlined />
        </Button>
      </div>
    </AuthLayout>
  );
}
