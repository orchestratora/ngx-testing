import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import {
  ExtraConfigToken,
  TestModuleToken,
  TestTypeKindToken,
  TestTypeToken,
} from './tokens';
import {
  TestingComponentModuleExtras,
  TestingDirectiveModuleExtras,
  TestTypeKind,
} from './types';
import { mergeArrays } from './util';

@NgModule({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class NgxTestingModule<T = any> {
  static forComponent<T>(
    compType: Type<T>,
    extras: TestingComponentModuleExtras = {},
  ): ModuleWithProviders<NgxTestingModule<T>> {
    const testModule = getTestingModuleFor(compType, compType, extras.ngModule);
    return {
      ngModule: testModule,
      providers: [
        { provide: TestModuleToken, useValue: testModule },
        { provide: TestTypeToken, useValue: compType },
        { provide: TestTypeKindToken, useValue: TestTypeKind.Component },
        { provide: ExtraConfigToken, useValue: extras },
      ],
    };
  }

  static forDirective<T>(
    dirType: Type<T>,
    extras: TestingDirectiveModuleExtras = {},
  ): ModuleWithProviders<NgxTestingModule<T>> {
    const testModule = getTestingModuleFor(
      dirType,
      extras.hostComponent,
      extras.ngModule,
    );
    return {
      ngModule: testModule,
      providers: [
        { provide: TestModuleToken, useValue: testModule },
        { provide: TestTypeToken, useValue: dirType },
        { provide: TestTypeKindToken, useValue: TestTypeKind.Directive },
        { provide: ExtraConfigToken, useValue: extras },
      ],
    };
  }
}

function getTestingModuleFor<T>(
  type: Type<T>,
  entryType?: Type<any>,
  extra: NgModule = {},
) {
  @NgModule({
    imports: mergeArrays(extra.imports, [NgxTestingModule]),
    exports: mergeArrays(extra.exports, [NgxTestingModule, type]),
    declarations: mergeArrays(extra.declarations, [type]),
    entryComponents: entryType
      ? mergeArrays(extra.entryComponents, [entryType])
      : extra.entryComponents,
    schemas: extra.schemas,
  })
  class TestingModule<D> {}
  return TestingModule as Type<TestingModule<T>>;
}
