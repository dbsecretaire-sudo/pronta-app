// utils/auth.ts
import { decode, JWT } from 'next-auth/jwt';

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map(c => {
      const [key, ...rest] = c.trim().split('=');
      return [key, decodeURIComponent(rest.join('='))];
    })
  );
}

export async function getSessionToken(req: Request): Promise<JWT | null> {
  try {
    const cookies = parseCookies(req.headers.get('cookie'));
    const sessionToken = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];

    if (!sessionToken) {
      return null;
    }

    const decoded = await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET!,
    });
    return decoded;
  } catch (error) {
    return null;
  }
}