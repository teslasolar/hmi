/**
 * Trend Widget - Historical Data Chart
 * Scrolling line chart with auto-scaling
 */

class Trend {
  constructor(parent, config) {
    this.config = config;
    this.data = new Array(config.points).fill(0);
    this.max = 100;
    this.el = this.createDOM();
    this.ctx = this.el.querySelector('canvas').getContext('2d');
    parent.appendChild(this.el);
    this.draw();
  }

  createDOM() {
    const container = document.createElement('div');
    container.className = 'trend';
    container.innerHTML = `
      <div class="label">${this.config.label} (${this.config.units || ''})</div>
      <canvas width="400" height="100"></canvas>
    `;
    return container;
  }

  push(value) {
    this.data.shift();
    this.data.push(value);
    this.max = Math.max(...this.data) * 1.2 || 100;
    this.draw();
  }

  draw() {
    const w = 400, h = 100;

    // Clear
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, w, h);

    // Grid
    this.ctx.strokeStyle = '#222';
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * h;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Line
    this.ctx.strokeStyle = '#0f0';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.data.forEach((v, i) => {
      const x = (i / (this.data.length - 1)) * w;
      const y = h - (v / this.max) * h;
      i === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
    });
    this.ctx.stroke();

    // Current value
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = '12px Courier New';
    this.ctx.fillText(
      this.data[this.data.length - 1].toFixed(1),
      w - 50, 20
    );
  }
}

export default Trend;
