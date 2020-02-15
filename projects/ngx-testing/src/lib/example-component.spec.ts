import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

import { getTestingForComponent } from './factories';
import { setOutputMock } from './output-mock';

setOutputMock(() => jest.fn());

@Component({ selector: 'ngt-my', template: 'Text is {{computed}}' })
class MyComponent implements OnInit, OnChanges {
  @Input() text: string;

  @Output() customEvent = new EventEmitter<string>();

  computed: string;

  ngOnInit(): void {
    this.computed = `'${this.text}'`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('text' in changes) {
      this.computed = `'${this.text}' was '${changes.text.previousValue}'`;
    }
  }

  doSomething() {
    this.customEvent.emit('job done');
  }
}

describe('Example Tests: MyComponent', () => {
  describe('before', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({ declarations: [MyComponent] });
    }));

    it('should render text', async () => {
      await TestBed.compileComponents();
      const fixture = TestBed.createComponent(MyComponent);

      fixture.componentInstance.text = 'whatever';
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toBe(`Text is 'whatever'`);
    });

    it('should render previous text when changed', async () => {
      await TestBed.compileComponents();
      const fixture = TestBed.createComponent(MyComponent);

      fixture.componentInstance.text = 'whatever';
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toBe(`Text is 'whatever'`);

      fixture.componentInstance.text = 'new';
      fixture.componentInstance.ngOnChanges({
        text: new SimpleChange('whatever', 'new', true),
      });
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toBe(
        `Text is 'new' was 'whatever'`,
      );
    });

    it('should emit `customEvent` when `doSomething()` called', async () => {
      await TestBed.compileComponents();
      const fixture = TestBed.createComponent(MyComponent);

      const callback = jest.fn();
      fixture.componentInstance.customEvent.subscribe(callback);

      fixture.componentInstance.doSomething();

      expect(callback).toHaveBeenCalledWith('job done');
    });
  });

  describe('after', () => {
    const { testModule, createComponent } = getTestingForComponent(MyComponent);

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [testModule] });
    });

    it('should render text', async () => {
      const host = await createComponent();

      host.hostComponent.text = 'whatever';
      host.detectChanges();

      expect(host.htmlElement.textContent).toBe(`Text is 'whatever'`);
    });

    it('should render previous text when changed', async () => {
      const host = await createComponent();

      host.hostComponent.text = 'whatever';
      host.detectChanges();

      expect(host.htmlElement.textContent).toBe(`Text is 'whatever'`);

      host.hostComponent.text = 'new';
      host.detectChanges();

      expect(host.htmlElement.textContent).toBe(`Text is 'new' was 'whatever'`);
    });

    it('should emit `customEvent` when `doSomething()` called', async () => {
      const host = await createComponent();

      host.component.doSomething();

      expect(host.hostComponent.customEvent).toHaveBeenCalledWith('job done');
    });
  });
});
