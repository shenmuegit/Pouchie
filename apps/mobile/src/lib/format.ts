export function formatMoney(cents: number): string {
  const value = cents / 100;
  return `¥${value.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function formatDate(input: string): string {
  const date = new Date(input);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });
}

export function formatDateTime(input: string): string {
  const date = new Date(input);
  const day = date.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric"
  });
  const time = date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${day} ${time}`;
}

