# HMI Testing Guide

## Quick Test

1. **Start Local Server**:
   ```bash
   cd /home/user/hmi
   python3 -m http.server 8000
   ```

2. **Open in Browser**:
   - Main HMI: http://localhost:8000
   - Debug Mode: http://localhost:8000/debug.html

3. **Expected Behavior**:
   - Connection status: 🟢 Green (simulated)
   - Gauges: Showing animated temperature & pressure
   - Trends: Live scrolling charts
   - Controls: Functional buttons (check alarm log)
   - Alarms: "HMI System initialized" message

## Switching to Real PLC

Edit `config.js`:

```javascript
connection: {
  plcUrl: 'https://teslasolar.github.io/plc/',  // Enable this
  // plcUrl: null,                               // Disable this
  pollRate: 100,
  timeout: 2000,
  enableSimulation: true,  // Keep as fallback
},
```

## Troubleshooting

### No Data Showing
- Check browser console (F12)
- Verify `config.js` loaded (check for HMI_CONFIG)
- Check network tab for module loads

### Simulation Not Starting
- Ensure `plcUrl: null` in config
- Ensure `enableSimulation: true`
- Check console for "Starting simulation mode" message

### Module Import Errors
- Ensure files served via HTTP (not file://)
- Check all .js files have proper export statements
- Verify browser supports ES6 modules

### CSS Not Loading
- Check browser console for CSS errors
- Verify @import paths in styles/*.css
- Check CORS if serving from different origin
