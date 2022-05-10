import platform from 'platform-detect';

// eslint-disable-next-line import/prefer-default-export
export class OSHandler {
  static activeInstance;

  constructor({ layout: { keyboard } } = {}) {
    if (OSHandler.activeInstance) {
      // eslint-disable-next-line no-constructor-return
      return OSHandler.activeInstance;
    }

    this.keyboard = keyboard;

    OSHandler.activeInstance = this;
  }

  handler = () => {
    if (platform.windows) {
      this.keyboard.classList.add('keyboard--win');
    }

    if (platform.macos) {
      this.keyboard.classList.add('keyboard--mac');
    }
  };

  init() {
    document.addEventListener('DOMContentLoaded', this.handler);
  }

  disable() {
    document.removeEventListener('DOMContentLoaded', this.handler);
  }

  // eslint-disable-next-line class-methods-use-this
  destroy() {
    OSHandler.activeInstance = null;
  }
}
