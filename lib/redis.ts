import 'server-only';
// Redis REST works in both serverless and long-lived Next.js Node deployments.
export async function redis<T>(...command: (string | number)[]): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Cache unavailable');
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
    signal: AbortSignal.timeout(750),
  });
  if (!response.ok) throw new Error('Cache unavailable');
  const body = (await response.json()) as { result: T; error?: string };
  if (body.error) throw new Error('Cache unavailable');
  return body.result;
}
