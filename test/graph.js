"use strict";

const assert = require("assert");
const test = require("eatest");
const sinon = require("sinon");
const SCGraphNode = require("../src/SCGraphNode");

function createNode(index, mem) {
  const node = new SCGraphNode();

  node.index = index;
  node.dspProcess = function() {
    mem.push(index);
  };

  return node;
}

test("addToHead", () => {
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

  node0.addToHead(node1);
  node0.addToHead(node2);
  node0.addToHead(node3);
  node0.addToHead(node4);

  assert.throws(() => {
    node0.addToHead(node1);
  }, TypeError);

  node0.process();

  assert.deepEqual(mem, [ 4, 3, 2, 1, 0 ]);
});

test("addToTail", () => {
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

  node0.addToTail(node1);
  node0.addToTail(node2);
  node0.addToTail(node3);
  node0.addToTail(node4);

  assert.throws(() => {
    node0.addToTail(node1);
  }, TypeError);

  node0.process();

  assert.deepEqual(mem, [ 1, 2, 3, 4, 0 ]);
});

test("addBefore", () => {
  // 1 - 2 - 3 - 4 - 0
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node0.addBefore(node1);
  node0.addBefore(node2);
  node0.addBefore(node3);
  node0.addBefore(node4);

  assert.throws(() => {
    node0.addBefore(node1);
  }, TypeError);

  node1.process();

  assert.deepEqual(mem, [ 1, 2, 3, 4, 0 ]);
});

test("addAfter", () => {
  // 0 - 4 - 3 - 2 - 1
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);

  node0.addAfter(node1);
  node0.addAfter(node2);
  node0.addAfter(node3);
  node0.addAfter(node4);

  assert.throws(() => {
    node0.addAfter(node1);
  }, TypeError);

  node0.process();

  assert.deepEqual(mem, [ 0, 4, 3, 2, 1 ]);
});

test("replace", () => {
  //     0
  //   /   \
  // 2 - 1 - 3
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node1a = createNode("1a", mem);
  const node2a = createNode("2a", mem);
  const node3a = createNode("3a", mem);

  node0.addToHead(node1);
  node1.addBefore(node2);
  node1.addAfter(node3);
  node1a.replace(node1);
  node2a.replace(node2);
  node3a.replace(node3);

  node0.process();

  assert.deepEqual(mem, [ "2a", "1a", "3a", 0 ]);
});

test("state", () => {
  //  0
  //  |
  //  1
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const onstatechange = sinon.spy();

  node1.on("statechange", onstatechange);

  assert(node1.state === "closed");

  node0.addToTail(node1);

  assert(onstatechange.callCount === 1);
  assert(node1.state === "running");

  node1.stop();
  node1.stop();
  assert(onstatechange.callCount === 2);
  assert(node1.state === "suspended");

  node1.start();
  node1.start();
  assert(onstatechange.callCount === 3);
  assert(node1.state === "running");

  node1.close();
  assert(onstatechange.callCount === 4);
  assert(node1.state === "closed");
});

test("close", () => {
  //     0
  //   /   \
  // 1 - 2 - 5
  //    / \
  //   3 - 4
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);
  const node5 = createNode(5, mem);

  node0.parent = {};
  node0.addToHead(node1);
  node1.addAfter(node2);
  node2.addToHead(node3);
  node2.addToTail(node4);
  node2.addAfter(node5);

  assert(node0.state === "running");
  node0.close();

  assert(node0.state === "closed");
  assert(node1.state === "running");
  assert(node2.state === "running");
  assert(node3.state === "running");
  assert(node4.state === "running");
  assert(node5.state === "running");
});

test("closeAll", () => {
  //     0
  //   /   \
  // 1 - 2 - 5
  //    / \
  //   3 - 4
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);
  const node5 = createNode(5, mem);

  node0.parent = {};
  node0.addToHead(node1);
  node1.addAfter(node2);
  node2.addToHead(node3);
  node2.addToTail(node4);
  node2.addAfter(node5);

  assert(node0.state === "running");
  node0.closeAll();

  assert(node0.state === "closed");
  assert(node1.state === "closed");
  assert(node2.state === "closed");
  assert(node3.state === "running");
  assert(node4.state === "running");
  assert(node5.state === "closed");
});

test("closeDeep", () => {
  //     0
  //   /   \
  // 1 - 2 - 5
  //    / \
  //   3 - 4
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);
  const node5 = createNode(5, mem);

  node0.parent = {};
  node0.addToHead(node1);
  node1.addAfter(node2);
  node2.addToHead(node3);
  node2.addToTail(node4);
  node2.addAfter(node5);

  assert(node0.state === "running");
  node0.closeDeep();

  assert(node0.state === "closed");
  assert(node1.state === "closed");
  assert(node2.state === "closed");
  assert(node3.state === "closed");
  assert(node4.state === "closed");
  assert(node5.state === "closed");
});

test("run", () => {
  //     0
  //   /   \
  // 1 - 2 - 5
  //    / \
  //   3 - 4
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);
  const node5 = createNode(5, mem);

  node0.addToHead(node1);
  node1.addAfter(node2);
  node2.addToHead(node3);
  node2.addToTail(node4);
  node2.addAfter(node5);

  //
  mem.splice(0);
  node2.stop();
  node0.process();

  assert.deepEqual(mem, [ 1, 5, 0 ]);

  //
  mem.splice(0);
  node2.start();
  node0.process();

  assert.deepEqual(mem, [ 1, 3, 4, 2, 5, 0 ]);
});
