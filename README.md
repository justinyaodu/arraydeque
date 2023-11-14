## API Reference

- [`ArrayDeque`](#arraydeque)
  - [`constructor`](#arraydequeconstructor)
  - [`MAX_CAPACITY`](#arraydequemax_capacity)
  - [`size`](#arraydequesize)
  - [`at`](#arraydequeat)
  - [`clone`](#arraydequeclone)
  - [`dequeue`](#arraydequedequeue)
  - [`dequeueUnchecked`](#arraydequedequeueunchecked)
  - [`enqueue`](#arraydequeenqueue)
  - [`ensureCapacity`](#arraydequeensurecapacity)
  - [`first`](#arraydequefirst)
  - [`firstUnchecked`](#arraydequefirstunchecked)
  - [`get`](#arraydequeget)
  - [`getNonNegativeUnchecked`](#arraydequegetnonnegativeunchecked)
  - [`getUnchecked`](#arraydequegetunchecked)
  - [`last`](#arraydequelast)
  - [`lastUnchecked`](#arraydequelastunchecked)
  - [`pop`](#arraydequepop)
  - [`popUnchecked`](#arraydequepopunchecked)
  - [`push`](#arraydequepush)
  - [`set`](#arraydequeset)
  - [`setNonNegativeUnchecked`](#arraydequesetnonnegativeunchecked)
  - [`setUnchecked`](#arraydequesetunchecked)
  - [`shift`](#arraydequeshift)
  - [`shiftUnchecked`](#arraydequeshiftunchecked)
  - [`toArray`](#arraydequetoarray)
  - [`toJSON`](#arraydequetojson)
  - [`unshift`](#arraydequeunshift)
  - [`[Symbol.iterator]`](#arraydequesymboliterator)
- [`BlockingQueue`](#blockingqueue)
  - [`constructor`](#blockingqueueconstructor)
  - [`dequeue`](#blockingqueuedequeue)
  - [`enqueue`](#blockingqueueenqueue)
  - [`[Symbol.asyncIterator]`](#blockingqueuesymbolasynciterator)

---

### `ArrayDeque`

```ts
class ArrayDeque<T> implements Iterable<T>
```

A double-ended queue backed by an array.

ArrayDeques support amortized constant-time insertion and removal at both
ends, and constant-time access to elements by index. Iterating over an
ArrayDeque returns the elements sequentially.

#### `ArrayDeque.constructor`

```ts
new ArrayDeque(capacity?: number)
```

Constructs an empty ArrayDeque, optionally specifying the initial capacity.

#### `ArrayDeque.MAX_CAPACITY`

```ts
static readonly MAX_CAPACITY = Math.pow(2, 31)
```

The maximum number of elements that an ArrayDeque can contain.

#### `ArrayDeque.size`

```ts
readonly size: number
```

The number of elements in the ArrayDeque.

#### `ArrayDeque.at`

```ts
at(index: number): T | undefined
```

Returns the element at the specified index. See [ArrayDeque.get](#arraydequeget).

#### `ArrayDeque.clone`

```ts
clone(): ArrayDeque<T>
```

Returns a shallow copy of this ArrayDeque with the same capacity.

#### `ArrayDeque.dequeue`

```ts
dequeue(): T | undefined
```

Removes and returns the first element. See [ArrayDeque.shift](#arraydequeshift).

#### `ArrayDeque.dequeueUnchecked`

```ts
dequeueUnchecked(): T
```

Removes and returns the first element, assuming the ArrayDeque is
non-empty. See [ArrayDeque.shiftUnchecked](#arraydequeshiftunchecked).

#### `ArrayDeque.enqueue`

```ts
enqueue(value: T): void
```

Inserts a new element at the back. See [ArrayDeque.push](#arraydequepush).

#### `ArrayDeque.ensureCapacity`

```ts
ensureCapacity(capacity: number): void
```

Ensures that the ArrayDeque can grow to this size without additional
allocations in the future.

#### `ArrayDeque.first`

```ts
first(): T | undefined
```

Returns the first element without removing it.

Returns undefined if the ArrayDeque is empty. If you know the ArrayDeque
is non-empty, consider [ArrayDeque.firstUnchecked](#arraydequefirstunchecked), which excludes
undefined from the return type.

#### `ArrayDeque.firstUnchecked`

```ts
firstUnchecked(): T
```

Returns the first element without removing it, assuming the ArrayDeque
is non-empty.

Like [ArrayDeque.first](#arraydequefirst), but if the ArrayDeque is empty, the
behavior is not defined.

#### `ArrayDeque.get`

```ts
get(index: number): T | undefined
```

Returns the element at the specified index. Negative indices count from the
end, like [Array.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).

Returns undefined if the index is out of range. If you know the index is
in range, consider [ArrayDeque.getUnchecked](#arraydequegetunchecked) or
[ArrayDeque.getNonNegativeUnchecked](#arraydequegetnonnegativeunchecked), which exclude undefined from
the return type and might be faster.

If the index is not an integer, the behavior is not defined.

#### `ArrayDeque.getNonNegativeUnchecked`

```ts
getNonNegativeUnchecked(index: number): T
```

Returns the element at the specified index, assuming that the index is
in `[0, size)`. See [ArrayDeque.get](#arraydequeget).

If the index is not an integer in the required range, the behavior is not
defined.

#### `ArrayDeque.getUnchecked`

```ts
getUnchecked(index: number): T
```

Returns the element at the specified index, assuming that the index is
in `[-size, size)`. See [ArrayDeque.get](#arraydequeget).

If the index is not an integer in the required range, the behavior is not
defined.

#### `ArrayDeque.last`

```ts
last(): T | undefined
```

Returns the last element without removing it.

Returns undefined if the ArrayDeque is empty. If you know the ArrayDeque
is non-empty, consider [ArrayDeque.lastUnchecked](#arraydequelastunchecked), which excludes
undefined from the return type.

#### `ArrayDeque.lastUnchecked`

```ts
lastUnchecked(): T
```

Returns the last element without removing it, assuming the ArrayDeque is
non-empty. See [ArrayDeque.last](#arraydequelast).

If the ArrayDeque is empty, the behavior is undefined.

#### `ArrayDeque.pop`

```ts
pop(): T | undefined
```

Removes and returns the last element.

Returns undefined if the ArrayDeque is empty. If you know the ArrayDeque
is non-empty, consider [ArrayDeque.popUnchecked](#arraydequepopunchecked), which excludes
undefined from the return type and might be faster.

#### `ArrayDeque.popUnchecked`

```ts
popUnchecked(): T
```

Removes and returns the last element, assuming the ArrayDeque is non-empty.

This might be faster than [ArrayDeque.pop](#arraydequepop), but if the ArrayDeque is
empty, the behavior is not defined.

#### `ArrayDeque.push`

```ts
push(value: T): void
```

Inserts a new element at the back.

Throws RangeError if the ArrayDeque's size would exceed
[ArrayDeque.MAX_CAPACITY](#arraydequemax_capacity).

#### `ArrayDeque.set`

Replaces the element at the specified index. Negative indices count from
the end, like [Array.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).

Throws RangeError if the index is out of range. If you know the index is in
range, consider [ArrayDeque.setUnchecked](#arraydequesetunchecked) or
[ArrayDeque.setNonNegativeUnchecked](#arraydequesetnonnegativeunchecked), which might be faster.

If the index is not an integer, the behavior is not defined.

#### `ArrayDeque.setNonNegativeUnchecked`

```ts
setNonNegativeUnchecked(index: number, value: T): void
```

Replaces the element at the specified index, assuming that the index is in
`[0, size)`. See [ArrayDeque.set](#arraydequeset).

If the index is not an integer in the required range, the behavior is not
defined.

#### `ArrayDeque.setUnchecked`

```ts
setUnchecked(index: number, value: T): void
```

Replaces the element at the specified index, assuming that the index is in
`[-size, size)`. See [ArrayDeque.set](#arraydequeset).

If the index is not an integer in the required range, the behavior is not
defined.

#### `ArrayDeque.shift`

```ts
shift(): T | undefined
```

Removes and returns the first element.

Returns undefined if the ArrayDeque is empty. If you know the ArrayDeque
is non-empty, consider [ArrayDeque.shiftUnchecked](#arraydequeshiftunchecked), which excludes
undefined from the return type and might be faster.

#### `ArrayDeque.shiftUnchecked`

```ts
shiftUnchecked(): T
```

Removes and returns the first element, assuming the ArrayDeque is
non-empty.

This might be faster than [ArrayDeque.shift](#arraydequeshift), but if the ArrayDeque
is empty, the behavior is not defined.

#### `ArrayDeque.toArray`

```ts
toArray(): T[]
```

Returns an array containing the elements of this ArrayDeque in the same
order.

#### `ArrayDeque.toJSON`

```ts
toJSON(): T[]
```

Returns an array containing the elements of this ArrayDeque in the same
order. Equivalent to [ArrayDeque.toArray](#arraydequetoarray).

#### `ArrayDeque.unshift`

```ts
unshift(value: T): void
```

Inserts a new element at the front.

Throws RangeError if the ArrayDeque's size would exceed
[ArrayDeque.MAX_CAPACITY](#arraydequemaxcapacity).

#### `ArrayDeque[Symbol.iterator]`

```ts
[Symbol.iterator](): IterableIterator<T>
```

Returns an iterator that returns elements sequentially.

The ArrayDeque must not be modified while the iterator is in use.
Otherwise, the behavior of the iterator is not defined.

---

### `BlockingQueue`

```ts
class BlockingQueue<T> implements AsyncIterable<T>
```

A queue that supports waiting for elements to become available.

This can be used to implement the producer-consumer pattern, with producers
calling [BlockingQueue.enqueue](#blockingqueueenqueue) and consumers calling
[BlockingQueue.dequeue](#blockingqueuedequeue).

Iterating over a BlockingQueue with [for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
dequeues and returns elements in the order they were inserted. This loop will
run forever unless you break out of it, because there is no way to know
whether another element will be inserted in the future.

#### `BlockingQueue.constructor`

```ts
new BlockingQueue();
```

Constructs an empty BlockingQueue.

#### `BlockingQueue.dequeue`

```ts
dequeue(): Promise<T>
```

The n'th call to this method returns a Promise that will resolve to the
n'th value enqueued.

If the n'th value has already been enqueued, the Promise resolves
immediately. Otherwise, awaiting the Promise will block until the
corresponding value becomes available. If the value is never enqueued, the
Promise will never resolve either.

#### `BlockingQueue.enqueue`

```ts
enqueue(value: T): void
```

Inserts an element at the tail of the queue.

#### `BlockingQueue[Symbol.asyncIterator]`

```ts
[Symbol.asyncIterator](): AsyncIterableIterator<T>
```

Returns an async iterator whose `next()` method returns the Promise that
would be returned by [BlockingQueue.dequeue](#blockingqueuedequeue).
