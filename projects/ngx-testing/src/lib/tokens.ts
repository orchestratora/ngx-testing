import { InjectionToken, Type } from '@angular/core';

import { TestingExtraConfig, TestTypeKind } from './types';

/**
 * @internal
 */
export const TestModuleToken = new InjectionToken<Type<any>>('TestModuleToken');

/**
 * @internal
 */
export const TestTypeToken = new InjectionToken<Type<any>>('TestTypeToken');

/**
 * @internal
 */
export const TestTypeKindToken = new InjectionToken<TestTypeKind>('TestTypeKindToken');

/**
 * @internal
 */
export const ExtraConfigToken = new InjectionToken<TestingExtraConfig>(
  'ExtraConfigToken',
);
