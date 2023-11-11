import Benchmark from "benchmark";
import Denque from "denque";
import Deque from "double-ended-queue";
import { ArrayDeque } from "superlative-queues";

const suite = new Benchmark.Suite();
const iterations = 1000;

/*
const queue = new ArrayDeque();
for (let i = 0; i < iterations; i++) {
  console.log({ one: queue });
  queue.enqueue(i);
  console.log({ two: queue });
  queue.dequeue();
  console.log({ three: queue });
  queue.enqueue(i);
}
*/

suite.add("array", () => {
  const queue = [];
  for (let i = 0; i < iterations; i++) {
    queue.push(i);
    queue.push(queue.shift());
  }
});

suite.add("denque", () => {
  const queue = new Denque();
  for (let i = 0; i < iterations; i++) {
    queue.push(i);
    queue.push(queue.shift());
  }
});

suite.add("double-ended-queue", () => {
  const queue = new Deque();
  for (let i = 0; i < iterations; i++) {
    queue.enqueue(i);
    queue.enqueue(queue.dequeue());
  }
});

suite.add("superlative-queues", () => {
  const queue = new ArrayDeque();
  for (let i = 0; i < iterations; i++) {
    queue.enqueue(i);
    queue.enqueue(queue.dequeue());
  }
});

suite.on("cycle", (e) => {
  console.log(String(e.target));
});

suite.run();
