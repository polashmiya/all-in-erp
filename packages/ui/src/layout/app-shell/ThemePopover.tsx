import { BgColorsOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Popover, Segmented, Switch } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useLanguageStore } from '../../i18n/i18n';
import { localize } from '../../i18n/language';
import { buildBrand, siderStyles, type SiderStyle } from '../../theme/brand';
import { useBrand } from '../../theme/brand-context';
import { CUSTOM_PRESET, themePresets } from '../../theme/presets';
import { useThemeStore, type ModePreference } from '../../theme/theme-store';

const vars = (values: Record<string, string>) => values as CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="erp-themepanel__section">
      <span className="erp-themepanel__label">{title}</span>
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
    <div className="erp-themepanel">
      <div className="erp-themepanel__head">
        <strong>{t('shell.theme')}</strong>
        <button
          type="button"
          className="erp-iconbtn"
          aria-label={t('shell.close')}
          onClick={onClose}
        >
          <CloseOutlined />
        </button>
      </div>

      <Section title={t('shell.primaryColor')}>
        <div
          role="radiogroup"
          aria-label={t('shell.primaryColor')}
          className="erp-themepanel__swatches"
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
                style={vars({ '--swatch': p.primary })}
                onClick={() => setPreset(p.key)}
              >
                <span className="erp-swatch__dot">{selected && <CheckOutlined />}</span>
                {name}
              </button>
            );
          })}
        </div>
        <label
          className={`erp-themepanel__custom${preset === CUSTOM_PRESET ? ' is-selected' : ''}`}
        >
          <span className="erp-themepanel__customlabel">{t('shell.custom')}</span>
          <span className="erp-mono">
            {(preset === CUSTOM_PRESET && customPrimary
              ? customPrimary
              : brand.primary
            ).toUpperCase()}
          </span>
          <input
            type="color"
            aria-label={t('shell.customColor')}
            value={brand.primary.toLowerCase()}
            onChange={(e) => setCustomPrimary(e.target.value)}
          />
        </label>
      </Section>

      <Section title={t('shell.sidebarStyle')}>
        <div
          role="radiogroup"
          aria-label={t('shell.sidebarStyle')}
          className="erp-themepanel__sidestyles"
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
                style={vars({ '--preview-bg': preview.bg, '--preview-line': preview.guide })}
                onClick={() => setSider(style)}
              >
                <span className="erp-sidestyle__preview">
                  <span className="erp-sidestyle__bar">
                    <span />
                    <span className="is-active" />
                    <span />
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
        <div className="erp-toggle-row">
          <span>{t('theme.density')}</span>
          <Switch
            size="small"
            checked={compact}
            onChange={setCompact}
            aria-label={t('theme.density')}
          />
        </div>
      </Section>

      <span className="erp-themepanel__note">{t('shell.themeSaved')}</span>
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
      classNames={{ body: 'erp-popover-body' }}
      content={<ThemePanel onClose={() => onOpenChange(false)} />}
    >
      <button type="button" className="erp-tbtn" aria-label={t('shell.theme')} aria-expanded={open}>
        <BgColorsOutlined />
        <span className="erp-tbtn__dot" />
      </button>
    </Popover>
  );
}
