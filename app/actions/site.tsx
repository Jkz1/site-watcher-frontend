// app/actions/auth.ts
"use server";
import { getAuthCookie } from "./auth";

const baseurl = process.env.NEXT_PUBLIC_BASE_URL
// This is the magic part

export async function updateSiteStatus(SiteId: number, IsActive: boolean) {
    try {
        const token = await getAuthCookie();
        const resp = await fetch(`${baseurl}/sites/activated`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ is_active: IsActive, site_id: SiteId })
        });
        return resp.ok;
    } catch (error) {
        return error;
    }

}

export async function getSite() {
    const token = await getAuthCookie();
    const res = await fetch(`${baseurl}/sites`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}
// import { cookies } from 'next/headers';

// export async function setAuthCookie(token: string) {
//   const cookieStore = await cookies();
//   cookieStore.set('token', token, {
//     path: '/',
//     httpOnly: true,
//     secure: true,
//     sameSite: 'strict'
//   });
// }
// export async function getAuthCookie() {
//   const cookieStore = await cookies();
//   return cookieStore.get('token')?.value;
// }

// export async function clearAuthCookie() {
//   const cookieStore = await cookies();
//   cookieStore.delete('token');
// }