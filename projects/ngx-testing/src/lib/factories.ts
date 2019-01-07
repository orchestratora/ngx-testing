import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Host } from './host';
import { HostComponentService } from './host-component.service';
import { HostDirectiveService } from './host-directive.service';
import { NgxTestingModule } from './ngx-testing.module';
import {
  TestingComponentModuleExtras,
  TestingDirectiveModuleExtras,
} from './types';

export interface TestingFactory<T, H extends Host> {
  testModule: NgxTestingModule<T>;
  getHost(): H;
  createComponent(): Promise<H>;
}

export function getTestingForComponent<T>(
  type: Type<T>,
  extras?: TestingComponentModuleExtras,
): TestingFactory<T, HostComponentService<T>> {
  const testModule = NgxTestingModule.forComponent<T>(type, extras);
  const getHost = () =>
    TestBed.get(HostComponentService) as HostComponentService<T>;
  const createComponent = () =>
    getHost()
      .createComponent()
      .then(getHost);

  return { testModule, getHost, createComponent };
}

export function getTestingForDirective<T>(
  type: Type<T>,
  extras?: TestingDirectiveModuleExtras,
): TestingFactory<T, HostDirectiveService<T>> {
  const testModule = NgxTestingModule.forDirective<T>(type, extras);
  const getHost = () =>
    TestBed.get(HostDirectiveService) as HostDirectiveService<T>;
  const createComponent = () =>
    getHost()
      .createComponent()
      .then(getHost);

  return { testModule, getHost, createComponent };
}
