/**
 * Gauge Widget - Analog Value Display
 * Arc-style gauge with needle indicator
 */

class Gauge {
  constructor(parent, config) {
    this.config = config;
    this.value = 0;
    this.el = this.createDOM();
    this.ctx = this.el.querySelector('canvas').getContext('2d');
    parent.appendChild(this.el);
    this.draw(0);
  }

  createDOM() {
    const container = document.createElement('div');
    container.className = 'gauge';
    container.innerHTML = `
      <div class="label">${this.config.label}</div>
      <canvas width="150" height="150"></canvas>
      <div class="value">0.0</div>
      <div class="units">${this.config.units || ''}</div>
    `;
    return container;
  }

  update(value) {
    this.value = value;
    this.el.querySelector('.value').textContent = value.toFixed(1);
    this.draw(value);
  }

  draw(value) {
    const { min, max } = this.config;
    const cx = 75, cy = 75, r = 60;

    this.ctx.clearRect(0, 0, 150, 150);

    // Background arc
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 12;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
    this.ctx.stroke();

    // Value arc
    const angle = Math.PI * 0.75 + ((value - min) / (max - min)) * Math.PI * 1.5;
    this.ctx.strokeStyle = this.getColor(value);
    this.ctx.lineWidth = 12;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, Math.PI * 0.75, angle);
    this.ctx.stroke();

    // Needle
    const needleAngle = angle - Math.PI / 2;
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(
      cx + Math.cos(needleAngle) * (r - 10),
      cy + Math.sin(needleAngle) * (r - 10)
    );
    this.ctx.stroke();

    // Center dot
    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  getColor(value) {
    const percent = (value - this.config.min) / (this.config.max - this.config.min);
    if (percent > 0.9) return '#f00';
    if (percent > 0.75) return '#ff0';
    return '#0f0';
  }
}

export default Gauge;
