import { DataProviderConfig } from '@shared/auth/models';

export const environment: DataProviderConfig = {
  client_id: 'app-cli',
  grant_type: 'password',
  datasourceUrl: 'https://platform.fintacharts.com',
  realm: 'fintatech',
  realtimeDatasourceUrl: 'wss://platform.fintacharts.com/api/streaming/ws/v1/realtime',
}
