import { Injectable } from '@angular/core';
import {
  IBaseEnvironmentSettings,
  IBaseAuthenticationSettings,
} from '../Constants/application';

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  public baseUrls: IBaseEnvironmentSettings;
  public authenticationConfiguration: IBaseAuthenticationSettings;

  constructor() {
    const globalThis: any = window || { __env: {} };
    const env: Env = globalThis.__env;

    // copy window variables to service
    this.baseUrls = { ...this.baseUrls, ...env.baseUrls };
    this.authenticationConfiguration = {
      ...this.authenticationConfiguration,
      ...env.authenticationConfiguration,
    };
  }
}

interface Env {
  baseUrls: IBaseEnvironmentSettings;
  authenticationConfiguration: IBaseAuthenticationSettings;
}
