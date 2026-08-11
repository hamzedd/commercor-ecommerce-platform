export type CreateAddressRequestType = {
  country: string;
  city: string;
  street: string;
  detail: string;
  phoneNumber: string;
};

export type AddressType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  customerId: string;
  country: string;
  city: string;
  street: string;
  detail: string;
  phoneNumber: string;
};
