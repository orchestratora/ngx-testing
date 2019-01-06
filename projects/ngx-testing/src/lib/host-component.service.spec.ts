import { TestBed } from '@angular/core/testing';

import { Host } from './host';
import { HostComponentService } from './host-component.service';
import { HostGeneratorService } from './host-generator.service';
import { TestTypeToken } from './tokens';
import { get } from './util';

class HostGeneratorServiceMock {
  generate = jasmine.createSpy();
}

class TestTypeTokenMock {}

describe('Service: HostComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HostComponentService,
        HostGeneratorServiceMock,
        { provide: HostGeneratorService, useExisting: HostGeneratorServiceMock },
        TestTypeTokenMock,
        { provide: TestTypeToken, useExisting: TestTypeTokenMock },
      ],
    });
  });

  it('should extend from `Host`', () => {
    expect(getService()).toEqual(jasmine.any(Host));
  });

  describe('element prop', () => {
    it('should call `this.query()` with `this.componentType` and return result', () => {
      spyOn(getService(), 'query').and.returnValue('result');

      expect(getService().element).toBe('result' as any);
      expect(getService().query).toHaveBeenCalledWith(get(TestTypeTokenMock));
    });
  });

  describe('htmlElement prop', () => {
    it('should call `this.queryComponentHtml()` with `this.componentType` and return result', () => {
      spyOn(getService(), 'queryComponentHtml').and.returnValue('result');

      expect(getService().htmlElement).toBe('result' as any);
      expect(getService().queryComponentHtml).toHaveBeenCalledWith(
        get(TestTypeTokenMock),
      );
    });
  });

  describe('component prop', () => {
    it('should return `this.element.componentInstance`', () => {
      spyOn(getService(), 'query').and.returnValue({ componentInstance: 'instance' });

      expect(getService().component).toBe('instance');
    });
  });
});

function getService() {
  return get(HostComponentService);
}
