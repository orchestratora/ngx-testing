import {
  ComponentFactory,
  DebugElement,
  EventEmitter,
  NgModule,
  Type,
} from '@angular/core';

import { OutputMock } from './output-mock';

export interface TestingModuleExtras {
  template?: string;
  projectContent?: string;
  ngModule?: NgModule;
}

// tslint:disable-next-line:no-empty-interface
export interface TestingComponentModuleExtras extends TestingModuleExtras {}

export interface TestingDirectiveModuleExtras extends TestingModuleExtras {
  hostTag?: string;
  hostComponent?: Type<any>;
  templateBindings?: string | {};
  useStarSyntax?: boolean;
}

export interface TestingExtraConfig
  extends TestingModuleExtras,
    TestingComponentModuleExtras,
    TestingDirectiveModuleExtras {}

export enum TestTypeKind {
  Component,
  Directive,
}

export interface HostComponent<T> {
  instance: T | undefined;
}

export type AsHostComponent<T> = HostComponent<T> &
  { [K in keyof T]: T[K] extends EventEmitter<infer A> ? OutputMock<A> : T[K] };

export type TemplateBindings = ComponentFactory<any>['inputs'];
export type TemplateBinding = TemplateBindings extends Array<infer T>
  ? T
  : unknown;

export interface DirectiveIO {
  inputs: TemplateBindings;
  outputs: TemplateBindings;
}

export interface DebugElementTyped<T> extends DebugElement {
  readonly componentInstance: T;
}
