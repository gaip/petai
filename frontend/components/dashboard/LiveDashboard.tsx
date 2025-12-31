"use client";

import React, { useState, useEffect } from 'react';
import HealthScoreRing from "@/components/HealthScoreRing";
import TrendChart from "@/components/TrendChart";
import AlertCard from "@/components/AlertCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function LiveDashboard({ initialData }: { initialData: any }) {
    const [data, setData] = useState(initialData);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Poll for real-time updates every 2 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${API_URL}/api/health/${data.pet_id || 'Max'}`);
                if (res.ok) {
                    const newData = await res.json();
                    setData(newData);
                    setLastUpdated(new Date());
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [data.pet_id]);

    const { pet_id, health_score, history, alerts, breed, age } = data;

    // Transform history for chart
    const activityData = history?.map((h: any) => h.activity) || [];
    const labels = history?.map((h: any) => h.day) || [];
    const trend = activityData.length >= 2 && activityData[activityData.length - 1] < activityData[activityData.length - 2] ? 'down' : 'stable';

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{pet_id}&apos;s Dashboard</h1>
                    <p style={{ marginBottom: 0 }}>
                        {breed || 'Unknown'} • {age || 0} Years Old
                        <span style={{ fontSize: '0.8rem', marginLeft: '1rem', color: '#666' }}>
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    </p>
                </div>
                {alerts && alerts.length > 0 && (
                    <div className="glass-panel animate-pulse" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #ef4444' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444' }}>Live Anomaly Detected</span>
                    </div>
                )}
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Left Column: Alerts & Score */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {alerts && alerts.map((alert: any, i: number) => (
                        <AlertCard
                            key={i}
                            title={alert.alert_title || alert.title}
                            severity={alert.severity_level || alert.severity}
                            explanation={alert.medical_explanation || alert.message}
                            action={alert.recommended_action}
                            audioUrl={alert.audio}
                            source="Vertex AI Gemini 1.5"
                        />
                    ))}

                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ marginBottom: '2rem' }}>Real-Time Health Score</h3>
                        <HealthScoreRing score={health_score} trend={trend} />
                        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                            AI Multi-Factor Analysis correlating sensor streams in real-time.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <a href="#" className="glass-panel" style={{ display: 'inline-block', padding: '1rem 2rem', textDecoration: 'none', color: 'white' }}>
                        View Pet Portal →
                    </a>
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
                            {history && history.map((h: any, i: number) => (
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

                     {/* Pet Gallery Section */}
                    <div style={{ marginTop: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Moments 📸</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} style={{
                                    aspectRatio: '1',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border-light)',
                                }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://cataas.com/cat?width=200&height=200&_t=${i}`}
                                        alt="Pet moment"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
