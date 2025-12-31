"use client";

import Link from "next/link";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', background: '#0a0e1a' }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '8rem 0 6rem',
        overflow: 'hidden'
      }}>
        {/* Floating gradient orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block',
            padding: '0.75rem 1.75rem',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(139, 92, 246, 0.15))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '50px',
            marginBottom: '2rem',
            animation: 'fadeInUp 0.6s ease-out 0.1s both'
          }}>
            <span style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}>
              ✨ Powered by Google Gemini & Vertex AI
            </span>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s ease-out 0.2s both',
            letterSpacing: '-0.02em'
          }}>
            The First AI Digital Twin<br />
            For Your Pet's Health
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: 'rgba(255, 255, 255, 0.75)',
            maxWidth: '750px',
            margin: '0 auto 3rem',
            lineHeight: '1.7',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s ease-out 0.3s both',
            fontWeight: '400'
          }}>
            PetTwin Care fuses <strong style={{ color: '#38bdf8' }}>real-time bio-data</strong>, <strong style={{ color: '#8b5cf6' }}>vision AI analysis</strong>, and <strong style={{ color: '#10b981' }}>voice synthesis</strong> to give your pet a voice. Shift from reactive visits to predictive care.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '1.25rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '4rem',
            animation: 'fadeInUp 0.6s ease-out 0.4s both'
          }}>
            <Link href="/login" style={{
              position: 'relative',
              padding: '1rem 2.5rem',
              fontSize: '1.15rem',
              fontWeight: '700',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(56, 189, 248, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              display: 'inline-block'
            }}
            className="cta-primary">
              Start Digital Twin →
            </Link>
            <a href="https://github.com/gaip/petai" target="_blank" style={{
              padding: '1rem 2.5rem',
              fontSize: '1.15rem',
              fontWeight: '700',
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            className="cta-secondary">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Metrics Section - Redesigned */}
      <section style={{
        padding: '5rem 0',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="container">
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Clinically Validated Performance
          </h2>
          <p style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '1.1rem',
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem'
          }}>
            Proven results from retrospective analysis of 50 veterinary cases
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Metric Card 1 */}
            <div className="metric-card-premium" style={{
              position: 'relative',
              padding: '3rem 2rem',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(139, 92, 246, 0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '24px',
              textAlign: 'center',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {/* Glow effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }} className="card-glow" />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Animated Progress Circle */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <svg width="140" height="140" style={{ margin: '0 auto', display: 'block' }}>
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="8" />
                    <circle
                      cx="70" cy="70" r="60" fill="none" stroke="url(#grad1)" strokeWidth="8"
                      strokeDasharray="377" strokeDashoffset="30"
                      strokeLinecap="round"
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '70px 70px',
                        filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))'
                      }}
                    />
                    <text x="70" y="80" textAnchor="middle" fontSize="32" fontWeight="900" fill="white">92%</text>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: '#ffffff'
                }}>
                  Detection Accuracy
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Correctly identified 46/50 retrospectively analyzed cases
                </p>
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="metric-card-premium" style={{
              position: 'relative',
              padding: '3rem 2rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(56, 189, 248, 0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '24px',
              textAlign: 'center',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }} className="card-glow" />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '5rem',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))'
                }}>
                  ⏰
                </div>
                <div style={{
                  fontSize: '3.5rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #10b981, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem',
                  lineHeight: '1'
                }}>
                  7.6 Days
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: '#ffffff'
                }}>
                  Early Warning
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Average lead time before symptoms were visible to owners
                </p>
              </div>
            </div>

            {/* Metric Card 3 */}
            <div className="metric-card-premium" style={{
              position: 'relative',
              padding: '3rem 2rem',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '24px',
              textAlign: 'center',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }} className="card-glow" />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <svg width="140" height="140" style={{ margin: '0 auto', display: 'block' }}>
                    <defs>
                      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="8" />
                    <circle
                      cx="70" cy="70" r="60" fill="none" stroke="url(#grad2)" strokeWidth="8"
                      strokeDasharray="377" strokeDashoffset="0"
                      strokeLinecap="round"
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '70px 70px',
                        filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))'
                      }}
                    />
                    <text x="70" y="80" textAnchor="middle" fontSize="32" fontWeight="900" fill="white">100%</text>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: '#ffffff'
                }}>
                  Severe Detection
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Critical conditions caught earliest when intervention matters most
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <a href="https://github.com/gaip/petai/blob/main/docs/VALIDATION_STUDY.md" target="_blank" style={{
              display: 'inline-block',
              padding: '0.9rem 2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              color: '#38bdf8',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
            className="cta-secondary">
              📊 View Full Validation Study
            </a>
          </div>
        </div>
      </section>

      {/* Video Section - Redesigned */}
      <section style={{
        padding: '5rem 0',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #ffffff, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              See PetTwin AI in Action
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Watch how our AI digital twin predicts health issues before symptoms appear
            </p>
          </div>

          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            position: 'relative'
          }}>
            {/* Decorative elements */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              right: '-20px',
              bottom: '-20px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.1))',
              borderRadius: '32px',
              filter: 'blur(40px)',
              zIndex: -1
            }} />

            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
              background: 'rgba(0, 0, 0, 0.4)'
            }}>
              <video
                src="/demo.mp4"
                title="PetTwin AI Demo"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                loop
                muted
                controls
                playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Features */}
      <section style={{
        padding: '5rem 0',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#ffffff'
            }}>
              Built on Google Vertex AI
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '1.1rem',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Enterprise-grade anomaly detection pipeline normally reserved for industrial IoT, now applied to your pet's health
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            <div className="feature-card" style={{
              padding: '2.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.4))'
              }}>
                👁️
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}>
                Gemini Pro Vision
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '1rem',
                lineHeight: '1.7',
                margin: 0
              }}>
                Computer vision analysis using <strong style={{ color: '#38bdf8' }}>MobileNetV2</strong> architecture to detect subtle gait asymmetry and movement patterns invisible to human observation
              </p>
            </div>

            <div className="feature-card" style={{
              padding: '2.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))'
              }}>
                🧠
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}>
                Vertex AI AutoML
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '1rem',
                lineHeight: '1.7',
                margin: 0
              }}>
                Custom trained models for every breed. <strong style={{ color: '#8b5cf6' }}>MobileNetV2</strong> architecture optimized for edge deployment on local home hubs
              </p>
            </div>

            <div className="feature-card" style={{
              padding: '2.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))'
              }}>
                ⚡
              </div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#ffffff'
              }}>
                Cloud Dataflow
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '1rem',
                lineHeight: '1.7',
                margin: 0
              }}>
                Real-time stream processing of heart rate variation (HRV) and sleep quality data at scale
              </p>
            </div>
          </div>

          <ArchitectureDiagram />
        </div>
      </section>

      {/* Technical Evidence Section - Premium Redesign */}
      <section style={{
        padding: '6rem 0',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.8) 100%)',
        zIndex: 1
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.75rem 1.75rem',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(139, 92, 246, 0.15))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#38bdf8',
                letterSpacing: '0.5px'
              }}>
                🏆 Hackathon Submission Evidence
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: '900',
              marginBottom: '1.25rem',
              background: 'linear-gradient(135deg, #ffffff, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Technical Proof & Evidence
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: '1.15rem',
              maxWidth: '750px',
              margin: '0 auto',
              lineHeight: '1.7'
            }}>
              Complete documentation proving all technical claims with line-by-line code verification
            </p>
          </div>

          {/* Evidence Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto 3rem'
          }}>
            {/* Card 1 */}
            <a href="https://github.com/gaip/petai/blob/main/docs/EVIDENCE.md" target="_blank" rel="noopener noreferrer"
              className="evidence-card-new"
              style={{
                position: 'relative',
                padding: '3rem 2.5rem',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(139, 92, 246, 0.05))',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '24px',
                textDecoration: 'none',
                display: 'block',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }} className="evidence-glow" />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.5))'
                }}>
                  📄
                </div>
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  marginBottom: '1rem',
                  color: '#ffffff'
                }}>
                  Evidence Checklist
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1.05rem',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem'
                }}>
                  Complete requirements verification with 95.7% compliance (22/23 met)
                </p>
                <div style={{
                  color: '#38bdf8',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  View Document
                  <span style={{ transition: 'transform 0.3s ease', display: 'inline-block' }}>→</span>
                </div>
              </div>
            </a>

            {/* Card 2 */}
            <a href="https://github.com/gaip/petai/blob/main/docs/TECHNICAL_PROOF.md" target="_blank" rel="noopener noreferrer"
              className="evidence-card-new"
              style={{
                position: 'relative',
                padding: '3rem 2.5rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.05))',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '24px',
                textDecoration: 'none',
                display: 'block',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }} className="evidence-glow" />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))'
                }}>
                  ⚙️
                </div>
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  marginBottom: '1rem',
                  color: '#ffffff'
                }}>
                  Architecture Proof
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1.05rem',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem'
                }}>
                  Line-by-line code verification with all claims mapped to source files
                </p>
                <div style={{
                  color: '#10b981',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  View Verification
                  <span style={{ transition: 'transform 0.3s ease', display: 'inline-block' }}>→</span>
                </div>
              </div>
            </a>

            {/* Card 3 */}
            <a href="https://github.com/gaip/petai/blob/main/backend/demo_confluent_vertexai.ipynb" target="_blank" rel="noopener noreferrer"
              className="evidence-card-new"
              style={{
                position: 'relative',
                padding: '3rem 2.5rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '24px',
                textDecoration: 'none',
                display: 'block',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }} className="evidence-glow" />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))'
                }}>
                  📓
                </div>
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  marginBottom: '1rem',
                  color: '#ffffff'
                }}>
                  Demo Notebook
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1.05rem',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem'
                }}>
                  Interactive Jupyter notebook showing Confluent + Vertex AI integration
                </p>
                <div style={{
                  color: '#8b5cf6',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  Run Demo
                  <span style={{ transition: 'transform 0.3s ease', display: 'inline-block' }}>→</span>
                </div>
              </div>
            </a>
          </div>

          {/* Quick Links */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <a href="https://github.com/gaip/petai/blob/main/docs/VALIDATION_STUDY.md" target="_blank"
              className="quick-link"
              style={{
                padding: '1rem 1.75rem',
                background: 'rgba(56, 189, 248, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                color: '#38bdf8',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}>
              📊 Validation Study
            </a>
            <a href="https://github.com/gaip/petai/blob/main/docs/METHODOLOGY.md" target="_blank"
              className="quick-link"
              style={{
                padding: '1rem 1.75rem',
                background: 'rgba(16, 185, 129, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                color: '#10b981',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}>
              🔬 Methodology
            </a>
            <a href="https://github.com/gaip/petai/blob/main/backend/QUICKSTART.md" target="_blank"
              className="quick-link"
              style={{
                padding: '1rem 1.75rem',
                background: 'rgba(139, 92, 246, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '12px',
                color: '#8b5cf6',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}>
              🚀 Quick Start Guide
            </a>
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section style={{
        padding: '4rem 0',
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '600'
          }}>
            Powered by Best-in-Class Architecture
          </p>
          <div style={{
            display: 'flex',
            gap: '3rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontWeight: '800',
                fontSize: '1.3rem',
                color: '#ffffff',
                marginBottom: '0.25rem'
              }}>
                Google Cloud
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                Vertex AI & Compute
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontWeight: '800',
                fontSize: '1.3rem',
                color: '#ffffff',
                marginBottom: '0.25rem'
              }}>
                Confluent
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                Real-time Streaming
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontWeight: '800',
                fontSize: '1.3rem',
                color: '#ffffff',
                marginBottom: '0.25rem'
              }}>
                ElevenLabs
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                Deep Voice AI
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontWeight: '800',
                fontSize: '1.3rem',
                color: '#ffffff',
                marginBottom: '0.25rem'
              }}>
                Datadog
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                Observability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '3rem 0',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="container">
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.95rem',
            marginBottom: '0.75rem'
          }}>
            © 2025 PetTwin Care | {' '}
            <a href="https://github.com/gaip/petai" target="_blank" rel="noopener noreferrer"
              style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>
              GitHub
            </a>
            {' '} | {' '}
            <a href="https://github.com/gaip/petai/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"
              style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>
              MIT License
            </a>
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            Built with ❤️ for pets, vets, and the humans who love them
          </p>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* CTA Button Hover Effects */
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(56, 189, 248, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15) inset !important;
        }

        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        /* Metric Cards Hover */
        .metric-card-premium:hover {
          transform: translateY(-8px);
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 20px 60px rgba(56, 189, 248, 0.3);
        }

        .metric-card-premium:hover .card-glow {
          opacity: 1;
        }

        /* Feature Cards */
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 15px 40px rgba(56, 189, 248, 0.2);
        }

        /* Evidence Cards */
        .evidence-card-new:hover {
          transform: translateY(-8px);
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 20px 60px rgba(56, 189, 248, 0.25);
        }

        .evidence-card-new:hover .evidence-glow {
          opacity: 1;
        }

        .evidence-card-new:hover span {
          transform: translateX(5px);
        }

        /* Quick Links */
        .quick-link:hover {
          transform: translateY(-3px);
          border-color: currentColor;
          box-shadow: 0 8px 24px rgba(56, 189, 248, 0.2);
        }

        /* Container */
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Responsive Typography */
        @media (max-width: 768px) {
          .container {
            padding: 0 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
