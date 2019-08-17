/*
 * Public API Surface of ngx-testing
 */

export * from './lib/types';
export * from './lib/output-mock';
export * from './lib/ngx-testing.module';
export * from './lib/host';
export * from './lib/host-component.service';
export * from './lib/host-directive.service';
export * from './lib/factories';
export {
  createModule,
  createModuleAsync,
  resetModuleCompiler,
} from './lib/create-module';
