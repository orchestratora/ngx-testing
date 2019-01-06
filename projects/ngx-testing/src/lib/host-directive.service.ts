import { Injectable, Injector } from '@angular/core';

import { Host } from './host';

@Injectable({
  providedIn: 'root',
})
export class HostDirectiveService<T = any> extends Host<T> {
  get directive(): T {
    return this.hostComponent.instance;
  }

  constructor(injector: Injector) {
    super(injector);
  }
}
