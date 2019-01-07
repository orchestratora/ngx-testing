# NgxTesting

[![Build Status](https://travis-ci.org/orchestratora/ngx-testing.svg?branch=master)](https://travis-ci.org/orchestratora/ngx-testing)
[![Coverage](https://img.shields.io/codecov/c/github/orchestratora/ngx-testing.svg?maxAge=2592000)](https://codecov.io/gh/orchestratora/ngx-testing)
[![Npm](https://img.shields.io/npm/v/@orchestrator/ngx-testing.svg)](https://www.npmjs.com/package/@orchestrator/ngx-testing)
[![Npm Downloads](https://img.shields.io/npm/dt/@orchestrator/ngx-testing.svg)](https://www.npmjs.com/package/@orchestrator/ngx-testing)
![Licence](https://img.shields.io/github/license/orchestratora/ngx-testing.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Testing utilities for Angular projects

`npm install -D @orchestrator/ngx-testing`

## Why?

Because you want to test your code and not writing testing code to test your code.

## How?

This utility library will generate a wrapping (host) component for your component
under test and bind all the `@Input`s and `@Output`s for you so you can
interact with component as the consumer will.

That also means that you do not need to worry about life-cycle hooks hassle because
auto generated code will move this bit to Angular itself.

## Getting started

### Configuring mocking (Optional)

Library will initialize every `@Output` property on host component to a mock
so you have a nice time checking if the output was triggered.

By default it is simply a NOOP function (that does nothing).

But which testing tool do you use is up to you so you have to tell us what to use
by writing next code in your main test configuration file:

```ts
import { setOutputMock } from '@orchestrator/ngx-testing';

// Use this for Jasmine Spies
setOutputMock(() => jasmine.createSpy());

// Or this for Jest Mocks
setOutputMock(() => jest.fn());

// Optionally you can provide typings for mocks
declare module '@orchestrator/ngx-testing' {
  // Use this for Jasmine Spies
  interface OutputMock<T> extends jasmine.Spy {}

  // Or this for Jest Mocks
  interface OutputMock<T> extends jest.Mock {}
  // <T> here represents actual type from `EventEmitter<T>`
  // You can use it if you need it
}
```

### Testing component

Let's see how to test a component with this library:

```ts
import { TestBed } from '@angular/core/testing';
import { getTestingForComponent } from '@orchestrator/ngx-testing';

// This is component under test
@Component({ selector: 'my-component', template: 'Text is: {{text}}' })
class MyComponent implements OnInit, OnChanges {
  @Input() text: string;
}

describe('MyComponent', () => {
  // This will generate host component and module with everything required
  const { testModule, createComponent } = getTestingForComponent(MyComponent);

  // Configure testing module by importing generated module before
  beforeEach(() => TestBed.configureTestingModule({ imports: [testModule] }));

  it('should render input text', async () => {
    // Now simply create host component
    // It is async because it performs compilation of templates
    // And returns a special Host service that contains a bunch of useful stuff
    const host = await createComponent();

    // To interact with your component Inputs/Outputs use `hostComponent` property
    // It's an instance of generated host component that binds all Inputs and Outputs
    host.hostComponent.text = 'something';
    // This is an alias to fixture.detectChanges()
    // Fixture can be used as well and is available as `fixture` property
    host.detectChanges();

    // htmlElement is simply an HTMLElement of rendered component under test
    expect(host.htmlElement.textContent).toBe(`Text is: something`);
  });
});
```

For more examples visit [example-component.spec.ts](projects/ngx-testing/src/lib/example-component.spec.ts).

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
