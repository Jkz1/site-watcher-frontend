// app/actions/auth.ts
"use server"; // This is the magic part

import { cookies } from 'next/headers';

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('token', token, { 
    path: '/', 
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict' 
  });
}
export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}