/**
 * Alarm Widget - Event Log (ISA-18.2)
 * Priority-based alarm list with timestamps
 */

class Alarm {
  constructor(parent, maxAlarms = 100) {
    this.maxAlarms = maxAlarms;
    this.alarms = [];
    this.el = this.createDOM();
    parent.appendChild(this.el);
  }

  createDOM() {
    const container = document.createElement('div');
    container.className = 'alarm-list';
    return container;
  }

  add(message, severity = 'low') {
    const alarm = {
      msg: message,
      time: new Date().toLocaleTimeString(),
      sev: severity
    };

    this.alarms.unshift(alarm);

    if (this.alarms.length > this.maxAlarms) {
      this.alarms.pop();
    }

    this.render();
  }

  render() {
    this.el.innerHTML = this.alarms.map(a => `
      <div class="alarm ${a.sev}">
        <span>${a.msg}</span>
        <span class="alarm-time">${a.time}</span>
      </div>
    `).join('');
  }

  clear() {
    this.alarms = [];
    this.render();
  }
}

export default Alarm;
