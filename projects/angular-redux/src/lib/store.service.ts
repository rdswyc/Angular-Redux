import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, scan } from 'rxjs/operators';

import { Action, SelectorCreator, State, StoreParameters } from './types';

declare let process: any;

@Injectable({
  providedIn: 'root',
})
export class StoreService implements OnDestroy {
  private actions: Subject<Action<any, any>>;
  private state: BehaviorSubject<State>;
  private sub: Subscription;

  constructor(
    private params: StoreParameters
  ) {
    this.actions = new Subject();
    this.state = new BehaviorSubject<State>({ ...params.initialState });

    let actionsAndEffects$: Observable<Action<any, any>>;

    if (params.effects) {
      const effects$ = this.actions.pipe(
        filter(a => Boolean(params.effects[a.type])),
        mergeMap(a => params.effects[a.type](this.getState(), a))
      );

      actionsAndEffects$ = merge(this.actions, effects$);
    }
    else {
      actionsAndEffects$ = this.actions;
    }

    this.sub = actionsAndEffects$.pipe(
      scan(
        this.isProd ? params.reducer : this.logMiddleware,
        this.getState()
      )
    ).subscribe(this.state);
  }

  get isProd(): boolean {
    const env = process.env.NODE_ENV;
    return env === 'production';
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  dispatch<P = any, M = any>(action: Action<P, M>) {
    this.actions.next(action);
  }

  getState(): State {
    return this.state.getValue();
  }

  select<S = any, P = S>(creator: SelectorCreator<S, P>): Observable<P> {
    return this.state.pipe(
      map(creator.selector),
      distinctUntilChanged(),
      map(creator.projector)
    );
  }

  private logMiddleware(state: State, action: Action): State {
    const color = action.error ? '#dc3545' : action.payload ? '#28a745' : '#17a2b8';

    console.groupCollapsed(`Store dispatch: %c${action.type}`, `color: ${color};`);

    if (action.meta) {
      console.log('%cAction meta', 'color: #6c757d', action.meta);
    }
    if (action.payload) {
      console.log('%cAction payload', 'color: #6c757d', action.payload);
    }
    if (!action.payload && !action.meta) {
      console.log('%cNo action content.', 'color: #6c757d');
    }

    const newState = this.params.reducer(state, action);

    console.log('%cNew state', 'color: #6c757d', newState);
    console.groupEnd();

    return newState;
  }
}
