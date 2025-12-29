"use client";

import Link from "next/link";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="chip animate-fade-up" style={{ marginBottom: '1.5rem', animationDelay: '0.1s' }}>✨ Powered by Google Gemini & Vertex AI</div>
          <h1 className="hero-title text-gradient animate-fade-up" style={{ animationDelay: '0.2s' }}>
            The First AI Digital Twin <br /> For Your Pet&apos;s Health
          </h1>
          <p className="hero-description animate-fade-up" style={{ animationDelay: '0.3s' }}>
            PetTwin Care fuses <strong>real-time bio-data</strong>, <strong>vision AI analysis</strong>, and <strong>voice synthesis</strong> to give your pet a voice. Shift from reactive visits to predictive care.
          </p>

          <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/login" className="btn btn-primary" style={{
              padding: '0.75rem 2rem',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
              boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)',
              transition: 'all 0.3s ease',
              border: 'none'
            }}>Start Digital Twin</Link>
            <a href="https://github.com/gaip/petai" target="_blank" className="btn btn-secondary" style={{
              padding: '0.75rem 2rem',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease'
            }}>View on GitHub</a>
          </div>
        </div>
      </section>

      {/* Clinical Validation */}
      <section className="validation-section">
        <div className="container">
           <h2 className="section-title">Clinically Validated Performance</h2>
           <div className="metrics-grid">
              <div className="metric-card" style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.05))',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '16px',
                padding: '2rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                  {/* Circular Progress Ring */}
                  <svg width="120" height="120" style={{ margin: '0 auto 1rem', display: 'block' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50" fill="none" stroke="#38bdf8" strokeWidth="10"
                      strokeDasharray="314" strokeDashoffset="25"
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                    />
                    <text x="60" y="70" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white">92.0%</text>
                  </svg>
                  <span className="metric-label" style={{ display: 'block', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Detection Accuracy</span>
                  <p className="metric-desc" style={{ fontSize: '0.9rem', margin: 0 }}>Correctly identified 46/50 retrospectively analyzed cases.</p>
              </div>
              <div className="metric-card" style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.05))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                padding: '2rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                  {/* Timeline Indicator */}
                  <div style={{ margin: '0 auto 1rem', display: 'block', fontSize: '4rem', textAlign: 'center' }}>⏰</div>
                  <span className="metric-value" style={{ fontSize: '2.5rem', display: 'block', fontWeight: 'bold', background: 'linear-gradient(135deg, #10b981, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>7.6 Days</span>
                  <span className="metric-label" style={{ display: 'block', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', marginTop: '0.5rem' }}>Early Warning</span>
                  <p className="metric-desc" style={{ fontSize: '0.9rem', margin: 0 }}>Average lead time before symptoms were visible to owners.</p>
              </div>
              <div className="metric-card" style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '16px',
                padding: '2rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>
                  {/* Perfect Score Ring */}
                  <svg width="120" height="120" style={{ margin: '0 auto 1rem', display: 'block' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50" fill="none" stroke="#8b5cf6" strokeWidth="10"
                      strokeDasharray="314" strokeDashoffset="0"
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                    />
                    <text x="60" y="70" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white">100%</text>
                  </svg>
                  <span className="metric-label" style={{ display: 'block', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Severe Detection</span>
                  <p className="metric-desc" style={{ fontSize: '0.9rem', margin: 0 }}>Critical conditions caught earliest when intervention matters most.</p>
              </div>
           </div>
           <div style={{textAlign: 'center', marginTop: '3rem'}}>
              <a href="https://github.com/gaip/petai/blob/main/docs/VALIDATION_STUDY.md" target="_blank" className="btn btn-secondary" style={{ transition: 'all 0.3s ease' }}>View Validation Study</a>
           </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.5)' }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: '2rem' }}>See PetTwin AI in Action</h2>
          <div className="video-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)' }}>
              <video
                src="/demo.mp4"
                title="PetTwin AI Demo"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                loop
                muted
                controls
                playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Showcase */}
      <section className="features-section">
        <div className="container">
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1rem' }}>Built on Google Vertex AI</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            Enterprise-grade anomalies detection pipeline normally reserved for industrial IoT, now applied to your pet&apos;s health.
          </p>

          <div className="grid">
            <div className="card hover-scale">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👁️</div>
              <h3>Gemini Pro Vision</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Computer vision analysis using <strong>MobileNetV2</strong> architecture to detect subtle gait asymmetry and movement patterns invisible to human observation.
              </p>
            </div>
            <div className="card hover-scale">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
              <h3>Vertex AI AutoML</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Custom trained models for every breed. <strong>MobileNetV2</strong> architecture optimized for edge deployment on local home hubs.
              </p>
            </div>
            <div className="card hover-scale">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
              <h3>Cloud Dataflow</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Real-time stream processing of heart rate variation (HRV) and sleep quality data at scale.
              </p>
            </div>
          </div>

          <ArchitectureDiagram />

        </div>
      </section>

      {/* Technical Evidence - Enhanced */}
      <section className="evidence-section" style={{
        padding: '6rem 0',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 1))',
        position: 'relative'
      }}>
        {/* Background accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{textAlign: 'center', position: 'relative', zIndex: 1}}>
           <div style={{ marginBottom: '1rem' }}>
             <span style={{
               display: 'inline-block',
               padding: '0.5rem 1.5rem',
               background: 'rgba(56, 189, 248, 0.1)',
               border: '1px solid rgba(56, 189, 248, 0.3)',
               borderRadius: '20px',
               fontSize: '0.9rem',
               fontWeight: '600',
               color: '#38bdf8'
             }}>🏆 Hackathon Submission Evidence</span>
           </div>
           <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Technical Proof & Evidence</h2>
           <p style={{color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 3rem'}}>
             Complete documentation proving all technical claims with line-by-line code verification.
           </p>

           <div style={{
             display: 'grid',
             gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
             gap: '2rem',
             maxWidth: '1000px',
             margin: '0 auto'
           }}>
               <a href="https://github.com/gaip/petai/blob/main/docs/EVIDENCE.md" target="_blank" rel="noopener noreferrer" style={{
                 textDecoration: 'none',
                 background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.05))',
                 border: '2px solid rgba(56, 189, 248, 0.3)',
                 borderRadius: '16px',
                 padding: '2.5rem 2rem',
                 transition: 'all 0.3s ease',
                 position: 'relative',
                 overflow: 'hidden',
                 display: 'block'
               }} className="evidence-card-enhanced">
                 {/* Glow effect on hover */}
                 <div style={{
                   position: 'absolute',
                   top: '-50%',
                   left: '-50%',
                   width: '200%',
                   height: '200%',
                   background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
                   opacity: 0,
                   transition: 'opacity 0.3s ease'
                 }} />

                 <div style={{ position: 'relative', zIndex: 1 }}>
                   <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                   <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'white' }}>Evidence Checklist</h3>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                     Complete requirements verification (22/23 met, 95.7% compliance)
                   </p>
                   <div style={{ marginTop: '1.5rem', color: '#38bdf8', fontSize: '0.9rem', fontWeight: '600' }}>
                     View Document →
                   </div>
                 </div>
              </a>

               <a href="https://github.com/gaip/petai/blob/main/docs/TECHNICAL_PROOF.md" target="_blank" rel="noopener noreferrer" style={{
                 textDecoration: 'none',
                 background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.05))',
                 border: '2px solid rgba(16, 185, 129, 0.3)',
                 borderRadius: '16px',
                 padding: '2.5rem 2rem',
                 transition: 'all 0.3s ease',
                 position: 'relative',
                 overflow: 'hidden',
                 display: 'block'
               }} className="evidence-card-enhanced">
                 <div style={{ position: 'relative', zIndex: 1 }}>
                   <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                   <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'white' }}>Architecture Proof</h3>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                     Line-by-line code verification (all claims mapped to source files)
                   </p>
                   <div style={{ marginTop: '1.5rem', color: '#10b981', fontSize: '0.9rem', fontWeight: '600' }}>
                     View Verification →
                   </div>
                 </div>
              </a>

               <a href="https://github.com/gaip/petai/blob/main/backend/demo_confluent_vertexai.ipynb" target="_blank" rel="noopener noreferrer" style={{
                 textDecoration: 'none',
                 background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
                 border: '2px solid rgba(139, 92, 246, 0.3)',
                 borderRadius: '16px',
                 padding: '2.5rem 2rem',
                 transition: 'all 0.3s ease',
                 position: 'relative',
                 overflow: 'hidden',
                 display: 'block'
               }} className="evidence-card-enhanced">
                 <div style={{ position: 'relative', zIndex: 1 }}>
                   <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📓</div>
                   <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'white' }}>Demo Notebook</h3>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                     Interactive Jupyter notebook showing Confluent + Vertex AI integration
                   </p>
                   <div style={{ marginTop: '1.5rem', color: '#8b5cf6', fontSize: '0.9rem', fontWeight: '600' }}>
                     Run Demo →
                   </div>
                 </div>
              </a>
           </div>

           {/* Additional evidence links */}
           <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
             <a href="https://github.com/gaip/petai/blob/main/docs/VALIDATION_STUDY.md" target="_blank" style={{
               padding: '0.75rem 1.5rem',
               background: 'rgba(56, 189, 248, 0.1)',
               border: '1px solid rgba(56, 189, 248, 0.3)',
               borderRadius: '8px',
               color: '#38bdf8',
               textDecoration: 'none',
               fontSize: '0.95rem',
               fontWeight: '500',
               transition: 'all 0.3s ease'
             }}>📊 Validation Study</a>
             <a href="https://github.com/gaip/petai/blob/main/docs/METHODOLOGY.md" target="_blank" style={{
               padding: '0.75rem 1.5rem',
               background: 'rgba(16, 185, 129, 0.1)',
               border: '1px solid rgba(16, 185, 129, 0.3)',
               borderRadius: '8px',
               color: '#10b981',
               textDecoration: 'none',
               fontSize: '0.95rem',
               fontWeight: '500',
               transition: 'all 0.3s ease'
             }}>🔬 Methodology</a>
             <a href="https://github.com/gaip/petai/blob/main/backend/QUICKSTART.md" target="_blank" style={{
               padding: '0.75rem 1.5rem',
               background: 'rgba(139, 92, 246, 0.1)',
               border: '1px solid rgba(139, 92, 246, 0.3)',
               borderRadius: '8px',
               color: '#8b5cf6',
               textDecoration: 'none',
               fontSize: '0.95rem',
               fontWeight: '500',
               transition: 'all 0.3s ease'
             }}>🚀 Quick Start Guide</a>
           </div>
        </div>
      </section>

      {/* Integration Banner */}
      <section className="integration-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="integration-subtitle">Powered by Best-in-Class Architecture</p>
          <div className="partners-grid">
            <div className="partner-item">
              <span className="partner-name">Google Cloud</span>
              <span className="partner-desc">Vertex AI & Compute</span>
            </div>
            <div className="partner-item">
              <span className="partner-name">Confluent</span>
              <span className="partner-desc">Real-time Streaming</span>
            </div>
            <div className="partner-item">
              <span className="partner-name">ElevenLabs</span>
              <span className="partner-desc">Deep Voice AI</span>
            </div>
            <div className="partner-item">
              <span className="partner-name">Datadog</span>
              <span className="partner-desc">Observability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '2rem 0',
        textAlign: 'center',
        marginTop: '4rem'
      }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            © 2025 PetTwin Care | <a href="https://github.com/gaip/petai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>GitHub</a> | <a href="https://github.com/gaip/petai/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>MIT License</a>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Built with ❤️ for pets, vets, and the humans who love them.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        /* Utilities */
        .grid {
          display: grid;
          grid-template-columns: 1fr; /* Mobile default: 1 column */
          gap: 2rem;
          margin-top: 2rem;
        }

        .btn {
          display: inline-block;
          text-decoration: none;
        }

        /* Hero Section */
        .hero-section {
          padding-top: 6rem; /* Mobile padding */
          padding-bottom: 3rem;
          text-align: center;
          background: radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 70%);
        }
        .hero-title {
          font-size: 2.5rem; /* Mobile size */
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .hero-description {
          font-size: 1rem; /* Mobile size */
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 2rem;
          padding: 0 1rem;
        }
        .hero-actions {
          display: flex;
          flex-direction: column; /* Mobile stack */
          align-items: center;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
        }

        /* Video Container */
        .video-container {
          max-width: 900px;
          margin: 0 auto;
          border-radius: 16px; /* Smaller radius on mobile */
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(255,255,255,0.1);
        }

        /* Features Section */
        .features-section {
          padding: 3rem 0;
        }
        .section-title {
          font-size: 1.75rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        .hover-scale {
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.3);
          border-color: rgba(56, 189, 248, 0.4);
        }

        /* Integration Section */
        .integration-section {
          padding: 3rem 0;
          border-top: 1px solid var(--border-light);
        }
        .integration-subtitle {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .partners-grid {
          display: flex;
          gap: 2rem;
          justify-content: center;
          opacity: 0.8;
          flex-wrap: wrap;
          flex-direction: column; /* Mobile stack */
        }
        .partner-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .partner-name {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .partner-desc {
          font-size: 0.8rem;
          color: gray;
        }

        /* Validation & Evidence */
        .validation-section, .evidence-section {
          padding: 3rem 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.02);
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .metric-card {
          background: rgba(255,255,255,0.03);
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .metric-value {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          color: #38bdf8;
          margin-bottom: 0.5rem;
        }
        .metric-label {
            display: block;
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        .metric-desc {
            color: gray;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        .evidence-links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
        }
        .evidence-card {
            display: inline-block;
            background: rgba(255,255,255,0.05);
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.2s;
            font-weight: 500;
        }
        .evidence-card:hover {
            background: rgba(255,255,255,0.1);
            transform: scale(1.05);
        }
        @media (min-width: 768px) {
            .metrics-grid {
                 grid-template-columns: repeat(3, 1fr);
                 gap: 2rem;
            }
            .evidence-links {
                flex-direction: row;
                justify-content: center;
            }
        }

        /* Desktop Optimization */
        @media (min-width: 768px) {
          .grid {
             grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
          .hero-section {
            padding-top: 8rem;
            padding-bottom: 4rem;
          }
          .hero-title {
            font-size: 4rem;
            margin-bottom: 1.5rem;
          }
          .hero-description {
            font-size: 1.25rem;
            margin: 0 auto 2.5rem;
            padding: 0;
          }
          .hero-actions {
            flex-direction: row;
            margin-bottom: 4rem;
          }
          .video-container {
            border-radius: 24px;
          }
          .features-section {
            padding: 4rem 0;
          }
          .section-title {
            font-size: 2rem;
            margin-bottom: 3rem;
          }
          .integration-section {
            padding: 4rem 0;
          }
          .partners-grid {
             gap: 3rem;
             flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}
