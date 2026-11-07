using System.Text.Json.Serialization;

namespace LolTracker.Api.Models;

public record SummonerDto([property: JsonPropertyName("id")] string Id, [property: JsonPropertyName("accountId")] string accountId, [property: JsonPropertyName("puuid")] string Puuid, [property: JsonPropertyName("profileIconId")] intProfileIconId, [property: JsonPropertyName("summonerLevel")] long summonerLevel);

