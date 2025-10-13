using domain.Models.Asaas;

namespace domain.IServices;

public interface IAsaasService
{
    Task<AsaasSingleResponse<AsaasCustomer>> CreateCustomerAsync(AsaasCustomer customer);
    Task<AsaasSingleResponse<AsaasCustomer>> GetCustomerByEmailAsync(string email);
    Task<AsaasSingleResponse<AsaasPayment>> CreatePaymentAsync(AsaasPayment payment);
    Task<AsaasSingleResponse<AsaasPayment>> GetPaymentAsync(string paymentId);
}