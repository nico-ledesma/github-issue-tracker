export const getQueryParam = param => {
  const params = new URLSearchParams(window.location.search);

  const value = params.get(param);

  return value === null ? null : decodeURIComponent(value);
}
