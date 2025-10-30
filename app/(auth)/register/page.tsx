"use client";
import { useRedirectIfLoggedIn } from '@/app/hook/useAuth';

export default function RegisterPage() {
  useRedirectIfLoggedIn();

  return (
    <div>
      <h1>Register Page</h1>
    </div>
  );
}
