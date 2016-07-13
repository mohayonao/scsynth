"use strict";

const assert = require("assert");
const test = require("eatest");
const sinon = require("sinon");
const SCGraphNode = require("../src/SCGraphNode");

function createNode(index, mem) {
  const node = new SCGraphNode();

  node.index = index;
  node.dspProcess = function() {
    if (node.state === "running") {
      mem.push(index);
    }
  };

  return node;
}

function createGraph() {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 - 6 ---- 11 - 12
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const node2 = createNode(2, mem);
  const node3 = createNode(3, mem);
  const node4 = createNode(4, mem);
  const node5 = createNode(5, mem);
  const node6 = createNode(6, mem);
  const node7 = createNode(7, mem);
  const node8 = createNode(8, mem);
  const node9 = createNode(9, mem);
  const node10 = createNode(10, mem);
  const node11 = createNode(11, mem);
  const node12 = createNode(12, mem);
  const onstatechange = sinon.spy();

  node0.parent = {};
  node0.addToTail(node1);
  node0.addToTail(node6);
  node0.addToTail(node11);
  node0.addToTail(node12);
  node6.addToTail(node4);
  node6.addToTail(node5);
  node4.addToTail(node2);
  node4.addToTail(node3);
  node11.addToTail(node7);
  node11.addToTail(node10);
  node10.addToTail(node8);
  node10.addToTail(node9);

  node0.on("statechange", onstatechange);
  node1.on("statechange", onstatechange);
  node2.on("statechange", onstatechange);
  node3.on("statechange", onstatechange);
  node4.on("statechange", onstatechange);
  node5.on("statechange", onstatechange);
  node6.on("statechange", onstatechange);
  node7.on("statechange", onstatechange);
  node8.on("statechange", onstatechange);
  node9.on("statechange", onstatechange);
  node10.on("statechange", onstatechange);
  node11.on("statechange", onstatechange);
  node12.on("statechange", onstatechange);

  return { node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12, mem, onstatechange };
}

test("doneAction(1)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -(6)---- 11 - 12
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node6.doneAction(1);

  assert(graph.onstatechange.callCount === 1);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "suspended");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "running");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 7, 8, 9, 10, 11, 12, 0 ]);
});

test("doneAction(2)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -[6]---- 11 - 12
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node6.doneAction(2);

  assert(graph.onstatechange.callCount === 1);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "running");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 7, 8, 9, 10, 11, 12, 0 ]);
});

test("doneAction(3)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -[6]----[11]- 12
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node11.doneAction(3);

  assert(graph.onstatechange.callCount === 2);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 12, 0 ]);
});

test("doneAction(4)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -[6]----[11]- 12
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node6.doneAction(4);

  assert(graph.onstatechange.callCount === 2);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 12, 0 ]);
});

test("doneAction(5)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -[6]----[11]- 12
  //    / \     / \
  //  [4]-[5]  7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node11.doneAction(5);

  assert(graph.onstatechange.callCount === 4);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "closed");
  assert(graph.node5.state === "closed");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 12, 0 ]);
});

test("doneAction(6)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -[6]----[11]- 12
  //    / \     / \
  //   4 - 5  [7]-[10]
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node6.doneAction(6);

  assert(graph.onstatechange.callCount === 4);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "closed");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "closed");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 12, 0 ]);
});

test("doneAction(7)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  //[1]-[6]----[11]- 12
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node11.doneAction(7);

  assert(graph.onstatechange.callCount === 3);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "closed");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 12, 0 ]);
});

test("doneAction(8)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -[6]----[11]-[12]
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node6.doneAction(8);

  assert(graph.onstatechange.callCount === 3);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "closed");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 0 ]);
});

test("doneAction(9)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -(6)----[11]- 12
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node11.doneAction(9);

  assert(graph.onstatechange.callCount === 2);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "suspended");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 12, 0 ]);
});

test("doneAction(10)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -[6]----(11)- 12
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3        8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node6.doneAction(10);

  assert(graph.onstatechange.callCount === 2);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "suspended");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 12, 0 ]);
});

test("doneAction(11)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -[6]----[11]- 12
  //    / \     / \
  //  [4]-[5]  7 - 10
  //  / \          / \
  //[2]-[3]       8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node11.doneAction(11);

  assert(graph.onstatechange.callCount === 6);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "closed");
  assert(graph.node3.state === "closed");
  assert(graph.node4.state === "closed");
  assert(graph.node5.state === "closed");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 12, 0 ]);
});

test("doneAction(12)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  // 1 -[6]----[11]- 12
  //    / \     / \
  //   4 - 5  [7]-[10]
  //  / \          / \
  // 2 - 3       [8]-[9]
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node6.doneAction(12);

  assert(graph.onstatechange.callCount === 6);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "running");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "closed");
  assert(graph.node8.state === "closed");
  assert(graph.node9.state === "closed");
  assert(graph.node10.state === "closed");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "running");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 12, 0 ]);
});

test("doneAction(13)", () => {
  //         0
  //       /   \
  //     /       \
  //   /           \
  //[1]-[6]----[11]-[12]
  //    / \     / \
  //   4 - 5   7 - 10
  //  / \          / \
  // 2 - 3       8 - 9
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node6.doneAction(13);

  assert(graph.onstatechange.callCount === 4);
  assert(graph.node0.state === "running");
  assert(graph.node1.state === "closed");
  assert(graph.node2.state === "running");
  assert(graph.node3.state === "running");
  assert(graph.node4.state === "running");
  assert(graph.node5.state === "running");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "running");
  assert(graph.node8.state === "running");
  assert(graph.node9.state === "running");
  assert(graph.node10.state === "running");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "closed");

  graph.node0.process();

  assert.deepEqual(graph.mem, [ 0 ]);
});

test("doneAction(14)", () => {
  //        [0]
  //       /   \
  //     /       \
  //   /           \
  //[1]-[6]----[11]-[12]
  //    / \     / \
  //  [4]-[5] [7]-[10]
  //  / \          / \
  //[2]-[3]      [8]-[9]
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node11.doneAction(14);

  assert(graph.onstatechange.callCount === 13);
  assert(graph.node0.state === "closed");
  assert(graph.node1.state === "closed");
  assert(graph.node2.state === "closed");
  assert(graph.node3.state === "closed");
  assert(graph.node4.state === "closed");
  assert(graph.node5.state === "closed");
  assert(graph.node6.state === "closed");
  assert(graph.node7.state === "closed");
  assert(graph.node8.state === "closed");
  assert(graph.node9.state === "closed");
  assert(graph.node10.state === "closed");
  assert(graph.node11.state === "closed");
  assert(graph.node12.state === "closed");

  graph.node0.process();

  assert.deepEqual(graph.mem, []);
});
