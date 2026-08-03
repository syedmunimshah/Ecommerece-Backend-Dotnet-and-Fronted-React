export const ORDER_STATUS_CLASS: Record<string, string> = {
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Processing:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Shipped:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export function getOrderStatusClass(status: string): string {
  return (
    ORDER_STATUS_CLASS[status] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
  );
}
