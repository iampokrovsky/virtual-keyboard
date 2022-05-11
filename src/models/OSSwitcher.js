import platform from 'platform-detect';

// eslint-disable-next-line import/prefer-default-export
export class OSSwitcher {
  static activeInstance;

  constructor({layout: {keyboard}} = {}) {
    if (OSSwitcher.activeInstance) {
      // eslint-disable-next-line no-constructor-return
      return OSSwitcher.activeInstance;
    }

    this.keyboard = keyboard;

    OSSwitcher.activeInstance = this;
  }

  switch() {
    if (platform.windows) {
      this.keyboard.classList.add('keyboard--win');
    }

    if (platform.macos) {
      this.keyboard.classList.add('keyboard--mac');
    }
  };
}
