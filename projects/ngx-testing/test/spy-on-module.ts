export function spyOnModule<T extends object>(
  moduleObj: T,
  exportSymbolName: keyof T,
): jasmine.Spy {
  const spy = jasmine.createSpy(`Spy of ${exportSymbolName}`);
  spyOnProperty(moduleObj, exportSymbolName).and.returnValue(spy);
  return spy;
}
