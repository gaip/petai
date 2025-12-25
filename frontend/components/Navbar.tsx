"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const linkStyle = (path: string) => {
        const isActive = pathname === path;
        return {
            color: isActive ? 'white' : 'var(--text-muted)',
            fontWeight: isActive ? 600 : 400,
            marginRight: '2rem',
            transition: 'color 0.2s',
            position: 'relative' as const,
        };
    };

    return (
        <nav className="glass-panel" style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1200px',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 100,
            borderRadius: '99px'
        }}>
            <Link href="/" style={{ fontWeight: 800, fontSize: '1.2rem', background: 'linear-gradient(to right, #a78bfa, #2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                PetTwin Care
            </Link>
            <div>
                <div>
                    <Link href="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
                    <Link href="/add-pet" style={linkStyle('/add-pet')}>+ Add Pet</Link>
                    <Link href="/vet" style={linkStyle('/vet')}>Pet Portal</Link>
                    <Link href="/login" style={{ ...linkStyle('/login'), marginLeft: '1rem', border: '1px solid var(--border-light)', padding: '0.5rem 1rem', borderRadius: '20px' }}>Login</Link>
                </div>      </div>
        </nav>
    );
}
