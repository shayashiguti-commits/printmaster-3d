import React, { useState } from 'react';
import { 
  FileCode, 
  FileText, 
  HardDrive, 
  Calendar, 
  ShieldCheck, 
  Copy, 
  Check, 
  Layers, 
  Box, 
  Hash, 
  AlertCircle, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Binary
} from 'lucide-react';
import { StlAnalysisResult, ThreeMfAnalysisResult } from '../../types/index.ts';

export interface FileMetadata {
  name: string;
  sizeBytes: number;
  lastModified?: number | Date;
  mimeType?: string;
  extension: string;
  magicHeader?: string;
  isBambuProject?: boolean;
}

interface FileViewerProps {
  file?: File | null;
  customMetadata?: FileMetadata | null;
  analysis?: StlAnalysisResult | null;
  threeMfAnalysis?: ThreeMfAnalysisResult | null;
  buffer?: ArrayBuffer | null;
  onClear?: () => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  file,
  customMetadata,
  analysis,
  threeMfAnalysis,
  buffer,
  onClear
}) => {
  const [copied, setCopied] = useState(false);
  const [showHexPreview, setShowHexPreview] = useState(false);

  // Derive metadata from File or custom metadata
  const fileName = customMetadata?.name || file?.name || 'arquivo_desconhecido';
  const sizeBytes = customMetadata?.sizeBytes ?? (file?.size || buffer?.byteLength || 0);
  const lastModified = customMetadata?.lastModified || file?.lastModified || Date.now();
  const ext = (fileName.split('.').pop() || '').toLowerCase();

  // Detect signature / magic bytes from buffer
  let magicHeader = 'Não disponível';
  let detectedTypeLabel = 'Arquivo de Dados';
  let securityStatus = 'Seguro (Processamento Local no Navegador)';

  if (buffer && buffer.byteLength >= 4) {
    const view = new DataView(buffer);
    const b0 = view.getUint8(0);
    const b1 = view.getUint8(1);
    const b2 = view.getUint8(2);
    const b3 = view.getUint8(3);

    // ZIP (3MF) check: 0x50, 0x4B, 0x03, 0x04
    if (b0 === 0x50 && b1 === 0x4B && b2 === 0x03 && b3 === 0x04) {
      magicHeader = 'PK\\x03\\x04 (Contêiner ZIP Padrão)';
      detectedTypeLabel = threeMfAnalysis?.isBambuProject
        ? 'Projeto Bambu Studio (.3mf com Presets)'
        : 'Arquivo Geométrico 3MF (Generic 3MF)';
    } else if (buffer.byteLength >= 84) {
      // Check binary STL
      const decoder = new TextDecoder('utf-8');
      const headerSnippet = decoder.decode(buffer.slice(0, 30)).replace(/[^\x20-\x7E]/g, '.');
      if (headerSnippet.toLowerCase().includes('solid')) {
        magicHeader = 'ASCII / Binary STL Solid Header';
      } else {
        magicHeader = `STL Binário (Header: "${headerSnippet.slice(0, 20)}...")`;
      }
      detectedTypeLabel = 'Malha Triangular 3D (.stl)';
    }
  }

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB (${bytes.toLocaleString('pt-BR')} bytes)`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB (${bytes.toLocaleString('pt-BR')} bytes)`;
  };

  // Format date
  const formatDate = (dateInput: number | Date): string => {
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? 'Data desconhecida' : d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Generate Hex snippet of first 64 bytes
  const getHexDumpSnippet = (): string => {
    if (!buffer || buffer.byteLength === 0) return 'Buffer vazio.';
    const limit = Math.min(64, buffer.byteLength);
    const u8 = new Uint8Array(buffer, 0, limit);
    let hex = '';
    let ascii = '';
    let output = '';

    for (let i = 0; i < limit; i++) {
      hex += u8[i].toString(16).padStart(2, '0') + ' ';
      ascii += (u8[i] >= 32 && u8[i] <= 126) ? String.fromCharCode(u8[i]) : '.';
      if ((i + 1) % 16 === 0 || i === limit - 1) {
        output += `${(i - (i % 16)).toString(16).padStart(4, '0')}:  ${hex.padEnd(48, ' ')} |${ascii}|\n`;
        hex = '';
        ascii = '';
      }
    }
    return output;
  };

  const handleCopySummary = () => {
    const summary = `[METADADOS DO ARQUIVO: ${fileName}]
Tipo Detectado: ${detectedTypeLabel}
Extensão: .${ext}
Tamanho: ${formatSize(sizeBytes)}
Data: ${formatDate(lastModified)}
Assinatura: ${magicHeader}
Triângulos: ${analysis?.triangleCount || 'N/A'}
Bounding Box: ${analysis ? `${analysis.boundingBox.size.join(' × ')} mm` : 'N/A'}
Saúde da Malha (Three.js): ${analysis?.meshHealth ? `${analysis.meshHealth.healthScore}/100 (${analysis.meshHealth.overallStatus})` : 'N/A'}
Manifold: ${analysis?.meshHealth ? (analysis.meshHealth.isManifold ? 'Sim' : 'Não') : 'N/A'}
Arestas Abertas: ${analysis?.meshHealth ? analysis.meshHealth.openEdgesCount : (analysis ? analysis.openEdgesCount : 'N/A')}
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
      {/* Top Header */}
      <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {fileName}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                .{ext}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {detectedTypeLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            title="Copiar relatório técnico de metadados"
            className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar Dados'}</span>
          </button>
          {onClear && (
            <button
              onClick={onClear}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-700 transition-colors"
            >
              Fechar
            </button>
          )}
        </div>
      </div>

      {/* Main Metadata Grid */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Size Card */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Tamanho do Arquivo</span>
            </div>
            <p className="text-xs font-bold text-white font-mono">
              {formatSize(sizeBytes)}
            </p>
          </div>

          {/* Date Card */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Data de Modificação</span>
            </div>
            <p className="text-xs font-bold text-white font-mono">
              {formatDate(lastModified)}
            </p>
          </div>

          {/* Ext & Signature */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Binary className="w-3.5 h-3.5 text-purple-400" />
              <span>Cabeçalho / Assinatura</span>
            </div>
            <p className="text-xs font-bold text-white font-mono truncate" title={magicHeader}>
              {magicHeader}
            </p>
          </div>

          {/* Security Status */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Segurança da Visualização</span>
            </div>
            <p className="text-xs font-bold text-emerald-400 truncate">
              {securityStatus}
            </p>
          </div>
        </div>

        {/* 3MF Project Specific Properties */}
        {threeMfAnalysis && (
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300">
                Propriedades do Contêiner 3MF ({threeMfAnalysis.isBambuProject ? 'Bambu Studio' : 'Genérico'})
              </span>
              <span className="text-[10px] text-blue-400 font-mono">
                {threeMfAnalysis.metadata.totalArchiveEntries || 0} arquivos internos no pacote ZIP
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {threeMfAnalysis.embeddedProfileNotes}
            </p>
            {threeMfAnalysis.detectedFiles.length > 0 && (
              <div className="text-[11px] text-slate-400 pt-1">
                <strong>Principais entradas detectadas: </strong>
                <span className="font-mono text-slate-300">
                  {threeMfAnalysis.detectedFiles.slice(0, 5).join(', ')}
                  {threeMfAnalysis.detectedFiles.length > 5 ? '...' : ''}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Geometry Metrics if computed */}
        {analysis && (
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-blue-400" />
                <span>Geometria Tridimensional Calculada</span>
              </span>
              <div className="flex items-center gap-2">
                {analysis.meshHealth && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                    analysis.meshHealth.overallStatus === 'perfect' ? 'bg-emerald-500/20 text-emerald-300' :
                    analysis.meshHealth.overallStatus === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    Saúde: {analysis.meshHealth.healthScore}/100
                  </span>
                )}
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                  analysis.isWatertight ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {analysis.isWatertight ? 'Malha Fechada (Watertight)' : 'Superfície Aberta'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/60">
                <span className="text-[10px] text-slate-400 block">Bounding Box X</span>
                <strong className="text-white font-mono">{analysis.boundingBox.size[0]} mm</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60">
                <span className="text-[10px] text-slate-400 block">Bounding Box Y</span>
                <strong className="text-white font-mono">{analysis.boundingBox.size[1]} mm</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60">
                <span className="text-[10px] text-slate-400 block">Bounding Box Z</span>
                <strong className="text-white font-mono">{analysis.boundingBox.size[2]} mm</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60">
                <span className="text-[10px] text-slate-400 block">Triângulos na Malha</span>
                <strong className="text-white font-mono">{analysis.triangleCount.toLocaleString('pt-BR')}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Collapsible Hex Header Inspection */}
        {buffer && (
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowHexPreview(!showHexPreview)}
              className="w-full p-2.5 px-3 bg-slate-850 hover:bg-slate-800 text-left flex items-center justify-between text-xs text-slate-300 font-medium transition-colors"
            >
              <div className="flex items-center gap-2">
                <Binary className="w-3.5 h-3.5 text-purple-400" />
                <span>Inspecionar Cabeçalho Hexadecimal (Bytes Iniciais)</span>
              </div>
              {showHexPreview ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showHexPreview && (
              <div className="p-3 bg-slate-950 border-t border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed select-all">
                {getHexDumpSnippet()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
