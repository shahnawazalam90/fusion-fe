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
