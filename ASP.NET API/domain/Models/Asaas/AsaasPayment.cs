using System.Text.Json.Serialization;

namespace domain.Models.Asaas;

public class AsaasPayment
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("customer")]
    public string Customer { get; set; } = string.Empty;

    [JsonPropertyName("billingType")]
    public string BillingType { get; set; } = string.Empty;

    [JsonPropertyName("value")]
    public decimal Value { get; set; }

    [JsonPropertyName("dueDate")]
    public DateTime DueDate { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("externalReference")]
    public string? ExternalReference { get; set; }

    [JsonPropertyName("installmentCount")]
    public int? InstallmentCount { get; set; }

    [JsonPropertyName("totalValue")]
    public decimal? TotalValue { get; set; }

    [JsonPropertyName("installmentValue")]
    public decimal? InstallmentValue { get; set; }

    [JsonPropertyName("discount")]
    public AsaasDiscount? Discount { get; set; }

    [JsonPropertyName("interest")]
    public AsaasInterest? Interest { get; set; }

    [JsonPropertyName("fine")]
    public AsaasFine? Fine { get; set; }

    [JsonPropertyName("postalService")]
    public bool PostalService { get; set; } = false;

    [JsonPropertyName("callback")]
    public AsaasCallback? Callback { get; set; }

    [JsonPropertyName("creditCard")]
    public AsaasCreditCard? CreditCard { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("pixTransaction")]
    public AsaasPixTransaction? PixTransaction { get; set; }

    [JsonPropertyName("bankSlipUrl")]
    public string? BankSlipUrl { get; set; }

    [JsonPropertyName("invoiceUrl")]
    public string? InvoiceUrl { get; set; }
}

public class AsaasDiscount
{
    [JsonPropertyName("value")]
    public decimal Value { get; set; }

    [JsonPropertyName("dueDateLimitDays")]
    public int DueDateLimitDays { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; } = "FIXED"; // FIXED ou PERCENTAGE
}

public class AsaasInterest
{
    [JsonPropertyName("value")]
    public decimal Value { get; set; }
}

public class AsaasFine
{
    [JsonPropertyName("value")]
    public decimal Value { get; set; }
}

public class AsaasCallback
{
    [JsonPropertyName("successUrl")]
    public string? SuccessUrl { get; set; }

    [JsonPropertyName("autoRedirect")]
    public bool AutoRedirect { get; set; } = true;
}

public class AsaasCreditCard
{
    [JsonPropertyName("holderName")]
    public string HolderName { get; set; } = string.Empty;

    [JsonPropertyName("number")]
    public string Number { get; set; } = string.Empty;

    [JsonPropertyName("expiryMonth")]
    public string ExpiryMonth { get; set; } = string.Empty;

    [JsonPropertyName("expiryYear")]
    public string ExpiryYear { get; set; } = string.Empty;

    [JsonPropertyName("ccv")]
    public string Ccv { get; set; } = string.Empty;
}

public class AsaasPixTransaction
{
    [JsonPropertyName("qrCode")]
    public AsaasPixQrCode? QrCode { get; set; }

    [JsonPropertyName("expirationDate")]
    public DateTime? ExpirationDate { get; set; }
}

public class AsaasPixQrCode
{
    [JsonPropertyName("encodedImage")]
    public string? EncodedImage { get; set; }

    [JsonPropertyName("payload")]
    public string? Payload { get; set; }
}