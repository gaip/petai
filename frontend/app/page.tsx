import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        paddingTop: '8rem',
        paddingBottom: '4rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 70%)'
      }}>
        <div className="container">
          <div className="chip" style={{ marginBottom: '1.5rem' }}>✨ Powered by Google Gemini & Vertex AI</div>
          <h1 className="text-gradient" style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            The First AI Digital Twin <br /> For Your Pet's Health
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            PetTwin Care fuses <strong>real-time bio-data</strong>, <strong>vision AI analysis</strong>, and <strong>voice synthesis</strong> to give your pet a voice. Shift from reactive visits to predictive care.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>Start Digital Twin</Link>
            <a href="https://github.com/gaip/petai" target="_blank" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>View on GitHub</a>
          </div>
        </div>
      </section>

      {/* How It Works Grid */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>The Intelligence Behind PetTwin</h2>
          <div className="grid">

            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👁️</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Computer Vision</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <strong>Google Gemini</strong> analyzes photos/videos of your pet to detect gait anomalies, skin issues, and mood shifts invisible to the naked eye.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🩺</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Real-Time Telemetry</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <strong>Apache Kafka</strong> streams bio-data (Heart Rate, Activity, Sleep) from smart collars, processing thousands of signals per second.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Anomaly Detection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <strong>Scikit-Learn</strong> Isolation Forests continuously model your pet's baseline health, triggering alerts instantly when deviations occur.
              </p>
            </div>

            <div className="card">
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
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Powered by Best-in-Class Architecture</p>
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', opacity: 0.8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Google Cloud</span>
              <span style={{ fontSize: '0.8rem', color: 'gray' }}>Vertex AI & Compute</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Confluent</span>
              <span style={{ fontSize: '0.8rem', color: 'gray' }}>Real-time Streaming</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>ElevenLabs</span>
              <span style={{ fontSize: '0.8rem', color: 'gray' }}>Deep Voice AI</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Datadog</span>
              <span style={{ fontSize: '0.8rem', color: 'gray' }}>Observability</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
