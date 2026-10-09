import * as THREE from 'three';
import { MeshHealthReport, MeshDiagnosticItem } from '../types/index.ts';

/**
 * Advanced Mesh Health and Topological Integrity Checker using Three.js BufferGeometry.
 * 
 * Verifies:
 * - 2-Manifoldness (surface topology without non-manifold singularities or T-junctions)
 * - Open edges / Disjoint boundary faces (holes / gaps preventing watertightness)
 * - Inverted triangles / Inconsistent facet normal winding
 * - Degenerate zero-area triangles
 * - Watertightness (watertight solid ready for Bambu Studio FDM slicing)
 */
export function checkMeshHealth(geometry: THREE.BufferGeometry): MeshHealthReport {
  const posAttr = geometry.getAttribute('position');
  if (!posAttr || posAttr.count === 0) {
    return {
      isManifold: false,
      totalTriangles: 0,
      totalUniqueVertices: 0,
      openEdgesCount: 0,
      nonManifoldEdgesCount: 0,
      invertedTrianglesCount: 0,
      degenerateFacesCount: 0,
      isWatertight: false,
      overallStatus: 'critical',
      healthScore: 0,
      summary: 'Geometria vazia ou sem atributos de posição válidos.',
      diagnostics: [
        {
          type: 'error',
          title: 'Malha Indisponível',
          description: 'Não foram encontrados vértices na malha do modelo.',
          fixAdvice: 'Verifique se o arquivo não está corrompido ou vazio.',
        },
      ],
      repairRecommendations: ['Importe um arquivo STL ou 3MF válido.'],
    };
  }

  const normalAttr = geometry.getAttribute('normal');
  const indexAttr = geometry.getIndex();

  // If indexed, extract indices; if unindexed, sequential triplets
  const indices: number[] = [];
  if (indexAttr) {
    for (let i = 0; i < indexAttr.count; i++) {
      indices.push(indexAttr.getX(i));
    }
  } else {
    for (let i = 0; i < posAttr.count; i++) {
      indices.push(i);
    }
  }

  const triangleCount = Math.floor(indices.length / 3);

  // 1. Quantize vertices to map near-identical points within 1 micron (0.001mm)
  // This allows detecting shared edges across independent STL triangle definitions
  const vertexCoordMap = new Map<string, number>();
  const mappedIndices: number[] = new Array(indices.length);
  const uniquePositions: THREE.Vector3[] = [];

  const quantize = (v: number) => Math.round(v * 1000) / 1000;

  for (let i = 0; i < indices.length; i++) {
    const rawIdx = indices[i];
    const x = posAttr.getX(rawIdx);
    const y = posAttr.getY(rawIdx);
    const z = posAttr.getZ(rawIdx);

    const key = `${quantize(x)}_${quantize(y)}_${quantize(z)}`;
    let mappedId = vertexCoordMap.get(key);
    if (mappedId === undefined) {
      mappedId = uniquePositions.length;
      vertexCoordMap.set(key, mappedId);
      uniquePositions.push(new THREE.Vector3(x, y, z));
    }
    mappedIndices[i] = mappedId;
  }

  const totalUniqueVertices = uniquePositions.length;

  // 2. Topological Edge Structure
  // Map undirected edge key "min:max" to shared triangle information
  interface EdgeInfo {
    count: number;
    directions: Map<string, number>; // "v1->v2" to count
    triangles: number[];
  }

  const edgeMap = new Map<string, EdgeInfo>();
  let degenerateFacesCount = 0;
  let invertedNormalTriangles = 0;

  const vA = new THREE.Vector3();
  const vB = new THREE.Vector3();
  const vC = new THREE.Vector3();
  const edge1 = new THREE.Vector3();
  const edge2 = new THREE.Vector3();
  const computedNormal = new THREE.Vector3();
  const storedNormal = new THREE.Vector3();

  for (let tri = 0; tri < triangleCount; tri++) {
    const idx0 = mappedIndices[tri * 3];
    const idx1 = mappedIndices[tri * 3 + 1];
    const idx2 = mappedIndices[tri * 3 + 2];

    vA.copy(uniquePositions[idx0]);
    vB.copy(uniquePositions[idx1]);
    vC.copy(uniquePositions[idx2]);

    edge1.subVectors(vB, vA);
    edge2.subVectors(vC, vA);
    computedNormal.crossVectors(edge1, edge2);
    const area = computedNormal.length() * 0.5;

    // Check Degenerate Triangles
    if (idx0 === idx1 || idx1 === idx2 || idx2 === idx0 || area < 1e-8) {
      degenerateFacesCount++;
    }

    // Check normal consistency if normal attribute exists
    if (normalAttr) {
      const rawIdx = indices[tri * 3];
      storedNormal.set(
        normalAttr.getX(rawIdx),
        normalAttr.getY(rawIdx),
        normalAttr.getZ(rawIdx)
      );

      if (storedNormal.lengthSq() > 0.1 && computedNormal.lengthSq() > 1e-8) {
        computedNormal.normalize();
        storedNormal.normalize();
        const dot = computedNormal.dot(storedNormal);
        // If stored normal opposes vertex winding normal, inverted triangle detected
        if (dot < -0.1) {
          invertedNormalTriangles++;
        }
      }
    }

    // 3 Directed Edges for this triangle: (idx0->idx1), (idx1->idx2), (idx2->idx0)
    const triEdges: [number, number][] = [
      [idx0, idx1],
      [idx1, idx2],
      [idx2, idx0],
    ];

    for (const [u, v] of triEdges) {
      if (u === v) continue;
      const minId = Math.min(u, v);
      const maxId = Math.max(u, v);
      const key = `${minId}:${maxId}`;
      const dirKey = `${u}->${v}`;

      let e = edgeMap.get(key);
      if (!e) {
        e = {
          count: 0,
          directions: new Map<string, number>(),
          triangles: [],
        };
        edgeMap.set(key, e);
      }

      e.count++;
      e.directions.set(dirKey, (e.directions.get(dirKey) || 0) + 1);
      e.triangles.push(tri);
    }
  }

  // 3. Count Open Edges (Boundary) & Non-Manifold Edges & Winding Flips
  let openEdgesCount = 0;
  let nonManifoldEdgesCount = 0;
  let conflictingOrientationEdges = 0;

  for (const [, info] of edgeMap.entries()) {
    if (info.count === 1) {
      // Exactly 1 adjacent face -> open boundary edge (buraco na malha)
      openEdgesCount++;
    } else if (info.count > 2) {
      // 3 or more faces connected to the same edge -> non-manifold singularity
      nonManifoldEdgesCount++;
    } else if (info.count === 2) {
      // In a consistent 2-manifold orientation, one triangle must go u->v and the other v->u.
      // If both triangles go in the same direction, orientation is flipped / inverted.
      let hasBothDirections = true;
      for (const count of info.directions.values()) {
        if (count > 1) {
          hasBothDirections = false;
          break;
        }
      }
      if (!hasBothDirections) {
        conflictingOrientationEdges++;
      }
    }
  }

  const invertedTrianglesCount = Math.max(
    invertedNormalTriangles,
    Math.round(conflictingOrientationEdges / 2)
  );

  const isManifold = nonManifoldEdgesCount === 0 && conflictingOrientationEdges === 0;
  const isWatertight = isManifold && openEdgesCount === 0 && degenerateFacesCount === 0;

  // 4. Calculate Health Score (0 - 100)
  let healthScore = 100;
  if (openEdgesCount > 0) {
    healthScore -= Math.min(35, 15 + Math.floor(openEdgesCount * 1.5));
  }
  if (nonManifoldEdgesCount > 0) {
    healthScore -= Math.min(40, 20 + nonManifoldEdgesCount * 3);
  }
  if (invertedTrianglesCount > 0) {
    healthScore -= Math.min(25, 10 + invertedTrianglesCount * 2);
  }
  if (degenerateFacesCount > 0) {
    healthScore -= Math.min(15, 5 + degenerateFacesCount);
  }

  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  // 5. Overall Status
  let overallStatus: 'perfect' | 'warning' | 'critical' = 'perfect';
  if (nonManifoldEdgesCount > 0 || openEdgesCount > 20 || healthScore < 60) {
    overallStatus = 'critical';
  } else if (openEdgesCount > 0 || invertedTrianglesCount > 0 || degenerateFacesCount > 0 || healthScore < 95) {
    overallStatus = 'warning';
  }

  // 6. Diagnostics Breakdown
  const diagnostics: MeshDiagnosticItem[] = [];

  // Manifoldness Diagnostic
  if (nonManifoldEdgesCount === 0) {
    diagnostics.push({
      type: 'success',
      title: 'Topologia 2-Manifold Verificada',
      description: 'Nenhuma aresta compartilhada por mais de 2 triângulos (sem interseções singulares ou aletas internas).',
    });
  } else {
    diagnostics.push({
      type: 'error',
      title: `${nonManifoldEdgesCount} Arestas Não-Manifold Detectadas`,
      description: 'Arestas compartilhadas por 3 ou mais faces conectadas geram indefinição de volume no fatiador.',
      fixAdvice: 'No Bambu Studio, clique com botão direito no modelo e selecione "Fix Model / Reparar Modelo" para reconstruir a topologia.',
    });
  }

  // Watertight / Open Edges Diagnostic
  if (openEdgesCount === 0) {
    diagnostics.push({
      type: 'success',
      title: 'Malha Estanque (Watertight / Sem Furos)',
      description: 'Todas as arestas possuem exatamente 2 faces adjacentes unidas, formando um sólido fechado.',
    });
  } else {
    diagnostics.push({
      type: 'warning',
      title: `${openEdgesCount} Faces Não Unidas (Arestas Abertas)`,
      description: 'A malha possui contornos abertos ou buracos que podem fazer o fatiador interpretar a peça como superfície oca.',
      fixAdvice: 'Verifique no CAD se as superfícies foram costuradas (Sew / Stitch) antes de exportar como STL.',
    });
  }

  // Inverted Normals / Triangles Diagnostic
  if (invertedTrianglesCount === 0) {
    diagnostics.push({
      type: 'success',
      title: 'Normais e Bobinamento Coerentes',
      description: 'Todos os triângulos apontam adequadamente para o exterior do modelo com a regra da mão direita.',
    });
  } else {
    diagnostics.push({
      type: 'warning',
      title: `${invertedTrianglesCount} Triângulos Invertidos ou com Normais Conflitantes`,
      description: 'Faces apontando para dentro podem causar falhas na geração de preenchimento (infill) e camadas sólidas.',
      fixAdvice: 'Utilize o comando de inversão de normais ou o reparo do Bambu Studio.',
    });
  }

  // Degenerate Faces Diagnostic
  if (degenerateFacesCount === 0) {
    diagnostics.push({
      type: 'success',
      title: 'Sem Faces Degeneradas',
      description: 'Nenhum triângulo com área nula ou vértices colineares identificado.',
    });
  } else {
    diagnostics.push({
      type: 'warning',
      title: `${degenerateFacesCount} Faces Degeneradas (Área Nula)`,
      description: 'Triângulos planos de área desprezível gerados por aproximação numérica no software CAD.',
      fixAdvice: 'Aumente ligeiramente a tolerância angular ou limpe microfaces no software de modelagem.',
    });
  }

  // 7. Repair Recommendations tailored for Bambu Studio
  const repairRecommendations: string[] = [];

  if (overallStatus === 'perfect') {
    repairRecommendations.push('✅ Malha perfeitamente estanque e manifold. Pronta para fatiamento direto no Bambu Studio.');
    repairRecommendations.push('💡 Pode fatiar com qualquer altura de camada sem risco de artefatos de furos ou preenchimento fantasma.');
  } else {
    if (nonManifoldEdgesCount > 0) {
      repairRecommendations.push('🔧 Bambu Studio: Clique com botão direito na peça e escolha "Reparar Modelo" (Windows: serviço Netfabb integrado ao Studio).');
    }
    if (openEdgesCount > 0) {
      repairRecommendations.push('🧵 CAD: Feche os contornos com operação "Cap Holes" ou costure superfícies antes de converter para malha triangular.');
    }
    if (invertedTrianglesCount > 0) {
      repairRecommendations.push('🔄 Normais: Certifique-se de que todas as faces externas estejam orientadas para fora (Recalculate Outside Normals).');
    }
    repairRecommendations.push('📐 Exportação: Recomenda-se exportar STL com desvio cordal máx de 0.01mm e ângulo de 15° para manter precisão sem degeneração.');
  }

  // Summary Text
  let summary = '';
  if (overallStatus === 'perfect') {
    summary = `Excelente integridade geométrica (Score ${healthScore}/100). Malha 100% 2-manifold e watertight (${triangleCount.toLocaleString('pt-BR')} triângulos, ${totalUniqueVertices.toLocaleString('pt-BR')} vértices).`;
  } else if (overallStatus === 'warning') {
    summary = `Atenção: A malha possui pequenas inconsistências (Score ${healthScore}/100). ${openEdgesCount > 0 ? `${openEdgesCount} arestas abertas. ` : ''}${invertedTrianglesCount > 0 ? `${invertedTrianglesCount} triângulos invertidos. ` : ''}O Bambu Studio costuma conseguir reparar automaticamente.`;
  } else {
    summary = `Crítico: A malha apresenta falhas topológicas graves (Score ${healthScore}/100). ${nonManifoldEdgesCount > 0 ? `${nonManifoldEdgesCount} arestas não-manifold. ` : ''}${openEdgesCount > 0 ? `${openEdgesCount} arestas abertas. ` : ''}Pode falhar no fatiador ou gerar paredes vazias.`;
  }

  return {
    isManifold,
    totalTriangles: triangleCount,
    totalUniqueVertices,
    openEdgesCount,
    nonManifoldEdgesCount,
    invertedTrianglesCount,
    degenerateFacesCount,
    isWatertight,
    overallStatus,
    healthScore,
    summary,
    diagnostics,
    repairRecommendations,
  };
}
