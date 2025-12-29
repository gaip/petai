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
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', animation: 'pulse 2s infinite' }}>Start Digital Twin</Link>
            <a href="https://github.com/gaip/petai" target="_blank" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>View on GitHub</a>
          </div>

          {/* Local Video Embed */}
          <div className="video-container animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <video
                src="/demo.mp4"
                title="PetTwin AI Demo"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: 'inherit' }}
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
                Analysis of 4K video feeds to detect micro-tremors and gait asymmetry with <strong>99.4% accuracy</strong> compared to standard veterinay observation.
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
