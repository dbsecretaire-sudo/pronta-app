// app/api/debug-token/route.ts
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cookies } from "next/headers";

export async function GET() {
  const req = {
    cookies: Object.fromEntries(
      (await cookies()).getAll().map((cookie) => [cookie.name, cookie.value])
    ),
    headers: new Headers(),
  } as any;

  const token = await getToken({ req, secret: authOptions.secret });
  return Response.json({ token, cookies: req.cookies });
}
