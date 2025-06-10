export interface ServiceResponse<T> {
  message: string;
  data?: T;
  success?: boolean; 
}