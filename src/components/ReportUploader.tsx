import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, Eye } from 'lucide-react';

interface ReportUploaderProps {
  onAnalysisComplete: (keywords: string, condition: string, specialty: string) => void;
}

export default function ReportUploader({ onAnalysisComplete }: ReportUploaderProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<{
    condition: string;
    specialty: string;
    recommendedKeywords: string;
    summary: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (selectedFile: File) => {
    // Validate file type (Images and PDFs)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Supported formats: JPEG, PNG, WEBP, or PDF scans only.");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setLoading(true);
    setParsedData(null);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1]; // Strip data URL prefix
        
        // Call temporary API route
        const response = await fetch('/api/ai/analyze-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fileBase64: base64Data,
            mimeType: selectedFile.type
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Report extraction failed.");
        }

        if (data.success && data.data) {
          setParsedData(data.data);
        } else {
          throw new Error("No structured data returned from the analysis.");
        }
        setLoading(false);
      };

      reader.onerror = () => {
        setError("Error reading the local document.");
        setLoading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing.");
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerClickFile = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="space-y-0.5">
          <span className="text-[9px] font-black text-cyan-400 tracking-wider uppercase flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> HIPAA & PRIVACY IN-MEMORY ANALYSER
          </span>
          <h3 className="text-xs font-bold text-white uppercase tracking-tight">Prescription & Report Helper</h3>
        </div>
        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold px-2 py-0.5 rounded uppercase font-mono">
          Zero-Disk Storage
        </span>
      </div>

      <div className="text-[11px] text-slate-400 leading-normal">
        Upload diagnostic documents, scan reports, or medical prescriptions. Our AI extracts specialties and target conditions immediately in-memory to simplify searching.
      </div>

      {!file ? (
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerClickFile}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2.5 ${
            dragActive 
              ? 'border-cyan-500 bg-cyan-500/5 text-cyan-300' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-950 text-slate-450'
          }`}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*,application/pdf"
            onChange={handleChange}
          />
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-400">
            <Upload className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-white block">Drag and drop file here, or <span className="text-cyan-400">browse</span></span>
            <span className="text-[9px] text-slate-500 block mt-1">Accepts JPEG, PNG, WEBP, or PDF scans (max 15MB)</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/80 border border-slate-800/60 rounded-xl p-4.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
            <div className="flex items-center gap-2 max-w-[70%]">
              <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="text-[11px] text-slate-300 font-bold truncate">{file.name}</span>
            </div>
            <button 
              onClick={handleReset}
              className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 transition-colors uppercase font-bold"
            >
              <RefreshCw className="h-3 w-3" /> Reset File
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-4 space-y-2 text-center select-none">
              <RefreshCw className="h-5 w-5 text-cyan-400 animate-spin" />
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">parsing report safely...</p>
              <p className="text-[9px] text-slate-500">Extracting clinical keywords & categories</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg flex items-start gap-2 text-[10px] text-red-400 leading-snug">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Parsing Failure</span>
                {error}
              </div>
            </div>
          )}

          {parsedData && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex gap-2 text-[10px] text-emerald-400 leading-snug">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <span className="font-black uppercase tracking-wider block">Extraction Session Succeeded</span>
                  Report analysed securely. Found matching parameters. No disk traces stored.
                </div>
              </div>

              {/* Diagnosis Details */}
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Found Diagnosis</span>
                  <span className="font-bold text-white block mt-0.5">{parsedData.condition}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Specialty</span>
                  <span className="font-bold text-cyan-400 block mt-0.5">{parsedData.specialty}</span>
                </div>
              </div>

              {/* Report Summary */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 text-[10.5px] leading-relaxed">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Clinical Summary</span>
                <span className="text-slate-300 font-medium block mt-1 italic">"{parsedData.summary}"</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onAnalysisComplete(parsedData.recommendedKeywords, parsedData.condition, parsedData.specialty)}
                className="w-full bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-750 text-slate-950 transition-colors py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/5 focus:outline-none"
              >
                Assemble Search Form <Eye className="h-3.5 w-3.5 text-slate-950" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
