import { BgColorsOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Flex, Popover, Segmented, Switch, Typography } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useLanguageStore } from '../../i18n/i18n';
import { localize } from '../../i18n/language';
import { buildBrand, siderStyles, type SiderStyle } from '../../theme/brand';
import { useBrand } from '../../theme/brand-context';
import { CUSTOM_PRESET, themePresets } from '../../theme/presets';
import { useThemeStore, type ModePreference } from '../../theme/theme-store';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Typography.Text style={{ fontSize: 12, fontWeight: 600 }} type="secondary">
        {title}
      </Typography.Text>
      {children}
    </div>
  );
}

function ThemePanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const brand = useBrand();
  const language = useLanguageStore((s) => s.language);
  const {
    mode,
    preset,
    customPrimary,
    sider,
    compact,
    setMode,
    setPreset,
    setCustomPrimary,
    setSider,
    setCompact,
  } = useThemeStore(
    useShallow((s) => ({
      mode: s.mode,
      preset: s.preset,
      customPrimary: s.customPrimary,
      sider: s.sider,
      compact: s.compact,
      setMode: s.setMode,
      setPreset: s.setPreset,
      setCustomPrimary: s.setCustomPrimary,
      setSider: s.setSider,
      setCompact: s.setCompact,
    })),
  );

  const siderLabels: Record<SiderStyle, string> = {
    light: t('theme.sidebarLight'),
    dark: t('theme.sidebarDark'),
    brand: t('theme.sidebarBrand'),
  };

  return (
    <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Flex align="center" justify="space-between">
        <Typography.Text strong>{t('shell.theme')}</Typography.Text>
        <button
          type="button"
          className="erp-menu-item"
          style={{ width: 28, height: 28, padding: 0, justifyContent: 'center' }}
          aria-label={t('shell.close')}
          onClick={onClose}
        >
          <CloseOutlined style={{ fontSize: 12 }} />
        </button>
      </Flex>

      <Section title={t('shell.primaryColor')}>
        <div
          role="radiogroup"
          aria-label={t('shell.primaryColor')}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}
        >
          {themePresets.map((p) => {
            const selected = preset === p.key;
            const name = localize(p.name, language);
            return (
              <button
                key={p.key}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={name}
                className="erp-swatch"
                onClick={() => setPreset(p.key)}
              >
                <span
                  className="erp-swatch__dot"
                  style={{
                    background: p.primary,
                    boxShadow: selected
                      ? `0 0 0 2px var(--erp-surface), 0 0 0 4px ${p.primary}`
                      : 'none',
                  }}
                >
                  {selected && <CheckOutlined />}
                </span>
                {name}
              </button>
            );
          })}
        </div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 40,
            padding: '0 6px 0 10px',
            border: '1px solid var(--erp-border)',
            borderRadius: 8,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <span style={{ flex: 1, fontWeight: preset === CUSTOM_PRESET ? 600 : 400 }}>
            {t('shell.custom')}
          </span>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 12, fontFamily: 'ui-monospace, Menlo, monospace' }}
          >
            {(preset === CUSTOM_PRESET && customPrimary
              ? customPrimary
              : brand.primary
            ).toUpperCase()}
          </Typography.Text>
          <input
            type="color"
            aria-label={t('shell.customColor')}
            value={brand.primary.toLowerCase()}
            onChange={(e) => setCustomPrimary(e.target.value)}
            style={{
              width: 32,
              height: 28,
              padding: 0,
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          />
        </label>
      </Section>

      <Section title={t('shell.sidebarStyle')}>
        <div
          role="radiogroup"
          aria-label={t('shell.sidebarStyle')}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}
        >
          {siderStyles.map((style) => {
            const preview = buildBrand(
              { key: brand.key, name: '', primary: brand.primary, accent: brand.accent },
              'light',
              style,
            ).sider;
            const selected = sider === style;
            return (
              <button
                key={style}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`erp-sidestyle${selected ? ' is-selected' : ''}`}
                onClick={() => setSider(style)}
              >
                <span className="erp-sidestyle__preview">
                  <span className="erp-sidestyle__bar" style={{ background: preview.bg }}>
                    <span style={{ background: preview.guide }} />
                    <span style={{ background: brand.primary }} />
                    <span style={{ background: preview.guide }} />
                  </span>
                  <span className="erp-sidestyle__body" />
                </span>
                {siderLabels[style]}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={t('theme.mode')}>
        <Segmented<ModePreference>
          block
          value={mode}
          onChange={setMode}
          options={[
            { value: 'light', label: t('theme.light') },
            { value: 'dark', label: t('theme.dark') },
            { value: 'system', label: t('theme.system') },
          ]}
        />
        <Flex align="center" justify="space-between">
          <Typography.Text style={{ fontSize: 13 }}>{t('theme.density')}</Typography.Text>
          <Switch
            size="small"
            checked={compact}
            onChange={setCompact}
            aria-label={t('theme.density')}
          />
        </Flex>
      </Section>

      <Typography.Text type="secondary" style={{ fontSize: 11 }}>
        {t('shell.themeSaved')}
      </Typography.Text>
    </div>
  );
}

export function ThemePopover({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      arrow={false}
      open={open}
      onOpenChange={onOpenChange}
      styles={{ body: { padding: 16 } }}
      content={<ThemePanel onClose={() => onOpenChange(false)} />}
    >
      <button type="button" className="erp-tbtn" aria-label={t('shell.theme')} aria-expanded={open}>
        <BgColorsOutlined />
        <span className="erp-tbtn__dot" />
      </button>
    </Popover>
  );
}
