import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, emoji: string) => void;
}

const emojiOptions = ['💧', '🏃', '📚', '🧘', '💪', '🥗', '😴', '📝', '🎯', '🌱', '🧠', '❤️'];

export const AddHabitModal = ({ isOpen, onClose, onAdd }: AddHabitModalProps) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💧');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), selectedEmoji);
      setName('');
      setSelectedEmoji('💧');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 z-50 shadow-float"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">New Habit</h2>
              <button onClick={onClose} className="p-2 text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Choose an icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                        selectedEmoji === emoji
                          ? 'bg-primary/20 ring-2 ring-primary'
                          : 'bg-muted'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Habit name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Morning walk"
                  className="h-12 text-base"
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={!name.trim()}>
                Add Habit
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
