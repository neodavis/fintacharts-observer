import { InjectionToken } from '@angular/core';

import { DataProviderConfig } from '@shared/auth/models';

export const DATA_PROVIDER_CONFIG = new InjectionToken<DataProviderConfig>('AUTH_CONFIG');
