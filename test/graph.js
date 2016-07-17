"use strict";

const assert = require("assert");
const test = require("eatest");
const SCGraphNode = require("../src/SCGraphNode");

const context = {};

function createNode(index, mem) {
  const node = new SCGraphNode(context);

  node.index = index;
  node.dspProcess = function() {
    mem.push(index);
  };

  return node;
}

test("append", () => {
  //       0
  //     /   \
  //   /       \
  // 1 - 2 - 3 - 4
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node0.append(node1);
  node0.append(node2);
  node0.append(node3);
  node0.append(node4);

  assert.throws(() => {
    node0.append(node1);
  }, TypeError);

  node0.process();

  assert.deepEqual(mem, [ 1, 2, 3, 4, 0 ]);
});

test("appendTo", () => {
  //       0
  //     /   \
  //   /       \
  // 1 - 2 - 3 - 4
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node1.appendTo(node0);
  node2.appendTo(node0);
  node3.appendTo(node0);
  node4.appendTo(node0);

  assert.throws(() => {
    node1.appendTo(node0);
  }, TypeError);

  node0.process();

  assert.deepEqual(mem, [ 1, 2, 3, 4, 0 ]);
});

test("prepend", () => {
  //       0
  //     /   \
  //   /       \
  // 4 - 3 - 2 - 1
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node0.prepend(node1);
  node0.prepend(node2);
  node0.prepend(node3);
  node0.prepend(node4);

  assert.throws(() => {
    node0.prepend(node1);
  }, TypeError);

  node0.process();

  assert.deepEqual(mem, [ 4, 3, 2, 1, 0 ]);
});

test("prependTo", () => {
  //       0
  //     /   \
  //   /       \
  // 4 - 3 - 2 - 1
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node1.prependTo(node0);
  node2.prependTo(node0);
  node3.prependTo(node0);
  node4.prependTo(node0);

  assert.throws(() => {
    node1.prependTo(node0);
  }, TypeError);

  node0.process();

  assert.deepEqual(mem, [ 4, 3, 2, 1, 0 ]);
});

test("before", () => {
  // 1 - 2 - 3 - 4 - 0
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node0.before(node1);
  node0.before(node2);
  node0.before(node3);
  node0.before(node4);

  assert.throws(() => {
    node0.before(node1);
  }, TypeError);

  node1.process();

  assert.deepEqual(mem, [ 1, 2, 3, 4, 0 ]);
});

test("insertBefore", () => {
  // 1 - 2 - 3 - 4 - 0
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node1.insertBefore(node0);
  node2.insertBefore(node0);
  node3.insertBefore(node0);
  node4.insertBefore(node0);

  assert.throws(() => {
    node1.insertBefore(node0);
  }, TypeError);

  node1.process();

  assert.deepEqual(mem, [ 1, 2, 3, 4, 0 ]);
});

test("after", () => {
  // 0 - 4 - 3 - 2 - 1
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node0.after(node1);
  node0.after(node2);
  node0.after(node3);
  node0.after(node4);

  assert.throws(() => {
    node0.after(node1);
  }, TypeError);

  node0.process();

  assert.deepEqual(mem, [ 0, 4, 3, 2, 1 ]);
});

test("insertAfter", () => {
  // 0 - 4 - 3 - 2 - 1
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node1.insertAfter(node0);
  node2.insertAfter(node0);
  node3.insertAfter(node0);
  node4.insertAfter(node0);

  assert.throws(() => {
    node1.insertAfter(node0);
  }, TypeError);

  node0.process();

  assert.deepEqual(mem, [ 0, 4, 3, 2, 1 ]);
});

test("replace", () => {
  //     0
  //   /   \
  // 1 - 2 - 3
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node1a = createNode("1a", mem);
  const node2a = createNode("2a", mem);
  const node3a = createNode("3a", mem);

  node0.append(node1);
  node0.append(node2);
  node0.append(node3);
  node1a.replace(node1);
  node2a.replace(node2);
  node3a.replace(node3);

  node0.process();

  assert.deepEqual(mem, [ "1a", "2a", "3a", 0 ]);
});

// test.only("state", () => {
//   //  0
//   //  |
//   //  1
//   const mem = [];
//   const node0 = createNode(0, mem);
//   const node1 = createNode(1, mem);
//   const onstatechange = sinon.spy();
//
//   node1.on("statechange", onstatechange);
//
//   assert(node1.state === "closed");
//
//   node0.append(node1);
//
//   assert(onstatechange.callCount === 1);
//   assert(node1.state === "running");
//
//   node1.stop();
//   node1.stop();
//   assert(onstatechange.callCount === 2);
//   assert(node1.state === "suspended");
//
//   node1.start();
//   node1.start();
//   assert(onstatechange.callCount === 3);
//   assert(node1.state === "running");
//
//   node1.close();
//   assert(onstatechange.callCount === 4);
//   assert(node1.state === "closed");
// });
//
// test("close", () => {
//   //     0
//   //   /   \
//   // 1 - 2 - 5
//   //    / \
//   //   3 - 4
//   const mem = [];
//   const node0 = createNode(0, mem);
//   const node1 = createNode(1, mem);
//   const node2 = createNode(2, mem);
//   const node3 = createNode(3, mem);
//   const node4 = createNode(4, mem);
//   const node5 = createNode(5, mem);
//
//   node0.parent = {};
//   node0.prepend(node1);
//   node1.after(node2);
//   node2.prepend(node3);
//   node2.append(node4);
//   node2.after(node5);
//
//   assert(node0.state === "running");
//   node0.close();
//
//   assert(node0.state === "closed");
//   assert(node1.state === "running");
//   assert(node2.state === "running");
//   assert(node3.state === "running");
//   assert(node4.state === "running");
//   assert(node5.state === "running");
// });
//
// test("closeAll", () => {
//   //     0
//   //   /   \
//   // 1 - 2 - 5
//   //    / \
//   //   3 - 4
//   const mem = [];
//   const node0 = createNode(0, mem);
//   const node1 = createNode(1, mem);
//   const node2 = createNode(2, mem);
//   const node3 = createNode(3, mem);
//   const node4 = createNode(4, mem);
//   const node5 = createNode(5, mem);
//
//   node0.parent = {};
//   node0.prepend(node1);
//   node1.after(node2);
//   node2.prepend(node3);
//   node2.append(node4);
//   node2.after(node5);
//
//   assert(node0.state === "running");
//   node0.closeAll();
//
//   assert(node0.state === "closed");
//   assert(node1.state === "closed");
//   assert(node2.state === "closed");
//   assert(node3.state === "running");
//   assert(node4.state === "running");
//   assert(node5.state === "closed");
// });
//
// test("closeDeep", () => {
//   //     0
//   //   /   \
//   // 1 - 2 - 5
//   //    / \
//   //   3 - 4
//   const mem = [];
//   const node0 = createNode(0, mem);
//   const node1 = createNode(1, mem);
//   const node2 = createNode(2, mem);
//   const node3 = createNode(3, mem);
//   const node4 = createNode(4, mem);
//   const node5 = createNode(5, mem);
//
//   node0.parent = {};
//   node0.prepend(node1);
//   node1.after(node2);
//   node2.prepend(node3);
//   node2.append(node4);
//   node2.after(node5);
//
//   assert(node0.state === "running");
//   node0.closeDeep();
//
//   assert(node0.state === "closed");
//   assert(node1.state === "closed");
//   assert(node2.state === "closed");
//   assert(node3.state === "closed");
//   assert(node4.state === "closed");
//   assert(node5.state === "closed");
// });
//
// test("run", () => {
//   //     0
//   //   /   \
//   // 1 - 2 - 5
//   //    / \
//   //   3 - 4
//   const mem = [];
//   const node0 = createNode(0, mem);
//   const node1 = createNode(1, mem);
//   const node2 = createNode(2, mem);
//   const node3 = createNode(3, mem);
//   const node4 = createNode(4, mem);
//   const node5 = createNode(5, mem);
//
//   node0.prepend(node1);
//   node1.after(node2);
//   node2.prepend(node3);
//   node2.append(node4);
//   node2.after(node5);
//
//   //
//   mem.splice(0);
//   node2.stop();
//   node0.process();
//
//   assert.deepEqual(mem, [ 1, 5, 0 ]);
//
//   //
//   mem.splice(0);
//   node2.start();
//   node0.process();
//
//   assert.deepEqual(mem, [ 1, 3, 4, 2, 5, 0 ]);
// });
