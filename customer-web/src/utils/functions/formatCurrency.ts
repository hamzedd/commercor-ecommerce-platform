export default function formatCurrency(
  value: number | string,
  currencyCode = "USD",
  locale = "en",
) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(Number(value));
  } catch {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: "USD",
    }).format(Number(value));
  }
}
