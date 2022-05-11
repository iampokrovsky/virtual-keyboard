import {TextareaController} from '@models/TextareaController.js';
import {LanguageSwitcher} from '@models/LanguageSwitcher.js';

// eslint-disable-next-line import/prefer-default-export
export class EventHandler {
  static activeInstance;

  constructor(state = {}) {
    if (EventHandler.activeInstance) {
      // eslint-disable-next-line no-constructor-return
      return EventHandler.activeInstance;
    }

    this.state = state;
    this.activeModifiers = this.state.activeModifiers;
    this.layout = this.state.layout;

    this.textareaController = new TextareaController(state);
    this.languageSwitcher = new LanguageSwitcher(state);

    EventHandler.activeInstance = this;
  }

  // eslint-disable-next-line class-methods-use-this
  getActiveKeyCode(event) {
    return event.code || event.target.dataset.keyCode;
  }

  getActiveKey(event) {
    return this.layout.keys[this.getActiveKeyCode(event)];
  }

  // eslint-disable-next-line class-methods-use-this
  getEventDirection(event) {
    return event.type.match(/(up|down)$/gi)[0];
  }

  changeKeyHighlight(event) {
    const activeKeyCode = this.getActiveKeyCode(event);

    if (activeKeyCode === 'CapsLock') return;

    const activeKey = this.getActiveKey(event);

    if (event.type === 'keydown') {
      activeKey.classList.add('key--active');
    }
    if (event.type === 'keyup') {
      activeKey.classList.remove('key--active');
    }
  }

  changeModifierState = (event, key) => {
    const modifiers = Object.keys(this.state.activeModifiers);
    const eventDirection = this.getEventDirection(event);

    if (!key) {
      key = this.getActiveKeyCode(event);
    }
    if (!modifiers.includes(key)) return;

    this.activeModifiers[key] = (eventDirection === 'down');
  };

  defaultHandlers = {
    down: (event) => {
      const {ShiftLeft, ShiftRight, CapsLock} = this.activeModifiers;

      const isShiftActive = ShiftLeft || ShiftRight;

      let targetSymbolClass = `.key__${this.state.currentLanguage}`;

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

      this.layout.keyboard.classList.add('keyboard--shift');
    }

    if (this.getEventDirection(event) === 'up') {
      this.layout.keys[pair].classList.remove(
          'key--active',
      );
      this.changeModifierState(event, pair);

      this.layout.keyboard.classList.remove('keyboard--shift');
    }

    this.changeModifierState(event);
  };

  specialHandlers = {
    CapsLock: {
      down: (event) => {
        this.activeModifiers.CapsLock = !this.activeModifiers.CapsLock;

        this.getActiveKey(event).classList.toggle('key--active');
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
      down: this.changeModifierState,
      up: this.changeModifierState,
    },
    AltRight: {
      down: this.changeModifierState,
      up: this.changeModifierState,
    },
    ControlLeft: {
      down: this.changeModifierState,
      up: this.changeModifierState,
    },
    ControlRight: {
      down: this.changeModifierState,
      up: this.changeModifierState,
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
    Space: {
      down: () => {
        this.textareaController.exec('insert', ' ');
      },
      up: () => {},
    },
    ArrowUp: {
      down: () => {
        this.textareaController.exec('moveUp');
      },
      up: () => {},
    },
    ArrowDown: {
      down: () => {
        this.textareaController.exec('moveDown');
      },
      up: () => {},
    },
    ArrowLeft: {
      down: () => {
        this.textareaController.exec('moveLeft');
      },
      up: () => {},
    },
    ArrowRight: {
      down: () => {
        this.textareaController.exec('moveRight');
      },
      up: () => {},
    },
    KeyA: {
      down: (event) => {
        const {ControlLeft, ControlRight} = this.activeModifiers;
        const isControlActive = ControlLeft || ControlRight;

        if (isControlActive) {
          this.textareaController.exec('selectAll');
        } else {
          this.defaultHandlers.down(event);
        }
      },
      up: () => {},
    },
  };

  specialKeys = Object.keys(this.specialHandlers);

  handler = (event) => {
    const eventDirection = this.getEventDirection(event);
    const activeKeyCode = this.getActiveKeyCode(event);

    if (this.layout.keys[activeKeyCode]) {
      event.preventDefault();
    } else {
      return;
    }

    if (event.type === 'pointerdown') {
      this.lastActiveModifier = activeKeyCode;
    }

    if (event.type === 'pointerup' && this.lastActiveModifier) {
      this.changeModifierState(event, this.lastActiveModifier);
    }

    if (this.specialKeys.includes(activeKeyCode)) {
      this.specialHandlers[activeKeyCode][eventDirection](event);
    } else {
      this.defaultHandlers[eventDirection](event);
    }

    this.changeKeyHighlight(event);

    this.languageSwitcher.switch();

    // console.log(this.state.activeModifiers.ShiftLeft);
    // console.log(this.state.activeModifiers.ShiftRight);
    // console.log(this.state.activeModifiers.AltLeft);
    // console.log(this.state.activeModifiers.AltRight);
    // console.log(this.state.activeModifiers.CapsLock);

  };

  init() {
    document.addEventListener('keydown', this.handler);
    document.addEventListener('keyup', this.handler);
    document.addEventListener('pointerdown', this.handler);
    document.addEventListener('pointerup', this.handler);
  }

  disable() {
    document.removeEventListener('keydown', this.handler);
    document.removeEventListener('keyup', this.handler);
    document.removeEventListener('pointerdown', this.handler);
    document.removeEventListener('pointerup', this.handler);
  }
}
