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

function createGraph() {
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

  return { node0, node1, node2, node3, node4, mem };
}

test("doneAction(2)", () => {
  const graph = createGraph();

  graph.mem.splice(0);
  graph.node3.doneAction(2);
  graph.node0.process();

  assert.deepEqual(graph.mem, [ 1, 2, 4, 0 ]);

  graph.mem.splice(0);
  graph.node1.doneAction(2);
  graph.node0.process();

  assert.deepEqual(graph.mem, [ 2, 4, 0 ]);

  graph.mem.splice(0);
  graph.node4.doneAction(2);
  graph.node0.process();

  assert.deepEqual(graph.mem, [ 2, 0 ]);

  graph.mem.splice(0);
  graph.node2.doneAction(2);
  graph.node0.process();

  assert.deepEqual(graph.mem, [ 0 ]);
});
