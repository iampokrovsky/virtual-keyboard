export class PointerHandlers {
  constructor(state = {}) {
    this.state = state;
    this.activeModifiers = this.state.activeModifiers;
    this.layout = this.state.layout;
  }

  onPointerDown = (event) => {
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

    console.log(event.target.querySelector(targetSymbolClass).textContent);
  };

  init() {
    document.addEventListener('pointerdown', this.onPointerDown);
  }

  remove() {
    document.removeEventListener('pointerdown', this.onPointerDown);
  }
}