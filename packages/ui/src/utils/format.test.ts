import {
  formatDate,
  formatDelta,
  formatMoney,
  formatMoneyCompact,
  formatNumber,
  formatPercent,
  initials,
  pageRange,
} from './format';

describe('number and money formatting', () => {
  it('groups digits the South-Asian way', () => {
    expect(formatNumber(1248)).toBe('1,248');
    expect(formatNumber(124500)).toBe('1,24,500');
    expect(formatMoney(124500)).toBe('৳ 1,24,500.00');
    expect(formatMoney(12, { symbol: false })).toBe('12.00');
  });

  it('shows a dash for missing values', () => {
    expect(formatNumber(null)).toBe('—');
    expect(formatMoney(undefined)).toBe('—');
    expect(formatPercent(Number.NaN)).toBe('—');
    expect(formatDate('')).toBe('—');
  });

  it('abbreviates crore and lakh', () => {
    expect(formatMoneyCompact(48_200_000)).toBe('৳ 4.82 Cr');
    expect(formatMoneyCompact(1_840_000)).toBe('৳ 18.4 L');
    expect(formatMoneyCompact(42_940)).toBe('৳ 42,940');
  });

  it('formats percentages and deltas', () => {
    expect(formatPercent(7.5)).toBe('7.50 %');
    expect(formatDelta(3.2)).toBe('+3.2%');
    expect(formatDelta(-5, '')).toBe('−5');
  });
});

describe('text helpers', () => {
  it('builds initials', () => {
    expect(initials('Rahim Ahmed')).toBe('RA');
    expect(initials('Paracetamol 500mg Tablet')).toBe('PT');
    expect(initials('Omeprazole')).toBe('OM');
    expect(initials('')).toBe('?');
  });

  it('computes the visible page range', () => {
    expect(pageRange(1, 25, 1248)).toEqual({ from: 1, to: 25 });
    expect(pageRange(50, 25, 1248)).toEqual({ from: 1226, to: 1248 });
    expect(pageRange(1, 25, 0)).toEqual({ from: 0, to: 0 });
  });

  it('formats dates in the design format', () => {
    expect(formatDate('2026-11-02')).toBe('2 Nov 2026');
  });
});
