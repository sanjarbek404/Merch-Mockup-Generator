import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Layers, 
  Maximize2, 
  Move, 
  RotateCcw,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Shirt,
  ShoppingBag,
  Coffee,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { MockupCanvas } from './components/MockupCanvas';
import { MOCKUP_TEMPLATES } from './constants';
import { MockupTemplate, UserLogo } from './types';
import { getSmartPlacement } from './services/aiService';

export default function App() {
  const [logo, setLogo] = useState<UserLogo | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MockupTemplate>(MOCKUP_TEMPLATES[0]);
  const [logoScale, setLogoScale] = useState(1);
  const [logoOpacity, setLogoOpacity] = useState(0.9);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState(false);
  const [exportDataUrl, setExportDataUrl] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setLogo({
          url: event.target?.result as string,
          width: img.width,
          height: img.height
        });
        toast.success('Logo uploaded successfully!');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const resetAdjustments = () => {
    setLogoScale(1);
    setLogoOpacity(0.9);
    setLogoPosition({ x: 0, y: 0 });
    toast.info('Adjustments reset');
  };

  const downloadMockup = () => {
    if (!exportDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `merch-mockup-${selectedTemplate.id}.png`;
    link.href = exportDataUrl;
    link.click();
    toast.success('Mockup exported!');
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: ImageIcon },
    { id: 'apparel', name: 'Apparel', icon: Shirt },
    { id: 'accessories', name: 'Accessories', icon: ShoppingBag },
    { id: 'home', name: 'Home & Living', icon: Coffee },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTemplates = MOCKUP_TEMPLATES.filter(t => 
    activeCategory === 'all' || t.category === activeCategory
  );

  const handleAiSmartPlacement = async () => {
    if (!logo) return;
    
    setIsAiLoading(true);
    try {
      const result = await getSmartPlacement(selectedTemplate, logo);
      setLogoScale(result.scale);
      setLogoPosition({ x: result.x, y: result.y });
      setLogoOpacity(result.opacity);
      toast.success('AI Optimized Placement!', {
        description: result.reasoning
      });
    } catch (error) {
      toast.error('AI Placement failed. Try manual adjustments.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full flex-col bg-[var(--bg-color)] font-sans text-[var(--text-dark)] md:flex-row">
      {/* Sidebar - Controls */}
      <aside className="z-10 flex w-full flex-col bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:w-[320px] md:rounded-r-[var(--border-radius)]">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-white font-extrabold text-xl">
            M
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[var(--primary)]">MerchMagic</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dark)]/40">Studio Studio</p>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-8 pb-8">
            {/* Logo Upload Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-[#A0AEC0]">Your Brand Identity</Label>
                {logo && (
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] uppercase tracking-wider text-[var(--primary)]" onClick={() => setLogo(null)}>
                    Remove
                  </Button>
                )}
              </div>
              
              {!logo ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="vibrant-upload-area group relative flex flex-col items-center justify-center gap-3 p-8 transition-all hover:border-[var(--primary)]/50"
                >
                  <div className="text-3xl mb-1">☁️</div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[var(--secondary)]">Drop your logo here</p>
                    <p className="text-[10px] text-[var(--text-dark)]/40 uppercase font-bold tracking-tighter">PNG, SVG up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleLogoUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-[var(--bg-color)] bg-white p-4 shadow-sm">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border bg-[var(--bg-color)]">
                    <img src={logo.url} alt="Logo preview" className="h-full w-full object-contain p-2" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-bold">Logo Active</p>
                    <p className="text-[11px] text-[var(--text-dark)]/40">{logo.width} x {logo.height} px</p>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--secondary)] text-white">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}
            </section>

            <Separator className="bg-[#1A1A1A]/5" />

            {/* Adjustments Section */}
            <section className={`space-y-6 transition-opacity ${!logo ? 'pointer-events-none opacity-30' : 'opacity-100'}`}>
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-[#A0AEC0]">Placement Scale</Label>
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 w-7 rounded-full border-[var(--bg-color)] p-0 hover:bg-[var(--secondary)] hover:text-white"
                        onClick={handleAiSmartPlacement}
                        disabled={isAiLoading}
                      >
                        {isAiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>AI Smart Placement</TooltipContent>
                  </Tooltip>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] uppercase tracking-wider" onClick={resetAdjustments}>
                    <RotateCcw className="mr-1 h-3 w-3" /> Reset
                  </Button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0]">Size</Label>
                    <span className="text-[11px] font-mono font-bold text-[var(--secondary)]">{Math.round(logoScale * 100)}%</span>
                  </div>
                  <Slider 
                    value={[logoScale]} 
                    min={0.1} 
                    max={2} 
                    step={0.01} 
                    onValueChange={(v) => setLogoScale(Array.isArray(v) ? v[0] : v)}
                    className="py-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-[11px] font-bold uppercase tracking-wider">Opacity</Label>
                    <span className="text-[11px] font-mono">{Math.round(logoOpacity * 100)}%</span>
                  </div>
                  <Slider 
                    value={[logoOpacity]} 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    onValueChange={(v) => setLogoOpacity(Array.isArray(v) ? v[0] : v)}
                    className="py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold uppercase tracking-wider">Horizontal Offset</Label>
                    <Slider 
                      value={[logoPosition.x]} 
                      min={-0.5} 
                      max={0.5} 
                      step={0.001} 
                      onValueChange={(v) => setLogoPosition(prev => ({ ...prev, x: Array.isArray(v) ? v[0] : v }))}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold uppercase tracking-wider">Vertical Offset</Label>
                    <Slider 
                      value={[logoPosition.y]} 
                      min={-0.5} 
                      max={0.5} 
                      step={0.001} 
                      onValueChange={(v) => setLogoPosition(prev => ({ ...prev, y: Array.isArray(v) ? v[0] : v }))}
                    />
                  </div>
                </div>
              </div>
            </section>

            <Separator className="bg-[#1A1A1A]/5" />

            {/* Export Section */}
            <section className={`space-y-4 transition-opacity ${!logo ? 'pointer-events-none opacity-30' : 'opacity-100'}`}>
              <Button 
                onClick={downloadMockup}
                className="vibrant-button-primary w-full py-7 text-sm font-extrabold uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20"
              >
                <Download className="mr-2 h-4 w-4" /> Export All Files
              </Button>
              <p className="text-center text-[10px] font-bold uppercase tracking-tighter text-[#A0AEC0]">
                High-resolution print-ready mockup
              </p>
            </section>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content - Preview & Gallery */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation / Filters */}
        <header className="flex h-[72px] items-center justify-between border-b border-[var(--text-dark)]/5 bg-white px-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6 font-bold text-sm">
              <a className="text-[var(--primary)] cursor-pointer">Studio</a>
              <a className="text-[#A0AEC0] cursor-pointer hover:text-[var(--text-dark)] transition-colors">Collection</a>
              <a className="text-[#A0AEC0] cursor-pointer hover:text-[var(--text-dark)] transition-colors">History</a>
              <a className="text-[#A0AEC0] cursor-pointer hover:text-[var(--text-dark)] transition-colors">Pricing</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 rounded-full bg-[var(--bg-color)] px-4 py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--secondary)]" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-dark)]/60">Live Studio</span>
             </div>
             <div className="h-10 w-10 rounded-full bg-[#EDF2F7] border-2 border-white shadow-sm" />
          </div>
        </header>

        {/* Preview Area */}
        <div className="flex flex-1 flex-col items-center justify-center p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTemplate.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl"
            >
              <div className="vibrant-card overflow-hidden p-4">
                <div className="relative">
                  <MockupCanvas 
                    template={selectedTemplate}
                    logo={logo}
                    logoScale={logoScale}
                    logoOpacity={logoOpacity}
                    logoPosition={logoPosition}
                    onExport={setExportDataUrl}
                    className="aspect-[4/3] rounded-[16px]"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-bold text-[var(--text-dark)] shadow-sm backdrop-blur-sm">
                    {selectedTemplate.category.charAt(0).toUpperCase() + selectedTemplate.category.slice(1)} View
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between px-2 pb-2">
                  <h3 className="text-lg font-extrabold tracking-tight">{selectedTemplate.name}</h3>
                  <span className="vibrant-badge">READY</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Gallery */}
        <div className="h-44 bg-white/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    activeCategory === cat.id ? 'text-[var(--primary)]' : 'text-[#A0AEC0] hover:text-[var(--text-dark)]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white shadow-sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white shadow-sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="w-full">
            <div className="flex gap-5 pb-4 px-2">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`group relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-[16px] border-4 transition-all ${
                    selectedTemplate.id === template.id 
                      ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20' 
                      : 'border-white hover:border-[var(--secondary)]/30'
                  }`}
                >
                  <img 
                    src={template.imageUrl} 
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>

      <Toaster position="bottom-right" />
    </div>
    </TooltipProvider>
  );
}
