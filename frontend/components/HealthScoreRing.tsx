"use client";

interface HealthScoreProps {
    score: number; // 0-10
    trend?: 'up' | 'down' | 'stable';
}

export default function HealthScoreRing({ score, trend }: HealthScoreProps) {
    const radius = 60;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 10) * circumference;

    // Color based on score
    let color = 'var(--color-primary)';
    if (score < 5) color = '#ef4444'; // Red
    else if (score < 8) color = '#eab308'; // Yellow

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    <circle
                        stroke="var(--bg-card)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke={color}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/10</div>
                </div>
            </div>
            {trend && (
                <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                    Health Score
                </div>
            )}
        </div>
    );
}
