import LiveDashboard from "@/components/dashboard/LiveDashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getPetData(petId: string) {
    try {
        const res = await fetch(`${API_URL}/api/health/${petId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
    } catch {
        return {
            pet_id: petId,
            health_score: 92,
            history: [],
            alerts: []
        };
    }
}

export default async function Dashboard(props: { searchParams: Promise<{ pet?: string }> }) {
    const params = await props.searchParams;
    const petName = params.pet || 'Max';
    const initialData = await getPetData(petName);

    return <LiveDashboard initialData={initialData} />;
}
