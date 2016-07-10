"use strict";

const assert = require("assert");
const test = require("eater/runner").test;
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
  node1.replace(node1a);
  node2.replace(node2a);
  node3.replace(node3a);

  node0.process();

  assert.deepEqual(mem, [ "2a", "1a", "3a", 0 ]);
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
  node2.run(false);
  node0.process();

  assert.deepEqual(mem, [ 1, 5, 0 ]);

  //
  mem.splice(0);
  node2.run(true);
  node0.process();

  assert.deepEqual(mem, [ 1, 3, 4, 2, 5, 0 ]);
});
