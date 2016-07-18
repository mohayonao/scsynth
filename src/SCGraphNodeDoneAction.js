"use strict";

const doneAction = [];

// do nothing when the UGen is finished
doneAction[0] = null;

// pause the enclosing synth, but do not free it
doneAction[1] = (node) => {
  node.suspend();
};

// free the enclosing synth
doneAction[2] = (node) => {
  node.close();
};

// free both this synth and the preceding node
doneAction[3] = (node) => {
  if (node.prev) {
    node.prev.close();
  }
  node.close();
};

// free both this synth and the following node
doneAction[4] = (node) => {
  if (node.next) {
    node.next.close();
  }
  node.close();
};

// free this synth; if the preceding node is a group then do g_freeAll on it, else free it
doneAction[5] = (node) => {
  if (node.prev) {
    node.prev.closeAll();
  }
  node.close();
};

// free this synth; if the following node is a group then do g_freeAll on it, else free it
doneAction[6] = (node) => {
  if (node.next) {
    node.next.closeAll();
  }
  node.close();
};

// free this synth and all preceding nodes in this group
doneAction[7] = (node) => {
  let prev;
  while (node) {
    prev = node.prev;
    node.close();
    node = prev;
  }
};

// free this synth and all following nodes in this group
doneAction[8] = (node) => {
  let next;
  while (node) {
    next = node.next;
    node.close();
    node = next;
  }
};

// free this synth and pause the preceding node
doneAction[9] = (node) => {
  if (node.prev) {
    node.prev.suspend();
  }
  node.close();
};

// free this synth and pause the following node
doneAction[10] = (node) => {
  if (node.next) {
    node.next.suspend();
  }
  node.close();
};

// free this synth and if the preceding node is a group then do g_deepFree on it, else free it
doneAction[11] = (node) => {
  if (node.prev) {
    node.prev.closeDeep();
  }
  node.close();
};

// free this synth and if the following node is a group then do g_deepFree on it, else free it
doneAction[12] = (node) => {
  if (node.next) {
    node.next.closeDeep();
  }
  node.close();
};

// free this synth and all other nodes in this group (before and after)
doneAction[13] = (node) => {
  if (node.parent) {
    node = node.parent.head;
    while (node) {
      const next = node.next;
      node.close();
      node = next;
    }
  }
};

// free the enclosing group and all nodes within it (including this synth)
doneAction[14] = (node) => {
  if (node.parent) {
    node.parent.closeDeep();
  }
};

module.exports = doneAction;
