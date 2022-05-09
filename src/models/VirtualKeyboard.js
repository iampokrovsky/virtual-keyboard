import '@styles/style.scss';
import {Textarea} from '@models/Textarea.js';
import {Keyboard} from '@models/Keyboard.js';
import {KeyHandlers} from '@models/KeyHandlers.js';
import {PointerHandlers} from '@models/PointerHandlers.js';

export class VirtualKeyboard {
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
    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    const template = wrapper.firstElementChild;
    this.state.layout = this.getElements(template);
    document.body.append(template);

    this.initEventListeners();
  }

  getTemplate() {
    return `
      <div class="virtual-keyboard">
        ${(new Textarea()).template}
        ${(new Keyboard()).template}
        <p style="text-align: center;">Для переключения языка комбинация: левыe ctrl + alt</p>
      </div>
    `;
  }

  getElements(template) {
    const container = template.querySelector('.virtual-keyboard');

    const keyboard = template.querySelector('.keyboard');

    const keys = {};
    const keysElements = template.querySelectorAll('[data-key-code]');

    for (const key of keysElements) {
      const name = key.dataset.keyCode;

      keys[name] = key;
    }

    return {
      container,
      keyboard,
      keys,
    };
  }

  initEventListeners() {
    this.keyHandlers = new KeyHandlers(this.state);
    this.keyHandlers.init();

    this.pointerHandlers = new PointerHandlers(this.state);
    this.pointerHandlers.init();
  }

  remove() {
    this.layout?.container.remove();
  }

  destroy() {
    this.remove();
    this.layout = {};
    this.keyHandlers.remove();
    this.pointerHandlers.remove();
  }
}


