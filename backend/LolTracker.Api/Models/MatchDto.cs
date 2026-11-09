using System.Text.Json.Serialization;

namespace LolTracker.Api.Models;

public record MatchDto(
    [property: JsonPropertyName("metadata")] MatchMetadataDto Metadata,
    [property: JsonPropertyName("info")] MatchInfoDto Info
);

public record MatchMetadataDto(
    [property: JsonPropertyName("matchId")] string MatchId,
    [property: JsonPropertyName("participants")] List<string> Participants
);

public record MatchInfoDto(
    [property: JsonPropertyName("gameDuration")] long GameDuration,
    [property: JsonPropertyName("gameMode")] string GameMode,
    [property: JsonPropertyName("participants")] List<ParticipantDto> Participants
);

public record ParticipantDto(
    [property: JsonPropertyName("teamId")] int TeamId,
    [property: JsonPropertyName("puuid")] string Puuid,
    [property: JsonPropertyName("summonerName")] string SummonerName,
    [property: JsonPropertyName("riotIdGameName")] string RiotIdGameName,
    [property: JsonPropertyName("riotIdTagline")] string RiotIdTagline,
    [property: JsonPropertyName("championName")] string ChampionName,
    [property: JsonPropertyName("teamPosition")] string TeamPosition, // "UTILITY" = Support, "BOTTOM" = ADC
    [property: JsonPropertyName("win")] bool Win,
    [property: JsonPropertyName("kills")] int Kills,
    [property: JsonPropertyName("deaths")] int Deaths,
    [property: JsonPropertyName("assists")] int Assists,
    [property: JsonPropertyName("visionScore")] int VisionScore,
    [property: JsonPropertyName("detectorWardsPlaced")] int DetectorWardsPlaced, // Control Wards
    [property: JsonPropertyName("wardsPlaced")] int WardsPlaced,
    [property: JsonPropertyName("wardsKilled")] int WardsKilled,
    [property: JsonPropertyName("item0")] int Item0,
    [property: JsonPropertyName("item1")] int Item1,
    [property: JsonPropertyName("item2")] int Item2,
    [property: JsonPropertyName("item3")] int Item3,
    [property: JsonPropertyName("item4")] int Item4,
    [property: JsonPropertyName("item5")] int Item5,
    [property: JsonPropertyName("item6")] int Item6, // Ward trinket
    [property: JsonPropertyName("totalDamageDealtToChampions")] int TotalDamageDealtToChampions
);