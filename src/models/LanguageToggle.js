// eslint-disable-next-line import/prefer-default-export
export class LanguageToggle {
  static activeInstance;

  constructor(state = {}) {
    if (LanguageToggle.activeInstance) {
      // eslint-disable-next-line no-constructor-return
      return LanguageToggle.activeInstance;
    }
    this.state = state;
    this.keyboard = state.layout.keyboard;
    this.activeModifiers = state.activeModifiers;

    LanguageToggle.activeInstance = this;
  }

  check = () => {
    const {ControlLeft, ControlRight, AltLeft, AltRight} = this.activeModifiers;
    const isControlActive = ControlLeft || ControlRight;
    const isAltActive = AltLeft || AltRight;

    const languages = {
      'en': 'ru',
      'ru': 'en',
    };

    if (isControlActive && isAltActive) {
      this.state.currentLanguage = languages[this.state.currentLanguage];
      this.keyboard.classList.toggle('keyboard--ru');
    }
  };
}
