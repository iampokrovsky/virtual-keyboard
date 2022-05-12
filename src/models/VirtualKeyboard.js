import '@styles/style.scss';
import { textareaTemplate } from '@models/textarea-template.js';
import { keyboardTemplate } from '@models/keyboard-template.js';
import { EventHandler } from '@models/EventHandler.js';
import { OSSwitcher } from '@models/OSSwitcher.js';
import { LanguageSwitcher } from '@models/LanguageSwitcher.js';

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

    this.OSSwitcher = new OSSwitcher(this.state);
    this.OSSwitcher.switch();

    this.languageSwitcher = new LanguageSwitcher(this.state);
    this.languageSwitcher.setDefault();

    this.eventHandler = new EventHandler(this.state);
    this.eventHandler.on();
  }

  // eslint-disable-next-line class-methods-use-this
  getTemplate() {
    return `
      <div class="virtual-keyboard">
        ${textareaTemplate()}
        ${keyboardTemplate()}
        <p class="language-snippet" style="text-align: center;">Для переключения языка используйте клавиши
          <span class="language-snippet__win">Сtrl + Alt</span>
          <span class="language-snippet__mac">Сtrl + Opt</span>
        </p>
        <a class="virtual-keyboard__github-link" href="https://github.com/iampokrovsky/virtual-keyboard" target="_blank"><span class="visually-hidden">Репозиторий на GitHub</span></a>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  getElements(template) {
    const textarea = template.querySelector('.textarea__element');
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

  remove() {
    this.layout?.container.remove();
  }

  destroy() {
    this.remove();
    this.layout = {};
    this.state.currentLanguage = 'en';

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const modifier in this.state.activeModifiers) {
      this.state.activeModifiers[modifier] = false;
    }

    this.eventHandler.off();
  }
}
