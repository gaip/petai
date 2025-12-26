import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getPatients() {
    try {
        const res = await fetch(`${API_URL}/api/pets`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch pets');
        return res.json();
    } catch (error) {
        // Fallback static data if backend is unreachable
        return [
            { id: 1, name: "Max", breed: "Golden Retriever", age: 7, risk: "High", lastVisit: "2 months ago" },
            { id: 2, name: "Charlie", breed: "Labrador", age: 5, risk: "Medium", lastVisit: "6 months ago" },
        ];
    }
}

export default async function VetPortal() {
    const patients = await getPatients();

    const getRiskColor = (risk: string) => {
        if (risk === "High") return "#ef4444";
        if (risk === "Medium") return "#eab308";
        return "#22c55e"; // Green
    };

    return (
        <div className="container" style={{ paddingTop: '6rem' }}>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Pet Portal</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Manage all your registered pets and their centralized health records.</p>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '1.5rem' }}>Patient</th>
                            <th style={{ padding: '1.5rem' }}>Risk Level</th>
                            <th style={{ padding: '1.5rem' }}>AI Insight</th>
                            <th style={{ padding: '1.5rem' }}>Last Visit</th>
                            <th style={{ padding: '1.5rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(patient => (
                            <tr key={patient.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '1.5rem' }}>
                                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{patient.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'gray' }}>{patient.breed}, {patient.age}y</div>
                                </td>
                                <td style={{ padding: '1.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '99px',
                                        backgroundColor: `${getRiskColor(patient.risk)}20`,
                                        color: getRiskColor(patient.risk),
                                        fontWeight: 600,
                                        border: `1px solid ${getRiskColor(patient.risk)}40`
                                    }}>
                                        {patient.risk}
                                    </span>
                                </td>
                                <td style={{ padding: '1.5rem', maxWidth: '300px' }}>
                                    {patient.risk !== 'Low' && (
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span>⚠️</span>
                                            <span>Abnormal vitals detected</span>
                                        </div>
                                    )}
                                    {patient.risk === 'Low' && <span style={{ color: 'gray' }}>Stable</span>}
                                </td>
                                <td style={{ padding: '1.5rem', color: 'gray' }}>{patient.lastVisit}</td>
                                <Link href={`/dashboard?pet=${patient.name}`}>
                                    <button style={{
                                        background: 'transparent',
                                        border: '1px solid var(--text-muted)',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}>
                                        View Profile
                                    </button>
                                </Link>
                            </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
        </div >
    );
}
