# 📊 ISA-95 L2 / ISA-101 HMI

High-performance Human-Machine Interface for industrial automation following ISA-95 and ISA-101 standards.

## 🎯 Features

- **ISA-95 L2 Compliant**: Supervisory control layer (SCADA)
- **ISA-101 Design**: High-performance HMI principles
- **Real-time Monitoring**: 100ms refresh rate
- **Cross-origin Ready**: postMessage-based PLC communication
- **Responsive Layout**: Grid-based panel system
- **Alarm Management**: ISA-18.2 compliant alarm handling
- **Trend Analytics**: Historical data visualization
- **Simulation Mode**: Built-in fallback for development
- **Lightweight**: <2MB total size
- **Zero Dependencies**: Pure vanilla JavaScript

---

## 🏗️ Architecture

### ISA-95 Automation Hierarchy

```
┌─────────────────────────────────────┐
│  L4: Business Planning (ERP)        │
├─────────────────────────────────────┤
│  L3: Manufacturing Operations (MES)  │
├─────────────────────────────────────┤
│  L2: Supervisory Control (SCADA)    │  ← THIS HMI
│      • Real-time monitoring          │
│      • Process visualization         │
│      • Alarm management              │
│      • Operator control              │
├─────────────────────────────────────┤
│  L1: Real-time Control (PLC/DCS)    │
├─────────────────────────────────────┤
│  L0: Field Devices (Sensors/Valves) │
└─────────────────────────────────────┘
```

### ISA-101 HMI Principles

1. **Situation Awareness**: Clear process state visualization
2. **Alarm Management**: Prioritized, color-coded alarms (ISA-18.2)
3. **Consistent Layout**: Grid-based panel organization
4. **High Performance**: <100ms response time
5. **Human-Centered**: Intuitive controls and feedback

---

## 📁 File Structure

```
hmi/
├── index.html          # Main HMI application (single-file)
├── config.js           # Configuration file
├── README.md           # This file
└── .git/               # Git repository
```

---

## 🚀 Quick Start

### 1. Open HMI

Simply open `index.html` in a modern web browser:

```bash
# Option 1: Direct file open
open index.html

# Option 2: Local server (recommended for CORS)
python3 -m http.server 8000
# Then navigate to: http://localhost:8000

# Option 3: Using Node.js
npx serve .
```

### 2. Simulation Mode

By default, the HMI runs in **simulation mode** with generated data. You'll see:

- ✅ Green connection status indicator
- 📊 Gauges displaying simulated temperature & pressure
- 📈 Trend charts showing flow & power
- 🎮 Functional control buttons
- 🚨 Alarm logging

### 3. Connect to Real PLC

Edit `config.js` to point to your PLC URL:

```javascript
connection: {
  plcUrl: 'https://your-plc-domain.com/plc/',
  enableSimulation: false,  // Disable fallback
}
```

The HMI will automatically switch from simulation to real data when the PLC responds.

---

## 🔧 Configuration

All settings are in `config.js`. Here's what you can customize:

### Connection Settings

```javascript
connection: {
  plcUrl: 'https://teslasolar.github.io/plc/',
  pollRate: 100,              // Poll interval (ms)
  timeout: 2000,              // Connection timeout
  enableSimulation: true,     // Fallback mode
}
```

### Add Gauges

```javascript
gauges: [
  {
    label: 'Your Sensor',
    min: 0,
    max: 100,
    units: 'units',
    aiIndex: 0,               // Maps to PLC AI[0]
    alarmHigh: 90,
    warningHigh: 75,
  }
]
```

### Add Trends

```javascript
trends: [
  {
    label: 'Your Trend',
    points: 50,               // History buffer size
    units: 'L/min',
    aiIndex: 2,               // Maps to PLC AI[2]
  }
]
```

### Add Control Buttons

```javascript
controlButtons: [
  {
    group: 'My Controls',
    buttons: [
      {
        label: 'ACTION',
        addr: 1,              // Target PLC address
        tag: 'state',         // Tag to write
        value: 'EXECUTE',     // Value to send
        danger: false,        // Red styling if true
      }
    ]
  }
]
```

---

## 🎨 Widget Components

### 📊 Gauge Widget

Displays analog values with visual arc indicator:

- **Auto-scaling**: Colors change based on thresholds
  - 🟢 Green: 0-75%
  - 🟡 Yellow: 75-90%
  - 🔴 Red: 90-100%
- **Needle indicator**: Real-time value
- **Digital readout**: Numeric display with units

### 📈 Trend Widget

Historical data chart:

- **Auto-scaling Y-axis**: Adapts to data range
- **Fixed X-axis**: Configurable buffer size
- **Grid overlay**: Visual reference lines
- **Real-time update**: Smooth scrolling display

### 🎮 Button Widget

Control interface:

- **State feedback**: Active/inactive visual states
- **Danger mode**: Red styling for critical actions
- **Click handlers**: Sends commands to PLC via postMessage
- **Alarm logging**: Auto-logs all actions

### 🚨 Alarm Widget

Event log (ISA-18.2 compliant):

- **Priority levels**: High (red), Medium (yellow), Low (green)
- **Timestamps**: Each alarm timestamped
- **Auto-scroll**: Most recent at top
- **Buffer limit**: Configurable max entries (default: 100)

---

## 🔌 PLC Communication Protocol

### Data Flow

```
┌─────────────┐                    ┌─────────────┐
│     HMI     │                    │     PLC     │
│  (L2 SCADA) │                    │  (L1 CTRL)  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │  postMessage('getData')          │
       ├─────────────────────────────────>│
       │                                  │
       │  {plcs:[{io:{AI,DI,DO},state}]}  │
       │<─────────────────────────────────┤
       │                                  │
       │  postMessage('write', addr, val) │
       ├─────────────────────────────────>│
       │                                  │
```

### Expected PLC Data Structure

```javascript
{
  plcs: [
    {
      vendor: "Allen-Bradley",        // PLC vendor name
      state: "EXECUTE",               // PackML state
      addr: 1,                        // PLC address
      io: {
        AI: [25.5, 7.2, 65.3, 82.1,  // Analog inputs [8]
             0, 0, 0, 0],
        DI: [true, false, ...],       // Digital inputs [16]
        DO: [false, true, ...],       // Digital outputs [16]
        AO: [0, 0, 0, 0, 0, 0, 0, 0]  // Analog outputs [8]
      },
      tags: {},                       // Named tags (optional)
      scanTime: 100                   // Scan cycle time (ms)
    }
  ]
}
```

### PLC Requirements

Your PLC simulator/controller must implement:

#### 1. getData Handler

```javascript
window.addEventListener('message', e => {
  if (e.data.cmd === 'getData') {
    e.source.postMessage({
      plcs: [/* your PLC data */]
    }, e.origin);
  }
});
```

#### 2. write Handler

```javascript
window.addEventListener('message', e => {
  if (e.data.cmd === 'write') {
    let plc = plcs.find(p => p.addr === e.data.addr);
    if (plc) {
      plc.tags[e.data.tag] = e.data.val;
      // Or: plc.setState(e.data.val);
    }
  }
});
```

---

## 🔬 Development

### Simulation Mode

Edit `config.js` simulation functions to customize test data:

```javascript
aiSimulation: [
  // AI[0] - Custom formula
  (time) => 50 + Math.sin(time * 2) * 25,

  // AI[1] - Random walk
  (time) => Math.random() * 100,

  // Add your own...
]
```

### Testing Without PLC

Set `plcUrl: null` in config.js to force simulation mode.

### Performance Monitoring

Open browser console to see:

```
🚀 ISA-95 L2 HMI Initializing...
✅ HMI Ready
📡 PLC URL: SIMULATION MODE
⚡ Poll Rate: 100ms
```

---

## 📊 Technical Specifications

| Specification | Value |
|--------------|-------|
| **Standards** | ISA-95 (L2), ISA-101, ISA-18.2 |
| **Refresh Rate** | 100ms (10 Hz) |
| **File Size** | <2MB (uncompressed) |
| **Browser Support** | Chrome, Firefox, Safari, Edge (ES6+) |
| **Dependencies** | None (vanilla JS) |
| **I/O Capacity** | 8 AI, 16 DI, 8 AO, 16 DO |
| **Alarm Buffer** | 100 events |
| **Trend Buffer** | 50 points per channel |

---

## 🎛️ Use Cases

### Manufacturing

- Production line monitoring
- Quality control dashboards
- OEE (Overall Equipment Effectiveness) display

### Process Control

- Chemical reactor monitoring
- Utility systems (HVAC, water, power)
- Environmental monitoring

### Energy Management

- Solar/battery systems
- Power distribution
- Load balancing

---

## 🔒 Security Considerations

### Cross-Origin Communication

- Uses `postMessage` with origin validation
- Configure allowed origins in production
- HTTPS recommended for remote PLCs

### Access Control

- No built-in authentication (add at proxy/gateway level)
- Consider adding user roles for critical controls
- Log all operator actions to external system

---

## 🚧 Roadmap

**PLC Integration** (requires `teslasolar/plc` updates):

- [ ] postMessage handler implementation
- [ ] AI value simulation
- [ ] Write command support
- [ ] PackML state machine

**HMI Enhancements**:

- [ ] User authentication
- [ ] Historical data logging
- [ ] Alarm acknowledgment
- [ ] Recipe management
- [ ] Multi-language support
- [ ] Mobile responsive design
- [ ] Export trend data (CSV)

---

## 📚 Standards Reference

### ISA-95

Enterprise-Control System Integration
- Part 1: Models and Terminology
- Part 2: Object Model Attributes
- Part 3: Activity Models

### ISA-101

Human Machine Interfaces for Process Automation
- Situation awareness
- Alarm management
- Navigation and workflow
- High-performance principles

### ISA-18.2

Management of Alarm Systems for the Process Industries
- Alarm philosophy
- Rationalization
- Priority levels
- Performance metrics

---

## 🤝 Contributing

This is a generic template. Customize for your application:

1. Edit `config.js` for your process
2. Modify widget layouts in `index.html`
3. Add custom CSS for branding
4. Extend widget classes for new visualizations

---

## 📄 License

MIT License - Free for commercial and personal use

---

## 📞 Support

For issues related to:

- **HMI functionality**: Check browser console logs
- **PLC connection**: Verify `plcUrl` and CORS settings
- **Data mapping**: Review AI index configurations
- **Performance**: Reduce `pollRate` or trend buffer size

---

## 🏭 Example Deployment

### Local Network (Intranet)

```bash
# On HMI server (Raspberry Pi, Edge PC, etc.)
cd /home/user/hmi
python3 -m http.server 80

# Access from any device on network:
# http://192.168.1.100
```

### Cloud Deployment (GitHub Pages)

```bash
git add .
git commit -m "Deploy HMI"
git push origin main

# Enable GitHub Pages in repo settings
# Access at: https://yourusername.github.io/hmi/
```

### Docker Container

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build -t isa95-hmi .
docker run -d -p 8080:80 isa95-hmi
```

---

**Built with ⚡ for industrial automation | ISA-95 L2 | ISA-101 Compliant**
