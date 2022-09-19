export interface ConstructorOptions {
  /**
   * @default false
   * @description set this to `true` to use wildcards.
   */
  wildcard?: boolean,
  /**
   * @default '.'
   * @description the delimiter used to segment namespaces.
   */
  delimiter?: string,
  /**
   * @default false
   * @description set this to `true` if you want to emit the newListener events.
   */
  newListener?: boolean,
  /**
   * @default false
   * @description set this to `true` if you want to emit the removeListener events.
   */
  removeListener?: boolean,
  /**
   * @default 10
   * @description the maximum amount of listeners that can be assigned to an event.
   */
  maxListeners?: number
  /**
   * @default false
   * @description show event name in memory leak message when more than maximum amount of listeners is assigned, default false
   */
  verboseMemoryLeak?: boolean
  /**
   * @default false
   * @description disable throwing uncaughtException if an error event is emitted and it has no listeners
   */
  ignoreErrors?: boolean
}

export type event = (symbol | string);
export type eventNS = string | event[];

export interface EventMap {
  [key: event]: (...args: any) => void
}

export type ListenerFn<EventName extends keyof Events = event, Events extends EventMap = EventMap> = Events[EventName]

export interface EventAndListener<EventName extends keyof Events = event, Events extends EventMap = EventMap> {
  (event: EventName, ...values: ListenerFunctionParameters<EventName, Events>): void;
}

export interface WaitForFilter<EventName extends keyof Events = event, Events extends EventMap = EventMap> {
  (...values: ListenerFunctionParameters<EventName, Events>): boolean
}

export interface WaitForOptions<EventName extends keyof Events = event, Events extends EventMap = EventMap> {
  /**
   * @default 0
   */
  timeout: number,
  /**
   * @default null
   */
  filter: WaitForFilter<EventName, Events>,
  /**
   * @default false
   */
  handleError: boolean,
  /**
   * @default Promise
   */
  Promise: Function,
  /**
   * @default false
   */
  overload: boolean
}

export interface CancelablePromise<T> extends Promise<T> {
  cancel(reason: string): undefined
}

export interface OnceOptions {
  /**
   * @default 0
   */
  timeout: number,
  /**
   * @default Promise
   */
  Promise: Function,
  /**
   * @default false
   */
  overload: boolean
}

export interface ListenToOptions<EventName extends keyof Events = event, Events extends EventMap = EventMap> {
  on?: { (event: EventName | eventNS, handler: ListenerFn<EventName, Events>): void },
  off?: { (event: EventName | eventNS, handler: ListenerFn<EventName, Events>): void },
  reducers: Function | Object
}

export interface GeneralEventEmitter<EventName extends keyof Events = event, Events extends EventMap = EventMap> {
  addEventListener(event: EventName, handler: ListenerFn<EventName, Events>): this,

  removeEventListener(event: EventName, handler: ListenerFn<EventName, Events>): this,

  addListener?(event: EventName, handler: ListenerFn<EventName, Events>): this,

  removeListener?(event: EventName, handler: ListenerFn<EventName, Events>): this,

  on?(event: EventName, handler: ListenerFn<EventName, Events>): this,

  off?(event: EventName, handler: ListenerFn<EventName, Events>): this
}

export interface OnOptions {
  async?: boolean,
  promisify?: boolean,
  nextTick?: boolean,
  objectify?: boolean
}

export interface Listener<EventName extends keyof Events = event, Events extends EventMap = EventMap> {
  emitter: EventEmitter2<Events>;
  event: EventName | eventNS;
  listener: ListenerFn<EventName, Events>;

  off(): this;
}

export type ListenerFunctionParameters<EventName extends keyof Events = event, Events extends EventMap = EventMap> = Parameters<ListenerFn<EventName, Events>>

export declare class EventEmitter2<Events extends EventMap = EventMap> {
  constructor(options?: ConstructorOptions)

  emit<EventName extends keyof Events>(event: EventName | eventNS, ...values: ListenerFunctionParameters<EventName, Events>): boolean;

  emitAsync<EventName extends keyof Events>(event: EventName | eventNS, ...values: ListenerFunctionParameters<EventName, Events>): Promise<ReturnType<ListenerFn<EventName, Events>>[]>;

  addListener<EventName extends keyof Events>(event: EventName | eventNS, listener: ListenerFn<EventName, Events>): this | Listener<EventName, Events>;

  on<EventName extends keyof Events>(event: EventName | eventNS, listener: ListenerFn<EventName, Events>, options?: boolean | OnOptions): this | Listener<EventName, Events>;

  prependListener<EventName extends keyof Events>(event: EventName | eventNS, listener: ListenerFn<EventName, Events>, options?: boolean | OnOptions): this | Listener<EventName, Events>;

  once<EventName extends keyof Events>(event: EventName | eventNS, listener: ListenerFn<EventName, Events>, options?: true | OnOptions): this | Listener<EventName, Events>;

  prependOnceListener<EventName extends keyof Events>(event: EventName | eventNS, listener: ListenerFn<EventName, Events>, options?: boolean | OnOptions): this | Listener<EventName, Events>;

  many<EventName extends keyof Events>(event: EventName | eventNS, timesToListen: number, listener: ListenerFn<EventName, Events>, options?: boolean | OnOptions): this | Listener<EventName, Events>;

  prependMany<EventName extends keyof Events>(event: EventName | eventNS, timesToListen: number, listener: ListenerFn<EventName, Events>, options?: boolean | OnOptions): this | Listener<EventName, Events>;

  onAny<EventName extends keyof Events>(listener: EventAndListener<EventName, Events>): this;

  prependAny<EventName extends keyof Events>(listener: EventAndListener<EventName, Events>): this;

  offAny<EventName extends keyof Events>(listener: ListenerFn<EventName, Events>): this;

  removeListener<EventName extends keyof Events>(event: EventName | eventNS, listener: ListenerFn<EventName, Events>): this;

  off<EventName extends keyof Events>(event: EventName | eventNS, listener: ListenerFn<EventName, Events>): this;

  removeAllListeners<EventName extends keyof Events>(event?: EventName | eventNS): this;

  setMaxListeners(numberOfListeners: number): void;

  getMaxListeners(): number;

  eventNames<EventName extends keyof Events>(nsAsArray?: boolean): (EventName | eventNS)[];

  listenerCount<EventName extends keyof Events>(event?: EventName | eventNS): number

  listeners<EventName extends keyof Events>(event?: EventName | eventNS): ListenerFn<EventName, Events>[]

  listenersAny<EventName extends keyof Events>(): ListenerFn<EventName, Events>[]

  waitFor<EventName extends keyof Events>(event: EventName | eventNS, timeout?: number): CancelablePromise<ListenerFunctionParameters<EventName, Events>>
  waitFor<EventName extends keyof Events>(event: EventName | eventNS, filter?: WaitForFilter<EventName, Events>): CancelablePromise<ListenerFunctionParameters<EventName, Events>>
  waitFor<EventName extends keyof Events>(event: EventName | eventNS, options?: WaitForOptions<EventName, Events>): CancelablePromise<ListenerFunctionParameters<EventName, Events>>

  listenTo<EventName extends keyof Events>(target: GeneralEventEmitter<EventName, Events>, events: EventName | eventNS, options?: ListenToOptions<EventName, Events>): this;
  listenTo<EventName extends keyof Events>(target: GeneralEventEmitter<EventName, Events>, events: EventName[], options?: ListenToOptions<EventName, Events>): this;
  listenTo<EventName extends keyof Events>(target: GeneralEventEmitter<EventName, Events>, events: Object, options?: ListenToOptions<EventName, Events>): this;

  stopListeningTo<EventName extends keyof Events>(target?: GeneralEventEmitter<EventName, Events>, event?: EventName | eventNS): Boolean;

  hasListeners<EventName extends keyof Events>(event?: EventName): Boolean

  static once<EventName extends keyof Events = event, Events extends EventMap = EventMap>(emitter: EventEmitter2<Events>, event: EventName | eventNS, options?: OnceOptions): CancelablePromise<ListenerFunctionParameters<EventName, Events>>;

  static defaultMaxListeners: number
}

export default EventEmitter2
