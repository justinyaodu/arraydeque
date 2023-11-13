import Benchmark from "benchmark";
import Denque from "denque";
import Deque from "double-ended-queue";
import { ArrayDeque } from "superlative-queues";

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
    arrayDeque.push(i);
  }
  return arrayDeque;
}

function setupAll(n, rotate = false) {
  const array = setupArray(n);
  const denque = setupDenque(n);
  const deque = setupDeque(n);
  const arrayDeque = setupArrayDeque(n);

  if (rotate) {
    for (let i = 0; i < n / 2; i++) {
      denque.push(denque.shift());
      deque.push(deque.shift());
      arrayDeque.push(arrayDeque.shift());
    }
  }

  return { array, denque, deque, arrayDeque };
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
      arrayDeque.push(1);
      arrayDeque.push(2);
      arrayDeque.push(3);
      arrayDeque.shift();
      arrayDeque.shift();
      arrayDeque.shift();
    })
    .add("superlative-queues unchecked", () => {
      arrayDeque.push(1);
      arrayDeque.push(2);
      arrayDeque.push(3);
      arrayDeque.shiftUnchecked();
      arrayDeque.shiftUnchecked();
      arrayDeque.shiftUnchecked();
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
      arrayDeque.push(1);
      arrayDeque.push(2);
      arrayDeque.push(3);
      arrayDeque.shift();
      arrayDeque.shift();
      arrayDeque.shift();
    })
    .add("superlative-queues unchecked", () => {
      arrayDeque.push(1);
      arrayDeque.push(2);
      arrayDeque.push(3);
      arrayDeque.shiftUnchecked();
      arrayDeque.shiftUnchecked();
      arrayDeque.shiftUnchecked();
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
      arrayDeque.push(1);
      arrayDeque.unshift(2);
      arrayDeque.pop();
      arrayDeque.shift();
    })
    .add("superlative-queues unchecked", () => {
      arrayDeque.push(1);
      arrayDeque.unshift(2);
      arrayDeque.popUnchecked();
      arrayDeque.shiftUnchecked();
    });
}

function toArray(size, contiguous) {
  const { array, denque, deque, arrayDeque } = setupAll(size, !contiguous);

  return new Benchmark.Suite(
    `size ${size}: toArray, ${contiguous ? "" : "not "}contiguous`,
    suiteOptions,
  )
    .add("array", () => {
      array.slice();
    })
    .add("denque", () => {
      denque.toArray();
    })
    .add("double-ended-queue", () => {
      deque.toArray();
    })
    .add("superlative-queues", () => {
      arrayDeque.toArray();
    });
}

function positiveIndexing(size) {
  const { array, denque, deque, arrayDeque } = setupAll(size, true);

  return new Benchmark.Suite(`size ${size}: positive indexing`, suiteOptions)
    .add("array", () => {
      let sum = 0;
      for (let i = 0; i < array.length; i++) {
        sum += array[i];
      }
      return sum;
    })
    .add("denque", () => {
      let sum = 0;
      for (let i = 0; i < denque.length; i++) {
        sum += denque.get(i);
      }
      return sum;
    })
    .add("double-ended-queue", () => {
      let sum = 0;
      for (let i = 0; i < deque.length; i++) {
        sum += deque.get(i);
      }
      return sum;
    })
    .add("superlative-queues", () => {
      let sum = 0;
      for (let i = 0; i < arrayDeque.size; i++) {
        sum += arrayDeque.get(i);
      }
      return sum;
    })
    .add("superlative-queues unchecked", () => {
      let sum = 0;
      for (let i = 0; i < arrayDeque.size; i++) {
        sum += arrayDeque.getNonNegativeUnchecked(i);
      }
      return sum;
    });
}

function negativeIndexing(size) {
  const { array, denque, deque, arrayDeque } = setupAll(size, true);

  return new Benchmark.Suite(`size ${size}: negative indexing`, suiteOptions)
    .add("array", () => {
      let sum = 0;
      for (let i = -1; i >= -array.length; i--) {
        sum += array.at(i);
      }
      return sum;
    })
    .add("denque", () => {
      let sum = 0;
      for (let i = -1; i >= -denque.length; i--) {
        sum += denque.get(i);
      }
      return sum;
    })
    .add("double-ended-queue", () => {
      let sum = 0;
      for (let i = -1; i >= -deque.length; i--) {
        sum += deque.get(i);
      }
      return sum;
    })
    .add("superlative-queues", () => {
      let sum = 0;
      for (let i = -1; i >= -arrayDeque.size; i--) {
        sum += arrayDeque.get(i);
      }
      return sum;
    })
    .add("superlative-queues unchecked", () => {
      let sum = 0;
      for (let i = -1; i >= -arrayDeque.size; i--) {
        sum += arrayDeque.getUnchecked(i);
      }
      return sum;
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
        const deque = setupDeque(iterations);
        while (!deque.isEmpty()) {
          deque.shift();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = setupArrayDeque(iterations);
        while (arrayDeque.size > 0) {
          arrayDeque.shift();
        }
      })
      .add("superlative-queues unchecked", () => {
        const arrayDeque = setupArrayDeque(iterations);
        while (arrayDeque.size > 0) {
          arrayDeque.shiftUnchecked();
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
          array.push(i);
          array.shift();
        }
      })
      .add("denque", () => {
        const denque = new Denque();
        for (let i = 0; i < iterations; i++) {
          denque.push(i);
          denque.push(i);
          denque.shift();
        }
      })
      .add("double-ended-queue", () => {
        const deque = new Deque();
        for (let i = 0; i < iterations; i++) {
          deque.push(i);
          deque.push(i);
          deque.shift();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.push(i);
          arrayDeque.push(i);
          arrayDeque.shift();
        }
      })
      .add("superlative-queues unchecked", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.push(i);
          arrayDeque.push(arrayDeque.shiftUnchecked());
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
          array.push(i);
          array.shift();
        }
        while (array.length > 0) {
          array.shift();
        }
      })
      .add("denque", () => {
        const denque = new Denque();
        for (let i = 0; i < iterations; i++) {
          denque.push(i);
          denque.push(i);
          denque.shift();
        }
        while (!denque.isEmpty()) {
          denque.shift();
        }
      })
      .add("double-ended-queue", () => {
        const deque = new Deque();
        for (let i = 0; i < iterations; i++) {
          deque.push(i);
          deque.push(i);
          deque.shift();
        }
        while (!deque.isEmpty()) {
          deque.shift();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.push(i);
          arrayDeque.push(i);
          arrayDeque.shift();
        }
        while (arrayDeque.size > 0) {
          arrayDeque.shift();
        }
      })
      .add("superlative-queues unchecked", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.push(i);
          arrayDeque.push(arrayDeque.shiftUnchecked());
        }
        while (arrayDeque.size > 0) {
          arrayDeque.shiftUnchecked();
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
        const deque = setupDeque(iterations);
        while (!deque.isEmpty()) {
          deque.pop();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = setupArrayDeque(iterations);
        while (arrayDeque.size > 0) {
          arrayDeque.pop();
        }
      })
      .add("superlative-queues unchecked", () => {
        const arrayDeque = setupArrayDeque(iterations);
        while (arrayDeque.size > 0) {
          arrayDeque.popUnchecked();
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
          arrayDeque.push(i);
          arrayDeque.push(i);
          arrayDeque.pop();
        }
      })
      .add("superlative-queues unchecked", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.push(i);
          arrayDeque.push(i);
          arrayDeque.popUnchecked();
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
          arrayDeque.push(i);
          arrayDeque.push(i);
          arrayDeque.pop();
        }
        while (arrayDeque.size > 0) {
          arrayDeque.pop();
        }
      })
      .add("superlative-queues unchecked", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.push(i);
          arrayDeque.push(i);
          arrayDeque.popUnchecked();
        }
        while (arrayDeque.size > 0) {
          arrayDeque.popUnchecked();
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
          arrayDeque.push(i);
          arrayDeque.unshift(i);
          arrayDeque.push(i);
          arrayDeque.unshift(i);
          arrayDeque.pop();
          arrayDeque.shift();
        }
      })
      .add("superlative-queues", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.push(i);
          arrayDeque.unshift(i);
          arrayDeque.push(i);
          arrayDeque.unshift(i);
          arrayDeque.popUnchecked();
          arrayDeque.shiftUnchecked();
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
          arrayDeque.push(i);
          arrayDeque.unshift(i);
          arrayDeque.push(i);
          arrayDeque.unshift(i);
          arrayDeque.pop();
          arrayDeque.shift();
        }
        while (arrayDeque.size > 0) {
          arrayDeque.pop();
          arrayDeque.shift();
        }
      })
      .add("superlative-queues unchecked", () => {
        const arrayDeque = new ArrayDeque();
        for (let i = 0; i < iterations; i++) {
          arrayDeque.push(i);
          arrayDeque.unshift(i);
          arrayDeque.push(i);
          arrayDeque.unshift(i);
          arrayDeque.popUnchecked();
          arrayDeque.shiftUnchecked();
        }
        while (arrayDeque.size > 0) {
          arrayDeque.popUnchecked();
          arrayDeque.shiftUnchecked();
        }
      });
  })(),
  pushUnshiftPopShift(1000),
  pushUnshiftPopShift(2000000),
  toArray(1000, true),
  toArray(1000, false),
  toArray(2000000, true),
  toArray(2000000, false),
  positiveIndexing(1000),
  positiveIndexing(2000000),
  negativeIndexing(1000),
  negativeIndexing(2000000),
];

suites.forEach((s) => {
  s.run();
});
