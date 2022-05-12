import platform from 'platform-detect';

// eslint-disable-next-line import/prefer-default-export
export class OSSwitcher {
  static activeInstance;

  constructor({ layout: { container } } = {}) {
    if (OSSwitcher.activeInstance) {
      // eslint-disable-next-line no-constructor-return
      return OSSwitcher.activeInstance;
    }

    this.container = container;

    OSSwitcher.activeInstance = this;
  }

  switch() {
    if (platform.windows) {
      this.container.classList.add('virtual-keyboard--win');
    }

    if (platform.macos) {
      this.container.classList.add('virtual-keyboard--mac');
    }
  }
}
