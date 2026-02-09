import React, { useState, useEffect } from 'react';
import { Download, Eraser, Camera, ArrowRight, Sparkles, Home, AlertTriangle, Key, Share2, Info, Instagram, Facebook, Twitter } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { ComparisonSlider } from './ComparisonSlider';
import { NailDesignState, DEFAULT_DESIGN, PresetDesign, NailShape, NailLength, NailFinish } from './types';
import { generateNailArt } from './geminiService';

const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop";

const PRESETS: PresetDesign[] = [
  {
    id: '1',
    name: 'Classic French',
    description: 'Timeless pink and white french tips',
    thumbnail: '',
    config: {
      color: '#fce4ec',
      finish: NailFinish.Glossy,
      patternPrompt: 'Classic white french tips, very neat and clean'
    }
  },
  {
    id: '2',
    name: 'Midnight Galaxy',
    description: 'Deep blue with stars',
    thumbnail: '',
    config: {
      color: '#1a237e',
      finish: NailFinish.Glitter,
      patternPrompt: 'Galaxy theme, deep blue and purple nebula, tiny white stars, cosmic dust'
    }
  },
  {
    id: '3',
    name: 'Ruby Red Stiletto',
    description: 'Fierce red look',
    thumbnail: '',
    config: {
      shape: NailShape.Stiletto,
      length: NailLength.Long,
      color: '#d50000',
      finish: NailFinish.Glossy,
      patternPrompt: 'Deep blood red solid color, vampire chic'
    }
  },
  {
    id: '4',
    name: 'Marble Elegance',
    description: 'White marble with gold veins',
    thumbnail: '',
    config: {
      color: '#ffffff',
      finish: NailFinish.Matte,
      patternPrompt: 'White carrara marble texture with delicate gold veins'
    }
  },
  {
    id: '5',
    name: 'Cherry Blossom',
    description: 'Soft pink with floral accents',
    thumbnail: '',
    config: {
      color: '#ffc1cc',
      finish: NailFinish.Glossy,
      patternPrompt: 'Delicate cherry blossom flowers, soft pink petals, Japanese spring aesthetic'
    }
  },
  {
    id: '6',
    name: 'Ocean Waves',
    description: 'Turquoise waves with shimmer',
    thumbnail: '',
    config: {
      color: '#40e0d0',
      finish: NailFinish.Glitter,
      patternPrompt: 'Ocean waves, turquoise and white swirls, beach vibes, sparkle'
    }
  }
];

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [design, setDesign] = useState<NailDesignState>(DEFAULT_DESIGN);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      const hasEnvKey = !!process.env.API_KEY;
      const hasWindowKey = !!window.nailArtSettings?.apiKey;
      let hasStudioKey = false;
      
      if (window.aistudio) {
        hasStudioKey = await window.aistudio.hasSelectedApiKey();
      }

      if (!hasEnvKey && !hasWindowKey && !hasStudioKey) {
        setIsApiKeyMissing(true);
      } else {
        setIsApiKeyMissing(false);
      }
    };
    checkKey();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Track upload event
      if (window.gtag) {
        window.gtag('event', 'image_upload', {
          'event_category': 'engagement',
          'event_label': 'User uploaded hand photo'
        });
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) return;
    
    setIsGenerating(true);
    setError(null);
    
    // Track generation start
    if (window.gtag) {
      window.gtag('event', 'generate_nail_art', {
        'event_category': 'conversion',
        'event_label': `Design: ${design.patternPrompt || 'solid color'}`,
        'value': generationCount + 1
      });
    }
    
    try {
      const result = await generateNailArt(originalImage, design);
      setGeneratedImage(result);
      setGenerationCount(prev => prev + 1);
      
      // Track successful generation
      if (window.gtag) {
        window.gtag('event', 'generation_success', {
          'event_category': 'success',
          'event_label': 'Nail art generated successfully'
        });
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Failed to generate nail art. Please try again.";
      setError(errorMessage);
      
      // Track error
      if (window.gtag) {
        window.gtag('event', 'generation_error', {
          'event_category': 'error',
          'event_label': errorMessage
        });
      }
      
      if (errorMessage.includes("API Key") || errorMessage.includes("403") || errorMessage.includes("400")) {
        setIsApiKeyMissing(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `purelycomfy-nails-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Track download
      if (window.gtag) {
        window.gtag('event', 'download_image', {
          'event_category': 'engagement',
          'event_label': 'User downloaded generated nail art'
        });
      }
    }
  };

  const loadSample = () => {
    fetch(SAMPLE_IMAGE)
      .then(r => r.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setOriginalImage(reader.result as string);
          setGeneratedImage(null);
        };
        reader.readAsDataURL(blob);
      });
    
    // Track sample load
    if (window.gtag) {
      window.gtag('event', 'load_sample', {
        'event_category': 'engagement',
        'event_label': 'User loaded sample photo'
      });
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      window.location.reload();
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent('https://purelycomfy.com/nail-art-generator/');
    const text = encodeURIComponent('Check out this amazing AI Nail Art Generator! Try virtual nail designs on your own hands 💅✨');
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`;
        break;
      case 'copy':
        navigator.clipboard.writeText('https://purelycomfy.com/nail-art-generator/');
        alert('Link copied to clipboard!');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Track share
      if (window.gtag) {
        window.gtag('event', 'share', {
          'event_category': 'engagement',
          'event_label': platform,
          'method': platform
        });
      }
    }
    
    setShowShareModal(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0f172a] text-slate-100 overflow-hidden selection:bg-pink-500 selection:text-white relative">
      
      {/* API Key Missing Banner */}
      {isApiKeyMissing && (
        <div className="absolute inset-0 z-50 bg-[#0f172a]/95 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 border border-red-500/50 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key size={32} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-3">Setup Required</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              The Google Gemini API Key is missing or invalid.
            </p>
            
            <div className="space-y-4 text-left bg-slate-900/50 p-4 rounded-lg mb-6">
              <div className="flex gap-3">
                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">1</span>
                 <p className="text-sm text-slate-400">Go to Vercel Project Settings > Environment Variables.</p>
              </div>
              <div className="flex gap-3">
                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">2</span>
                 <div className="text-sm text-slate-400">
                   Add <span className="text-white font-mono bg-slate-800 px-1 rounded">VITE_API_KEY</span> with your Google API Key.
                 </div>
              </div>
              <div className="flex gap-3">
                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">3</span>
                 <p className="text-sm text-slate-400">Redeploy your application.</p>
              </div>
            </div>

            {window.aistudio ? (
              <button 
                onClick={handleSelectKey}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25"
              >
                Select API Key via Google
              </button>
            ) : (
              <a 
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="block w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all"
              >
                Open Vercel Dashboard
              </a>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowShareModal(false)}>
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-serif font-bold mb-4 text-center">Share This Tool</h3>
            <p className="text-slate-400 text-center mb-6">Help others discover the AI Nail Art Generator!</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877f2] hover:bg-[#1664d9] text-white rounded-xl transition-all"
              >
                <Facebook size={20} />
                <span>Facebook</span>
              </button>
              
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1da1f2] hover:bg-[#1a8cd8] text-white rounded-xl transition-all"
              >
                <Twitter size={20} />
                <span>Twitter</span>
              </button>
              
              <button
                onClick={() => handleShare('pinterest')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#e60023] hover:bg-[#cc001f] text-white rounded-xl transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
                <span>Pinterest</span>
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                <Share2 size={20} />
                <span>Copy Link</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-6 w-full py-2 text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowInfoModal(false)}>
          <div className="bg-slate-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-serif font-bold mb-4">About This Tool</h3>
            
            <div className="space-y-4 text-slate-300">
              <p>
                The <strong>AI Nail Art Generator</strong> uses Google's Gemini AI to virtually apply nail designs to your hand photos.
              </p>
              
              <div>
                <h4 className="font-semibold text-white mb-2">How It Works:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Upload a clear photo of your hand</li>
                  <li>Choose a design or customize your own</li>
                  <li>Click Generate and watch AI magic happen</li>
                  <li>Download and share your virtual manicure</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Best Photo Tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Use good lighting (natural light is best)</li>
                  <li>Plain/neutral background works better</li>
                  <li>Keep fingers visible and clear</li>
                  <li>Avoid blurry or dark photos</li>
                </ul>
              </div>
              
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                <p className="text-sm text-pink-200">
                  <strong>💡 Pro Tip:</strong> Try different preset designs first, then customize to find your perfect look!
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  Created with ❤️ by <a href="https://purelycomfy.com" target="_parent" className="text-pink-400 hover:text-pink-300">PurelyComfy</a>
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* Left Sidebar - Controls */}
      <aside className="order-2 lg:order-1 w-full lg:w-[400px] h-[50vh] lg:h-full flex-shrink-0 border-t lg:border-t-0 lg:border-r border-slate-800 bg-[#111827] flex flex-col z-20 shadow-2xl">
        <div className="p-4 lg:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="font-serif text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-indigo-200 truncate">
              Nail Art Generator
            </h1>
          </div>
          
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="About this tool"
          >
            <Info size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
           <ControlPanel 
             design={design} 
             setDesign={setDesign} 
             onGenerate={handleGenerate}
             isGenerating={isGenerating}
             presets={PRESETS}
             onApplyPreset={(p) => setDesign(prev => ({ ...prev, ...p.config }))}
           />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="order-1 lg:order-2 flex-1 relative flex flex-col h-[50vh] lg:h-full">
        
        {/* Top Bar */}
        <header className="h-14 lg:h-16 border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shrink-0">
           <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm text-slate-400 overflow-x-auto no-scrollbar">
             <a 
               href="https://purelycomfy.com" 
               className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mr-2 lg:mr-4 border-r border-slate-700 pr-2 lg:pr-4 group shrink-0"
               target="_parent"
             >
               <Home size={16} className="group-hover:text-indigo-400 transition-colors"/>
               <span className="hidden sm:inline font-medium">Home</span>
             </a>

             <span className={`flex items-center gap-2 shrink-0 ${originalImage ? 'text-indigo-400 font-medium' : ''}`}>
               <span className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-current flex items-center justify-center text-[10px] lg:text-xs">1</span>
               <span className="hidden sm:inline">Upload</span>
             </span>
             <ArrowRight size={14} className="hidden sm:block" />
             <span className={`flex items-center gap-2 shrink-0 ${originalImage && !generatedImage ? 'text-indigo-400 font-medium' : ''}`}>
               <span className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-current flex items-center justify-center text-[10px] lg:text-xs">2</span>
               <span className="hidden sm:inline">Design</span>
             </span>
             <ArrowRight size={14} className="hidden sm:block" />
             <span className={`flex items-center gap-2 shrink-0 ${generatedImage ? 'text-indigo-400 font-medium' : ''}`}>
               <span className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-current flex items-center justify-center text-[10px] lg:text-xs">3</span>
               <span className="hidden sm:inline">Result</span>
             </span>
           </div>

           <div className="flex gap-2 lg:gap-3 shrink-0">
              <button 
                onClick={() => setShowShareModal(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Share this tool"
              >
                <Share2 size={18} />
              </button>
              
              <button 
                onClick={() => { setOriginalImage(null); setGeneratedImage(null); }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Clear All"
              >
                <Eraser size={18} />
              </button>
              
              {generatedImage && (
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-lg text-xs lg:text-sm font-medium border border-pink-500/30 transition-all shadow-lg shadow-pink-500/20"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Download</span>
                </button>
              )}
           </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b] opacity-90"></div>

          <div className="relative z-10 w-full h-full flex items-center justify-center">
            
            {!originalImage ? (
              <div className="w-full max-w-sm lg:max-w-md mx-auto">
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-6 lg:p-10 text-center bg-slate-900/50 transition-all group">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-black/20">
                    <Camera size={28} className="text-indigo-400" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-serif font-medium text-white mb-2">Upload Your Photo</h3>
                  <p className="text-slate-400 mb-6 text-sm">Clear hand photo on neutral background works best</p>
                  
                  <div className="space-y-3">
                    <label className="block w-full">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <span className="block w-full py-2.5 lg:py-3 px-4 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-lg font-medium cursor-pointer transition-all shadow-lg shadow-pink-600/20 text-sm lg:text-base">
                        📸 Select Photo
                      </span>
                    </label>
                    <button onClick={loadSample} className="block w-full py-2.5 lg:py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors text-sm lg:text-base">
                      ✨ Try Sample Photo
                    </button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                      100% Free • AI-Powered • No Sign-Up Required
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col">
                {error && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-xl backdrop-blur-md text-sm font-medium animate-bounce w-[90%] lg:w-auto text-center border border-red-400/50 flex items-center gap-2 justify-center">
                    <AlertTriangle size={18} />
                    {error}
                  </div>
                )}

                <div className="flex-1 relative rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/40 backdrop-blur-sm">
                  {isGenerating && (
                     <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                       <div className="relative">
                         <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                           <Sparkles size={18} className="text-indigo-400 animate-pulse" />
                         </div>
                       </div>
                       <p className="mt-4 text-indigo-200 font-medium animate-pulse text-sm lg:text-base">Creating your nail art...</p>
                     </div>
                  )}
                  
                  {generatedImage ? (
                    <ComparisonSlider beforeImage={originalImage} afterImage={generatedImage} />
                  ) : (
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="w-full h-full object-contain" 
                    />
                  )}
                </div>
                
                <div className="mt-2 lg:mt-4 text-center text-slate-500 text-[10px] lg:text-xs">
                   {generatedImage ? "👆 Drag slider to compare • Then download & share!" : "👈 Configure your design & click Generate"}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Credit */}
        <div className="bg-slate-900/50 border-t border-slate-800 px-4 py-2 text-center">
          <p className="text-xs text-slate-500">
            Powered by <a href="https://purelycomfy.com" target="_parent" className="text-pink-400 hover:text-pink-300 font-medium">PurelyComfy</a> • 
            Built with Google Gemini AI • {generationCount > 0 && `${generationCount} designs created`}
          </p>
        </div>
      </main>
    </div>
  );
}
