export interface DataProviderConfig {
  client_id: string,
  grant_type: string,
  datasourceUrl: string,
  realtimeDatasourceUrl: string,
  realm: string,
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  not_before_policy: number;
  session_state: string;
  scope: string;
}

export const TOKEN_LOCAL_STORAGE_KEY = 'ACCESS_TOKEN';
