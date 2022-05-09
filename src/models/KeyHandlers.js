export class KeyHandlers {
  constructor({
    activeModifiers = {},
    layout = {},
  } = {}) {
    this.activeModifiers = activeModifiers;
    this.layout = layout;
  }

  defaultKeyEventsHandlers = {
    keydown: (event) => this.layout.keys[event.code].classList.add(
        'key--active'),
    keyup: (event) => this.layout.keys[event.code].classList.remove(
        'key--active'),
  };

  shiftHandler = (event) => {
    const shiftCode = event.code;

    const shiftPairs = {
      ShiftLeft: 'ShiftRight',
      ShiftRight: 'ShiftLeft',
    };

    if (event.type === 'keydown') {
      const isPairedActive = this.activeModifiers[shiftPairs[shiftCode]];

      if (isPairedActive) return;

      this.layout.keyboard.classList.add('keyboard--shift');
    }

    if (event.type === 'keyup') {
      this.layout.keys[shiftPairs[shiftCode]].classList.remove('key--active');
      this.activeModifiers[shiftPairs[shiftCode]] = false;

      this.layout.keyboard.classList.remove('keyboard--shift');
    }

    this.activeModifiers[shiftCode] = (event.type === 'keydown');
    this.defaultKeyEventsHandlers[event.type](event);
  };

  altHandler = (event) => {
    event.preventDefault();
    this.activeModifiers[event.code] = (event.type === 'keydown');
    this.defaultKeyEventsHandlers[event.type](event);
  };

  controlHandler = this.altHandler;

  specialKeysHandlers = {
    Tab: {
      keydown: (event) => {
        event.preventDefault();
        this.defaultKeyEventsHandlers[event.type](event);
      },
      keyup: (event) => this.defaultKeyEventsHandlers[event.type](event),
    },
    CapsLock: {
      keydown: (event) => {
        this.activeModifiers.CapsLock = !this.activeModifiers.CapsLock;

        this.layout.keys[event.code].classList.toggle('key--active');
        this.layout.keyboard.classList.toggle('keyboard--caps-lock');
      },
      keyup: () => {},
    },
    ShiftLeft: {
      keydown: this.shiftHandler,
      keyup: this.shiftHandler,
    },
    ShiftRight: {
      keydown: this.shiftHandler,
      keyup: this.shiftHandler,
    },
    AltLeft: {
      keydown: this.altHandler,
      keyup: this.altHandler,
    },
    AltRight: {
      keydown: this.altHandler,
      keyup: this.altHandler,
    },
    ControlLeft: {
      keydown: this.controlHandler,
      keyup: this.controlHandler,
    },
    ControlRight: {
      keydown: this.controlHandler,
      keyup: this.controlHandler,
    },
  };

  specialKeys = Object.keys(this.specialKeysHandlers);

  keyEventsHandler = (event) => {
    if (!this.layout.keys[event.code]) return;

    if (this.specialKeys.includes(event.code)) {
      this.specialKeysHandlers[event.code][event.type](event);
      return;
    }

    this.defaultKeyEventsHandlers[event.type](event);
  };

  init() {
    document.addEventListener('keydown', this.keyEventsHandler);
    document.addEventListener('keyup', this.keyEventsHandler);
  }

  remove() {
    document.removeEventListener('keydown', this.keyEventsHandler);
    document.removeEventListener('keyup', this.keyEventsHandler);
  }
}