using System.Text.Json.Serialization;

namespace domain.Models.Asaas;

public class AsaasResponse<T>
{
    [JsonPropertyName("object")]
    public string? Object { get; set; }

    [JsonPropertyName("hasMore")]
    public bool HasMore { get; set; }

    [JsonPropertyName("totalCount")]
    public int TotalCount { get; set; }

    [JsonPropertyName("limit")]
    public int Limit { get; set; }

    [JsonPropertyName("offset")]
    public int Offset { get; set; }

    [JsonPropertyName("data")]
    public List<T>? Data { get; set; }
}

public class AsaasSingleResponse<T>
{
    [JsonPropertyName("data")]
    public T? Data { get; set; }

    [JsonPropertyName("errors")]
    public List<AsaasError>? Errors { get; set; }
}

public class AsaasError
{
    [JsonPropertyName("code")]
    public string? Code { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }
}

// Enums para tipos de cobrança
public static class AsaasBillingType
{
    public const string BOLETO = "BOLETO";
    public const string CREDIT_CARD = "CREDIT_CARD";
    public const string PIX = "PIX";
    public const string UNDEFINED = "UNDEFINED";
}

// Status de pagamento
public static class AsaasPaymentStatus
{
    public const string PENDING = "PENDING";
    public const string RECEIVED = "RECEIVED";
    public const string CONFIRMED = "CONFIRMED";
    public const string OVERDUE = "OVERDUE";
    public const string REFUNDED = "REFUNDED";
    public const string RECEIVED_IN_CASH = "RECEIVED_IN_CASH";
    public const string REFUND_REQUESTED = "REFUND_REQUESTED";
    public const string CHARGEBACK_REQUESTED = "CHARGEBACK_REQUESTED";
    public const string CHARGEBACK_DISPUTE = "CHARGEBACK_DISPUTE";
    public const string AWAITING_CHARGEBACK_REVERSAL = "AWAITING_CHARGEBACK_REVERSAL";
}