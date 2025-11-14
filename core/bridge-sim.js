/**
 * Simulation Mode - Fallback PLC Data Generator
 * Provides realistic test data when PLC unavailable
 */

class PLCSimulator {
  constructor(pollRate) {
    this.pollRate = pollRate || 100;
    this.data = this.initData();
  }

  initData() {
    return {
      plcs: [{
        vendor: 'Generic PLC (Simulated)',
        state: 'IDLE',
        addr: 1,
        io: {
          AI: new Array(8).fill(0),
          DI: new Array(16).fill(false),
          DO: new Array(16).fill(false),
          AO: new Array(8).fill(0)
        },
        tags: {},
        scanTime: this.pollRate
      }]
    };
  }

  start(callback) {
    // Send initial data immediately
    this.updateData();
    callback(this.data);

    // Then start polling
    setInterval(() => {
      this.updateData();
      callback(this.data);
    }, this.pollRate);
  }

  updateData() {
    const t = Date.now() / 1000;
    const plc = this.data.plcs[0];

    // Realistic analog simulations
    plc.io.AI[0] = 20 + Math.sin(t) * 30 + Math.random() * 10;        // Temp
    plc.io.AI[1] = 5 + Math.sin(t/2) * 3 + Math.random() * 2;         // Pressure
    plc.io.AI[2] = 50 + Math.cos(t/1.5) * 30 + Math.random() * 20;    // Flow
    plc.io.AI[3] = 75 + Math.sin(t/3) * 20 + Math.random() * 10;      // Power
  }

  setState(addr, value) {
    const plc = this.data.plcs.find(p => p.addr === addr);
    if (plc) plc.state = value;
  }
}

export default PLCSimulator;
