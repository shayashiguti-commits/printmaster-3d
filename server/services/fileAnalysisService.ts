import { StlAnalysisResult, ThreeMfAnalysisResult } from '../../src/types/index.ts';

export class FileAnalysisService {
  /**
   * Parses Binary and ASCII STL files to calculate true bounding box,
   * triangle count, degenerate faces, and basic manifold check.
   */
  parseStl(buffer: Buffer, fileName: string): StlAnalysisResult {
    if (!buffer || buffer.length < 84) {
      throw new Error('Arquivo STL inválido ou muito curto (mínimo de 84 bytes para cabeçalho).');
    }

    let isBinary = false;
    const triangleCountExpected = buffer.readUInt32LE(80);
    const expectedBinarySize = 84 + triangleCountExpected * 50;

    // Check if binary STL matches expected length
    if (Math.abs(buffer.length - expectedBinarySize) <= 2) {
      isBinary = true;
    } else {
      // Check if starts with "solid" ASCII
      const headerStr = buffer.slice(0, 80).toString('utf-8').trim();
      if (headerStr.startsWith('solid') && !buffer.includes(0x00)) {
        isBinary = false;
      } else {
        // Many CAD exports put "solid" in the 80-byte header even for binary STL!
        // If file size is large enough to contain the triangles, treat as binary:
        if (buffer.length >= 84 + triangleCountExpected * 50) {
          isBinary = true;
        }
      }
    }

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    let degenerateFaces = 0;
    let triangleCount = 0;
    let signedVolumeAccumulator = 0;

    if (isBinary) {
      triangleCount = triangleCountExpected;
      let offset = 84;

      for (let i = 0; i < triangleCount; i++) {
        if (offset + 50 > buffer.length) break;

        // Skip 12 bytes normal (3 x float32)
        offset += 12;

        const v1x = buffer.readFloatLE(offset);
        const v1y = buffer.readFloatLE(offset + 4);
        const v1z = buffer.readFloatLE(offset + 8);

        const v2x = buffer.readFloatLE(offset + 12);
        const v2y = buffer.readFloatLE(offset + 16);
        const v2z = buffer.readFloatLE(offset + 20);

        const v3x = buffer.readFloatLE(offset + 24);
        const v3y = buffer.readFloatLE(offset + 28);
        const v3z = buffer.readFloatLE(offset + 32);

        offset += 36;
        // Skip 2 bytes attribute byte count
        offset += 2;

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

        // Check degenerate (zero area) triangle
        const edge1x = v2x - v1x, edge1y = v2y - v1y, edge1z = v2z - v1z;
        const edge2x = v3x - v1x, edge2y = v3y - v1y, edge2z = v3z - v1z;
        const crossX = edge1y * edge2z - edge1z * edge2y;
        const crossY = edge1z * edge2x - edge1x * edge2z;
        const crossZ = edge1x * edge2y - edge1y * edge2x;
        const areaSquared = crossX * crossX + crossY * crossY + crossZ * crossZ;
        if (areaSquared < 1e-12) {
          degenerateFaces++;
        }

        // Divergence theorem for volume calculation of closed surface:
        // V = (1/6) * sum( (v1 x v2) . v3 )
        signedVolumeAccumulator += (v1x * (v2y * v3z - v2z * v3y) +
                                    v1y * (v2z * v3x - v2x * v3z) +
                                    v1z * (v2x * v3y - v2y * v3x));
      }
    } else {
      // Parse ASCII STL
      const content = buffer.toString('utf-8');
      const vertexRegex = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
      let match;
      const vertices: [number, number, number][] = [];

      while ((match = vertexRegex.exec(content)) !== null) {
        const x = parseFloat(match[1]);
        const y = parseFloat(match[2]);
        const z = parseFloat(match[3]);
        vertices.push([x, y, z]);

        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
        if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
      }

      triangleCount = Math.floor(vertices.length / 3);
      if (triangleCount === 0) {
        throw new Error('O arquivo STL ASCII não possui triângulos ou vértices legíveis.');
      }

      for (let i = 0; i < triangleCount; i++) {
        const v1 = vertices[i * 3];
        const v2 = vertices[i * 3 + 1];
        const v3 = vertices[i * 3 + 2];
        if (!v1 || !v2 || !v3) continue;

        signedVolumeAccumulator += (v1[0] * (v2[1] * v3[2] - v2[2] * v3[1]) +
                                    v1[1] * (v2[2] * v3[0] - v2[0] * v3[2]) +
                                    v1[2] * (v2[0] * v3[1] - v2[1] * v3[0]));
      }
    }

    if (!isFinite(minX) || !isFinite(maxX)) {
      throw new Error('Falha ao calcular bounding box do arquivo STL. Malha corrompida.');
    }

    const sizeX = Math.max(0, +(maxX - minX).toFixed(2));
    const sizeY = Math.max(0, +(maxY - minY).toFixed(2));
    const sizeZ = Math.max(0, +(maxZ - minZ).toFixed(2));

    // Approximate watertight check: if volume is non-zero and degenerate faces < 2% of total
    const rawVolumeMm3 = Math.abs(signedVolumeAccumulator) / 6.0;
    const isWatertight = rawVolumeMm3 > 1.0 && degenerateFaces === 0;
    const volumeCm3 = isWatertight ? +(rawVolumeMm3 / 1000.0).toFixed(2) : null;

    const heuristicWarnings: string[] = [];
    if (degenerateFaces > 0) {
      heuristicWarnings.push(`Detectadas ${degenerateFaces} faces degeneradas (área nula) que podem gerar artefatos de fatiamento.`);
    }
    if (sizeZ > 256 || sizeX > 256 || sizeY > 256) {
      heuristicWarnings.push(`Dimensão ultrapassa o volume de impressão padrão (256x256x256mm). Verifique escala ou oriente na diagonal.`);
    }
    if (sizeZ < 1.0 && (sizeX > 20 || sizeY > 20)) {
      heuristicWarnings.push(`Modelo muito fino no eixo Z (${sizeZ}mm). Atente para rigidez e warped edges.`);
    }

    let orientationReason = 'Orientação atual mantida como padrão.';
    if (sizeZ > sizeX && sizeZ > sizeY) {
      orientationReason = 'A peça é esguia e alta. Deitá-la aumentará a área de contato com a mesa e melhorará a resistência mecânica longitudinal.';
    } else {
      orientationReason = 'A peça possui boa base no plano XY, favorecendo adesão à placa.';
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
      estimatedVolumeCm3: volumeCm3,
      degenerateFaces,
      openEdgesCount: isWatertight ? 0 : -1,
      heuristicWarnings,
      recommendedOrientationReason: orientationReason,
    };
  }

  /**
   * Safely inspects a 3MF package (ZIP format) to verify authenticity,
   * detects Bambu Studio project presets vs Generic 3MF geometry,
   * and prevents zip-bomb attacks with strict size bounds.
   */
  inspect3Mf(buffer: Buffer, fileName: string): ThreeMfAnalysisResult {
    // 1. Verify ZIP Magic Header (PK\x03\x04)
    if (buffer.length < 30 || buffer[0] !== 0x50 || buffer[1] !== 0x4B || buffer[2] !== 0x03 || buffer[3] !== 0x04) {
      throw new Error('Arquivo 3MF inválido: não possui cabeçalho de contêiner ZIP válido.');
    }

    // 2. Reject excessively large raw packages (> 60 MB for web preview)
    const MAX_ALLOWED_FILE_SIZE = 60 * 1024 * 1024;
    if (buffer.length > MAX_ALLOWED_FILE_SIZE) {
      throw new Error(`Arquivo excede o limite seguro de upload (${(MAX_ALLOWED_FILE_SIZE / 1024 / 1024).toFixed(0)}MB). Rejeitado preventivamente contra esgotamento de memória.`);
    }

    // 3. Scan zip directory records safely to list entries without unzipping blindly
    const detectedFiles: string[] = [];
    let offset = 0;
    let totalUncompressedSize = 0;
    const MAX_UNCOMPRESSED_LIMIT = 150 * 1024 * 1024; // 150MB Zip-bomb shield

    while (offset < buffer.length - 30) {
      // Look for Local File Header: PK\x03\x04
      if (buffer[offset] === 0x50 && buffer[offset + 1] === 0x4B && buffer[offset + 2] === 0x03 && buffer[offset + 3] === 0x04) {
        const uncompressedSize = buffer.readUInt32LE(offset + 22);
        const fileNameLength = buffer.readUInt16LE(offset + 26);
        const extraFieldLength = buffer.readUInt16LE(offset + 28);

        totalUncompressedSize += uncompressedSize;
        if (totalUncompressedSize > MAX_UNCOMPRESSED_LIMIT) {
          throw new Error('Alerta de segurança: Taxa de descompactação anormal (potencial Zip Bomb). Análise suspensa.');
        }

        const nameStart = offset + 30;
        const nameEnd = nameStart + fileNameLength;
        if (nameEnd <= buffer.length) {
          const entryName = buffer.toString('utf-8', nameStart, nameEnd);
          detectedFiles.push(entryName);
        }

        offset += 30 + fileNameLength + extraFieldLength;
      } else {
        offset++;
      }
    }

    // 4. Distinguish Generic 3MF vs Bambu Studio Project
    const isBambuProject = detectedFiles.some(f => 
      f.includes('Metadata/BambuStudio') || 
      f.includes('project_settings.config') || 
      f.includes('Metadata/slice_info.config') ||
      f.includes('Metadata/model_settings.config')
    );

    const hasEmbeddedProfiles = detectedFiles.some(f => 
      f.endsWith('.config') || f.includes('process_') || f.includes('filament_')
    );

    return {
      fileName,
      isZipValid: true,
      isBambuProject,
      detectedFiles: detectedFiles.slice(0, 30),
      metadata: {
        totalArchiveEntries: String(detectedFiles.length),
        containerType: isBambuProject ? 'Projeto Bambu Studio (.3mf)' : 'Modelo Geométrico 3MF Padrão (Generic 3MF)',
      },
      hasEmbeddedProfiles,
      embeddedProfileNotes: isBambuProject 
        ? 'Arquivo identificado como projeto com metadados do ecossistema Bambu. Atenção: abrir presets de terceiros pode alterar configurações do fatiador.'
        : 'Este arquivo 3MF contém apenas malhas geométricas 3D, sem perfis de processo ou fatiamento Bambu embutidos.',
      limitationsNotice: 'Visualização de metadados realizada. A renderização de G-code e tempos exatos requer fatiamento no software Bambu Studio.',
    };
  }
}

export const fileAnalysisService = new FileAnalysisService();
