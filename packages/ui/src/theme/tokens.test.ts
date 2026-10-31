import { theme } from 'antd';
import { brand, buildTheme, fontFamily } from './tokens';

describe('buildTheme', () => {
  it('uses the default algorithm and brand tokens in light mode', () => {
    const config = buildTheme({ mode: 'light', compact: false });
    expect(config.algorithm).toEqual([theme.defaultAlgorithm]);
    expect(config.token?.colorPrimary).toBe(brand.primary);
    expect(config.token?.borderRadius).toBe(8);
    expect(config.token?.fontFamily).toBe(fontFamily);
  });

  it('switches to the dark algorithm and dark surfaces in dark mode', () => {
    const config = buildTheme({ mode: 'dark', compact: false });
    expect(config.algorithm).toEqual([theme.darkAlgorithm]);
    expect(config.token?.colorBgLayout).not.toBe(buildTheme({ mode: 'light', compact: false }).token?.colorBgLayout);
  });

  it('adds the compact algorithm when compact density is on', () => {
    expect(buildTheme({ mode: 'light', compact: true }).algorithm).toEqual([
      theme.defaultAlgorithm,
      theme.compactAlgorithm,
    ]);
  });

  it('keeps a Bangla-capable font in the stack', () => {
    expect(fontFamily).toContain('Hind Siliguri');
  });
});
