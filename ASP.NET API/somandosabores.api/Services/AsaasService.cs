using domain.IServices;
using domain.Models.Asaas;
using System.Text;
using System.Text.Json;

namespace somandosabores.api.Services;

public class AsaasService : IAsaasService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AsaasService> _logger;

    public AsaasService(HttpClient httpClient, IConfiguration configuration, ILogger<AsaasService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        // Configurar base URL e headers
        var baseUrl = _configuration["Asaas:BaseUrl"] ?? "https://sandbox.asaas.com/api/v3/";
        var apiKey = Environment.GetEnvironmentVariable("ASAAS_API_KEY") ?? _configuration["Asaas:ApiKey"];

        if (string.IsNullOrEmpty(apiKey))
        {
            throw new InvalidOperationException("ASAAS_API_KEY não foi configurada. Configure a variável de ambiente ASAAS_API_KEY.");
        }

        _httpClient.BaseAddress = new Uri(baseUrl);
        _httpClient.DefaultRequestHeaders.Add("access_token", apiKey);
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "SomandoSabores/1.0");
    }

    public async Task<AsaasSingleResponse<AsaasCustomer>> CreateCustomerAsync(AsaasCustomer customer)
    {
        try
        {
            var json = JsonSerializer.Serialize(customer, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("customers", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation($"Asaas CreateCustomer Response: {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                var customerResponse = JsonSerializer.Deserialize<AsaasCustomer>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return new AsaasSingleResponse<AsaasCustomer>
                {
                    Data = customerResponse
                };
            }
            else
            {
                var errorResponse = JsonSerializer.Deserialize<AsaasResponse<AsaasError>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return new AsaasSingleResponse<AsaasCustomer>
                {
                    Errors = errorResponse?.Data
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar cliente no Asaas");
            return new AsaasSingleResponse<AsaasCustomer>
            {
                Errors = new List<AsaasError>
                {
                    new AsaasError
                    {
                        Code = "INTERNAL_ERROR",
                        Description = ex.Message
                    }
                }
            };
        }
    }

    public async Task<AsaasSingleResponse<AsaasCustomer>> GetCustomerByEmailAsync(string email)
    {
        try
        {
            var response = await _httpClient.GetAsync($"customers?email={email}");
            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation($"Asaas GetCustomerByEmail Response: {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                var customerListResponse = JsonSerializer.Deserialize<AsaasResponse<AsaasCustomer>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                var customer = customerListResponse?.Data?.FirstOrDefault();

                return new AsaasSingleResponse<AsaasCustomer>
                {
                    Data = customer
                };
            }
            else
            {
                var errorResponse = JsonSerializer.Deserialize<AsaasResponse<AsaasError>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return new AsaasSingleResponse<AsaasCustomer>
                {
                    Errors = errorResponse?.Data
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar cliente no Asaas por email");
            return new AsaasSingleResponse<AsaasCustomer>
            {
                Errors = new List<AsaasError>
                {
                    new AsaasError
                    {
                        Code = "INTERNAL_ERROR",
                        Description = ex.Message
                    }
                }
            };
        }
    }

    public async Task<AsaasSingleResponse<AsaasPayment>> CreatePaymentAsync(AsaasPayment payment)
    {
        try
        {
            var json = JsonSerializer.Serialize(payment, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("payments", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation($"Asaas CreatePayment Response: {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                var paymentResponse = JsonSerializer.Deserialize<AsaasPayment>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return new AsaasSingleResponse<AsaasPayment>
                {
                    Data = paymentResponse
                };
            }
            else
            {
                var errorResponse = JsonSerializer.Deserialize<AsaasResponse<AsaasError>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return new AsaasSingleResponse<AsaasPayment>
                {
                    Errors = errorResponse?.Data
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar cobrança no Asaas");
            return new AsaasSingleResponse<AsaasPayment>
            {
                Errors = new List<AsaasError>
                {
                    new AsaasError
                    {
                        Code = "INTERNAL_ERROR",
                        Description = ex.Message
                    }
                }
            };
        }
    }

    public async Task<AsaasSingleResponse<AsaasPayment>> GetPaymentAsync(string paymentId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"payments/{paymentId}");
            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation($"Asaas GetPayment Response: {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                var paymentResponse = JsonSerializer.Deserialize<AsaasPayment>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return new AsaasSingleResponse<AsaasPayment>
                {
                    Data = paymentResponse
                };
            }
            else
            {
                var errorResponse = JsonSerializer.Deserialize<AsaasResponse<AsaasError>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return new AsaasSingleResponse<AsaasPayment>
                {
                    Errors = errorResponse?.Data
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar cobrança no Asaas");
            return new AsaasSingleResponse<AsaasPayment>
            {
                Errors = new List<AsaasError>
                {
                    new AsaasError
                    {
                        Code = "INTERNAL_ERROR",
                        Description = ex.Message
                    }
                }
            };
        }
    }
}