export default function ArchitectureDiagram() {
    return (
        <div className="architecture-diagram animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Google Cloud AI Pipeline</h3>

            <div className="diagram-container">
                {/* Step 1: Ingest */}
                <div className="diagram-step">
                    <div className="diagram-icon">📡</div>
                    <div className="diagram-label">IoT Sensors</div>
                    <div className="diagram-sub">Smart Collars / Cams</div>
                </div>

                <div className="diagram-arrow">→</div>

                {/* Step 2: Stream */}
                <div className="diagram-step p-highlight">
                    <div className="diagram-badge">Pub/Sub</div>
                    <div className="diagram-icon">🌊</div>
                    <div className="diagram-label">Data Stream</div>
                    <div className="diagram-sub">Real-time Ingestion</div>
                </div>

                <div className="diagram-arrow">→</div>

                {/* Step 3: Process */}
                <div className="diagram-step p-google">
                    <div className="diagram-badge">Vertex AI</div>
                    <div className="diagram-icon">🧠</div>
                    <div className="diagram-label">Inference Engine</div>
                    <div className="diagram-sub">AutoML & Gemini Pro</div>
                </div>

                <div className="diagram-arrow">→</div>

                {/* Step 4: Act */}
                <div className="diagram-step">
                    <div className="diagram-icon">📱</div>
                    <div className="diagram-label">PetTwin App</div>
                    <div className="diagram-sub">Real-time Alerts</div>
                </div>
            </div>

            <style jsx>{`
                .architecture-diagram {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 2rem;
                    margin: 3rem 0;
                }
                .diagram-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .diagram-step {
                    flex: 1;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(56, 189, 248, 0.2);
                    padding: 1.5rem;
                    border-radius: 16px;
                    text-align: center;
                    position: relative;
                    min-width: 140px;
                    transition: transform 0.3s;
                }
                .diagram-step:hover {
                    transform: translateY(-5px);
                    border-color: #38bdf8;
                }
                .diagram-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                .diagram-label {
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: white;
                }
                .diagram-sub {
                    font-size: 0.8rem;
                    color: #94a3b8;
                }
                .diagram-arrow {
                    font-size: 1.5rem;
                    color: #38bdf8;
                    font-weight: bold;
                }
                .diagram-badge {
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #38bdf8;
                    color: #0f172a;
                    font-size: 0.7rem;
                    padding: 0.2rem 0.6rem;
                    border-radius: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .p-google .diagram-badge {
                    background: linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335);
                    color: white;
                }
                
                @media (max-width: 768px) {
                    .diagram-container {
                        flex-direction: column;
                    }
                    .diagram-arrow {
                        transform: rotate(90deg);
                    }
                }
            `}</style>
        </div>
    );
}
