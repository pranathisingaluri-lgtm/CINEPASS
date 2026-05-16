import { MOODS } from '../constants';
import { Mood } from '../types';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface MoodFilterProps {
  activeMood: Mood | null;
  onMoodChange: (mood: Mood | null) => void;
  onRandom: () => void;
}

export default function MoodFilter({ activeMood, onMoodChange, onRandom }: MoodFilterProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-rose-50 border border-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-display font-bold text-slate-900">How are you feeling?</h2>
          <p className="text-slate-500 text-sm">We'll find the perfect movie for your mood.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => onMoodChange(activeMood === mood.id ? null : mood.id)}
              className={`group flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                activeMood === mood.id
                  ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-xl group-hover:scale-125 transition-transform">{mood.icon}</span>
              <span className="font-semibold text-sm">{mood.label}</span>
            </button>
          ))}
          
          <button
            onClick={onRandom}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-dashed border-rose-200 text-rose-400 font-bold text-sm hover:bg-rose-50 hover:border-rose-300 transition-all group"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            Surprise Me!
          </button>
        </div>
      </div>
    </div>
  );
}
