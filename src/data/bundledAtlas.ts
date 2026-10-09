import { StudioParameter, FailureType, DiagnosticTest, KBArticle, KnowledgeSource } from '../types/index.ts';

// Bundled knowledge base for offline operation
export const BUNDLED_SOURCES: KnowledgeSource[] = [
  {
    id: "src-origin",
    title: "Sistema FAQ Impressão 3D - documento original, 16 p.",
    kind: "user_pdf",
    url: null,
    authority: "base_conceitual_historica",
    version: "2026-10-08",
    review_status: "original_nao_atualizado"
  },
  {
    id: "src-bambu-readme",
    title: "Bambu Studio - repositório oficial",
    kind: "official_code",
    url: "https://github.com/bambulab/BambuStudio",
    authority: "primary",
    version: "master_nao_fixado",
    review_status: "consultado"
  },
  {
    id: "src-bambu-config",
    title: "Bambu Studio - PrintConfig.cpp",
    kind: "official_code",
    url: "https://github.com/bambulab/BambuStudio/blob/master/src/libslic3r/PrintConfig.cpp",
    authority: "primary",
    version: "master_nao_fixado",
    review_status: "consultado"
  },
  {
    id: "src-bambu-profiles",
    title: "Bambu Lab perfis oficiais no Bambu Studio",
    kind: "official_profile",
    url: "https://github.com/bambulab/BambuStudio/blob/master/resources/profiles/BBL/process/fdm_process_common.json",
    authority: "primary",
    version: "master_nao_fixado",
    review_status: "consultado"
  },
  {
    id: "src-bambu-wiki",
    title: "Bambu Studio Wiki",
    kind: "official_docs",
    url: "https://github.com/bambulab/BambuStudio/wiki",
    authority: "primary",
    version: "varia",
    review_status: "consultado"
  },
  {
    id: "src-ellis",
    title: "Ellis Print Tuning Guide",
    kind: "third_party_technical",
    url: "https://ellis3dp.com/Print-Tuning-Guide/",
    authority: "secondary",
    version: "nao_fixado",
    review_status: "presente_no_pdf"
  }
];

export const BUNDLED_PARAMETERS: StudioParameter[] = [
  {
    id: "param-layer-height",
    name_pt: "Layer height / Altura da camada",
    name_en: "Layer height",
    config_key: "layer_height",
    category: "Quality",
    description: "Resolução vertical e quantidade de camadas; reduzir melhora detalhes em planos inclinados e aumenta o tempo total.",
    unit: "mm",
    control_type: "number",
    menu_path: "Process > Quality > Layer height",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config", "src-bambu-profiles"],
    notes: "Geralmente varia entre 25% e 75% do diâmetro do bico (ex: 0.08mm a 0.28mm em bico 0.4mm)."
  },
  {
    id: "param-initial-layer-height",
    name_pt: "Initial layer height / Altura da primeira camada",
    name_en: "Initial layer height",
    config_key: "initial_layer_print_height",
    category: "Quality",
    description: "Espessura da primeira camada depositada na mesa; afeta diretamente a adesão e compensação de desníveis.",
    unit: "mm",
    control_type: "number",
    menu_path: "Process > Quality > First layer > Initial layer height",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config", "src-bambu-profiles"],
    notes: "Normalmente configurado entre 0.20mm e 0.25mm para garantir boa área de contato."
  },
  {
    id: "param-adaptive-layer-height",
    name_pt: "Adaptive layer height / Altura adaptativa de camada",
    name_en: "Adaptive layer height",
    config_key: "adaptive_layer_height",
    category: "Quality",
    description: "Ajusta dinamicamente a espessura da camada de acordo com a curvatura da superfície.",
    unit: "toggle/tool",
    control_type: "tool_button",
    menu_path: "Top Toolbar > Variable Layer Height icon",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-wiki"],
    notes: "Reduz camadas em topos suaves e aumenta em paredes verticais para economizar tempo sem perder qualidade."
  },
  {
    id: "param-line-width",
    name_pt: "Line width / Largura da linha",
    name_en: "Line width",
    config_key: "line_width",
    category: "Quality",
    description: "Largura padrão dos cordões extrudados; influencia resistência mecânica e precisão de cantos.",
    unit: "mm",
    control_type: "number",
    menu_path: "Process > Quality > Line width",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-outer-wall-line-width",
    name_pt: "Outer wall line width / Largura da parede externa",
    name_en: "Outer wall line width",
    config_key: "outer_wall_line_width",
    category: "Quality",
    description: "Largura das paredes externas visíveis; valores menores preservam detalhes finos.",
    unit: "mm",
    control_type: "number",
    menu_path: "Process > Quality > Line width > Outer wall",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-seam-position",
    name_pt: "Seam position / Posição da costura",
    name_en: "Seam position",
    config_key: "seam_position",
    category: "Quality",
    description: "Estratégia de localização do início e fim de cada perímetro onde o bico inicia a camada.",
    unit: "enum",
    control_type: "select",
    menu_path: "Process > Quality > Seam > Seam position",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"],
    notes: "Opções: Aligned (alinhada), Nearest (mais próxima), Back (traseira), Random (aleatória)."
  },
  {
    id: "param-scarf-seam",
    name_pt: "Scarf seam / Costura chanfrada",
    name_en: "Scarf joint seam",
    config_key: "scarf_joint_seam",
    category: "Quality",
    description: "Transição gradual de fluxo na emenda da parede em formato de cunha, ocultando a costura.",
    unit: "enum/toggle",
    control_type: "select",
    menu_path: "Process > Quality > Seam > Scarf joint seam",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-wiki"],
    notes: "Introduzido no Bambu Studio v1.9. Reduz marcas visíveis de zits em formas circulares."
  },
  {
    id: "param-wall-generator",
    name_pt: "Wall generator / Gerador de paredes (Arachne)",
    name_en: "Wall generator",
    config_key: "wall_generator",
    category: "Quality",
    description: "Algoritmo gerador de perímetros: Classic (largura fixa) ou Arachne (largura dinâmica adaptativa).",
    unit: "enum",
    control_type: "select",
    menu_path: "Process > Quality > Walls > Wall generator",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-elephant-foot-compensation",
    name_pt: "Elephant foot compensation / Compensação de pata de elefante",
    name_en: "Elephant foot compensation",
    config_key: "elefant_foot_compensation",
    category: "Quality",
    description: "Recuo para dentro no contorno da primeira camada para compensar o esmagamento físico contra a mesa.",
    unit: "mm",
    control_type: "number",
    menu_path: "Process > Quality > Precision > Elephant foot compensation",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-wall-loops",
    name_pt: "Wall loops / Perímetros de parede",
    name_en: "Wall loops",
    config_key: "wall_loops",
    category: "Strength",
    description: "Número de cordões que formam a casca externa da peça. Principal parâmetro para rigidez mecânica e tração.",
    unit: "contagem",
    control_type: "integer",
    menu_path: "Process > Strength > Walls > Wall loops",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-sparse-infill-density",
    name_pt: "Sparse infill density / Densidade de preenchimento",
    name_en: "Sparse infill density",
    config_key: "sparse_infill_density",
    category: "Strength",
    description: "Porcentagem volumétrica de material no interior da peça. Impacta massa, tempo e sustentação de tetos.",
    unit: "%",
    control_type: "percentage",
    menu_path: "Process > Strength > Infill > Sparse infill density",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-sparse-infill-pattern",
    name_pt: "Sparse infill pattern / Padrão de preenchimento",
    name_en: "Sparse infill pattern",
    config_key: "sparse_infill_pattern",
    category: "Strength",
    description: "Geometria tridimensional do núcleo (Gyroid, Grid, Honeycomb, Tri-Hexagonal, Cross Hatch).",
    unit: "enum",
    control_type: "select",
    menu_path: "Process > Strength > Infill > Sparse infill pattern",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-initial-layer-speed",
    name_pt: "Initial layer speed / Velocidade da primeira camada",
    name_en: "Initial layer speed",
    config_key: "initial_layer_speed",
    category: "Speed",
    description: "Velocidade na primeira camada. Valores baixos permitem que o filamento assente e cole firmemente na mesa.",
    unit: "mm/s",
    control_type: "number",
    menu_path: "Process > Speed > First layer > Initial layer speed",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-outer-wall-speed",
    name_pt: "Outer wall speed / Velocidade da parede externa",
    name_en: "Outer wall speed",
    config_key: "outer_wall_speed",
    category: "Speed",
    description: "Velocidade da camada mais externa visível. Reduzir minimiza vibração e ghosting/ringing.",
    unit: "mm/s",
    control_type: "number",
    menu_path: "Process > Speed > Other layers > Outer wall",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-enable-support",
    name_pt: "Enable support / Ativar suporte",
    name_en: "Enable support",
    config_key: "enable_support",
    category: "Support",
    description: "Ativa a geração automática de estruturas de apoio para saliências e pontes.",
    unit: "boolean",
    control_type: "checkbox",
    menu_path: "Process > Support > Enable support",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-support-type",
    name_pt: "Support type / Tipo de suporte (Tree vs Normal)",
    name_en: "Support type",
    config_key: "support_type",
    category: "Support",
    description: "Estrutura do suporte: Normal (colunar tradicional) ou Tree (suporte em árvore / orgânico).",
    unit: "enum",
    control_type: "select",
    menu_path: "Process > Support > Type",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-support-top-z-distance",
    name_pt: "Support top Z distance / Distância vertical Z do suporte",
    name_en: "Top Z distance",
    config_key: "support_top_z_distance",
    category: "Support",
    description: "Folga de ar entre o topo do suporte e a peça. Define a facilidade de remoção versus acabamento.",
    unit: "mm",
    control_type: "number",
    menu_path: "Process > Support > Distance > Top Z distance",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-brim-type",
    name_pt: "Brim type / Tipo de aba (Brim)",
    name_en: "Brim type",
    config_key: "brim_type",
    category: "Others",
    description: "Aba externa adicionada na base da peça para aumentar a área de adesão e combater empenamento (warping).",
    unit: "enum",
    control_type: "select",
    menu_path: "Process > Others > Bed adhesion > Brim type",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "low",
    source_ids: ["src-bambu-config"]
  },
  {
    id: "param-flow-ratio",
    name_pt: "Flow ratio / Multiplicador de fluxo",
    name_en: "Flow ratio",
    config_key: "flow_ratio",
    category: "Filament",
    description: "Multiplicador de vazão do filamento no extrusor. Calibrado para garantir dimensões exatas e topos selados sem sobre-extrusão.",
    unit: "fator",
    control_type: "number",
    menu_path: "Filament > Settings > Flow ratio",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "medium",
    source_ids: ["src-bambu-config", "src-ellis"]
  },
  {
    id: "param-max-volumetric-speed",
    name_pt: "Max volumetric speed / Vazão volumétrica máxima",
    name_en: "Max volumetric speed",
    config_key: "filament_max_volumetric_speed",
    category: "Filament",
    description: "Teto físico de material fundido por segundo que o hotend consegue empurrar sem subextrusão ou perda de temperatura.",
    unit: "mm³/s",
    control_type: "number",
    menu_path: "Filament > Settings > Max volumetric speed",
    menu_path_validated: true,
    slicer_version: "v01.09+",
    compatible_printers: ["A1", "A1 mini", "P1S", "X1 Carbon"],
    compatibility_status: "verified",
    parameter_status: "active",
    risk_level: "medium",
    source_ids: ["src-bambu-config", "src-bambu-wiki"]
  }
];

/**
 * Creates an in-memory binary STL buffer representing a standard 20x20x20mm Calibration Cube.
 * Fully bundled, 12 triangles, watertight, 100% offline.
 */
export function generateSampleCubeStl(): ArrayBuffer {
  // 12 triangles * 50 bytes + 84 bytes header = 684 bytes
  const buffer = new ArrayBuffer(84 + 12 * 50);
  const view = new DataView(buffer);

  // 80 bytes header
  const header = "PrintMaster 3D - Cubo de Calibracao 20mm (Demonstracao Offline)";
  for (let i = 0; i < header.length; i++) {
    view.setUint8(i, header.charCodeAt(i));
  }
  // Triangle count = 12
  view.setUint32(80, 12, true);

  const s = 20.0; // 20mm cube

  // 8 vertices of cube centered at origin in XY and resting on Z=0
  // v0: (-10, -10, 0), v1: (10, -10, 0), v2: (10, 10, 0), v3: (-10, 10, 0)
  // v4: (-10, -10, 20), v5: (10, -10, 20), v6: (10, 10, 20), v7: (-10, 10, 20)
  const vertices = [
    [-10, -10, 0], [10, -10, 0], [10, 10, 0], [-10, 10, 0],
    [-10, -10, s], [10, -10, s], [10, 10, s], [-10, 10, s],
  ];

  // 12 triangles (2 per face): [normal, [vA, vB, vC]]
  const faces = [
    // Bottom (z=0)
    [0, 0, -1, 0, 2, 1], [0, 0, -1, 0, 3, 2],
    // Top (z=s)
    [0, 0, 1, 4, 5, 6], [0, 0, 1, 4, 6, 7],
    // Front (y=-10)
    [0, -1, 0, 0, 1, 5], [0, -1, 0, 0, 5, 4],
    // Right (x=10)
    [1, 0, 0, 1, 2, 6], [1, 0, 0, 1, 6, 5],
    // Back (y=10)
    [0, 1, 0, 2, 3, 7], [0, 1, 0, 2, 7, 6],
    // Left (x=-10)
    [-1, 0, 0, 3, 0, 4], [-1, 0, 0, 3, 4, 7],
  ];

  let offset = 84;
  for (const f of faces) {
    const nx = f[0], ny = f[1], nz = f[2];
    const vA = vertices[f[3]], vB = vertices[f[4]], vC = vertices[f[5]];

    // normal
    view.setFloat32(offset, nx, true);
    view.setFloat32(offset + 4, ny, true);
    view.setFloat32(offset + 8, nz, true);
    // vertex 1
    view.setFloat32(offset + 12, vA[0], true);
    view.setFloat32(offset + 16, vA[1], true);
    view.setFloat32(offset + 20, vA[2], true);
    // vertex 2
    view.setFloat32(offset + 24, vB[0], true);
    view.setFloat32(offset + 28, vB[1], true);
    view.setFloat32(offset + 32, vB[2], true);
    // vertex 3
    view.setFloat32(offset + 36, vC[0], true);
    view.setFloat32(offset + 40, vC[1], true);
    view.setFloat32(offset + 44, vC[2], true);
    // attribute byte count
    view.setUint16(offset + 48, 0, true);

    offset += 50;
  }

  return buffer;
}

/**
 * Creates an in-memory binary STL buffer representing an Overhang Test Wedge (45° & 60° incline).
 */
export function generateSampleOverhangStl(): ArrayBuffer {
  // Prism geometry: 10 triangles * 50 + 84 = 584 bytes
  const buffer = new ArrayBuffer(84 + 10 * 50);
  const view = new DataView(buffer);

  const header = "PrintMaster 3D - Wedge Overhang 45 Deg Demo";
  for (let i = 0; i < header.length; i++) {
    view.setUint8(i, header.charCodeAt(i));
  }
  view.setUint32(80, 10, true);

  // Wedge: Base 30x20mm, Height 30mm, 45 degree incline
  const verts = [
    [0, 0, 0], [30, 0, 0], [30, 20, 0], [0, 20, 0], // Base
    [0, 0, 30], [0, 20, 30] // Top ridge
  ];

  const triangles = [
    // Bottom
    [0, 0, -1, verts[0], verts[2], verts[1]],
    [0, 0, -1, verts[0], verts[3], verts[2]],
    // Back vertical
    [-1, 0, 0, verts[0], verts[4], verts[5]],
    [-1, 0, 0, verts[0], verts[5], verts[3]],
    // Sloped overhang face (45 deg)
    [0.707, 0, 0.707, verts[1], verts[2], verts[5]],
    [0.707, 0, 0.707, verts[1], verts[5], verts[4]],
    // Side 1
    [0, -1, 0, verts[0], verts[1], verts[4]],
    // Side 2
    [0, 1, 0, verts[3], verts[5], verts[2]],
  ];

  let offset = 84;
  for (const tri of triangles) {
    const norm = [tri[0], tri[1], tri[2]] as number[];
    const v1 = tri[3] as number[], v2 = tri[4] as number[], v3 = tri[5] as number[];

    view.setFloat32(offset, norm[0], true);
    view.setFloat32(offset + 4, norm[1], true);
    view.setFloat32(offset + 8, norm[2], true);
    view.setFloat32(offset + 12, v1[0], true);
    view.setFloat32(offset + 16, v1[1], true);
    view.setFloat32(offset + 20, v1[2], true);
    view.setFloat32(offset + 24, v2[0], true);
    view.setFloat32(offset + 28, v2[1], true);
    view.setFloat32(offset + 32, v2[2], true);
    view.setFloat32(offset + 36, v3[0], true);
    view.setFloat32(offset + 40, v3[1], true);
    view.setFloat32(offset + 44, v3[2], true);
    view.setUint16(offset + 48, 0, true);
    offset += 50;
  }

  return buffer;
}

/**
 * Creates an in-memory binary STL buffer representing a defective mesh:
 * Contains missing faces (open edges / unjoined boundary) and an inverted triangle
 * to demonstrate and validate the Three.js Mesh Health Report.
 */
export function generateSampleDefectiveStl(): ArrayBuffer {
  const s = 20.0;
  const vertices = [
    [-10, -10, 0], [10, -10, 0], [10, 10, 0], [-10, 10, 0],
    [-10, -10, s], [10, -10, s], [10, 10, s], [-10, 10, s],
  ];

  // 10 triangles (omitted faces create open edges / unjoined boundary; inverted winding on face)
  const faces = [
    // Bottom
    [0, 0, -1, 0, 2, 1], [0, 0, -1, 0, 3, 2],
    // Top (omitted 1 triangle to create open boundary edges)
    [0, 0, 1, 4, 5, 6],
    // Front
    [0, -1, 0, 0, 1, 5], [0, -1, 0, 0, 5, 4],
    // Right (inverted normal winding on one triangle)
    [1, 0, 0, 1, 6, 2], // Inverted winding
    [1, 0, 0, 1, 6, 5],
    // Back
    [0, 1, 0, 2, 3, 7], [0, 1, 0, 2, 7, 6],
    // Left
    [-1, 0, 0, 3, 0, 4],
  ];

  const buffer = new ArrayBuffer(84 + faces.length * 50);
  const view = new DataView(buffer);

  const header = "PrintMaster 3D - Defective Mesh Demo (Open Edges & Inverted)";
  for (let i = 0; i < header.length; i++) {
    view.setUint8(i, header.charCodeAt(i));
  }
  view.setUint32(80, faces.length, true);

  let offset = 84;
  for (const f of faces) {
    const nx = f[0], ny = f[1], nz = f[2];
    const vA = vertices[f[3]], vB = vertices[f[4]], vC = vertices[f[5]];

    view.setFloat32(offset, nx, true);
    view.setFloat32(offset + 4, ny, true);
    view.setFloat32(offset + 8, nz, true);

    view.setFloat32(offset + 12, vA[0], true);
    view.setFloat32(offset + 16, vA[1], true);
    view.setFloat32(offset + 20, vA[2], true);

    view.setFloat32(offset + 24, vB[0], true);
    view.setFloat32(offset + 28, vB[1], true);
    view.setFloat32(offset + 32, vB[2], true);

    view.setFloat32(offset + 36, vC[0], true);
    view.setFloat32(offset + 40, vC[1], true);
    view.setFloat32(offset + 44, vC[2], true);

    view.setUint16(offset + 48, 0, true);
    offset += 50;
  }

  return buffer;
}
