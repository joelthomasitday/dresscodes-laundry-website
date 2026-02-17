"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Loader2, Sparkles, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export interface AnalysisResult {
  cloth_type: string;
  category: string;
  fabric_type: string;
  stain_detected: boolean;
  stain_type: string;
  recommended_service: string;
  complexity_level: string;
  care_risk_level: string;
  auto_select_service: boolean;
  auto_fill_booking_fields: {
    suggested_service: string;
    priority: string;
  };
  confidence_score: number;
}

export function SmartGarmentAnalyzer({ onApply }: { onApply?: (result: AnalysisResult) => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeGarment = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-cloth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Detected: ${data.cloth_type}. Recommended: ${data.recommended_service.replace(/_/g, " ")}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Failed to analyze garment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <Card className="overflow-hidden border-2 border-emerald-100 shadow-xl bg-gradient-to-br from-white to-emerald-50/30">
      <CardHeader className="bg-emerald-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Garment Analyzer
            </CardTitle>
            <CardDescription className="text-emerald-50/90 mt-1">
              Upload a photo to get instant cleaning recommendations
            </CardDescription>
          </div>
          {result && (
            <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md">
              Score: {(result.confidence_score * 100).toFixed(0)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!image ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-2xl p-12 bg-white transition-all hover:bg-emerald-50/50 group">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Garment Photo</h3>
            <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
              Take a clear photo of your garment, especially if there are visible stains.
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8">
              <label className="cursor-pointer">
                Select Photo
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-emerald-100 bg-gray-100 shadow-inner group">
              {image && <Image src={image} alt="Garment preview" fill className="object-contain" />}
              
              {!result && !isAnalyzing && (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[1px] group-hover:backdrop-blur-[2px] transition-all">
                   <div className="flex flex-col gap-3">
                    <Button onClick={analyzeGarment} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg rounded-full px-8 gap-2 scale-110">
                      <Sparkles className="h-4 w-4" /> Analyse Garment
                    </Button>
                    <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20 rounded-full shadow-sm" onClick={reset}>
                      Cancel
                    </Button>
                   </div>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-md">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
                    <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-emerald-900 font-black animate-pulse tracking-[0.2em] text-sm uppercase">AI IS SCANNING</p>
                    <div className="w-32 h-1 bg-emerald-100 rounded-full mt-2 overflow-hidden">
                      <div className="w-full h-full bg-emerald-600 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
              
              {result && (
                <div className="absolute top-4 right-4">
                  <Button size="icon" variant="secondary" className="rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-white" onClick={reset}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-emerald-100 shadow-sm transition-all hover:shadow-md">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Detected Items</h4>
                    <p className="text-lg font-bold text-gray-900">{result.cloth_type}</p>
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      <Badge variant="outline" className="bg-emerald-50 border-emerald-100 text-emerald-700 capitalize">
                        {result.category}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 border-blue-50 text-blue-700 capitalize">
                        {result.fabric_type}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-emerald-100 shadow-sm transition-all hover:shadow-md">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Stain Status</h4>
                    <div className="flex items-center gap-2">
                       {result.stain_detected ? (
                         <>
                           <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                           <span className="font-bold text-orange-700">{result.stain_type && result.stain_type !== "none" ? result.stain_type : "Stain detected"}</span>
                         </>
                       ) : (
                         <>
                           <CheckCircle className="h-5 w-5 text-emerald-500" />
                           <span className="font-bold text-emerald-700">No major stains visible</span>
                         </>
                       )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-emerald-600 rounded-xl shadow-lg text-white border-b-4 border-emerald-800">
                    <h4 className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-1.5">Recommended Service</h4>
                    <p className="text-xl font-black capitalize tracking-tight">{result.recommended_service.replace(/_/g, " ")}</p>
                    <div className="mt-3.5 flex flex-wrap gap-2">
                       <Badge variant="secondary" className="bg-white/10 text-white border-white/10 backdrop-blur-sm capitalize text-[10px]">
                         Risk: {result.care_risk_level}
                       </Badge>
                       <Badge variant="secondary" className="bg-white/10 text-white border-white/10 backdrop-blur-sm capitalize text-[10px]">
                         Care: {result.complexity_level}
                       </Badge>
                    </div>
                  </div>

                  {onApply && (
                    <Button 
                      className="w-full h-[60px] bg-gray-900 hover:bg-black text-white rounded-xl font-black gap-2 transition-all hover:translate-y-[-2px] active:translate-y-[0px] shadow-xl hover:shadow-emerald-200"
                      onClick={() => onApply(result)}
                    >
                      Apply To My Booking
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
