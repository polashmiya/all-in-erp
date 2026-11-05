import { BgColorsOutlined, CheckOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Drawer, Segmented, Switch } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useLanguageStore } from '../../i18n/i18n';
import { localize } from '../../i18n/language';
import {
  contentWidths,
  fontKeys,
  fontNames,
  fontScales,
  fontStacks,
  radiusStyles,
  tableBorderStyles,
  tableHeaderStyles,
  tableSizes,
  type UiPrefs,
} from '../../theme/appearance';
import { buildBrand, siderStyles, type SiderStyle } from '../../theme/brand';
import { useBrand } from '../../theme/brand-context';
import { CUSTOM_PRESET, themePresets } from '../../theme/presets';
import { useThemeStore, useUiPrefs, type ModePreference } from '../../theme/theme-store';

const vars = (values: Record<string, string>) => values as CSSProperties;

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="erp-themepanel__group">
      <h3 className="erp-themepanel__grouptitle">{title}</h3>
      {children}
    </section>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="erp-themepanel__section">
      <span className="erp-themepanel__label">{title}</span>
      {children}
    </div>
  );
}

function Choice<K extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: K;
  options: readonly K[];
  onChange: (value: K) => void;
}) {
  const { t } = useTranslation();
  return (
    <Section title={label}>
      <Segmented<K>
        block
        size="small"
        value={value}
        onChange={onChange}
        options={options.map((o) => ({ value: o, label: t(`appearance.opt.${o}`) }))}
      />
    </Section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="erp-toggle-row">
      <span>{label}</span>
      <Switch size="small" checked={checked} onChange={onChange} aria-label={label} />
    </div>
  );
}

function ThemePanel() {
  const { t } = useTranslation();
  const brand = useBrand();
  const language = useLanguageStore((s) => s.language);
  const prefs = useUiPrefs();
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
    setPrefs,
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
      setPrefs: s.setPrefs,
    })),
  );

  const set =
    <K extends keyof UiPrefs>(key: K) =>
    (value: UiPrefs[K]) =>
      setPrefs({ [key]: value } as Partial<UiPrefs>);

  const siderLabels: Record<SiderStyle, string> = {
    light: t('theme.sidebarLight'),
    dark: t('theme.sidebarDark'),
    brand: t('theme.sidebarBrand'),
  };

  return (
    <div className="erp-themepanel">
      <Group title={t('appearance.colors')}>
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

        <Section title={t('theme.mode')}>
          <Segmented<ModePreference>
            block
            size="small"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'light', label: t('theme.light') },
              { value: 'dark', label: t('theme.dark') },
              { value: 'system', label: t('theme.system') },
            ]}
          />
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
      </Group>

      <Group title={t('appearance.typography')}>
        <Section title={t('appearance.fontFamily')}>
          <div
            role="radiogroup"
            aria-label={t('appearance.fontFamily')}
            className="erp-themepanel__fonts"
          >
            {fontKeys.map((key) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={prefs.font === key}
                className={`erp-fontopt${prefs.font === key ? ' is-selected' : ''}`}
                style={{ fontFamily: fontStacks[key] }}
                onClick={() => set('font')(key)}
              >
                <span className="erp-fontopt__sample">Aa</span>
                <span className="erp-fontopt__name">{fontNames[key]}</span>
              </button>
            ))}
          </div>
        </Section>
        <Choice
          label={t('appearance.fontSize')}
          value={prefs.fontScale}
          options={fontScales}
          onChange={set('fontScale')}
        />
      </Group>

      <Group title={t('appearance.layout')}>
        <Choice
          label={t('appearance.radius')}
          value={prefs.radius}
          options={radiusStyles}
          onChange={set('radius')}
        />
        <Choice
          label={t('appearance.contentWidth')}
          value={prefs.contentWidth}
          options={contentWidths}
          onChange={set('contentWidth')}
        />
        <Toggle label={t('theme.density')} checked={compact} onChange={setCompact} />
        <Toggle label={t('appearance.motion')} checked={prefs.motion} onChange={set('motion')} />
      </Group>

      <Group title={t('appearance.tables')}>
        <Choice
          label={t('appearance.tableHeader')}
          value={prefs.tableHeader}
          options={tableHeaderStyles}
          onChange={set('tableHeader')}
        />
        <Choice
          label={t('appearance.tableBorder')}
          value={prefs.tableBorder}
          options={tableBorderStyles}
          onChange={set('tableBorder')}
        />
        <Choice
          label={t('appearance.tableSize')}
          value={prefs.tableSize}
          options={tableSizes}
          onChange={set('tableSize')}
        />
        <Toggle
          label={t('appearance.tableStripe')}
          checked={prefs.tableStripe}
          onChange={set('tableStripe')}
        />
      </Group>
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
  const resetAppearance = useThemeStore((s) => s.resetAppearance);

  return (
    <>
      <button
        type="button"
        className="erp-tbtn"
        aria-label={t('shell.theme')}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        <BgColorsOutlined />
        <span className="erp-tbtn__dot" />
      </button>
      <Drawer
        open={open}
        onClose={() => onOpenChange(false)}
        title={t('appearance.title')}
        width={360}
        rootClassName="erp-appearance"
        styles={{ mask: { background: 'transparent' } }}
        footer={
          <div className="erp-appearance__foot">
            <span className="erp-themepanel__note">{t('shell.themeSaved')}</span>
            <Button size="small" icon={<UndoOutlined />} onClick={resetAppearance}>
              {t('appearance.reset')}
            </Button>
          </div>
        }
      >
        <ThemePanel />
      </Drawer>
    </>
  );
}
