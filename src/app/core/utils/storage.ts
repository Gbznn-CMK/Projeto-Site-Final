export function getLocalStorage(): Storage | null {
  return typeof localStorage === 'undefined' ? null : localStorage;
}
