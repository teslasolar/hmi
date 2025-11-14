/**
 * Button Widget - Control Interface
 * Operator control button with state feedback
 */

class Button {
  constructor(parent, config, onClick) {
    this.config = config;
    this.active = false;
    this.el = this.createDOM(onClick);
    parent.appendChild(this.el);
  }

  createDOM(onClick) {
    const button = document.createElement('button');
    button.className = 'hmi-btn';
    if (this.config.danger) {
      button.classList.add('danger');
    }
    button.textContent = this.config.label;
    button.onclick = () => onClick(this.config);
    return button;
  }

  setState(active) {
    this.active = active;
    if (active) {
      this.el.classList.add('active');
    } else {
      this.el.classList.remove('active');
    }
  }
}

export default Button;
