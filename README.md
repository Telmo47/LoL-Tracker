# 🛡️ LoL Support Tracker

O **LoL Support Tracker** é uma aplicação web full-stack desenvolvida para analisar o impacto real de um jogador na *bot lane* de League of Legends. Em vez do KDA tradicional, o foco está em métricas cruciais para a role de Suporte, como Visão por Minuto (VSPM), Kill Participation (KP%), Control Wards e Sinergia com ADCs.

## 🏗️ Arquitetura do Projeto

O projeto adota uma arquitetura limpa com separação total entre Backend e Frontend:

* **Backend (API):** Desenvolvido em **C# .NET Core**. Consome a Riot Games API, calcula as métricas de performance (estatísticas por campeão e sinergias) e serve os dados ao frontend. Utiliza **Redis** para cache (evitando *rate limits* da Riot).
* **Frontend (UI):** Desenvolvido em **React** (com Vite e TypeScript). Interface responsiva, com formatação visual condicional (vitórias/derrotas) e painéis de KPIs desenhados com CSS moderno.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [.NET 8.0/9.0 SDK](https://dotnet.microsoft.com/)
* [Node.js](https://nodejs.org/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop) (para o Redis)
* Chave de Developer da Riot Games (Riot API Key)

### 1. Iniciar o Redis via Docker
A API precisa do Redis a correr localmente para fazer o *caching* dos *matches*. Corre o seguinte comando no terminal para levantar uma instância do Redis na porta padrão (6379):
```bash
docker run --name lol-redis -p 6379:6379 -d redis
```

### 2. Configurar e Correr o Backend (.NET)
Navega para a pasta da API, configura a tua chave da Riot nos User Secrets e corre o servidor:
```bash
cd backend/LolTracker.Api
dotnet user-secrets set "Riot:ApiKey" "TUA_RIOT_API_KEY_AQUI"
dotnet run
```
A API ficará disponível em http://localhost:5229.

### 3. Correr o Frontend (React)
Abre um novo terminal, navega para a pasta do frontend, instala as dependências e inicia a app:
```bash
cd frontend
npm install
npm run dev
```
O frontend ficará disponível em http://localhost:5173.

