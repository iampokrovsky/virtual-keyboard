import '@styles/style.scss';
import textareaTemplate from '@models/textarea-template.js';
import keyboardTemplate from '@models/keyboard-template.js';
import EventHandler from '@models/EventHandler.js';
import OSSwitcher from '@models/OSSwitcher.js';
import LanguageSwitcher from '@models/LanguageSwitcher.js';

export default class VirtualKeyboard {
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
    if (VirtualKeyboard.activeInstance) return;

    VirtualKeyboard.activeInstance = this;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = VirtualKeyboard.getTemplate();
    const template = wrapper.firstElementChild;
    this.state.layout = VirtualKeyboard.getElements(template);
    document.body.append(template);

    this.OSSwitcher = new OSSwitcher(this.state);
    this.OSSwitcher.switch();

    this.languageSwitcher = new LanguageSwitcher(this.state);
    this.languageSwitcher.setDefault();

    this.eventHandler = new EventHandler(this.state);
    this.eventHandler.on();
  }

  static getTemplate() {
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

  static getElements(template) {
    const textarea = template.querySelector('.textarea__element');
    const keyboard = template.querySelector('.keyboard');
    const keysElements = template.querySelectorAll('[data-key-code]');

    const keys = [...keysElements].reduce((obj, key) => {
      const result = obj;
      const name = key.dataset.keyCode;

      result[name] = key;

      return result;
    }, {});

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

    Object.keys(this.state.activeModifiers).forEach((modifier) => {
      this.state.activeModifiers[modifier] = false;
    });

    this.eventHandler.off();
  }
}
