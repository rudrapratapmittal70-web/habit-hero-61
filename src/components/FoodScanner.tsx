import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Loader2, Utensils, Plus, Minus, Check, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FOOD_DATABASE, matchFoodFromLabel } from '@/types/nutrition';
import { toast } from 'sonner';

interface FoodScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (meal: { name: string; calories: number; protein: number; carbs: number; fat: number; imageUrl?: string }) => void;
}

// Popular Indian foods for quick selection
const POPULAR_FOODS = ['Dal', 'Roti', 'Rice', 'Biryani', 'Paneer', 'Chicken', 'Samosa', 'Dosa', 'Idli', 'Chole', 'Naan', 'Paratha'];

// Labels used for zero-shot image classification (kept intentionally small for speed)
const CANDIDATE_LABELS = [
  // Fruits
  'banana', 'apple', 'orange', 'mango', 'grapes', 'watermelon', 'papaya', 'pineapple', 'pomegranate',
  // Common Indian foods
  'dal', 'rajma', 'chole', 'paneer', 'palak paneer', 'butter chicken', 'chicken tikka', 'biryani',
  'roti', 'naan', 'paratha', 'idli', 'dosa', 'samosa', 'pakora', 'pav bhaji', 'poha', 'upma', 'khichdi',
  'lassi', 'masala chai',
  // General foods
  'salad', 'rice', 'chicken', 'fish', 'egg', 'pizza', 'burger', 'sandwich',
];

export function FoodScanner({ isOpen, onClose, onAddMeal }: FoodScannerProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [detectedFood, setDetectedFood] = useState<string | null>(null);
  const [nutrition, setNutrition] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null);
  const [servings, setServings] = useState(1);
  const [manualMode, setManualMode] = useState(false);
  const [manualFood, setManualFood] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const classifierRef = useRef<any>(null);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      // Stop any existing stream
      stopCamera();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      let errorMessage = 'Could not access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotSupportedError' || error.name === 'TypeError') {
        errorMessage += 'Camera not supported in this browser. Try uploading an image.';
      } else {
        errorMessage += 'Try uploading an image instead.';
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
    }
  }, [stopCamera]);

  // Capture photo from camera
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    stopCamera();
    setImageUrl(dataUrl);
    await analyzeImage(dataUrl);
  }, [stopCamera]);

  // Load the image classifier on first use (zero-shot for better food recognition)
  const loadClassifier = async () => {
    if (classifierRef.current) return classifierRef.current;

    setIsLoadingModel(true);
    try {
      const { pipeline } = await import('@huggingface/transformers');

      // Try WebGPU first for better performance
      try {
        classifierRef.current = await pipeline(
          'zero-shot-image-classification',
          'Xenova/clip-vit-base-patch32',
          { device: 'webgpu' }
        );
      } catch {
        // Fallback to CPU
        classifierRef.current = await pipeline(
          'zero-shot-image-classification',
          'Xenova/clip-vit-base-patch32',
          { device: 'cpu' }
        );
      }

      return classifierRef.current;
    } catch (error) {
      console.error('Error loading classifier:', error);
      throw error;
    } finally {
      setIsLoadingModel(false);
    }
  };

  const analyzeImage = async (imageDataUrl: string) => {
    setIsAnalyzing(true);

    try {
      const classifier = await loadClassifier();
      const results = await classifier(imageDataUrl, CANDIDATE_LABELS, { topk: 5 });
      console.log('Zero-shot classification results:', results);

      if (!results || results.length === 0) {
        throw new Error('No classification results');
      }

      const bestLabel: string = results[0].label;
      const foodKey = matchFoodFromLabel(bestLabel);
      const foodData = FOOD_DATABASE[foodKey] ?? FOOD_DATABASE.food;

      setDetectedFood(
        foodKey === 'food'
          ? bestLabel
          : foodKey.charAt(0).toUpperCase() + foodKey.slice(1)
      );
      setNutrition({
        calories: Math.round((foodData.calories * foodData.servingSize) / 100),
        protein: Math.round((foodData.protein * foodData.servingSize) / 100),
        carbs: Math.round((foodData.carbs * foodData.servingSize) / 100),
        fat: Math.round((foodData.fat * foodData.servingSize) / 100),
      });

      if (foodKey === 'food') {
        toast.info('Not sure what this is—try manual search or pick from Popular Foods.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Could not analyze image. Try manual entry.');
      setManualMode(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);
      await analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleManualSearch = () => {
    if (!manualFood.trim()) {
      toast.error('Please enter a food name');
      return;
    }
    
    const foodKey = matchFoodFromLabel(manualFood);
    const foodData = FOOD_DATABASE[foodKey];
    
    setDetectedFood(manualFood.charAt(0).toUpperCase() + manualFood.slice(1));
    setNutrition({
      calories: Math.round((foodData.calories * foodData.servingSize) / 100),
      protein: Math.round((foodData.protein * foodData.servingSize) / 100),
      carbs: Math.round((foodData.carbs * foodData.servingSize) / 100),
      fat: Math.round((foodData.fat * foodData.servingSize) / 100),
    });
  };

  const handleQuickSelect = (food: string) => {
    const foodKey = matchFoodFromLabel(food);
    const foodData = FOOD_DATABASE[foodKey];
    
    setDetectedFood(food);
    setNutrition({
      calories: Math.round((foodData.calories * foodData.servingSize) / 100),
      protein: Math.round((foodData.protein * foodData.servingSize) / 100),
      carbs: Math.round((foodData.carbs * foodData.servingSize) / 100),
      fat: Math.round((foodData.fat * foodData.servingSize) / 100),
    });
  };

  const handleAddMeal = () => {
    if (!nutrition || !detectedFood) return;
    
    onAddMeal({
      name: detectedFood,
      calories: Math.round(nutrition.calories * servings),
      protein: Math.round(nutrition.protein * servings),
      carbs: Math.round(nutrition.carbs * servings),
      fat: Math.round(nutrition.fat * servings),
      imageUrl: imageUrl || undefined,
    });
    
    toast.success('Meal added!');
    handleReset();
    onClose();
  };

  const handleReset = () => {
    stopCamera();
    setImageUrl(null);
    setDetectedFood(null);
    setNutrition(null);
    setServings(1);
    setManualMode(false);
    setManualFood('');
    setCameraError(null);
  };

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Add Food</h2>
            <Button variant="ghost" size="icon" onClick={() => { handleReset(); onClose(); }}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Camera View */}
            {isCameraActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative rounded-2xl overflow-hidden bg-black"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-[4/3] object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={stopCamera}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-16 w-16 rounded-full bg-primary"
                    onClick={capturePhoto}
                  >
                    <Camera className="h-8 w-8" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Initial Options */}
            {!imageUrl && !manualMode && !isCameraActive && !isAnalyzing && !isLoadingModel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Camera Error */}
                {cameraError && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {cameraError}
                  </div>
                )}

                {/* Camera/Upload Options */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={startCamera}
                    className="aspect-square bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 transition-colors hover:border-primary"
                  >
                    <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                      <Camera className="w-7 h-7 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-sm">Take Photo</span>
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 transition-colors hover:border-primary"
                  >
                    <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                      <Upload className="w-7 h-7 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-sm">Upload Image</span>
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Manual Entry Option */}
                <button
                  onClick={() => setManualMode(true)}
                  className="w-full p-4 bg-card rounded-2xl flex items-center gap-4 transition-colors hover:bg-secondary"
                >
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground font-medium">Manual Entry</p>
                    <p className="text-muted-foreground text-sm">Search or type food name</p>
                  </div>
                </button>

                {/* Popular Foods */}
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-3">Popular Foods</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_FOODS.map((food) => (
                      <Button
                        key={food}
                        variant="secondary"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleQuickSelect(food)}
                      >
                        {food}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {(isAnalyzing || isLoadingModel) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-4"
              >
                <div className="relative">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Food"
                      className="w-48 h-48 object-cover rounded-2xl"
                    />
                  )}
                  <div className="absolute inset-0 bg-background/60 rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  </div>
                </div>
                <p className="text-foreground font-medium">
                  {isLoadingModel ? 'Loading AI model...' : 'Analyzing your food...'}
                </p>
                <p className="text-muted-foreground text-sm">This may take a moment</p>
              </motion.div>
            )}

            {/* Manual Mode */}
            {manualMode && !nutrition && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-card rounded-2xl p-4">
                  <label className="text-foreground font-medium mb-2 block">Food Name</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., dal, biryani, roti, paneer..."
                      value={manualFood}
                      onChange={(e) => setManualFood(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                      className="bg-secondary border-0"
                    />
                    <Button onClick={handleManualSearch} disabled={!manualFood}>
                      Search
                    </Button>
                  </div>
                </div>

                {/* Quick Select */}
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-3">Quick Select</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_FOODS.map((food) => (
                      <Button
                        key={food}
                        variant="secondary"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleQuickSelect(food)}
                      >
                        {food}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button variant="ghost" className="w-full" onClick={() => setManualMode(false)}>
                  Back to Camera
                </Button>
              </motion.div>
            )}

            {/* Results */}
            {nutrition && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Food Preview */}
                <div className="bg-card rounded-2xl p-4 flex items-center gap-4">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Food"
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Utensils className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-foreground font-semibold capitalize">{detectedFood}</p>
                    <p className="text-muted-foreground text-sm">Per serving</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Nutrition Info */}
                <div className="bg-card rounded-2xl p-4 space-y-3">
                  <h3 className="text-foreground font-semibold">Nutrition Facts</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/10 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{Math.round(nutrition.calories * servings)}</p>
                      <p className="text-muted-foreground text-sm">Calories</p>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-accent">{Math.round(nutrition.protein * servings)}g</p>
                      <p className="text-muted-foreground text-sm">Protein</p>
                    </div>
                    <div className="bg-streak/10 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-streak">{Math.round(nutrition.carbs * servings)}g</p>
                      <p className="text-muted-foreground text-sm">Carbs</p>
                    </div>
                    <div className="bg-progress/10 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-progress">{Math.round(nutrition.fat * servings)}g</p>
                      <p className="text-muted-foreground text-sm">Fat</p>
                    </div>
                  </div>
                </div>

                {/* Servings */}
                <div className="bg-card rounded-2xl p-4">
                  <p className="text-foreground font-medium mb-3">Servings</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                      className="w-12 h-12 rounded-full"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <span className="text-3xl font-bold text-foreground w-16 text-center">{servings}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setServings(servings + 0.5)}
                      className="w-12 h-12 rounded-full"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl"
                    onClick={handleReset}
                  >
                    Try Again
                  </Button>
                  <Button
                    className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground"
                    onClick={handleAddMeal}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Add Meal
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
