export function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getFieldName(locator) {
  if (locator && locator.includes("]")) {
    const startIndex = locator.lastIndexOf("=") + 1;
    const endIndex = locator.lastIndexOf("]");
    const fieldName = locator.substring(startIndex, endIndex);
    return fieldName;
  }

  return locator;
}

export function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

export function downloadFile(content, filename, indentSpaces) {
  const formattedContent = JSON.stringify(content, null, indentSpaces);
  const blob = new Blob([formattedContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  return;
}
