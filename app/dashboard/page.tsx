// app/dashboard/page.tsx
import Dashboard from './dashboard';
import { getAuthCookie } from '../actions/auth';

const baseurl = process.env.NEXT_PUBLIC_BASE_URL
async function getData() {
    const token = await getAuthCookie();
    const res = await fetch(`${baseurl}/sites`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

export default async function DashboardPage() {
    const initialData = await getData();
    console.log(initialData);
    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">My Items</h1>
            {/* Pass the server data to the Client Component */}
            <Dashboard initialData={initialData? initialData : []} />
        </main>
    );
}