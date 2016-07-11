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

    this._running = true;
  }

  get state() {
    return this.parent !== null ? (this._running ? "running" : "suspended") : "closed";
  }

  start() {
    if (!this._running) {
      this._running = true;
      this.emit("statechange");
    }
    return this;
  }

  stop() {
    if (this._running) {
      this._running = false;
      this.emit("statechange");
    }
    return this;
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
    node.emit("statechange");
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
    node.emit("statechange");
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
    node.emit("statechange");
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
    node.emit("statechange");
  }

  replace(node) {
    node.addAfter(this);
    node.close();
  }

  close() {
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

    this.emit("statechange");
  }

  closeAll() {
    let node = this.head;
    while (node) {
      const next = node.next;
      node.close();
      node = next;
    }
    this.close();
  }

  closeDeep() {
    let node = this.head;
    while (node) {
      const next = node.next;
      node.closeDeep();
      node = next;
    }
    this.close();
  }

  doneAction(action) {
    if (typeof doneAction[action] === "function") {
      doneAction[action](this);
    }
  }

  process(inNumSamples) {
    if (this._running) {
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
