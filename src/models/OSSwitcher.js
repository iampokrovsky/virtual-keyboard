import platform from 'platform-detect';

export default class OSSwitcher {
  static activeInstance;

  constructor({ layout: { container } } = {}) {
    if (OSSwitcher.activeInstance) return;

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
