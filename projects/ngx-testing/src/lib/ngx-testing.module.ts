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

@NgModule({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class NgxTestingModule<T = any> {
  static forComponent<T>(
    compType: Type<T>,
    extras: TestingComponentModuleExtras = {},
  ): ModuleWithProviders<NgxTestingModule<T>> {
    const testModule = getTestingModuleFor(compType);
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
    const testModule = getTestingModuleFor(dirType, extras.hostComponent);
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

function getTestingModuleFor<T>(type: Type<T>, entryType: Type<any> = type) {
  @NgModule({
    imports: [NgxTestingModule],
    exports: [NgxTestingModule, type],
    declarations: [type],
    entryComponents: entryType ? [entryType] : [],
  })
  class TestingModule<D> {}
  return TestingModule as Type<TestingModule<T>>;
}
