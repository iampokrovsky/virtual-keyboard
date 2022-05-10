import '@styles/style.scss';
import {textareaTemplate} from '@models/textarea-template.js';
import {keyboardTemplate} from '@models/keyboard-template.js';
import {EventHandler} from '@models/EventHandler.js';
import {OSHandler} from '@models/OSHandler.js';

// eslint-disable-next-line import/prefer-default-export
export class VirtualKeyboard {
  static activeInstance;

  state = {
    layout: {
      container: null,
      keyboard: null,
      keys: {},
    },
    currentLanguage: 'en',
    activeModifiers: {
      CapsLock: false,
      ShiftLeft: false,
      ShiftRight: false,
      AltLeft: false,
      AltRight: false,
      ControlLeft: false,
      ControlRight: false,
    },
  };

  constructor() {
    if (VirtualKeyboard.activeInstance) {
      // eslint-disable-next-line no-constructor-return
      return VirtualKeyboard.activeInstance;
    }

    VirtualKeyboard.activeInstance = this;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    const template = wrapper.firstElementChild;
    this.state.layout = this.getElements(template);
    document.body.append(template);

    this.OSHandler = new OSHandler(this.state);
    this.OSHandler.check();

    this.initEventListeners();
  }

  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return `
      <div class="virtual-keyboard">
        ${textareaTemplate()}
        ${keyboardTemplate()}
        <p style="text-align: center;">Для переключения языка комбинация: левыe ctrl + alt</p>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  getElements(template) {
    const textarea = template.querySelector('.textarea');
    const keyboard = template.querySelector('.keyboard');

    const keys = {};
    const keysElements = template.querySelectorAll('[data-key-code]');

    // eslint-disable-next-line no-restricted-syntax
    for (const key of keysElements) {
      const name = key.dataset.keyCode;

      keys[name] = key;
    }

    return {
      container: template,
      textarea,
      keyboard,
      keys,
    };
  }

  initEventListeners() {
    this.eventHandler = new EventHandler(this.state);
    this.eventHandler.init();
  }

  remove() {
    this.layout?.container.remove();
  }

  destroy() {
    this.remove();
    this.layout = {};
  }
}
