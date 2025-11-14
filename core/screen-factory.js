/**
 * Widget Factory - Creates and configures widgets
 * Separates widget instantiation from screen logic
 */

import Gauge from '../widgets/gauge.js';
import Trend from '../widgets/trend.js';
import Button from '../widgets/button.js';
import Alarm from '../widgets/alarm.js';

class WidgetFactory {
  static createGauges(container, configs) {
    return configs.map(cfg => ({
      widget: new Gauge(container, cfg),
      config: cfg
    }));
  }

  static createTrends(container, configs) {
    return configs.map(cfg => ({
      widget: new Trend(container, cfg),
      config: cfg
    }));
  }

  static createButtons(container, groups, clickHandler) {
    const buttons = [];

    groups.forEach(group => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'control-group';

      const title = document.createElement('div');
      title.className = 'control-group-title';
      title.textContent = group.group;
      groupDiv.appendChild(title);

      group.buttons.forEach(btnCfg => {
        const button = new Button(groupDiv, btnCfg, clickHandler);
        buttons.push({ widget: button, config: btnCfg });
      });

      container.appendChild(groupDiv);
    });

    return buttons;
  }

  static createAlarm(container, maxAlarms) {
    return new Alarm(container, maxAlarms);
  }
}

export default WidgetFactory;
