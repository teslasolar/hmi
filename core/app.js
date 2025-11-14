/**
 * Main Application Entry Point
 * Initializes HMI and establishes PLC connection
 */

import PLCBridge from './bridge.js';
import HMIScreen from './screen.js';

class HMIApp {
  constructor(config) {
    this.config = config;
    this.hmi = null;
    this.bridge = null;
  }

  async init() {
    console.log('🚀 ISA-95 L2 HMI Initializing...');

    // Create HMI Screen
    this.hmi = new HMIScreen(this.config);
    this.hmi.widgets.alarms.add('HMI System initialized', 'low');

    // Create PLC Bridge
    this.bridge = new PLCBridge(this.config.connection);
    window.plcBridge = this.bridge;

    // Subscribe to PLC data
    this.bridge.subscribe(data => {
      this.hmi.updateData(data);
      this.hmi.updateConnectionStatus(this.bridge.connected);
    });

    console.log('✅ HMI Ready');
    console.log(`📡 PLC: ${this.config.connection.plcUrl || 'SIMULATION'}`);
    console.log(`⚡ Rate: ${this.config.connection.pollRate}ms`);
  }
}

// Auto-initialize on DOM ready
window.addEventListener('DOMContentLoaded', async () => {
  const app = new HMIApp(window.HMI_CONFIG);
  await app.init();
});

export default HMIApp;
