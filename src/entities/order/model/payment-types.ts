export interface PayOrderRequest {
  holderName: string;
  number: string;
  expMonth: number;
  expYear: number;
  cvv: string;
}
