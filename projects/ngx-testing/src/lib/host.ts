import {
  Compiler,
  DebugElement,
  Injector,
  NgModuleFactory,
  OnDestroy,
  Type,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HostGeneratorService } from './host-generator.service';
import { TestTypeToken } from './tokens';
import { AsHostComponent, DebugElementTyped } from './types';

export abstract class Host<T = any> implements OnDestroy {
  private hostGeneratorService = this.injector.get(HostGeneratorService);

  readonly componentType = this.injector.get(TestTypeToken);
  readonly hostComponentType = this.hostGeneratorService.generate<T>();

  get fixture(): ComponentFixture<AsHostComponent<T>> {
    return this._fixture;
  }

  get hostElement(): DebugElementTyped<AsHostComponent<T>> {
    return this._fixture.debugElement;
  }

  get hostHtmlElement(): HTMLElement {
    return this._fixture.nativeElement;
  }

  get hostComponent(): AsHostComponent<T> {
    return this._fixture.componentInstance;
  }

  private compiler = this.injector.get(Compiler);

  private _fixture: ComponentFixture<AsHostComponent<T>>;
  private _didCompilation = false;

  constructor(protected injector: Injector) {}

  ngOnDestroy(): void {
    if (this._fixture) {
      try {
        this._fixture.destroy();
      } catch {}
    }
  }

  async compileComponents() {
    if (!this._didCompilation) {
      this._didCompilation = true;

      const hostModule = this.hostGeneratorService.generateModuleFor(
        this.hostComponentType,
      );

      await this.compiler.compileModuleAndAllComponentsAsync(hostModule);

      return await TestBed.compileComponents();
    }
  }

  async createComponent(): Promise<ComponentFixture<AsHostComponent<T>>> {
    await this.compileComponents();
    this._fixture = TestBed.createComponent(this.hostComponentType);
    return this._fixture;
  }

  overrideHostTemplate(tpl: string): void {
    TestBed.overrideTemplate(this.hostComponentType, tpl);
  }

  detectChanges(checkNoChanges?: boolean): void {
    this._fixture.detectChanges(checkNoChanges);
  }

  query<C>(compOrDir: Type<C>): DebugElementTyped<C> | null {
    return this.hostElement.query(By.directive(compOrDir));
  }

  queryComponent<C>(compOrDir: Type<C>): C | undefined {
    const elem = this.query(compOrDir);
    return elem ? elem.componentInstance : undefined;
  }

  queryComponentHtml<C>(compOrDir: Type<C>): HTMLElement | undefined {
    const elem = this.query(compOrDir);
    return elem ? elem.nativeElement : undefined;
  }

  queryCss(css: string): DebugElement | null {
    return this.hostElement.query(By.css(css));
  }
}
