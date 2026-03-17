// app/dashboard/page.tsx
import Dashboard from './dashboard';
import { getAuthCookie } from '../actions/auth';
import { getSite } from '../actions/site';



export default async function DashboardPage() {
    const initialData = await getSite();
    return (
        <main className="">
            {/* Pass the server data to the Client Component */}
            <Dashboard initialData={initialData? initialData : [] } getSiteFunction={getSite} />
        </main>
    );
}