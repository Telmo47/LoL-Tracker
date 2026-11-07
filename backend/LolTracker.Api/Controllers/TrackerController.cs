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
}