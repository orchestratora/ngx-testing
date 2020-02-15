import { TestBed } from '@angular/core/testing';

import { Host } from './host';
import { HostDirectiveService } from './host-directive.service';
import { HostGeneratorService } from './host-generator.service';
import { TestTypeToken } from './tokens';
import { get } from './util';

class HostGeneratorServiceMock {
  generate = jest.fn();
}

class TestTypeTokenMock {}

describe('Service: HostDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HostDirectiveService,
        HostGeneratorServiceMock,
        {
          provide: HostGeneratorService,
          useExisting: HostGeneratorServiceMock,
        },
        TestTypeTokenMock,
        { provide: TestTypeToken, useExisting: TestTypeTokenMock },
      ],
    });
  });

  it('should extend from `Host`', () => {
    expect(getService()).toEqual(jasmine.any(Host));
  });

  describe('directive prop', () => {
    it('should return `this.hostComponent.instance`', () => {
      Object.defineProperty(getService(), 'hostComponent', {
        value: { instance: 'instance' },
      });

      expect(getService().directive).toBe('instance');
    });
  });
});

function getService() {
  return get(HostDirectiveService);
}
