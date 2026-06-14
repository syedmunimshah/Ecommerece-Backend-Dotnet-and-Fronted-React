const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatCurrency = (n: number) => currencyFormatter.format(n);

export const formatDate = (s: string | null | undefined) =>
  s ? dateFormatter.format(new Date(s)) : "—";

export const formatDateTime = (s: string | null | undefined) =>
  s ? dateTimeFormatter.format(new Date(s)) : "—";
