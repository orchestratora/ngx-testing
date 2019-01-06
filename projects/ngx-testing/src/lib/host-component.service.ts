import { Injectable, Injector } from '@angular/core';

import { Host } from './host';
import { DebugElementTyped } from './types';

@Injectable({
  providedIn: 'root',
})
export class HostComponentService<T = any> extends Host<T> {
  get element(): DebugElementTyped<T> {
    return this.query(this.componentType);
  }

  get htmlElement(): HTMLElement {
    return this.queryComponentHtml(this.componentType);
  }

  get component(): T {
    return this.element.componentInstance;
  }

  constructor(injector: Injector) {
    super(injector);
  }
}
