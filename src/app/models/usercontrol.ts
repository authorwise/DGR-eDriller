export class UserLoginDto {
  username: string;
  password: string;
}

export interface IUserStoreDto {
  isAdmin: string | boolean,
  username: string,
  token: string,
  tokenExpirationDate?: Date,
  sult?: string
}

export interface IServerResponse {
  data: IUserStoreDto
}