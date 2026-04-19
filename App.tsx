import React, { useState } from 'react';
import { Download, Eraser, Sparkles, Share2, Info, Facebook, Twitter, Palette } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { NailDesignState, DEFAULT_DESIGN } from './types';
import { generateNailArt } from './geminiService';

const PRESET_DESIGNS = [
  {
    id: '1',
    name: 'Classic French',
    color: '#fce4ec',
    colorFamily: 'Pink / Rose',
    style: 'French Tip',
    shape: 'Almond',
    length: 'Medium',
    finish: 'Glossy',
    pattern: 'Classic white french tips',
  },
  {
    id: '2',
    name: 'Midnight Galaxy',
    color: '#1a237e',
    colorFamily: 'Purple / Lavender',
    style: 'Galaxy / Space',
    shape: 'Almond',
    length: 'Long',
    finish: 'Glitter / Sparkle',
    pattern: 'Galaxy theme with stars and nebula',
  },
  {
    id: '3',
    name: 'Ruby Red Stiletto',
    color: '#d50000',
    colorFamily: 'Red / Crimson',
    style: 'Solid Color',
    shape: 'Stiletto',
    length: 'Extra Long',
    finish: 'Glossy',
    pattern: 'Deep blood red solid',
  },
  {
    id: '4',
    name: 'Marble Elegance',
    color: '#ffffff',
    colorFamily: 'White / Cream',
    style: 'Marble',
    shape: 'Square',
    length: 'Medium',
    finish: 'Matte',
    pattern: 'White marble with gold veins',
  },
  {
    id: '5',
    name: 'Cherry Blossom',
    color: '#ffc1cc',
    colorFamily: 'Pink / Rose',
    style: 'Floral / Botanical',
    shape: 'Oval',
    length: 'Medium',
    finish: 'Glossy',
    pattern: 'Cherry blossom flowers',
  },
  {
    id: '6',
    name: 'Ocean Waves',
    color: '#40e0d0',
    colorFamily: 'Rainbow / Multicolor',
    style: 'Ombre / Gradient',
    shape: 'Coffin',
    length: 'Long',
    finish: 'Glitter / Sparkle',
    pattern: 'Turquoise ocean waves with shimmer',
  },
];

function applyPreset(preset: typeof PRESET_DESIGNS[0], setDesign: React.Dispatch<React.SetStateAction<NailDesignState>>) {
  setDesign((prev) => ({
    ...prev,
    baseColorFamily: preset.colorFamily as any,
    customColor: preset.color,
    useCustomColor: true,
    shape: preset.shape as any,
    length: preset.length as any,
    finish: preset.finish as any,
    artStyle: preset.style as any,
    patternPrompt: preset.pattern,
  }));
}

export default function App() {
  const [design, setDesign] = useState<NailDesignState>(DEFAULT_DESIGN);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isApiKeyMissing] = useState(!import.meta.env.VITE_MINIMAX_API_KEY && !import.meta.env.VITE_API_KEY);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateNailArt("", design);
      setGeneratedImage(result);
      setGenerationCount((p) => p + 1);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate nail art. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    // Strip the data:image/png;base64, prefix and decode to check format
    const isJpeg = generatedImage.includes('image/jpeg') || generatedImage.includes('/9j/');
    link.download = `nail-art-${Date.now()}.${isJpeg ? 'jpg' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent('https://purelycomfy.com/nail-art-generator/');
    const text = encodeURIComponent('Check out this amazing AI Nail Art Generator! 💅✨');
    let shareUrl = '';
    switch (platform) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
      case 'copy':
        navigator.clipboard.writeText('https://purelycomfy.com/nail-art-generator/');
        alert('Link copied to clipboard!');
        setShowShareModal(false);
        return;
    }
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0f172a] text-slate-100 overflow-hidden selection:bg-pink-500 selection:text-white relative">

      {/* API Key Missing Banner */}
      {isApiKeyMissing && (
        <div className="absolute inset-0 z-50 bg-[#0f172a]/95 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 border border-red-500/50 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔑</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-3">Setup Required</h2>
            <p className="text-slate-300 mb-6">Add your MiniMax API key to the .env file as VITE_MINIMAX_API_KEY.</p>
            <p className="text-sm text-slate-400">Restart the dev server after adding the key.</p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowShareModal(false)}>
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-serif font-bold mb-4 text-center">Share This Tool</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleShare('facebook')} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877f2] hover:bg-[#1664d9] text-white rounded-xl transition-all">
                <Facebook size={20} /> Facebook
              </button>
              <button onClick={() => handleShare('twitter')} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1da1f2] hover:bg-[#1a8cd8] text-white rounded-xl transition-all">
                <Twitter size={20} /> Twitter
              </button>
              <button onClick={() => handleShare('copy')} className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all col-span-2">
                <Share2 size={20} /> Copy Link
              </button>
            </div>
            <button onClick={() => setShowShareModal(false)} className="mt-6 w-full py-2 text-slate-400 hover:text-white transition-colors">Close</button>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowInfoModal(false)}>
          <div className="bg-slate-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-serif font-bold mb-4">About This Tool</h3>
            <div className="space-y-4 text-slate-300">
              <p>The <strong>AI Nail Art Generator</strong> uses MiniMax M2.7 to create stunning nail art designs from text prompts.</p>
              <div>
                <h4 className="font-semibold text-white mb-2">How It Works:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Choose your design options below</li>
                  <li>Click Generate</li>
                  <li>Download and share your creation</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Use the custom pattern field for specific designs</li>
                  <li>Try different presets for inspiration</li>
                  <li>Use the color picker for custom colors</li>
                </ul>
              </div>
            </div>
            <button onClick={() => setShowInfoModal(false)} className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all">Got It!</button>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="order-2 lg:order-1 w-full lg:w-[400px] h-[50vh] lg:h-full flex-shrink-0 border-t lg:border-t-0 lg:border-r border-slate-800 bg-[#111827] flex flex-col z-20 shadow-2xl">
        <div className="p-4 lg:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="font-serif text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-indigo-200 truncate">Nail Art Generator</h1>
          </div>
          <button onClick={() => setShowInfoModal(true)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="About">
            <Info size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ControlPanel design={design} setDesign={setDesign} onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="order-1 lg:order-2 flex-1 relative flex flex-col h-[50vh] lg:h-full">
        {/* Top Bar */}
        <header className="h-14 lg:h-16 border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 text-xs lg:text-sm text-slate-400">
            <span className="text-pink-400 font-medium">✨ Design &amp; Generate</span>
          </div>
          <div className="flex gap-2 lg:gap-3 shrink-0">
            <button onClick={() => setShowShareModal(true)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Share">
              <Share2 size={18} />
            </button>
            <button onClick={() => { setDesign(DEFAULT_DESIGN); setGeneratedImage(null); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Reset">
              <Eraser size={18} />
            </button>
            {generatedImage && (
              <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-lg text-xs lg:text-sm font-medium border border-pink-500/30 transition-all shadow-lg shadow-pink-500/20">
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] opacity-90"></div>

          <div className="relative z-10 w-full h-full flex flex-col">

            {/* Error Banner */}
            {error && (
              <div className="mb-4 bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-xl backdrop-blur-md text-sm font-medium text-center border border-red-400/50 flex items-center justify-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="flex-1 relative rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/40 backdrop-blur-sm">
              {isGenerating ? (
                <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="space-y-2 text-indigo-200 text-sm max-w-xs mx-auto">
                      <p className="font-medium animate-pulse">Creating your nail art...</p>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-indigo-500 h-1.5 rounded-full animate-pulse w-1/3"></div>
                      </div>
                      <p className="text-xs text-slate-400">MiniMax M2.7 is crafting your design...</p>
                    </div>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <img src={generatedImage} alt="Generated nail art" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Palette size={36} className="text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-serif font-medium text-white mb-3">Your Nail Art Awaits</h2>
                  <p className="text-slate-400 mb-6 max-w-sm">Configure your perfect manicure using the controls on the left, then hit Generate!</p>
                  <button
                    onClick={handleGenerate}
                    className="px-8 py-3 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/25 transition-all"
                  >
                    ✨ Generate Now
                  </button>
                </div>
              )}
            </div>

            {/* Presets Row */}
            {!generatedImage && (
              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-2 text-center">Quick presets:</p>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {PRESET_DESIGNS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p, setDesign)}
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition-all text-left"
                    >
                      <span className="w-5 h-5 rounded-full flex-shrink-0 border border-white/20" style={{ background: p.color }}></span>
                      <span className="text-xs text-slate-300 whitespace-nowrap">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-2 text-center text-slate-500 text-[10px] lg:text-xs">
              {generatedImage ? "💾 Download & Share!" : "⚙️ Configure your design & click Generate"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900/50 border-t border-slate-800 px-4 py-2 text-center">
          <p className="text-xs text-slate-500">
            Powered by MiniMax M2.7 AI • {generationCount > 0 && `${generationCount} designs created`}
          </p>
        </div>
      </main>
    </div>
  );
}
