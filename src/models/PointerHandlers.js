import {TextareaController} from '@models/TextareaController.js';

export class PointerHandlers {
  constructor(state = {}) {
    this.state = state;
    this.activeModifiers = this.state.activeModifiers;
    this.layout = this.state.layout;

    this.textareaController = new TextareaController(this.layout);
  }

  onPointerDown = (event) => {
    if (!event.target.dataset.keyCode) return;

    if (event.target.dataset.keyCode === 'Backspace') {
      this.textareaController.exec('delete');
      return;
    }

    let targetSymbolClass = '.key__' + this.state.currentLanguage;

    const isCapsLockActive = this.state.activeModifiers.CapsLock;

    if (event.shiftKey && !isCapsLockActive) {
      targetSymbolClass += ' .key__shift';
    }

    if (!event.shiftKey && isCapsLockActive) {
      targetSymbolClass += ' .key__caps-lock';
    }

    if (event.shiftKey && isCapsLockActive) {
      targetSymbolClass += ' .key__shift-caps-lock';
    }

    if (!event.shiftKey && !isCapsLockActive) {
      targetSymbolClass += ' .key__default';
    }

    const content = event.target.querySelector(targetSymbolClass).textContent;

    this.textareaController.exec('insert', content);

    console.log(content);

  };

  init() {
    document.addEventListener('pointerdown', this.onPointerDown);
  }

  remove() {
    document.removeEventListener('pointerdown', this.onPointerDown);
  }
}