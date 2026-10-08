/**
 * Adresse IP du client, pour la limitation de débit.
 * Derrière un hébergeur, la première adresse de `x-forwarded-for` est celle du client.
 * Renvoie null si aucune adresse fiable n'est disponible : mieux vaut ne pas limiter par IP
 * que de bloquer tous les utilisateurs derrière une même valeur par défaut.
 */
export function clientIpFromHeaders(headers: { get(name: string): string | null }): string | null {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first && /^[0-9a-fA-F:.]{3,45}$/.test(first)) return first;

  const real = headers.get("x-real-ip")?.trim();
  if (real && /^[0-9a-fA-F:.]{3,45}$/.test(real)) return real;

  return null;
}
