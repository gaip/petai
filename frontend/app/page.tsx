import Link from "next/link";

export default function Home() {
  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <header style={{ textAlign: 'center', marginBottom: '6rem' }} className="animate-fade-up">
        <div style={{ marginBottom: '1rem', display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', fontSize: '0.9rem', color: '#a78bfa' }}>
          AWS Kiro Hackathon 2025 | Social Impact Track
        </div>
        <h1>
          <span className="text-gradient">PetTwin Care</span>
        </h1>
        <h2 style={{ fontSize: '2rem', fontWeight: 500, color: '#e5e5e5', marginBottom: '2rem' }}>
          Your Pet Can't Tell You When Something's Wrong.<br />
          We Built Something That Can.
        </h2>
        <div style={{ marginTop: '3rem' }}>
          <Link href="/dashboard">
            <button className="btn-primary">Launch Demo</button>
          </Link>
        </div>
      </header>

      {/* Stats Section */}
      <section className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <h3>$15B+</h3>
            <p style={{ fontSize: '0.9rem' }}>AI Pet Market by 2035</p>
          </div>
          <div>
            <h3>3-5x</h3>
            <p style={{ fontSize: '0.9rem' }}>Vet Suicide Rate vs. Avg</p>
          </div>
          <div>
            <h3>2-3 wks</h3>
            <p style={{ fontSize: '0.9rem' }}>Earlier Detection</p>
          </div>
          <div>
            <h3>24,000</h3>
            <p style={{ fontSize: '0.9rem' }}>Vet Shortage by 2030</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section style={{ marginTop: '6rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h2>Here's What Nobody Talks About</h2>
        <p>I want to tell you about a dog named Max. He was a seven-year-old Golden Retriever, and for weeks his owner Sarah thought he was just "slowing down."</p>
        <p>By the time Sarah finally brought Max to the vet, it was Stage 4 kidney disease. The treatment cost over twelve thousand dollars. Max lived another eight months.</p>
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
          <p style={{ marginBottom: 0, fontStyle: 'italic', color: 'white' }}>
            "This isn't just Max's story. It's happening to millions of pets every year. It's because pets are hardwired to hide pain."
          </p>
        </div>
      </section>
    </div>
  );
}
