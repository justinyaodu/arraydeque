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
  size() {
    let size = this._tail - this._head;
    if (size < 0) {
      size += this._buffer.length;
    }
    return size;
  }

  /**
   * The index of the head.
   *
   * @internal
   */
  _head: number;

  _tail: number;

  /**
   * Circular buffer containing the elements.
   *
   * @internal
   */
  _buffer: (T | undefined)[];

  _indexMask: number;

  /**
   * Constructs an empty ArrayDeque.
   */
  constructor() {
    this._head = 0;
    this._tail = 0;
    this._buffer = [undefined];
    this._indexMask = 0;
    this._ensureCapacity(1020);
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

    const size = this.size();

    let newCapacity = this._buffer.length;
    do {
      newCapacity *= 2;
    } while (newCapacity < capacity);

    const relocateCount =
      this._head + size > this._buffer.length
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

    this._indexMask = this._buffer.length - 1;
    this._tail = (this._head + size) & this._indexMask;
    // console.log(this._buffer.length, this._indexMask);
  }

  /**
   * Inserts a new element at the head.
   */
  addFirst(value: T): void {
    const newHead = (this._head - 1) & this._indexMask;
    if (newHead === this._tail) {
      this._ensureCapacity(this._buffer.length + 1);
      this.addFirst(value);
      return;
    }

    this._buffer[newHead] = value;
    this._head = newHead;
  }

  /**
   * Inserts a new element at the tail. Equivalent to
   * {@link ArrayDeque.enqueue}.
   */
  addLast(value: T): void {
    const tail = this._tail;
    const newTail = (tail + 1) & this._indexMask;
    if (newTail === this._head) {
      // console.log({ newTail, head: this._head, tail: this._tail });
      this._ensureCapacity(this._buffer.length + 1);
      /*
      console.log(this);
      if (this._buffer.length > 10) {
        throw new Error();
      }
      */
      this.addLast(value);
      return;
    }

    this._buffer[tail] = value;
    this._tail = newTail;
  }

  /**
   * Returns the element at the head. Equivalent to {@link ArrayDeque.at}(0).
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
    const head = this._head;

    if (head === this._tail) {
      return undefined;
    }

    const buffer = this._buffer;
    const value = buffer[head];
    buffer[head] = undefined;
    this._head = (head + 1) & this._indexMask;
    return value;
  }

  /**
   * Returns the element at the tail. Equivalent to {@link ArrayDeque.at}(-1).
   *
   * @returns The element at the tail, or undefined if the ArrayDeque is empty.
   */
  last(): T | undefined {
    return this._buffer[(this._tail - 1) & this._indexMask];
  }

  /**
   * Removes and returns the element at the tail.
   *
   * @returns The element removed from the tail, or undefined if the
   * ArrayDeque is empty.
   */
  removeLast(): T | undefined {
    if (this._head === this._tail) {
      return undefined;
    }

    const newTail = (this._tail - 1) & this._indexMask;
    const value = this._buffer[newTail];
    this._buffer[newTail] = undefined;
    this._tail = newTail;

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
    const size = this.size();
    if (index >= size) {
      return undefined;
    }

    if (index < 0) {
      index += size;
      if (index < 0) {
        return undefined;
      }
    }

    return this._buffer[(this._head + index) & this._indexMask];
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
    clone._head = this._head;
    clone._tail = this._tail;
    clone._buffer = this._buffer.slice();
    clone._indexMask = this._indexMask;
    return clone;
  }

  /**
   * Returns an array containing the elements in this ArrayDeque, from the head
   * to the tail.
   */
  toArray(): T[] {
    // This could probably be optimized for better performance.
    return Array.from(this);
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
    if (this._index >= this._arrayDeque.size()) {
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
