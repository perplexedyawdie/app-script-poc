export interface CustomerDetailsDto {
  id: string;
  name: string;
  email: string;
}

export interface NewCustomerDto {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}