import { toCsv } from './download';

describe('toCsv', () => {
  it('writes a header row and escapes commas, quotes and new lines', () => {
    const csv = toCsv(
      [
        { name: 'Paracetamol, 500mg', note: 'say "hi"' },
        { name: 'ORS', note: null },
      ],
      [
        { header: 'Name', value: (r) => r.name },
        { header: 'Note', value: (r) => r.note },
      ],
    );

    expect(csv).toBe('\uFEFFName,Note\r\n"Paracetamol, 500mg","say ""hi"""\r\nORS,');
  });
});
