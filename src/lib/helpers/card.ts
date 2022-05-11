export function formatExpiry(expiration: string) {
  const exp = expiration.split("/");
  return {
    month: (exp[0] || "").trim(),
    year: (exp[1] || "").trim(),
  };
}

export function formatCard(card: string) {
  return card.replace(/\s/g, '');
}
