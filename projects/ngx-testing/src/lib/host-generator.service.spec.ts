import { ComponentFactoryResolver } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HostGeneratorService } from './host-generator.service';
import {
  ExtraConfigToken,
  TestModuleToken,
  TestTypeKindToken,
  TestTypeToken,
} from './tokens';
import { TestTypeKind } from './types';
import * as util from './util';
import * as tplGen from './template-gen';

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
    it('should return new type', () => {
      expect(getService().generateModuleFor(class {})).toEqual(
        jasmine.any(Function),
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

  xdescribe('genForDirective() method', () => {
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

        expect(getService().genForComponent(Type)).toBe('res');
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
