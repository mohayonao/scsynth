"use strict";

const events = require("events");
const doneAction = require("./SCGraphNodeDoneAction");

const STATE_CLOSED = 0;
const STATE_RUNNING = 1;
const STATE_SUSPENDED = 2;
const STATES = [ "closed", "running", "suspended" ];

class SCGraphNode extends events.EventEmitter {
  constructor(context) {
    super();

    this.context = context;
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.head = null;
    this.tail = null;

    this._state = STATE_RUNNING;
  }

  get state() {
    return STATES[this._state];
  }

  append(node) {
    this._checkNode(node);
    node.parent = this;
    node.prev = this.tail;
    node.next = null;
    if (this.tail) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = this.tail = node;
    }
    return this;
  }

  appendTo(node) {
    node.append(this);
    return this;
  }

  prepend(node) {
    this._checkNode(node);
    node.parent = this;
    node.prev = null;
    node.next = this.head;
    if (this.head) {
      this.head.prev = node;
      this.head = node;
    } else {
      this.head = this.tail = node;
    }
    return this;
  }

  prependTo(node) {
    node.prepend(this);
    return this;
  }

  before(node) {
    this._checkNode(node);
    node.parent = this.parent;
    node.prev = this.prev;
    node.next = this;
    if (this.prev) {
      this.prev.next = node;
    } else if (node.parent) {
      node.parent.head = node;
    }
    this.prev = node;
    return this;
  }

  insertBefore(node) {
    node.before(this);
    return this;
  }

  after(node) {
    this._checkNode(node);
    node.parent = this.parent;
    node.prev = this;
    node.next = this.next;
    if (this.next) {
      this.next.prev = node;
    } else if (node.parent) {
      node.parent.tail = node;
    }
    this.next = node;
    return this;
  }

  insertAfter(node) {
    node.after(this);
    return this;
  }

  replace(node) {
    node.after(this).remove();
    return this;
  }

  remove() {
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
    return this;
  }

  suspend() {
    if (this._state === STATE_RUNNING) {
      this._state = STATE_SUSPENDED;
      this.emit("statechange");
    }
    return this;
  }

  resume() {
    if (this._state === STATE_SUSPENDED) {
      this._state = STATE_RUNNING;
      this.emit("statechange");
    }
    return this;
  }

  close() {
    if (this._state !== STATE_CLOSED) {
      this.remove();
      this._state = STATE_CLOSED;
      this.emit("statechange");
    }
    return this;
  }

  closeAll() {
    let node = this.head;
    while (node) {
      const next = node.next;
      node.close();
      node = next;
    }
    this.close();
    return this;
  }

  closeDeep() {
    let node = this.head;
    while (node) {
      const next = node.next;
      node.closeDeep();
      node = next;
    }
    this.close();
    return this;
  }

  doneAction(action) {
    if (typeof doneAction[action] === "function") {
      doneAction[action](this);
    }
  }

  process(inNumSamples) {
    if (this._state === STATE_RUNNING) {
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

  // FIXME: rename!!!
  _checkNode(node) {
    if (node.context !== this.context) {
      throw new TypeError("cannot append to a node belonging to a different context");
    }
    if (node.parent || node.prev || node.next) {
      throw new TypeError("node is already a partially element of another graph");
    }
  }
}

module.exports = SCGraphNode;
