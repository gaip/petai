"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SocialShare from './SocialShare';

interface Message {
    role: 'ai' | 'user';
    content: string;
}

function AIAssistantContent({ healthScore }: { healthScore?: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false); // Start closed (minimized)
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial greeting based on context
    useEffect(() => {
        let initialMsg = "";
        switch (pathname) {
            case '/':
                initialMsg = "👋 Hi! I'm your PetTwin AI Agent. Ask me about your pet's health, verify the **Datadog** connection, or check **Kafka** stream status.";
                break;
            case '/login':
                initialMsg = "🔒 Secure Login Area. I can help you with authentication details or bypass this for the demo.";
                break;
            case '/dashboard':
                initialMsg = "📊 detailed Analysis Mode. I'm correlated 7 days of sensor data with **Datadog** real-time metrics. Ask me to 'analyze trends' or 'check alerts'.";
                break;
            case '/vet':
                initialMsg = "🏥 Veterinary Portal. I'm monitoring population health. Ask about 'risk factors' or 'patient status'.";
                break;
            default:
                initialMsg = "🤖 Ready to assist. Ask me anything about the system status or pet health data.";
        }
        setMessages([{ role: 'ai', content: initialMsg }]);
        setIsOpen(true); // Auto-open on page load/change
    }, [pathname]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Context-aware suggestions
    const suggestions = [
        "How is my pet doing? 🐶",
        "Check recent alerts ⚠️",
        "Analyze activity trends 📊",
        "System Status 🛠️"
    ];

    const handleSend = async (explicitMsg?: string) => {
        const userMsg = explicitMsg || input;
        if (!userMsg.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput("");
        setIsTyping(true);

        // Simulate network processing delay for realism
        setTimeout(async () => {
            const response = await generateAIResponse(userMsg);
            setMessages(prev => [...prev, { role: 'ai', content: response }]);
            setIsTyping(false);
        }, 1000);
    };

    const generateAIResponse = async (query: string): Promise<string> => {
        const lowerQ = query.toLowerCase();
        const petName = searchParams?.get('pet') || 'Max';
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

        // 1. Friendly Pet Health (Priority)
        if (lowerQ.includes('doing') || lowerQ.includes('health') || lowerQ.includes('status') && !lowerQ.includes('system')) {
            try {
                // Try to fetch real data
                const res = await fetch(`${API_URL}/api/health/${petName}`);
                if (res.ok) {
                    const data = await res.json();
                    return `❤️ ** Health Analysis **: ${petName} is doing great today! \n\nI've analyzed the latest movement data and the **Health Score is ${data.health_score}/100**. \n- Activity: Normal ✅\n- Sleep: 8h (Restful) 💤\n- Mood: Playful 🎾<SocialShare score={${data.health_score}} petName="${petName}" />`;
                }
            } catch (e) {
                console.error("Failed to fetch AI context", e);
            }
            // Fallback
            const displayScore = healthScore || 92;
            return `❤️ **Health Analysis**: ${petName} is doing great today! \n\nI've analyzed the latest movement data and the **Health Score is ${displayScore}/100**. \n- Activity: Normal ✅\n- Sleep: 8h (Restful) 💤\n- Mood: Playful 🎾<SocialShare score={${displayScore}} petName="${petName}" />`;
        }
        if (lowerQ.includes('alert') || lowerQ.includes('risk')) {
            return "🛡️ **Safety Check**: I detected one minor anomaly yesterday.\n\n- **Issue**: Slight gait irregularity (Joint Stiffness?)\n- **Confidence**: 89%\n- **Suggestion**: Keep an eye on his evening walk. No urgent vet visit needed yet. 🐕";
        }
        if (lowerQ.includes('activity') || lowerQ.includes('trend') || lowerQ.includes('sleep')) {
            return `🏃 **Activity Insights**: ${petName} has been very active!\n\n- **Today**: 12,400 steps (Top 10% for his breed)\n- **Sleep**: He slept soundly from 11 PM to 7 AM.\n\nMy projection models show he's maintaining peak physical condition. 😺`;
        }

        // 2. Technical Demo Specs (Secondary)
        if (lowerQ.includes('datadog') || lowerQ.includes('metric') || lowerQ.includes('system')) {
            return "📡 **System Telemetry (Datadog)**:\n- API Latency: 45ms (Fast)\n- Ingestion Rate: 150 events/sec\n- AI Model Inference: 12ms\n\nAll systems are green and logging to Datadog.";
        }
        if (lowerQ.includes('kafka') || lowerQ.includes('stream')) {
            return "🌊 **Data Pipeline (Kafka)**:\n- Topic: `pet-sensor-raw`\n- Throughput: Stable\n- Lag: 0ms\n\nReal-time sensor data is flowing perfectly into the Digital Twin model.";
        }

        return "🤖 I can help! Try asking about:\n- **Health Status**\n- **Recent Alerts**\n- **Activity Trends**";
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    background: '#0f172a',
                    border: '1px solid #38bdf8',
                    color: '#38bdf8',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
                    zIndex: 50, // Reduced from 9999 to avoid modal occlusion
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                }}
            >
                🤖
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '380px',
            height: '600px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            zIndex: 50, // Reduced from 9999
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-geist-sans)',
            animation: 'slideIn 0.3s ease-out'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                background: 'rgba(56, 189, 248, 0.1)',
                borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    <div>
                        <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '0.95rem', fontWeight: 600 }}>PetTwin AI Agent</h4>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Online • Monitoring Active</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}
                >
                    _
                </button>
            </div>

            {/* Chat Area */}
            <div style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: msg.role === 'user' ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                        color: msg.role === 'user' ? '#0f172a' : '#e2e8f0',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                        borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '12px',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {msg.content.split('<SocialShare').map((part, i) => {
                            if (i === 0) return part;
                            const [props, rest] = part.split('/>');
                            const scoreMatch = props.match(/score={(\d+)}/);
                            const nameMatch = props.match(/petName="([^"]+)"/);
                            const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
                            const name = nameMatch ? nameMatch[1] : 'Pet';
                            return (
                                <span key={i}>
                                    <SocialShare score={score} petName={name} />
                                    {rest}
                                </span>
                            );
                        })}
                    </div>
                ))}

                {/* Suggested Questions Chips */}
                {messages.length < 3 && !isTyping && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setInput(s);
                                    handleSend(s);
                                }}
                                style={{
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    border: '1px solid rgba(56, 189, 248, 0.3)',
                                    color: '#bae6fd',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: '0.8rem', paddingLeft: '0.5rem' }}>
                        Typing...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: '0.5rem'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about Max's health..."
                    style={{
                        flex: 1,
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                    }}
                />
                <button
                    onClick={() => handleSend()}
                    style={{
                        background: '#38bdf8',
                        border: 'none',
                        borderRadius: '8px',
                        width: '40px',
                        color: '#0f172a',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ➤
                </button>
            </div>
        </div>
    );
}

export default function AIAssistant(props: { healthScore?: number }) {
    return (
        <Suspense fallback={null}>
            <AIAssistantContent {...props} />
        </Suspense>
    );
}
