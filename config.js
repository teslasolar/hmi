/**
 * ISA-95 L2 / ISA-101 HMI Configuration
 *
 * ISA-95: Manufacturing Operations Management
 *   - L0: Field Devices (sensors, actuators)
 *   - L1: Real-time Control (PLCs, DCS)
 *   - L2: Supervisory Control (SCADA, HMI) ← THIS LAYER
 *   - L3: Manufacturing Operations Management (MES)
 *   - L4: Business Planning (ERP)
 *
 * ISA-101: Human Machine Interfaces for Process Automation
 *   - Situation awareness
 *   - Alarm management (ISA-18.2)
 *   - Consistent navigation
 *   - High-performance HMI principles
 */

const HMI_CONFIG = {
  // ===== COMMUNICATION SETTINGS =====
  connection: {
    plcUrl: null,                                  // PLC iframe URL (set to null for simulation mode)
    // plcUrl: 'https://teslasolar.github.io/plc/', // Uncomment when PLC is ready
    pollRate: 100,                                 // Data polling rate in milliseconds
    timeout: 2000,                                 // Connection timeout before fallback
    enableSimulation: true,                        // Enable fallback simulation if PLC unavailable
  },

  // ===== ISA-101 DISPLAY SETTINGS =====
  display: {
    title: '⚡ HMI SUPERVISOR',
    isaLevel: 'ISA-95 L2 | SCADA',
    theme: 'dark',                                 // 'dark' or 'light'
    colorScheme: {
      background: '#000',
      primary: '#0f0',                             // Green - normal operation
      warning: '#ff0',                             // Yellow - warning state
      alarm: '#f00',                               // Red - alarm/fault state
      neutral: '#333',
    }
  },

  // ===== GAUGE CONFIGURATION =====
  // Gauges display real-time analog values with visual indicators
  gauges: [
    {
      label: 'Temperature',
      min: 0,
      max: 100,
      units: '°C',
      aiIndex: 0,                                  // Maps to PLC AI[0]
      alarmHigh: 90,                               // High alarm threshold
      warningHigh: 75,                             // High warning threshold
    },
    {
      label: 'Pressure',
      min: 0,
      max: 10,
      units: 'bar',
      aiIndex: 1,                                  // Maps to PLC AI[1]
      alarmHigh: 9,
      warningHigh: 7.5,
    },
    // Add more gauges as needed
  ],

  // ===== TREND CONFIGURATION =====
  // Trends show historical data for process analysis
  trends: [
    {
      label: 'Flow Rate',
      points: 50,                                  // Number of data points to display
      units: 'L/min',
      aiIndex: 2,                                  // Maps to PLC AI[2]
      refreshRate: 100,                            // Update rate in ms
    },
    {
      label: 'Power',
      points: 50,
      units: 'kW',
      aiIndex: 3,                                  // Maps to PLC AI[3]
      refreshRate: 100,
    },
    // Add more trends as needed
  ],

  // ===== CONTROL BUTTONS =====
  // Organized by functional groups (ISA-101: consistent layout)
  controlButtons: [
    {
      group: 'System Control',
      buttons: [
        {
          label: 'START',
          action: 'start',
          addr: 1,                                 // Target PLC address
          tag: 'state',                            // Tag name to write
          value: 'EXECUTE',                        // Value to write
          danger: false,
          alarmSeverity: 'low',
        },
        {
          label: 'STOP',
          action: 'stop',
          addr: 1,
          tag: 'state',
          value: 'STOPPED',
          danger: false,
          alarmSeverity: 'med',
        },
        {
          label: 'E-STOP',
          action: 'estop',
          addr: 1,
          tag: 'state',
          value: 'ABORTED',
          danger: true,                            // Red styling for critical actions
          alarmSeverity: 'high',
        },
      ]
    },
    {
      group: 'Process Control',
      buttons: [
        {
          label: 'RESET',
          action: 'reset',
          addr: 1,
          tag: 'state',
          value: 'IDLE',
          danger: false,
          alarmSeverity: 'low',
        },
        {
          label: 'PAUSE',
          action: 'pause',
          addr: 1,
          tag: 'state',
          value: 'HELD',
          danger: false,
          alarmSeverity: 'med',
        },
      ]
    },
    // Add more control groups as needed
  ],

  // ===== ALARM MANAGEMENT (ISA-18.2) =====
  alarms: {
    maxVisible: 100,                               // Maximum alarms in display buffer
    autoAcknowledge: false,                        // Require manual acknowledgment
    priorities: {
      high: {
        color: '#f00',
        background: '#300',
        sound: true,                               // Enable audio notification
      },
      med: {
        color: '#ff0',
        background: '#330',
        sound: false,
      },
      low: {
        color: '#0f0',
        background: '#030',
        sound: false,
      },
    },
  },

  // ===== SIMULATION SETTINGS =====
  // Used when PLC is unavailable (development/testing)
  simulation: {
    enabled: true,
    plcDefaults: {
      vendor: 'Generic PLC (Simulated)',
      state: 'IDLE',
      addr: 1,
      scanTime: 100,
    },
    // Simulation functions for each AI channel
    aiSimulation: [
      // AI[0] - Temperature: sine wave with noise
      (time) => 20 + Math.sin(time) * 30 + Math.random() * 10,

      // AI[1] - Pressure: slower sine wave
      (time) => 5 + Math.sin(time / 2) * 3 + Math.random() * 2,

      // AI[2] - Flow: cosine wave with more variation
      (time) => 50 + Math.cos(time / 1.5) * 30 + Math.random() * 20,

      // AI[3] - Power: sine wave with offset
      (time) => 75 + Math.sin(time / 3) * 20 + Math.random() * 10,

      // AI[4-7] - Reserved
      (time) => Math.random() * 100,
      (time) => Math.random() * 100,
      (time) => Math.random() * 100,
      (time) => Math.random() * 100,
    ],
  },

  // ===== PERFORMANCE SETTINGS =====
  performance: {
    targetSize: 2 * 1024 * 1024,                   // Target: <2MB (build prompt requirement)
    canvasAntialiasing: true,
    debounceResize: 250,                           // Debounce window resize events
  },

  // ===== FOOTER INFORMATION =====
  footer: {
    version: 'v1.0.0',
    license: 'MIT',
    showPLCInfo: true,                             // Display PLC status in footer
    showScanTime: true,                            // Display scan time
  },
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HMI_CONFIG;
}
