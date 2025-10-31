import { NextResponse } from 'next/server';
import { authenticateUser } from './service';
import { generateToken } from './utils';
import { LoginCredentialsSchema } from './types';
import { handleError } from './utils';

export async function loginController(request: Request): Promise<NextResponse> {
  try {
    const credentials = await request.json();
    const validatedCredentials = LoginCredentialsSchema.safeParse(credentials);

    if (!validatedCredentials.success) {
      return NextResponse.json(
        { error: 'Email ou mot de passe invalide' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(validatedCredentials.data);
    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    const token = generateToken(user.id);
    return NextResponse.json({ token });

  } catch (err) {
    const { message, status } = handleError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
