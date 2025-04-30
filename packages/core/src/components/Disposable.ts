/**
 * Objects that need to clean up after themselves.
 */
abstract class Disposable {
    private disposed: boolean = false;

    constructor() {
        this.disposed = false;
    }

    /**
     * Clean up.
     */
    dispose() {
        if (!this.disposed) {
            this.disposed = true;
            this.disposeInternal();
        }
    }

    /**
     * Extension point for disposable objects.
     */
    protected abstract disposeInternal(): void;
}

export default Disposable;
