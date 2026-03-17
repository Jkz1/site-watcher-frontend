// app/dashboard/page.tsx
import Dashboard from './dashboard';
import { getAuthCookie } from '../actions/auth';
import { getSite } from '../actions/site';



export default async function DashboardPage() {
    const initialData = await getSite();
    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">My Items</h1>
            {/* Pass the server data to the Client Component */}
            <Dashboard initialData={initialData? initialData : [] } getSiteFunction={getSite} />
        </main>
    );
}