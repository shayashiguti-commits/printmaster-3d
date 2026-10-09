import {
  InfillPatternV3,
  PrinterSpecV3,
  FilamentCatalogItemV3,
  PrinterFilamentCompatibilityV3,
  FilamentHardwareRuleV3,
  TargetedFaqV3
} from '../types/index.ts';

// ==========================================
// 1. 22 Padrões de Preenchimento (Infill Patterns)
// ==========================================
export const INFILL_PATTERNS_V3: InfillPatternV3[] = [
  {
    id: "infill-concentric",
    config_value: "concentric",
    label_en: "Concentric",
    label_pt: "Concêntrico",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "baixo",
    relative_material_use: "economia_variavel",
    purpose: "geometria/flexibilidade",
    technical_note: "Acompanha contornos; pode ajudar em geometrias flexíveis, mas suporte ao topo varia.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-zig-zag",
    config_value: "zig-zag",
    label_en: "Rectilinear",
    label_pt: "Retilíneo",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "baixo",
    relative_material_use: "boa",
    purpose: "rapidez/economia",
    technical_note: "Padrão retilíneo alterna sentido entre camadas; evita cruzamento de trajetórias na mesma camada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-grid",
    config_value: "grid",
    label_en: "Grid",
    label_pt: "Grade",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "alto",
    relative_material_use: "boa",
    purpose: "uso_geral_com_cautela",
    technical_note: "Duas direções na mesma camada formam cruzamentos; acúmulo local pode causar raspagem e perda de aderência.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-line",
    config_value: "line",
    label_en: "Line",
    label_pt: "Linha",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "baixo",
    relative_material_use: "boa",
    purpose: "rascunhos",
    technical_note: "Linhas simples; avaliar sustentação do topo.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-cubic",
    config_value: "cubic",
    label_en: "Cubic",
    label_pt: "Cúbico",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "alto",
    relative_material_use: "intermediaria",
    purpose: "pecas_funcionais_3d",
    technical_note: "Estrutura 3D, mas trilhas se cruzam na mesma camada; risco de colisão não nulo.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-triangles",
    config_value: "triangles",
    label_en: "Triangles",
    label_pt: "Triângulos",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "alto",
    relative_material_use: "intermediaria",
    purpose: "rigidez_plano",
    technical_note: "Trajetórias se cruzam na mesma camada; risco de acúmulo em interseções.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-tri-hexagon",
    config_value: "tri-hexagon",
    label_en: "Tri-hexagon",
    label_pt: "Tri-hexágono",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "alto",
    relative_material_use: "intermediaria",
    purpose: "rigidez_plano",
    technical_note: "Geometria de tramas em múltipla direção; conferir as interseções na prévia.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-gyroid",
    config_value: "gyroid",
    label_en: "Gyroid",
    label_pt: "Giroide",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "baixo",
    relative_material_use: "boa",
    purpose: "uso_geral/resistencia_multidirecional",
    technical_note: "Trajetória ondulada tridimensional sem autocruzamento na mesma camada; não garante ausência de contato por empenamento.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-honeycomb",
    config_value: "honeycomb",
    label_en: "Honeycomb",
    label_pt: "Colmeia",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "custo_maior_frequente",
    purpose: "rigidez_plano",
    technical_note: "Colmeia 2D com volume/tempo variáveis e possível custo maior que retilíneo.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-adaptivecubic",
    config_value: "adaptivecubic",
    label_en: "Adaptive Cubic",
    label_pt: "Cúbico adaptativo",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "alto",
    relative_material_use: "muito_boa_em_pecas_grandes",
    purpose: "economia_pecas_grandes",
    technical_note: "Varia densidade por proximidade da parede; pode usar menos material em modelos volumosos, mas contém cruzamentos.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-alignedrectilinear",
    config_value: "alignedrectilinear",
    label_en: "Aligned Rectilinear",
    label_pt: "Retilíneo alinhado",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "baixo",
    relative_material_use: "boa",
    purpose: "orientacao_direcional",
    technical_note: "Linhas paralelas em camadas sucessivas; pode deixar direcionalidade e dificultar pontes se alinhadas.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-3dhoneycomb",
    config_value: "3dhoneycomb",
    label_en: "3D Honeycomb",
    label_pt: "Colmeia 3D",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "variavel",
    purpose: "estrutura_3d",
    technical_note: "Padrão reconhecido no código do Bambu Studio; trajetória e compatibilidade precisam ser inspecionadas no Preview da versão selecionada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "verified_name_behavior_unreviewed"
  },
  {
    id: "infill-hilbertcurve",
    config_value: "hilbertcurve",
    label_en: "Hilbert Curve",
    label_pt: "Curva de Hilbert",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "variavel",
    purpose: "textura/uso_especial",
    technical_note: "Padrão reconhecido no código do Bambu Studio; trajetória e compatibilidade precisam ser inspecionadas no Preview da versão selecionada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "verified_name_behavior_unreviewed"
  },
  {
    id: "infill-archimedeanchords",
    config_value: "archimedeanchords",
    label_en: "Archimedean Chords",
    label_pt: "Cordas de Arquimedes",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "variavel",
    purpose: "uso_especial",
    technical_note: "Padrão reconhecido no código do Bambu Studio; trajetória e compatibilidade precisam ser inspecionadas no Preview da versão selecionada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "verified_name_behavior_unreviewed"
  },
  {
    id: "infill-octagramspiral",
    config_value: "octagramspiral",
    label_en: "Octagram Spiral",
    label_pt: "Espiral octograma",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "variavel",
    purpose: "uso_especial",
    technical_note: "Padrão reconhecido no código do Bambu Studio; trajetória e compatibilidade precisam ser inspecionadas no Preview da versão selecionada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "verified_name_behavior_unreviewed"
  },
  {
    id: "infill-supportcubic",
    config_value: "supportcubic",
    label_en: "Support Cubic",
    label_pt: "Cúbico de sustentação",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "muito_boa",
    purpose: "sustentacao_topo_nao_estrutural",
    technical_note: "Concentra sustentação próxima aos topos; não é projetado para reforço estrutural.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-lightning",
    config_value: "lightning",
    label_en: "Lightning",
    label_pt: "Raio",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "baixo",
    relative_material_use: "excelente",
    purpose: "decoracao_nao_estrutural",
    technical_note: "Ramificações sustentam topo com pouquíssimo material; não serve como preenchimento de resistência.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
      "https://help.prusa3d.com/article/infill-patterns_177130"
    ],
    review_status: "verified_name_qualitative_use_needs_print_test"
  },
  {
    id: "infill-crosshatch",
    config_value: "crosshatch",
    label_en: "Cross Hatch",
    label_pt: "Hachura cruzada",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "variavel",
    purpose: "equilibrio_3d",
    technical_note: "Padrão reconhecido no código do Bambu Studio; trajetória e compatibilidade precisam ser inspecionadas no Preview da versão selecionada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "verified_name_behavior_unreviewed"
  },
  {
    id: "infill-zigzag",
    config_value: "zigzag",
    label_en: "Zig Zag",
    label_pt: "Ziguezague",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "boa",
    purpose: "trajetos_continuos",
    technical_note: "Padrão reconhecido no código do Bambu Studio; trajetória e compatibilidade precisam ser inspecionadas no Preview da versão selecionada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "verified_name_behavior_unreviewed"
  },
  {
    id: "infill-crosszag",
    config_value: "crosszag",
    label_en: "Cross Zag",
    label_pt: "Ziguezague cruzado",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "variavel",
    purpose: "dependente_versao",
    technical_note: "Padrão reconhecido no código do Bambu Studio; trajetória e compatibilidade precisam ser inspecionadas no Preview da versão selecionada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "verified_name_behavior_unreviewed"
  },
  {
    id: "infill-lockedzag",
    config_value: "lockedzag",
    label_en: "Locked Zag",
    label_pt: "Ziguezague travado",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "variavel",
    purpose: "dependente_versao",
    technical_note: "Padrão reconhecido no código do Bambu Studio; trajetória e compatibilidade precisam ser inspecionadas no Preview da versão selecionada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "verified_name_behavior_unreviewed"
  },
  {
    id: "infill-2dlattice",
    config_value: "2dlattice",
    label_en: "2D Lattice",
    label_pt: "Treliça 2D",
    slicer_key: "sparse_infill_pattern",
    collision_risk_same_layer: "avaliar_preview",
    relative_material_use: "variavel",
    purpose: "dependente_versao",
    technical_note: "Padrão reconhecido no código do Bambu Studio; trajetória e compatibilidade precisam ser inspecionadas no Preview da versão selecionada.",
    strength_is_absolute_rank: false,
    availability: "verificar_versao_perfil",
    source_urls: [
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "verified_name_behavior_unreviewed"
  }
];

// ==========================================
// 2. 10 Especificações de Impressoras (Hardware Real)
// ==========================================
export const PRINTER_SPECS_V3: PrinterSpecV3[] = [
  {
    id: "printer-bambu-a1-mini",
    brand: "Bambu Lab",
    model: "A1 mini",
    build_volume_mm: [180, 180, 180],
    max_hotend_C: 300,
    max_bed_C: 80,
    chamber_type: "aberta",
    has_active_chamber: false,
    default_nozzle_material: "aco_inoxidavel",
    filament_diameter_mm: 1.75,
    remarks: [
      "Valores máximos de hardware NÃO equivalem a temperaturas recomendadas para filamentos.",
      "A disponibilidade de perfis depende da versão do Bambu Studio e do firmware."
    ],
    source_urls: ["https://us.store.bambulab.com/products/a1-mini"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  },
  {
    id: "printer-bambu-a1",
    brand: "Bambu Lab",
    model: "A1",
    build_volume_mm: [256, 256, 256],
    max_hotend_C: 300,
    max_bed_C: 100,
    chamber_type: "aberta",
    has_active_chamber: false,
    default_nozzle_material: "aco_inoxidavel",
    filament_diameter_mm: 1.75,
    remarks: [
      "Valores máximos de hardware NÃO equivalem a temperaturas recomendadas para filamentos.",
      "A disponibilidade de perfis depende da versão do Bambu Studio e do firmware."
    ],
    source_urls: ["https://bambulab.com/pl/a1/tech-specs"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  },
  {
    id: "printer-bambu-a2l",
    brand: "Bambu Lab",
    model: "A2L",
    build_volume_mm: [330, 320, 325],
    max_hotend_C: 300,
    max_bed_C: 80,
    chamber_type: "aberta",
    has_active_chamber: false,
    default_nozzle_material: "confirmar_hotend",
    filament_diameter_mm: 1.75,
    remarks: [
      "Valores máximos de hardware NÃO equivalem a temperaturas recomendadas para filamentos.",
      "A disponibilidade de perfis depende da versão do Bambu Studio e do firmware.",
      "A2L é voltada para PLA/PETG. Não homologada para polímeros de engenharia (ABS, ASA, PC, PA)."
    ],
    source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  },
  {
    id: "printer-bambu-p1p",
    brand: "Bambu Lab",
    model: "P1P",
    build_volume_mm: [256, 256, 256],
    max_hotend_C: 300,
    max_bed_C: 100,
    chamber_type: "aberta",
    has_active_chamber: false,
    default_nozzle_material: "aco_inoxidavel",
    filament_diameter_mm: 1.75,
    remarks: [
      "Valores máximos de hardware NÃO equivalem a temperaturas recomendadas para filamentos.",
      "A disponibilidade de perfis depende da versão do Bambu Studio e do firmware."
    ],
    source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  },
  {
    id: "printer-bambu-p1s",
    brand: "Bambu Lab",
    model: "P1S",
    build_volume_mm: [256, 256, 256],
    max_hotend_C: 300,
    max_bed_C: 100,
    chamber_type: "fechada_passiva",
    has_active_chamber: false,
    default_nozzle_material: "aco_inoxidavel",
    filament_diameter_mm: 1.75,
    remarks: [
      "Valores máximos de hardware NÃO equivalem a temperaturas recomendadas para filamentos.",
      "A disponibilidade de perfis depende da versão do Bambu Studio e do firmware.",
      "Para filamentos com fibra de carbono (CF), exige upgrade para bico de aço endurecido."
    ],
    source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  },
  {
    id: "printer-bambu-p2s",
    brand: "Bambu Lab",
    model: "P2S",
    build_volume_mm: [256, 256, 256],
    max_hotend_C: 300,
    max_bed_C: 110,
    chamber_type: "fechada",
    has_active_chamber: false,
    default_nozzle_material: "aco_endurecido",
    filament_diameter_mm: 1.75,
    remarks: [
      "Valores máximos de hardware NÃO equivalem a temperaturas recomendadas para filamentos.",
      "A disponibilidade de perfis depende da versão do Bambu Studio e do firmware."
    ],
    source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  },
  {
    id: "printer-bambu-x1-carbon",
    brand: "Bambu Lab",
    model: "X1 Carbon",
    build_volume_mm: [256, 256, 256],
    max_hotend_C: 300,
    max_bed_C: 110,
    chamber_type: "fechada_passiva",
    has_active_chamber: false,
    default_nozzle_material: "aco_endurecido",
    filament_diameter_mm: 1.75,
    remarks: [
      "Valores máximos de hardware NÃO equivalem a temperaturas recomendadas para filamentos.",
      "A disponibilidade de perfis depende da versão do Bambu Studio e do firmware."
    ],
    source_urls: ["https://us.store.bambulab.com/products/x1-carbon"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  },
  {
    id: "printer-bambu-x1e",
    brand: "Bambu Lab",
    model: "X1E",
    build_volume_mm: [256, 256, 256],
    max_hotend_C: 320,
    max_bed_C: 110,
    chamber_type: "aquecida_ativa_ate_60c",
    has_active_chamber: true,
    default_nozzle_material: "aco_endurecido",
    filament_diameter_mm: 1.75,
    remarks: [
      "Valores máximos de hardware NÃO equivalem a temperaturas recomendadas para filamentos.",
      "Câmara com aquecimento ativo até 60 °C para materiais de grau industrial."
    ],
    source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  },
  {
    id: "printer-bambu-h2s",
    brand: "Bambu Lab",
    model: "H2S",
    build_volume_mm: [340, 320, 340],
    max_hotend_C: 350,
    max_bed_C: null,
    chamber_type: "aquecida_ativa_ate_65c",
    has_active_chamber: true,
    default_nozzle_material: "confirmar_hotend",
    filament_diameter_mm: 1.75,
    remarks: [
      "Valores máximos de hardware NÃO equivalem a temperaturas recomendadas para filamentos.",
      "Câmara ativa até 65 °C e bico até 350 °C."
    ],
    source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  },
  {
    id: "printer-bambu-h2d",
    brand: "Bambu Lab",
    model: "H2D",
    build_volume_mm: null,
    max_hotend_C: 350,
    max_bed_C: 120,
    chamber_type: "fechada_ativa",
    has_active_chamber: true,
    default_nozzle_material: "aco_endurecido",
    filament_diameter_mm: 1.75,
    remarks: [
      "Dupla extrusão: PET-CF, PPA-CF e PPS-CF são destinados ao hotend ESQUERDO; TPU flexível ao DIREITO.",
      "Restrições confirmadas para bico de 0.2mm nos filamentos reforçados."
    ],
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    validation: "official_model_reference_with_unspecified_fields_as_null"
  }
];

// ==========================================
// 3. 21 Filamentos & Faixas de Referência
// ==========================================
export const FILAMENT_CATALOG_V3: FilamentCatalogItemV3[] = [
  {
    id: "material-pla",
    name: "PLA",
    family: "PLA",
    properties_use: "facilidade, detalhes e decoração",
    example_nozzle_temperature_C: [190, 240],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "recomendado ou conforme bobina",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-pla-silk",
    name: "PLA Silk",
    family: "PLA Silk",
    properties_use: "brilho acetinado; atenção a umidade e adesão intercamada",
    example_nozzle_temperature_C: null,
    example_scope: null,
    example_temperature_source_url: null,
    drying_guidance: "recomendado",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-petg",
    name: "PETG",
    family: "PETG",
    properties_use: "tenacidade, uso geral; maior tendência a stringing",
    example_nozzle_temperature_C: null,
    example_scope: null,
    example_temperature_source_url: null,
    drying_guidance: "recomendado",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-petg-hf",
    name: "PETG HF",
    family: "PETG",
    properties_use: "PETG de alto fluxo para alta velocidade; requer secagem prévia",
    example_nozzle_temperature_C: [230, 260],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "obrigatório no manual H2D",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-tpu-95a",
    name: "TPU 95A",
    family: "TPU",
    properties_use: "flexível elástico; alimentação direta externa recomendada",
    example_nozzle_temperature_C: null,
    example_scope: null,
    example_temperature_source_url: null,
    drying_guidance: "obrigatório ou recomendado",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-tpu-90a",
    name: "TPU 90A",
    family: "TPU",
    properties_use: "flexível macio; entrada externa no modelo aplicável",
    example_nozzle_temperature_C: [200, 250],
    example_scope: "Manual P2S, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf",
    drying_guidance: "obrigatório ou recomendado",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://us.store.bambulab.com/products/tpu-85a-tpu-90a/"]
  },
  {
    id: "material-tpu-85a",
    name: "TPU 85A",
    family: "TPU",
    properties_use: "muito flexível; apenas em modelos confirmados com extrusor direto",
    example_nozzle_temperature_C: null,
    example_scope: null,
    example_temperature_source_url: null,
    drying_guidance: "obrigatório",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://us.store.bambulab.com/products/tpu-85a-tpu-90a/"]
  },
  {
    id: "material-tpu-for-ams",
    name: "TPU for AMS",
    family: "TPU for AMS",
    properties_use: "formulação modificada de alta rigidez para transitar no AMS; não confundir com TPU 95A",
    example_nozzle_temperature_C: null,
    example_scope: null,
    example_temperature_source_url: null,
    drying_guidance: "conforme fabricante",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://us.store.bambulab.com/products/ams-2-pro"]
  },
  {
    id: "material-abs",
    name: "ABS",
    family: "ABS",
    properties_use: "térmico e funcional; exige controle de correntes de ar e câmara",
    example_nozzle_temperature_C: [240, 280],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "recomendado",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-asa",
    name: "ASA",
    family: "ASA",
    properties_use: "exterior, intempéries e UV; controlar emissão de vapores",
    example_nozzle_temperature_C: [240, 280],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "recomendado",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-pc",
    name: "PC",
    family: "PC",
    properties_use: "alta resistência térmica e impacto; depende de câmara fechada",
    example_nozzle_temperature_C: [260, 290],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "obrigatório",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-pa",
    name: "PA",
    family: "PA",
    properties_use: "resistência mecânica e atrito; altíssima absorção de umidade",
    example_nozzle_temperature_C: null,
    example_scope: null,
    example_temperature_source_url: null,
    drying_guidance: "obrigatório",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-pla-cf",
    name: "PLA-CF",
    family: "PLA",
    properties_use: "acabamento mate sem linhas visíveis, alta rigidez; abrasivo",
    example_nozzle_temperature_C: [210, 240],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "recomendado",
    abrasive: true,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-petg-cf",
    name: "PETG-CF",
    family: "PETG",
    properties_use: "rigidez e acabamento técnico; abrasivo",
    example_nozzle_temperature_C: [240, 270],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "recomendado",
    abrasive: true,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-paht-cf",
    name: "PAHT-CF",
    family: "PAHT",
    properties_use: "engenharia estrutural e térmica; altamente abrasivo e higroscópico",
    example_nozzle_temperature_C: [260, 300],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "obrigatório",
    abrasive: true,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-pet-cf",
    name: "PET-CF",
    family: "PET",
    properties_use: "engenharia com estabilidade dimensional e térmica; abrasivo",
    example_nozzle_temperature_C: [260, 300],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "obrigatório",
    abrasive: true,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-ppa-cf",
    name: "PPA-CF",
    family: "PPA",
    properties_use: "engenharia para alta temperatura (>150°C contínuo); abrasivo",
    example_nozzle_temperature_C: [285, 320],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "obrigatório",
    abrasive: true,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-pps-cf",
    name: "PPS-CF",
    family: "PPS",
    properties_use: "engenharia extrema (química, óleo e chama); abrasivo",
    example_nozzle_temperature_C: [310, 340],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "obrigatório",
    abrasive: true,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-pva",
    name: "PVA",
    family: "PVA",
    properties_use: "suporte solúvel em água para geometrias complexas; higroscópico",
    example_nozzle_temperature_C: [190, 240],
    example_scope: "Manual H2D, não universal",
    example_temperature_source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    drying_guidance: "obrigatório",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-bvoh",
    name: "BVOH",
    family: "BVOH",
    properties_use: "suporte solúvel de dissolução rápida; verificar armazenagem vedada",
    example_nozzle_temperature_C: null,
    example_scope: null,
    example_temperature_source_url: null,
    drying_guidance: "obrigatório",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  },
  {
    id: "material-pet",
    name: "PET",
    family: "PET",
    properties_use: "material técnico sem modificadores glicólicos; depende de formulação exata",
    example_nozzle_temperature_C: null,
    example_scope: null,
    example_temperature_source_url: null,
    drying_guidance: "ver fabricante",
    abrasive: false,
    machine_profile_required: true,
    brand_sku_specific_parameters_required: true,
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"]
  }
];

// ==========================================
// 4. Regras Proibitivas de Hardware
// ==========================================
export const FILAMENT_HARDWARE_RULES_V3: FilamentHardwareRuleV3[] = [
  {
    id: "filament-ams-generic-tpu",
    effect: "block",
    condition: {
      feed_system: ["AMS", "AMS lite", "AMS 2 Pro"],
      filament_keys: ["TPU 95A", "TPU 90A", "TPU 85A"]
    },
    message: "Não usar TPU flexível convencional neste alimentador; verifique via externa ou bypass aprovado.",
    source_url: "https://us.store.bambulab.com/products/ams-2-pro"
  },
  {
    id: "filament-ams-for-ams-only",
    effect: "conditional",
    condition: {
      feed_system: ["AMS 2 Pro"],
      filament_keys: ["TPU for AMS"]
    },
    message: "Somente formulação específica 'TPU for AMS'; verificar marca e configuração.",
    source_url: "https://us.store.bambulab.com/products/ams-2-pro"
  },
  {
    id: "filament-abrasive-nozzle",
    effect: "block",
    condition: {
      nozzle_material: ["stainless", "aco_inoxidavel"],
      filament_keys: ["PLA-CF", "PETG-CF", "PAHT-CF", "PET-CF", "PPA-CF", "PPS-CF"]
    },
    message: "Não recomendar sem trocar para bico resistente ao desgaste (Aço Endurecido) e validar o conjunto de extrusão.",
    source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"
  },
  {
    id: "filament-diameter-02",
    effect: "block",
    condition: {
      nozzle_diameter_mm: [0.2],
      filament_keys: ["PLA-CF", "PETG-CF", "PAHT-CF", "PET-CF", "PPA-CF", "PPS-CF", "PVA"]
    },
    message: "Restrições confirmadas para bico de 0.2mm nos filamentos reforçados e PVA; risco iminente de entupimento por fibras.",
    source_url: "https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf",
    applies_printers: ["H2D", "P2S", "X1 Carbon", "P1S", "A1"]
  },
  {
    id: "a2l-engineering",
    effect: "block",
    condition: {
      printer: ["A2L"],
      filament_keys: ["ABS", "ASA", "PC", "PA", "PAHT-CF", "PPA-CF", "PPS-CF"]
    },
    message: "A2L não é a escolha indicada pelo fabricante para polímeros de engenharia; não indicar somente por 300°C no bico.",
    source_url: "https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"
  }
];

// Helper to filter and evaluate filaments for a given printer with fail-closed logic
export function getFilteredFilamentsForPrinter(
  modelName: string,
  options?: {
    nozzleMaterial?: string;
    feedSystem?: string;
    nozzleDiameter?: number;
    explicitSearch?: boolean;
  }
): {
  printer: string;
  mustSelectKnownPrinter: boolean;
  items: Array<PrinterFilamentCompatibilityV3 & { effective_status: 'ideal' | 'conditional' | 'not_recommended' | 'blocked' | 'unknown'; block_reason?: string }>;
} {
  const normModel = modelName.trim();
  const candidates = ALL_PRINTER_COMPATIBILITIES.filter(
    r => r.printer_model.toLowerCase() === normModel.toLowerCase()
  );

  if (!candidates.length) {
    return { printer: modelName, mustSelectKnownPrinter: true, items: [] };
  }

  const result: Array<PrinterFilamentCompatibilityV3 & { effective_status: 'ideal' | 'conditional' | 'not_recommended' | 'blocked' | 'unknown'; block_reason?: string }> = [];

  for (const r of candidates) {
    // Fail-closed rule: unknown items are hidden in standard mode
    if (r.status === 'unknown' && !options?.explicitSearch) {
      continue;
    }

    let effectiveStatus: 'ideal' | 'conditional' | 'not_recommended' | 'blocked' | 'unknown' = r.status;
    let blockReason: string | undefined;

    // Check hardware prohibitive rules
    for (const rule of FILAMENT_HARDWARE_RULES_V3) {
      if (rule.applies_printers && !rule.applies_printers.some(p => p.toLowerCase() === normModel.toLowerCase())) {
        continue;
      }
      const cond = rule.condition;
      if (!cond.filament_keys.includes(r.filament_key)) {
        continue;
      }

      if (cond.printer && cond.printer.some(p => p.toLowerCase() === normModel.toLowerCase())) {
        effectiveStatus = 'blocked';
        blockReason = rule.message;
        break;
      }

      if (options?.nozzleMaterial && cond.nozzle_material && cond.nozzle_material.includes(options.nozzleMaterial)) {
        effectiveStatus = 'blocked';
        blockReason = rule.message;
        break;
      }

      if (options?.feedSystem && cond.feed_system && cond.feed_system.includes(options.feedSystem)) {
        effectiveStatus = 'blocked';
        blockReason = rule.message;
        break;
      }

      if (options?.nozzleDiameter && cond.nozzle_diameter_mm && cond.nozzle_diameter_mm.includes(options.nozzleDiameter)) {
        effectiveStatus = 'blocked';
        blockReason = rule.message;
        break;
      }
    }

    result.push({
      ...r,
      effective_status: effectiveStatus,
      block_reason: blockReason,
    });
  }

  return { printer: modelName, mustSelectKnownPrinter: false, items: result };
}

// 210 Relações Impressora x Filamento
export const ALL_PRINTER_COMPATIBILITIES: PrinterFilamentCompatibilityV3[] = [
  // A1 mini
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PETG", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PVA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "TPU 90A", status: "conditional", requirements: ["Alimentação externa adequada; não suportado via AMS lite"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/tpu-85a-tpu-90a/"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "ABS", status: "not_recommended", requirements: ["Câmara aberta: sem controle térmico de gradiente"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "ASA", status: "not_recommended", requirements: ["Câmara aberta: empenamento garantido"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PC", status: "not_recommended", requirements: ["Câmara aberta"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PA", status: "not_recommended", requirements: ["Câmara aberta e higroscopia"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PET", status: "not_recommended", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PLA-CF", status: "not_recommended", requirements: ["Bico de fábrica inox não resistente a abrasivos"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PETG-CF", status: "not_recommended", requirements: ["Bico de fábrica inox"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PAHT-CF", status: "not_recommended", requirements: ["Câmara aberta + bico inox"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PET-CF", status: "not_recommended", requirements: ["Câmara aberta + abrasivo"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PPA-CF", status: "not_recommended", requirements: ["Alta temperatura e abrasivo"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PPS-CF", status: "not_recommended", requirements: ["Alta temperatura e abrasivo"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "TPU 85A", status: "not_recommended", requirements: ["Dureza excessivamente baixa para o alimentador"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/tpu-85a-tpu-90a/"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "TPU for AMS", status: "not_recommended", requirements: ["AMS lite incompatível"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "BVOH", status: "not_recommended", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PLA Silk", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "PETG HF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },
  { printer_id: "printer-bambu-a1-mini", printer_model: "A1 mini", filament_key: "TPU 95A", status: "unknown", requirements: ["Verificar se o produto suporta entrada direta"], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/a1-mini"] },

  // A1
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PETG", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PVA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "TPU 90A", status: "conditional", requirements: ["Alimentação externa; não passar pelo AMS lite"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/tpu-85a-tpu-90a/"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "ABS", status: "not_recommended", requirements: ["Câmara aberta"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "ASA", status: "not_recommended", requirements: ["Câmara aberta"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PC", status: "not_recommended", requirements: ["Câmara aberta"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PA", status: "not_recommended", requirements: ["Câmara aberta"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PET", status: "not_recommended", requirements: [], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PLA-CF", status: "not_recommended", requirements: ["Bico inox"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PETG-CF", status: "not_recommended", requirements: ["Bico inox"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PAHT-CF", status: "not_recommended", requirements: ["Câmara aberta + bico inox"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PET-CF", status: "not_recommended", requirements: ["Câmara aberta + abrasivo"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PPA-CF", status: "not_recommended", requirements: ["Alta temperatura"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PPS-CF", status: "not_recommended", requirements: ["Alta temperatura"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "TPU 85A", status: "not_recommended", requirements: ["Muito flexível para o sistema"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/tpu-85a-tpu-90a/"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "TPU for AMS", status: "not_recommended", requirements: ["Incompatível com AMS lite"], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "BVOH", status: "not_recommended", requirements: [], review_status: "official", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PLA Silk", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "PETG HF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },
  { printer_id: "printer-bambu-a1", printer_model: "A1", filament_key: "TPU 95A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://bambulab.com/pl/a1/tech-specs"] },

  // A2L
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PETG", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "ABS", status: "not_recommended", requirements: ["A2L é aberta e focada em peças criativas; fabricante desaconselha polímeros de engenharia."], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "ASA", status: "not_recommended", requirements: ["Desaconselhado pelo fabricante"], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PC", status: "not_recommended", requirements: ["Desaconselhado pelo fabricante"], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PA", status: "not_recommended", requirements: ["Desaconselhado pelo fabricante"], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PLA-CF", status: "not_recommended", requirements: ["Desaconselhado sem hotend resistente validado"], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PETG-CF", status: "not_recommended", requirements: ["Desaconselhado"], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PAHT-CF", status: "not_recommended", requirements: ["Desaconselhado"], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PET-CF", status: "not_recommended", requirements: ["Desaconselhado"], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PPA-CF", status: "not_recommended", requirements: ["Desaconselhado"], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PPS-CF", status: "not_recommended", requirements: ["Desaconselhado"], review_status: "official", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PLA Silk", status: "unknown", requirements: ["Sem validação individual específica"], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PETG HF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "TPU 95A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "TPU 90A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "TPU 85A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "TPU for AMS", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PVA", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "BVOH", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },
  { printer_id: "printer-bambu-a2l", printer_model: "A2L", filament_key: "PET", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"] },

  // P1P
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PETG", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PVA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PET", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "ABS", status: "conditional", requirements: ["Carenagem/câmara fechada necessária segundo nota oficial de compatibilidade."], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "ASA", status: "conditional", requirements: ["Carenagem/câmara fechada necessária"], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PA", status: "conditional", requirements: ["Carenagem fechada necessária"], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PC", status: "conditional", requirements: ["Carenagem fechada necessária"], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PLA-CF", status: "not_recommended", requirements: ["Bico inox de fábrica"], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PETG-CF", status: "not_recommended", requirements: ["Bico inox de fábrica"], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PAHT-CF", status: "not_recommended", requirements: ["Bico inox + aberta"], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PET-CF", status: "not_recommended", requirements: ["Bico inox"], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PPA-CF", status: "not_recommended", requirements: ["Alta temperatura"], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PPS-CF", status: "not_recommended", requirements: ["Alta temperatura"], review_status: "official", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PLA Silk", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "PETG HF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "TPU 95A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "TPU 90A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "TPU 85A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "TPU for AMS", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },
  { printer_id: "printer-bambu-p1p", printer_model: "P1P", filament_key: "BVOH", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://public-cdn.bambulab.com/store/bambulab-P1P-tech-specs.pdf"] },

  // P1S
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PETG", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PVA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PET", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "ABS", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "ASA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PA", status: "conditional", requirements: ["Manter carretel dessecado"], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PC", status: "conditional", requirements: ["Pré-aquecimento passivo da câmara"], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PLA-CF", status: "conditional", requirements: ["Exigir bico resistente ao desgaste (aço endurecido); inox de fábrica sofre abrasão severa."], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PETG-CF", status: "conditional", requirements: ["Exigir bico resistente ao desgaste"], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PAHT-CF", status: "conditional", requirements: ["Exigir bico resistente ao desgaste"], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PPA-CF", status: "conditional", requirements: ["Exigir bico resistente ao desgaste"], review_status: "official", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PET-CF", status: "unknown", requirements: ["Exigir bico resistente ao desgaste"], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PPS-CF", status: "unknown", requirements: ["Exigir bico resistente ao desgaste"], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PLA Silk", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "PETG HF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "TPU 95A", status: "unknown", requirements: ["Alimentação externa se não for TPU for AMS"], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "TPU 90A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "TPU 85A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "TPU for AMS", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },
  { printer_id: "printer-bambu-p1s", printer_model: "P1S", filament_key: "BVOH", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"] },

  // P2S
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PETG HF", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "ABS", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "ASA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PC", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PVA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "TPU 90A", status: "conditional", requirements: ["Manual P2S restringe bico 0.2mm; AMS HT somente em modo específico"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PLA-CF", status: "conditional", requirements: ["Bico endurecido padrão da P2S suporta"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PETG-CF", status: "conditional", requirements: ["Bico endurecido padrão da P2S suporta"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PETG", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "TPU 95A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "TPU 85A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "TPU for AMS", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PET", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PA", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PAHT-CF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PET-CF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PPA-CF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PPS-CF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "BVOH", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },
  { printer_id: "printer-bambu-p2s", printer_model: "P2S", filament_key: "PLA Silk", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"] },

  // X1 Carbon
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PETG", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "ABS", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "ASA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PVA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PET", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PC", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PLA-CF", status: "conditional", requirements: ["Bico endurecido de fábrica suporta"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PETG-CF", status: "conditional", requirements: ["Bico endurecido"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PAHT-CF", status: "conditional", requirements: ["Secagem estrita"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PET-CF", status: "conditional", requirements: ["Secagem estrita"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PPA-CF", status: "conditional", requirements: ["Alta temperatura"], review_status: "official", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PLA Silk", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PETG HF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "TPU 95A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "TPU 90A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "TPU 85A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "TPU for AMS", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "PPS-CF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },
  { printer_id: "printer-bambu-x1-carbon", printer_model: "X1 Carbon", filament_key: "BVOH", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://us.store.bambulab.com/products/x1-carbon"] },

  // X1E
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PETG", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PVA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "BVOH", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "ABS", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "ASA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PC", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PET", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PLA-CF", status: "conditional", requirements: ["Bico endurecido"], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PETG-CF", status: "conditional", requirements: ["Bico endurecido"], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PAHT-CF", status: "conditional", requirements: ["Câmara aquecida ativa recomendada"], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PET-CF", status: "conditional", requirements: ["Câmara aquecida ativa"], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PPA-CF", status: "conditional", requirements: ["Câmara a 60°C e bico a 320°C"], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PPS-CF", status: "conditional", requirements: ["Câmara aquecida ativa"], review_status: "official", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PLA Silk", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "PETG HF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "TPU 95A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "TPU 90A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "TPU 85A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },
  { printer_id: "printer-bambu-x1e", printer_model: "X1E", filament_key: "TPU for AMS", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://cdn1.bambulab.com/x1e/spec/X1E%20Spec%28EN%29.pdf"] },

  // H2S
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PETG", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PVA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "BVOH", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "ABS", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "ASA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PC", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PET", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PLA-CF", status: "conditional", requirements: ["Bico endurecido"], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PETG-CF", status: "conditional", requirements: ["Bico endurecido"], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PAHT-CF", status: "conditional", requirements: ["Câmara aquecida ativa 65°C"], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PET-CF", status: "conditional", requirements: ["Câmara aquecida ativa"], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PPA-CF", status: "conditional", requirements: ["Câmara aquecida ativa"], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PPS-CF", status: "conditional", requirements: ["Câmara aquecida ativa"], review_status: "official", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PLA Silk", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "PETG HF", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "TPU 95A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "TPU 90A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "TPU 85A", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },
  { printer_id: "printer-bambu-h2s", printer_model: "H2S", filament_key: "TPU for AMS", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://blog.bambulab.com/h2s-the-ultimate-single-nozzle-3d-printer-now-bigger-than-ever/"] },

  // H2D
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PLA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PETG HF", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "ABS", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "ASA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PC", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PLA-CF", status: "ideal", requirements: ["Bico endurecido"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PETG-CF", status: "ideal", requirements: ["Bico endurecido"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PAHT-CF", status: "ideal", requirements: ["Bico endurecido"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PET-CF", status: "ideal", requirements: ["Exige hotend ESQUERDO conforme manual H2D"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PPA-CF", status: "ideal", requirements: ["Exige hotend ESQUERDO conforme manual H2D"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PPS-CF", status: "ideal", requirements: ["Exige hotend ESQUERDO conforme manual H2D"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PVA", status: "ideal", requirements: [], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "TPU 95A", status: "conditional", requirements: ["Exige hotend DIREITO e alimentação direta externa se flexível padrão"], review_status: "official", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PLA Silk", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PETG", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "TPU 90A", status: "unknown", requirements: ["Exige hotend DIREITO"], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "TPU 85A", status: "unknown", requirements: ["Exige hotend DIREITO"], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "TPU for AMS", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PET", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "PA", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] },
  { printer_id: "printer-bambu-h2d", printer_model: "H2D", filament_key: "BVOH", status: "unknown", requirements: [], review_status: "not_verified", source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"] }
];

// ==========================================
// 5. Nova Biblioteca de 33 Diagnósticos Específicos (FAQ-V3-001 a FAQ-V3-033)
// ==========================================
export const TARGETED_FAQ_V3: TargetedFaqV3[] = [
  {
    id: "FAQ-V3-001",
    title: "O bico raspa nos cruzamentos do Grid",
    category: "preenchimento_e_colisao",
    tags: ["infill_nozzle_grid", "investigacao", "bambu-studio"],
    infill_pattern: "grid",
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Identificar se o som ocorre durante deposição do preenchimento no mesmo ponto da grade.",
    recommended_action: "Repetir fatia com Gyroid ou Rectilinear e comparar Preview; depois conferir acúmulo por fluxo.",
    validation: "O ruído desapareceu sem afetar a sustentação dos topos.",
    safety: "Interromper se o bico estiver danificando a peça/mesa ou acumulando material no hotend; nunca contornar proteções.",
    source_urls: [
      "https://help.prusa3d.com/article/infill-patterns_177130",
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-002",
    title: "Triângulos produzem estalos do bico",
    category: "preenchimento_e_colisao",
    tags: ["infill_nozzle_triangles", "investigacao", "bambu-studio"],
    infill_pattern: "triangles",
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Conferir se interseções são depositadas na mesma camada gerando picos verticais de material.",
    recommended_action: "Comparar com Rectilinear no Preview; não compensar apenas com Z-hop.",
    validation: "Novas camadas sem interseções altas e sem impacto.",
    safety: "Interromper se houver perda de passos de motor.",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-003",
    title: "Cubic raspa no meio da peça",
    category: "preenchimento_e_colisao",
    tags: ["infill_nozzle_cubic", "investigacao", "bambu-studio"],
    infill_pattern: "cubic",
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Separar colisão em pontos de cruzamento de empenamento térmico (warping) do modelo.",
    recommended_action: "Examinar preview e comparar Gyroid/Rectilinear; ajustar velocidade somente se necessário.",
    validation: "Extrusão interna regular e ruído resolvido.",
    safety: "Inspecionar se a base da peça continua 100% plana na mesa PEI.",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-004",
    title: "Adaptive Cubic economiza mas derruba suportes",
    category: "preenchimento_e_colisao",
    tags: ["infill_adaptive_support", "investigacao", "bambu-studio"],
    infill_pattern: "adaptivecubic",
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Distinguir colisões nos cruzamentos do infill de suportes finos oscilando com a vibração da máquina.",
    recommended_action: "Trocar para Gyroid para isolar cruzamentos; reforçar diâmetro e base do suporte se o diagnóstico indicar.",
    validation: "Suportes permanecem ancorados durante todo o percurso.",
    safety: "Não tentar segurar suporte com a mão na impressora em movimento.",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-005",
    title: "Gyroid ainda raspa na peça",
    category: "preenchimento_e_colisao",
    tags: ["infill_gyroid_still_scrapes", "investigacao", "bambu-studio"],
    infill_pattern: "gyroid",
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Investigar empenamento (cantos levantados), sobre-extrusão, material molhado (expansão por vapor) ou desajuste mecânico do eixo Z.",
    recommended_action: "Checar altura do raspado e inspecionar trajetórias na prévia; testar uma variável por vez (fluxo -> secagem -> nivelamento).",
    validation: "Sem contato na mesma área e sem marcas novas nas paredes.",
    safety: "Verificar se bico não está entupindo ou riscando a placa PEI.",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-006",
    title: "Z-hop não resolveu a batida",
    category: "preenchimento_e_colisao",
    tags: ["travel_zhop_not_fix", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Determinar se colisão ocorre imprimindo ou durante deslocamento (travel). Z-hop atua APENAS em travel, não durante extrusão ativa.",
    recommended_action: "Inspecionar trajetórias na prévia; se bater enquanto extruda, o problema é sobre-extrusão ou empenamento, não ausência de Z-hop.",
    validation: "Parou colisão no tipo de movimento diagnosticado.",
    safety: "Z-hop excessivo aumenta stringing e tempo de impressão.",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-007",
    title: "Reduce infill retraction piora raspagem",
    category: "preenchimento_e_colisao",
    tags: ["travel_infill_retraction", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Verificar comportamento de retração e de elevação nas viagens por dentro do infill.",
    recommended_action: "Fatiar prévias alternativas com opção ligada/desligada, registrar versão e medir stringing.",
    validation: "Deslocamentos menos arriscados sem stringing inaceitável.",
    safety: "Desativar retração no infill pode deixar caroços em viagens cruzadas.",
    source_urls: ["https://www.reddit.com/r/BambuLab/comments/1cj0en2/psa_grid_infill_is_not_the_problem/"],
    review_status: "community_anecdotal_requires_validation"
  },
  {
    id: "FAQ-V3-008",
    title: "Infill com excesso de extrusão",
    category: "preenchimento_e_colisao",
    tags: ["infill_overextrusion", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Identificar rebarbas e bico tocando linhas internas com topos rugosos.",
    recommended_action: "Checar perfil de filamento, flow ratio, calibração de PA e limite volumétrico, sem alterar tudo junto.",
    validation: "Trilhas internas uniformes e sem raspar.",
    safety: "Sobre-extrusão crônica causa entupimento e acúmulo de crosta no bloco de aquecimento.",
    source_urls: ["https://help.prusa3d.com/article/problems-with-infill_1994"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-009",
    title: "Infill com subextrusão por velocidade",
    category: "preenchimento_e_colisao",
    tags: ["infill_underextrusion", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Conferir lacunas e filamento moído sob demanda de fluxo muito alta no infill.",
    recommended_action: "Reduzir velocidade de infill ou teto volumétrico (Max Volumetric Speed) de acordo com o perfil e testar.",
    validation: "Sem lacunas no preenchimento e sem pulos de engrenagem do extrusor.",
    safety: "Pulos repetidos desgastam engrenagens e mastigam o filamento.",
    source_urls: ["https://help.prusa3d.com/article/problems-with-infill_1994"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-010",
    title: "Topos afundam com Lightning",
    category: "preenchimento_e_colisao",
    tags: ["lightning_top_sags", "investigacao", "bambu-studio"],
    infill_pattern: "lightning",
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar foto da área e captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Conferir área sem sustentação interna e quantidade de camadas superiores (Top Shell Layers).",
    recommended_action: "Trocar para padrão com maior apoio contínuo ao topo (Rectilinear, Gyroid) ou usar camadas superiores adicionais (5 a 6).",
    validation: "Topo fecha sem afundamento (sagging) com peso medido.",
    safety: "Lightning é exclusivo para estética não mecânica.",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-011",
    title: "Lightning em peça que recebe peso",
    category: "preenchimento_e_colisao",
    tags: ["lightning_mechanical_fail", "investigacao", "bambu-studio"],
    infill_pattern: "lightning",
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "Qual tipo de esforço mecânico a peça sofrerá?",
      "Pode enviar foto do uso planejado?"
    ],
    differential_diagnosis: "Confirmar que o preenchimento Lightning NÃO foi destinado a receber carga ou tração mecânica.",
    recommended_action: "Selecionar preenchimento estrutural (Gyroid, Cubic, 3D Honeycomb a 30-40%) e aumentar perímetros para 4-6.",
    validation: "Teste funcional adequado à carga prevista, sem alegar certificação.",
    safety: "Peças sob esforço com Lightning quebram de forma catastrófica.",
    source_urls: ["https://help.prusa3d.com/article/infill_42"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-012",
    title: "Adaptive Cubic cria regiões ocas",
    category: "preenchimento_e_colisao",
    tags: ["adaptive_cubic_voids", "investigacao", "bambu-studio"],
    infill_pattern: "adaptivecubic",
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "O problema ocorre durante extrusão ou no movimento em vazio?",
      "Pode enviar captura de Preview na camada da falha?"
    ],
    differential_diagnosis: "Verificar malha de sustentação local e área de fechamento dos topos.",
    recommended_action: "Comparar Preview por camadas e verificar se o topo tem suporte interno suficiente antes de fechar.",
    validation: "Sem falha no fechamento superior.",
    safety: "Modelos com tetos amplos no centro podem precisar de transição mais densa.",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-013",
    title: "Imprimir 100 por cento com padrão inadequado",
    category: "preenchimento_e_colisao",
    tags: ["infill_100_percent", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual modelo exato da impressora, material, bico instalado e versão do Bambu Studio?",
      "Qual padrão foi selecionado para 100% de infill?",
      "A peça está dilatando ou o bico colide?"
    ],
    differential_diagnosis: "Verificar aviso do fatiador sobre padrão e porcentagem 100%. Padrões 3D como Gyroid ou Grid em 100% geram sobre-extrusão severa.",
    recommended_action: "Usar preenchimento sólido/rectilinear adequado ao perfil (ou aumentar perímetros para 999); conferir fluxo e temperatura.",
    validation: "Sem excesso de material acumulado e peça dimensionalmente correta.",
    safety: "100% de infill em padrões cruzados gera calombos maciços que podem quebrar o bico ou soltar a chapa.",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-014",
    title: "Muito preenchimento, pouca resistência",
    category: "preenchimento_e_colisao",
    tags: ["infill_strength_wrong", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual direção da carga em relação às camadas?",
      "Quantas paredes e qual densidade de infill foram usadas?",
      "Onde a peça quebrou?"
    ],
    differential_diagnosis: "Checar direção da carga, adesão entre camadas e quantidade de paredes. 80% de infill com 2 paredes é menos resistente que 40% de infill com 5 paredes.",
    recommended_action: "Aumentar número de perímetros (paredes) e modificar orientação de impressão antes de elevar o infill indiscriminadamente.",
    validation: "Comparar ensaio funcional na mesma orientação/carga com ganho de rigidez comprovado.",
    safety: "Adesão entre camadas (eixo Z) é o elo mais fraco da impressão FDM.",
    source_urls: ["https://help.prusa3d.com/article/infill_42"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-015",
    title: "Honeycomb demora demais",
    category: "preenchimento_e_colisao",
    tags: ["infill_honeycomb_time", "investigacao", "bambu-studio"],
    infill_pattern: "honeycomb",
    triage_questions: [
      "Qual o objetivo prioritário da peça?",
      "Comparou tempo fatiado com outros padrões?",
      "A impressora vibra muito durante o infill?"
    ],
    differential_diagnosis: "Comparar massa e duração após fatiar, não apenas pela estética geométrica da estrutura.",
    recommended_action: "Testar Rectilinear, Gyroid ou Adaptive Cubic para o objetivo declarado; Honeycomb exige constantes acelerações a cada vértice de 60°.",
    validation: "Tempo e consumo melhoram drasticamente mantendo os requisitos da peça.",
    safety: "Constantes curvas curtas a alta velocidade aumentam desgaste dos rolamentos.",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-016",
    title: "A1 mini: filamento ABS/ASA pedido",
    category: "filamentos_e_compatibilidade",
    tags: ["printer_a1mini_abs", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual a finalidade da peça e o ambiente de operação?",
      "Tem acesso a outra impressora fechada?",
      "O usuário está ciente dos riscos de emissão de estireno e contração térmica?"
    ],
    differential_diagnosis: "Modelo de série A aberta com volume 180mm³; ABS/ASA não são recomendados pelo fabricante.",
    recommended_action: "Bloquear perfil e orientar material alternativo (PETG para resistência ou máquina fechada como P1S/X1C), conforme o objetivo.",
    validation: "Nenhuma temperatura proibida foi prescrita e o usuário foi alertado da física do empenamento.",
    safety: "Impressoras abertas com ABS emitem VOCs e vapores tóxicos de estireno.",
    source_urls: ["https://us.store.bambulab.com/products/a1-mini"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-017",
    title: "A2L: quero imprimir PC ou PA-CF",
    category: "filamentos_e_compatibilidade",
    tags: ["printer_a2l_engineering", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual a peça que deseja fabricar?",
      "Por que a escolha do material de engenharia na A2L?"
    ],
    differential_diagnosis: "Verificar recomendação oficial: a A2L tem foco estrito em PLA/PETG de grande volume e materiais não-engenharia.",
    recommended_action: "Não sugerir apenas com base no limite térmico do hotend (300°C); recomendar máquina fechada e adequada (P1S, X1C, X1E).",
    validation: "Compatibilidade fundamentada em especificação oficial do anúncio A2L.",
    safety: "Peças de 300mm em PC em câmara aberta empenam com forças de centenas de newtons, arrancando a chapa.",
    source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-018",
    title: "P1S: quero usar PLA-CF",
    category: "filamentos_e_compatibilidade",
    tags: ["printer_p1s_cf", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual bico está instalado fisicamente: inox original de fábrica ou aço endurecido?",
      "Já realizou o upgrade de engrenagens do extrusor para aço endurecido?"
    ],
    differential_diagnosis: "Identificar bico instalado: inox de fábrica sofre abrasão em poucas horas de uso com compósitos de fibra de carbono.",
    recommended_action: "Exigir bico resistente ao desgaste (Hardened Steel Nozzle) antes de considerar perfil compatível para impressão contínua.",
    validation: "Configuração final exibe requisito de bico e alerta de abrasividade coerente.",
    safety: "Bico inox desgastado alarga o diâmetro de 0.4mm para 0.6mm+, arruinando a calibração de fluxo.",
    source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-019",
    title: "H2D: PET-CF em bico direito",
    category: "filamentos_e_compatibilidade",
    tags: ["printer_h2d_hotend", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual filamento está alocado em cada extrusor na tela do slicer?",
      "O manual do equipamento foi consultado sobre a divisão dos materiais?"
    ],
    differential_diagnosis: "Manual oficial H2D restringe PET-CF/PPA-CF/PPS-CF obrigatoriamente ao hotend ESQUERDO.",
    recommended_action: "Exibir requisito do hotend esquerdo e caminho de alimentação correto; bloquear tentativa no bico direito.",
    validation: "Hotend confirmado e validado no preview do Bambu Studio.",
    safety: "Alimentar material de alta temperatura no conjunto direito descalibrado pode danificar o mecanismo de nivelamento.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-020",
    title: "TPU 95A na AMS 2 Pro",
    category: "filamentos_e_compatibilidade",
    tags: ["ams_tpu95", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual o nome comercial do carretel de TPU?",
      "É TPU flexível comum ou TPU for AMS com especificação dedicada?"
    ],
    differential_diagnosis: "Verificar se o produto é TPU convencional ou TPU for AMS.",
    recommended_action: "Bloquear TPU 95A convencional no alimentador AMS 2 Pro e instruir alimentação externa adequada pelo suporte traseiro.",
    validation: "Sem carregamentos ou atolamentos por rota indevida nos tubos PTFE.",
    safety: "TPU convencional estica nos tubos de PTFE do AMS e trava os motores de alimentação, exigindo desmontagem.",
    source_urls: ["https://us.store.bambulab.com/products/ams-2-pro"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-021",
    title: "TPU for AMS confundido com TPU 90A",
    category: "filamentos_e_compatibilidade",
    tags: ["ams_tpu_special", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual o modelo de TPU exato indicado na embalagem?",
      "Qual alimentador está sendo utilizado?"
    ],
    differential_diagnosis: "Identificar nome comercial e dureza real do carretel. TPU for AMS possui formulação química especial que permite empuxo pelo alimentador.",
    recommended_action: "Separar perfil 'TPU for AMS' de perfis de TPU flexíveis convencionais (85A, 90A, 95A).",
    validation: "Rota de alimentação conforme etiqueta e manual do fabricante.",
    safety: "Não tentar forçar TPU 90A comum em slots do AMS.",
    source_urls: ["https://us.store.bambulab.com/products/ams-2-pro"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-022",
    title: "PLA Silk com muitos fios",
    category: "filamentos_e_compatibilidade",
    tags: ["filament_silk_stringing", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "O filamento foi seco recentemente?",
      "Qual temperatura de bico e retração estão configuradas?",
      "Os fios ocorrem em peças de teste simples?"
    ],
    differential_diagnosis: "Checar umidade, temperatura e retração sem atribuir tudo cegamente à retração. PLA Silk possui elastômeros para dar brilho que absorvem umidade rapidamente.",
    recommended_action: "Testar secagem conforme marca (50°C por 6 horas) e torre de temperatura; reduzir temperatura em 5-10°C se o brilho permitir.",
    validation: "Stringing e brilho comparados antes/depois com redução mensurável de fiapos.",
    safety: "Não exceder temperatura de transição vítrea (Tg) na secadora para não fundir o carretel.",
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-023",
    title: "PETG HF com bolhas e estalos",
    category: "filamentos_e_compatibilidade",
    tags: ["filament_petghf_wet", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Há som de estalo no bico durante a impressão?",
      "A superfície do cordão parece espumosa ou fosca irregular?",
      "Quanto tempo o filamento ficou fora da embalagem selada?"
    ],
    differential_diagnosis: "Verificar umidade do material e temperaturas adequadas ao SKU. O PETG HF é extremamente higroscópico devido aos aditivos de fluidez.",
    recommended_action: "Secar obrigatoriamente a 65°C por 8 horas (conforme manual H2D); conferir perfil de vazão máxima do filamento.",
    validation: "Superfície mais uniforme e sem estalos de vapor durante a extrusão.",
    safety: "Vapor de água superaquecido provoca subextrusão severa e perda de adesão intercamada.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-024",
    title: "PA-CF tritura no extrusor",
    category: "filamentos_e_compatibilidade",
    tags: ["filament_pacf_grinding", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "O filamento foi seco a 80°C por pelo menos 8 a 12 horas?",
      "O bico está na temperatura recomendada (>270°C)?",
      "As engrenagens do extrusor estão limpas de resíduos de nylon?"
    ],
    differential_diagnosis: "Testar secagem, dureza/abrasividade, temperatura insuficiente do bico e contra-pressão de fluxo.",
    recommended_action: "Pausar; conferir hardware, secagem obrigatória e perfil do material específico para garantir fluidez no bloco.",
    validation: "Alimentação contínua e perfil aprovado sem mastigação do filamento.",
    safety: "PA úmido amolece no extrusor ou quebra quebradiço antes do tracionador.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-025",
    title: "Misturar PLA e PPS em H2D",
    category: "filamentos_e_compatibilidade",
    tags: ["multimaterial_temp_mismatch", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual o objetivo de misturar estes dois materiais no mesmo projeto?",
      "Conferiu as temperaturas de fusão de cada polímero?"
    ],
    differential_diagnosis: "Manual oficial H2D restringe combinações de materiais de janelas térmicas brutalmente distintas (PLA ~210°C vs PPS ~330°C).",
    recommended_action: "Bloquear mistura insegura, salvo exceção expressa no manual por material e hardware homologados.",
    validation: "Slicer não propõe combinação térmica não homologada na mesma câmara.",
    safety: "A temperatura de câmara exigida para PPS (65°C+) amolece o PLA completamente dentro da extrusora, entupindo o sistema.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-026",
    title: "Material compatível mas sem perfil Bambu Studio",
    category: "filamentos_e_compatibilidade",
    tags: ["filament_no_profile", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual o modelo exato da impressora, diâmetro do bico e versão do Bambu Studio?",
      "O material é original Bambu Lab ou de fabricante terceiro?"
    ],
    differential_diagnosis: "Verificar se modelo, bico e material têm perfil instalado e homologado nessa versão do fatiador.",
    recommended_action: "Não copiar automaticamente perfil de outra máquina; iniciar pelo perfil genérico do mesmo modelo e realizar rotinas de calibração.",
    validation: "Perfil salvo especificamente para o modelo selecionado com testes de calibração validados.",
    safety: "Transplante cego de parâmetros de outra máquina causa sobreaquecimento ou colisões.",
    source_urls: ["https://github.com/bambulab/BambuStudio/blob/master/resources/profiles/BBL.json"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-027",
    title: "Filamento de terceiro em P2S",
    category: "filamentos_e_compatibilidade",
    tags: ["p2s_third_party", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "O fabricante do filamento disponibiliza preset oficial para Bambu Studio?",
      "Qual o tipo exato de polímero?"
    ],
    differential_diagnosis: "Checar existência de perfil oficial do fabricante do filamento e compatibilidade com a versão do Studio.",
    recommended_action: "Priorizar perfil oficial do fabricante; se não existir, usar perfil genérico correspondente na P2S e realizar calibração de fluxo orientada.",
    validation: "Teste de fluxo e acabamento superficial aprovados no cupom de teste.",
    safety: "Não usar perfis de terceiros com limites volumétricos desconhecidos.",
    source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-028",
    title: "PVA úmido entope AMS",
    category: "filamentos_e_compatibilidade",
    tags: ["pva_wet_ams", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Onde o PVA estava armazenado?",
      "O filamento dobra facilmente ou quebra como vidro?"
    ],
    differential_diagnosis: "Verificar condições de armazenamento e rota de alimentação. PVA úmido fica mole ou grudento e incha dentro do alimentador.",
    recommended_action: "Secar rigorosamente segundo a ficha técnica do produto e nunca inserir PVA úmido no AMS.",
    validation: "Carregamento sem falhas e suportes se dissolvem perfeitamente em água morna.",
    safety: "PVA dissolvido no mecanismo do alimentador exige limpeza química do conjunto.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "official_compatibility_family"
  },
  {
    id: "FAQ-V3-029",
    title: "Filamento novo sem calibração de fluxo",
    category: "filamentos_e_compatibilidade",
    tags: ["new_spool_uncalibrated", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "O filamento foi testado com cupom de calibração?",
      "A impressora possui sensor de calibração dinâmica de fluxo (MicroLiDAR / Eddy) ativo?"
    ],
    differential_diagnosis: "Confirmar máquina, perfil, bico, lote e temperatura do material.",
    recommended_action: "Comparar flow ratio e pressure advance usando teste suportado pelo modelo antes de iniciar impressões longas.",
    validation: "Calombos e lacunas eliminados no cubo de referência calibrado.",
    safety: "Imprimir peças mecânicas sem calibrar fluxo gera tolerâncias folgadas ou travadas.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-030",
    title: "A mesma marca de PETG falha em impressoras diferentes",
    category: "filamentos_e_compatibilidade",
    tags: ["same_filament_different_printers", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Quais os dois modelos de impressora sendo comparados?",
      "Os hotends e tipos de bico são idênticos?",
      "As velocidades de impressão configuradas são iguais?"
    ],
    differential_diagnosis: "Verificar tipo de hotend, capacidade volumétrica, material do bico, placa e velocidades de resfriamento por máquina.",
    recommended_action: "Não reutilizar limites de vazão e temperaturas sem perfis específicos por máquina.",
    validation: "Cada impressora possui perfil próprio versionado e ajustado às suas capacidades térmicas.",
    safety: "O que funciona a 200 mm/s numa CoreXY aquecida pode falhar por subextrusão numa máquina aberta.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-031",
    title: "Seletor mostra filamentos não suportados",
    category: "filamentos_e_compatibilidade",
    tags: ["filter_incompatible_leak", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual modelo de impressora está selecionado no sistema?",
      "O filtro de compatibilidade fail-closed está ativo?"
    ],
    differential_diagnosis: "Confirmar ID do modelo e condições de bico/AMS aplicadas no backend.",
    recommended_action: "Aplicar filtro fail-closed rigoroso; sem modelo selecionado ou para materiais 'unknown', não emitir valores específicos.",
    validation: "Teste automatizado comprova isolamento estrito sem vazamento de materiais incompatíveis.",
    safety: "Prevenir que usuários coloquem configurações de ABS ou Nylon em impressoras abertas sem exaustão.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-032",
    title: "Troquei bico e compatibilidade não atualizou",
    category: "filamentos_e_compatibilidade",
    tags: ["nozzle_upgrade_refresh", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual o diâmetro e material do novo bico instalado?",
      "A troca foi confirmada na tela do dispositivo e no perfil da máquina?"
    ],
    differential_diagnosis: "Coletar material e diâmetro do bico instalados após a troca.",
    recommended_action: "Recalcular recomendações por configuração completa e invalidar o cache da máquina anterior.",
    validation: "Alertas de abrasividade e restrições de diâmetro atualizados coerentemente.",
    safety: "Usar bico de 0.2mm com perfil de 0.4mm causará entupimento e sobrecarga mecânica imediata.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  },
  {
    id: "FAQ-V3-033",
    title: "Tentei usar perfil que excede o limite da mesa",
    category: "filamentos_e_compatibilidade",
    tags: ["temperature_out_of_hardware", "investigacao", "bambu-studio"],
    infill_pattern: null,
    triage_questions: [
      "Qual temperatura de mesa foi solicitada no perfil?",
      "Qual o limite físico de hardware especificado para seu modelo de impressora?"
    ],
    differential_diagnosis: "Conferir limites de hotend e mesa por modelo e voltagem da rede (110V vs 220V).",
    recommended_action: "Bloquear valores superiores ao hardware e sugerir material adequado ao envelope térmico da máquina.",
    validation: "Nenhum valor excede as especificações de segurança do fabricante.",
    safety: "Forçar temperatura acima do limite da placa de aquecimento aciona desligamento de emergência térmico.",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    review_status: "engineering_inference_source_guided_unverified_field_test"
  }
];

// ==========================================
// 6. Matriz Comparativa de Infill (Seção 3.2)
// ==========================================
export interface InfillComparisonGuide {
  goal: string;
  initialRecommendation: string;
  verificationMethod: string;
}

export const INFILL_COMPARISON_GUIDELINES: InfillComparisonGuide[] = [
  {
    goal: "Menor quantidade de plástico, sem carga",
    initialRecommendation: "Lightning; depois Support Cubic ou Rectilinear conforme fechamento de topos",
    verificationMethod: "Comparar gramas no mesmo STL no Preview, mantendo mesmo bico, parede, camada e topos."
  },
  {
    goal: "Menor tempo de fabricação",
    initialRecommendation: "Rectilinear / Line e, em modelos grandes volumosos, Adaptive Cubic",
    verificationMethod: "Comparar minutos fatiados reais, sem confundir velocidades máximas nominais com velocidade média atingida."
  },
  {
    goal: "Resistência multidirecional (Esforço 3D)",
    initialRecommendation: "Gyroid, Cubic e outros padrões 3D, dependendo da direção do esforço mecânico",
    verificationMethod: "Ensaio de carga no mesmo filamento, paredes, orientação de camadas e densidade."
  },
  {
    goal: "Resistência à flexão de suporte mecânico",
    initialRecommendation: "Orientação de camadas no leito + aumento de paredes + geometria",
    verificationMethod: "Modificar orientação no leito e número de perímetros (4-6) antes de supor que 50% de infill resolverá."
  },
  {
    goal: "Bico batendo em linhas cruzadas",
    initialRecommendation: "Gyroid ou Rectilinear (elimina cruzamentos intracamada no mesmo plano Z)",
    verificationMethod: "Trocar apenas o padrão de infill e repetir teste, observando prévia e fotos."
  },
  {
    goal: "Peça grande e oca",
    initialRecommendation: "Adaptive Cubic (para economia com sustentação) ou Lightning (se peça for puramente decorativa)",
    verificationMethod: "Comparar sustentação de topos e análise mecânica do caso."
  }
];

// ==========================================
// 7. Tabela de 5 Indicadores de Colisão Bico x Peça (Seção 2)
// ==========================================
export interface CollisionIndicator {
  indicator: string;
  strongHypothesis: string;
  firstSafeTest: string;
  movementType: 'extrusao' | 'deslocamento_travel' | 'ambos';
}

export const NOZZLE_COLLISION_INDICATORS: CollisionIndicator[] = [
  {
    indicator: "Estalos repetidos nos cruzamentos da grade",
    strongHypothesis: "Grid ou Triangles acumulando material sobreposto na mesma camada",
    firstSafeTest: "Fatiar no Gyroid ou Rectilinear sem alterar o restante; observar Preview por camada.",
    movementType: "extrusao"
  },
  {
    indicator: "Bico pega somente durante viagem (sem extrusão)",
    strongHypothesis: "Trajetória de travel cruzando perímetros, retração insuficiente, falta de Z-hop ou oozing de material quente",
    firstSafeTest: "Inspecionar tipo de movimento e configuração de retração / Z-hop, mantendo perfil original salvo.",
    movementType: "deslocamento_travel"
  },
  {
    indicator: "Bico raspa paredes, topos e preenchimento indiscriminadamente",
    strongHypothesis: "Sobre-extrusão crônica (flow alto), filamento úmido expandindo com vapor ou peça com cantos empenados (warping)",
    firstSafeTest: "Conferir perfil de material, adesão da primeira camada, calibração de fluxo e sinais de empenamento na base.",
    movementType: "ambos"
  },
  {
    indicator: "Só o suporte árvore quebra no meio",
    strongHypothesis: "Galho de suporte fino demais oscilando em alta velocidade, adesão fraca na base ou colisão pontual com ponta levantada",
    firstSafeTest: "Conferir base/brim do suporte, diâmetro mínimo dos galhos, velocidade de suporte e altura exata da quebra.",
    movementType: "ambos"
  },
  {
    indicator: "Acontece com Gyroid também",
    strongHypothesis: "Não é culpa do padrão de infill; investigar deformação térmica, contração, obstruções mecânicas ou fluxo descalibrado",
    firstSafeTest: "Inspecionar deformação do modelo, fluxo, alinhamento dos eixos e movimentos mecânicos.",
    movementType: "ambos"
  }
];

// ==========================================
// 8. QA Test Suite Scenarios (12 Casos de Aceitação do Dossiê)
// ==========================================
export interface QATestScenarioV3 {
  id: string;
  title: string;
  description: string;
  expectedStatus: 'PASS';
  ruleCategory: string;
}

export const QA_ACCEPTANCE_TESTS_V3: QATestScenarioV3[] = [
  { id: "QA-V3-01", title: "Isolamento A1 mini", description: "Ao selecionar A1 mini, o sistema não mostra números ou parâmetros de perfis H2D.", expectedStatus: "PASS", ruleCategory: "isolation" },
  { id: "QA-V3-02", title: "Bico Inox P1S com PLA-CF", description: "P1S com bico inox e PLA-CF: exibe 'requer bico adequado (aço endurecido)' e bloqueia recomendação direta.", expectedStatus: "PASS", ruleCategory: "hardware_constraint" },
  { id: "QA-V3-03", title: "H2D Hotend Direito PPA-CF", description: "H2D com PPA-CF selecionado no hotend direito: bloqueia e explica que requer hotend esquerdo.", expectedStatus: "PASS", ruleCategory: "dual_extruder_mapping" },
  { id: "QA-V3-04", title: "AMS 2 Pro com TPU 95A", description: "AMS 2 Pro com TPU 95A convencional: bloqueia alimentador padrão e instrui alimentação externa.", expectedStatus: "PASS", ruleCategory: "feeder_compatibility" },
  { id: "QA-V3-05", title: "A2L com PC ou Polímeros de Engenharia", description: "A2L + PC: não mostra perfil recomendado; informa limitação física e alternativas seguras.", expectedStatus: "PASS", ruleCategory: "printer_capability" },
  { id: "QA-V3-06", title: "Triagem de Resistência sem Carga Definida", description: "Usuário pergunta 'qual mais resistente?' sem carga/orientação: sistema faz triagem e não cita vencedor universal.", expectedStatus: "PASS", ruleCategory: "objective_triage" },
  { id: "QA-V3-07", title: "Ruído sobre Cruzamento Grid", description: "Grid com ruído sobre cruzamentos: orienta comparar Gyroid/Rectilinear; não atribui de imediato a correias.", expectedStatus: "PASS", ruleCategory: "differential_diagnosis" },
  { id: "QA-V3-08", title: "Gyroid com Ruído Persistente", description: "Gyroid com ruído persistente: continua investigação com fluxo/warping/mecânica; não declara problema impossível.", expectedStatus: "PASS", ruleCategory: "differential_diagnosis" },
  { id: "QA-V3-09", title: "Troca de Bico Invalida Cache", description: "Troca de bico no perfil: invalida perfil cacheado e reaplica regras de abrasividade e diâmetro.", expectedStatus: "PASS", ruleCategory: "cache_invalidation" },
  { id: "QA-V3-10", title: "Modelo Não Reconhecido Fail-Closed", description: "Modelo não reconhecido: apenas explicações conceituais; valores numéricos por impressora permanecem indisponíveis.", expectedStatus: "PASS", ruleCategory: "fail_closed" },
  { id: "QA-V3-11", title: "SKUs Externos Não Cadastrados", description: "Marcas/SKUs externos não cadastrados: exibe compatibilidade 'a verificar'; nunca extrapola por nome genérico.", expectedStatus: "PASS", ruleCategory: "fail_closed" },
  { id: "QA-V3-12", title: "Verificação de Versão de Menu", description: "Antes de responder um menu do Studio, verifica versão; nunca inventa caminhos se a UI divergir.", expectedStatus: "PASS", ruleCategory: "slicer_versioning" }
];

// ==========================================
// 9. 33 Failure Types Novas Adições (F168 a F200)
// ==========================================
export const FAILURE_TYPES_V3_ADDITIONS: any[] = [
  {
    id: "F168",
    technology: "FDM",
    name: "O bico raspa nos cruzamentos do Grid",
    diagnostic_hypotheses: ["Identificar se o som ocorre durante deposicao do preenchimento no mesmo ponto da grade."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: [
      "https://help.prusa3d.com/article/infill-patterns_177130",
      "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp"
    ],
    risk: "normal",
    tags: ["infill_nozzle_grid", "investigacao", "bambu-studio"]
  },
  {
    id: "F169",
    technology: "FDM",
    name: "Triangulos produzem estalos do bico",
    diagnostic_hypotheses: ["Conferir se intersecoes sao depositadas na mesma camada."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    risk: "normal",
    tags: ["infill_nozzle_triangles", "investigacao", "bambu-studio"]
  },
  {
    id: "F170",
    technology: "FDM",
    name: "Cubic raspa no meio da peça",
    diagnostic_hypotheses: ["Separar colisao em pontos de cruzamento de empenamento do modelo."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    risk: "normal",
    tags: ["infill_nozzle_cubic", "investigacao", "bambu-studio"]
  },
  {
    id: "F171",
    technology: "FDM",
    name: "Adaptive Cubic economiza mas derruba suportes",
    diagnostic_hypotheses: ["Distinguir colisoes nos cruzamentos de suportes finos oscilando."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    risk: "normal",
    tags: ["infill_adaptive_support", "investigacao", "bambu-studio"]
  },
  {
    id: "F172",
    technology: "FDM",
    name: "Gyroid ainda raspa na peça",
    diagnostic_hypotheses: ["Investigar empenamento, fluxo, excesso de material, offset, travel e desajuste mecanico."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    risk: "normal",
    tags: ["infill_gyroid_still_scrapes", "investigacao", "bambu-studio"]
  },
  {
    id: "F173",
    technology: "FDM",
    name: "Z-hop nao resolveu a batida",
    diagnostic_hypotheses: ["Determinar se colisao ocorre imprimindo ou durante deslocamento."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    risk: "normal",
    tags: ["travel_zhop_not_fix", "investigacao", "bambu-studio"]
  },
  {
    id: "F174",
    technology: "FDM",
    name: "Reduce infill retraction piora raspagem",
    diagnostic_hypotheses: ["Verificar comportamento de retracao e de elevacao nas viagens por dentro do infill."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://www.reddit.com/r/BambuLab/comments/1cj0en2/psa_grid_infill_is_not_the_problem/"],
    risk: "normal",
    tags: ["travel_infill_retraction", "investigacao", "bambu-studio"]
  },
  {
    id: "F175",
    technology: "FDM",
    name: "Infill com excesso de extrusao",
    diagnostic_hypotheses: ["Identificar rebarbas e bico tocando linhas internas com topos rugosos."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/problems-with-infill_1994"],
    risk: "normal",
    tags: ["infill_overextrusion", "investigacao", "bambu-studio"]
  },
  {
    id: "F176",
    technology: "FDM",
    name: "Infill com subextrusao por velocidade",
    diagnostic_hypotheses: ["Conferir lacunas e filamento moido sob demanda de fluxo alta."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/problems-with-infill_1994"],
    risk: "normal",
    tags: ["infill_underextrusion", "investigacao", "bambu-studio"]
  },
  {
    id: "F177",
    technology: "FDM",
    name: "Topos afundam com Lightning",
    diagnostic_hypotheses: ["Conferir area sem sustentacao interna e quantidade de camadas superiores."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    risk: "normal",
    tags: ["lightning_top_sags", "investigacao", "bambu-studio"]
  },
  {
    id: "F178",
    technology: "FDM",
    name: "Lightning em peça que recebe peso",
    diagnostic_hypotheses: ["Confirmar que o preenchimento Lightning nao foi destinado a receber carga."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill_42"],
    risk: "normal",
    tags: ["lightning_mechanical_fail", "investigacao", "bambu-studio"]
  },
  {
    id: "F179",
    technology: "FDM",
    name: "Adaptive Cubic cria regioes ocas",
    diagnostic_hypotheses: ["Verificar malha de sustentacao local e area de fechamento dos topos."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    risk: "normal",
    tags: ["adaptive_cubic_voids", "investigacao", "bambu-studio"]
  },
  {
    id: "F180",
    technology: "FDM",
    name: "Imprimir 100 por cento com padrao inadequado",
    diagnostic_hypotheses: ["Verificar aviso do fatiador sobre padrao e porcentagem 100%."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    risk: "normal",
    tags: ["infill_100_percent", "investigacao", "bambu-studio"]
  },
  {
    id: "F181",
    technology: "FDM",
    name: "Muito preenchimento, pouca resistencia",
    diagnostic_hypotheses: ["Checar direcao da carga, adesao entre camadas e quantidade de paredes."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill_42"],
    risk: "normal",
    tags: ["infill_strength_wrong", "investigacao", "bambu-studio"]
  },
  {
    id: "F182",
    technology: "FDM",
    name: "Honeycomb demora demais",
    diagnostic_hypotheses: ["Comparar massa e duracao apos fatiar, nao pela aparencia da estrutura."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://help.prusa3d.com/article/infill-patterns_177130"],
    risk: "normal",
    tags: ["infill_honeycomb_time", "investigacao", "bambu-studio"]
  },
  {
    id: "F183",
    technology: "FDM",
    name: "A1 mini: filamento ABS/ASA pedido",
    diagnostic_hypotheses: ["Modelo de serie A aberta; material nao recomendado pelo fabricante."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://us.store.bambulab.com/products/a1-mini"],
    risk: "normal",
    tags: ["printer_a1mini_abs", "investigacao", "bambu-studio"]
  },
  {
    id: "F184",
    technology: "FDM",
    name: "A2L: quero imprimir PC ou PA-CF",
    diagnostic_hypotheses: ["Verificar recomendacao oficial: foco em PLA/PETG e materiais nao-engenharia."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://blog.bambulab.com/bambu-lab-a2l-creative-playground-extra-large/"],
    risk: "normal",
    tags: ["printer_a2l_engineering", "investigacao", "bambu-studio"]
  },
  {
    id: "F185",
    technology: "FDM",
    name: "P1S: quero usar PLA-CF",
    diagnostic_hypotheses: ["Identificar bico instalado: inox de fabrica vs endurecido."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://us.store.bambulab.com/collections/3d-printer/products/p1s"],
    risk: "normal",
    tags: ["printer_p1s_cf", "investigacao", "bambu-studio"]
  },
  {
    id: "F186",
    technology: "FDM",
    name: "H2D: PET-CF em bico direito",
    diagnostic_hypotheses: ["Manual H2D restringe PET-CF/PPA-CF/PPS-CF ao hotend esquerdo."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["printer_h2d_hotend", "investigacao", "bambu-studio"]
  },
  {
    id: "F187",
    technology: "FDM",
    name: "TPU 95A na AMS 2 Pro",
    diagnostic_hypotheses: ["Verificar se o produto e TPU comum ou TPU for AMS."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://us.store.bambulab.com/products/ams-2-pro"],
    risk: "normal",
    tags: ["ams_tpu95", "investigacao", "bambu-studio"]
  },
  {
    id: "F188",
    technology: "FDM",
    name: "TPU for AMS confundido com TPU 90A",
    diagnostic_hypotheses: ["Identificar nome comercial e dureza real do carretel."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://us.store.bambulab.com/products/ams-2-pro"],
    risk: "normal",
    tags: ["ams_tpu_special", "investigacao", "bambu-studio"]
  },
  {
    id: "F189",
    technology: "FDM",
    name: "PLA Silk com muitos fios",
    diagnostic_hypotheses: ["Checar umidade, temperatura e retracao sem atribuir tudo a retração."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://cdn1.bambulab.com/filament/filament-guide/wksdyyzd8n9/filament-guide-en.pdf"],
    risk: "normal",
    tags: ["filament_silk_stringing", "investigacao", "bambu-studio"]
  },
  {
    id: "F190",
    technology: "FDM",
    name: "PETG HF com bolhas e estalos",
    diagnostic_hypotheses: ["Verificar umidade do material e temperaturas adequadas ao SKU."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["filament_petghf_wet", "investigacao", "bambu-studio"]
  },
  {
    id: "F191",
    technology: "FDM",
    name: "PA-CF tritura no extrusor",
    diagnostic_hypotheses: ["Testar secagem, dureza/abrasividade, bico e contra-pressao."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["filament_pacf_grinding", "investigacao", "bambu-studio"]
  },
  {
    id: "F192",
    technology: "FDM",
    name: "Misturar PLA e PPS em H2D",
    diagnostic_hypotheses: ["Manual H2D restringe combinacoes de materiais de janelas termicas distintas."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["multimaterial_temp_mismatch", "investigacao", "bambu-studio"]
  },
  {
    id: "F193",
    technology: "FDM",
    name: "Material compativel mas sem perfil Bambu Studio",
    diagnostic_hypotheses: ["Verificar se modelo, bico e material tem perfil instalado nessa versao."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://github.com/bambulab/BambuStudio/blob/master/resources/profiles/BBL.json"],
    risk: "normal",
    tags: ["filament_no_profile", "investigacao", "bambu-studio"]
  },
  {
    id: "F194",
    technology: "FDM",
    name: "Filamento de terceiro em P2S",
    diagnostic_hypotheses: ["Checar existencia de perfil fabricante e compatibilidade desta versao."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/9425242c00344b0e801b6179f9a243aa.pdf"],
    risk: "normal",
    tags: ["p2s_third_party", "investigacao", "bambu-studio"]
  },
  {
    id: "F195",
    technology: "FDM",
    name: "PVA umido entope AMS",
    diagnostic_hypotheses: ["Verificar condicoes de armazenamento e rota de alimentacao."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["pva_wet_ams", "investigacao", "bambu-studio"]
  },
  {
    id: "F196",
    technology: "FDM",
    name: "Filamento novo sem calibracao de fluxo",
    diagnostic_hypotheses: ["Confirmar maquina, perfil, bico, lote e temperatura."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["new_spool_uncalibrated", "investigacao", "bambu-studio"]
  },
  {
    id: "F197",
    technology: "FDM",
    name: "A mesma marca de PETG falha em impressoras diferentes",
    diagnostic_hypotheses: ["Verificar hotend, bico, placa e velocidades por maquina."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["same_filament_different_printers", "investigacao", "bambu-studio"]
  },
  {
    id: "F198",
    technology: "Seletor mostra filamentos nao suportados",
    name: "Seletor mostra filamentos nao suportados",
    diagnostic_hypotheses: ["Confirmar id do modelo e condicoes de bico/AMS aplicadas ao backend."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["filter_incompatible_leak", "investigacao", "bambu-studio"]
  },
  {
    id: "F199",
    technology: "FDM",
    name: "Troquei bico e compatibilidade nao atualizou",
    diagnostic_hypotheses: ["Coletar material e diametro do bico instalados apos a troca."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["nozzle_upgrade_refresh", "investigacao", "bambu-studio"]
  },
  {
    id: "F200",
    technology: "FDM",
    name: "Tentei usar perfil que excede o limite da mesa",
    diagnostic_hypotheses: ["Conferir limites de hotend e mesa por modelo/voltagem."],
    first_safe_check: "O problema ocorre durante extrusao ou no movimento em vazio?",
    status: "research_guided_not_field_validated",
    source_urls: ["https://csm.bblcdn.com/hub/4668d0ca43994ff3bff4b37f1a65c2e7.pdf"],
    risk: "normal",
    tags: ["temperature_out_of_hardware", "investigacao", "bambu-studio"]
  }
];

// ==========================================
// 10. 33 KB Articles Novas Adições (FAQ-V3-001 a FAQ-V3-033)
// ==========================================
export const KB_ARTICLES_V3_ADDITIONS: any[] = TARGETED_FAQ_V3.map(faq => ({
  id: faq.id,
  title: faq.title,
  body: `${faq.recommended_action}\n\nDiagnóstico diferencial: ${faq.differential_diagnosis}\nValidação: ${faq.validation}\nSegurança: ${faq.safety}`,
  technology: "FDM",
  tags: faq.tags,
  source_ids: ["src-bambu-readme", "src-bambu-printconfig"],
  revision_state: "verified_v3"
}));

