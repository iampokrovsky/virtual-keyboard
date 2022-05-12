import Cookies from 'js-cookie';

export default class LanguageSwitcher {
  static activeInstance;

  cookie = {
    name: 'language',
    expires: 365,
  };

  constructor(state = {}) {
    if (LanguageSwitcher.activeInstance) return;

    this.state = state;
    this.keyboard = state.layout.keyboard;
    this.activeModifiers = state.activeModifiers;

    LanguageSwitcher.activeInstance = this;
  }

  setLanguage(lang) {
    const languages = {
      en: 'ru',
      ru: 'en',
    };

    const prevLang = languages[lang] || this.state.currentLanguage;
    const newLang = lang || languages[prevLang];

    this.state.currentLanguage = newLang;

    Cookies.remove(this.cookie.name);

    Cookies.set(this.cookie.name, newLang, {
      expires: this.cookie.expires,
    });

    this.keyboard.classList.remove(`keyboard--${prevLang}`);
    this.keyboard.classList.add(`keyboard--${newLang}`);
  }

  setDefault() {
    const savedLanguage = Cookies.get(this.cookie.name);

    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    } else {
      this.setLanguage(this.state.currentLanguage);
    }
  }

  switch() {
    const {
      ControlLeft,
      ControlRight,
      AltLeft,
      AltRight,
    } = this.activeModifiers;
    const isControlActive = ControlLeft || ControlRight;
    const isAltActive = AltLeft || AltRight;

    if (isControlActive && isAltActive) {
      this.setLanguage();
    }
  }
}
