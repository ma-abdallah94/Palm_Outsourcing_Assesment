export class Fluent {
    private chain: Promise<unknown> = Promise.resolve();

    protected step(action: () => Promise<unknown>): this {
        this.chain = this.chain.then(action);
        return this;
    }

    then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
        // Resolve to undefined. Resolving to `this` would call `then` again and never finish.
        return this.chain.then(() => undefined).then(onfulfilled, onrejected);
    }
}
