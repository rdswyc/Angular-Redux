import { Observable } from 'rxjs';

export interface Action<P = undefined, M = undefined> {
  type: string;
  payload?: P;
  error?: boolean;
  meta?: M;
}

export type AsyncAction<P = undefined, M = undefined> = Observable<Action<P, M>>;


export abstract class Effect {
  map: EffectMap;
}

export type EffectDispatcher<O = any, IP = any, IM = any> = (
  state?: State,
  action?: Action<IP, IM>
) => AsyncAction<O, any>;

export interface EffectMap {
  [key: string]: EffectDispatcher;
}


export type Reducer<S = State, P = S, M = undefined> = (
  state: S | undefined,
  action: Action<P, M>
) => S;


export type Selector<T> = (state: State) => T;
export type Projector<S, P> = (selected: S) => P;
export interface SelectorCreator<S, P = S> {
  selector: Selector<S>;
  projector?: Projector<S, P>;
}

export function createSelector<S>(selector: Selector<S>): SelectorCreator<S>;
export function createSelector<S, P>(selector: Selector<S>, projector: Projector<S, P>): SelectorCreator<S, P>;
export function createSelector<S, P>(selector: Selector<S>, projector?: Projector<S, P>): SelectorCreator<S, P> {
  return { selector, projector: projector || (d => d as unknown as P) };
}


export class State {
  readonly [key: string]: any;
}
