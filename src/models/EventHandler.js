import {TextareaController} from '@models/TextareaController';

export class EventHandler {
  constructor(state = {}) {
    this.state = state;
    this.activeModifiers = this.state.activeModifiers;
    this.layout = this.state.layout;

    this.textareaController = new TextareaController(this.layout);
  }

  getActiveKeyCode(event) {
    return event.code || event.target.dataset.keyCode;
  }

  getActiveKey(event) {
    return this.layout.keys[this.getActiveKeyCode(event)];
  }

  getEventDirection(event) {
    return {
      'keydown': 'down',
      'keyup': 'up',
      'pointerdown': 'down',
      'pointerup': 'up',
    }[event.type];
  }

  changeKeyHighlight(event) {
    const activeKey = this.getActiveKey(event);

    if (event.type === 'keydown') {
      activeKey.classList.add('key--active');
    }
    if (event.type === 'keyup') {
      activeKey.classList.remove('key--active');
    }
  }

  defaultHandlers = {
    down: (event) => {
      const {ShiftLeft, ShiftRight, CapsLock} = this.activeModifiers;

      const isShiftActive = ShiftLeft || ShiftRight;

      let targetSymbolClass = '.key__' + this.state.currentLanguage;

      if (isShiftActive && !CapsLock) {
        targetSymbolClass += ' .key__shift';
      }

      if (!isShiftActive && CapsLock) {
        targetSymbolClass += ' .key__caps-lock';
      }

      if (isShiftActive && CapsLock) {
        targetSymbolClass += ' .key__shift-caps-lock';
      }

      if (!isShiftActive && !CapsLock) {
        targetSymbolClass += ' .key__default';
      }

      const value = this.getActiveKey(event).
          querySelector(targetSymbolClass).textContent;

      this.textareaController.exec('insert', value);
    },
    up: () => {},
  };

  shiftHandler = (event) => {
    // TODO доделать переключение шифтов
    const activeKeyCode = this.getActiveKeyCode(event);

    const shiftPairs = {
      ShiftLeft: 'ShiftRight',
      ShiftRight: 'ShiftLeft',
    };

    const pair = [shiftPairs[activeKeyCode]];

    if (this.getEventDirection(event) === 'down') {
      if (this.activeModifiers[pair]) return;

      this.activeModifiers[activeKeyCode] = true;
      this.layout.keyboard.classList.add('keyboard--shift');
    }

    if (this.getEventDirection(event) === 'up') {
      this.layout.keys[pair].classList.remove(
          'key--active');
      this.activeModifiers[pair] = false;

      this.activeModifiers[activeKeyCode] = false;
      this.layout.keyboard.classList.remove('keyboard--shift');
    }
  };

  altHandler = (event) => {
    this.activeModifiers[this.getActiveKeyCode(
        event)] = (this.getEventDirection(event) ===
        'down');
  };

  controlHandler = this.altHandler;

  specialHandlers = {
    CapsLock: {
      down: (event) => {
        this.activeModifiers.CapsLock = !this.activeModifiers.CapsLock;

        this.layout.keys[this.getActiveKeyCode(event)].classList.toggle(
            'key--active');
        this.layout.keyboard.classList.toggle('keyboard--caps-lock');
      },
      up: () => {},
    },
    ShiftLeft: {
      down: this.shiftHandler,
      up: this.shiftHandler,
    },
    ShiftRight: {
      down: this.shiftHandler,
      up: this.shiftHandler,
    },
    AltLeft: {
      down: this.altHandler,
      up: this.altHandler,
    },
    AltRight: {
      down: this.altHandler,
      up: this.altHandler,
    },
    ControlLeft: {
      down: this.controlHandler,
      up: this.controlHandler,
    },
    ControlRight: {
      down: this.controlHandler,
      up: this.controlHandler,
    },
    Tab: {
      down: () => {
        this.textareaController.exec('insert', '\t');
      },
      up: () => {},
    },
    Enter: {
      down: () => {
        this.textareaController.exec('insert', '\n');
      },
      up: () => {},
    },
    Backspace: {
      down: () => {
        this.textareaController.exec('delete');
      },
      up: () => {},
    },
    ArrowUp: {
      down: () => {
        this.textareaController.exec('insert', ' ');
      },
      up: () => {},
    },
    ArrowDown: {
      down: () => {},
      up: () => {},
    },
    ArrowLeft: {
      down: () => {},
      up: () => {},
    },
    ArrowRight: {
      down: () => {},
      up: () => {},
    },
    default: {
      down: () => {},
      up: () => {},
    },
  };

  specialKeys = Object.keys(this.specialHandlers);

  handler = (event) => {
    const eventType = this.getEventDirection(event);
    const activeKeyCode = this.getActiveKeyCode(event);

    if (this.layout.keys[activeKeyCode]) {
      event.preventDefault();
    } else {
      return;
    }

    if (this.specialKeys.includes(activeKeyCode)) {
      this.specialHandlers[activeKeyCode][eventType](event);
    } else {
      this.defaultHandlers[eventType](event);
    }

    this.changeKeyHighlight(event);
  };

  init() {
    document.addEventListener('keydown', this.handler);
    document.addEventListener('keyup', this.handler);
    document.addEventListener('pointerdown', this.handler);
    document.addEventListener('pointerup', this.handler);
  }

  remove() {
    document.removeEventListener('keydown', this.handler);
    document.removeEventListener('keyup', this.handler);
    document.removeEventListener('pointerdown', this.handler);
    document.removeEventListener('pointerup', this.handler);
  }
}