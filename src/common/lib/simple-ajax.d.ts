declare module 'simple-ajax' {
    var Ajax: AjaxConstructor;
    export = Ajax
}

interface AjaxConstructor {
    new(config: any);
    on<T>(eventName: string, resolve: (e: Event)=>void): void;
    send(): void;
}