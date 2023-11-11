import { expect, test } from "@jest/globals";

import { BlockingQueue } from "../src/index";

test("enqueue many, dequeue many", async () => {
  const queue = new BlockingQueue();

  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);

  expect(await queue.dequeue()).toStrictEqual(10);
  expect(await queue.dequeue()).toStrictEqual(20);
  expect(await queue.dequeue()).toStrictEqual(30);
});

test("dequeue many, enqueue many", async () => {
  const queue = new BlockingQueue();

  const p1 = queue.dequeue();
  const p2 = queue.dequeue();
  const p3 = queue.dequeue();

  queue.enqueue(10);
  expect(await p1).toStrictEqual(10);

  queue.enqueue(20);
  expect(await p2).toStrictEqual(20);

  queue.enqueue(30);
  expect(await p3).toStrictEqual(30);
});

test("mixed enqueue and dequeue", async () => {
  const queue = new BlockingQueue();

  queue.enqueue(10);
  expect(await queue.dequeue()).toStrictEqual(10);

  const p2 = queue.dequeue();

  queue.enqueue(20);
  expect(await p2).toStrictEqual(20);

  queue.enqueue(30);
  expect(await queue.dequeue()).toStrictEqual(30);
});

test("iterator", async () => {
  const queue = new BlockingQueue();

  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);

  const values = [];
  for await (const value of queue) {
    values.push(value);
    if (value === 30) {
      break;
    }
  }

  expect(values).toStrictEqual([10, 20, 30]);

  const iterator = queue[Symbol.asyncIterator]();
  expect(iterator[Symbol.asyncIterator]()).toBe(iterator);
});
