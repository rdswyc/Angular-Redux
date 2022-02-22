import { ModuleWithProviders, NgModule } from '@angular/core';

import { State } from './types';



@NgModule({
  declarations: [
  ],
  imports: [
  ],
  exports: [
  ]
})
export class AngularReduxModule {
  static forRoot(state: State): ModuleWithProviders<AngularReduxModule> {
    return {
      ngModule: AngularReduxModule,
      providers: [
        { provide: State, useValue: state }
      ]
    };
  }
}
