/**
 * HMIScreen - Main Screen Orchestrator
 * Manages widgets and coordinates data updates
 */

import WidgetFactory from './screen-factory.js';

class HMIScreen {
  constructor(config) {
    this.config = config;
    this.widgets = { gauges: [], trends: [], buttons: [], alarms: null };
    this.createWidgets();
    this.startClock();
  }

  createWidgets() {
    this.widgets.gauges = WidgetFactory.createGauges(
      document.getElementById('gauges'),
      this.config.gauges
    );

    this.widgets.trends = WidgetFactory.createTrends(
      document.getElementById('trends'),
      this.config.trends
    );

    this.widgets.buttons = WidgetFactory.createButtons(
      document.getElementById('controls'),
      this.config.controlButtons,
      cfg => this.handleButtonClick(cfg)
    );

    this.widgets.alarms = WidgetFactory.createAlarm(
      document.getElementById('alarms'),
      this.config.alarms?.maxVisible || 100
    );
  }

  handleButtonClick(config) {
    console.log(`Button: ${config.label}`);
    if (window.plcBridge) {
      window.plcBridge.write(config.addr, config.tag, config.value);
    }
    this.widgets.alarms.add(
      `${config.label} command sent`,
      config.alarmSeverity || (config.danger ? 'high' : 'low')
    );
  }

  updateData(data) {
    if (!data?.plcs?.length) return;

    const plc = data.plcs[0];

    // Gauges
    this.widgets.gauges.forEach(({ widget, config }) => {
      const val = plc.io.AI[config.aiIndex] || 0;
      widget.update(val);
      if (config.alarmHigh && val > config.alarmHigh) {
        this.widgets.alarms.add(
          `${config.label} high: ${val.toFixed(1)} ${config.units}`,
          'high'
        );
      }
    });

    // Trends
    this.widgets.trends.forEach(({ widget, config }) => {
      widget.push(plc.io.AI[config.aiIndex] || 0);
    });

    // Footer
    document.getElementById('plc-vendor').textContent = plc.vendor || 'Unknown';
    document.getElementById('plc-state').textContent = plc.state || 'IDLE';
    document.getElementById('scan-time').textContent = plc.scanTime || '--';

    if (plc.state === 'ABORTED') {
      this.widgets.alarms.add('PLC in ABORTED state', 'high');
    }
  }

  startClock() {
    setInterval(() => {
      document.getElementById('timestamp').textContent =
        new Date().toLocaleTimeString();
    }, 1000);
  }

  updateConnectionStatus(connected) {
    const status = document.getElementById('status');
    status.classList.toggle('disconnected', !connected);
  }
}

export default HMIScreen;
