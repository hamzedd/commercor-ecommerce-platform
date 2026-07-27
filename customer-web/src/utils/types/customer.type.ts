export type RegisterCustomerRequestType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export type CustomerLoginRequestType = {
  username: string;
  password: string;
};

export type CustomerLoginResponseType = {
  accessToken: string;
};

export type CustomerProfileType = {
  id: string;
  created_at: string;
  updated_at: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};

export type UpdateCustomerProfileRequestType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
};
