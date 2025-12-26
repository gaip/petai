import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getPatients() {
    try {
        const res = await fetch(`${API_URL}/api/pets`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch pets');
        return res.json();
    } catch {
        // Fallback static data if backend is unreachable
        return [
            { id: 1, name: "Max", breed: "Golden Retriever", age: 7, risk: "High", lastVisit: "2 months ago" },
            { id: 2, name: "Charlie", breed: "Labrador", age: 5, risk: "Medium", lastVisit: "6 months ago" },
        ];
    }
}

interface Patient {
    id: number;
    name: string;
    breed: string;
    age: number;
    risk: string;
    health_score: number;
    lastVisit: string;
}

export default async function VetPortal() {
    const patients: Patient[] = await getPatients();

    const getRiskColor = (risk: string) => {
        if (risk === "High") return "#ef4444";
        if (risk === "Medium") return "#eab308";
        return "#22c55e"; // Green
    };

    return (
        <div className="container vet-container">
            <h1 className="text-gradient page-title">Pet Portal</h1>
            <p className="page-desc page-desc-mb">Manage all your registered pets and their centralized health records.</p>

            {/* Mobile Card View */}
            <div className="mobile-cards">
                {patients.map((patient: Patient) => (
                    <div key={patient.id} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '1.2rem' }}>{patient.name}</div>
                                <div style={{ fontSize: '0.9rem', color: 'gray' }}>{patient.breed}, {patient.age}y</div>
                            </div>
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
                        </div>

                        <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                            {patient.risk !== 'Low' && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#fbbf24' }}>
                                    <span>⚠️</span>
                                    <span>Abnormal vitals detected</span>
                                </div>
                            )}
                            {patient.risk === 'Low' && <span style={{ color: 'gray' }}>Vitals Stable</span>}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'gray' }}>Last: {patient.lastVisit}</div>
                            <Link href={`/dashboard?pet=${patient.name}`} style={{
                                display: 'inline-block',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '0.9rem'
                            }}>
                                View Profile
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="glass-panel desktop-table" style={{ overflowX: 'auto' }}>
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
                        {patients.map((patient: Patient) => (
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
                                <td style={{ padding: '1.5rem' }}>
                                    <Link href={`/dashboard?pet=${patient.name}`} style={{
                                        display: 'inline-block',
                                        background: 'transparent',
                                        border: '1px solid var(--text-muted)',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem'
                                    }}>
                                        View Profile
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
