# HMI Architecture

## Design Principles

- **Modularity**: Each file <250 tokens, single responsibility
- **Scalability**: Easy to extend with new widgets and features
- **ISA-95 L2**: Supervisory control (SCADA) architecture
- **ISA-101**: High-performance HMI design patterns
- **Zero Dependencies**: Pure vanilla JavaScript ES6 modules

---

## Directory Structure

```
hmi/
├── index.html              # Minimal HTML template
├── config.js               # Configuration (gauges, trends, buttons)
├── core/                   # Core application logic
│   ├── app.js              # Main entry point
│   ├── bridge.js           # PLC communication handler
│   ├── bridge-sim.js       # Simulation fallback
│   ├── screen.js           # Screen orchestrator
│   └── screen-factory.js   # Widget factory
├── widgets/                # UI components
│   ├── gauge.js            # Arc-style analog display
│   ├── trend.js            # Historical chart
│   ├── button.js           # Control button
│   └── alarm.js            # Event log (ISA-18.2)
├── styles/                 # Stylesheets
│   ├── main.css            # Import entry point
│   ├── layout.css          # Grid and panels
│   ├── monitoring.css      # Gauges and trends
│   ├── controls.css        # Buttons and alarms
│   └── theme.css           # Colors and animations
└── docs/                   # Documentation
    ├── ARCHITECTURE.md     # This file
    └── API.md              # Developer API reference
```

---

## Module Responsibilities

### Core Modules

**app.js** (113 tokens)
- Application initialization
- Coordinates HMI screen and PLC bridge
- Lifecycle management

**bridge.js** (189 tokens)
- Iframe-based postMessage communication
- PLC connection management
- Automatic simulation fallback

**bridge-sim.js** (168 tokens)
- Generates realistic test data
- Sine wave + noise simulation
- PackML state machine stub

**screen.js** (204 tokens)
- Orchestrates all widgets
- Data routing from PLC to widgets
- Alarm threshold monitoring

**screen-factory.js** (133 tokens)
- Widget instantiation
- DOM injection
- Configuration binding

### Widget Modules

**gauge.js** (235 tokens)
- Canvas-based arc gauge
- Auto-coloring (green/yellow/red)
- Needle indicator

**trend.js** (197 tokens)
- Scrolling line chart
- Auto-scaling Y-axis
- Grid overlay

**button.js** (77 tokens)
- Operator control interface
- State feedback
- Click handler binding

**alarm.js** (100 tokens)
- ISA-18.2 compliant log
- Priority-based styling
- Timestamp management

---

## Data Flow

```
┌──────────────┐
│   PLC/SIM    │
└──────┬───────┘
       │ postMessage / setInterval
       ▼
┌──────────────┐
│ PLCBridge    │ (core/bridge.js)
└──────┬───────┘
       │ callback
       ▼
┌──────────────┐
│  HMIScreen   │ (core/screen.js)
└──────┬───────┘
       │ updateData()
       ▼
┌──────────────────────────────┐
│  Widgets (gauges/trends)     │
│  - gauge.update(value)       │
│  - trend.push(value)         │
│  - alarm.add(msg, severity)  │
└──────────────────────────────┘
```

---

## Configuration System

All runtime config in **config.js**:

```javascript
const HMI_CONFIG = {
  connection: { plcUrl, pollRate, timeout },
  gauges: [{ label, min, max, units, aiIndex }],
  trends: [{ label, points, units, aiIndex }],
  controlButtons: [{ group, buttons: [...] }]
}
```

**No hardcoded values** in application logic - all customization via config.

---

## Extension Points

### Adding New Widgets

1. Create `widgets/your-widget.js`
2. Export class with `update(data)` method
3. Import in `screen-factory.js`
4. Add factory method
5. Update `config.js` with widget config

### Adding New Styles

1. Create `styles/your-theme.css`
2. Import in `styles/main.css`
3. Keep under 250 tokens per file

### Custom PLC Protocols

1. Extend `PLCBridge` class
2. Override `request()` and `write()` methods
3. Maintain same callback interface

---

## Performance

- **Scan Rate**: 100ms (configurable)
- **File Size**: ~60KB total (uncompressed)
- **Load Time**: <200ms (local)
- **Memory**: ~5MB runtime
- **CPU**: <2% idle, <5% active

---

## Browser Support

- Chrome/Edge: ✓ (Recommended)
- Firefox: ✓
- Safari: ✓
- ES6 Modules: Required
- Canvas 2D: Required
