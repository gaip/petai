"use client";

import { useState } from 'react';

interface SocialShareProps {
    petName: string;
    score: number;
}

export default function SocialShare({ petName, score }: SocialShareProps) {
    const [copied, setCopied] = useState(false);

    const shareText = `My pet ${petName} is thriving with a health score of ${score}/100! 🐾 #PetTwinAI #PetHealth`;

    const handleCopyAndOpen = (platform: 'instagram' | 'tiktok') => {
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);

        // Open platform in new tab
        const url = platform === 'instagram' ? 'https://www.instagram.com/' : 'https://www.tiktok.com/';
        window.open(url, '_blank');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                Share {petName}'s Score:
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                    onClick={() => handleCopyAndOpen('instagram')}
                    style={{
                        flex: 1,
                        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'transform 0.2s',
                        boxShadow: '0 4px 12px rgba(220, 39, 67, 0.3)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <span>📸</span> Instagram
                </button>

                <button
                    onClick={() => handleCopyAndOpen('tiktok')}
                    style={{
                        flex: 1,
                        background: '#000000',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'transform 0.2s',
                        boxShadow: '0 4px 12px rgba(0,0,0, 0.4)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <span>🎵</span> TikTok
                </button>
            </div>

            <div style={{
                fontSize: '0.75rem',
                color: copied ? '#4ade80' : '#64748b',
                textAlign: 'center',
                height: '1.2em',
                transition: 'color 0.3s'
            }}>
                {copied ? '✨ Caption copied! ready to paste.' : 'Tap to copy caption & open app'}
            </div>
        </div>
    );
}
