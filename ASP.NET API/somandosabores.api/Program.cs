using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;
using domain.IServices;
using infra.DbContext;
using Microsoft.EntityFrameworkCore;
using somandosabores.api.Services;
using domain.Enums;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(Environment.GetEnvironmentVariable("CONNECTION_STRING") ??
                      builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions =>
        {
            npgsqlOptions.MapEnum<StatusPrecificacao>("status_pagamento");
            npgsqlOptions.MapEnum<OpcoesServico>("opcoes_servico");
        });
});

builder.Services.AddCors(options => {
    options.AddPolicy("AllowSpecificOrigin", 
    builder => {
        builder.WithOrigins(
            "http://localhost:4200",
            "https://somando-sabores-projeto.vercel.app"
        )
        .WithHeaders("Content-Type", "Authorization")
        .WithMethods("GET", "POST", "PUT", "DELETE");
    });
});

//builder.Services.AddScoped<IEventoService, EventoService>();
builder.Services.AddScoped<IReservaService, ReservaService>();
builder.Services.AddScoped<IAlunoService, AlunoService>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IConvidadoService, ConvidadoService>();
builder.Services.AddScoped<IPacoteService, PacoteService>();
builder.Services.AddScoped<IPagamentoService, PagamentoService>();
builder.Services.AddScoped<IPrecificacaoService, PrecificacaoService>();

// Configurar HttpClient para Asaas
builder.Services.AddHttpClient<IAsaasService, AsaasService>();
builder.Services.AddScoped<IAsaasService, AsaasService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// Swagger habilitado em todos os ambientes para facilitar testes
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Somando Sabores API V1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
