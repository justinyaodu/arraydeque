/**
 * A double-ended queue backed by an array.
 *
 * Supports insertion and removal at both ends, and random access to elements by index.
 *
 * @public
 */
class ArrayDeque<T> {
  /**
   * The number of elements in the ArrayDeque.
   */
  readonly size: number;

  /**
   * The index of the head.
   *
   * @internal
   */
  _head: number;

  /**
   * Circular buffer containing the elements.
   *
   * @internal
   */
  _buffer: (T | undefined)[];

  /**
   * Constructs an empty ArrayDeque.
   */
  constructor() {
    this.size = 0;
    this._head = 0;
    this._buffer = [undefined];
  }

  /**
   * Returns the buffer index corresponding to an offset from the head.
   *
   * The offset must be in [0, `this._buffer.length`].
   *
   * @internal
   */
  _wrapRight(offset: number): number {
    let wrapped = this._head + offset;
    if (wrapped >= this._buffer.length) {
      wrapped -= this._buffer.length;
    }
    return wrapped;
  }

  /**
   * Returns the index of the tail, assuming the ArrayDeque is non-empty.
   *
   * @internal
   */
  _tail(): number {
    return this._wrapRight(this.size - 1);
  }

  /**
   * Ensures that the buffer has space for the specified number of elements.
   *
   * @internal
   */
  _ensureCapacity(capacity: number): void {
    if (capacity <= this._buffer.length) {
      return;
    }

    let newCapacity = this._buffer.length;
    do {
      newCapacity *= 2;
    } while (newCapacity < capacity);

    const relocateCount =
      this._head + this.size > this._buffer.length
        ? this._buffer.length - this._head
        : 0;

    const padCount = newCapacity - this._buffer.length - relocateCount;

    for (let i = 0; i < padCount; i++) {
      this._buffer.push(undefined);
    }

    for (let i = 0; i < relocateCount; i++) {
      const index = this._head + i;
      this._buffer.push(this._buffer[index]);
      this._buffer[index] = undefined;
    }

    if (relocateCount > 0) {
      this._head = this._buffer.length - relocateCount;
    }
  }

  /**
   * Inserts a new element at the head.
   *
   * @param value - The element to insert.
   */
  addFirst(value: T): void {
    this._ensureCapacity(this.size + 1);

    let newHead = this._head - 1;
    if (newHead < 0) {
      newHead += this._buffer.length;
    }
    this._buffer[newHead] = value;
    this._head = newHead;

    (this as { size: number }).size++;
  }

  /**
   * Inserts a new element at the tail. Equivalent to {@link ArrayDeque.enqueue}.
   *
   * @param value - The element to insert.
   */
  addLast(value: T): void {
    this._ensureCapacity(this.size + 1);

    const newTail = this._wrapRight(this.size);
    this._buffer[newTail] = value;

    (this as { size: number }).size++;
  }

  /**
   * Returns the element at the head. Equivalent to {@link ArrayDeque.at}(0).
   *
   * @returns The element at the head, or undefined if the ArrayDeque is empty.
   */
  first(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    return this._buffer[this._head];
  }

  /**
   * Removes and returns the element at the head. Equivalent to {@link ArrayDeque.dequeue}.
   *
   * @returns The element removed from the head, or undefined if the ArrayDeque is empty.
   */
  removeFirst(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    const value = this._buffer[this._head];
    this._buffer[this._head] = undefined;
    this._head = this._wrapRight(1);

    (this as { size: number }).size--;
    return value;
  }

  /**
   * Returns the element at the tail. Equivalent to {@link ArrayDeque.at}(-1).
   *
   * @returns The element at the tail, or undefined if the ArrayDeque is empty.
   */
  last(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    return this._buffer[this._tail()];
  }

  /**
   * Removes and returns the element at the tail.
   *
   * @returns The element removed from the tail, or undefined if the ArrayDeque is empty.
   */
  removeLast(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    const tail = this._tail();
    const value = this._buffer[tail];
    this._buffer[tail] = undefined;

    (this as { size: number }).size--;
    return value;
  }

  /**
   * Returns the element at the specified index, where 0 is the head and higher indices move toward the tail.
   *
   * For negative indices, -1 is the tail and lower indices move toward the head, like [Array.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).
   *
   * @returns The element at the specified index, or undefined if the index is out of range.
   */
  at(index: number): T | undefined {
    if (index >= this.size) {
      return undefined;
    }

    if (index < 0) {
      index += this.size;
      if (index < 0) {
        return undefined;
      }
    }

    return this._buffer[this._wrapRight(index)];
  }

  /**
   * Inserts a new element at the tail. Equivalent to {@link ArrayDeque.addLast}.
   *
   * @param value - The element to insert.
   */
  enqueue(value: T): void {
    this.addLast(value);
  }

  /**
   * Removes and returns the element at the head. Equivalent to {@link ArrayDeque.removeFirst}.
   *
   * @returns The element removed from the head, or undefined if the ArrayDeque is empty.
   */
  dequeue(): T | undefined {
    return this.removeFirst();
  }

  /**
   * Returns an iterator that returns elements sequentially, from the head to the tail.
   *
   * If the ArrayDeque is modified during iteration, the iterator's behavior is undefined.
   */
  [Symbol.iterator](): IterableIterator<T> {
    return new ArrayDequeIterator(this);
  }
}

class ArrayDequeIterator<T> implements IterableIterator<T> {
  _index: number;

  constructor(public _deque: ArrayDeque<T>) {
    this._index = 0;
  }

  next(): IteratorResult<T> {
    if (this._index >= this._deque.size) {
      return { done: true, value: undefined };
    }

    return {
      done: false,
      value: this._deque._buffer[this._deque._wrapRight(this._index++)]!,
    };
  }

  [Symbol.iterator]() {
    return this;
  }
}

export { ArrayDeque };
