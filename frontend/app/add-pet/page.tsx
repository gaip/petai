"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AddPet() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [breed, setBreed] = useState("");
    const [video, setVideo] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

        try {
            // 1. Register Pet
            await fetch(`${API_URL}/api/pets?name=` + name + '&breed=' + breed + '&age=' + age, {
                method: 'POST'
            });

            // 2. Simulate Video Upload if present
            if (video) {
                await fetch(`${API_URL}/api/upload`, {
                    method: 'POST',
                    body: "dummy_binary_content"
                });
            }

            // Redirect to dashboard viewing the new pet
            router.push("/dashboard?pet=" + name);

        } catch (err) {
            console.error("Failed to add pet", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '600px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Add Your Pet</h1>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Pet Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Age</label>
                    <input
                        type="number"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Breed</label>
                    <input
                        type="text"
                        required
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Baseline Video (Optional)</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: '2px dashed var(--border-light)',
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: video ? 'rgba(45, 212, 191, 0.1)' : 'transparent'
                        }}
                    >
                        {video ? (
                            <div>
                                <span style={{ fontSize: '2rem' }}>📹</span>
                                <p>{video.name}</p>
                            </div>
                        ) : (
                            <div>
                                <span style={{ fontSize: '2rem' }}>📤</span>
                                <p>Tap to upload video from phone</p>
                                <span style={{ fontSize: '0.8rem', color: 'gray' }}>Helps AI establish movement baseline</span>
                            </div>
                        )}
                        {/* Progress Bar (Simulated) */}
                        {uploading && (
                            <div style={{ marginTop: '1rem', width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div className="progress-bar-fill" style={{ height: '100%', background: '#2dd4bf', transition: 'width 0.2s' }}></div>
                            </div>
                        )}
                        <style jsx>{`
                            @keyframes progressRun {
                                0% { width: 0%; }
                                20% { width: 45%; }
                                50% { width: 70%; }
                                100% { width: 95%; }
                            }
                            .progress-bar-fill {
                                animation: progressRun 3s ease-out forwards;
                            }
                        `}</style>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="video/*"
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={uploading} style={{ marginTop: '1rem' }}>
                    {uploading ? 'Analyzing...' : 'Add Pet'}
                </button>
            </form>
        </div>
    );
}
