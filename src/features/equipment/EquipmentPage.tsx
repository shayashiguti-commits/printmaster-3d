import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Plus, 
  Trash2, 
  Check, 
  Layers, 
  AlertTriangle, 
  Thermometer, 
  Wind, 
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { UserEquipment, FilamentType, PrinterModel } from '../../types/index.ts';

export const EquipmentPage: React.FC = () => {
  const { myEquipment, refreshEquipment, activePrinter, setActivePrinter } = useApp();
  const [filaments, setFilaments] = useState<FilamentType[]>([]);
  const [printersCatalogue, setPrintersCatalogue] = useState<PrinterModel[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Equipment Form
  const [name, setName] = useState('');
  const [modelId, setModelId] = useState('printer-bambu-lab-p1s');
  const [nozzleSize, setNozzleSize] = useState('0.4mm Aço Temperado');
  const [plateType, setPlateType] = useState('Textured PEI Plate');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/filaments').then(r => r.json()),
      fetch('/api/printer-models').then(r => r.json()),
    ]).then(([filData, printData]) => {
      if (filData.success) setFilaments(filData.filaments);
      if (printData.success) setPrintersCatalogue(printData.printers);
    });
  }, []);

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          model_id: modelId,
          nozzle_size: nozzleSize,
          plate_type: plateType,
          notes: notes.trim(),
          is_default: myEquipment.length === 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await refreshEquipment();
        setShowAddModal(false);
        setName('');
        setNotes('');
      }
    } catch (err) {
      console.error('Error adding equipment', err);
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm('Deseja realmente remover esta impressora do seu perfil?')) return;
    try {
      const res = await fetch(`/api/equipment/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await refreshEquipment();
      }
    } catch (err) {
      console.error('Error deleting equipment', err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Printer className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Equipamentos & Materiais</h1>
          </div>
          <p className="text-xs text-slate-400">
            Gerencie suas impressoras cadastradas e consulte propriedades técnicas dos filamentos compatíveis.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Impressora</span>
        </button>
      </div>

      {/* User's Printer Fleet */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <span>Minhas Impressoras Ativas ({myEquipment.length})</span>
        </h2>

        {myEquipment.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl text-slate-400 text-xs">
            Nenhuma impressora personalizada cadastrada ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myEquipment.map(eq => {
              const isCurrent = activePrinter.includes(eq.name) || activePrinter.includes(eq.model_id);
              return (
                <div
                  key={eq.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-slate-850 border-blue-500/60 shadow-lg shadow-blue-500/5'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">{eq.name}</h3>
                      <p className="text-[11px] text-blue-400 font-medium">{eq.manufacturer} ({eq.model_id})</p>
                    </div>
                    {isCurrent ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                        Ativa
                      </span>
                    ) : (
                      <button
                        onClick={() => setActivePrinter(eq.name)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      >
                        Tornar Ativa
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <p><strong>Bico:</strong> {eq.nozzle_size}</p>
                    <p><strong>Placa Padrão:</strong> {eq.plate_type}</p>
                    {eq.notes && <p className="text-slate-400 text-[11px] italic">{eq.notes}</p>}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                    <button
                      onClick={() => handleDeleteEquipment(eq.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filament Technical Catalogue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Catálogo Técnico de Filamentos</span>
            </h2>
            <p className="text-xs text-slate-400">
              Diretrizes de secagem, compatibilidade e temperatura recomendada.
            </p>
          </div>
          <span className="text-[11px] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
            *Valores exatos devem sempre ser conferidos no carretel do fabricante
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filaments.map(mat => (
            <div
              key={mat.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{mat.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  FDM
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {mat.notes}
              </p>

              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div className="flex items-center gap-2 text-[11px]">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Temp. Bico:</strong> {mat.temperature_range || 'Consultar fabricante'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Wind className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span><strong>Secagem:</strong> {mat.drying_settings || 'Manter em local seco'}</span>
                </div>
              </div>

              {mat.printer_compatible && (
                <div className="pt-2 text-[10px] text-slate-400 flex flex-wrap gap-1">
                  <span className="font-semibold text-slate-400">Compatível:</span>
                  {mat.printer_compatible.map(p => (
                    <span key={p} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <form onSubmit={handleAddEquipment} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Cadastrar Nova Impressora</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Apelido da Máquina:</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Bambu P1S Oficina"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Modelo:</label>
              <select
                value={modelId}
                onChange={e => setModelId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {printersCatalogue.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.manufacturer} {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tamanho/Tipo de Bico:</label>
              <select
                value={nozzleSize}
                onChange={e => setNozzleSize(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="0.2mm Aço Temperado">0.2mm Aço Temperado (Alta Definição)</option>
                <option value="0.4mm Aço Temperado">0.4mm Aço Temperado (Padrão)</option>
                <option value="0.4mm Aço Inox">0.4mm Aço Inox</option>
                <option value="0.6mm Aço Temperado">0.6mm Aço Temperado (Resistência / Fibras)</option>
                <option value="0.8mm Aço Temperado">0.8mm Aço Temperado (Vazão Rápida)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Placa de Impressão Instalada:</label>
              <select
                value={plateType}
                onChange={e => setPlateType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Textured PEI Plate">Placa PEI Texturizada (Textured PEI Plate)</option>
                <option value="Smooth PEI Plate">Placa PEI Lisa (Smooth PEI Plate)</option>
                <option value="High Temperature Plate">Placa Alta Temperatura (Smooth PEI)</option>
                <option value="Cool Plate">Placa Fria (Cool Plate com cola)</option>
                <option value="Engineering Plate">Placa de Engenharia (Engineering Plate)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Observações adicionais:</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ex: Equipada com AMS, tampa ventilada impressa para PLA."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none h-16"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Salvar Impressora
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
