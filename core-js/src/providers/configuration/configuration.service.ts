import { Injectable } from '@angular/core';

declare const webpackGlobalVars: any;

export class ConfigurationService {
  public static baseUrl = webpackGlobalVars.baseUrl;
}
