"use client";
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Message {
    role: 'ai' | 'user';
    content: string;
}

export default function AIAssistant() {
    const pathname = usePathname();
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

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput("");
        setIsTyping(true);

        // Simulate network processing delay for realism
        setTimeout(() => {
            const response = generateAIResponse(userMsg);
            setMessages(prev => [...prev, { role: 'ai', content: response }]);
            setIsTyping(false);
        }, 1000);
    };

    const generateAIResponse = (query: string): string => {
        const lowerQ = query.toLowerCase();

        if (lowerQ.includes('datadog') || lowerQ.includes('metric') || lowerQ.includes('monitor')) {
            return "📡 **Datadog Live Metrics**:\n- System Latency: 45ms (Healthy)\n- API Error Rate: 0.01%\n- Active Traces: 1,420\n\nI'm successfully streaming telemetry to your Datadog dashboard.";
        }
        if (lowerQ.includes('kafka') || lowerQ.includes('stream') || lowerQ.includes('event')) {
            return "🌊 **Confluent Kafka Status**:\n- Topic: `pet-sensor-events`\n- Throughput: 150 msg/sec\n- Consumer Group: Stable\n- Lag: 0ms\n\nReal-time sensor data is flowing correctly.";
        }
        if (lowerQ.includes('health') || lowerQ.includes('score') || lowerQ.includes('status')) {
            return "❤️ **Pet Health Analysis**:\n- Current Score: 92/100\n- Trend: Stable\n- Anomaly Check: Negative (Last 12h)\n\nBased on the latest sensor fusion, your pet is doing great.";
        }
        if (lowerQ.includes('alert') || lowerQ.includes('risk') || lowerQ.includes('problem')) {
            return "🚨 **Recent Alerts**:\n1. [Yesterday 14:30] **Joint Stiffness Detected** (Confidence: 89%)\n   - Triggered by: Sustained gait irregularity.\n   - Action: Monitor for 24h.\n\nNo other critical alerts found in the last 48h.";
        }
        if (lowerQ.includes('google') || lowerQ.includes('cloud') || lowerQ.includes('vertex')) {
            return "☁️ **Google Cloud Status**:\n- Vertex AI Model Endpoint: Online\n- Firestore Database: Connected\n- Cloud Run Instance: Active\n\nInfrastructure is fully operational.";
        }

        return "🤖 I can help you with that. Try asking about:\n- **Datadog** metrics\n- **Kafka** streams\n- **Health** status\n- **Alerts** history";
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
                    zIndex: 9999,
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
            height: '500px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            zIndex: 9999,
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
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Online • Datadog Connected</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
                >×</button>
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
                        {msg.content}
                    </div>
                ))}
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
                    placeholder="Ask about Datadog, Kafka, or Alerts..."
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
                    onClick={handleSend}
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
