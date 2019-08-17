import { CompilerFactory, Injector } from '@angular/core';
import { getTestBed } from '@angular/core/testing';

import {
  _reset,
  createModule,
  createModuleAsync,
  resetModuleCompiler,
} from './create-module';

class ModuleFactoryMock {
  create = jasmine.createSpy();
}

class CompilerMock {
  moduleDefMock = { ngModuleFactory: new ModuleFactoryMock() };
  compileModuleAndAllComponentsSync = jasmine
    .createSpy('CompilerMock.compileModuleAndAllComponentsSync')
    .and.returnValue(this.moduleDefMock);
  compileModuleAndAllComponentsAsync = jasmine
    .createSpy('CompilerMock.compileModuleAndAllComponentsAsync')
    .and.returnValue(Promise.resolve(this.moduleDefMock));
}

class CompilerFactoryMock {
  compiler = new CompilerMock();
  createCompiler = jasmine
    .createSpy('CompilerFactoryMock.createCompiler')
    .and.returnValue(this.compiler);
}

describe('CreateModule', () => {
  let injectorMock: Injector & { get: jasmine.Spy };
  let compilerFactory: CompilerFactoryMock;

  beforeEach(() => {
    compilerFactory = new CompilerFactoryMock();
    injectorMock = {
      get: jasmine
        .createSpy('injectorMock.get')
        .and.callFake((token: any, ...rest: any) =>
          token === CompilerFactory
            ? compilerFactory
            : getTestBed().platform.injector.get(token, ...rest),
        ),
    };

    spyOnProperty(getTestBed().platform, 'injector').and.returnValue(
      injectorMock,
    );
  });

  afterEach(_reset);

  describe('createModule() function', () => {
    describe('first call', () => {
      it('should call `TestBed.platform.injector.get()` with [CompilerFactory]', () => {
        createModule(class {});

        expect(injectorMock.get).toHaveBeenCalledWith(CompilerFactory);
      });

      it('should call `CompilerFactory.createCompiler()` with [options]', () => {
        const options = [];
        createModule(class {}, void 0, options);

        expect(compilerFactory.createCompiler).toHaveBeenCalledWith(options);
      });

      it('should call `Compiler.compileModuleAndAllComponentsSync()` with [moduleType]', () => {
        class ModuleType {}
        createModule(ModuleType);

        expect(
          compilerFactory.compiler.compileModuleAndAllComponentsSync,
        ).toHaveBeenCalledWith(ModuleType);
      });

      describe('call to `NgModuleFactory.create()`', () => {
        it('should be with injector and return result', () => {
          const { ngModuleFactory } = compilerFactory.compiler.moduleDefMock;

          ngModuleFactory.create.and.returnValue('res');

          const injector = {};
          const res: any = createModule(class {}, injector as any);

          expect(ngModuleFactory.create).toHaveBeenCalledWith(injector);
          expect(res).toBe('res');
        });

        it('should be with converted providers to injector and return result', () => {
          const { ngModuleFactory } = compilerFactory.compiler.moduleDefMock;

          ngModuleFactory.create.and.returnValue('res');
          spyOn(Injector, 'create').and.returnValue('injector from providers');

          const providers = [];
          const res: any = createModule(class {}, providers);

          expect(ngModuleFactory.create).toHaveBeenCalledWith(
            'injector from providers',
          );
          expect(res).toBe('res');
        });
      });
    });

    describe('next calls', () => {
      it('should NOT call `TestBed.platform.injector.get()`', () => {
        createModule(class {});

        injectorMock.get.calls.reset();

        createModule(class {});

        expect(injectorMock.get).not.toHaveBeenCalled();
      });

      it('should NOT call `CompilerFactory.createCompiler()` without `options`', () => {
        createModule(class {});

        compilerFactory.createCompiler.calls.reset();

        createModule(class {});

        expect(compilerFactory.createCompiler).not.toHaveBeenCalled();
      });

      it('should call `CompilerFactory.createCompiler()` with passed `options`', () => {
        createModule(class {});

        compilerFactory.createCompiler.calls.reset();

        createModule(class {});

        expect(compilerFactory.createCompiler).not.toHaveBeenCalled();

        compilerFactory.createCompiler.calls.reset();

        const options = [];
        createModule(class {}, void 0, options);

        expect(compilerFactory.createCompiler).toHaveBeenCalledWith(options);
      });
    });
  });

  describe('createModuleAsync() function', () => {
    describe('first call', () => {
      it('should call `TestBed.platform.injector.get()` with [CompilerFactory]', () => {
        createModuleAsync(class {});

        expect(injectorMock.get).toHaveBeenCalledWith(CompilerFactory);
      });

      it('should call `CompilerFactory.createCompiler()` with [options]', () => {
        const options = [];
        createModuleAsync(class {}, void 0, options);

        expect(compilerFactory.createCompiler).toHaveBeenCalledWith(options);
      });

      it('should call `Compiler.compileModuleAndAllComponentsAsync()` with [moduleType]', () => {
        class ModuleType {}
        createModuleAsync(ModuleType);

        expect(
          compilerFactory.compiler.compileModuleAndAllComponentsAsync,
        ).toHaveBeenCalledWith(ModuleType);
      });

      describe('call to `NgModuleFactory.create()`', () => {
        it('should be with injector and return result', async () => {
          const { ngModuleFactory } = compilerFactory.compiler.moduleDefMock;

          ngModuleFactory.create.and.returnValue('res');

          const injector = {};
          const res: any = await createModuleAsync(class {}, injector as any);

          expect(ngModuleFactory.create).toHaveBeenCalledWith(injector);
          expect(res).toBe('res');
        });

        it('should be with converted providers to injector and return result', async () => {
          const { ngModuleFactory } = compilerFactory.compiler.moduleDefMock;

          ngModuleFactory.create.and.returnValue('res');
          spyOn(Injector, 'create').and.returnValue('injector from providers');

          const providers = [];
          const res: any = await createModuleAsync(class {}, providers);

          expect(ngModuleFactory.create).toHaveBeenCalledWith(
            'injector from providers',
          );
          expect(res).toBe('res');
        });
      });
    });

    describe('next calls', () => {
      it('should NOT call `TestBed.platform.injector.get()`', () => {
        createModuleAsync(class {});

        injectorMock.get.calls.reset();

        createModuleAsync(class {});

        expect(injectorMock.get).not.toHaveBeenCalled();
      });

      it('should NOT call `CompilerFactory.createCompiler()` without `options`', () => {
        createModuleAsync(class {});

        compilerFactory.createCompiler.calls.reset();

        createModuleAsync(class {});

        expect(compilerFactory.createCompiler).not.toHaveBeenCalled();
      });

      it('should call `CompilerFactory.createCompiler()` with passed `options`', () => {
        createModuleAsync(class {});

        compilerFactory.createCompiler.calls.reset();

        createModuleAsync(class {});

        expect(compilerFactory.createCompiler).not.toHaveBeenCalled();

        compilerFactory.createCompiler.calls.reset();

        const options = [];
        createModuleAsync(class {}, void 0, options);

        expect(compilerFactory.createCompiler).toHaveBeenCalledWith(options);
      });
    });
  });

  describe('resetModuleCompiler() function', () => {
    it('should force create `Compiler` for next call to `createModule()`', () => {
      createModule(class {});
      createModule(class {});

      expect(compilerFactory.createCompiler).toHaveBeenCalledTimes(1);

      compilerFactory.createCompiler.calls.reset();
      resetModuleCompiler();

      createModule(class {});
      resetModuleCompiler();
      createModule(class {});

      expect(compilerFactory.createCompiler).toHaveBeenCalledTimes(2);
    });

    it('should force create `Compiler` for next call to `createModuleAsync()`', () => {
      createModuleAsync(class {});
      createModuleAsync(class {});

      expect(compilerFactory.createCompiler).toHaveBeenCalledTimes(1);

      compilerFactory.createCompiler.calls.reset();
      resetModuleCompiler();

      createModuleAsync(class {});
      resetModuleCompiler();
      createModuleAsync(class {});

      expect(compilerFactory.createCompiler).toHaveBeenCalledTimes(2);
    });
  });
});
