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
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(i);
  }
  return array;
}

function setupDenque(n) {
  const denque = new Denque();
  for (let i = 0; i < n; i++) {
    denque.push(i);
  }
  return denque;
}

function setupDeque(n) {
  const deque = new Deque();
  for (let i = 0; i < n; i++) {
    deque.push(i);
  }
  return deque;
}

function setupArrayDeque(n) {
  const arrayDeque = new ArrayDeque();
  for (let i = 0; i < n; i++) {
    arrayDeque.addLast(i);
  }
  return arrayDeque;
}

function setupAll(n) {
  return {
    array: setupArray(n),
    denque: setupDenque(n),
    deque: setupDeque(n),
    arrayDeque: setupArrayDeque(n),
  };
}

function threeEnqueueThreeDequeue(size) {
  const { array, denque, deque, arrayDeque } = setupAll(size);

  return new Benchmark.Suite(`size ${size}: 3x push, 3x shift`, suiteOptions)
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
      deque.push(1);
      deque.push(2);
      deque.push(3);
      deque.shift();
      deque.shift();
      deque.shift();
    })
    .add("superlative-queues", () => {
      arrayDeque.addLast(1);
      arrayDeque.addLast(2);
      arrayDeque.addLast(3);
      arrayDeque.removeFirst();
      arrayDeque.removeFirst();
      arrayDeque.removeFirst();
    });
}

function threePushThreePop(size) {
  const { array, denque, deque, arrayDeque } = setupAll(size);

  return new Benchmark.Suite(`size ${size}: 3x push, 3x pop`, suiteOptions)
    .add("array", () => {
      array.push(1);
      array.push(2);
      array.push(3);
      array.pop();
      array.pop();
      array.pop();
    })
    .add("denque", () => {
      denque.push(1);
      denque.push(2);
      denque.push(3);
      denque.pop();
      denque.pop();
      denque.pop();
    })
    .add("double-ended-queue", () => {
      deque.push(1);
      deque.push(2);
      deque.push(3);
      deque.pop();
      deque.pop();
      deque.pop();
    })
    .add("superlative-queues", () => {
      arrayDeque.addLast(1);
      arrayDeque.addLast(2);
      arrayDeque.addLast(3);
      arrayDeque.removeFirst();
      arrayDeque.removeFirst();
      arrayDeque.removeFirst();
    });
}

function pushUnshiftPopShift(size) {
  const { array, denque, deque, arrayDeque } = setupAll(size);

  return new Benchmark.Suite(
    `size ${size}: push, unshift, pop, shift`,
    suiteOptions,
  )
    .add("array", () => {
      array.push(1);
      array.unshift(2);
      array.pop();
      array.shift();
    })
    .add("denque", () => {
      denque.push(1);
      denque.unshift(2);
      denque.pop();
      denque.shift();
    })
    .add("double-ended-queue", () => {
      deque.push(1);
      deque.unshift(2);
      deque.pop();
      deque.shift();
    })
    .add("superlative-queues", () => {
      arrayDeque.addLast(1);
      arrayDeque.addFirst(2);
      arrayDeque.removeLast();
      arrayDeque.removeFirst();
    });
}

const suites = [
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(`empty: ${iterations}x push`, suiteOptions)
      .add("array", () => {
        setupArray(iterations);
      })
      .add("denque", () => {
        setupDenque(iterations);
      })
      .add("double-ended-queue", () => {
        setupDeque(iterations);
      })
      .add("superlative-queues", () => {
        setupArrayDeque(iterations);
      });
  })(),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x push, shift until empty`,
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
        const doubleEndedQueue = setupDeque(iterations);
        while (!doubleEndedQueue.isEmpty()) {
          doubleEndedQueue.shift();
        }
      })
      .add("superlative-queues", () => {
        const superlativeQueues = setupArrayDeque(iterations);
        while (superlativeQueues.size > 0) {
          superlativeQueues.removeFirst();
        }
      });
  })(),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x (push, push, shift)`,
      suiteOptions,
    )
      .add("array", () => {
        const array = [];
        for (let i = 0; i < iterations; i++) {
          array.push(i);
          array.push(array.shift());
        }
      })
      .add("denque", () => {
        const denque = new Denque();
        for (let i = 0; i < iterations; i++) {
          denque.push(i);
          denque.push(denque.shift());
        }
      })
      .add("double-ended-queue", () => {
        const deque = new Deque();
        for (let i = 0; i < iterations; i++) {
          deque.push(i);
          deque.push(deque.shift());
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.addLast(i);
          arrayDeque.addLast(arrayDeque.removeFirst());
        }
      });
  })(),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x (push, push, shift), shift until empty`,
      suiteOptions,
    )
      .add("array", () => {
        const array = [];
        for (let i = 0; i < iterations; i++) {
          array.push(i);
          array.push(array.shift());
        }
        while (array.length > 0) {
          array.shift();
        }
      })
      .add("denque", () => {
        const denque = new Denque();
        for (let i = 0; i < iterations; i++) {
          denque.push(i);
          denque.push(denque.shift());
        }
        while (!denque.isEmpty()) {
          denque.shift();
        }
      })
      .add("double-ended-queue", () => {
        const deque = new Deque();
        for (let i = 0; i < iterations; i++) {
          deque.push(i);
          deque.push(deque.shift());
        }
        while (!deque.isEmpty()) {
          deque.shift();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.addLast(i);
          arrayDeque.addLast(arrayDeque.removeFirst());
        }
        while (arrayDeque.size > 0) {
          arrayDeque.removeFirst();
        }
      });
  })(),
  threeEnqueueThreeDequeue(1000),
  threeEnqueueThreeDequeue(2000000),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x push, pop until empty`,
      suiteOptions,
    )
      .add("array", () => {
        const array = setupArray(iterations);
        while (array.length > 0) {
          array.pop();
        }
      })
      .add("denque", () => {
        const denque = setupDenque(iterations);
        while (!denque.isEmpty()) {
          denque.pop();
        }
      })
      .add("double-ended-queue", () => {
        const doubleEndedQueue = setupDeque(iterations);
        while (!doubleEndedQueue.isEmpty()) {
          doubleEndedQueue.pop();
        }
      })
      .add("superlative-queues", () => {
        const superlativeQueues = setupArrayDeque(iterations);
        while (superlativeQueues.size > 0) {
          superlativeQueues.removeLast();
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
        const array = [];
        for (let i = 0; i < iterations; i++) {
          array.push(i);
          array.push(i);
          array.pop();
        }
      })
      .add("denque", () => {
        const denque = new Denque();
        for (let i = 0; i < iterations; i++) {
          denque.push(i);
          denque.push(i);
          denque.pop();
        }
      })
      .add("double-ended-queue", () => {
        const deque = new Deque();
        for (let i = 0; i < iterations; i++) {
          deque.push(i);
          deque.push(i);
          deque.pop();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.addLast(i);
          arrayDeque.addLast(i);
          arrayDeque.removeLast();
        }
      });
  })(),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x (push, push, pop), pop until empty`,
      suiteOptions,
    )
      .add("array", () => {
        const array = [];
        for (let i = 0; i < iterations; i++) {
          array.push(i);
          array.push(i);
          array.pop();
        }
        while (array.length > 0) {
          array.pop();
        }
      })
      .add("denque", () => {
        const denque = new Denque();
        for (let i = 0; i < iterations; i++) {
          denque.push(i);
          denque.push(i);
          denque.pop();
        }
        while (!denque.isEmpty()) {
          denque.pop();
        }
      })
      .add("double-ended-queue", () => {
        const deque = new Deque();
        for (let i = 0; i < iterations; i++) {
          deque.push(i);
          deque.push(i);
          deque.pop();
        }
        while (!deque.isEmpty()) {
          deque.pop();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.addLast(i);
          arrayDeque.addLast(i);
          arrayDeque.removeLast();
        }
        while (arrayDeque.size > 0) {
          arrayDeque.removeLast();
        }
      });
  })(),
  threePushThreePop(1000),
  threePushThreePop(2000000),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x (push, unshift, push, unshift, pop, shift)`,
      suiteOptions,
    )
      .add("array", () => {
        const array = [];
        for (let i = 0; i < iterations; i++) {
          array.push(i);
          array.unshift(i);
          array.push(i);
          array.unshift(i);
          array.pop();
          array.shift();
        }
      })
      .add("denque", () => {
        const denque = new Denque();
        for (let i = 0; i < iterations; i++) {
          denque.push(i);
          denque.unshift(i);
          denque.push(i);
          denque.unshift(i);
          denque.pop();
          denque.shift();
        }
      })
      .add("double-ended-queue", () => {
        const deque = new Deque();
        for (let i = 0; i < iterations; i++) {
          deque.push(i);
          deque.unshift(i);
          deque.push(i);
          deque.unshift(i);
          deque.pop();
          deque.shift();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.addLast(i);
          arrayDeque.addFirst(i);
          arrayDeque.addLast(i);
          arrayDeque.addFirst(i);
          arrayDeque.removeLast();
          arrayDeque.removeFirst();
        }
      });
  })(),
  (() => {
    const iterations = 1000;
    return new Benchmark.Suite(
      `empty: ${iterations}x (push, unshift, push, unshift, pop, shift), (pop, shift) until empty`,
      suiteOptions,
    )
      .add("array", () => {
        const array = [];
        for (let i = 0; i < iterations; i++) {
          array.push(i);
          array.unshift(i);
          array.push(i);
          array.unshift(i);
          array.pop();
          array.shift();
        }
        while (array.length > 0) {
          array.pop();
          array.shift();
        }
      })
      .add("denque", () => {
        const denque = new Denque();
        for (let i = 0; i < iterations; i++) {
          denque.push(i);
          denque.unshift(i);
          denque.push(i);
          denque.unshift(i);
          denque.pop();
          denque.shift();
        }
        while (!denque.isEmpty()) {
          denque.pop();
          denque.shift();
        }
      })
      .add("double-ended-queue", () => {
        const deque = new Deque();
        for (let i = 0; i < iterations; i++) {
          deque.push(i);
          deque.unshift(i);
          deque.push(i);
          deque.unshift(i);
          deque.pop();
          deque.shift();
        }
        while (!deque.isEmpty()) {
          deque.pop();
          deque.shift();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.addLast(i);
          arrayDeque.addFirst(i);
          arrayDeque.addLast(i);
          arrayDeque.addFirst(i);
          arrayDeque.removeLast();
          arrayDeque.removeFirst();
        }
        while (arrayDeque.size > 0) {
          arrayDeque.removeLast();
          arrayDeque.removeFirst();
        }
      });
  })(),
  pushUnshiftPopShift(1000),
  pushUnshiftPopShift(2000000),
];

suites.forEach((s) => {
  s.run();
});
