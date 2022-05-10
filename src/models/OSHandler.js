import platform from 'platform-detect';

// eslint-disable-next-line import/prefer-default-export
export class OSHandler {
  static activeInstance;

  constructor({layout: {keyboard}} = {}) {
    if (OSHandler.activeInstance) {
      // eslint-disable-next-line no-constructor-return
      return OSHandler.activeInstance;
    }

    this.keyboard = keyboard;

    OSHandler.activeInstance = this;
  }

  check = () => {
    if (platform.windows) {
      this.keyboard.classList.add('keyboard--win');
    }

    if (platform.macos) {
      this.keyboard.classList.add('keyboard--mac');
    }
  };
}
