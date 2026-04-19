import React from 'react';
import { Wand2, ChevronDown } from 'lucide-react';
import {
  NailDesignState, NailShape, NailLength, NailFinish,
  NailArtStyle, BaseColorFamily
} from './types';

interface ControlPanelProps {
  design: NailDesignState;
  setDesign: React.Dispatch<React.SetStateAction<NailDesignState>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all w-full ${
        value
          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
          : 'bg-slate-800 border-slate-700 text-slate-400'
      }`}
    >
      <div className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${value ? 'bg-indigo-500' : 'bg-slate-600'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-5' : 'left-1'}`} />
      </div>
      <span className="text-sm font-medium text-left">{label}</span>
    </button>
  );
}

function Select({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none pr-10"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0"
      />
      <div className="flex flex-col">
        <span className="text-sm text-white font-medium">Custom Color</span>
        <span className="text-xs text-slate-400 font-mono uppercase">{value}</span>
      </div>
    </div>
  );
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  design, setDesign, onGenerate, isGenerating,
}) => {
  const set = (key: keyof NailDesignState, value: any) =>
    setDesign((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-white mb-1">Design Studio</h2>
        <p className="text-slate-400 text-sm">Build your perfect manicure.</p>
      </div>

      {/* Toggle Options */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Options</h3>
        <Toggle
          label={`Show cuticles: ${design.showCuticles ? 'Yes' : 'No'}`}
          value={design.showCuticles}
          onChange={(v) => set('showCuticles', v)}
        />
        <Toggle
          label={`Custom color: ${design.useCustomColor ? 'Yes' : 'No'}`}
          value={design.useCustomColor}
          onChange={(v) => set('useCustomColor', v)}
        />
      </div>

      {/* Color Family */}
      {!design.useCustomColor && (
        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Color Family</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(BaseColorFamily).map((c) => (
              <button
                key={c}
                onClick={() => set('baseColorFamily', c)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  design.baseColorFamily === c
                    ? 'bg-pink-500/20 border-pink-500 text-pink-200'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Color */}
      {design.useCustomColor && (
        <ColorPicker value={design.customColor} onChange={(v) => set('customColor', v)} />
      )}

      {/* Shape & Length */}
      <div className="grid grid-cols-2 gap-4">
        <Select label="Shape" value={design.shape} options={Object.values(NailShape)} onChange={(v) => set('shape', v)} />
        <Select label="Length" value={design.length} options={Object.values(NailLength)} onChange={(v) => set('length', v)} />
      </div>

      {/* Finish */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Finish / Texture</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(NailFinish).map((f) => (
            <button
              key={f}
              onClick={() => set('finish', f)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                design.finish === f
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Art Style */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Art Style</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(NailArtStyle).map((s) => (
            <button
              key={s}
              onClick={() => set('artStyle', s)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                design.artStyle === s
                  ? 'bg-pink-500/20 border-pink-500 text-pink-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Pattern */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Custom Pattern (optional)</label>
        <textarea
          value={design.patternPrompt}
          onChange={(e) => set('patternPrompt', e.target.value)}
          placeholder="e.g., Cherry blossom with gold flakes, minimalist lines..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none min-h-[80px] placeholder:text-slate-600"
        />
      </div>

      {/* Nail Count */}
      <div className="space-y-2">
        <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">
          Number of Nails: <span className="text-white">{design.nailCount}</span>
        </label>
        <div className="flex gap-2">
          {[5, 10, 15, 20].map((n) => (
            <button
              key={n}
              onClick={() => set('nailCount', n)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                design.nailCount === n
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-auto pt-4 pb-2">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${
            isGenerating
              ? 'bg-slate-700 cursor-not-allowed opacity-70'
              : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-500/25'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Generate Nail Art</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
