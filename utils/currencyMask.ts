const MAX_DIGITS = 11;

export function maskCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, MAX_DIGITS);

  if (!digits) {
    return "R$ 0.00";
  }

  const cents = Number.parseInt(digits, 10);

  return centsToCurrency(cents);
}

export function centsToCurrency(cents: number): string {
  const reais = Math.floor(cents / 100);
  const centavos = String(cents % 100).padStart(2, "0");

  return `R$ ${reais}.${centavos}`;
}

export function valorToCents(valor: string): number {
  const normalized = valor.replace(",", ".").replace(/[^\d.]/g, "");
  const [whole = "0", ...rest] = normalized.split(".");
  const decimals = rest.join("").padEnd(2, "0").slice(0, 2);

  return Number.parseInt(whole || "0", 10) * 100 + Number.parseInt(decimals || "0", 10);
}

export function currencyToDecimal(valor: string): string {
  const clean = valor.replace(/^R\$\s*/, "").trim();

  return clean || "0.00";
}