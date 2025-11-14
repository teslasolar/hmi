/**
 * PLC API Bridge - Direct window.PlcAPI Access
 * Alternative to postMessage for same-origin PLC access
 */

class PLCAPIBridge {
  constructor(config) {
    this.url = config.plcUrl;
    this.pollRate = config.pollRate || 100;
    this.iframe = null;
    this.data = null;
    this.callbacks = [];
    this.connected = false;
    this.pollInterval = null;
  }

  init() {
    console.log('Initializing PlcAPI bridge...');
    this.iframe = document.createElement('iframe');
    this.iframe.src = this.url;
    this.iframe.style.display = 'none';
    document.body.appendChild(this.iframe);

    // Wait for iframe to load
    this.iframe.onload = () => {
      console.log('PLC iframe loaded, checking for PlcAPI...');
      setTimeout(() => this.checkAPI(), 500);
    };
  }

  checkAPI() {
    try {
      if (this.iframe.contentWindow.PlcAPI) {
        console.log('✓ Found window.PlcAPI');
        this.connected = true;
        this.startPolling();
      } else {
        console.warn('✗ No window.PlcAPI found');
        this.connected = false;
      }
    } catch (e) {
      console.error('Cannot access iframe (CORS):', e.message);
      this.connected = false;
    }
  }

  startPolling() {
    this.pollInterval = setInterval(() => {
      this.fetchData();
    }, this.pollRate);
  }

  fetchData() {
    try {
      const api = this.iframe.contentWindow.PlcAPI;
      if (api && api.getAllData) {
        this.data = api.getAllData();
        this.notifyCallbacks(this.data);
      }
    } catch (e) {
      console.error('Error fetching PLC data:', e);
    }
  }

  write(addr, tag, value) {
    try {
      const api = this.iframe.contentWindow.PlcAPI;
      if (api && api.setData) {
        api.setData(addr, tag, value);
      }
    } catch (e) {
      console.error('Error writing to PLC:', e);
    }
  }

  subscribe(callback) {
    this.callbacks.push(callback);
  }

  notifyCallbacks(data) {
    this.callbacks.forEach(cb => cb(data));
  }

  disconnect() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }
}

export default PLCAPIBridge;
