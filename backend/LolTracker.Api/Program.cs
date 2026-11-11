var builder = WebApplication.CreateBuilder(args);

// Obter a chave da Riot dos Secrets/configuração

var riotApiKey = builder.Configuration["Riot:ApiKey"]
    ?? throw new InvalidOperationException("Riot:ApiKey não foi configurada nos USer Secrets!");

// Add services to the container.


// Registar o HttpClient configurado para o Riot API
builder.Services.AddHttpClient("RiotClient", client => {
    client.DefaultRequestHeaders.Add("X-Riot-Token", riotApiKey);
});

// Configurar a política de CORS para o React (Vite na porta 5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// Registar o serviço de métricas de suporte
builder.Services.AddScoped<LolTracker.Api.Services.ISupportMetricsService, LolTracker.Api.Services.SupportMetricsService>();

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

// Ativar o CORS antes da autorização e controllers!
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
