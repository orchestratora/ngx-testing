import {
  Component,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  NgModule,
  Type,
  ViewChild,
} from '@angular/core';

import { getOutputMock } from './output-mock';
import { genHostCompTpl, genHostCompTplStar } from './template-gen';
import {
  ExtraConfigToken,
  TestModuleToken,
  TestTypeKindToken,
  TestTypeToken,
} from './tokens';
import {
  AsHostComponent,
  DirectiveIO,
  HostComponent,
  TestTypeKind,
} from './types';
import { getDirectiveIO } from './util';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class HostGeneratorService {
  private testModule = this.injector.get(TestModuleToken);
  private typeToken = this.injector.get(TestTypeToken);
  private typeKind = this.injector.get(TestTypeKindToken);
  private extraConfig = this.injector.get(ExtraConfigToken);

  constructor(
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
  ) {}

  generateModuleFor(host: Type<any>): Type<any> {
    const testModule = this.testModule;
    const ngModule = this.extraConfig.ngModule;

    @NgModule({
      imports: [testModule],
      declarations: [host],
      exports: [host],
      entryComponents: [host],
      schemas: ngModule ? ngModule.schemas : [],
    })
    class TestModule {}

    return TestModule;
  }

  generate<T = any>(): Type<AsHostComponent<T>> {
    switch (this.typeKind) {
      case TestTypeKind.Component:
        return this.generateForComponent<T>();
      case TestTypeKind.Directive:
        return this.generateForDirective<T>();
      default:
        throw Error(
          `HostGeneratorService: Cannot generate host component for unknown kind: ${
            this.typeKind
          }`,
        );
    }
  }

  generateForComponent<T = any>(): Type<AsHostComponent<T>> {
    return this.genForComponent<T>(this.typeToken);
  }

  generateForDirective<T = any>(): Type<AsHostComponent<T>> {
    return this.genForDirective<T>(this.typeToken);
  }

  genForComponent<T>(compType: Type<T>): Type<AsHostComponent<T>> {
    const factory = this.cfr.resolveComponentFactory(compType);
    const selector = `host-${factory.selector}`;
    const template =
      this.extraConfig.template ||
      genHostCompTpl(
        factory.selector,
        factory,
        this.extraConfig.projectContent,
      );

    return this.genComponent({ selector, template }, compType, factory);
  }

  genForDirective<T>(dirType: Type<T>): Type<AsHostComponent<T>> {
    const io = getDirectiveIO(dirType);

    const selector = `host-directive`;

    const templateTag = this.extraConfig.template
      ? ''
      : this.extraConfig.hostComponent
      ? this.cfr.resolveComponentFactory(this.extraConfig.hostComponent)
          .selector
      : this.extraConfig.hostTag;

    const template =
      this.extraConfig.template ||
      (templateTag ? this.genDirectiveTemplate(templateTag, io) : '');

    return this.genComponent({ selector, template }, dirType, io);
  }

  private genDirectiveTemplate(tag: string, io: DirectiveIO): string {
    return this.extraConfig.useStarSyntax
      ? genHostCompTplStar(
          io.inputs[0].templateName,
          tag,
          io,
          this.extraConfig.projectContent,
          this.extraConfig.templateBindings,
        )
      : genHostCompTpl(
          tag,
          io,
          this.extraConfig.projectContent,
          this.extraConfig.templateBindings,
        );
  }

  private genComponent<T>(
    meta: Component,
    type: Type<T>,
    io: DirectiveIO,
  ): Type<AsHostComponent<T>> {
    const that = this;

    @Component(meta)
    class TestHostComponent implements HostComponent<T> {
      @ViewChild(type)
      instance: T;

      constructor() {
        that.initComponent(type, this, io);
      }
    }

    return TestHostComponent as Type<AsHostComponent<T>>;
  }

  private initComponent<T>(
    compType: Type<any>,
    hostComp: HostComponent<any>,
    io: DirectiveIO,
  ) {
    io.inputs.forEach(({ propName }) => (hostComp[propName] = undefined));
    io.outputs.forEach(
      ({ propName }) =>
        (hostComp[propName] = getOutputMock()(
          propName,
          compType.name,
          compType,
          () => hostComp.instance,
        )),
    );
  }
}
