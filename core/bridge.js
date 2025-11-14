/**
 * PLCBridge - Cross-origin PLC Communication
 * Manages iframe postMessage with automatic fallback
 */

import PLCSimulator from './bridge-sim.js';

class PLCBridge {
  constructor(config) {
    this.url = config.plcUrl;
    this.pollRate = config.pollRate || 100;
    this.timeout = config.timeout || 2000;
    this.iframe = null;
    this.data = null;
    this.callbacks = [];
    this.connected = false;
    this.simulator = null;

    if (this.url) {
      this.initIframe();
    } else if (config.enableSimulation) {
      this.startSimulation();
    }
  }

  initIframe() {
    this.iframe = document.createElement('iframe');
    this.iframe.src = this.url;
    this.iframe.style.display = 'none';
    document.body.appendChild(this.iframe);

    window.addEventListener('message', e => {
      if (e.origin === new URL(this.url).origin) {
        this.data = e.data;
        this.connected = true;
        this.notifyCallbacks(this.data);
      }
    });

    // Fallback timeout
    setTimeout(() => {
      if (!this.connected) {
        console.warn('PLC timeout - switching to simulation');
        this.startSimulation();
      }
    }, this.timeout);
  }

  startSimulation() {
    this.connected = true;
    this.simulator = new PLCSimulator(this.pollRate);
    this.simulator.start(data => this.notifyCallbacks(data));
  }

  request() {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage({ cmd: 'getData' }, '*');
    }
  }

  write(addr, tag, value) {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage({
        cmd: 'write', addr, tag, val: value
      }, '*');
    } else if (this.simulator) {
      this.simulator.setState(addr, value);
    }
  }

  subscribe(callback) {
    this.callbacks.push(callback);
    if (this.iframe && !this.simulator) {
      setInterval(() => this.request(), this.pollRate);
    }
  }

  notifyCallbacks(data) {
    this.callbacks.forEach(cb => cb(data));
  }
}

export default PLCBridge;
