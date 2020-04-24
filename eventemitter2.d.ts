export type event = (symbol|string);
export type eventNS = string|event[];

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
export interface Listener {
    (...values: any[]): void;
}
export interface EventAndListener {
    (event: string | string[], ...values: any[]): void;
}

interface WaitForFilter { (...values: any[]): boolean }

export interface WaitForOptions {
    /**
     * @default 0
     */
    timeout: number,
    /**
     * @default null
     */
    filter: WaitForFilter,
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

export interface CancelablePromise<T> extends Promise<T>{
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

export interface ListenToOptions {
    on?: { (event: event | eventNS, handler: Function): void },
    off?: { (event: event | eventNS, handler: Function): void },
    reducers: Function | Object
}

export interface GeneralEventEmitter{
    addEventListener: Function,
    removeEventListener: Function
}

export interface OnOptions {
    async?: boolean,
    promisify?: boolean,
    nextTick?: boolean
}

export declare class EventEmitter2 {
    constructor(options?: ConstructorOptions)
    emit(event: event | eventNS, ...values: any[]): boolean;
    emitAsync(event: event | eventNS, ...values: any[]): Promise<any[]>;
    addListener(event: event | eventNS, listener: Listener): this;
    on(event: event | eventNS, listener: Listener, options?: boolean|OnOptions): this;
    prependListener(event: event | eventNS, listener: Listener, options?: boolean|OnOptions): this;
    once(event: event | eventNS, listener: Listener, options?: true|OnOptions): this;
    prependOnceListener(event: event | eventNS, listener: Listener, options?: boolean|OnOptions): this;
    many(event: event | eventNS, timesToListen: number, listener: Listener, options?: boolean|OnOptions): this;
    prependMany(event: event | eventNS, timesToListen: number, listener: Listener, options?: boolean|OnOptions): this;
    onAny(listener: EventAndListener): this;
    prependAny(listener: EventAndListener): this;
    offAny(listener: Listener): this;
    removeListener(event: event | eventNS, listener: Listener): this;
    off(event: event | eventNS, listener: Listener): this;
    removeAllListeners(event?: event | eventNS): this;
    setMaxListeners(n: number): void;
    getMaxListeners(): number;
    eventNames(): string[];
    listenerCount(event?: event | eventNS): number
    listeners(event?: event | eventNS): Listener[]
    listenersAny(): Listener[]
    waitFor(event: event | eventNS, timeout?: number): CancelablePromise<any[]>
    waitFor(event: event | eventNS, filter?: WaitForFilter): CancelablePromise<any[]>
    waitFor(event: event | eventNS, options?: WaitForOptions): CancelablePromise<any[]>
    listenTo(target: GeneralEventEmitter, events: event | eventNS, options?: ListenToOptions): this;
    listenTo(target: GeneralEventEmitter, events: (event | eventNS)[], options?: ListenToOptions): this;
    listenTo(target: GeneralEventEmitter, events: Object, options?: ListenToOptions): this;
    stopListening(target?: GeneralEventEmitter, event?: event | eventNS): Boolean;
    hasListeners(event?: String): Boolean
    static once(emitter: EventEmitter2, event: event | eventNS, options?: OnceOptions): CancelablePromise<any[]>;
    static defaultMaxListeners: number;
}
