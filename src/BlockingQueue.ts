import { ArrayDeque } from "./ArrayDeque.js";

/**
 * A queue that supports waiting for elements to become available.
 *
 * This can be used to implement the producer-consumer pattern, with producers
 * calling {@link BlockingQueue.enqueue} and consumers calling
 * {@link BlockingQueue.dequeue}.
 *
 * Iterating over a BlockingQueue with [for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
 * dequeues and returns elements in the order they were inserted. This loop will
 * run forever unless you `break` out of it, because there is no way to know
 * whether another element will be inserted in the future.
 *
 * @public
 */
class BlockingQueue<T = any> implements AsyncIterable<T> {
  /**
   * Values that have been enqueued and not removed.

   * @internal
   */
  _values = new ArrayDeque<T>();

  /**
   * Resolvers for Promises that have been dequeued but not resolved.
   *
   * @internal
   */
  _resolves = new ArrayDeque<(value: T) => void>();

  /**
   * Inserts an element at the tail of the queue.
   */
  enqueue(value: T): void {
    if (this._resolves.size > 0) {
      this._resolves.dequeue()!(value);
    } else {
      this._values.enqueue(value);
    }
  }

  /**
   * The n'th call to this method returns a Promise that will resolve to the
   * n'th value enqueued.
   *
   * If the n'th value has already been enqueued, the Promise resolves
   * immediately. Otherwise, awaiting the Promise will block until the
   * corresponding value becomes available. If the value is never enqueued, the
   * Promise will never resolve either.
   */
  dequeue(): Promise<T> {
    if (this._values.size > 0) {
      return Promise.resolve(this._values.dequeue()!);
    } else {
      return new Promise<T>((resolve) => {
        this._resolves.enqueue(resolve);
      });
    }
  }

  /**
   * Returns an iterator whose `next()` method returns the Promise that would
   * be returned by {@link BlockingQueue.dequeue}.
   *
   * Note that this also dequeues elements from the BlockingQueue. To iterate
   * without dequeuing elements, call {@link BlockingQueue.tee} first.
   */
  [Symbol.asyncIterator]() {
    return new BlockingQueueAsyncIterator(this);
  }
}

class BlockingQueueAsyncIterator<T> implements AsyncIterableIterator<T> {
  constructor(public _blockingQueue: BlockingQueue<T>) {}

  next(): Promise<IteratorResult<T>> {
    return this._blockingQueue.dequeue().then((t) => ({
      done: false,
      value: t,
    }));
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

export { BlockingQueue };
