## Developer API Reference

### PLCBridge API

```javascript
import PLCBridge from './core/bridge.js';

const bridge = new PLCBridge({
  plcUrl: 'https://your-plc.com',
  pollRate: 100,
  timeout: 2000,
  enableSimulation: true
});

// Subscribe to data updates
bridge.subscribe(data => {
  console.log(data.plcs[0].io.AI); // [25.5, 7.2, ...]
});

// Write to PLC
bridge.write(addr, tag, value);
```

### Widget API

All widgets implement this interface:

```javascript
class Widget {
  constructor(parent, config) { }
  update(value) { }  // Called on each scan
}
```

#### Gauge Widget

```javascript
import Gauge from './widgets/gauge.js';

const gauge = new Gauge(container, {
  label: 'Temperature',
  min: 0,
  max: 100,
  units: '°C',
  aiIndex: 0
});

gauge.update(42.5);
```

#### Trend Widget

```javascript
import Trend from './widgets/trend.js';

const trend = new Trend(container, {
  label: 'Flow Rate',
  points: 50,
  units: 'L/min',
  aiIndex: 2
});

trend.push(65.3);  // Adds to history
```

#### Button Widget

```javascript
import Button from './widgets/button.js';

const button = new Button(container, {
  label: 'START',
  danger: false
}, (config) => {
  console.log('Clicked:', config.label);
});

button.setState(true);  // Active styling
```

#### Alarm Widget

```javascript
import Alarm from './widgets/alarm.js';

const alarm = new Alarm(container, 100);  // Max 100 alarms

alarm.add('High temperature warning', 'high');
alarm.add('System started', 'low');
alarm.clear();  // Clear all alarms
```

---

### HMIScreen API

```javascript
import HMIScreen from './core/screen.js';

const screen = new HMIScreen(config);

// Called automatically by PLCBridge
screen.updateData(plcData);

// Manual status update
screen.updateConnectionStatus(true);
```

---

### Configuration Schema

```javascript
const HMI_CONFIG = {
  connection: {
    plcUrl: string | null,
    pollRate: number,         // milliseconds
    timeout: number,
    enableSimulation: boolean
  },

  gauges: [{
    label: string,
    min: number,
    max: number,
    units: string,
    aiIndex: number,         // PLC AI channel
    alarmHigh?: number,      // Optional threshold
    warningHigh?: number
  }],

  trends: [{
    label: string,
    points: number,          // Buffer size
    units: string,
    aiIndex: number,
    refreshRate: number
  }],

  controlButtons: [{
    group: string,
    buttons: [{
      label: string,
      action: string,
      addr: number,          // PLC address
      tag: string,           // Tag name
      value: any,            // Value to write
      danger: boolean,
      alarmSeverity: 'high' | 'med' | 'low'
    }]
  }]
}
```

---

### PLC Data Format

Expected data structure from PLC:

```javascript
{
  plcs: [{
    vendor: "Allen-Bradley",
    state: "EXECUTE",        // PackML state
    addr: 1,
    io: {
      AI: [25.5, 7.2, ...],  // 8 analog inputs
      DI: [true, false, ...], // 16 digital inputs
      DO: [false, true, ...], // 16 digital outputs
      AO: [0, 0, ...]         // 8 analog outputs
    },
    tags: {},                // Named tags
    scanTime: 100            // ms
  }]
}
```

---

### Events

Listen for connection state changes:

```javascript
bridge.subscribe(data => {
  if (!data) {
    // Disconnected
  }
});
```

Listen for button clicks:

```javascript
// Override in config
handleButtonClick(config) {
  console.log('Button:', config.label);
  // Custom logic here
}
```
