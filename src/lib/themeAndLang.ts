import { AppTheme, SlicerLanguage, InterfaceLanguage } from '../types/index.ts';

export interface ThemeOption {
  id: AppTheme;
  name_pt: string;
  name_en: string;
  desc_pt: string;
  desc_en: string;
  accentColor: string;
  bgHex: string;
  surfaceHex: string;
  borderHex: string;
  tag: string;
  isLight?: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'bambu-dark',
    name_pt: 'Bambu Studio Oficial (Escuro)',
    name_en: 'Bambu Studio Official (Dark)',
    desc_pt: 'Verde Bambu (#00ae42) clássico sobre antracite escuro dos monitores de impressão.',
    desc_en: 'Official Bambu green (#00ae42) over dark anthracite print studio background.',
    accentColor: '#00ae42',
    bgHex: '#080d09',
    surfaceHex: '#101a13',
    borderHex: '#1b2f21',
    tag: 'Bambu Verde',
  },
  {
    id: 'orca-dark',
    name_pt: 'OrcaSlicer Neon (Ciano)',
    name_en: 'OrcaSlicer Neon (Cyan)',
    desc_pt: 'Ciano e turquesa de alta tecnologia (#06b6d4) com excelente contraste em oficina.',
    desc_en: 'High-tech cyan and turquoise (#06b6d4) with crisp workshop contrast.',
    accentColor: '#06b6d4',
    bgHex: '#060b13',
    surfaceHex: '#0e1726',
    borderHex: '#162e4a',
    tag: 'Orca Ciano',
  },
  {
    id: 'slate-dark',
    name_pt: 'PrintMaster Pro (Azul Técnico)',
    name_en: 'PrintMaster Pro (Technical Blue)',
    desc_pt: 'Azul cobalto (#3b82f6) e ardósia escuro industrial padrão CAD/CAM.',
    desc_en: 'Cobalt blue (#3b82f6) and industrial dark slate CAD/CAM style.',
    accentColor: '#3b82f6',
    bgHex: '#020617',
    surfaceHex: '#0f172a',
    borderHex: '#1e293b',
    tag: 'Azul Pro',
  },
  {
    id: 'studio-light',
    name_pt: 'Bambu Studio Claro (Dia / Oficina)',
    name_en: 'Bambu Studio Light (Day / Workshop)',
    desc_pt: 'Interface clara com máxima legibilidade para ambientes com iluminação direta.',
    desc_en: 'Clean light interface with high readability for direct-lit workshop benches.',
    accentColor: '#00ae42',
    bgHex: '#f8fafc',
    surfaceHex: '#ffffff',
    borderHex: '#e2e8f0',
    tag: 'Claro Oficial',
    isLight: true,
  },
  {
    id: 'high-contrast',
    name_pt: 'Industrial Alto Contraste (Amarelo / Preto)',
    name_en: 'Industrial High Contrast (Yellow / Black)',
    desc_pt: 'Preto puro com acentos em amarelo sinalizador (#eab308) para visualização rápida.',
    desc_en: 'Pure black with caution amber/yellow (#eab308) for quick inspection glance.',
    accentColor: '#eab308',
    bgHex: '#000000',
    surfaceHex: '#0d0d0d',
    borderHex: '#2e2e2e',
    tag: 'Alto Contraste',
  },
];

export interface SlicerLangOption {
  id: SlicerLanguage;
  name_pt: string;
  name_en: string;
  badge: string;
  desc_pt: string;
  desc_en: string;
  example_pt: string;
  example_en: string;
}

export const SLICER_LANG_OPTIONS: SlicerLangOption[] = [
  {
    id: 'pt',
    name_pt: 'Português (Bambu Studio PT-BR)',
    name_en: 'Portuguese (Bambu Studio PT-BR)',
    badge: 'PT-BR',
    desc_pt: 'Exibe os nomes e menus exatamente como aparecem no seu Bambu Studio traduzido para o Português.',
    desc_en: 'Displays parameter names and menus exactly as translated in Bambu Studio in Portuguese.',
    example_pt: 'Altura da camada, Linhas de parede, Suporte em árvore',
    example_en: 'Secondary EN tags preserved for reference',
  },
  {
    id: 'en',
    name_pt: 'Inglês (Bambu Studio Global EN)',
    name_en: 'English (Bambu Studio Global EN)',
    badge: 'EN-US',
    desc_pt: 'Prioriza os termos originais em inglês da documentação oficial e fóruns internacionais.',
    desc_en: 'Prioritizes original English terminology from official docs and international forums.',
    example_pt: 'Layer height, Wall loops, Tree support',
    example_en: 'Tradução em PT mantida como apoio',
  },
  {
    id: 'bilingual',
    name_pt: 'Bilíngue Simultâneo (PT + EN)',
    name_en: 'Bilingual Simultaneous (PT + EN)',
    badge: 'PT + EN',
    desc_pt: 'Exibe ambos lado a lado simultaneamente. Ideal para quem usa o fatiador em PT mas estuda tutoriais em inglês!',
    desc_en: 'Displays both side-by-side simultaneously. Perfect for bilingual slicer cross-referencing!',
    example_pt: 'Linhas de parede (Wall loops) • Preenchimento (Infill)',
    example_en: 'Both terms displayed with equal priority',
  },
];

/**
 * Extracts pure Portuguese and English names from parameter name fields.
 * Frequently in bundled data, name_pt has "Layer height / Altura da camada"
 * or "Wall loops / Linhas de parede".
 */
export function parseSlicerParamNames(name_pt: string, name_en: string): { pt: string; en: string } {
  let purePt = name_pt || '';
  let pureEn = name_en || '';

  if (purePt.includes('/')) {
    const parts = purePt.split('/').map(p => p.trim());
    if (parts.length === 2) {
      // First is usually English, second is Portuguese
      const firstPart = parts[0];
      const secondPart = parts[1];
      pureEn = pureEn || firstPart;
      purePt = secondPart || firstPart;
    }
  }

  // Clean trailing parentheses if duplicate
  return {
    pt: purePt.trim(),
    en: pureEn.trim(),
  };
}

/**
 * Returns formatted parameter title and secondary subtitle according to active SlicerLanguage.
 */
export function getFormattedSlicerParam(
  param: { name_pt: string; name_en?: string; config_key?: string | null },
  slicerLang: SlicerLanguage
): {
  primaryTitle: string;
  secondaryTitle: string;
  configKey?: string | null;
  ptLabel: string;
  enLabel: string;
} {
  const { pt, en } = parseSlicerParamNames(param.name_pt, param.name_en || '');

  if (slicerLang === 'pt') {
    return {
      primaryTitle: pt || en,
      secondaryTitle: en && en !== pt ? `EN: ${en}` : '',
      configKey: param.config_key,
      ptLabel: pt,
      enLabel: en,
    };
  }

  if (slicerLang === 'en') {
    return {
      primaryTitle: en || pt,
      secondaryTitle: pt && pt !== en ? `PT: ${pt}` : '',
      configKey: param.config_key,
      ptLabel: pt,
      enLabel: en,
    };
  }

  // Bilingual
  return {
    primaryTitle: pt !== en ? `${pt} (${en})` : pt,
    secondaryTitle: `PT: ${pt} | EN: ${en}`,
    configKey: param.config_key,
    ptLabel: pt,
    enLabel: en,
  };
}

/**
 * Simple bilingual dictionary for app UI elements
 */
export const UI_STRINGS = {
  pt: {
    appTitle: 'PrintMaster 3D',
    appSubtitle: 'Engenharia Aditiva & Slicer',
    theme: 'Tema',
    slicerLanguage: 'Idioma do Fatiador',
    slicerLangShort: 'Fatiador',
    interfaceLanguage: 'Idioma da Interface',
    changeTheme: 'Mudar Tema',
    changeLanguage: 'Mudar Idioma',
    themeAndLangModalTitle: 'Preferências de Idioma & Temas do Fatiador',
    themeAndLangModalDesc: 'Configure o idioma dos parâmetros do seu fatiador (Bambu Studio / OrcaSlicer) e alterne os temas visuais.',
    activePrinter: 'Máquina',
    studioVersion: 'Studio',
    experienceLevel: 'Nível',
    offlineDemo: 'Demo Offline',
    online: 'Online',
    searchPlaceholder: 'Pesquisar falha, termo ou parâmetro (ex: warping, retração)...',
    close: 'Fechar',
    save: 'Salvar Preferências',
    slicerSectionTitle: 'Idioma da Terminologia do Fatiador',
    slicerSectionDesc: 'Como os nomes dos parâmetros devem ser exibidos no Atlas e nas listas técnicas:',
    themeSectionTitle: 'Tema Visual do Sistema',
    themeSectionDesc: 'Escolha a paleta de cores inspirada nos fatiadores e bancadas de manufatura:',
    appLangSectionTitle: 'Idioma Geral da Interface',
    quickPreview: 'Pré-visualização do Parâmetro:',
    appliedNotice: 'Configurações salvas e aplicadas em tempo real.',
  },
  en: {
    appTitle: 'PrintMaster 3D',
    appSubtitle: 'Additive Engineering & Slicer',
    theme: 'Theme',
    slicerLanguage: 'Slicer Language',
    slicerLangShort: 'Slicer Lang',
    interfaceLanguage: 'UI Language',
    changeTheme: 'Change Theme',
    changeLanguage: 'Change Language',
    themeAndLangModalTitle: 'Slicer Language & Visual Theme Settings',
    themeAndLangModalDesc: 'Configure parameter terminology to match your Bambu Studio / OrcaSlicer language and customize the visual theme.',
    activePrinter: 'Printer',
    studioVersion: 'Studio',
    experienceLevel: 'Level',
    offlineDemo: 'Offline Demo',
    online: 'Online',
    searchPlaceholder: 'Search fault, term, or parameter (e.g., warping, retraction)...',
    close: 'Close',
    save: 'Save Preferences',
    slicerSectionTitle: 'Slicer Terminology Language',
    slicerSectionDesc: 'How parameter names are formatted in the Atlas and technical checklists:',
    themeSectionTitle: 'System Visual Theme',
    themeSectionDesc: 'Select a color scheme tailored for slicer environments and workshop setups:',
    appLangSectionTitle: 'General UI Language',
    quickPreview: 'Parameter Quick Preview:',
    appliedNotice: 'Settings saved and applied in real-time.',
  },
};
