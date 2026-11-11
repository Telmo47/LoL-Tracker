using System.Text.Json.Serialization;

namespace LolTracker.Api.Models;

public record SummonerDto(
    [property: JsonPropertyName("id")] string Id, 
    [property: JsonPropertyName("accountId")] string AccountId, 
    [property: JsonPropertyName("puuid")] string Puuid, 
    [property: JsonPropertyName("profileIconId")] int ProfileIconId, 
    [property: JsonPropertyName("summonerLevel")] long SummonerLevel
);