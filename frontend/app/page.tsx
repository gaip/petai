"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="chip animate-fade-up" style={{ marginBottom: '1.5rem', animationDelay: '0.1s' }}>✨ Powered by Google Gemini & Vertex AI</div>
          <h1 className="hero-title text-gradient animate-fade-up" style={{ animationDelay: '0.2s' }}>
            The First AI Digital Twin <br /> For Your Pet's Health
          </h1>
          <p className="hero-description animate-fade-up" style={{ animationDelay: '0.3s' }}>
            PetTwin Care fuses <strong>real-time bio-data</strong>, <strong>vision AI analysis</strong>, and <strong>voice synthesis</strong> to give your pet a voice. Shift from reactive visits to predictive care.
          </p>

          <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', animation: 'pulse 2s infinite' }}>Start Digital Twin</Link>
            <a href="https://github.com/gaip/petai" target="_blank" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>View on GitHub</a>
          </div>

          {/* YouTube Video Embed */}
          <div className="video-container animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/r1d-tVPNA74"
                title="PetTwin AI Demo"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Grid */}
      <section className="features-section">
        <div className="container">
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>The Intelligence Behind PetTwin</h2>
          <div className="grid">

            <div className="card hover-scale" style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👁️</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Computer Vision</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <strong>Google Gemini</strong> analyzes photos/videos of your pet to detect gait anomalies, skin issues, and mood shifts invisible to the naked eye.
              </p>
            </div>

            <div className="card hover-scale" style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🩺</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Real-Time Telemetry</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <strong>Apache Kafka</strong> streams bio-data (Heart Rate, Activity, Sleep) from smart collars, processing thousands of signals per second.
              </p>
            </div>

            <div className="card hover-scale" style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Anomaly Detection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <strong>Scikit-Learn</strong> Isolation Forests continuously model your pet's baseline health, triggering alerts instantly when deviations occur.
              </p>
            </div>

            <div className="card hover-scale" style={{ transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗣️</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Voice Synthesis</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <strong>ElevenLabs</strong> gives your pet a voice. Health alerts and updates are spoken in a tone that matches your pet's personality.
              </p>
            </div>

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

      <style jsx global>{`
        /* Hero Section */
        .hero-section {
          padding-top: 8rem;
          padding-bottom: 4rem;
          text-align: center;
          background: radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 70%);
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        .hero-description {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto 2.5rem;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
        }
        
        /* Video Container */
        .video-container {
          max-width: 900px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .video-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
        }

        /* Features Section */
        .features-section {
          padding: 4rem 0;
        }
        .section-title {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 3rem;
        }
        .hover-scale:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.3);
          border-color: rgba(56, 189, 248, 0.4);
        }

        /* Integration Section */
        .integration-section {
          padding: 4rem 0;
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
          gap: 3rem;
          justify-content: center;
          opacity: 0.8;
          flex-wrap: wrap;
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

        /* Mobile Optimization */
        @media (max-width: 768px) {
          .hero-section {
            padding-top: 6rem;
            padding-bottom: 3rem;
          }
          .hero-title {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          .hero-description {
            font-size: 1rem;
            margin-bottom: 2rem;
            padding: 0 1rem;
          }
          .hero-actions {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            margin-bottom: 3rem;
          }
          .btn {
            width: 100%;
            max-width: 320px;
            text-align: center;
          }
          
          .features-section {
            padding: 3rem 0;
          }
          .section-title {
            font-size: 1.75rem;
            margin-bottom: 2rem;
          }
          
          .integration-section {
            padding: 3rem 0;
          }
          .partners-grid {
            gap: 2rem;
            flex-direction: column;
          }
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
