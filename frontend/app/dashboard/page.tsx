import HealthScoreRing from "@/components/HealthScoreRing";
import TrendChart from "@/components/TrendChart";
import AlertCard from "@/components/AlertCard";

async function getData() {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/health/Max', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
    } catch (e) {
        console.error(e);
        // Fallback data for build/offline
        return {
            pet_id: "Max",
            health_score: 7.2,
            history: [],
            alerts: [{ title: "Connection Error", message: "Could not connect to backend.", severity: "medium" }]
        };
    }
}

export default async function Dashboard() {
    const data = await getData();
    const { pet_id, health_score, history, alerts } = data;

    // Transform history for chart
    const activityData = history.map((h: any) => h.activity);
    const labels = history.map((h: any) => h.day);

    // Check trend from history (simple diff)
    const trend = activityData.length >= 2 && activityData[activityData.length - 1] < activityData[activityData.length - 2] ? 'down' : 'stable';

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{pet_id}'s Dashboard</h1>
                    <p style={{ marginBottom: 0 }}>Golden Retriever • 7 Years Old</p>
                </div>
                {alerts.length > 0 && (
                    <div className="glass-panel" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Anomaly Detected</span>
                    </div>
                )}
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Left Column: Alerts & Score */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {alerts.map((alert: any, i: number) => (
                        <AlertCard
                            key={i}
                            title={alert.title}
                            message={alert.message}
                            severity={alert.severity}
                            audioUrl={alert.audio}
                        />
                    ))}

                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ marginBottom: '2rem' }}>Current Health Score</h3>
                        <HealthScoreRing score={health_score} trend={trend} />
                        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                            Real-time analysis based on {history.length} days of data.
                        </p>
                    </div>
                </div>

                {/* Right Column: Charts */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3>Activity Trend (7 Days)</h3>
                    <div style={{ marginBottom: '2rem' }}>
                        {activityData.length > 0 ? (
                            <TrendChart data={activityData} labels={labels} />
                        ) : <p>No data available</p>}
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <h3>Sleep Quality</h3>
                        <div style={{ height: '100px', display: 'flex', alignItems: 'end', gap: '10px' }}>
                            {history.map((h: any, i: number) => (
                                <div key={i} style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.1)',
                                    height: `${(h.sleep / 15) * 100}%`,
                                    borderRadius: '4px',
                                    position: 'relative'
                                }}>
                                    <span style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'gray' }}>{h.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
