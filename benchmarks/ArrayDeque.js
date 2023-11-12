import Benchmark from "benchmark";
import Denque from "denque";
import Deque from "double-ended-queue";
import { ArrayDeque as ArrayDeque } from "superlative-queues";

const suiteOptions = {
  onStart(e) {
    console.log(e.currentTarget.name);
  },
  onCycle(e) {
    console.log(`\t${e.target}`);
  },
  onError(e) {
    console.error(e);
  },
};

function setupArray(n) {
  const queue = [];
  for (let i = 0; i < n; i++) {
    queue.push(i);
  }
  return queue;
}

function setupDenque(n) {
  const queue = new Denque();
  for (let i = 0; i < n; i++) {
    queue.push(i);
  }
  return queue;
}

function setupDoubleEndedQueue(n) {
  const queue = new Deque();
  for (let i = 0; i < n; i++) {
    queue.enqueue(i);
  }
  return queue;
}

function setupSuperlativeQueues(n) {
  const queue = new ArrayDeque();
  for (let i = 0; i < n; i++) {
    queue.enqueue(i);
  }
  return queue;
}

function setupAll(n) {
  return {
    array: setupArray(n),
    denque: setupDenque(n),
    doubleEndedQueue: setupDoubleEndedQueue(n),
    superlativeQueues: setupSuperlativeQueues(n),
  };
}

function threeEnqueueThreeDequeue(size) {
  const { array, denque, doubleEndedQueue, superlativeQueues } = setupAll(size);

  return new Benchmark.Suite(
    `size ${size}: 3x enqueue, 3x dequeue`,
    suiteOptions,
  )
    .add("array", () => {
      array.push(1);
      array.push(2);
      array.push(3);
      array.shift();
      array.shift();
      array.shift();
    })
    .add("denque", () => {
      denque.push(1);
      denque.push(2);
      denque.push(3);
      denque.shift();
      denque.shift();
      denque.shift();
    })
    .add("double-ended-queue", () => {
      doubleEndedQueue.enqueue(1);
      doubleEndedQueue.enqueue(2);
      doubleEndedQueue.enqueue(3);
      doubleEndedQueue.dequeue();
      doubleEndedQueue.dequeue();
      doubleEndedQueue.dequeue();
    })
    .add("superlative-queues", () => {
      superlativeQueues.enqueue(1);
      superlativeQueues.enqueue(2);
      superlativeQueues.enqueue(3);
      superlativeQueues.dequeue();
      superlativeQueues.dequeue();
      superlativeQueues.dequeue();
    });
}

const suites = [
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(`empty: ${iterations}x enqueue`, suiteOptions)
      .add("array", () => {
        setupArray(iterations);
      })
      .add("denque", () => {
        setupDenque(iterations);
      })
      .add("double-ended-queue", () => {
        setupDoubleEndedQueue(iterations);
      })
      .add("superlative-queues", () => {
        setupSuperlativeQueues(iterations);
      });
  })(),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x enqueue, ${iterations}x dequeue`,
      suiteOptions,
    )
      .add("array", () => {
        const array = setupArray(iterations);
        while (array.length > 0) {
          array.shift();
        }
      })
      .add("denque", () => {
        const denque = setupDenque(iterations);
        while (!denque.isEmpty()) {
          denque.shift();
        }
      })
      .add("double-ended-queue", () => {
        const doubleEndedQueue = setupDoubleEndedQueue(iterations);
        while (!doubleEndedQueue.isEmpty()) {
          doubleEndedQueue.dequeue();
        }
      })
      .add("superlative-queues", () => {
        const superlativeQueues = setupSuperlativeQueues(iterations);
        while (superlativeQueues.size > 0) {
          superlativeQueues.dequeue();
        }
      });
  })(),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x (enqueue, enqueue, dequeue)`,
      suiteOptions,
    )
      .add("array", () => {
        const queue = [];
        for (let i = 0; i < iterations; i++) {
          queue.push(i);
          queue.push(queue.shift());
        }
      })
      .add("denque", () => {
        const queue = new Denque();
        for (let i = 0; i < iterations; i++) {
          queue.push(i);
          queue.push(queue.shift());
        }
      })
      .add("double-ended-queue", () => {
        const queue = new Deque();
        for (let i = 0; i < iterations; i++) {
          queue.enqueue(i);
          queue.enqueue(queue.dequeue());
        }
      })
      .add("superlative-queues", () => {
        const queue = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          queue.enqueue(i);
          queue.enqueue(queue.dequeue());
        }
      });
  })(),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x (push, push, pop)`,
      suiteOptions,
    )
      .add("array", () => {
        const queue = [];
        for (let i = 0; i < iterations; i++) {
          queue.push(i);
          queue.push(i);
          queue.pop();
        }
      })
      .add("denque", () => {
        const queue = new Denque();
        for (let i = 0; i < iterations; i++) {
          queue.push(i);
          queue.push(i);
          queue.pop();
        }
      })
      .add("double-ended-queue", () => {
        const queue = new Deque();
        for (let i = 0; i < iterations; i++) {
          queue.push(i);
          queue.push(i);
          queue.pop();
        }
      })
      .add("superlative-queues", () => {
        const queue = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          queue.addLast(i);
          queue.addLast(i);
          queue.removeLast();
        }
      });
  })(),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x (push, unshift, push, unshift, pop, shift)`,
      suiteOptions,
    )
      .add("array", () => {
        const queue = [];
        for (let i = 0; i < iterations; i++) {
          queue.push(i);
          queue.unshift(i);
          queue.push(i);
          queue.unshift(i);
          queue.pop();
          queue.shift();
        }
      })
      .add("denque", () => {
        const queue = new Denque();
        for (let i = 0; i < iterations; i++) {
          queue.push(i);
          queue.unshift(i);
          queue.push(i);
          queue.unshift(i);
          queue.pop();
          queue.shift();
        }
      })
      .add("double-ended-queue", () => {
        const queue = new Deque();
        for (let i = 0; i < iterations; i++) {
          queue.push(i);
          queue.unshift(i);
          queue.push(i);
          queue.unshift(i);
          queue.pop();
          queue.shift();
        }
      })
      .add("superlative-queues", () => {
        const queue = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          queue.addLast(i);
          queue.addFirst(i);
          queue.addLast(i);
          queue.addFirst(i);
          queue.removeLast();
          queue.removeFirst();
        }
      });
  })(),
  threeEnqueueThreeDequeue(1000),
  threeEnqueueThreeDequeue(2000000),
];

suites.forEach((s) => {
  s.run();
});
