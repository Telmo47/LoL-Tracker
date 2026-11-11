namespace LolTracker.Api.Models;

public record ProfileDto(
    string GameName,
    string TagLine,
    int ProfileIconId,
    long SummonerLevel,
    string Tier,
    string Rank,
    int LeaguePoints
);