export function log(logResults: boolean = true) {
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        let originalMethod = descriptor.value; // save a reference to the original method

        // NOTE: Do not use arrow syntax here. Use a function expression in
        // order to use the correct value of `this` in this method (see notes below)
        descriptor.value = function (...args: any[]) {
            var message = `${target.constructor.name}.${propertyKey}(${JSON.stringify(args)})`;
            console.log(message);
            let value = originalMethod.apply(this, args);
            if (logResults) {
                if (value.then) {
                    value.then(result=> {
                        console.log(`${message} = ${JSON.stringify(result)}`)
                    })
                }
                else {
                    console.log(JSON.stringify(value));
                }
            }
            return value;
        };


        return descriptor;
    }
}