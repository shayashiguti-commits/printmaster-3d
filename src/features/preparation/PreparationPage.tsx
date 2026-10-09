import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Box, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Info, 
  FileCode, 
  Rotate3d, 
  Maximize2, 
  ShieldCheck,
  Sparkles,
  ArrowRight,
  WifiOff,
  Package,
  Activity
} from 'lucide-react';
import { ThreeJsViewer } from './ThreeJsViewer.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { StlAnalysisResult, ThreeMfAnalysisResult, MeshHealthReport } from '../../types/index.ts';
import { generateSampleCubeStl, generateSampleOverhangStl, generateSampleDefectiveStl } from '../../data/bundledAtlas.ts';
import { analyzeStlClientSide } from '../../lib/clientGeometry.ts';
import { FileViewer } from '../../components/files/FileViewer.tsx';
import { MeshHealthReportCard } from './MeshHealthReportCard.tsx';
import { RecommendedProfilesSection } from './RecommendedProfilesSection.tsx';
import { FileTypePreset } from '../../types/index.ts';

export const PreparationPage: React.FC = () => {
  const { activePrinter, setActiveTab, setInitialChatPrompt, isOfflineDemo, slicerLanguage, setSlicerLanguage } = useApp();

  const [modelBuffer, setModelBuffer] = useState<ArrayBuffer | null>(null);
  const [fileType, setFileType] = useState<'stl' | '3mf'>('stl');
  const [stlAnalysis, setStlAnalysis] = useState<StlAnalysisResult | null>(null);
  const [threeMfAnalysis, setThreeMfAnalysis] = useState<ThreeMfAnalysisResult | null>(null);
  const [stepNotice, setStepNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [wireframe, setWireframe] = useState(false);

  // Objective Formulation Form
  const [goal, setGoal] = useState<'aesthetics' | 'strength' | 'precision' | 'speed' | 'economy'>('strength');
  const [chosenMaterial, setChosenMaterial] = useState('PLA');
  const [criticalLoadAxis, setCriticalLoadAxis] = useState<'z' | 'xy' | 'none'>('xy');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSampleModel = (type: 'cube' | 'overhang' | 'defective' | 'figure' | 'vase') => {
    setLoading(true);
    setThreeMfAnalysis(null);
    setStepNotice(null);
    setUploadedFile(null);

    let name = 'cubo_calibracao_20mm.stl';
    let buffer: ArrayBuffer;
    if (type === 'cube') {
      name = 'cubo_calibracao_20mm.stl';
      buffer = generateSampleCubeStl();
    } else if (type === 'overhang') {
      name = 'teste_balanco_45graus.stl';
      buffer = generateSampleOverhangStl();
    } else if (type === 'figure') {
      name = 'action_figure_cyber_samurai.stl';
      buffer = generateSampleOverhangStl();
      setGoal('aesthetics');
    } else if (type === 'vase') {
      name = 'vaso_espiral_decorativo_moderno.stl';
      buffer = generateSampleCubeStl();
      setGoal('economy');
    } else {
      name = 'teste_malha_com_defeitos.stl';
      buffer = generateSampleDefectiveStl();
    }

    setFileName(name);
    setFileType('stl');
    setModelBuffer(buffer);

    // Compute geometry client-side with Three.js
    const analysis = analyzeStlClientSide(buffer, name);
    setStlAnalysis(analysis);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setFileName(file.name);
    setStlAnalysis(null);
    setThreeMfAnalysis(null);
    setStepNotice(null);
    setModelBuffer(null);
    setLoading(true);

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'stl') {
      try {
        setFileType('stl');
        const arrayBuf = await file.arrayBuffer();
        setModelBuffer(arrayBuf);

        // Immediate high-precision client-side Three.js mesh health check
        const clientAnalysis = analyzeStlClientSide(arrayBuf, file.name);
        setStlAnalysis(clientAnalysis);

        if (isOfflineDemo) {
          setLoading(false);
          return;
        }

        // Online mode: attempt server analysis, enrich with server volumetric bounds if available
        try {
          const bytes = new Uint8Array(arrayBuf);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);

          const res = await fetch('/api/files/analyze-stl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64Data: base64, fileName: file.name }),
          });
          const data = await res.json();
          if (data.success && data.analysis) {
            setStlAnalysis({
              ...data.analysis,
              meshHealth: clientAnalysis.meshHealth,
            });
          }
        } catch {
          // Client analysis is already set
        }
      } catch (err) {
        console.error('Error parsing STL', err);
      } finally {
        setLoading(false);
      }
    } else if (ext === '3mf') {
      try {
        setFileType('3mf');
        const arrayBuf = await file.arrayBuffer();
        setModelBuffer(arrayBuf); // Pass ArrayBuffer to 3D Viewer!

        const bytes = new Uint8Array(arrayBuf);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        const res = await fetch('/api/files/analyze-3mf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data: base64, fileName: file.name }),
        });
        const data = await res.json();
        if (data.success && data.analysis) {
          setThreeMfAnalysis(data.analysis);
        }
      } catch (err) {
        console.error('Error analyzing 3MF', err);
      } finally {
        setLoading(false);
      }
    } else if (ext === 'step' || ext === 'stp') {
      setStepNotice('O formato STEP contém geometria analítica CAD (B-Rep / curvas NURBS). Para fatiamento em malha FDM, exporte seu CAD como STL de alta resolução (desvio cordal < 0.01mm) ou utilize o importador nativo do Bambu Studio em sua estação de trabalho.');
      setLoading(false);
    } else {
      alert('Formato não suportado. Por favor, envie um arquivo .STL ou .3MF.');
      setLoading(false);
    }
  };

  const handle3dModelLoaded = (info: { triangleCount: number; size: [number, number, number]; meshHealth?: MeshHealthReport }) => {
    if (info.meshHealth) {
      setStlAnalysis(prev => prev ? {
        ...prev,
        meshHealth: info.meshHealth,
        isWatertight: info.meshHealth!.isWatertight,
        openEdgesCount: info.meshHealth!.openEdgesCount,
        degenerateFaces: info.meshHealth!.degenerateFacesCount,
      } : {
        fileName,
        triangleCount: info.triangleCount,
        boundingBox: {
          min: [0, 0, 0],
          max: [info.size[0], info.size[1], info.size[2]],
          size: info.size,
        },
        isWatertight: info.meshHealth!.isWatertight,
        estimatedVolumeCm3: null,
        degenerateFaces: info.meshHealth!.degenerateFacesCount,
        openEdgesCount: info.meshHealth!.openEdgesCount,
        heuristicWarnings: [],
        recommendedOrientationReason: fileType === '3mf' 
          ? 'Orientação de fatiamento preservada do projeto original 3MF.'
          : 'Orientação geométrica carregada.',
        meshHealth: info.meshHealth,
      });
    } else if (!stlAnalysis) {
      setStlAnalysis({
        fileName,
        triangleCount: info.triangleCount,
        boundingBox: {
          min: [0, 0, 0],
          max: [info.size[0], info.size[1], info.size[2]],
          size: info.size,
        },
        isWatertight: true,
        estimatedVolumeCm3: null,
        degenerateFaces: 0,
        openEdgesCount: 0,
        heuristicWarnings: [],
        recommendedOrientationReason: fileType === '3mf' 
          ? 'Orientação de fatiamento preservada do projeto original 3MF.'
          : 'Orientação geométrica carregada.',
      });
    }
  };

  const handleSendToChat = (promptText: string) => {
    setInitialChatPrompt(promptText);
    setActiveTab('diagnostics');
  };

  // Generate recommendation recipe based on chosen goal
  const getSlicingRecipe = () => {
    switch (goal) {
      case 'aesthetics':
        return {
          title: 'Perfil Otimizado para Acabamento Visual',
          layerHeight: '0.12mm (ou Adaptive Layer Height ativado)',
          wallLoops: '3 perímetros',
          infill: '15% Gyroid',
          speed: 'Outer wall reduzida para 60 mm/s',
          supports: 'Tree (Árvore) com interface fina',
          seam: 'Scarf Joint Seam (ou Alinhada em quina traseira)',
          notes: 'Reduz marcas de camadas em superfícies inclinadas e suaviza transição de costura.',
        };
      case 'strength':
        return {
          title: 'Perfil Otimizado para Resistência Mecânica',
          layerHeight: '0.20mm',
          wallLoops: '4 a 5 perímetros (aumenta tração mais que infill)',
          infill: '25% a 35% Gyroid ou 3D Honeycomb',
          speed: 'Velocidade moderada para garantir fusão intercamadas',
          supports: 'Normal ou Tree conforme necessidade geométrica',
          seam: 'Aligned',
          notes: 'Orientar o modelo de forma que os esforços principais não tracionem a adesão entre camadas no eixo Z.',
        };
      case 'precision':
        return {
          title: 'Perfil Otimizado para Tolerâncias e Encaixes',
          layerHeight: '0.16mm',
          wallLoops: '3 perímetros',
          infill: '20% Gyroid',
          speed: 'Velocidades constantes nas paredes externas',
          supports: 'Evitar suportes em furos e eixos de encaixe',
          seam: 'Costura fora das faces de contato',
          notes: 'Se furos ficarem apertados, ajuste X-Y hole compensation no Bambu Studio entre +0.1mm e +0.15mm.',
        };
      case 'speed':
        return {
          title: 'Perfil Otimizado para Velocidade de Prototipagem',
          layerHeight: '0.24mm ou 0.28mm',
          wallLoops: '2 perímetros',
          infill: '10% a 15% Grid ou Cross Hatch',
          speed: 'Acelerações padrão da Bambu Lab',
          supports: 'Tree (Árvore) para mínimo gasto de tempo',
          seam: 'Nearest',
          notes: 'Menos camadas significa redução drástica de tempo de impressão.',
        };
      case 'economy':
        return {
          title: 'Perfil Otimizado para Economia de Filamento',
          layerHeight: '0.20mm',
          wallLoops: '2 ou 3 perímetros',
          infill: '8% a 12% Gyroid',
          speed: 'Padrão',
          supports: 'Tree com Threshold Angle restrito a 55°',
          seam: 'Aligned',
          notes: 'Minimiza material descartado e estruturas de suporte dispensáveis.',
        };
    }
  };

  const recipe = getSlicingRecipe();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Box className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Preparador Inteligente de Peças 3D</h1>
          </div>
          <p className="text-xs text-slate-400">
            Inspeção geométrica de malhas STL, análise de arquivos 3MF e consultoria de fatiamento por objetivo.
          </p>
        </div>

        {/* Upload & Sample Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".stl,.3mf,.step,.stp"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => loadSampleModel('figure')}
            title="Carregar exemplo de Action Figure para testar perfis de alta resolução"
            className="px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 text-xs font-semibold flex items-center gap-1.5 border border-purple-800/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Action Figure (Demo)</span>
          </button>

          <button
            onClick={() => loadSampleModel('vase')}
            title="Carregar exemplo de Vaso Decorativo para testar modo espiral"
            className="px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 border border-emerald-800/60 transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vaso Espiral (Demo)</span>
          </button>

          <button
            onClick={() => loadSampleModel('cube')}
            title="Carregar cubo de teste 20x20x20mm embutido (100% Manifold)"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Package className="w-3.5 h-3.5 text-blue-400" />
            <span>Cubo 20mm</span>
          </button>

          <button
            onClick={() => loadSampleModel('defective')}
            title="Carregar modelo com arestas abertas e faces invertidas para validar o relatório de saúde"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Malha c/ Defeito</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Importar do Computador</span>
          </button>
        </div>
      </div>

      {/* Recommended Slicing Profiles by File / Object Type (Action Figures, Vases, Mechanical, etc.) */}
      <RecommendedProfilesSection 
        currentFileName={fileName} 
        onLoadSampleModel={loadSampleModel}
      />

      {/* Main Grid: 3D Viewer & Analysis (7 cols) + Strategy Form (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Viewer & Geometric Metrics */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-[420px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                <Sparkles className="w-6 h-6 text-blue-400 animate-spin" />
                <span>Processando geometria e inspecionando malha no Three.js...</span>
              </div>
            ) : modelBuffer ? (
              <ThreeJsViewer 
                modelBuffer={modelBuffer} 
                fileType={fileType}
                wireframe={wireframe} 
                onModelLoaded={handle3dModelLoaded}
              />
            ) : stepNotice ? (
              <div className="h-full p-6 flex flex-col justify-center text-center space-y-3 max-w-md mx-auto">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Arquivo STEP Detectado</h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
                  {stepNotice}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-2xl">
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">Nenhum modelo carregado</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  Importe um arquivo .STL ou .3MF do seu computador ou experimente um dos modelos 3D embutidos offline:
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => loadSampleModel('cube')}
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-medium border border-blue-500/30 flex items-center gap-1.5 transition-colors"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Cubo 20mm (100% Manifold)</span>
                  </button>
                  <button
                    onClick={() => loadSampleModel('overhang')}
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-medium border border-purple-500/30 flex items-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Balanço 45° (Demo)</span>
                  </button>
                  <button
                    onClick={() => loadSampleModel('defective')}
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-medium border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Malha c/ Defeito (Demo)</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 transition-colors"
                  >
                    Selecionar Arquivo Local
                  </button>
                </div>
              </div>
            )}

            {/* Wireframe toggle overlay */}
            {modelBuffer && (
              <div className="absolute top-3 left-3 bg-slate-900/80 border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] text-slate-300 flex items-center gap-2 backdrop-blur-sm shadow">
                <input
                  type="checkbox"
                  id="wf"
                  checked={wireframe}
                  onChange={e => setWireframe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <label htmlFor="wf" className="cursor-pointer font-medium">Modo Wireframe</label>
              </div>
            )}
          </div>

          {/* Three.js Mesh Health Report Card */}
          {stlAnalysis?.meshHealth && (
            <MeshHealthReportCard
              report={stlAnalysis.meshHealth}
              fileName={fileName}
              onSendToChat={handleSendToChat}
              onToggleWireframe={() => setWireframe(!wireframe)}
              isWireframe={wireframe}
            />
          )}

          {/* Technical FileViewer Component with File Metadata, Signature & Metrics */}
          {modelBuffer && (
            <FileViewer
              file={uploadedFile}
              customMetadata={{
                name: fileName,
                sizeBytes: modelBuffer.byteLength,
                lastModified: uploadedFile?.lastModified || Date.now(),
                extension: fileType,
                mimeType: fileType === '3mf' ? 'model/3mf' : 'model/stl',
              }}
              analysis={stlAnalysis}
              threeMfAnalysis={threeMfAnalysis}
              buffer={modelBuffer}
              onClear={() => {
                setModelBuffer(null);
                setStlAnalysis(null);
                setThreeMfAnalysis(null);
                setUploadedFile(null);
                setFileName('');
              }}
            />
          )}

          {/* Orientation and Heuristic Warnings if any */}
          {stlAnalysis && stlAnalysis.heuristicWarnings.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Avisos Heurísticos de Fatiamento</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {stlAnalysis.heuristicWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {stlAnalysis?.recommendedOrientationReason && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
              <strong>Análise de Orientação Heurística: </strong>{stlAnalysis.recommendedOrientationReason}
            </div>
          )}
        </div>

        {/* Right Column: Slicing Strategy & Goal Formulation */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-lg">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Qual o objetivo prioritário desta impressão?</h3>
              <p className="text-xs text-slate-400">
                Selecione o compromisso técnico principal para gerar a estratégia de fatiamento.
              </p>
            </div>

            {/* Goal Selectors */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'strength', label: 'Resistência Mecânica & Carga', desc: 'Prioriza perímetro e densidade com Gyroid' },
                { id: 'aesthetics', label: 'Acabamento Visual & Estética', desc: 'Camadas finas, Scarf seam e superfícies suaves' },
                { id: 'precision', label: 'Precisão Dimensional & Encaixes', desc: 'Compensação XY e tolerância para parafusos' },
                { id: 'speed', label: 'Rapidez de Prototipagem', desc: 'Maior altura de camada e preenchimento ágil' },
                { id: 'economy', label: 'Economia de Filamento', desc: 'Redução de suporte e paredes otimizadas' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setGoal(item.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    goal === item.id
                      ? 'bg-blue-600/15 border-blue-500 text-white'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{item.label}</span>
                    {goal === item.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>

            {/* Material Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-300">Material Planejado:</label>
              <select
                value={chosenMaterial}
                onChange={e => setChosenMaterial(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="PLA">PLA (Básico / Visual)</option>
                <option value="PETG">PETG (Tênaz / Resistente a Impacto)</option>
                <option value="ABS">ABS (Exige Câmara Fechada)</option>
                <option value="ASA">ASA (Resistente a UV)</option>
                <option value="TPU">TPU (Flexível / Carretel Externo)</option>
                <option value="PA-CF">PA-CF (Fibra de Carbono / Bico Endurecido)</option>
              </select>
            </div>
          </div>

          {/* Slicing Checklist Card */}
          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                <span>Checklist no Bambu Studio</span>
              </div>

              {/* In-place Slicer Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/80 text-[10px]">
                <button
                  onClick={() => setSlicerLanguage('pt')}
                  className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                    slicerLanguage === 'pt' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Fatiador em Português"
                >
                  PT
                </button>
                <button
                  onClick={() => setSlicerLanguage('en')}
                  className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                    slicerLanguage === 'en' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Slicer in English"
                >
                  EN
                </button>
                <button
                  onClick={() => setSlicerLanguage('bilingual')}
                  className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                    slicerLanguage === 'bilingual' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Bilíngue PT+EN"
                >
                  PT+EN
                </button>
              </div>
            </div>

            <h4 className="text-sm font-bold text-white">{recipe.title}</h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">
                  {slicerLanguage === 'pt' ? 'Altura da Camada:' : slicerLanguage === 'en' ? 'Layer Height:' : 'Altura da Camada (Layer Height):'}
                </span>
                <strong className="text-white font-mono">{recipe.layerHeight}</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">
                  {slicerLanguage === 'pt' ? 'Paredes (Wall loops):' : slicerLanguage === 'en' ? 'Wall Loops (Perimeters):' : 'Linhas de Parede (Wall Loops):'}
                </span>
                <strong className="text-white font-mono">{recipe.wallLoops}</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">
                  {slicerLanguage === 'pt' ? 'Preenchimento:' : slicerLanguage === 'en' ? 'Sparse Infill:' : 'Preenchimento (Infill):'}
                </span>
                <strong className="text-white font-mono">{recipe.infill}</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">
                  {slicerLanguage === 'pt' ? 'Velocidade de Impressão:' : slicerLanguage === 'en' ? 'Print Speed:' : 'Velocidade (Print Speed):'}
                </span>
                <strong className="text-white font-mono">{recipe.speed}</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">
                  {slicerLanguage === 'pt' ? 'Tipo de Suporte:' : slicerLanguage === 'en' ? 'Support Type:' : 'Suportes (Support Type):'}
                </span>
                <strong className="text-white font-mono">{recipe.supports}</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
              <strong>Justificativa técnica: </strong>{recipe.notes}
            </p>

            <button
              onClick={() => {
                setInitialChatPrompt(`Gostaria de uma consultoria técnica detalhada para preparar minha peça "${fileName || 'modelo'}" para o objetivo "${recipe.title}" usando ${chosenMaterial} na ${activePrinter}.`);
                setActiveTab('diagnostics');
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Refinar Preparação com a IA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
