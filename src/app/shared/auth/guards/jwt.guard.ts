import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { TOKEN_LOCAL_STORAGE_KEY } from '@shared/auth/models';

export const JwtGuard: CanActivateFn = () => {
  const router = inject(Router);

  // TODO: implement better route guard after corresponding endpoint found
  if (localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)) {
    return true
  }

  router.navigate(['auth'])
  return false;
}
