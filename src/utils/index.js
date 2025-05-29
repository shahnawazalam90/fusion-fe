export * from './excel';

export function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function downloadJSON(content, filename, indentSpaces) {
  const formattedContent = JSON.stringify(content, null, indentSpaces);
  const blob = new Blob([formattedContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  return;
}

export const executionBrowserOptions = [
  { label: 'Chrome', value: 'chrome' },
  { label: 'Firefox', value: 'firefox' },
  { label: 'Edge', value: 'edge' },
  { label: 'Safari', value: 'safari' },
];
