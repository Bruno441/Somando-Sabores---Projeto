using System.Text.Json.Serialization;

namespace domain.Models.Asaas;

public class AsaasCustomer
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("cpfCnpj")]
    public string? CpfCnpj { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("mobilePhone")]
    public string? MobilePhone { get; set; }

    [JsonPropertyName("address")]
    public string? Address { get; set; }

    [JsonPropertyName("addressNumber")]
    public string? AddressNumber { get; set; }

    [JsonPropertyName("complement")]
    public string? Complement { get; set; }

    [JsonPropertyName("province")]
    public string? Province { get; set; }

    [JsonPropertyName("city")]
    public string? City { get; set; }

    [JsonPropertyName("state")]
    public string? State { get; set; }

    [JsonPropertyName("country")]
    public string? Country { get; set; }

    [JsonPropertyName("postalCode")]
    public string? PostalCode { get; set; }

    [JsonPropertyName("externalReference")]
    public string? ExternalReference { get; set; }

    [JsonPropertyName("notificationDisabled")]
    public bool NotificationDisabled { get; set; } = false;

    [JsonPropertyName("additionalEmails")]
    public string? AdditionalEmails { get; set; }

    [JsonPropertyName("municipalInscription")]
    public string? MunicipalInscription { get; set; }

    [JsonPropertyName("stateInscription")]
    public string? StateInscription { get; set; }

    [JsonPropertyName("observations")]
    public string? Observations { get; set; }
}