import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Loader2, Utensils, Plus, Minus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FOOD_DATABASE, matchFoodFromLabel } from '@/types/nutrition';
import { toast } from 'sonner';

interface FoodScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (meal: { name: string; calories: number; protein: number; carbs: number; fat: number; imageUrl?: string }) => void;
}

export function FoodScanner({ isOpen, onClose, onAddMeal }: FoodScannerProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedFood, setDetectedFood] = useState<string | null>(null);
  const [nutrition, setNutrition] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null);
  const [servings, setServings] = useState(1);
  const [manualMode, setManualMode] = useState(false);
  const [manualFood, setManualFood] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const classifierRef = useRef<any>(null);

  // Load the image classification pipeline on first use
  const loadClassifier = async () => {
    if (classifierRef.current) return classifierRef.current;
    
    try {
      const { pipeline } = await import('@huggingface/transformers');
      classifierRef.current = await pipeline(
        'image-classification',
        'Xenova/vit-base-patch16-224',
        { device: 'cpu' }
      );
      return classifierRef.current;
    } catch (error) {
      console.error('Error loading classifier:', error);
      throw error;
    }
  };

  const analyzeImage = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    
    try {
      const classifier = await loadClassifier();
      const results = await classifier(imageDataUrl);
      
      if (results && results.length > 0) {
        // Get the top prediction
        const topResult = results[0];
        const foodKey = matchFoodFromLabel(topResult.label);
        const foodData = FOOD_DATABASE[foodKey];
        
        setDetectedFood(topResult.label);
        setNutrition({
          calories: Math.round((foodData.calories * foodData.servingSize) / 100),
          protein: Math.round((foodData.protein * foodData.servingSize) / 100),
          carbs: Math.round((foodData.carbs * foodData.servingSize) / 100),
          fat: Math.round((foodData.fat * foodData.servingSize) / 100),
        });
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

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);
      await analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleManualSearch = () => {
    const foodKey = matchFoodFromLabel(manualFood);
    const foodData = FOOD_DATABASE[foodKey];
    
    setDetectedFood(manualFood || 'Custom Food');
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
    setImageUrl(null);
    setDetectedFood(null);
    setNutrition(null);
    setServings(1);
    setManualMode(false);
    setManualFood('');
  };

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
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {!imageUrl && !manualMode ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Camera/Upload Option */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-square bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 transition-colors hover:border-primary"
                >
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-medium">Take or Upload Photo</p>
                    <p className="text-muted-foreground text-sm">AI will analyze your food</p>
                  </div>
                </button>
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
              </motion.div>
            ) : isAnalyzing ? (
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
                <p className="text-foreground font-medium">Analyzing your food...</p>
                <p className="text-muted-foreground text-sm">This may take a moment</p>
              </motion.div>
            ) : manualMode && !nutrition ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-card rounded-2xl p-4">
                  <label className="text-foreground font-medium mb-2 block">Food Name</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., chicken, rice, pizza..."
                      value={manualFood}
                      onChange={(e) => setManualFood(e.target.value)}
                      className="bg-secondary border-0"
                    />
                    <Button onClick={handleManualSearch} disabled={!manualFood}>
                      Search
                    </Button>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-2xl p-4">
                  <p className="text-muted-foreground text-sm">
                    Tip: Try common foods like "chicken", "rice", "pizza", "burger", "pasta", "salad", etc.
                  </p>
                </div>
              </motion.div>
            ) : nutrition ? (
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
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
