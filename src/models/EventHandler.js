import TextareaController from '@models/TextareaController.js';
import LanguageSwitcher from '@models/LanguageSwitcher.js';

export default class EventHandler {
  static activeInstance;

  constructor(state = {}) {
    if (EventHandler.activeInstance) return;

    this.state = state;
    this.activeModifiers = this.state.activeModifiers;
    this.layout = this.state.layout;

    this.textareaController = new TextareaController(state);
    this.languageSwitcher = new LanguageSwitcher(state);

    EventHandler.activeInstance = this;
  }

  static getActiveKeyCode(event) {
    return event.code || event.target.dataset.keyCode;
  }

  static getEventDirection(event) {
    return event.type.match(/(up|down)$/gi)[0];
  }

  getActiveKey = (event) => this.layout.keys[EventHandler.getActiveKeyCode(
    event,
  )];

  changeKeyHighlight(event) {
    const activeKeyCode = EventHandler.getActiveKeyCode(event);

    if (activeKeyCode === 'CapsLock') return;

    const activeKey = this.getActiveKey(event);
    const isModifier = Object.keys(this.activeModifiers)
      .includes(activeKeyCode);
    const isModifierActive = this.activeModifiers[activeKeyCode];

    if (event.type === 'keydown') {
      if (isModifier && !isModifierActive) return;
      activeKey.classList.add('key--active');
    }

    if (event.type === 'keyup') {
      activeKey.classList.remove('key--active');
    }
  }

  changeModifierState = (event, key) => {
    let targetKey = key;
    const modifiers = Object.keys(this.activeModifiers);
    const eventDirection = EventHandler.getEventDirection(event);

    if (!targetKey) {
      targetKey = EventHandler.getActiveKeyCode(event);
    }
    if (!modifiers.includes(targetKey)) return;

    this.activeModifiers[targetKey] = (eventDirection === 'down');
  };

  isControlActive() {
    const {
      ControlLeft,
      ControlRight,
    } = this.activeModifiers;

    return ControlLeft || ControlRight;
  }

  defaultHandlers = {
    down: (event) => {
      const {
        ShiftLeft,
        ShiftRight,
        CapsLock,
      } = this.activeModifiers;

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

      const value = this.getActiveKey(event)
        .querySelector(targetSymbolClass).textContent;

      this.textareaController.exec('insert', value);
    },
    up: () => {},
  };

  shiftHandler = (event) => {
    const activeKeyCode = EventHandler.getActiveKeyCode(event);

    const shiftPairs = {
      ShiftLeft: 'ShiftRight',
      ShiftRight: 'ShiftLeft',
    };

    const pair = [shiftPairs[activeKeyCode]];

    if (EventHandler.getEventDirection(event) === 'down') {
      if (this.activeModifiers[pair]) return;

      this.layout.keyboard.classList.add('keyboard--shift');
    }

    if (EventHandler.getEventDirection(event) === 'up') {
      this.layout.keys[pair].classList.remove('key--active');
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
    MetaLeft: {
      down: () => {},
      up: () => {},
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
        if (this.isControlActive()) {
          this.textareaController.exec('selectAll');
        } else {
          this.defaultHandlers.down(event);
        }
      },
      up: () => {},
    },
    KeyC: {
      down: (event) => {
        if (this.isControlActive()) {
          const selected = window.getSelection().toString();
          window.navigator.clipboard.writeText(selected);
        } else {
          this.defaultHandlers.down(event);
        }
      },
      up: () => {},
    },
    KeyV: {
      down: (event) => {
        if (this.isControlActive()) {
          navigator.clipboard.readText().then(
            (clip) => this.textareaController.exec('insert', clip),
          );
        } else {
          this.defaultHandlers.down(event);
        }
      },
      up: () => {},
    },
    KeyZ: {
      down: (event) => {
        if (!this.isControlActive()) this.defaultHandlers.down(event);
      },
      up: () => {},
    },
    KeyY: {
      down: (event) => {
        if (!this.isControlActive()) this.defaultHandlers.down(event);
      },
      up: () => {},
    },
  };

  specialKeys = Object.keys(this.specialHandlers);

  handler = (event) => {
    const eventDirection = EventHandler.getEventDirection(event);
    const activeKeyCode = EventHandler.getActiveKeyCode(event);

    if (this.layout.keys[activeKeyCode]) {
      event.preventDefault();
    } else {
      return;
    }

    if (event.type === 'pointerdown') {
      this.lastActiveModifier = activeKeyCode;
    }

    if (event.type === 'pointerup' && this.lastActiveModifier
      && this.lastActiveModifier !== 'CapsLock') {
      this.changeModifierState(event, this.lastActiveModifier);
    }

    if (this.specialKeys.includes(activeKeyCode)) {
      this.specialHandlers[activeKeyCode][eventDirection](event);
    } else {
      this.defaultHandlers[eventDirection](event);
    }

    this.changeKeyHighlight(event);

    this.languageSwitcher.switch();
  };

  on() {
    document.addEventListener('keydown', this.handler);
    document.addEventListener('keyup', this.handler);
    document.addEventListener('pointerdown', this.handler);
    document.addEventListener('pointerup', this.handler);
  }

  off() {
    document.removeEventListener('keydown', this.handler);
    document.removeEventListener('keyup', this.handler);
    document.removeEventListener('pointerdown', this.handler);
    document.removeEventListener('pointerup', this.handler);
  }
}
