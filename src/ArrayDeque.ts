/**
 * A double-ended queue backed by an array.
 *
 * ArrayDeques support amortized constant-time insertion and removal at both
 * ends, and constant-time access to elements by index. Iterating over an
 * ArrayDeque returns elements sequentially from the head to the tail.
 *
 * @public
 */
class ArrayDeque<T> {
  /**
   * The number of elements in the ArrayDeque.
   */
  readonly size: number;

  /**
   * The index of the head. Always in [0, `this._buffer.length`).
   *
   * @internal
   */
  _head: number;

  /**
   * Circular buffer containing the elements. Its length is always a power of 2.
   * Slots that don't contain elements are either empty or set to undefined.
   *
   * @internal
   */
  _buffer: (T | undefined)[];

  /**
   * Used to wrap indices into the range [0, `this._buffer.length`). Always
   * equal to `this._buffer.length - 1`.
   *
   * @internal
   */
  _indexMask: number;

  /**
   * Constructs an empty ArrayDeque.
   *
   * @param capacity - If specified, ensure that the ArrayDeque can grow to this
   * size without additional allocations in the future.
   */
  constructor(capacity?: number) {
    let pow2Capacity;
    if (capacity === undefined) {
      pow2Capacity = 16;
    } else {
      pow2Capacity = 1;
      while (pow2Capacity < capacity) {
        pow2Capacity <<= 1;
      }
    }

    this.size = 0;
    this._head = 0;
    this._buffer = new Array<T | undefined>(pow2Capacity);
    this._indexMask = pow2Capacity - 1;
  }

  /**
   * Ensures that the ArrayDeque can grow to this size without additional
   * allocations in the future.
   */
  ensureCapacity(capacity: number): void {
    if (capacity <= this._buffer.length) {
      return;
    }

    let pow2Capacity = this._buffer.length;
    do {
      pow2Capacity *= 2;
    } while (pow2Capacity < capacity);

    this._resizeTo(pow2Capacity);
  }

  /**
   * Resize the buffer to the requested size, which must be a power of 2
   * `>= this.size`.
   *
   * @internal
   */
  _resizeTo(pow2Capacity: number): void {
    if (this._head + this.size <= this._buffer.length) {
      this._buffer.length = pow2Capacity;
    } else {
      const newBuffer = new Array<T | undefined>(pow2Capacity);
      for (let i = 0; i < this.size; i++) {
        newBuffer[i] = this._buffer[(this._head + i) & this._indexMask];
      }
      this._buffer = newBuffer;
      this._head = 0;
    }

    this._indexMask = pow2Capacity - 1;
  }

  /**
   * Inserts a new element at the head.
   */
  addFirst(value: T): void {
    if (this.size === this._buffer.length) {
      this._resizeTo(this._buffer.length << 1);
    }

    const newHead = (this._head - 1) & this._indexMask;
    this._buffer[newHead] = value;
    this._head = newHead;
    (this as { size: number }).size++;
  }

  /**
   * Inserts a new element at the tail. Equivalent to
   * {@link ArrayDeque.enqueue}.
   */
  addLast(value: T): void {
    if (this.size === this._buffer.length) {
      this._resizeTo(this._buffer.length << 1);
    }

    const newTail = (this._head + this.size) & this._indexMask;
    this._buffer[newTail] = value;
    (this as { size: number }).size++;
  }

  /**
   * Returns the element at the head. Equivalent to {@link ArrayDeque.at}(0),
   * but faster.
   *
   * @returns The element at the head, or undefined if the ArrayDeque is empty.
   */
  first(): T | undefined {
    return this._buffer[this._head];
  }

  /**
   * Removes and returns the element at the head. Equivalent to
   * {@link ArrayDeque.dequeue}.
   *
   * @returns The element removed from the head, or undefined if the ArrayDeque
   * is empty.
   */
  removeFirst(): T | undefined {
    // I tried using `this.size -= Math.sign(this.size)` to omit this branch,
    // but that implementation was slower.
    if (this.size === 0) {
      return undefined;
    }

    const value = this._buffer[this._head];
    this._buffer[this._head] = undefined;
    this._head = (this._head + 1) & this._indexMask;
    (this as { size: number }).size--;
    return value;
  }

  /**
   * Returns the element at the tail. Equivalent to {@link ArrayDeque.at}(-1),
   * but faster.
   *
   * @returns The element at the tail, or undefined if the ArrayDeque is empty.
   */
  last(): T | undefined {
    const tail = (this._head + this.size - 1) & this._indexMask;
    return this._buffer[tail];
  }

  /**
   * Removes and returns the element at the tail.
   *
   * @returns The element removed from the tail, or undefined if the
   * ArrayDeque is empty.
   */
  removeLast(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    const tail = (this._head + this.size - 1) & this._indexMask;
    const value = this._buffer[tail];
    this._buffer[tail] = undefined;
    (this as { size: number }).size--;
    return value;
  }

  /**
   * Returns the element at the specified index, where 0 is the head and higher
   * indices move toward the tail.
   *
   * For negative indices, -1 is the tail and lower indices move toward the
   * head, like [Array.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).
   *
   * @returns The element at the specified index, or undefined if the index is
   * out of range.
   */
  at(index: number): T | undefined {
    if (index < -this.size || index >= this.size) {
      return undefined;
    }

    if (index < 0) {
      index += this.size;
    }

    return this._buffer[(this._head + index) & this._indexMask];
  }

  /**
   * Replaces the element at the specified index, where 0 is the head and higher
   * indices move toward the tail.
   *
   * For negative indices, -1 is the tail and lower indices move toward the
   * head, like [Array.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).
   *
   * @returns The element at the specified index.
   * @throws RangeError if the index is out of range.
   */
  set(index: number, value: T): void {
    if (index < -this.size || index >= this.size) {
      throw new RangeError(
        `index ${index} out of range for ArrayDeque of size ${this.size}`,
      );
    }

    if (index < 0) {
      index += this.size;
    }

    this._buffer[(this._head + index) & this._indexMask] = value;
  }

  /**
   * Inserts a new element at the tail. Equivalent to {@link ArrayDeque.addLast}.
   */
  enqueue(value: T): void {
    this.addLast(value);
  }

  /**
   * Removes and returns the element at the head. Equivalent to
   * {@link ArrayDeque.removeFirst}.
   *
   * @returns The element removed from the head, or undefined if the ArrayDeque
   * is empty.
   */
  dequeue(): T | undefined {
    return this.removeFirst();
  }

  /**
   * Returns an iterator that returns elements sequentially, from the head to
   * the tail.
   *
   * The ArrayDeque must not be modified while the iterator is in use.
   * Otherwise, the behavior of the iterator is not defined.
   */
  [Symbol.iterator](): IterableIterator<T> {
    return new ArrayDequeIterator(this);
  }

  /**
   * Returns a shallow copy of this ArrayDeque.
   */
  clone(): ArrayDeque<T> {
    const clone = new ArrayDeque<T>();
    (clone as { size: number }).size = this.size;
    clone._head = this._head;
    clone._buffer = this._buffer.slice();
    clone._indexMask = this._indexMask;
    return clone;
  }

  /**
   * Returns an array containing the elements in this ArrayDeque, from the head
   * to the tail.
   */
  toArray(): T[] {
    const array = new Array<T>(this.size);
    for (let i = 0; i < this.size; i++) {
      array[i] = this._buffer[(this._head + i) & this._indexMask]!;
    }
    return array;
  }

  /**
   * Equivalent to {@link ArrayDeque.toArray}.
   */
  toJSON(): T[] {
    return this.toArray();
  }
}

class ArrayDequeIterator<T> implements IterableIterator<T> {
  _index: number;

  constructor(public _arrayDeque: ArrayDeque<T>) {
    this._index = 0;
  }

  next(): IteratorResult<T> {
    if (this._index >= this._arrayDeque.size) {
      return { done: true, value: undefined };
    }

    return {
      done: false,
      value: this._arrayDeque.at(this._index++)!,
    };
  }

  [Symbol.iterator]() {
    return this;
  }
}

export { ArrayDeque };
