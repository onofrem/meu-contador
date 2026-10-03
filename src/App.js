import React, { useEffect, useState } from 'react';
import './App.css';
import Contador from './Contador';
import translations from './i18n';

function App() {
  const [theme, setTheme] = useState('dark');
  const [locale, setLocale] = useState('pt-BR');
  const text = translations[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = text.title;
  }, [locale, text.title]);

  return (
    <main className="app" data-theme={theme}>
      <section className="app-shell" aria-labelledby="app-title">
        <header className="app-header">
          <div>
            <p className="eyebrow">{text.eyebrow}</p>
            <h1 id="app-title">{text.title}</h1>
          </div>
          <div className="app-header-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setLocale(locale === 'pt-BR' ? 'en-US' : 'pt-BR')}
              aria-label={locale === 'pt-BR' ? text.switchToEnglish : text.switchToPortuguese}
            >
              {locale === 'pt-BR' ? 'English (US)' : 'Português (BR)'}
            </button>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? text.switchToLight : text.switchToDark}
            >
              {theme === 'dark' ? text.themeLight : text.themeDark}
            </button>
          </div>
        </header>
        <Contador locale={locale} text={text} />
        <p className="app-footer">{text.footer}</p>
      </section>
    </main>
  );
}

export default App;
