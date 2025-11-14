/**
 * PLCBridge - Hybrid PLC Communication
 * Tries: 1) window.PlcAPI, 2) postMessage, 3) Simulation fallback
 */

import PLCSimulator from './bridge-sim.js';

class PLCBridge {
  constructor(config) {
    this.url = config.plcUrl;
    this.pollRate = config.pollRate || 100;
    this.timeout = config.timeout || 2000;
    this.enableSimulation = config.enableSimulation;
    this.iframe = null;
    this.data = null;
    this.callbacks = [];
    this.connected = false;
    this.simulator = null;
    this.mode = null; // 'api', 'postmessage', or 'simulation'
    this.pollInterval = null;

    if (this.url) {
      this.initIframe();
    } else {
      if (config.enableSimulation) {
        this.startSimulation();
      } else {
        console.error('No PLC URL and simulation disabled');
      }
    }
  }

  initIframe() {
    this.iframe = document.createElement('iframe');
    this.iframe.src = this.url;
    this.iframe.style.display = 'none';
    document.body.appendChild(this.iframe);

    // Listen for postMessage responses
    window.addEventListener('message', e => {
      if (e.origin === new URL(this.url).origin) {
        console.log('✓ Received postMessage from PLC');
        this.data = e.data;
        this.connected = true;
        this.mode = 'postmessage';
        this.notifyCallbacks(this.data);
      }
    });

    // Wait for iframe to load, then try window.PlcAPI first
    this.iframe.onload = () => {
      console.log('PLC iframe loaded, checking connection methods...');
      setTimeout(() => {
        this.tryAPIConnection();
      }, 500);
    };

    // Final fallback timeout
    setTimeout(() => {
      if (!this.connected) {
        console.warn('No PLC response - trying fallback...');
        this.handleConnectionFailure();
      }
    }, this.timeout);
  }

  tryAPIConnection() {
    try {
      if (this.iframe.contentWindow.PlcAPI) {
        console.log('✓ Found window.PlcAPI - using API mode');
        this.mode = 'api';
        this.connected = true;
        this.startAPIPolling();
        return true;
      }
    } catch (e) {
      console.log('Cannot access window.PlcAPI (CORS)');
    }

    // Try postMessage if API not available
    console.log('Trying postMessage mode...');
    this.request(); // Send initial getData request
    return false;
  }

  startAPIPolling() {
    this.pollInterval = setInterval(() => {
      try {
        const api = this.iframe.contentWindow.PlcAPI;
        if (api && api.getAllData) {
          this.data = api.getAllData();
          this.notifyCallbacks(this.data);
        }
      } catch (e) {
        console.error('API polling error:', e);
        this.handleConnectionFailure();
      }
    }, this.pollRate);
  }

  handleConnectionFailure() {
    if (this.connected) return; // Already connected via another method

    console.warn('All PLC connection methods failed');
    if (this.enableSimulation) {
      console.log('Starting simulation fallback...');
      this.startSimulation();
    } else {
      console.error('Simulation disabled - no data source available');
    }
  }

  startSimulation() {
    console.log('Starting simulation mode');
    this.mode = 'simulation';
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
    if (this.mode === 'api') {
      try {
        this.iframe.contentWindow.PlcAPI.setData(addr, tag, value);
      } catch (e) {
        console.error('API write error:', e);
      }
    } else if (this.mode === 'postmessage') {
      this.iframe.contentWindow.postMessage({
        cmd: 'write', addr, tag, val: value
      }, '*');
    } else if (this.simulator) {
      this.simulator.setState(addr, value);
    }
  }

  subscribe(callback) {
    this.callbacks.push(callback);

    // Send immediate update if already connected and have data
    if (this.connected && this.data) {
      console.log('Sending immediate update to new subscriber');
      callback(this.data);
    }

    // Start postMessage polling if in postMessage mode
    if (this.mode === 'postmessage') {
      setInterval(() => this.request(), this.pollRate);
    }
  }

  notifyCallbacks(data) {
    this.callbacks.forEach(cb => cb(data));
  }
}

export default PLCBridge;
