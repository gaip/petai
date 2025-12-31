"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const linkStyle = (path: string) => {
        const isActive = pathname === path;
        return {
            color: isActive ? 'white' : 'var(--text-muted)',
            fontWeight: isActive ? 600 : 400,
            transition: 'color 0.2s',
            position: 'relative' as const,
            display: 'block',
            padding: '0.5rem 0',
        };
    };

    return (
        <>
            <nav className="glass-panel" style={{
                position: 'fixed',
                top: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '1200px',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 100,
                borderRadius: '99px' // Pill shape
            }}>
                <Link href="/" style={{
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    background: 'linear-gradient(to right, #a78bfa, #2dd4bf)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    flexShrink: 0
                }}>
                    PetTwin Care
                </Link>

                {/* Mobile Hamburger */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'none', // Hidden on desktop by default
                    }}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                {/* Desktop Nav */}
                <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link href="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
                    <Link href="/add-pet" style={linkStyle('/add-pet')}>+ Add Pet</Link>
                    <Link href="/vet" style={linkStyle('/vet')}>Pet Portal</Link>
                    <Link href="/login" style={{
                        ...linkStyle('/login'),
                        marginLeft: '0',
                        border: '1px solid var(--border-light)',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '20px',
                        display: 'inline-block'
                    }}>Login</Link>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="glass-panel" style={{
                    position: 'fixed',
                    top: '5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: '1200px',
                    padding: '1.5rem',
                    zIndex: 99,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    borderRadius: '24px'
                }}>
                    <Link href="/dashboard" style={linkStyle('/dashboard')} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    <Link href="/add-pet" style={linkStyle('/add-pet')} onClick={() => setIsMenuOpen(false)}>+ Add Pet</Link>
                    <Link href="/vet" style={linkStyle('/vet')} onClick={() => setIsMenuOpen(false)}>Pet Portal</Link>
                    <div style={{ height: '1px', background: 'var(--border-light)', margin: '0.5rem 0' }}></div>
                    <Link href="/login" style={{ ...linkStyle('/login'), textAlign: 'center', background: 'var(--border-light)', borderRadius: '12px', padding: '0.75rem' }} onClick={() => setIsMenuOpen(false)}>Login</Link>
                </div>
            )}

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
}
