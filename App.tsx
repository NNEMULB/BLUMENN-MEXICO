
import React, { useState, useCallback } from 'react';
import { 
  Heart, 
  Trash2, 
  Download, 
  Plus, 
  RotateCcw, 
  Image as ImageIcon,
  Music,
  Ghost,
  Eraser,
  Scissors,
  Sparkles,
  ChevronRight,
  Maximize2,
  Cross
} from 'lucide-react';
import { generateDesignImage } from './services/geminiService';
import { TShirtDesign, GenerationStatus } from './types';

const DESIGN_THEMES = [
  "Central ruby heart with a silver-threaded guardian angel weeping metallic tears",
  "Two marble cherubs lifting a baroque golden heart with thorns of black silk",
  "Sinister Cupid with black wings aiming a ruby arrow at a beating silver heart",
  "Anatomical heart cradled by skeletal angel wings in heavy grayscale embroidery",
  "A majestic dark angel silhouette protecting a burning heart of golden thread",
  "Cherubs playing golden harps around a sacred heart crowned with silver thorns",
  "Ethereal angel ascending from a broken heart repaired with gold kintsugi stitching",
  "A duo of cherubs battling for a ruby heart using silver-threaded swords",
  "Gothic cathedral arch with a central heart and flanking stone-textured angels",
  "Celestial heart with angel wings spanning across the design in silver foil thread",
  "Seraphim with six wings surrounding a glowing ruby heart in high-density 3D stitch",
  "A fallen angel leaning against a massive obsidian heart in a 'tumbado' pose",
  "Gilded cherub holding a blood-dripping heart made of deep red silk thread",
  "Angel of silence with a finger to lips, holding a heart wrapped in silver ribbons",
  "Two opposing angels (light and dark) sharing a single central ruby heart",
  "A cupid-cherub hybrid with a skull face holding a heart of thorns",
  "Classical marble angel statue holding a heart made of polished silver thread",
  "Sacred heart radiating beams of golden silk with hovering cherub heads",
  "Vengeful angel with a sword of light piercing a central anatomical heart",
  "An ornate frame of angel feathers and black roses around a minimalist Blumenn heart"
];

const App: React.FC = () => {
  const [designs, setDesigns] = useState<TShirtDesign[]>([]);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<TShirtDesign | null>(null);
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');

  const generateCollectionPiece = async () => {
    if (designs.length >= 20) {
      alert("La colección actual de 20 piezas está completa. Por favor, elimina alguna para continuar.");
      return;
    }

    setStatus(GenerationStatus.GENERATING);
    setError(null);

    try {
      const themeIndex = designs.length % DESIGN_THEMES.length;
      const theme = DESIGN_THEMES[themeIndex];

      // Front is a minimalist refined emblem
      const frontPrompt = `Luxury 3D embroidery chest badge: ${theme}. Minimalist, refined, center-focused emblem on black. Blumenn branding integrated discreetly.`;
      // Back is the grand mural expansion
      const backPrompt = `Masterpiece grand 3D embroidery mural for the back of a luxury T-shirt: ${theme}. Extensive detail, sweeping wings, intricate thread textures, baroque sinister luxury.`;

      const [frontUrl, backUrl] = await Promise.all([
        generateDesignImage(frontPrompt, "Front view, high-end pocket-style embroidery badge"),
        generateDesignImage(backPrompt, "Full back-piece majestic mural, heavy stitch detail")
      ]);

      const newDesign: TShirtDesign = {
        id: `BLMN-25-${(designs.length + 1).toString().padStart(2, '0')}`,
        frontUrl,
        backUrl,
        timestamp: Date.now(),
        prompt: theme
      };

      setDesigns(prev => [...prev, newDesign]);
      setSelectedDesign(newDesign);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err) {
      setStatus(GenerationStatus.ERROR);
      setError("Error en el proceso de bordado de lujo. Reconectando atelier...");
    } finally {
      setTimeout(() => setStatus(GenerationStatus.IDLE), 3000);
    }
  };

  const deleteDesign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDesigns(prev => prev.filter(d => d.id !== id));
    if (selectedDesign?.id === id) setSelectedDesign(null);
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-red-900/40 font-cinzel overflow-x-hidden">
      {/* Atelier Luxury Header */}
      <nav className="border-b border-zinc-900 bg-black/98 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-4xl font-cinzel-dec tracking-[0.5em] font-light uppercase text-thread">
              Blumenn
            </h1>
            <div className="hidden xl:block h-10 w-[1px] bg-zinc-800"></div>
            <div className="hidden xl:flex flex-col">
              <span className="text-[9px] tracking-[0.7em] text-zinc-500 uppercase font-bold">Lookbook Vol. 25</span>
              <span className="text-[8px] tracking-[0.4em] text-zinc-700 uppercase">Haute Couture Sinister Embroidery</span>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[10px] tracking-widest text-zinc-600 uppercase">Archive Capacity</span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-black text-white">{designs.length}</span>
                <span className="text-[10px] text-zinc-800">/</span>
                <span className="text-[10px] text-zinc-700">20</span>
              </div>
            </div>
            <button 
              onClick={generateCollectionPiece}
              disabled={status === GenerationStatus.GENERATING || designs.length >= 20}
              className={`
                group relative px-12 py-3 border border-zinc-800 text-[10px] tracking-[0.6em] font-bold transition-all duration-1000
                ${status === GenerationStatus.GENERATING 
                  ? 'bg-zinc-950 text-zinc-700 cursor-not-allowed border-zinc-900' 
                  : 'bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95'}
              `}
            >
              {status === GenerationStatus.GENERATING ? (
                <span className="flex items-center gap-3">
                  <RotateCcw className="w-3 h-3 animate-spin" />
                  STITCHING ART...
                </span>
              ) : "MANIFEST NEW PIECE"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-10 py-20 flex flex-col lg:flex-row gap-20">
        
        {/* Left Sidebar: The Vertical Gallery */}
        <div className="lg:w-[350px] space-y-16 flex-shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 bg-red-900"></div>
              <h2 className="text-3xl font-cinzel font-light text-zinc-100 tracking-widest uppercase">The Archive</h2>
            </div>
            <p className="text-zinc-500 text-[11px] tracking-widest leading-loose italic">
              "Curando la dualidad entre lo celestial y lo profano. Una colección limitada a 20 obras maestras de bordado pesado."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
            {designs.map((design, index) => (
              <div 
                key={design.id}
                onClick={() => setSelectedDesign(design)}
                className={`
                  relative aspect-[4/5] cursor-pointer overflow-hidden border transition-all duration-1000 group
                  ${selectedDesign?.id === design.id ? 'border-zinc-300 ring-1 ring-zinc-300 shadow-2xl' : 'border-zinc-900 grayscale hover:grayscale-0 hover:border-zinc-700'}
                `}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-0"></div>
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[8px] font-black tracking-widest text-white/50 bg-black/60 px-2 py-1">#{index + 1}</span>
                </div>
                <img src={design.frontUrl} className="w-full h-full object-cover relative z-[-1]" alt={design.id} />
                <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-full group-hover:translate-y-0 transition-transform bg-black/80 backdrop-blur-sm">
                   <button 
                    onClick={(e) => deleteDesign(design.id, e)}
                    className="w-full py-2 flex items-center justify-center gap-2 text-[8px] tracking-[0.3em] font-bold text-red-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> REMOVE
                  </button>
                </div>
              </div>
            ))}
            {designs.length < 20 && (
              <div 
                onClick={generateCollectionPiece}
                className="aspect-[4/5] border border-zinc-900/50 border-dashed flex flex-col items-center justify-center gap-4 hover:border-zinc-700 hover:bg-zinc-950 transition-all cursor-pointer group"
              >
                <div className="p-4 rounded-full border border-zinc-900 group-hover:border-zinc-700 transition-all">
                  <Plus className="w-5 h-5 text-zinc-800 group-hover:text-zinc-500" />
                </div>
                <span className="text-[9px] text-zinc-700 group-hover:text-zinc-400 tracking-[0.4em] font-bold uppercase">Next Concept</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Masterpiece Detail */}
        <div className="flex-1 min-w-0">
          {selectedDesign ? (
            <div className="animate-in fade-in duration-1000 space-y-16">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center gap-4 text-red-950">
                    <Cross className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.9em] font-black uppercase">Sinister Tumbado Elite</span>
                    <div className="h-[1px] flex-1 bg-zinc-900"></div>
                  </div>
                  <h3 className="text-7xl font-cinzel-dec text-white tracking-tighter uppercase leading-none">{selectedDesign.id}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-red-900 rounded-full animate-pulse"></div>
                    <p className="text-zinc-400 text-sm italic font-light tracking-[0.1em] leading-relaxed">
                      "{selectedDesign.prompt}"
                    </p>
                  </div>
                </div>
                
                <div className="flex bg-zinc-950 p-1 border border-zinc-900">
                  <button 
                    onClick={() => setViewMode('front')}
                    className={`px-10 py-4 text-[11px] font-bold tracking-[0.5em] transition-all ${viewMode === 'front' ? 'bg-white text-black' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    FRONT EMBLEM
                  </button>
                  <button 
                    onClick={() => setViewMode('back')}
                    className={`px-10 py-4 text-[11px] font-bold tracking-[0.5em] transition-all ${viewMode === 'back' ? 'bg-white text-black' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    BACK MURAL
                  </button>
                </div>
              </div>

              <div className="relative group bg-[#050505] border border-zinc-900/50 flex items-center justify-center p-10 lg:p-20 shadow-2xl overflow-hidden min-h-[700px]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none"></div>
                
                <img 
                  src={viewMode === 'front' ? selectedDesign.frontUrl : selectedDesign.backUrl} 
                  className="max-w-full max-h-[75vh] object-contain relative z-10 transition-all duration-[4s] group-hover:scale-105 drop-shadow-[0_20px_50px_rgba(0,0,0,1)]"
                  alt={`Blumenn Piece ${selectedDesign.id}`}
                />
                
                {/* Visualizer Metadata Overlays */}
                <div className="absolute top-10 left-10 text-zinc-800 text-[10px] tracking-[0.8em] font-bold uppercase rotate-90 origin-left">
                  ATELIER MASTERPIECE // 2025
                </div>

                <div className="absolute bottom-10 right-10 flex flex-col gap-4">
                  <button 
                    onClick={() => downloadImage(viewMode === 'front' ? selectedDesign.frontUrl : selectedDesign.backUrl, `${selectedDesign.id}-${viewMode}.png`)}
                    className="p-5 bg-white text-black hover:bg-zinc-200 transition-all shadow-2xl group/dl"
                  >
                    <Download className="w-6 h-6 group-hover/dl:-translate-y-1 transition-transform" />
                  </button>
                  <button className="p-5 bg-zinc-900 text-zinc-500 hover:text-white transition-all">
                    <Maximize2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="p-10 border border-zinc-900 bg-black/50 space-y-4 hover:border-zinc-700 transition-colors">
                  <h4 className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase font-black">Stitch Density</h4>
                  <p className="text-lg font-cinzel text-zinc-200">High-Fidelity 3D</p>
                </div>
                <div className="p-10 border border-zinc-900 bg-black/50 space-y-4 hover:border-zinc-700 transition-colors">
                  <h4 className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase font-black">Thread Source</h4>
                  <p className="text-lg font-cinzel text-zinc-200">Silver & Ruby Silk</p>
                </div>
                <div className="p-10 border border-zinc-900 bg-black/50 space-y-4 hover:border-zinc-700 transition-colors">
                  <h4 className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase font-black">Visual Essence</h4>
                  <p className="text-lg font-cinzel text-zinc-200">Angelic Shadows</p>
                </div>
                <div className="p-10 border border-zinc-900 bg-black/50 space-y-4 hover:border-zinc-700 transition-colors">
                  <h4 className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase font-black">Brand Origin</h4>
                  <p className="text-lg font-cinzel text-zinc-200">Blumenn Mexico</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[700px] flex flex-col items-center justify-center text-center space-y-16 border border-zinc-950 bg-black/20">
              <div className="relative">
                <Scissors className="w-24 h-24 text-zinc-900 rotate-45" />
                <div className="absolute -inset-16 bg-red-950/5 blur-[100px] rounded-full"></div>
                <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-zinc-800 animate-pulse" />
              </div>
              <div className="space-y-6">
                <h3 className="text-5xl font-cinzel font-light text-zinc-200 tracking-tight uppercase">Selecciona una Obra</h3>
                <p className="text-zinc-600 text-[11px] tracking-[0.8em] uppercase max-w-md mx-auto leading-relaxed">
                  Despliega el archivo para visualizar la esencia de Blumenn.
                </p>
              </div>
              <button 
                onClick={generateCollectionPiece}
                className="group relative px-20 py-5 border border-zinc-800 text-[12px] tracking-[1em] font-black bg-white text-black hover:bg-zinc-200 transition-all overflow-hidden"
              >
                CURATE NEW PIECE
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Luxury Atelier */}
      <footer className="mt-60 border-t border-zinc-900 py-32 bg-black">
        <div className="max-w-[1600px] mx-auto px-10 flex flex-col items-center space-y-20">
          <div className="flex flex-col items-center gap-8">
            <h4 className="text-5xl font-cinzel-dec tracking-[0.7em] text-thread uppercase font-black">Blumenn</h4>
            <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-16 items-center">
            <Ghost className="w-6 h-6 text-zinc-800 hover:text-white transition-all cursor-pointer" />
            <Music className="w-6 h-6 text-zinc-800 hover:text-white transition-all cursor-pointer" />
            <Heart className="w-6 h-6 text-zinc-800 hover:text-white transition-all cursor-pointer" />
            <Cross className="w-6 h-6 text-zinc-800 hover:text-white transition-all cursor-pointer" />
            <Sparkles className="w-6 h-6 text-zinc-800 hover:text-white transition-all cursor-pointer" />
          </div>

          <div className="text-center space-y-8 max-w-2xl">
            <p className="text-zinc-600 text-[11px] tracking-[0.5em] uppercase leading-relaxed font-bold">
              Preservando el legado del bordado de alta gama.<br/>
              Diseñado exclusivamente para el colectivo Blumenn Elite.
            </p>
            <div className="stitch-line w-full h-[1px] opacity-20"></div>
            <p className="text-zinc-800 text-[10px] tracking-[0.8em] uppercase">Archive Masterpiece &copy; 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
