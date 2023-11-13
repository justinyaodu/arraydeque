/**
 * A double-ended queue backed by an array.
 *
 * ArrayDeques support amortized constant-time insertion and removal at both
 * ends, and constant-time access to elements by index. Iterating over an
 * ArrayDeque returns elements sequentially from the first element to the last.
 *
 * @public
 */
class ArrayDeque<T> {
  /**
   * The maximum number of elements that an ArrayDeque can contain.
   */
  static readonly MAX_CAPACITY = Math.pow(2, 31);

  /**
   * The number of elements in the ArrayDeque.
   */
  readonly size: number;

  /**
   * The index of the head. Always in [0, `_buffer.length`).
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
   * Used to wrap indices into the range [0, `_buffer.length`). Always
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
        pow2Capacity *= 2;
      }
    }
    this._assertCapacityValid(pow2Capacity);

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

    this._resize(pow2Capacity);
  }

  _assertCapacityValid(capacity: number) {
    if (capacity > ArrayDeque.MAX_CAPACITY) {
      const msg = `requested capacity of ${capacity} exceeds ArrayDeque.MAX_CAPACITY = ${ArrayDeque.MAX_CAPACITY}`;
      throw new RangeError(msg);
    }
  }

  /**
   * Resizes the buffer to the requested length, which must be a power of 2
   * `>= this.size`.
   *
   * @internal
   */
  _resize(pow2Capacity: number): void {
    this._assertCapacityValid(pow2Capacity);

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
   * Inserts a new element at the front.
   *
   * @throws RangeError if the ArrayDeque's size would exceed
   * {@link ArrayDeque.MAX_CAPACITY}.
   */
  unshift(value: T): void {
    if (this.size === this._buffer.length) {
      this._resize(this._buffer.length * 2);
    }

    const newHead = (this._head - 1) & this._indexMask;
    this._buffer[newHead] = value;
    this._head = newHead;
    (this as { size: number }).size++;
  }

  /**
   * Inserts a new element at the back.
   *
   * @throws RangeError if the ArrayDeque's size would exceed
   * {@link ArrayDeque.MAX_CAPACITY}.
   */
  push(value: T): void {
    if (this.size === this._buffer.length) {
      this._resize(this._buffer.length * 2);
    }

    const newTail = (this._head + this.size) & this._indexMask;
    this._buffer[newTail] = value;
    (this as { size: number }).size++;
  }

  /**
   * Inserts a new element at the back. See {@link ArrayDeque.push}.
   */
  enqueue(value: T): void {
    this.push(value);
  }

  /**
   * Returns the first element without removing it.
   *
   * Returns undefined if the ArrayDeque is empty. If you know the ArrayDeque
   * is non-empty, consider {@link ArrayDeque.firstUnchecked}, which excludes
   * undefined from the return type.
   */
  first(): T | undefined {
    return this._buffer[this._head];
  }

  /**
   * Returns the first element without removing it, assuming the ArrayDeque
   * is non-empty.
   *
   * Like {@link ArrayDeque.first}, but if the ArrayDeque is empty, the
   * behavior is not defined.
   */
  firstUnchecked(): T {
    return this.first()!;
  }

  /**
   * Removes and returns the first element.
   *
   * Returns undefined if the ArrayDeque is empty. If you know the ArrayDeque
   * is non-empty, consider {@link ArrayDeque.shiftUnchecked}, which excludes
   * undefined from the return type and might be faster.
   */
  shift(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    return this.shiftUnchecked();
  }

  /**
   * Removes and returns the first element, assuming the ArrayDeque is
   * non-empty.
   *
   * This might be faster than {@link ArrayDeque.shift}, but if the ArrayDeque
   * is empty, the behavior is not defined.
   */
  shiftUnchecked(): T {
    const value = this._buffer[this._head]!;
    this._buffer[this._head] = undefined;
    this._head = (this._head + 1) & this._indexMask;
    (this as { size: number }).size--;
    return value;
  }

  /**
   * Removes and returns the first element. See {@link ArrayDeque.shift}.
   */
  dequeue(): T | undefined {
    return this.shift();
  }

  /**
   * Removes and returns the first element, assuming the ArrayDeque is
   * non-empty. See {@link ArrayDeque.shiftUnchecked}.
   */
  dequeueUnchecked(): T {
    return this.shiftUnchecked();
  }

  /**
   * Returns the last element without removing it.
   *
   * Returns undefined if the ArrayDeque is empty. If you know the ArrayDeque
   * is non-empty, consider {@link ArrayDeque.lastUnchecked}, which excludes
   * undefined from the return type.
   */
  last(): T | undefined {
    const tail = (this._head + this.size - 1) & this._indexMask;
    return this._buffer[tail];
  }

  /**
   * Returns the last element without removing it, assuming the ArrayDeque is
   * non-empty. See {@link ArrayDeque.last}.
   *
   * If the ArrayDeque is empty, the behavior is undefined.
   */
  lastUnchecked(): T {
    return this.last()!;
  }

  /**
   * Removes and returns the last element.
   *
   * Returns undefined if the ArrayDeque is empty. If you know the ArrayDeque
   * is non-empty, consider {@link ArrayDeque.popUnchecked}, which excludes
   * undefined from the return type and might be faster.
   */
  pop(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    return this.popUnchecked();
  }

  /**
   * Removes and returns the last element, assuming the ArrayDeque is non-empty.
   *
   * This might be faster than {@link ArrayDeque.pop}, but if the ArrayDeque is
   * empty, the behavior is not defined.
   */
  popUnchecked(): T {
    const tail = (this._head + this.size - 1) & this._indexMask;
    const value = this._buffer[tail]!;
    this._buffer[tail] = undefined;
    (this as { size: number }).size--;
    return value;
  }

  /**
   * Returns the element at the specified index. See {@link ArrayDeque.get}.
   */
  at(index: number): T | undefined {
    return this.get(index);
  }

  /**
   * Returns the element at the specified index, where 0 is the head and higher
   * indices move toward the tail.
   *
   * For negative indices, -1 is the tail and lower indices move toward the
   * head, like [Array.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).
   *
   * Returns undefined if the index is out of range. If you know the index is
   * in range, consider {@link ArrayDeque.getUnchecked} or
   * {@link ArrayDeque.getNonNegativeUnchecked}, which exclude undefined from
   * the return type and might be faster.
   *
   * If the index is not an integer, the behavior is not defined.
   */
  get(index: number): T | undefined {
    if (index < -this.size || index >= this.size) {
      return undefined;
    }

    return this.getUnchecked(index);
  }

  /**
   * Returns the element at the specified index, assuming that the index is
   * in [-size, size). See {@link ArrayDeque.get}.
   *
   * If the index is not an integer in the required range, the behavior is not
   * defined.
   */
  getUnchecked(index: number): T {
    if (index < 0) {
      index += this.size;
    }

    return this.getNonNegativeUnchecked(index);
  }

  /**
   * Returns the element at the specified index, assuming that the index is
   * in [0, size). See {@link ArrayDeque.get}.
   *
   * If the index is not an integer in the required range, the behavior is not
   * defined.
   */
  getNonNegativeUnchecked(index: number): T {
    return this._buffer[(this._head + index) & this._indexMask]!;
  }

  /**
   * Replaces the element at the specified index, where 0 is the head and higher
   * indices move toward the tail.
   *
   * For negative indices, -1 is the tail and lower indices move toward the
   * head, like [Array.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).
   *
   * If the index is not an integer, the behavior is not defined.
   *
   * Throws RangeError if the index is out of range. If you know the index is in
   * range, consider {@link ArrayDeque.setUnchecked} or
   * {@link ArrayDeque.setNonNegativeUnchecked}, which might be faster.
   */
  set(index: number, value: T): void {
    if (index < -this.size || index >= this.size) {
      const msg = `index ${index} out of range for ArrayDeque of size ${this.size}`;
      throw new RangeError(msg);
    }

    this.setUnchecked(index, value);
  }

  /**
   * Replaces the element at the specified index, assuming that the index is in
   * [-size, size). See {@link ArrayDeque.set}.
   *
   * If the index is not an integer in the required range, the behavior is not
   * defined.
   */
  setUnchecked(index: number, value: T): void {
    if (index < 0) {
      index += this.size;
    }

    this.setNonNegativeUnchecked(index, value);
  }

  /**
   * Replaces the element at the specified index, assuming that the index is in
   * [0, size). See {@link ArrayDeque.set}.
   *
   * If the index is not an integer in the required range, the behavior is not
   * defined.
   */
  setNonNegativeUnchecked(index: number, value: T): void {
    this._buffer[(this._head + index) & this._indexMask] = value;
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
   * Returns a shallow copy of this ArrayDeque with the same capacity.
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
   * Returns an array containing the elements of this ArrayDeque in the same
   * order.
   */
  toArray(): T[] {
    if (this._head + this.size <= this._buffer.length) {
      return this._buffer.slice(this._head, this._head + this.size) as T[];
    }

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
      value: this._arrayDeque.getNonNegativeUnchecked(this._index++),
    };
  }

  [Symbol.iterator]() {
    return this;
  }
}

export { ArrayDeque };
