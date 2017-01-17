declare let eventemitter2: eventemitter2.Static

declare module eventemitter2 {
    type eventNS = string[];
    interface ConstructorOptions {
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
         * @default true
         * @description set this to `true` if you want to emit the newListener events.
         */
        newListener?: boolean,
        /**
         * @default 10
         * @description the maximum amount of listeners that can be assigned to an event.
         */
        maxListeners?: number
        /**
         * @default false
         * @description show event name in memory leak message when more than maximum amount of listeners is assigned, default false
         */
        verboseMemoryLeak?: boolean;
    }
    interface Listener{
        (...values: any[]) : void;
    }
    interface EventAndListener{
        (event: string,...values: any[]) : void;
    }

    interface Static {
        new(options?: eventemitter2.ConstructorOptions): eventemitter2.emitter
    }
    interface emitter {
        emit(event: string| string[],...values: any[]): boolean;
        emitAsync(event: string| string[],...values: any[]): Promise<any[]>;
        addListener(event: string, listener: Listener): emitter;
        on(event: string, listener: Listener): emitter;
        once(event: string, listener: Listener): emitter;
        many(event: string, timesToListen: number, listener: Listener): emitter;
        many(events: string[], listener: Listener): emitter;
        onAny(listener: EventAndListener): emitter;
        offAny(listener: Listener): emitter;
        removeListener(event: string, listener: Listener): emitter;
        off(event: string, listener: Listener): emitter;
        removeAllListeners(event?: string | eventNS): emitter;
        setMaxListeners(n: number): void;
        listeners(event: string): ()=>{}[] // TODO: not in documentation by Willian
        listenersAny():           ()=>{}[] // TODO: not in documentation by Willian
    }
    interface Promise<ReturnType> {
        then(onFulfilled:(response: ReturnType) => any, onRejected:(response: any) => any): Promise<any>;
        catch(onRejected:(response: any) => any): Promise<any>;
    }
}

export {eventemitter2 as EventEmitter2 };
