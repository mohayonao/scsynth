"use strict";

const events = require("events");
const doneAction = require("./SCGraphNodeDoneAction");

class SCGraphNode extends events.EventEmitter {
  constructor() {
    super();

    this.parent = null;
    this.prev = null;
    this.next = null;
    this.head = null;
    this.tail = null;
    this.running = true;
  }

  run(flag) {
    this.running = !!flag;
  }

  addToHead(node) {
    if (node.parent || node.prev || node.next) {
      throw new TypeError("node is already a partially element of another graph");
    }
    node.parent = this;
    node.prev = null;
    node.next = this.head;
    if (this.head) {
      this.head.prev = node;
      this.head = node;
    } else {
      this.head = this.tail = node;
    }
  }

  addToTail(node) {
    if (node.parent || node.prev || node.next) {
      throw new TypeError("node is already a partially element of another graph");
    }
    node.parent = this;
    node.prev = this.tail;
    node.next = null;
    if (this.tail) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = this.tail = node;
    }
  }

  addBefore(node) {
    if (node.parent || node.prev || node.next) {
      throw new TypeError("node is already a partially element of another graph");
    }
    node.parent = this.parent;
    node.prev = this.prev;
    node.next = this;
    if (this.prev) {
      this.prev.next = node;
    } else if (node.parent) {
      node.parent.head = node;
    }
    this.prev = node;
  }

  addAfter(node) {
    if (node.parent || node.prev || node.next) {
      throw new TypeError("node is already a partially element of another graph");
    }
    node.parent = this.parent;
    node.prev = this;
    node.next = this.next;
    if (this.next) {
      this.next.prev = node;
    } else if (node.parent) {
      node.parent.tail = node;
    }
    this.next = node;
  }

  replace(node) {
    node.parent = this.parent;
    node.prev = this.prev;
    node.next = this.next;
    node.head = this.head;
    node.tail = this.tail;
    if (this.prev) {
      this.prev.next = node;
    }
    if (this.next) {
      this.next.prev = node;
    }
    if (node.parent) {
      if (node.parent.head === this) {
        node.parent.head = node;
      }
      if (node.parent.tail === this) {
        node.parent.tail = node;
      }
    }
    this.parent = null;
    this.prev = null;
    this.next = null;
  }

  end() {
    if (this.prev) {
      this.prev.next = this.next;
    }
    if (this.next) {
      this.next.prev = this.prev;
    }
    if (this.parent) {
      if (this.parent.head === this) {
        this.parent.head = this.next;
      }
      if (this.parent.tail === this) {
        this.parent.tail = this.prev;
      }
    }
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.head = null;
    this.tail = null;
    this.running = false;
  }

  endAll() {
    let node = this.head;
    while (node) {
      const next = node.next;
      node.end();
      node = next;
    }
    this.end();
  }

  endDeep() {
    let node = this.head;
    while (node) {
      const next = node.next;
      node.endDeep();
      node = next;
    }
    this.end();
  }

  doneAction(action) {
    if (typeof doneAction[action] === "function") {
      doneAction[action](this);
    }
  }

  process(inNumSamples) {
    if (this.running) {
      if (this.head) {
        this.head.process(inNumSamples);
      }
      if (this.dspProcess) {
        this.dspProcess(inNumSamples);
      }
    }
    if (this.next) {
      this.next.process(inNumSamples);
    }
  }
}

module.exports = SCGraphNode;
