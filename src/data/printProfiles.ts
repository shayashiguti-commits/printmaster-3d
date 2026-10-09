import { FileTypePreset } from '../types/index.ts';

export const PRINT_PROFILES_DATABASE: FileTypePreset[] = [
  {
    id: 'action-figure',
    category: 'figures_art',
    name_pt: 'Action Figures & Miniaturas Detalhadas',
    name_en: 'Action Figures & Detailed Miniatures',
    tag_pt: 'Alta Resolução & Suportes Finos',
    tag_en: 'High Resolution & Tree Supports',
    iconName: 'User',
    shortDesc_pt: 'Otimizado para preservar feições faciais finas, músculos, armaduras e detalhes orgânicos com suportes fáceis de destacar sem cicatrizes.',
    shortDesc_en: 'Optimized for high-detail facial features, muscles, armor and organic models with easy-peel tree supports and no scars.',
    targetModels_pt: ['Action Figures', 'Miniaturas RPG / Warhammer', 'Bustos e Estátuas', 'Colecionáveis Geek', 'Anime Figures'],
    targetModels_en: ['Action Figures', 'Tabletop Miniatures', 'Busts & Statues', 'Geek Collectibles', 'Anime Models'],
    recommendedFileKeywords: ['figure', 'miniatura', 'mini', 'busto', 'bust', 'statue', 'action', 'character', 'toy', 'goku', 'batman', 'marvel', 'hero', 'monstro', 'monster', 'warhammer', 'dnd'],
    recommendedMaterials: ['PLA / PLA+', 'Matte PLA (disfarça linhas de camada)', 'Resina (se impressora SLA)'],
    recommendedNozzle: '0.4mm (ou 0.2mm para miniaturas < 75mm)',
    layerHeight: '0.08mm a 0.12mm (ou Ativar Altura de Camada Adaptativa)',
    initialLayerHeight: '0.16mm ou 0.20mm (garantir adesão)',
    wallLoops: '3 perímetros (espessura 1.2mm)',
    topBottomShells: '5 camadas superiores / 4 inferiores',
    infillDensity: '12% a 15%',
    infillPattern: 'Gyroid (distribuição suave sem cruzamentos barulhentos)',
    outerWallSpeed: '45 mm/s a 60 mm/s (reduzida para eliminar ringing nas faces)',
    innerWallSpeed: '80 mm/s a 100 mm/s',
    supportType: 'Tree (Árvore) / Orgânico',
    supportStyle: 'Tree Slim (Árvore Fina com menor contato na superfície)',
    seamPosition: 'Scarf Joint Seam ou Alinhada na quina traseira / dobras de tecido',
    brimType: 'Mouse-ears ou Brim externo de 5mm para suportes finos não caírem',
    coolingProfile: '100% ventoinha com tempo mínimo de camada de 8 segundos',
    specializedParameters: [
      {
        key: 'adaptive_layer_height',
        name_pt: 'Altura de Camada Adaptativa',
        name_en: 'Adaptive Layer Height',
        value: 'Ativado (Suavização de curvas)',
        slicerPath: 'Barra Superior > Ícone Altura de Camada Adaptativa',
        rationale_pt: 'Aplica camadas finíssimas (0.08mm) em topos de crânios e ombros, mantendo 0.16mm em bases retas para economizar tempo.',
        rationale_en: 'Uses ultra-fine layers on organic domes and heads, while keeping 0.16mm on vertical legs to save print time.',
        highlight: true,
      },
      {
        key: 'tree_support_top_z_distance',
        name_pt: 'Distância Z Superior do Suporte',
        name_en: 'Top Z Distance (Support Interface)',
        value: '0.18mm a 0.20mm',
        slicerPath: 'Processo > Suporte > Avançado > Distância Z Superior',
        rationale_pt: 'Garante que os galhos de suporte se soltem com a mão sem quebrar os dedos ou queixos delicados da figura.',
        rationale_en: 'Ensures support branches snap off cleanly with zero scarring on delicate chin/fingers.',
        highlight: true,
      },
      {
        key: 'scarf_joint_seam',
        name_pt: 'Costura em Bisel (Scarf Joint Seam)',
        name_en: 'Scarf Joint Seam',
        value: 'Contorno e Início de Parede (Bambu v1.9+)',
        slicerPath: 'Processo > Qualidade > Costura > Tipo de Costura',
        rationale_pt: 'Elimina aquele "zíper" ou espinhaço visível nas costas e na pele dos personagens.',
        rationale_en: 'Virtually eliminates visible zipper seam on figure skin and armor curvature.',
      },
      {
        key: 'z_hop_type',
        name_pt: 'Tipo de Salto Z (Z-Hop)',
        name_en: 'Z-Hop Type',
        value: 'Espiral / Normal (0.4mm)',
        slicerPath: 'Configuração da Extrusora > Retração > Salto Z',
        rationale_pt: 'Impede o bico aquecido de colidir com os galhos finos de suporte durante movimentos rápidos de travel.',
        rationale_en: 'Prevents the hot nozzle from knocking over tall, thin tree support branches during travel.',
      }
    ],
    dosAndDonts: {
      recommended_pt: [
        'Incline o modelo entre 15° e 30° para trás: isso joga a maior parte dos suportes para as costas e preserva o rosto 100% limpo.',
        'Use Filamento Matte (Fosco) para disfarçar as linhas horizontais de camada e dar aspecto de resina.',
        'Ative o Slow down for overhangs (Desacelerar em balanços) para não derreter pontas de dedos e queixo.'
      ],
      recommended_en: [
        'Tilt model 15°–30° backwards: this moves most support contact points to the back and keeps face 100% pristine.',
        'Use Matte PLA filament to diffuse light and hide layer lines, yielding a resin-like finish.',
        'Enable Slow Down for Overhangs to avoid curling on fine finger tips and chin.'
      ],
      avoid_pt: [
        'Evite suporte normal em grade: ele envolve a figura inteira e quebra partes finas na remoção.',
        'Não use velocidades de parede externa acima de 100 mm/s em bico 0.4mm em figuras pequenas.',
        'Não coloque a costura Z na face ou peitoral do modelo.'
      ],
      avoid_en: [
        'Avoid grid/normal supports: they encase the figure and snap delicate limbs during post-processing.',
        'Do not run outer wall speeds above 100 mm/s on tiny miniature details.',
        'Never place Z-seam on front face or chest areas.'
      ]
    },
    technicalRationale_pt: 'Miniaturas exigem prioridade absoluta na resolução angular e na ocultação da costura Z. A combinação de camada 0.08–0.12mm com Suporte Árvore Slim transfere a tensão mecânica de desmolde para fora das feições críticas.',
    technicalRationale_en: 'Miniatures require supreme angular resolution and invisible seams. 0.08–0.12mm layers paired with Tree Slim supports protect fine facial anatomy.',
    sampleFileName: 'action_figure_goku_ssj.stl'
  },
  {
    id: 'vase-mode',
    category: 'vases_decor',
    name_pt: 'Vasos & Modo Espiral (Spiralize Outer Contour)',
    name_en: 'Vases & Spiral Mode (Vase Mode)',
    tag_pt: 'Sem Costura Z & Estanque a Líquidos',
    tag_en: 'Seamless Z & Watertight',
    iconName: 'Flower2',
    shortDesc_pt: 'Impressão em linha contínua única em espiral, sem paradas de retração ou costura visível. Otimizado para vasos, cúpulas de luz e recipientes.',
    shortDesc_en: 'Continuous single-strand spiral printing with zero retractions or Z-seams. Perfect for vases, lamp shades and watertight pots.',
    targetModels_pt: ['Vasos de Flores Decorativos', 'Cúpulas e Abajures', 'Porta-Canetas Espiralizados', 'Garfos / Copos de Teste', 'Luminárias'],
    targetModels_en: ['Decorative Flower Vases', 'Lamp Shades & Lanterns', 'Spiral Pencil Cups', 'Aesthetic Pots', 'Light diffusers'],
    recommendedFileKeywords: ['vase', 'vaso', 'jarra', 'planter', 'cachepot', 'lamp', 'shade', 'pot', 'espiral', 'spiral', 'urna'],
    recommendedMaterials: ['PETG (melhor estanqueidade e resistência a água)', 'PLA Translúcido / Silk / Glitter'],
    recommendedNozzle: '0.4mm (configurado para extrusão de 0.6mm) ou bico de 0.6mm/0.8mm',
    layerHeight: '0.20mm a 0.28mm (camadas mais altas colapsam menos em espiral)',
    initialLayerHeight: '0.24mm (para vedação total da base na mesa)',
    wallLoops: '1 (Forçado automaticamente pelo Modo Vaso)',
    topBottomShells: '0 superiores / 5 a 6 camadas sólidas inferiores (Bottom Shells)',
    infillDensity: '0% (Proibido infill em modo vaso)',
    infillPattern: 'Nenhum (0%)',
    outerWallSpeed: '50 mm/s a 70 mm/s uniforme e suave',
    innerWallSpeed: 'N/A (Apenas 1 parede)',
    supportType: 'DESATIVADO (Modo vaso é incompatível com suportes)',
    supportStyle: 'Nenhum',
    seamPosition: 'Nenhuma (A subida do eixo Z é contínua e ininterrupta)',
    brimType: 'Brim externo de 5mm se a base do vaso for estreita',
    coolingProfile: '50% a 70% constante para PETG; 100% para PLA',
    specializedParameters: [
      {
        key: 'spiralize_outer_contour',
        name_pt: 'Espiralizar Contorno Externo (Modo Vaso)',
        name_en: 'Spiralize Outer Contour (Vase Mode)',
        value: 'Marcado / Ativado',
        slicerPath: 'Processo > Outros > Especial > Espiralizar Contorno Externo',
        rationale_pt: 'O bico sobe no eixo Z como uma mola helicoidal contínua, eliminando 100% das retrações e marcas de costura.',
        rationale_en: 'The nozzle ascends smoothly like a continuous helical spring, eliminating all retractions and Z-seam blobs.',
        highlight: true,
      },
      {
        key: 'line_width_outer_wall',
        name_pt: 'Largura de Linha da Parede (Extrusão Alargada)',
        name_en: 'Outer Wall Line Width (Over-extruded)',
        value: '0.60mm a 0.65mm (em bico padrão 0.4mm)',
        slicerPath: 'Processo > Qualidade > Avançado > Largura de Linha',
        rationale_pt: 'Uma parede mais larga aumenta drasticamente a rigidez estrutural do vaso e garante vedação estanque contra vazamento de água.',
        rationale_en: 'Wider extrusion provides high structural rigidity and makes the single-wall print 100% waterproof.',
        highlight: true,
      },
      {
        key: 'bottom_shell_layers',
        name_pt: 'Camadas Sólidas Inferiores (Fundo do Vaso)',
        name_en: 'Bottom Shell Layers',
        value: '5 a 6 camadas (mínimo 1.2mm de espessura)',
        slicerPath: 'Processo > Resistência > Camadas de Parede e Superfície',
        rationale_pt: 'Impede que o peso da água ou terra crie microfraturas no fundo do vaso.',
        rationale_en: 'Prevents the weight of water or soil from puncturing the bottom base.',
        highlight: true,
      },
      {
        key: 'nozzle_temp_boost',
        name_pt: 'Aumento de Temperatura de Extrusão',
        name_en: 'Nozzle Temperature Offset',
        value: '+5°C a +10°C acima da temperatura padrão',
        slicerPath: 'Filamento > Configurações de Temperatura do Bico',
        rationale_pt: 'A maior temperatura melhora a viscosidade do plástico quente e funde a camada anterior perfeitamente, garantindo estanqueidade.',
        rationale_en: 'Higher melt flow ensures flawless layer-to-layer fusion for watertight integrity.',
      }
    ],
    dosAndDonts: {
      recommended_pt: [
        'Use PETG se for colocar água com flores: PETG não é hidrofílico e resiste à pressão de água melhor que PLA.',
        'Aumente a largura de linha para 0.6mm num bico 0.4mm: isso transforma uma parede frágil numa casca resistente.',
        'Certifique-se de que o modelo 3D é um bloco sólido ou oco simples sem fendas internas.'
      ],
      recommended_en: [
        'Use PETG if holding water: PETG creates watertight bonds and resists long-term moisture exposure.',
        'Bump line width to 0.6mm on a 0.4mm nozzle: doubles mechanical strength on a 1-wall print.',
        'Ensure the model geometry is a single continuous outer envelope without internal cavities.'
      ],
      avoid_pt: [
        'NÃO ative suportes: suportes quebram a espiral contínua e cancelam o modo vaso.',
        'Evite modelos com saliências horizontais com inclinação maior que 50°.',
        'Não use velocidade acima de 80 mm/s para não perder viscosidade térmica.'
      ],
      avoid_en: [
        'Do NOT enable supports: supports interrupt the continuous helical Z motion.',
        'Avoid overhangs steeper than 50° because there is only 1 perimeter to hold the molten bead.',
        'Do not print too fast (>80 mm/s) or the extrusion bead will pull away from corners.'
      ]
    },
    technicalRationale_pt: 'O modo vaso transforma a impressora em uma bomba de extrusão contínua. Para vasos funcionais à prova d\'água, a chave de ouro é largura de extrusão alargada (0.6mm) + temperatura de bico +5°C + 5 camadas de fundo.',
    technicalRationale_en: 'Vase mode relies on uninterrupted helical extrusion. For watertight vessels, the golden key is thick line width (0.6mm) + hot nozzle (+5°C) + 5 solid bottom shells.',
    sampleFileName: 'vaso_decorativo_espiral_moderno.stl'
  },
  {
    id: 'mechanical-functional',
    category: 'mechanical',
    name_pt: 'Peças Mecânicas & Suportes Estruturais',
    name_en: 'Mechanical & Structural Load Parts',
    tag_pt: 'Alta Resistência & Carga Isotrópica',
    tag_en: 'High Strength & Isotropic Infill',
    iconName: 'Wrench',
    shortDesc_pt: 'Projetado para suportar esforço mecânico, impacto, torção e fixação por parafusos. Prioriza paredes grossas e preenchimento isotrópico.',
    shortDesc_en: 'Engineered for mechanical load, shear resistance, torque and bolting. Prioritizes dense perimeters and isotropic 3D infill.',
    targetModels_pt: ['Suportes de Prateleira e Motores', 'Engrenagens e Polias', 'Garras e Gabaritos de Oficina', 'Caixas com Insertos de Rosca', 'Braços Articulados de Carga'],
    targetModels_en: ['Motor Mounts & Brackets', 'Gears & Pulleys', 'Workshop Jigs & Clamps', 'Threaded Enclosures', 'Robotic Arm Links'],
    recommendedFileKeywords: ['bracket', 'suporte', 'gear', 'engrenagem', 'mount', 'clamp', 'mecanico', 'mechanical', 'load', 'structural', 'gabarito', 'jig', 'pulley', 'alavanca'],
    recommendedMaterials: ['PETG (tenacidade & atrito)', 'ABS / ASA (alta rigidez térmica)', 'PA-CF (Nylon c/ Fibra de Carbono)'],
    recommendedNozzle: '0.4mm ou 0.6mm endurecido (hardened steel se fibra de carbono)',
    layerHeight: '0.20mm (altura ideal para equilíbrio entre fusão e espessura)',
    initialLayerHeight: '0.20mm',
    wallLoops: '4 a 6 perímetros (espessura de parede 1.6mm a 2.4mm)',
    topBottomShells: '5 superiores / 5 inferiores sólidas',
    infillDensity: '35% a 50%',
    infillPattern: 'Gyroid ou 3D Honeycomb (resistência idêntica em todas as direções)',
    outerWallSpeed: '70 mm/s a 90 mm/s',
    innerWallSpeed: '100 mm/s a 140 mm/s (mais lento favorece fusão entre camadas)',
    supportType: 'Normal ou Tree com distância Z de 0.22mm',
    supportStyle: 'Normal Snug (para superfícies planas estruturais)',
    seamPosition: 'Alinhada em quina morta (longe de furos de parafusos)',
    brimType: 'Brim externo de 5mm para garantir que bases espessas não empinem',
    coolingProfile: 'PETG: 20-40% / ABS: 0-15% (menos ventoinha = maior adesão de camadas)',
    specializedParameters: [
      {
        key: 'wall_loops_vs_infill',
        name_pt: '4 a 6 Linhas de Parede (Prioridade Perímetro)',
        name_en: '4 to 6 Wall Loops (Perimeter Priority)',
        value: '4 a 6 paredes (1.6mm a 2.4mm)',
        slicerPath: 'Processo > Resistência > Camadas de Parede',
        rationale_pt: 'Estudos de engenharia provam que 5 paredes conferem mais rigidez à torção do que 80% de preenchimento interno com 2 paredes.',
        rationale_en: 'FEA testing proves 5 perimeter walls provide far greater bending & torque stiffness than 80% infill with 2 walls.',
        highlight: true,
      },
      {
        key: 'xy_hole_compensation',
        name_pt: 'Compensação de Furos X-Y',
        name_en: 'X-Y Hole Compensation',
        value: '+0.10mm a +0.15mm',
        slicerPath: 'Processo > Qualidade > Precisão > Compensação de Furo X-Y',
        rationale_pt: 'O encolhimento térmico faz furos circulares de parafusos M3, M4 ou M5 fecharem ~0.2mm. Esta compensação corrige sem precisar furadeira.',
        rationale_en: 'Thermal shrinkage makes bolt holes undersized. +0.12mm compensates perfectly for M3/M4/M5 bolts.',
        highlight: true,
      },
      {
        key: 'infill_pattern_isotropic',
        name_pt: 'Padrão Giroide / 3D Honeycomb',
        name_en: 'Gyroid / 3D Honeycomb Infill',
        value: 'Gyroid (35%)',
        slicerPath: 'Processo > Resistência > Preenchimento > Padrão de Preenchimento',
        rationale_pt: 'Não possui planos de fraqueza ortogonais e não gera o "teco-teco" de colisão do bico sobre o plástico já impresso (como o Grid).',
        rationale_en: 'Provides isotropic shear strength with zero self-intersection nozzle dragging noise.',
      }
    ],
    dosAndDonts: {
      recommended_pt: [
        'Oriente a peça deitada de modo que os parafusos tracionem NO PLANO XY, e nunca no eixo Z (a adesão entre camadas é 40% menor que o plástico contínuo).',
        'Aumente a temperatura do bico em +5°C para maximizar a fusão molecular entre camadas.',
        'Use insertos de latão termofixados (heat-set inserts) em vez de atarraxar diretamente no plástico.'
      ],
      recommended_en: [
        'Orient part so mechanical loads act in the XY plane, never shearing along the Z axis layer lines.',
        'Bump nozzle temperature by +5°C to maximize inter-layer molecular diffusion.',
        'Use threaded brass heat-set inserts instead of tapping screws into raw plastic.'
      ],
      avoid_pt: [
        'NUNCA use preenchimento Grid em peças de alta densidade (ele colide o bico e fragiliza em diagonais).',
        'Não use resfriamento excessivo de ventoinha em materiais de engenharia (enfraquece a união entre camadas).',
        'Evite orientar eixos verticais finos em Z que sofram força de flexão lateral.'
      ],
      avoid_en: [
        'NEVER use Grid infill above 20%: crossing lines cause nozzle crashes and create micro-voids.',
        'Avoid high fan speeds on engineering materials (chills the molten bead before fusing).',
        'Never orient thin structural studs vertically in Z where bending will snap layers apart.'
      ]
    },
    technicalRationale_pt: 'A resistência mecânica em FDM é determinada por espessura de casca (paredes), fusão térmica entre camadas e geometria de orientação de carga no leito.',
    technicalRationale_en: 'Mechanical integrity in FDM is dominated by shell thickness (wall loops), thermal layer fusion, and load axis orientation.',
    sampleFileName: 'suporte_motor_nema17_reforcado.stl'
  },
  {
    id: 'articulated-flexi',
    category: 'articulated',
    name_pt: 'Articulados & Print-in-Place (Sem Montagem)',
    name_en: 'Articulated & Print-in-Place (No Assembly)',
    tag_pt: 'Tolerâncias Livres & Zero Suportes',
    tag_en: 'Free Tolerances & Zero Supports',
    iconName: 'Boxes',
    shortDesc_pt: 'Configurado para brinquedos articulados e dobradiças mecânicas impressas já funcionando. Evita fusão involuntária entre elos vizinhos.',
    shortDesc_en: 'Tuned for flexi animals and print-in-place linkages that move straight off the build plate. Prevents link fusion.',
    targetModels_pt: ['Dragões Articulados (Flexi Dragon)', 'Correntes e Dobradiças Print-in-Place', 'Lagartos / Polvos Articulados', 'Caixas com Dobradiça Integrada', 'Robôs Articulados'],
    targetModels_en: ['Flexi Dragons & Animals', 'Print-in-Place Hinges & Chains', 'Flexi Octopus / Geckos', 'Integral Hinge Boxes', 'Articulated Toys'],
    recommendedFileKeywords: ['flexi', 'articulated', 'articulado', 'dragon', 'dragao', 'hinge', 'dobradica', 'print-in-place', 'in-place', 'joint', 'link', 'octopus', 'polvo', 'snake'],
    recommendedMaterials: ['PLA Silk / Tricolor / Dual-color', 'PLA+'],
    recommendedNozzle: '0.4mm',
    layerHeight: '0.16mm (tolerância ideal para elos com folga de 0.3mm)',
    initialLayerHeight: '0.20mm',
    wallLoops: '3 paredes',
    topBottomShells: '4 superiores / 4 inferiores',
    infillDensity: '15% a 20%',
    infillPattern: 'Gyroid',
    outerWallSpeed: '60 mm/s',
    innerWallSpeed: '100 mm/s',
    supportType: 'DESATIVADO TOTALMENTE (Suportes travam as juntas e inutilizam a peça)',
    supportStyle: 'Nenhum',
    seamPosition: 'Aleatório ou Alinhado fora dos pinos de rotação',
    brimType: 'DESATIVADO ou Brim Manual apenas no nariz/rabo (Brim nas juntas funde os elos)',
    coolingProfile: '100% ventoinha',
    specializedParameters: [
      {
        key: 'zero_supports',
        name_pt: 'Desativar Suportes (Mandatório)',
        name_en: 'Disable Supports (Mandatory)',
        value: 'Desativado (Off)',
        slicerPath: 'Processo > Suporte > Ativar Suporte (Desmarcar)',
        rationale_pt: 'Qualquer suporte gerado dentro das dobradiças fundirá os pinos e tornará impossível a articulação mover.',
        rationale_en: 'Supports generated inside miniature hinge links will permanently weld the joints together.',
        highlight: true,
      },
      {
        key: 'elephants_foot_compensation',
        name_pt: 'Compensação da Pata de Elefante',
        name_en: 'Elephant Foot Compensation',
        value: '0.15mm a 0.20mm',
        slicerPath: 'Processo > Qualidade > Avançado > Compensação da 1ª Camada',
        rationale_pt: 'Impede que o esmagamento da 1ª camada na mesa alargue a base dos elos vizinhos e os cole.',
        rationale_en: 'Prevents first layer squish from bridging tiny 0.3mm gaps between adjacent link bases.',
        highlight: true,
      },
      {
        key: 'flow_ratio_tuning',
        name_pt: 'Fator de Fluxo / Proporção de Fluxo',
        name_en: 'Flow Ratio',
        value: '0.97 a 0.98 (Leve sub-extrusão intencional)',
        slicerPath: 'Filamento > Básico > Taxa de Fluxo (Flow Ratio)',
        rationale_pt: 'Evita a mínima sobre-extrusão que preenche a folga de 0.3mm entre as peças móveis.',
        rationale_en: 'A fractional reduction eliminates microscopic over-extrusion bridges inside tolerances.',
      }
    ],
    dosAndDonts: {
      recommended_pt: [
        'Aguarde a mesa esfriar até temperatura ambiente antes de soltar o modelo: tentar dobrar a peça quente empena os pinos de plástico.',
        'Certifique-se de que a calibração de fluxo (Flow Dynamics / Pressure Advance) esteja precisa.',
        'Use Filamento Silk bicolor ou tricolor para efeito visual espetacular nas escamas.'
      ],
      recommended_en: [
        'Wait until the bed cools completely before flexing the model: bending hot parts bends tiny pins.',
        'Run Pressure Advance and Flow Dynamics calibration to avoid blobbing inside tight clearances.',
        'Use Dual or Tricolor Silk PLA for stunning visual shifting across moving segments.'
      ],
      avoid_pt: [
        'NUNCA ative Brim automático tipo "Auto": o brim se espalha dentro de todos os 40 elos do dragão e os cola.',
        'Não use materiais que contraem muito como ABS (os cantos levantarão e descolarão elos soltos).',
        'Não force a articulação antes de soltar a peça inteira da placa flexível.'
      ],
      avoid_en: [
        'NEVER use Auto Brim: brim creeps between each hinge gap and permanently glues links.',
        'Avoid high-warp materials like ABS (individual tiny links pop off the plate during printing).',
        'Do not force joints while the model is still stuck to the build plate.'
      ]
    },
    technicalRationale_pt: 'Peças Print-in-Place funcionam com folgas de 0.25mm a 0.40mm entre esferas e pinos. Zero suportes + Compensação de pata de elefante (0.15mm) são as duas variáveis críticas.',
    technicalRationale_en: 'Print-in-place hinges rely on 0.25mm–0.40mm air clearances. Zero supports + Elephant Foot Compensation (0.15mm) are the decisive parameters.',
    sampleFileName: 'dragao_articulado_flexi_dragon.stl'
  },
  {
    id: 'lithophane',
    category: 'lithophane',
    name_pt: 'Litofanias (Fotos 3D & Painéis Translúcidos)',
    name_en: 'Lithophanes (3D Photos & Light Panels)',
    tag_pt: '100% Preenchimento & Orientação em Pé',
    tag_en: '100% Solid Infill & Vertical Y Alignment',
    iconName: 'Sun',
    shortDesc_pt: 'Gera gradientes de luz e sombra precisos ao iluminar por trás. Exige 100% de plástico sólido e impressão estritamente em pé no eixo Y.',
    shortDesc_en: 'Produces photographic light & shadow gradients when backlit. Demands 100% solid plastic printed strictly vertically on Y-axis.',
    targetModels_pt: ['Litofanias Fotográficas Planas e Curvas', 'Luminárias de Cabeceira com Fotos', 'Chaveiros com Fotolito 3D', 'Vidros Falsos e Relevos de Iluminação'],
    targetModels_en: ['Flat & Curved Photo Lithophanes', 'Backlit Photo Night Lights', 'Photo Keychains', 'Stained Glass 3D Reliefs'],
    recommendedFileKeywords: ['lithophane', 'litofania', 'litofanio', 'foto', 'photo', 'backlit', 'luz', 'nightlight', 'painel_luz'],
    recommendedMaterials: ['PLA Branco Puro (Pure White PLA - maior fidelidade luminosa)', 'PLA Bege Claro / Warm White'],
    recommendedNozzle: '0.4mm (ou 0.2mm para fotos 10x15 com definição fotográfica)',
    layerHeight: '0.10mm a 0.12mm',
    initialLayerHeight: '0.16mm',
    wallLoops: '99 (ou forçar 100% de infill retilíneo)',
    topBottomShells: 'Camadas padrão (a peça será 100% sólida)',
    infillDensity: '100% (Mandatório: vazios internos projetam sombras fantasmas)',
    infillPattern: 'Retilíneo (Alinhado)',
    outerWallSpeed: '35 mm/s a 45 mm/s uniforme',
    innerWallSpeed: '50 mm/s',
    supportType: 'DESATIVADO (Litofanias em pé não precisam de suporte)',
    supportStyle: 'Nenhum',
    seamPosition: 'Alinhada na borda lateral mais fina',
    brimType: 'Brim Largo de 8mm a 12mm (MANDATÓRIO para a placa em pé não tombar)',
    coolingProfile: '100% ventoinha com 0% na 1ª camada',
    specializedParameters: [
      {
        key: 'print_vertically_y_axis',
        name_pt: 'Impressão em Pé Orientada no Eixo Y',
        name_en: 'Print Vertically Aligned with Y-Axis',
        value: 'Em Pé (90° em relação à mesa, alinhado no eixo Y)',
        slicerPath: 'Área 3D > Rotacionar Peça + Alinhar ao Eixo Y',
        rationale_pt: 'Imprimir deitado gera efeito degrau de cores. Em pé, a resolução do eixo Z da impressora (0.1mm) reproduz cada pixel da imagem perfeitamente.',
        rationale_en: 'Laying flat produces staircase quantization. Standing vertical harnesses sub-0.1mm Z resolution for smooth photographic tones.',
        highlight: true,
      },
      {
        key: 'infill_100_percent',
        name_pt: '100% Preenchimento Sólido (Infill 100%)',
        name_en: '100% Solid Infill',
        value: '100% (ou 99 Linhas de Parede)',
        slicerPath: 'Processo > Resistência > Preenchimento > Densidade',
        rationale_pt: 'Se houver 20% de infill, a luz revelará o desenho interno da grade por trás da foto como uma rede feia.',
        rationale_en: 'Any internal infill below 100% casts an unsightly grid/mesh shadow across the illuminated image.',
        highlight: true,
      },
      {
        key: 'wide_brim_adhesion',
        name_pt: 'Brim Largo para Ancoragem Mecânica',
        name_en: 'Wide Brim Width',
        value: '8.0mm a 12.0mm',
        slicerPath: 'Processo > Outros > Adesão da Mesa > Largura da Borda (Brim)',
        rationale_pt: 'Uma peça de 15cm de altura e 3mm de espessura cairá com a aceleração da mesa sem uma base larga de ancoragem.',
        rationale_en: 'A 15cm tall thin sheet will tip over from bed acceleration without a wide stabilizing brim.',
        highlight: true,
      }
    ],
    dosAndDonts: {
      recommended_pt: [
        'Sempre use PLA Branco normal (evite branco leitoso ou perolado que dispersa luz de forma estranha).',
        'Alinhe a peça ao longo do movimento do eixo Y (frente/trás) em impressoras "bed-slinger" para reduzir vibração lateral.',
        'Curvar levemente a foto (em arco de 15°) dá estabilidade estrutural natural durante a impressão.'
      ],
      recommended_en: [
        'Always use standard opaque white PLA (avoid glitter/pearl which scatters photons unpredictably).',
        'Align the thin plane parallel to bed travel (Y-axis) to prevent wobbling artifacts.',
        'Slightly curving the lithophane (15° arc) creates inherent self-supporting rigidity.'
      ],
      avoid_pt: [
        'NUNCA imprima litofania deitada na mesa: perde 90% da resolução e fica cheia de degraus de relevo.',
        'Não use preenchimento < 100%.',
        'Não imprima sem Brim largo.'
      ],
      avoid_en: [
        'NEVER print a lithophane flat on the build plate: causes severe topography stepping.',
        'Never use less than 100% infill.',
        'Never print without a generous brim.'
      ]
    },
    technicalRationale_pt: 'Em litofanias, a espessura do plástico modula o fluxo de fótons. A impressão vertical alavanca a altíssima resolução vertical Z (0.1mm), com 100% infill para evitar artefatos de transmitância.',
    technicalRationale_en: 'Lithophanes modulate photon transmittance via plastic thickness. Vertical orientation harnesses the Z-axis precision.',
    sampleFileName: 'litofania_foto_familia_painel.stl'
  },
  {
    id: 'threads-precision',
    category: 'precision',
    name_pt: 'Roscas, Parafusos & Encaixes de Pressão',
    name_en: 'Threads, Fasteners & Snap-Fits',
    tag_pt: 'Ordem das Paredes & Compensação Dimensional',
    tag_en: 'Outer Wall First & Micro Tolerances',
    iconName: 'Gauge',
    shortDesc_pt: 'Calibrado para filetes helicoidais de roscas macho/fêmea (M3 a M24) e travas plásticas snap-fit. Impede dilatação que trava o passo de rosca.',
    shortDesc_en: 'Precision profile for male/female threads (M3 to M24) and snap-fit joints. Compensates for thermal bloom.',
    targetModels_pt: ['Parafusos e Porcas Impressos', 'Tampas com Rosca de Garrafa / Pote', 'Caixas com Encaixe Snap-Fit', 'Eixos de Acoplamento', 'Adaptadores de Rosca Tripé (1/4")'],
    targetModels_en: ['3D Printed Bolts & Nuts', 'Threaded Jar/Bottle Lids', 'Snap-Fit Enclosures', 'Coupling Shafts', 'Camera Tripod Adapters (1/4")'],
    recommendedFileKeywords: ['thread', 'rosca', 'parafuso', 'porca', 'bolt', 'nut', 'screw', 'snap', 'encaixe', 'tampa', 'lid', 'cap', 'fitting', 'adapter'],
    recommendedMaterials: ['PETG (baixo coeficiente de atrito)', 'PLA Tough / PLA+', 'PA-CF'],
    recommendedNozzle: '0.4mm (com calibração de fluxo validada)',
    layerHeight: '0.12mm a 0.16mm (camadas baixas diminuem os degraus nos ângulos de 60° da rosca ISO)',
    initialLayerHeight: '0.20mm',
    wallLoops: '4 perímetros (garante que os dentes da rosca sejam 100% plástico sólido)',
    topBottomShells: '5 superiores / 4 inferiores',
    infillDensity: '25% a 35%',
    infillPattern: 'Gyroid',
    outerWallSpeed: '35 mm/s a 45 mm/s (lento para fidelidade geométrica microscópica)',
    innerWallSpeed: '80 mm/s',
    supportType: 'DESATIVADO nas roscas (Suportes dentro de filetes de rosca são impossíveis de remover)',
    supportStyle: 'Nenhum',
    seamPosition: 'Aleatório ou Alinhada em quina plana (NUNCA dentro do sulco da rosca)',
    brimType: 'Mouse-ears se a base do parafuso for pequena',
    coolingProfile: '100% ventoinha nas paredes para congelar o filete antes de deformar',
    specializedParameters: [
      {
        key: 'wall_order_outer_first',
        name_pt: 'Ordem das Paredes: Parede Externa Primeiro',
        name_en: 'Wall Order: Outer Wall First (Outer/Inner)',
        value: 'Externa / Interna (Outer / Inner)',
        slicerPath: 'Processo > Qualidade > Avançado > Ordem das Linhas de Parede',
        rationale_pt: 'A parede externa é depositada com precisão absoluta de coordenadas XY, sem ser empurrada para fora pelo perímetro interno.',
        rationale_en: 'Outer perimeter is laid down with micrometer precision, not pushed outwards by previously extruded inner loops.',
        highlight: true,
      },
      {
        key: 'xy_contour_compensation',
        name_pt: 'Compensação de Contorno X-Y',
        name_en: 'X-Y Contour Compensation',
        value: '-0.05mm a -0.08mm (se parafuso macho entrar apertado)',
        slicerPath: 'Processo > Qualidade > Precisão > Compensação de Contorno X-Y',
        rationale_pt: 'Reduz levemente o diâmetro externo de eixos e parafusos para dar a folga mecânica correta sem mexer no modelo CAD.',
        rationale_en: 'Subtly trims the outer circumference to provide nominal clearance for sliding or threading.',
        highlight: true,
      },
      {
        key: 'scarf_joint_seam_threads',
        name_pt: 'Costura em Bisel (Scarf Seam)',
        name_en: 'Scarf Seam on Threads',
        value: 'Ativado',
        slicerPath: 'Processo > Qualidade > Costura',
        rationale_pt: 'Elimina caroços de costura que travam a porca no meio do curso da rosca.',
        rationale_en: 'Removes the z-seam bump that jams nut threads halfway down the bolt.',
      }
    ],
    dosAndDonts: {
      recommended_pt: [
        'Imprima parafusos na vertical e porcas com a face plana apoiada na mesa.',
        'Passe uma gota de lubrificante seco PTFE ou cera na primeira vez que rosquear as peças.',
        'Use camada de 0.12mm em roscas com passo menor que 1.5mm (M4, M5, M6).'
      ],
      recommended_en: [
        'Print bolts standing vertically and nuts flat on the build plate.',
        'Apply a tiny drop of silicone/PTFE grease upon first assembly to burnish layer ridges.',
        'Use 0.12mm layer height on metric threads with pitch < 1.5mm.'
      ],
      avoid_pt: [
        'NÃO coloque suportes em roscas verticais: eles destroem os filetes.',
        'Evite velocidades rápidas na parede externa (o plástico quente se arredonda nos vértices afiados da rosca).',
        'Não use materiais com grande retração como ABS sem compensação de escala de 100.5%.'
      ],
      avoid_en: [
        'Do NOT enable supports on vertical threads: residual support plastic ruins the pitch.',
        'Avoid high speeds: molten plastic rounds off sharp 60° thread crests.',
        'Avoid high-shrinkage resins or uncompensated ABS.'
      ]
    },
    technicalRationale_pt: 'Roscas 3D falham quando a ordem padrão (Inner-Outer) expande o perímetro externo por pressão hidrostática. Alterar para Outer-Wall-First restaura a tolerância nominal de fábrica.',
    technicalRationale_en: '3D printed threads seize when conventional Inner-Outer wall ordering expands outer boundaries. Outer-Wall-First restores CAD dimensional fidelity.',
    sampleFileName: 'parafuso_e_porca_m12_metric.stl'
  },
  {
    id: 'tpu-flexible',
    category: 'tpu_flexible',
    name_pt: 'Peças Flexíveis em TPU & Borracha (95A / 98A)',
    name_en: 'Flexible TPU & Rubber Parts (95A / 98A)',
    tag_pt: 'Alimentação Direta & Baixa Velocidade',
    tag_en: 'Direct Drive Slow & Zero Clog',
    iconName: 'Zap',
    shortDesc_pt: 'Configurado para filamentos elastoméricos flexíveis (TPU). Evita engasgos no bico, desarmamento de extrusora e fiapos (stringing) descontrolados.',
    shortDesc_en: 'Configured for elastomeric flexible TPU. Prevents extruder jams, hotend clogs and stringing.',
    targetModels_pt: ['Capinhas de Celular Antichoque', 'Gaxetas e Anéis de Vedação O-ring', 'Pneus para Robótica e RC', 'Coxins Antivibração', 'Solas de Calçados / Tênis'],
    targetModels_en: ['Phone Cases & Bumpers', 'Gaskets & O-Ring Seals', 'Robotic Tires & Tracks', 'Anti-Vibration Dampers', 'Shoe Soles & Cushions'],
    recommendedFileKeywords: ['tpu', 'flex', 'flexible', 'flexivel', 'capinha', 'case', 'bumper', 'gasket', 'vedacao', 'tire', 'pneu', 'borracha', 'amortecedor'],
    recommendedMaterials: ['TPU 95A (o mais comum e equilibrado)', 'TPU 98A (mais fácil de imprimir)', 'TPU 85A (ultra macio, exige muita lentidão)'],
    recommendedNozzle: '0.4mm (com carretel FORA do AMS)',
    layerHeight: '0.20mm',
    initialLayerHeight: '0.24mm',
    wallLoops: '2 a 3 perímetros',
    topBottomShells: '4 superiores / 4 inferiores',
    infillDensity: '15% a 25%',
    infillPattern: 'Gyroid (distribui a elasticidade isotropicamente sob aperto da mão)',
    outerWallSpeed: '25 mm/s a 35 mm/s (LENTO: filamento flexível empena no tracionador se empurrado rápido)',
    innerWallSpeed: '30 mm/s a 40 mm/s',
    supportType: 'Evitar suportes se possível (TPU funde no suporte e é quase impossível cortar)',
    supportStyle: 'Tree com distância Z de 0.28mm se estritamente necessário',
    seamPosition: 'Alinhada em quina',
    brimType: 'Geralmente desnecessário (TPU gruda extraordinariamente bem na mesa PEI)',
    coolingProfile: '50% a 80% ventoinha',
    specializedParameters: [
      {
        key: 'max_volumetric_speed_tpu',
        name_pt: 'Vazão Volumétrica Máxima (Filamento TPU)',
        name_en: 'Max Volumetric Speed (TPU)',
        value: '2.5 a 3.5 mm³/s',
        slicerPath: 'Filamento > Configurações Avançadas > Vazão Volumétrica Máxima',
        rationale_pt: 'TPU é como empurrar um espaguete cozido. Limitar a vazão a 3 mm³/s impede que a extrusora embole o filamento nas engrenagens.',
        rationale_en: 'TPU behaves like cooked pasta under pressure. Limiting volumetric speed prevents buckling inside the drive gears.',
        highlight: true,
      },
      {
        key: 'spool_outside_ams',
        name_pt: 'Carretel Externo (Fora do Bambu AMS)',
        name_en: 'External Spool Holder (Non-AMS)',
        value: 'Obrigatório (Alimentação Direta Traseira)',
        slicerPath: 'Dispositivo > Selecionar Carretel Externo',
        rationale_pt: 'TPU é proibido no Bambu AMS porque ele estica nos tubos PTFE de 1 metro e trava os motores de tração.',
        rationale_en: 'TPU cannot run through Bambu AMS feed tubes due to friction and stretching elasticity.',
        highlight: true,
      },
      {
        key: 'retraction_distance_tpu',
        name_pt: 'Distância de Retração Reduzida',
        name_en: 'Reduced Retraction Length',
        value: '0.5mm a 1.0mm (Direct Drive)',
        slicerPath: 'Configuração da Extrusora > Retração',
        rationale_pt: 'Retrações longas puxam o TPU mole para a zona fria da garganta, onde ele expande e causa entupimento imediato.',
        rationale_en: 'Long retractions pull soft TPU into the cold break where it mushrooms and causes immediate jamming.',
      }
    ],
    dosAndDonts: {
      recommended_pt: [
        'SEQUE O FILAMENTO ANTES: TPU absorve umidade do ar em horas, gerando estalos, espumas e perda total de acabamento.',
        'Passe cola em bastão na chapa PEI LISA: ela atua como agente desmoldante (o TPU gruda tão forte que pode arrancar o PEI da chapa!).',
        'Use preenchimento Gyroid para almofadas e amortecedores (proporciona elasticidade progressiva).'
      ],
      recommended_en: [
        'DRY THE FILAMENT: TPU absorbs atmospheric moisture within hours, causing bubbling, pops and stringing.',
        'Apply glue stick on smooth PEI as a release agent (TPU adheres so strongly it can tear PEI coatings).',
        'Use Gyroid infill for flexible cushions and shock absorbers.'
      ],
      avoid_pt: [
        'NUNCA tente passar TPU no AMS da Bambu Lab.',
        'Não use velocidades acima de 40 mm/s.',
        'Não use ventoinha em 0% (o TPU precisa ser resfriado para manter forma elástica).'
      ],
      avoid_en: [
        'NEVER load standard TPU into Bambu AMS system.',
        'Do not exceed 40 mm/s print speeds.',
        'Do not disable part cooling completely.'
      ]
    },
    technicalRationale_pt: 'O controle reológico do TPU depende da vazão volumétrica restrita (< 3.5 mm³/s) e alimentação direta traseira sem curvas acentuadas de tubo.',
    technicalRationale_en: 'TPU rheology demands tight volumetric throttling (< 3.5 mm³/s) and direct unhindered spool delivery.',
    sampleFileName: 'capinha_celular_tpu_impacto.stl'
  },
  {
    id: 'draft-fast',
    category: 'draft_fast',
    name_pt: 'Prototipagem Rápida / Draft (Caixas & Validação)',
    name_en: 'Rapid Prototyping / Draft (Fast Validation)',
    tag_pt: 'Velocidade Máxima & Menos Camadas',
    tag_en: 'Max Speed & Thick Layers',
    iconName: 'Flame',
    shortDesc_pt: 'Reduz o tempo de impressão em até 60% para validar medidas, ergonomia e volumes antes da versão final.',
    shortDesc_en: 'Cuts print time by up to 60% for fast volumetric, ergonomic and fit validation before final runs.',
    targetModels_pt: ['Caixas e Gabinetes Eletrônicos (Draft)', 'Moldes e Gabaritos de Montagem', 'Maquetes Conceituais Rápidas', 'Testes de Encaixe Volumétrico'],
    targetModels_en: ['Draft Electronic Enclosures', 'Assembly Jigs', 'Concept Architecture Masses', 'Volumetric Fit Checks'],
    recommendedFileKeywords: ['draft', 'rapido', 'fast', 'box', 'caixa', 'case', 'enclosure', 'gabinete', 'prototipo', 'prototype', 'teste', 'mockup'],
    recommendedMaterials: ['PLA Básico / PLA Reciclado'],
    recommendedNozzle: '0.4mm (ou 0.6mm/0.8mm para protótipos gigantes)',
    layerHeight: '0.28mm ou 0.32mm',
    initialLayerHeight: '0.24mm',
    wallLoops: '2 perímetros',
    topBottomShells: '3 superiores / 3 inferiores',
    infillDensity: '8% a 12%',
    infillPattern: 'Cross Hatch ou Lightning (preenchimento ultra ágil)',
    outerWallSpeed: '150 mm/s a 200 mm/s',
    innerWallSpeed: '250 mm/s a 300 mm/s',
    supportType: 'Tree Slim (Apenas onde estritamente necessário)',
    supportStyle: 'Tree Slim',
    seamPosition: 'Mais próximo (Nearest)',
    brimType: 'Desativado (ou automático se peça tiver base pequena)',
    coolingProfile: '100% ventoinha para lidar com alta taxa de deposição térmica',
    specializedParameters: [
      {
        key: 'draft_layer_height',
        name_pt: 'Camada Espessa de 0.28mm (Draft)',
        name_en: '0.28mm Thick Draft Layer Height',
        value: '0.28mm',
        slicerPath: 'Processo > Qualidade > Altura da Camada',
        rationale_pt: 'Gera quase metade do número de camadas de um fatiamento padrão de 0.16mm, reduzindo pela metade o tempo total.',
        rationale_en: 'Cuts the total layer count almost in half compared to 0.16mm, drastically slashing print time.',
        highlight: true,
      },
      {
        key: 'lightning_or_crosshatch_infill',
        name_pt: 'Preenchimento Cross Hatch ou Lightning',
        name_en: 'Cross Hatch or Lightning Infill',
        value: 'Cross Hatch (10%) ou Lightning',
        slicerPath: 'Processo > Resistência > Preenchimento',
        rationale_pt: 'O Cross Hatch imprime incrivelmente rápido sem cruzar caminhos na mesma camada, evitando vibrações.',
        rationale_en: 'Cross Hatch prints at blazing speeds without intersecting lines on the same plane.',
        highlight: true,
      }
    ],
    dosAndDonts: {
      recommended_pt: [
        'Use para validar furos, espaçamento e posições de conectores antes de imprimir a peça final com 4 paredes.',
        'Bambu Lab e impressoras CoreXY modernas suportam 250-300 mm/s com facilidade em 0.28mm.',
        'Ative acelerações normais da máquina.'
      ],
      recommended_en: [
        'Use to validate bolt hole locations and PCB spacing before running long high-resolution prints.',
        'Modern CoreXY systems handle 250–300 mm/s at 0.28mm with ease.',
        'Keep standard machine acceleration.'
      ],
      avoid_pt: [
        'Não use este perfil se a peça precisar de alta resistência mecânica.',
        'Evite este perfil para figuras colecionáveis ou rostos (as linhas de camada ficarão bem aparentes).'
      ],
      avoid_en: [
        'Do not use this profile for heavy load bearing parts.',
        'Avoid on collectible figures where 0.28mm layer lines degrade facial aesthetics.'
      ]
    },
    technicalRationale_pt: 'A física do tempo de impressão é dominada pelo número de camadas no eixo Z. Camadas de 0.28mm combinadas com 2 paredes e Cross Hatch oferecem o menor tempo por grama de plástico.',
    technicalRationale_en: 'Total print duration is dominated by vertical layer count. 0.28mm layers + 2 walls + Cross Hatch infill maximize grams deposited per minute.',
    sampleFileName: 'caixa_prototipo_rapido_enclosure.stl'
  }
];

/**
 * Intelligent heuristic matcher: given a file name and geometry metrics,
 * returns the best matching profile with confidence score and reason.
 */
export function recommendProfileForFile(
  fileName: string,
  geometry?: {
    triangleCount?: number;
    size?: [number, number, number];
    isWatertight?: boolean;
    aspectRatio?: number;
  }
): {
  preset: FileTypePreset;
  confidence: 'high' | 'medium' | 'default';
  reason_pt: string;
  reason_en: string;
} {
  const lowerName = fileName.toLowerCase();

  // Keyword check
  for (const preset of PRINT_PROFILES_DATABASE) {
    for (const keyword of preset.recommendedFileKeywords) {
      if (lowerName.includes(keyword)) {
        return {
          preset,
          confidence: 'high',
          reason_pt: `Detectado padrão "${keyword}" no nome do arquivo "${fileName}". Recomendamos o perfil "${preset.name_pt}".`,
          reason_en: `Detected keyword "${keyword}" in file name "${fileName}". Recommended preset is "${preset.name_en}".`,
        };
      }
    }
  }

  // Geometric heuristics if available
  if (geometry?.size) {
    const [w, d, h] = geometry.size;
    const maxDim = Math.max(w, d, h);
    const minDim = Math.min(w, d, h);

    // Tall and thin vertical aspect ratio: vase or lithophane candidate
    if (h > 60 && (w < 15 || d < 15)) {
      const litho = PRINT_PROFILES_DATABASE.find(p => p.id === 'lithophane');
      if (litho) {
        return {
          preset: litho,
          confidence: 'medium',
          reason_pt: 'A geometria é alta e muito delgada (< 15mm de espessura), padrão clássico de Litofania ou painel iluminado.',
          reason_en: 'Tall and thin geometry (< 15mm thick), classic indicator of a Lithophane panel.',
        };
      }
    }

    // Cylindrical or rotational tall geometry: vase candidate
    if (h > 50 && Math.abs(w - d) < 15) {
      const vase = PRINT_PROFILES_DATABASE.find(p => p.id === 'vase-mode');
      if (vase) {
        return {
          preset: vase,
          confidence: 'medium',
          reason_pt: 'A geometria possui base circular simétrica e altura representativa, formato típico de Vaso ou Recipiente.',
          reason_en: 'Geometry has circular symmetrical footprint and tall height, typical of a Vase or Pot.',
        };
      }
    }

    // Small with high triangle count: miniature / action figure candidate
    if (maxDim < 90 && (geometry.triangleCount || 0) > 40000) {
      const figure = PRINT_PROFILES_DATABASE.find(p => p.id === 'action-figure');
      if (figure) {
        return {
          preset: figure,
          confidence: 'medium',
          reason_pt: 'Modelo com dimensões compactas e alta densidade de triângulos (> 40k), típico de Action Figures e Miniaturas com detalhes orgânicos.',
          reason_en: 'Compact dimensions with dense triangle mesh (> 40k), typical of Action Figures & organic miniatures.',
        };
      }
    }
  }

  // Fallback: Mechanical & Functional (the safest versatile profile)
  const defaultProfile = PRINT_PROFILES_DATABASE.find(p => p.id === 'action-figure') || PRINT_PROFILES_DATABASE[0];
  return {
    preset: defaultProfile,
    confidence: 'default',
    reason_pt: 'Perfil versátil de alta fidelidade recomendado para o modelo importado.',
    reason_en: 'Versatile high-fidelity profile recommended for the loaded model.',
  };
}
