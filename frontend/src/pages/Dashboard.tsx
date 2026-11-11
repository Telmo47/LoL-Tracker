import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const { gameName, tagLine } = useParams<{ gameName: string; tagLine: string }>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<any | null>(null);
    const [profile, setProfile] = useState<any | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!gameName || !tagLine) return;

            setIsLoading(true);
            setError(null);

            try {
                const baseUrl = 'http://localhost:5229/api/Tracker';

                const summonerRes = await axios.get(`${baseUrl}/summoner/${gameName}/${tagLine}`);
                const puuid = summonerRes.data.puuid;

                const metricsRes = await axios.get(`${baseUrl}/support-metrics/${puuid}`);
                setMetrics(metricsRes.data);

                const profileRes = await axios.get(`${baseUrl}/profile/${gameName}/${tagLine}/${puuid}`);
                setProfile(profileRes.data);

            } catch (err: any) {
                console.error("Erro no fetch:", err);
                setError(err.response?.data?.message || "Erro ao comunicar com o servidor.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, [gameName, tagLine]);

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Voltar à Pesquisa
            </Link>

            <div style={{ marginTop: '20px', padding: '20px', background: '#1e293b', borderRadius: '10px', border: '1px solid #334155' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '20px' }}>
                    Relatório de Suporte: <span style={{ color: '#38bdf8' }}>{gameName}#{tagLine}</span>
                </h2>

                {isLoading && <p style={{ color: '#fbbf24' }}>A carregar dados da Riot... (pode demorar uns segundos)</p>}
                {error && <p style={{ color: '#ef4444' }}>Erro: {error}</p>}

                {/* CARTÃO DE PERFIL */}
                {profile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #475569' }}>
                        <img
                            src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${profile.profileIconId}.png`}
                            alt="Ícone de Perfil"
                            style={{ width: '100px', borderRadius: '50%', border: '3px solid #38bdf8' }}
                        />
                        <div>
                            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.5rem' }}>Nível {profile.summonerLevel}</h3>
                            <p style={{ margin: '5px 0 0 0', color: profile.tier === 'UNRANKED' ? '#94a3b8' : '#fbbf24', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                {profile.tier} {profile.rank} {profile.tier !== 'UNRANKED' && `- ${profile.leaguePoints} LP`}
                            </p>
                        </div>
                    </div>
                )}

                {/* HISTÓRICO DE PARTIDAS (ISSUE #11) */}
                {metrics && (
                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{ color: '#f8fafc', fontSize: '1.5rem', marginBottom: '15px' }}>Últimas Partidas (Suporte)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {metrics.matchHistory.map((match: any) => (
                                <div key={match.matchId} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    padding: '15px',
                                    background: match.win ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    borderLeft: `5px solid ${match.win ? '#10b981' : '#ef4444'}`,
                                    borderRadius: '8px'
                                }}>

                                    <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${match.championName}.png`}
                                        alt={match.championName}
                                        style={{ width: '60px', height: '60px', borderRadius: '50%', border: `2px solid ${match.win ? '#10b981' : '#ef4444'}` }}
                                    />

                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 5px 0', color: match.win ? '#34d399' : '#f87171' }}>
                                            {match.win ? 'VITÓRIA' : 'DERROTA'} <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>({match.gameDurationInMinutes} min)</span>
                                        </h4>
                                        <p style={{ margin: 0, color: '#f8fafc', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {match.kills} / {match.deaths} / {match.assists}
                                        </p>
                                        <p style={{ margin: '5px 0 0 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                                            Com ADC: <strong style={{ color: '#e2e8f0' }}>{match.adcChampionName || 'N/A'}</strong>
                                        </p>
                                    </div>

                                    <div style={{ flex: 1, color: '#94a3b8', fontSize: '0.95rem', borderLeft: '1px solid #334155', paddingLeft: '20px' }}>
                                        <p style={{ margin: '0 0 5px 0' }}>👁️ Visão: <strong style={{ color: '#38bdf8' }}>{match.visionScorePerMinute}</strong> / min</p>
                                        <p style={{ margin: '0 0 5px 0' }}>🎯 KP: <strong style={{ color: '#38bdf8' }}>{match.killParticipation}%</strong></p>
                                        <p style={{ margin: 0 }}>🛑 Control Wards: <strong style={{ color: '#f87171' }}>{match.controlWards}</strong></p>
                                    </div>

                                    {/* ITENS DE SUPORTE */}
                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', width: '130px' }}>
                                        {match.items.map((itemId: number, idx: number) => (
                                            itemId > 0 ? (
                                                <img
                                                    key={idx}
                                                    src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/item/${itemId}.png`}
                                                    alt="Item"
                                                    style={{ width: '35px', height: '35px', borderRadius: '4px', border: '1px solid #334155' }}
                                                />
                                            ) : (
                                                <div key={idx} style={{ width: '35px', height: '35px', borderRadius: '4px', background: '#0f172a', border: '1px solid #334155' }}></div>
                                            )
                                        ))}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}