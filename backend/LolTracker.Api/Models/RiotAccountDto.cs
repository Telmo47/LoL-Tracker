using System.Text.Json.Serialization;

namespace LolTracker.Api.Models;

public record RiotAccountDto([property:JsonPropertyName("puuid")] string Puuid, [property: JsonPropertyName("gameName")] string GameName, [property: JsonPropertyName("tagLine")] string TagLine);

