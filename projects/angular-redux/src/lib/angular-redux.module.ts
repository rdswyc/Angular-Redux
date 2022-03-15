import { ModuleWithProviders, NgModule } from '@angular/core';

import { StoreParameters } from './types';



@NgModule({
  declarations: [
  ],
  imports: [
  ],
  exports: [
  ]
})
export class AngularReduxModule {
  static forRoot(parameters: StoreParameters): ModuleWithProviders<AngularReduxModule> {
    return {
      ngModule: AngularReduxModule,
      providers: [
        { provide: StoreParameters, useValue: parameters }
      ]
    };
  }
}
