"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AIAssistant() {
    const pathname = usePathname();
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Context-aware "AI" messages
        switch (pathname) {
            case '/':
                setMessage("👋 Hi! I'm your PetTwin AI Agent. I connect to your pet's smart collar data (Kafka) and analyze video feeds (Vision) to predict health issues. Click 'Start Digital Twin' to see me in action!");
                break;
            case '/login':
                setMessage("🔒 Secure Login: I'll retrieve your encrypted pet records from the database. Don't worry, I'm just a demo, so you can click 'Continue with Google' to skip Auth.");
                break;
            case '/dashboard':
                setMessage("📊 Analysis Complete! I've correlated 7 days of sensor data with **Datadog** real-time metrics. My Anomaly Detection model flagged a gait irregularity yesterday.");
                break;
            case '/vet':
                setMessage("🏥 Vet Portal: I use **Datadog** to monitor population health trends. I've flagged high-risk patients (like Max) so vets can prioritize care based on real-time telemetry.");
                break;
            case '/add-pet':
                setMessage("📹 Vision Analysis: Upload a video here! I'll break it down frame-by-frame to establish a baseline for your pet's movement.");
                break;
            default:
                setMessage("🤖 I'm active and monitoring for anomalies...");
        }
        setIsVisible(true);
    }, [pathname]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            maxWidth: '350px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)',
            zIndex: 9999,
            backdropFilter: 'blur(10px)',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <div style={{ fontSize: '2rem' }}>🤖</div>
                <div>
                    <h4 style={{ marginBottom: '0.5rem', color: '#38bdf8', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>PetTwin AI Agent</h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#e2e8f0', marginBottom: '0' }}>
                        {message}
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'gray',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        padding: 0
                    }}
                >×</button>
            </div>
        </div>
    );
}
