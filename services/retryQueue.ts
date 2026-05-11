type RetryableOperation = {
    id: string;
    action: () => Promise<void>;
    retries: number;
    maxRetries: number;
};

class RetryQueue {
    private queue: RetryableOperation[] = [];

    async add(operation: RetryableOperation) {
        this.queue.push(operation);
        await this.process();
    }

    private async process() {
        for (let op of this.queue) {
            try {
                await op.action();
                this.queue = this.queue.filter(q => q.id !== op.id);
            } catch (e) {
                if (op.retries < op.maxRetries) {
                    op.retries++;
                    console.log(`Retrying operation ${op.id}, attempt ${op.retries}`);
                } else {
                    console.error(`Operation ${op.id} failed after ${op.maxRetries} retries`);
                    this.queue = this.queue.filter(q => q.id !== op.id);
                }
            }
        }
    }
}

export const retryQueue = new RetryQueue();
