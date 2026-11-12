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
        <div style={{ padding: '30px 40px', maxWidth: '1400px', margin: '0 auto' }}>
            <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginBottom: '20px' }}>
                ← Voltar à Pesquisa
            </Link>

            <div style={{ padding: '25px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '20px' }}>
                    Relatório de Suporte: <span style={{ color: '#38bdf8' }}>{gameName}#{tagLine}</span>
                </h2>

                {isLoading && <p style={{ color: '#fbbf24' }}>A carregar dados da Riot... (pode demorar uns segundos)</p>}
                {error && <p style={{ color: '#ef4444' }}>Erro: {error}</p>}

                {/* CARTÃO DE PERFIL */}
                {profile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#0f172a', padding: '20px', borderRadius: '10px', marginBottom: '25px', border: '1px solid #475569' }}>
                        <img
                            src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${profile.profileIconId}.png`}
                            alt="Ícone de Perfil"
                            style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #38bdf8' }}
                        />
                        <div>
                            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.4rem' }}>Nível {profile.summonerLevel}</h3>
                            <p style={{ margin: '5px 0 0 0', color: profile.tier === 'UNRANKED' ? '#94a3b8' : '#fbbf24', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                {profile.tier} {profile.rank} {profile.tier !== 'UNRANKED' && `- ${profile.leaguePoints} LP`}
                            </p>
                        </div>
                    </div>
                )}

                {/* PAINEL DE KPIS GLOBAIS */}
                {metrics && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '15px',
                        marginBottom: '30px'
                    }}>
                        <div style={{ background: '#0f172a', padding: '18px', borderRadius: '10px', border: '1px solid #334155', textAlign: 'center' }}>
                            <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Winrate Global</p>
                            <p style={{ margin: 0, color: metrics.winRate >= 50 ? '#34d399' : '#f87171', fontSize: '1.4rem', fontWeight: 'bold' }}>
                                {metrics.winRate}% <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>({metrics.totalGamesAnalyzed} jogos)</span>
                            </p>
                        </div>

                        <div style={{ background: '#0f172a', padding: '18px', borderRadius: '10px', border: '1px solid #334155', textAlign: 'center' }}>
                            <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>👁️ Visão (VSPM)</p>
                            <p style={{ margin: 0, color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold' }}>
                                {metrics.avgVisionScorePerMinute} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/ min</span>
                            </p>
                        </div>

                        <div style={{ background: '#0f172a', padding: '18px', borderRadius: '10px', border: '1px solid #334155', textAlign: 'center' }}>
                            <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎯 Kill Participation</p>
                            <p style={{ margin: 0, color: '#38bdf8', fontSize: '1.4rem', fontWeight: 'bold' }}>
                                {metrics.avgKillParticipation}%
                            </p>
                        </div>

                        <div style={{ background: '#0f172a', padding: '18px', borderRadius: '10px', border: '1px solid #334155', textAlign: 'center' }}>
                            <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚔️ KDA Global</p>
                            <p style={{ margin: 0, color: '#f8fafc', fontSize: '1.4rem', fontWeight: 'bold' }}>
                                {metrics.avgKda}
                            </p>
                        </div>
                    </div>
                )}

                {/* LAYOUT PRINCIPAL EM DUAS COLUNAS (Estatísticas vs Histórico) */}
                {metrics && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '25px', alignItems: 'start' }}>

                        {/* COLUNA ESQUERDA: DESEMPENHO POR CAMPEÃO & SINERGIAS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                            {/* ESTATÍSTICAS POR CAMPEÃO */}
                            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
                                <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                                    🛡️ Desempenho por Campeão (Suporte)
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {metrics.championStats.map((champ: any, idx: number) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b', padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                                <img
                                                    src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${champ.championName}.png`}
                                                    alt={champ.championName}
                                                    style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #38bdf8' }}
                                                />
                                                <div>
                                                    <p style={{ margin: 0, color: '#f8fafc', fontWeight: 'bold', fontSize: '0.95rem' }}>{champ.championName}</p>
                                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>{champ.gamesPlayed} jogos ({champ.wins}V - {champ.gamesPlayed - champ.wins}D)</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0, color: champ.winRate >= 50 ? '#34d399' : '#f87171', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                                    {champ.winRate}% WR
                                                </p>
                                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem' }}>
                                                    KDA: {champ.avgKda} | VSPM: {champ.avgVisionScorePerMinute}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SINERGIAS COM O ADC */}
                            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
                                <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                                    🏹 Sinergia com ADCs
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {metrics.adcSynergies.map((adc: any, idx: number) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b', padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                                <img
                                                    src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${adc.adcChampionName}.png`}
                                                    alt={adc.adcChampionName}
                                                    style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #f43f5e' }}
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                                <div>
                                                    <p style={{ margin: 0, color: '#f8fafc', fontWeight: 'bold', fontSize: '0.95rem' }}>{adc.adcChampionName}</p>
                                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>{adc.gamesPlayed} partidas juntos</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0, color: adc.winRate >= 50 ? '#34d399' : '#f87171', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                                    {adc.winRate}% WR
                                                </p>
                                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem' }}>
                                                    {adc.wins}V / {adc.losses}D
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* COLUNA DIREITA: HISTÓRICO DE PARTIDAS */}
                        <div>
                            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
                                <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                                    📜 Histórico de Partidas
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {metrics.matchHistory.map((match: any) => (
                                        <div key={match.matchId} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px',
                                            background: match.win ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                            borderLeft: `4px solid ${match.win ? '#10b981' : '#ef4444'}`,
                                            borderRadius: '8px'
                                        }}>

                                            <img
                                                src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${match.championName}.png`}
                                                alt={match.championName}
                                                style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2px solid ${match.win ? '#10b981' : '#ef4444'}` }}
                                            />

                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 3px 0', color: match.win ? '#34d399' : '#f87171', fontSize: '0.9rem' }}>
                                                    {match.win ? 'VITÓRIA' : 'DERROTA'} <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({match.gameDurationInMinutes}m)</span>
                                                </h4>
                                                <p style={{ margin: 0, color: '#f8fafc', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                                    {match.kills} / {match.deaths} / {match.assists}
                                                </p>
                                                <p style={{ margin: '2px 0 0 0', color: '#cbd5e1', fontSize: '0.8rem' }}>
                                                    ADC: <strong style={{ color: '#e2e8f0' }}>{match.adcChampionName || 'N/A'}</strong>
                                                </p>
                                            </div>

                                            <div style={{ color: '#94a3b8', fontSize: '0.8rem', borderLeft: '1px solid #334155', paddingLeft: '10px' }}>
                                                <p style={{ margin: '0 0 2px 0' }}>👁️ {match.visionScorePerMinute}/m</p>
                                                <p style={{ margin: '0 0 2px 0' }}>🎯 {match.killParticipation}%</p>
                                                <p style={{ margin: 0 }}>🛑 {match.controlWards} CW</p>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}