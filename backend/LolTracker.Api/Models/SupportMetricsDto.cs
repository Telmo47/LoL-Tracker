namespace LolTracker.Api.Models;

public record SupportMetricsDto(
    string Puuid,
    int TotalGamesAnalyzed,
    double WinRate,
    double AvgVisionScorePerMinute,
    double AvgKillParticipation,
    double AvgControlWards,
    double AvgWardsKilled,
    double AvgKda,
    List<ChampionStatDto> ChampionStats,
    List<MatchSummaryDto> MatchHistory
);

public record ChampionStatDto(
    string ChampionName,
    int GamesPlayed,
    int Wins,
    double WinRate,
    double AvgVisionScorePerMinute,
    double AvgKillParticipation,
    double AvgKda
);

public record MatchSummaryDto(
    string MatchId,
    string ChampionName,
    bool Win,
    int Kills,
    int Deaths,
    int Assists,
    double VisionScorePerMinute,
    double KillParticipation,
    int ControlWards,
    int WardsKilled,
    long GameDurationInMinutes,
    List<int> Items
);