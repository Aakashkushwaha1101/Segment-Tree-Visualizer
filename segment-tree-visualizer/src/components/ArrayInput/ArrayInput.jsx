import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ARRAY INPUT COMPONENT
 * 
 * Beautiful glassmorphism input component
 * Features:
 * - Real-time validation
 * - Visual feedback
 * - Smooth animations
 * - Preset examples
 */
const ArrayInput = ({ array, setArray, onBuildTree, isTreeBuilt }) => {
  // Local state for input field
  const [inputValue, setInputValue] = useState(array.join(', '));
  const [error, setError] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  // Preset arrays for quick testing
  const presets = [
    { name: 'Small', arr: [1, 3, 5, 7] },
    { name: 'Medium', arr: [2, 4, 6, 8, 10, 12] },
    { name: 'Large', arr: [1, 3, 5, 7, 9, 11, 13, 15] },
    { name: 'Random', arr: Array.from({length: 8}, () => Math.floor(Math.random() * 50)) },
    { name: 'Powers of 2', arr: [1, 2, 4, 8, 16, 32] },
  ];

  /**
   * INPUT VALIDATION
   * Check karta hai ki valid array hai ya nahi
   */
  const validateInput = (value) => {
    // Empty check
    if (!value.trim()) {
      setError('Array cannot be empty');
      return false;
    }

    // Parse karo
    try {
      const arr = value
        .split(',')
        .map(num => num.trim())
        .filter(num => num !== '');

      // Check: sirf numbers hain
      const parsedArr = arr.map(num => {
        const parsed = parseInt(num);
        if (isNaN(parsed)) {
          throw new Error('Only numbers allowed');
        }
        return parsed;
      });

      // Check: array length reasonable hai
      if (parsedArr.length < 2) {
        setError('Need at least 2 elements');
        return false;
      }

      if (parsedArr.length > 15) {
        setError('Maximum 15 elements allowed');
        return false;
      }

      // All good!
      setError('');
      return parsedArr;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  /**
   * HANDLE INPUT CHANGE
   * Jab user type kare
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Real-time validation (but don't show error until blur)
    const validated = validateInput(value);
    if (validated) {
      setArray(validated);
    }
  };

  /**
   * HANDLE BUILD BUTTON
   * Tree build karne ke liye
   */
  const handleBuild = () => {
    const validated = validateInput(inputValue);
    if (validated) {
      setArray(validated);
      onBuildTree();
    }
  };

  /**
   * PRESET SELECTION
   * Quick examples ke liye
   */
  const handlePresetSelect = (preset) => {
    const newValue = preset.arr.join(', ');
    setInputValue(newValue);
    setArray(preset.arr);
    setError('');
    setShowPresets(false);
  };

  return (
    <div className="glass-container p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">Input Array</h2>
        <motion.button
          onClick={() => setShowPresets(!showPresets)}
          className="text-white/60 hover:text-white text-sm px-3 py-1 
                     bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📋 Presets
        </motion.button>
      </div>

      {/* Presets Dropdown */}
      <AnimatePresence>
        {showPresets && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 space-y-2 overflow-hidden"
          >
            {presets.map((preset, idx) => (
              <motion.button
                key={idx}
                onClick={() => handlePresetSelect(preset)}
                className="w-full text-left px-4 py-2 bg-white/5 hover:bg-white/10 
                         rounded-lg text-white/70 hover:text-white text-sm transition-all"
                whileHover={{ x: 4 }}
              >
                <span className="font-medium">{preset.name}:</span>{' '}
                <span className="font-mono">[{preset.arr.join(', ')}]</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Field */}
      <div className="mb-4">
        <label className="block text-white/70 text-sm mb-2">
          Enter comma-separated numbers
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="e.g., 1, 3, 5, 7, 9"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 
                   rounded-lg text-white placeholder-white/30
                   focus:outline-none focus:border-white/40 focus:bg-white/15
                   transition-all font-mono"
        />
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 text-red-300 text-sm"
            >
              ⚠️ {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Current Array Preview */}
      <div className="mb-4">
        <p className="text-white/50 text-xs mb-2">Current Array:</p>
        <div className="flex flex-wrap gap-2">
          {array.map((num, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 
                       rounded-lg text-white font-mono text-sm"
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Build Button */}
      <motion.button
        onClick={handleBuild}
        disabled={!!error || array.length === 0}
        className={`w-full py-3 rounded-lg font-semibold text-white
          ${error || array.length === 0
            ? 'bg-white/10 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg'
          } transition-all`}
        whileHover={!error && array.length > 0 ? { scale: 1.02, y: -2 } : {}}
        whileTap={!error && array.length > 0 ? { scale: 0.98 } : {}}
      >
        {isTreeBuilt ? '🔄 Rebuild Tree' : '🌳 Build Tree'}
      </motion.button>

      {/* Info Text */}
      <p className="mt-3 text-white/40 text-xs text-center">
        Array size: {array.length} | 
        Range: {array.length > 0 ? `${Math.min(...array)} - ${Math.max(...array)}` : 'N/A'}
      </p>
    </div>
  );
};

export default ArrayInput;