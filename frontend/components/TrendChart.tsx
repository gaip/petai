"use client";

interface TrendChartProps {
    data: number[]; // Array of values
    labels: string[]; // Array of labels (e.g., days)
    color?: string;
}

export default function TrendChart({ data, labels, color = '#2dd4bf' }: TrendChartProps) {
    const height = 150;
    const width = 300;
    const padding = 20;

    const max = Math.max(...data);
    const min = Math.min(...data);

    // Calculate points
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - ((val - min) / (max - min || 1)) * (height - padding * 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Line */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Points */}
                {data.map((val, i) => {
                    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                    const y = height - padding - ((val - min) / (max - min || 1)) * (height - padding * 2);
                    return (
                        <circle key={i} cx={x} cy={y} r="4" fill={color} />
                    );
                })}

                {/* Simple Labels */}
                {labels.map((label, i) => {
                    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                    return (
                        <text key={i} x={x} y={height - 5} fontSize="10" fill="gray" textAnchor="middle">{label}</text>
                    )
                })}
            </svg>
        </div>
    );
}
