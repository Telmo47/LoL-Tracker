import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const { gameName, tagLine } = useParams<{ gameName: string; tagLine: string }>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<any | null>(null);

    useEffect(() => {
        // 1. Definimos a função assíncrona que vai fazer o trabalho sujo
        const fetchMetrics = async () => {
            if (!gameName || !tagLine) return; // Segurança extra

            setIsLoading(true); // Começamos a carregar
            setError(null); // Limpamos erros antigos

            try {
                // ATENÇÃO: Substitui a porta '7xxx' pela porta real em que a tua API C# está a correr (ex: 5001, 7234, etc.)
                const baseUrl = 'http://localhost:5229/api/Tracker';

                // Passo A: Obter o invocador
                const summonerRes = await axios.get(`${baseUrl}/summoner/${gameName}/${tagLine}`);
                const puuid = summonerRes.data.puuid;

                // Passo B: Obter as métricas com o puuid que recebemos
                const metricsRes = await axios.get(`${baseUrl}/support-metrics/${puuid}`);

                // Sucesso! Guardamos os dados no estado
                setMetrics(metricsRes.data);

            } catch (err: any) {
                console.error("Erro no fetch:", err);
                // Se o Axios apanhar um erro (ex: 404 Not Found do C#), cai aqui
                setError(err.response?.data?.message || "Erro ao comunicar com o servidor.");
            } finally {
                // Quer tenha corrido bem ou mal, o carregamento terminou
                setIsLoading(false);
            }
        };

        // 2. Mandamos executar a função
        fetchMetrics();

    }, [gameName, tagLine]);

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Voltar à Pesquisa
            </Link>

            <div style={{ marginTop: '20px', padding: '20px', background: '#1e293b', borderRadius: '10px', border: '1px solid #334155' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#f8fafc' }}>
                    Relatório de Suporte: <span style={{ color: '#38bdf8' }}>{gameName}#{tagLine}</span>
                </h2>
                {isLoading && <p style={{ color: '#fbbf24' }}>A carregar dados da Riot... (pode demorar uns segundos)</p>}
                {error && <p style={{ color: '#ef4444' }}>Erro: {error}</p>}
                {metrics && (
                    <pre style={{ background: '#0f172a', padding: '15px', color: '#10b981', overflowX: 'auto' }}>
                        {JSON.stringify(metrics, null, 2)}
                    </pre>
                )}
                <p style={{ color: '#94a3b8', marginTop: '10px' }}>
                    Estrutura pronta! Na Issue #10 vamos ligar o fetch da API e preencher os dados reais.
                </p>
            </div>
        </div>
    );
}