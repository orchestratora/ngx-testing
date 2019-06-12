import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

import { getDirectiveIO } from './util';

describe('Util', () => {
  describe('getDirectiveIO() function', () => {
    @Directive({ selector: '[ngtTest]' })
    class TestDirective {
      @Input() input1: any;
      // tslint:disable-next-line: no-input-rename
      @Input('renamedInput') input2: any;

      @Output() output1 = new EventEmitter();
      // tslint:disable-next-line: no-output-rename
      @Output('renamedOutput') output2 = new EventEmitter();
    }

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TestDirective],
      }).compileComponents();
    }));

    it('should return resolved IO of given directive type', () => {
      expect(getDirectiveIO(TestDirective)).toEqual({
        inputs: [
          { propName: 'input1', templateName: 'input1' },
          { propName: 'input2', templateName: 'renamedInput' },
        ],
        outputs: [
          { propName: 'output1', templateName: 'output1' },
          { propName: 'output2', templateName: 'renamedOutput' },
        ],
      });
    });
  });
});
