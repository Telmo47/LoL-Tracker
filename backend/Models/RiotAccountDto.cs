using System.Text.Json.Serialization;

namespace LoL_Tracker.Api.Models;

public class RiotAccountDto([property:JsonPropertyName("puuid")] string Puuid, [property: JsonPropertyName("gameName")] string GameName, [property: JsonPropertyName("tagLine")] string TagLine);

