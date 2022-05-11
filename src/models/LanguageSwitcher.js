import Cookies from 'js-cookie';

// eslint-disable-next-line import/prefer-default-export
export class LanguageSwitcher {
  static activeInstance;

  cookie = {
    name: 'language',
    expires: 365,
  };

  constructor(state = {}) {
    if (LanguageSwitcher.activeInstance) {
      // eslint-disable-next-line no-constructor-return
      return LanguageSwitcher.activeInstance;
    }
    this.state = state;
    this.keyboard = state.layout.keyboard;
    this.activeModifiers = state.activeModifiers;

    LanguageSwitcher.activeInstance = this;
  }

  setLanguage(lang) {
    const languages = {
      'en': 'ru',
      'ru': 'en',
    };

    const prevLang = languages[lang] || this.state.currentLanguage;
    const newLang = lang || languages[prevLang];

    this.state.currentLanguage = newLang;

    Cookies.remove(this.cookie.name);

    Cookies.set(this.cookie.name, newLang, {expires: this.cookie.expires});

    this.keyboard.classList.remove('keyboard--' + prevLang);
    this.keyboard.classList.add('keyboard--' + newLang);
  }

  setFromCookies() {
    const savedLanguage = Cookies.get(this.cookie.name);

    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    } else {
      this.setLanguage(this.state.currentLanguage);
    }

    console.log(Cookies.get(this.cookie.name));
  }

  switch() {
    const {ControlLeft, ControlRight, AltLeft, AltRight} = this.activeModifiers;
    const isControlActive = ControlLeft || ControlRight;
    const isAltActive = AltLeft || AltRight;

    if (isControlActive && isAltActive) {
      this.setLanguage();
    }
  };
}
