import {
  Compiler,
  CompilerFactory,
  CompilerOptions,
  Injector,
  NgModuleFactory,
  StaticProvider,
  Type,
} from '@angular/core';
import { getTestBed } from '@angular/core/testing';

let compilerFactory: CompilerFactory | undefined;
let compiler: Compiler | undefined;

afterEach(resetModuleCompiler);

/**
 * Allows to compile and instantiate any {@link NgModule}
 * with optional custom {@link Injector} or {@link StaticProvider}s
 *
 * _NOTE:_ Compiler is reused between test cases unless `options` are passed -
 * in which case a new compiler will be created and reused for the current test case
 *
 * **Example:**
 * ```ts
 *  import { NgModule } from '@angular/core';
 *
 *  @NgModule({...})
 *  class MyModule {}
 *
 *  it('should instantiate MyModule', () => {
 *    const myModule = createModule(MuModule);
 *    expect(myModule instanceof MyModule).toBeTruthy();
 *  });
 * ```
 *
 * For async module compilation use {@link createModuleAsync()}
 */
export function createModule<T>(
  moduleType: Type<T>,
  injectorOrProviders: Injector | StaticProvider[] = Injector.NULL,
  options?: CompilerOptions[],
) {
  const moduleDef = createCompiler(options).compileModuleAndAllComponentsSync(
    moduleType,
  );
  return instantiateModule(moduleDef.ngModuleFactory, injectorOrProviders);
}

/**
 * Allows to compile and instantiate any {@link NgModule}
 * with optional custom {@link Injector} or {@link StaticProvider}s
 * in asynchronous manner
 *
 * Works same as {@link createModule()} but compiles module asynchronously
 * @see createModule()
 */
export async function createModuleAsync<T>(
  moduleType: Type<T>,
  injectorOrProviders: Injector | StaticProvider[] = Injector.NULL,
  options?: CompilerOptions[],
) {
  const moduleDef = await createCompiler(
    options,
  ).compileModuleAndAllComponentsAsync(moduleType);
  return instantiateModule(moduleDef.ngModuleFactory, injectorOrProviders);
}

/**
 * Allows to reset {@link Compiler} used to compile modules for current test case
 * created via {@link createModule()} and {@link createModuleAsync()}
 */
export function resetModuleCompiler() {
  compiler = undefined;
}

function instantiateModule<T>(
  moduleFactory: NgModuleFactory<T>,
  injectorOrProviders: Injector | StaticProvider[] = Injector.NULL,
) {
  if (Array.isArray(injectorOrProviders)) {
    injectorOrProviders = Injector.create({ providers: injectorOrProviders });
  }

  return moduleFactory.create(injectorOrProviders);
}

function createCompiler(options?: CompilerOptions[]) {
  if (!compiler || options) {
    compiler = getCompilerFactory().createCompiler(options);
  }
  return compiler;
}

function getCompilerFactory() {
  if (!compilerFactory) {
    compilerFactory = getTestBed().platform.injector.get<CompilerFactory>(
      CompilerFactory as any,
    );
  }
  return compilerFactory;
}

/**
 * @internal
 *
 * Used to simulate complete reset inside unit tests
 */
export function _reset() {
  compilerFactory = undefined;
  compiler = undefined;
}
