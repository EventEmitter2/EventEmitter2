declare let eventemitter2: eventemitter2.Static

declare module eventemitter2 {
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
        emit(event: string| string[],...values: any[]);
        emitAsync(event: string): Promise<any[]>;
        addListener(event: string, listener: Listener);
        on(event: string, listener: Listener);
        once(event: string, listener: Listener);
        many(event: string, timesToListen: number, listener: Listener);
        many(events: string[], listener: Listener);
        onAny(listener: EventAndListener);
        offAny(listener: Listener);
        removeListener(event: string, listener: Listener);
        off(event: string, listener: Listener);
        removeAllListeners(evetns?: string[]);
        setMaxListeners(n: number);
        listeners(event: string): ()=>{}[] // TODO: not in documentation by Willian
        listenersAny():           ()=>{}[] // TODO: not in documentation by Willian
    }
    interface Promise<ReturnType> {
        then(onFulfilled:(response: ReturnType) => any, onRejected:(response: any) => any): Promise<any>;
        catch(onRejected:(response: any) => any): Promise<any>;
    }
} 


export {eventemitter2 as EventEmitter2 };
