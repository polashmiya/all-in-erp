export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number | boolean | null | undefined;
}

const escape = (value: unknown) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const lines = [
    columns.map((c) => escape(c.header)).join(','),
    ...rows.map((row) => columns.map((c) => escape(c.value(row))).join(',')),
  ];
  return `\uFEFF${lines.join('\r\n')}`;
}

export function downloadCsv<T>(fileName: string, rows: T[], columns: CsvColumn<T>[]) {
  const blob = new Blob([toCsv(rows, columns)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
