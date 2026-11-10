import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [gameName, setGameName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameName.trim() || !tagLine.trim()) return;

        // Navega para o Dashboard com os parâmetros na URL
        navigate(`/dashboard/${encodeURIComponent(gameName.trim())}/${encodeURIComponent(tagLine.trim())}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#38bdf8' }}>
                🛡️ Support Carry Tracker
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '1.1rem' }}>
                Avalia o teu impacto real na Bot Lane e no mapa (Vision, KP% e Sinergia com ADCs).
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', background: '#1e293b', padding: '15px', borderRadius: '10px', border: '1px solid #334155' }}>
                <input
                    type="text"
                    placeholder="Nome (ex: Telmo77748)"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', fontSize: '1rem', outline: 'none' }}
                />
                <span style={{ fontSize: '1.5rem', color: '#64748b', alignSelf: 'center' }}>#</span>
                <input
                    type="text"
                    placeholder="Tag (ex: 7777)"
                    value={tagLine}
                    onChange={(e) => setTagLine(e.target.value)}
                    style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', fontSize: '1rem', width: '100px', outline: 'none' }}
                />
                <button
                    type="submit"
                    style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                >
                    Analisar
                </button>
            </form>
        </div>
    );
}