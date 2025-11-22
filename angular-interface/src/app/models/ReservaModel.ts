export interface Reserva {
    id: string;
    cpfOuCnpj: string;
    dataReserva: string;
    qtdConvidados: number;
    nome: string;
    email: string;
    quantidade: number;
    nomesConvidados: string[];
    total: number;
    invoiceUrl: string;
    status: number; // 0 = Pendente, 1 = Confirmado/Pago
}
