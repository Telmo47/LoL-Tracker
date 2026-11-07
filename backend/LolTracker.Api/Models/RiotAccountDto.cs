using System.Text.Json.Serialization;

namespace LoLTracker.Api.Models;

public record RiotAccountDto([property:JsonPropertyName("puuid")] string Puuid, [property: JsonPropertyName("gameName")] string GameName, [property: JsonPropertyName("tagLine")] string TagLine);

