import { InjectionToken, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DirectiveIO, TemplateBinding, TemplateBindings } from './types';

/**
 * @internal
 * Defined by Angular
 */
interface PropDecoratorFactory {
  bindingPropertyName?: string;
  ngMetadataName: string;
}

/**
 * @internal
 * Defined by Angular
 */
interface PropMetadata {
  [prop: string]: PropDecoratorFactory[];
}

interface IOMetadata {
  [prop: string]: PropDecoratorFactory;
}

/**
 * @internal
 */
export function getDirectiveIO<T>(dirType: Type<T>): DirectiveIO {
  const propMeta = dirType['__prop__metadata__'] as PropMetadata;

  const inputsMeta = filterPropMeta(propMeta, 'Input');
  const outputsMeta = filterPropMeta(propMeta, 'Output');

  return {
    inputs: propMetaToTemplateBindings(inputsMeta),
    outputs: propMetaToTemplateBindings(outputsMeta),
  };
}

function propMetaToTemplateBindings(meta: IOMetadata): TemplateBindings {
  return Object.keys(meta).map(
    propName =>
      ({
        propName,
        templateName: meta[propName].bindingPropertyName || propName,
      } as TemplateBinding),
  );
}

function filterPropMeta(
  obj: PropMetadata,
  type: 'Input' | 'Output',
): IOMetadata {
  return Object.keys(obj).reduce(
    (acc, k) => {
      const meta = obj[k].find(m => m.ngMetadataName === type);
      return meta ? { ...acc, [k]: meta } : acc;
    },
    {} as IOMetadata,
  );
}

/**
 * @internal
 */
export function get<T>(type: Type<T> | InjectionToken<T>): T {
  return TestBed.get(type);
}

/**
 * @internal
 */
export function mergeArrays<T>(...arrays: T[][]): T[] {
  return arrays.reduce((acc, arr) => [...acc, ...toArray(arr)], []);
}

/**
 * @internal
 */
export function toArray<T>(arr?: T[]): T[] {
  return arr ? arr : [];
}
