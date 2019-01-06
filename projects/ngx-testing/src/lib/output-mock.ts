import { Type } from '@angular/core';

// tslint:disable-next-line:no-empty-interface
export interface OutputMock<T = any> {}

export type OutputMockFactory<T = any> = (
  outputName: string,
  compName: string,
  compType: Type<T>,
  getComp: () => T,
) => OutputMock;

let outputMockFactory: OutputMockFactory = () => (() => null) as any;

export function setOutputMock(mock: OutputMockFactory) {
  outputMockFactory = mock;
}

export function getOutputMock(): OutputMockFactory {
  return outputMockFactory;
}
