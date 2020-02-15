import { ComponentFactoryResolver } from '@angular/core';
import * as ngCore from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HostGeneratorService } from './host-generator.service';
import * as tplGen from './template-gen';
import {
  ExtraConfigToken,
  TestModuleToken,
  TestTypeKindToken,
  TestTypeToken,
} from './tokens';
import { TestTypeKind } from './types';
import * as util from './util';

class TestModuleTokenMock {}
class TestTypeTokenMock {}

describe('Service: HostGenerator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HostGeneratorService,
        { provide: TestModuleToken, useValue: TestModuleTokenMock },
        { provide: TestTypeToken, useValue: TestTypeTokenMock },
        { provide: TestTypeKindToken, useValue: {} },
        { provide: ExtraConfigToken, useValue: {} },
      ],
    });
  });

  it('should init', () => {
    expect(getService()).toBeTruthy();
  });

  describe('generateModuleFor() method', () => {
    let ngModule: jasmine.Spy;

    beforeEach(() => {
      getService();
      ngModule = spyOn(ngCore, 'NgModule');
    });

    it('should return new type', () => {
      expect(getService().generateModuleFor(class {})).toEqual(
        jasmine.any(Function),
      );
    });

    it('should import `this.testModule`', () => {
      getService().generateModuleFor(class {});

      expect(ngModule).toHaveBeenCalledWith(
        jasmine.objectContaining({
          imports: [TestModuleTokenMock],
        }),
      );
    });

    it('should declare `host`', () => {
      class Host {}
      getService().generateModuleFor(Host);

      expect(ngModule).toHaveBeenCalledWith(
        jasmine.objectContaining({
          declarations: [Host],
        }),
      );
    });

    it('should export `host`', () => {
      class Host {}
      getService().generateModuleFor(Host);

      expect(ngModule).toHaveBeenCalledWith(
        jasmine.objectContaining({
          exports: [Host],
        }),
      );
    });

    it('should set `host` as entryComponents', () => {
      class Host {}
      getService().generateModuleFor(Host);

      expect(ngModule).toHaveBeenCalledWith(
        jasmine.objectContaining({
          entryComponents: [Host],
        }),
      );
    });

    it('should set schemas from `this.extraConfig.ngModule.schemas`', () => {
      const extraConfig = TestBed.get(ExtraConfigToken);
      extraConfig.ngModule = { schemas: 'schema' };

      getService().generateModuleFor(class {});

      expect(ngModule).toHaveBeenCalledWith(
        jasmine.objectContaining({
          schemas: 'schema',
        }),
      );
    });
  });

  describe('generate() method', () => {
    describe('when `TestTypeKindToken` does not match', () => {
      it('should throw error `Cannot generate host component for unknown kind`', () => {
        expect(() => getService().generate()).toThrowError(
          /Cannot generate host component for unknown kind/,
        );
      });
    });

    describe('when `TestTypeKindToken` is `TestTypeKind.Component`', () => {
      it('should call `this.generateForComponent()` and return result', () => {
        TestBed.overrideProvider(TestTypeKindToken, {
          useValue: TestTypeKind.Component,
        });
        spyOn(getService(), 'generateForComponent').and.returnValue('res');

        expect(getService().generate()).toBe('res');
        expect(getService().generateForComponent).toHaveBeenCalled();
      });
    });

    describe('when `TestTypeKindToken` is `TestTypeKind.Directive`', () => {
      it('should call `this.generateForDirective()` and return result', () => {
        TestBed.overrideProvider(TestTypeKindToken, {
          useValue: TestTypeKind.Directive,
        });
        spyOn(getService(), 'generateForDirective').and.returnValue('res');

        expect(getService().generate()).toBe('res');
        expect(getService().generateForDirective).toHaveBeenCalled();
      });
    });
  });

  describe('generateForComponent() method', () => {
    it('should call `this.genForComponent` with `TestTypeToken` and return result', () => {
      spyOn(getService(), 'genForComponent').and.returnValue('res');

      expect(getService().generateForComponent()).toBe('res');
      expect(getService().genForComponent).toHaveBeenCalledWith(
        util.get(TestTypeToken),
      );
    });
  });

  describe('generateForDirective() method', () => {
    it('should call `this.genForDirective` with `TestTypeToken` and return result', () => {
      spyOn(getService(), 'genForDirective').and.returnValue('res');

      expect(getService().generateForDirective()).toBe('res');
      expect(getService().genForDirective).toHaveBeenCalledWith(
        util.get(TestTypeToken),
      );
    });
  });

  describe('genForComponent() method', () => {
    it('should call `this.genComponent()` with resolved metadata from type', () => {
      const factory = { selector: 'selector', inputs: [], outputs: [] };
      const resolveComponentFactory = jasmine
        .createSpy()
        .and.returnValue(factory);

      class Type {}

      TestBed.overrideProvider(ComponentFactoryResolver, {
        useValue: { resolveComponentFactory },
      }).overrideProvider(ExtraConfigToken, {
        useValue: {
          projectContent: 'content',
        },
      });

      const genHostCompTpl = spyOn(tplGen, 'genHostCompTpl').and.returnValue(
        'template',
      );
      const genComponent = spyOn(
        getService() as any,
        'genComponent',
      ).and.returnValue('res');

      expect(getService().genForComponent(Type)).toBe('res');
      expect(
        TestBed.get(ComponentFactoryResolver).resolveComponentFactory,
      ).toHaveBeenCalledWith(Type);
      expect(genHostCompTpl).toHaveBeenCalledWith(
        'selector',
        factory,
        'content',
      );
      expect(genComponent).toHaveBeenCalledWith(
        {
          selector: 'host-selector',
          template: 'template',
        },
        Type,
        factory,
      );
    });
  });

  describe('genForDirective() method', () => {
    describe('when `ExtraConfigToken.hostComponent` provided', () => {
      it('should call `this.genComponent()` with resolved metadata from type', () => {
        const factory = { selector: 'selector', inputs: [], outputs: [] };
        const resolveComponentFactory = jasmine
          .createSpy()
          .and.returnValue(factory);

        class Type {}
        class HostType {}

        TestBed.overrideProvider(ComponentFactoryResolver, {
          useValue: { resolveComponentFactory },
        }).overrideProvider(ExtraConfigToken, {
          useValue: {
            hostComponent: HostType,
            projectContent: 'content',
            templateBindings: 'bindings',
          },
        });

        const dirIO = { inputs: [], outputs: [] };
        const getDirectiveIO = spyOn(util, 'getDirectiveIO').and.returnValue(
          dirIO,
        );
        const genComponent = spyOn(
          getService() as any,
          'genComponent',
        ).and.returnValue('res');
        const genHostCompTpl = spyOn(tplGen, 'genHostCompTpl').and.returnValue(
          'template',
        );

        expect(getService().genForDirective(Type)).toBe('res');
        expect(getDirectiveIO).toHaveBeenCalledWith(Type);
        expect(
          TestBed.get(ComponentFactoryResolver).resolveComponentFactory,
        ).toHaveBeenCalledWith(HostType);
        expect(genHostCompTpl).toHaveBeenCalledWith(
          'selector',
          dirIO,
          'content',
          'bindings',
        );
        expect(genComponent).toHaveBeenCalledWith(
          {
            selector: 'host-directive',
            template: 'template',
          },
          Type,
          dirIO,
        );
      });
    });
  });
});

function getService() {
  return util.get(HostGeneratorService);
}
