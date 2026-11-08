var builder = WebApplication.CreateBuilder(args);

// Obter a chave da Riot dos Secrets/configuração

var riotApiKey = builder.Configuration["Riot:ApiKey"]
    ?? throw new InvalidOperationException("Riot:ApiKey não foi configurada nos USer Secrets!");

// Add services to the container.


// Registar o HttpClient configurado para o Riot API
builder.Services.AddHttpClient("RiotClient", client => {
    client.DefaultRequestHeaders.Add("X-Riot-Token", riotApiKey);
});

builder.Services.AddControllers();

// COnfigurar o Redis Cache
builder.Services.AddStackExchangeRedisCache(option => {
    option.Configuration = "localhost:6379";
    option.InstanceName = "LolTracker_";
});
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
