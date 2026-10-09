import * as THREE from 'three';
import { StlAnalysisResult } from '../types/index.ts';
import { checkMeshHealth } from './meshHealthChecker.ts';

/**
 * Computes bounding box, triangle count, watertight integrity,
 * manifoldness, inverted normals, open edges, and estimated volume 100% client-side
 * using Three.js and advanced topological analysis.
 */
export function analyzeStlClientSide(arrayBuf: ArrayBuffer, fileName: string): StlAnalysisResult {
  const dataView = new DataView(arrayBuf);
  const isBinary = arrayBuf.byteLength > 84 && Math.abs(arrayBuf.byteLength - (84 + dataView.getUint32(80, true) * 50)) <= 2;

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let degenerateFaces = 0;
  let triangleCount = 0;
  let signedVolumeAccumulator = 0;

  const geometry = new THREE.BufferGeometry();

  if (isBinary) {
    triangleCount = dataView.getUint32(80, true);
    const positions = new Float32Array(triangleCount * 3 * 3);
    const normals = new Float32Array(triangleCount * 3 * 3);

    let offset = 84;
    let posIdx = 0;

    for (let i = 0; i < triangleCount; i++) {
      if (offset + 50 > arrayBuf.byteLength) break;
      
      const nx = dataView.getFloat32(offset, true);
      const ny = dataView.getFloat32(offset + 4, true);
      const nz = dataView.getFloat32(offset + 8, true);
      offset += 12;

      const v1x = dataView.getFloat32(offset, true);
      const v1y = dataView.getFloat32(offset + 4, true);
      const v1z = dataView.getFloat32(offset + 8, true);

      const v2x = dataView.getFloat32(offset + 12, true);
      const v2y = dataView.getFloat32(offset + 16, true);
      const v2z = dataView.getFloat32(offset + 20, true);

      const v3x = dataView.getFloat32(offset + 24);
      const v3y = dataView.getFloat32(offset + 28, true);
      const v3z = dataView.getFloat32(offset + 32, true);

      offset += 36 + 2;

      // Populate Three.js attribute arrays
      positions[posIdx] = v1x; positions[posIdx + 1] = v1y; positions[posIdx + 2] = v1z;
      normals[posIdx] = nx; normals[posIdx + 1] = ny; normals[posIdx + 2] = nz;

      positions[posIdx + 3] = v2x; positions[posIdx + 4] = v2y; positions[posIdx + 5] = v2z;
      normals[posIdx + 3] = nx; normals[posIdx + 4] = ny; normals[posIdx + 5] = nz;

      positions[posIdx + 6] = v3x; positions[posIdx + 7] = v3y; positions[posIdx + 8] = v3z;
      normals[posIdx + 6] = nx; normals[posIdx + 7] = ny; normals[posIdx + 8] = nz;

      posIdx += 9;

      // Bounding box
      if (v1x < minX) minX = v1x; if (v1x > maxX) maxX = v1x;
      if (v2x < minX) minX = v2x; if (v2x > maxX) maxX = v2x;
      if (v3x < minX) minX = v3x; if (v3x > maxX) maxX = v3x;

      if (v1y < minY) minY = v1y; if (v1y > maxY) maxY = v1y;
      if (v2y < minY) minY = v2y; if (v2y > maxY) maxY = v2y;
      if (v3y < minY) minY = v3y; if (v3y > maxY) maxY = v3y;

      if (v1z < minZ) minZ = v1z; if (v1z > maxZ) maxZ = v1z;
      if (v2z < minZ) minZ = v2z; if (v2z > maxZ) maxZ = v2z;
      if (v3z < minZ) minZ = v3z; if (v3z > maxZ) maxZ = v3z;

      // Degenerate check
      const e1x = v2x - v1x, e1y = v2y - v1y, e1z = v2z - v1z;
      const e2x = v3x - v1x, e2y = v3y - v1y, e2z = v3z - v1z;
      const crossX = e1y * e2z - e1z * e2y;
      const crossY = e1z * e2x - e1x * e2z;
      const crossZ = e1x * e2y - e1y * e2x;
      if (crossX * crossX + crossY * crossY + crossZ * crossZ < 1e-12) {
        degenerateFaces++;
      }

      // Divergence theorem
      signedVolumeAccumulator += (v1x * (v2y * v3z - v2z * v3y) +
                                  v1y * (v2z * v3x - v2x * v3z) +
                                  v1z * (v2x * v3y - v2y * v3x));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  } else {
    // ASCII STL
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(arrayBuf);
    const vertexMatches = text.match(/vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g);
    if (vertexMatches) {
      triangleCount = Math.floor(vertexMatches.length / 3);
      const positions: number[] = [];

      for (let i = 0; i < triangleCount; i++) {
        const getV = (idx: number) => {
          const parts = vertexMatches[idx].trim().split(/\s+/);
          return [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
        };
        const v1 = getV(i * 3);
        const v2 = getV(i * 3 + 1);
        const v3 = getV(i * 3 + 2);

        positions.push(...v1, ...v2, ...v3);

        for (const v of [v1, v2, v3]) {
          if (v[0] < minX) minX = v[0]; if (v[0] > maxX) maxX = v[0];
          if (v[1] < minY) minY = v[1]; if (v[1] > maxY) maxY = v[1];
          if (v[2] < minZ) minZ = v[2]; if (v[2] > maxZ) maxZ = v[2];
        }

        signedVolumeAccumulator += (v1[0] * (v2[1] * v3[2] - v2[2] * v3[1]) +
                                    v1[1] * (v2[2] * v3[0] - v2[0] * v3[2]) +
                                    v1[2] * (v2[0] * v3[1] - v2[1] * v3[0]));
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.computeVertexNormals();
    }
  }

  // Run Three.js mesh health check
  const meshHealth = checkMeshHealth(geometry);

  const sizeX = Math.max(0, +(maxX - minX).toFixed(2));
  const sizeY = Math.max(0, +(maxY - minY).toFixed(2));
  const sizeZ = Math.max(0, +(maxZ - minZ).toFixed(2));

  const rawVol = Math.abs(signedVolumeAccumulator) / 6.0;
  const isWatertight = meshHealth.isWatertight && rawVol > 1.0;
  const volCm3 = isWatertight ? +(rawVol / 1000.0).toFixed(2) : null;

  const heuristicWarnings: string[] = [];
  if (meshHealth.openEdgesCount > 0) {
    heuristicWarnings.push(`Detectadas ${meshHealth.openEdgesCount} arestas abertas (buracos/faces não unidas na malha).`);
  }
  if (meshHealth.nonManifoldEdgesCount > 0) {
    heuristicWarnings.push(`Detectadas ${meshHealth.nonManifoldEdgesCount} arestas não-manifold que exigem reparo prévio.`);
  }
  if (meshHealth.invertedTrianglesCount > 0) {
    heuristicWarnings.push(`Detectados ${meshHealth.invertedTrianglesCount} triângulos com orientação de normal invertida.`);
  }
  if (meshHealth.degenerateFacesCount > 0) {
    heuristicWarnings.push(`Detectadas ${meshHealth.degenerateFacesCount} faces degeneradas (área nula) que podem gerar artefatos.`);
  }
  if (sizeX > 256 || sizeY > 256 || sizeZ > 256) {
    heuristicWarnings.push('Dimensão ultrapassa o volume padrão de 256x256x256mm da Bambu Lab.');
  }

  let orientationReason = 'Peça posicionada estavelmente na mesa de impressão.';
  if (sizeZ > sizeX && sizeZ > sizeY) {
    orientationReason = 'Peça vertical esguia. Deitá-la melhora resistência à tração e adesão à placa.';
  }

  return {
    fileName,
    triangleCount,
    boundingBox: {
      min: [+(minX.toFixed(2)), +(minY.toFixed(2)), +(minZ.toFixed(2))],
      max: [+(maxX.toFixed(2)), +(maxY.toFixed(2)), +(maxZ.toFixed(2))],
      size: [sizeX, sizeY, sizeZ],
    },
    isWatertight,
    estimatedVolumeCm3: volCm3,
    degenerateFaces: meshHealth.degenerateFacesCount,
    openEdgesCount: meshHealth.openEdgesCount,
    heuristicWarnings,
    recommendedOrientationReason: orientationReason,
    meshHealth,
  };
}
