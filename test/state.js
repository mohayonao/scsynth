"use strict";

const assert = require("assert");
const test = require("eatest");
const sinon = require("sinon");
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

test("state", () => {
  //  0
  //  |
  //  1
  const mem = [];
  const node0 = createNode(0, mem);
  const node1 = createNode(1, mem);
  const onstatechange = sinon.spy();

  node0.append(node1);
  node1.on("statechange", onstatechange);

  assert(onstatechange.callCount === 0);
  assert(node1.state === "running");

  node1.suspend();
  node1.suspend();
  assert(onstatechange.callCount === 1);
  assert(node1.state === "suspended");

  node1.resume();
  node1.resume();
  assert(onstatechange.callCount === 2);
  assert(node1.state === "running");

  node1.close();
  node1.close();
  assert(onstatechange.callCount === 3);
  assert(node1.state === "closed");

  node1.suspend();
  node1.suspend();
  assert(onstatechange.callCount === 3);
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

  node0.append(node1);
  node0.append(node2);
  node2.append(node3);
  node2.append(node4);
  node0.append(node5);

  assert(node0.state === "running");
  assert(node1.state === "running");
  assert(node2.state === "running");
  assert(node3.state === "running");
  assert(node4.state === "running");
  assert(node5.state === "running");

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

  node0.append(node1);
  node0.append(node2);
  node2.append(node3);
  node2.append(node4);
  node0.append(node5);

  assert(node0.state === "running");
  assert(node1.state === "running");
  assert(node2.state === "running");
  assert(node3.state === "running");
  assert(node4.state === "running");
  assert(node5.state === "running");

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

  node0.append(node1);
  node0.append(node2);
  node2.append(node3);
  node2.append(node4);
  node0.append(node5);

  assert(node0.state === "running");
  assert(node1.state === "running");
  assert(node2.state === "running");
  assert(node3.state === "running");
  assert(node4.state === "running");
  assert(node5.state === "running");

  node0.closeDeep();

  assert(node0.state === "closed");
  assert(node1.state === "closed");
  assert(node2.state === "closed");
  assert(node3.state === "closed");
  assert(node4.state === "closed");
  assert(node5.state === "closed");
});
