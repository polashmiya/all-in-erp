import { BgColorsOutlined, CheckOutlined, DesktopOutlined, MoonOutlined, SunOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Drawer, Flex, Segmented, Switch, Tooltip, Typography, theme } from 'antd';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useLanguageStore } from '../i18n/i18n';
import { localize } from '../i18n/language';
import { buildBrand, siderStyles, type SiderStyle } from '../theme/brand';
import { useBrand } from '../theme/brand-context';
import { findPreset, themePresets, type ThemePreset } from '../theme/presets';
import { useResolvedMode, useThemeStore, type ModePreference } from '../theme/theme-store';

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <Typography.Text strong style={{ display: 'block' }}>
        {title}
      </Typography.Text>
      {hint && (
        <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 2 }}>
          {hint}
        </Typography.Text>
      )}
      <div style={{ marginTop: 12 }}>{children}</div>
    </section>
  );
}

/** Round swatch: the primary with the accent as a corner dot. */
function PresetSwatch({ preset, selected, onSelect }: { preset: ThemePreset; selected: boolean; onSelect: () => void }) {
  const { token } = theme.useToken();
  const language = useLanguageStore((s) => s.language);
  const name = localize(preset.name, language);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      onClick={onSelect}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '10px 4px 8px',
        border: `1px solid ${selected ? preset.primary : token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        background: selected ? token.colorFillQuaternary : 'transparent',
        cursor: 'pointer',
        color: token.colorText,
        font: 'inherit',
      }}
    >
      <span
        style={{
          position: 'relative',
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.primary} 62%, ${preset.accent} 62%, ${preset.accent} 100%)`,
          boxShadow: selected ? `0 0 0 2px ${token.colorBgContainer}, 0 0 0 4px ${preset.primary}` : 'none',
          display: 'grid',
          placeItems: 'center',
          color: '#fff',
          fontSize: 14,
        }}
      >
        {selected && <CheckOutlined />}
      </span>
      <span style={{ fontSize: 12, fontWeight: selected ? 600 : 400 }}>{name}</span>
    </button>
  );
}

/** Miniature of the shell in a given sidebar style, drawn with the real theme colours. */
function SiderPreview({
  style,
  selected,
  label,
  groupLabel,
  onSelect,
}: {
  style: SiderStyle;
  selected: boolean;
  label: string;
  groupLabel: string;
  onSelect: () => void;
}) {
  const { token } = theme.useToken();
  const current = useBrand();
  const mode = useResolvedMode();
  const preset = findPreset(current.key);
  const brand = buildBrand(preset, mode, style);
  const sider = brand.sider;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${groupLabel}: ${label}`}
      onClick={onSelect}
      style={{ border: 'none', padding: 0, background: 'none', cursor: 'pointer', font: 'inherit', color: token.colorText }}
    >
      <span
        style={{
          display: 'grid',
          gridTemplateColumns: '34% 1fr',
          gridTemplateRows: '14px 1fr',
          height: 70,
          borderRadius: token.borderRadius,
          overflow: 'hidden',
          border: `1px solid ${selected ? brand.primary : token.colorBorderSecondary}`,
          boxShadow: selected ? `0 0 0 2px ${brand.palette[1]}` : 'none',
        }}
      >
        <span style={{ gridColumn: '1 / 3', background: brand.headerBg, borderBottom: `1px solid ${brand.borderSecondary}` }} />
        <span style={{ background: sider.bg, padding: '6px 5px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ height: 5, borderRadius: 3, background: sider.selectedBg }} />
          <span style={{ height: 4, width: '70%', borderRadius: 2, background: sider.textMuted, opacity: 0.5 }} />
          <span style={{ height: 4, width: '55%', borderRadius: 2, background: sider.textMuted, opacity: 0.5 }} />
        </span>
        <span style={{ background: brand.layoutBg, padding: 6 }}>
          <span style={{ display: 'block', height: '100%', borderRadius: 4, background: brand.containerBg, border: `1px solid ${brand.borderSecondary}` }} />
        </span>
      </span>
      <span style={{ display: 'block', marginTop: 6, fontSize: 12, textAlign: 'center', fontWeight: selected ? 600 : 400 }}>{label}</span>
    </button>
  );
}

export function ThemeSettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const settings = useThemeStore(
    useShallow((s) => ({
      mode: s.mode,
      preset: s.preset,
      sider: s.sider,
      compact: s.compact,
      setMode: s.setMode,
      setPreset: s.setPreset,
      setSider: s.setSider,
      setCompact: s.setCompact,
      resetAppearance: s.resetAppearance,
    })),
  );

  const siderLabels: Record<SiderStyle, string> = {
    tinted: t('theme.sidebarTinted'),
    light: t('theme.sidebarLight'),
    dark: t('theme.sidebarDark'),
    brand: t('theme.sidebarBrand'),
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={360}
      title={t('theme.title')}
      extra={
        <Button size="small" icon={<UndoOutlined />} onClick={settings.resetAppearance}>
          {t('theme.reset')}
        </Button>
      }
    >
      <Section title={t('theme.colour')} hint={t('theme.colourHint')}>
        <div role="radiogroup" aria-label={t('theme.colour')} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {themePresets.map((preset) => (
            <PresetSwatch
              key={preset.key}
              preset={preset}
              selected={findPreset(settings.preset).key === preset.key}
              onSelect={() => settings.setPreset(preset.key)}
            />
          ))}
        </div>
      </Section>

      <Section title={t('theme.mode')}>
        <Segmented<ModePreference>
          block
          value={settings.mode}
          onChange={settings.setMode}
          options={[
            { value: 'light', label: t('theme.light'), icon: <SunOutlined /> },
            { value: 'dark', label: t('theme.dark'), icon: <MoonOutlined /> },
            { value: 'system', label: t('theme.system'), icon: <DesktopOutlined /> },
          ]}
        />
      </Section>

      <Section title={t('theme.sidebar')} hint={t('theme.sidebarHint')}>
        <div role="radiogroup" aria-label={t('theme.sidebar')} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {siderStyles.map((style) => (
            <SiderPreview
              key={style}
              style={style}
              label={siderLabels[style]}
              groupLabel={t('theme.sidebar')}
              selected={settings.sider === style}
              onSelect={() => settings.setSider(style)}
            />
          ))}
        </div>
      </Section>

      <Section title={t('theme.density')}>
        <Flex justify="space-between" align="center" gap={16}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {t('theme.densityHint')}
          </Typography.Text>
          <Switch checked={settings.compact} onChange={settings.setCompact} aria-label={t('theme.density')} />
        </Flex>
      </Section>
    </Drawer>
  );
}

/** Header button that opens the appearance drawer. */
export function ThemeSettingsButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={t('theme.title')}>
        <Button type="text" aria-label={t('theme.title')} icon={<BgColorsOutlined />} onClick={() => setOpen(true)} />
      </Tooltip>
      <ThemeSettingsDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
