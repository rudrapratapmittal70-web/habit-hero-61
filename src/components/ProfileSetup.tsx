import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Scale, Ruler, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileSetupProps {
  onSetup: (age: number, weight: number, height: number) => void;
}

export function ProfileSetup({ onSetup }: ProfileSetupProps) {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (ageNum > 0 && weightNum > 0 && heightNum > 0) {
      onSetup(ageNum, weightNum, heightNum);
    }
  };

  const isValid = age && weight && height && 
    parseInt(age) > 0 && parseFloat(weight) > 0 && parseFloat(height) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background p-6 flex flex-col"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Let's Set Up Your Profile</h1>
        <p className="text-muted-foreground">We'll calculate your daily calorie goal for weight gain</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <Label htmlFor="age" className="flex items-center gap-2 text-foreground mb-2">
            <User className="w-4 h-4 text-primary" />
            Age
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
            min="1"
            max="120"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <Label htmlFor="weight" className="flex items-center gap-2 text-foreground mb-2">
            <Scale className="w-4 h-4 text-primary" />
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="Enter your weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
            min="20"
            max="300"
            step="0.1"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <Label htmlFor="height" className="flex items-center gap-2 text-foreground mb-2">
            <Ruler className="w-4 h-4 text-primary" />
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            placeholder="Enter your height in cm"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
            min="100"
            max="250"
            step="0.1"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4"
        >
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full h-14 rounded-2xl text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Calculate My Goal
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
