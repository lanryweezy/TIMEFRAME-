import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko' | 'pt';

interface Translation {
  [key: string]: string;
}

interface Translations {
  [lang: string]: Translation;
}

const translations: Translations = {
  en: {
    // Navigation
    'nav.landing': 'Home',
    'nav.dashboard': 'Projects',
    'nav.settings': 'Settings',
    'nav.assets': 'Assets',
    'nav.editor': 'Editor',
    
    // Actions
    'action.export': 'Export',
    'action.save': 'Save',
    'action.undo': 'Undo',
    'action.redo': 'Redo',
    'action.delete': 'Delete',
    'action.duplicate': 'Duplicate',
    'action.split': 'Split',
    
    // Editor
    'editor.sidebar.text': 'Text',
    'editor.sidebar.media': 'Media',
    'editor.sidebar.audio': 'Audio',
    'editor.sidebar.effects': 'Effects',
    'editor.sidebar.templates': 'Templates',
    
    // Properties
    'props.transform': 'Transform',
    'props.color': 'Color',
    'props.audio': 'Audio',
    'props.effects': 'Effects',
    'props.text': 'Text',
    
    // Messages
    'msg.saving': 'Saving...',
    'msg.saved': 'Saved',
    'msg.error': 'Error',
    'msg.exporting': 'Exporting...',
    'msg.processing': 'Processing...',
  },
  es: {
    'nav.landing': 'Inicio',
    'nav.dashboard': 'Proyectos',
    'nav.settings': 'Configuración',
    'action.export': 'Exportar',
    'action.save': 'Guardar',
    'action.undo': 'Deshacer',
    'action.redo': 'Rehacer',
    'editor.sidebar.text': 'Texto',
    'editor.sidebar.media': 'Medios',
    'editor.sidebar.audio': 'Audio',
    'editor.sidebar.effects': 'Efectos',
  },
  fr: {
    'nav.landing': 'Accueil',
    'nav.dashboard': 'Projets',
    'nav.settings': 'Paramètres',
    'action.export': 'Exporter',
    'action.save': 'Enregistrer',
    'action.undo': 'Annuler',
    'action.redo': 'Rétablir',
    'editor.sidebar.text': 'Texte',
    'editor.sidebar.media': 'Médias',
    'editor.sidebar.audio': 'Audio',
    'editor.sidebar.effects': 'Effets',
  },
  de: {
    'nav.landing': 'Startseite',
    'nav.dashboard': 'Projekte',
    'nav.settings': 'Einstellungen',
    'action.export': 'Exportieren',
    'action.save': 'Speichern',
    'action.undo': 'Rückgängig',
    'action.redo': 'Wiederholen',
    'editor.sidebar.text': 'Text',
    'editor.sidebar.media': 'Medien',
    'editor.sidebar.audio': 'Audio',
    'editor.sidebar.effects': 'Effekte',
  },
  ja: {
    'nav.landing': 'ホーム',
    'nav.dashboard': 'プロジェクト',
    'nav.settings': '設定',
    'action.export': 'エクスポート',
    'action.save': '保存',
    'action.undo': '元に戻す',
    'action.redo': 'やり直し',
    'editor.sidebar.text': 'テキスト',
    'editor.sidebar.media': 'メディア',
    'editor.sidebar.audio': 'オーディオ',
    'editor.sidebar.effects': 'エフェクト',
  },
  zh: {
    'nav.landing': '首页',
    'nav.dashboard': '项目',
    'nav.settings': '设置',
    'action.export': '导出',
    'action.save': '保存',
    'action.undo': '撤销',
    'action.redo': '重做',
    'editor.sidebar.text': '文本',
    'editor.sidebar.media': '媒体',
    'editor.sidebar.audio': '音频',
    'editor.sidebar.effects': '特效',
  },
  ko: {
    'nav.landing': '홈',
    'nav.dashboard': '프로젝트',
    'nav.settings': '설정',
    'action.export': '내보내기',
    'action.save': '저장',
    'action.undo': '실행 취소',
    'action.redo': '다시 실행',
    'editor.sidebar.text': '텍스트',
    'editor.sidebar.media': '미디어',
    'editor.sidebar.audio': '오디오',
    'editor.sidebar.effects': '효과',
  },
  pt: {
    'nav.landing': 'Início',
    'nav.dashboard': 'Projetos',
    'nav.settings': 'Configurações',
    'action.export': 'Exportar',
    'action.save': 'Salvar',
    'action.undo': 'Desfazer',
    'action.redo': 'Refazer',
    'editor.sidebar.text': 'Texto',
    'editor.sidebar.media': 'Mídia',
    'editor.sidebar.audio': 'Áudio',
    'editor.sidebar.effects': 'Efeitos',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; name: string }[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'timeframe-language';

const availableLanguages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ko', name: '한국어' },
  { code: 'pt', name: 'Português' },
];

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && translations[stored]) return stored;
    // Check browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (translations[browserLang]) return browserLang;
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export { availableLanguages };
export type { Translation, Translations };