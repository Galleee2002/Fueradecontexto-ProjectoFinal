export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100)
}

export function formatSoldCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k vendidos`
  }
  return `${count} vendidos`
}
