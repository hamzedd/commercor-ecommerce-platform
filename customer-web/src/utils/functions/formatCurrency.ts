export default function formatCurrency(
  value: number | string,
  currencyCode = "USD",
  locale = "en",
) {
  try {
    // Chromium and Node ship different Georgian currency patterns, which can
    // otherwise make SSR hydration replace every rendered product price.
    const stableLocale = locale.toLowerCase() === "ka" ? "en-US" : locale;
    return new Intl.NumberFormat(stableLocale, {
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
