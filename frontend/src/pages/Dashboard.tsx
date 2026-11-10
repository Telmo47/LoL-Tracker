import { useParams, Link } from 'react-router-dom';

export default function Dashboard() {
    const { gameName, tagLine } = useParams<{ gameName: string; tagLine: string }>();

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Voltar à Pesquisa
            </Link>

            <div style={{ marginTop: '20px', padding: '20px', background: '#1e293b', borderRadius: '10px', border: '1px solid #334155' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#f8fafc' }}>
                    Relatório de Suporte: <span style={{ color: '#38bdf8' }}>{gameName}#{tagLine}</span>
                </h2>
                <p style={{ color: '#94a3b8', marginTop: '10px' }}>
                    Estrutura pronta! Na Issue #10 vamos ligar o fetch da API e preencher os dados reais.
                </p>
            </div>
        </div>
    );
}