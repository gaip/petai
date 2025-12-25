export default function AlertCard({ title, message, severity, audioUrl }: { title: string, message: string, severity: 'high' | 'medium' | 'low', audioUrl?: string }) {
    let borderColor = 'var(--border-light)';
    let icon = 'ℹ️';

    if (severity === 'high') {
        borderColor = '#ef4444';
        icon = '🚨';
    } else if (severity === 'medium') {
        borderColor = '#eab308';
        icon = '⚠️';
    }

    return (
        <div className="glass-panel" style={{
            padding: '1.5rem',
            borderLeft: `4px solid ${borderColor}`,
            marginBottom: '1rem'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <div style={{ fontSize: '1.5rem' }}>{icon}</div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, marginBottom: '0.5rem', color: 'white' }}>{title}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{message}</p>
                </div>
            </div>
            {audioUrl && (
                <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Answer from Max:</div>
                    <audio controls src={audioUrl} style={{ width: '100%', height: '30px', opacity: 0.8 }} />
                </div>
            )}
        </div>
    );
}
