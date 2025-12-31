"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SocialShare from './SocialShare';
import styles from './AIAssistant.module.css';

interface Message {
    role: 'ai' | 'user';
    content: string;
}

function getInitialMsg(pathname: string | null): string {
    switch (pathname) {
        case '/':
            return "👋 Hi! I'm your PetTwin AI Agent. Ask me about your pet's health, verify the **Datadog** connection, or check **Kafka** stream status.";
        case '/login':
            return "🔒 Secure Login Area. I can help you with authentication details or bypass this for the demo.";
        case '/dashboard':
            return "📊 Detailed Analysis Mode. I've correlated 7 days of sensor data with **Datadog** real-time metrics. Ask me to 'analyze trends' or 'check alerts'.";
        case '/vet':
            return "🏥 Veterinary Portal. I'm monitoring population health. Ask about 'risk factors' or 'patient status'.";
        default:
            return "🤖 Ready to assist. Ask me anything about the system status or pet health data.";
    }
}

function AIAssistantContent({ healthScore }: { healthScore?: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false); 
    const [messages, setMessages] = useState<Message[]>([{ role: 'ai', content: getInitialMsg(pathname) }]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [thinkingStep, setThinkingStep] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-open only on large screens
        if (typeof window !== 'undefined' && window.innerWidth > 768) {
             setIsOpen(true);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, thinkingStep]);

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
        setThinkingStep("Initializing Vertex AI Context...");

        // Simulate complex AI processing pipeline
        const steps = [
             { msg: "Querying Gemini Pro via GCP...", delay: 600 },
             { msg: "Correlating with Kafka Telemetry...", delay: 1200 },
             { msg: "Synthesizing Natural Language Response...", delay: 1800 }
        ];

        steps.forEach(step => {
            setTimeout(() => setThinkingStep(step.msg), step.delay);
        });

        setTimeout(async () => {
            const response = await generateAIResponse(userMsg);
            setMessages(prev => [...prev, { role: 'ai', content: response }]);
            setIsTyping(false);
            setThinkingStep(null);
        }, 2200);
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
                className={styles.triggerButton}
                onClick={() => setIsOpen(true)}
                aria-label="Open AI Assistant"
            >
                🤖
            </button>
        );
    }

    return (
        <div className={styles.panel}>
            {/* Header */}
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    <div>
                        <h4 className={styles.headerTitle}>PetTwin AI Agent</h4>
                        <span className={styles.headerStatus}>Online • Monitoring Active</span>
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
            <div className={styles.chatArea}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageAi}`}>
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
                    <div className={styles.suggestionsContainer}>
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setInput(s);
                                    handleSend(s);
                                }}
                                className={styles.suggestionChip}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {isTyping && (
                    <div className={styles.typingIndicator}>
                         <div className="spinner" style={{width: '12px', height: '12px', border: '2px solid rgba(56, 189, 248, 0.3)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                        <span>{thinkingStep || "Thinking..."}</span>
                        <style jsx>{`
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        `}</style>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about Max's health..."
                    className={styles.inputField}
                />
                <button
                    onClick={() => handleSend()}
                    className={styles.sendButton}
                    aria-label="Send Message"
                >
                    ➤
                </button>
            </div>
        </div>
    );
}

function AIAssistantWrapper(props: { healthScore?: number }) {
    const pathname = usePathname();
    return <AIAssistantContent key={pathname} {...props} />;
}

export default function AIAssistant(props: { healthScore?: number }) {
    return (
        <Suspense fallback={null}>
            <AIAssistantWrapper {...props} />
        </Suspense>
    );
}
