using LolTracker.Api.Models;

namespace LolTracker.Api.Services;

public interface ISupportMetricsService
{
    SupportMetricsDto AnalyzeSupportPerformance(string puuid, IEnumerable<MatchDto> matches);
}

public class SupportMetricsService : ISupportMetricsService
{
    public SupportMetricsDto AnalyzeSupportPerformance(string puuid, IEnumerable<MatchDto> matches)
    {
        var matchSummaries = new List<MatchSummaryDto>();

        foreach (var match in matches)
        {
            // 1. Ignorar partidas inválidas ou remakes (menos de 5 minutos de jogo)
            if (match?.Info?.Participants == null || match.Info.GameDuration < 300)
                continue;

            // 2. Encontrar o teu jogador na partida
            var me = match.Info.Participants.FirstOrDefault(p => p.Puuid == puuid);
            if (me == null)
                continue;

            // 3. Cálculos da partida individual
            double durationMinutes = match.Info.GameDuration / 60.0;
            
            // Total de kills da tua equipa (para calcular KP%)
            int teamKills = match.Info.Participants
                .Where(p => p.TeamId == me.TeamId)
                .Sum(p => p.Kills);

            double kp = teamKills > 0 
                ? Math.Round(((double)(me.Kills + me.Assists) / teamKills) * 100.0, 1) 
                : 0.0;

            double vspm = durationMinutes > 0 
                ? Math.Round(me.VisionScore / durationMinutes, 2) 
                : 0.0;

            var items = new List<int> { me.Item0, me.Item1, me.Item2, me.Item3, me.Item4, me.Item5, me.Item6 };

            matchSummaries.Add(new MatchSummaryDto(
                MatchId: match.Metadata.MatchId,
                ChampionName: me.ChampionName,
                Win: me.Win,
                Kills: me.Kills,
                Deaths: me.Deaths,
                Assists: me.Assists,
                VisionScorePerMinute: vspm,
                KillParticipation: kp,
                ControlWards: me.DetectorWardsPlaced,
                WardsKilled: me.WardsKilled,
                GameDurationInMinutes: (long)durationMinutes,
                Items: items
            ));
        }

        int totalGames = matchSummaries.Count;
        if (totalGames == 0)
        {
            return new SupportMetricsDto(puuid, 0, 0, 0, 0, 0, 0, 0, new(), new());
        }

        // 4. Médias Gerais de Suporte
        double winRate = Math.Round((double)matchSummaries.Count(m => m.Win) / totalGames * 100.0, 1);
        double avgVspm = Math.Round(matchSummaries.Average(m => m.VisionScorePerMinute), 2);
        double avgKp = Math.Round(matchSummaries.Average(m => m.KillParticipation), 1);
        double avgControlWards = Math.Round(matchSummaries.Average(m => m.ControlWards), 1);
        double avgWardsKilled = Math.Round(matchSummaries.Average(m => m.WardsKilled), 1);

        int totalKills = matchSummaries.Sum(m => m.Kills);
        int totalDeaths = matchSummaries.Sum(m => m.Deaths);
        int totalAssists = matchSummaries.Sum(m => m.Assists);
        double avgKda = totalDeaths > 0 
            ? Math.Round((double)(totalKills + totalAssists) / totalDeaths, 2) 
            : (totalKills + totalAssists);

        // 5. Agrupamento por Campeão (Thresh, Janna, Lux, Poppy, etc.)
        var championStats = matchSummaries
            .GroupBy(m => m.ChampionName)
            .Select(g =>
            {
                int games = g.Count();
                int wins = g.Count(m => m.Win);
                int deaths = g.Sum(m => m.Deaths);
                int killsAssists = g.Sum(m => m.Kills + m.Assists);

                return new ChampionStatDto(
                    ChampionName: g.Key,
                    GamesPlayed: games,
                    Wins: wins,
                    WinRate: Math.Round((double)wins / games * 100.0, 1),
                    AvgVisionScorePerMinute: Math.Round(g.Average(m => m.VisionScorePerMinute), 2),
                    AvgKillParticipation: Math.Round(g.Average(m => m.KillParticipation), 1),
                    AvgKda: deaths > 0 ? Math.Round((double)killsAssists / deaths, 2) : killsAssists
                );
            })
            .OrderByDescending(c => c.GamesPlayed)
            .ToList();

        return new SupportMetricsDto(
            Puuid: puuid,
            TotalGamesAnalyzed: totalGames,
            WinRate: winRate,
            AvgVisionScorePerMinute: avgVspm,
            AvgKillParticipation: avgKp,
            AvgControlWards: avgControlWards,
            AvgWardsKilled: avgWardsKilled,
            AvgKda: avgKda,
            ChampionStats: championStats,
            MatchHistory: matchSummaries
        );
    }
}