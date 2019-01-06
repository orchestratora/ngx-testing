import { InjectionToken, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DirectiveIO } from './types';

/**
 * @internal
 */
export function getDirectiveIO<T>(dirType: Type<T>): DirectiveIO {
  const { inputs, outputs } = (dirType as any).ngBaseDef;
  const defToIO = def =>
    Object.keys(def).map(key => ({ propName: key, templateName: def[key] || key }));

  return {
    inputs: defToIO(inputs),
    outputs: defToIO(outputs),
  };
}

/**
 * @internal
 */
export function get<T>(type: Type<T> | InjectionToken<T>): T {
  return TestBed.get(type);
}
