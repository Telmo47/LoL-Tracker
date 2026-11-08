using System.Net;
using System.Net.Http.Json;
using LolTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace LolTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrackerController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    // O ASP.NET injeta a fábrica de HttpClients automaticamente no construtor
    public TrackerController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("summoner/{gameName}/{tagLine}")]
    public async Task<IActionResult> GetSummoner(string gameName, string tagLine)
    {
        // 1. Criar o cliente que já tem o cabeçalho 'X-Riot-Token' configurado
        var client = _httpClientFactory.CreateClient("RiotClient");

        // 2. Montar a URL da Riot (para a região da Europa)
        var url = $"https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}";

        // 3. Fazer o pedido HTTP GET à Riot
        var response = await client.GetAsync(url);

        // 4. Tratar possíveis erros (ex: jogador não existe ou Riot fora do ar)
        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return NotFound(new { message = $"Jogador {gameName}#{tagLine} não foi encontrado na Riot Games." });
        }

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, new { message = "Erro ao comunicar com a Riot API." });
        }

        // 5. Deserializar o JSON da Riot diretamente para o RiotAccountDto
        var account = await response.Content.ReadFromJsonAsync<RiotAccountDto>();

        return Ok(account);
    }

    [HttpGet("matches/{puuid}")]
    public async Task<IActionResult> GetMatches(string puuid, [FromQuery] int count = 20)
    {
        var client = _httpClientFactory.CreateClient("RiotClient");

        // 1. Obter a lista com os IDs das últimas partidas (máximo 20)
        var idsUrl = $"https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={count}";
        var idsResponse = await client.GetAsync(idsUrl);

        if (!idsResponse.IsSuccessStatusCode)
        {
            return StatusCode((int)idsResponse.StatusCode, new { message = "Erro ao obter o histórico de IDs da Riot." });
        }

        var matchIds = await idsResponse.Content.ReadFromJsonAsync<List<string>>();
        if (matchIds == null || matchIds.Count == 0)
        {
            return Ok(new List<MatchDto>()); // Jogador não tem partidas recentes
        }

        // 2. Descarregar as partidas com um limite de concorrência (máx 4 em simultâneo para não estourar o limite da Riot)
        var matches = new System.Collections.Concurrent.ConcurrentBag<MatchDto>();
        var parallelOptions = new ParallelOptions { MaxDegreeOfParallelism = 4 };
        await Parallel.ForEachAsync(matchIds, parallelOptions, async (matchId, cancellationToken) =>
        {
            var matchUrl = $"https://europe.api.riotgames.com/lol/match/v5/matches/{matchId}";
            try
            {
                var match = await client.GetFromJsonAsync<MatchDto>(matchUrl, cancellationToken);
                if (match != null)
                {
                    matches.Add(match);
                }
            }
            catch (HttpRequestException ex)
            {
                // Se por acaso uma partida falhar, não deita a API abaixo
                Console.WriteLine($"Erro ao descarregar a partida {matchId}: {ex.Message}");
            }
        });
        // 3. Devolver as partidas descarregadas
        return Ok(matches);

        // 4. Devolver a lista completa com as 20 partidas detalhadas
        return Ok(matches);
    }
}