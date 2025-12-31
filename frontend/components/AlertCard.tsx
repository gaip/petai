import React from 'react';

interface AlertProps {
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  explanation?: string;
  action?: string;
  audioUrl?: string;
  source?: string;
}

export default function AlertCard({ 
  title, 
  severity, 
  explanation, 
  action, 
  audioUrl,
  source = "Vertex AI Gemini 1.5"
}: AlertProps) {
    let borderColor = 'var(--border-light)';
    let bgColor = 'rgba(255, 255, 255, 0.05)';
    let icon = 'ℹ️';

    // Map Backend Severity to UI Colors
    const normalizedSeverity = severity.toUpperCase();

    if (normalizedSeverity === 'CRITICAL' || normalizedSeverity === 'HIGH') {
        borderColor = '#ef4444'; // Red
        bgColor = 'rgba(239, 68, 68, 0.1)';
        icon = '🚨';
    } else if (normalizedSeverity === 'MEDIUM') {
        borderColor = '#eab308'; // Yellow
        bgColor = 'rgba(234, 179, 8, 0.1)';
        icon = '⚠️';
    }

    return (
        <div className="glass-panel" style={{
            padding: '1.5rem',
            borderLeft: `4px solid ${borderColor}`,
            background: `linear-gradient(90deg, ${bgColor} 0%, rgba(0,0,0,0) 100%)`,
            marginBottom: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <div style={{ fontSize: '1.8rem', marginTop: '-5px' }}>{icon}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: 'white' }}>{title}</h3>
                        <span style={{ 
                            fontSize: '0.6rem', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1px',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                           ✨ {source}
                        </span>
                    </div>

                    {explanation && (
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#e5e5e5', marginBottom: '0.75rem' }}>
                            {explanation}
                        </p>
                    )}
                    
                    {action && (
                        <div style={{ 
                            background: 'rgba(0,0,0,0.2)', 
                            padding: '0.75rem', 
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            gap: '0.5rem'
                         }}>
                            <span>👉</span>
                            <span style={{ fontWeight: '500', color: '#60a5fa' }}>{action}</span>
                        </div>
                    )}
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
