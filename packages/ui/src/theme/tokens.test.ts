import { theme } from 'antd';
import { buildBrand, siderStyles, type ThemeMode } from './brand';
import { contrast, luminance, mix } from './color';
import { DEFAULT_PRESET, findPreset, themePresets } from './presets';
import { buildTheme, fontFamily } from './tokens';

const modes: ThemeMode[] = ['light', 'dark'];

describe('colour helpers', () => {
  it('mixes and measures contrast', () => {
    expect(mix('#000000', '#FFFFFF', 0.5)).toBe('#808080');
    expect(mix('#0B8478', '#FFFFFF', 0)).toBe('#FFFFFF');
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(luminance('#FFFFFF')).toBeCloseTo(1);
  });
});

describe('theme presets', () => {
  it('defaults to teal', () => {
    expect(DEFAULT_PRESET).toBe('teal');
    expect(findPreset('unknown').key).toBe('teal');
  });

  it('has unique keys', () => {
    expect(new Set(themePresets.map((p) => p.key)).size).toBe(themePresets.length);
  });

  it.each(themePresets.map((p) => [p.key, p.primary]))('%s primary carries white text at WCAG AA', (_, primary) => {
    expect(contrast('#FFFFFF', primary)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('buildBrand', () => {
  const combos = themePresets.flatMap((preset) =>
    modes.flatMap((mode) => siderStyles.map((sider) => [preset.key, mode, sider] as const)),
  );

  it.each(combos)('%s / %s / %s sidebar keeps menu text readable', (key, mode, sider) => {
    const colors = buildBrand(findPreset(key), mode, sider).sider;

    expect(contrast(colors.text, colors.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.text, colors.hoverBg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.selectedText, colors.selectedBg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.textMuted, colors.bg)).toBeGreaterThanOrEqual(3);
  });

  it('tints the light sidebar and page background with the primary', () => {
    const brand = buildBrand(findPreset('teal'), 'light', 'tinted');

    expect(brand.sider.bg).not.toBe('#FFFFFF');
    expect(brand.sider.bg).not.toBe(brand.layoutBg);
    expect(brand.layoutBg).not.toBe(brand.containerBg);
    expect(brand.sider.inverse).toBe(false);
  });

  it('uses dark surfaces in dark mode', () => {
    const brand = buildBrand(findPreset('teal'), 'dark', 'tinted');

    expect(luminance(brand.layoutBg)).toBeLessThan(0.02);
    expect(luminance(brand.containerBg)).toBeLessThan(0.03);
    expect(brand.sider.inverse).toBe(true);
  });

  it('marks dark and brand sidebars as inverse', () => {
    expect(buildBrand(findPreset('teal'), 'light', 'dark').sider.inverse).toBe(true);
    expect(buildBrand(findPreset('teal'), 'light', 'brand').sider.inverse).toBe(true);
  });
});

describe('buildTheme', () => {
  const brand = buildBrand(findPreset('teal'), 'light', 'tinted');

  it('uses the brand primary and surfaces', () => {
    const config = buildTheme({ mode: 'light', compact: false, brand });

    expect(config.algorithm).toEqual([theme.defaultAlgorithm]);
    expect(config.token?.colorPrimary).toBe('#0B8478');
    expect(config.token?.colorBgLayout).toBe(brand.layoutBg);
    expect(config.token?.fontFamily).toBe(fontFamily);
  });

  it('switches to the dark algorithm in dark mode', () => {
    const dark = buildBrand(findPreset('teal'), 'dark', 'tinted');
    expect(buildTheme({ mode: 'dark', compact: false, brand: dark }).algorithm).toEqual([theme.darkAlgorithm]);
  });

  it('adds the compact algorithm when compact density is on', () => {
    expect(buildTheme({ mode: 'light', compact: true, brand }).algorithm).toEqual([
      theme.defaultAlgorithm,
      theme.compactAlgorithm,
    ]);
  });

  it('keeps a Bangla-capable font in the stack', () => {
    expect(fontFamily).toContain('Hind Siliguri');
  });
});
