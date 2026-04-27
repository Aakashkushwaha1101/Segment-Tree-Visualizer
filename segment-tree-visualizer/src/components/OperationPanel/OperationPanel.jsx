import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, RefreshCw, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

/**
 * OPERATION PANEL COMPONENT
 * 
 * User operations ke liye control panel
 * Features:
 * - Range Query
 * - Point Update
 * - Range Update
 * - Animation controls (play/pause/step)
 * - Speed control
 */
const OperationPanel = ({ 
  arrayLength,
  onRangeQuery,
  onPointUpdate,
  onRangeUpdate,
  isAnimating,
  onPlayPause,
  onStepForward,
  onReset,
  animationSpeed,
  onSpeedChange
}) => {
  // ==================== STATE ====================
  
  // Query inputs
  const [queryStart, setQueryStart] = useState(0);
  const [queryEnd, setQueryEnd] = useState(arrayLength - 1);
  
  // Point update inputs
  const [updateIndex, setUpdateIndex] = useState(0);
  const [updateValue, setUpdateValue] = useState(0);
  
  // Range update inputs
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(arrayLength - 1);
  const [rangeValue, setRangeValue] = useState(0);
  
  // Active tab
  const [activeTab, setActiveTab] = useState('query'); // 'query' | 'point' | 'range'

  // ==================== VALIDATION ====================
  
  const isValidQuery = () => {
    return queryStart >= 0 && 
           queryEnd < arrayLength && 
           queryStart <= queryEnd;
  };

  const isValidPointUpdate = () => {
    return updateIndex >= 0 && updateIndex < arrayLength;
  };

  const isValidRangeUpdate = () => {
    return rangeStart >= 0 && 
           rangeEnd < arrayLength && 
           rangeStart <= rangeEnd;
  };

  // ==================== HANDLERS ====================
  
  const handleQuery = () => {
    if (isValidQuery()) {
      onRangeQuery(queryStart, queryEnd);
    }
  };

  const handlePointUpdate = () => {
    if (isValidPointUpdate()) {
      onPointUpdate(updateIndex, parseInt(updateValue));
    }
  };

  const handleRangeUpdate = () => {
    if (isValidRangeUpdate()) {
      onRangeUpdate(rangeStart, rangeEnd, parseInt(rangeValue));
    }
  };

  // ==================== TAB CONFIGURATION ====================
  
  const tabs = [
    { id: 'query', name: 'Range Query', icon: Search },
    { id: 'point', name: 'Point Update', icon: Edit },
    { id: 'range', name: 'Range Update', icon: RefreshCw }
  ];

  // ==================== UI RENDER ====================
  
  return (
    <div className="glass-container p-6">
      {/* Header */}
      <h2 className="text-white text-xl font-semibold mb-4">Operations</h2>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-3 py-2 rounded-lg text-sm font-medium
                transition-all flex items-center justify-center gap-2
                ${activeTab === tab.id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        
        {/* RANGE QUERY TAB */}
        {activeTab === 'query' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 text-xs mb-1">Start Index</label>
                <input
                  type="number"
                  value={queryStart}
                  onChange={(e) => setQueryStart(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  max={arrayLength - 1}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 
                           rounded-lg text-white text-sm focus:outline-none 
                           focus:border-white/40 font-mono"
                />
              </div>
              <div>
                <label className="block text-white/70 text-xs mb-1">End Index</label>
                <input
                  type="number"
                  value={queryEnd}
                  onChange={(e) => setQueryEnd(Math.min(arrayLength - 1, parseInt(e.target.value) || 0))}
                  min="0"
                  max={arrayLength - 1}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 
                           rounded-lg text-white text-sm focus:outline-none 
                           focus:border-white/40 font-mono"
                />
              </div>
            </div>
            
            <motion.button
              onClick={handleQuery}
              disabled={!isValidQuery()}
              className={`
                w-full py-3 rounded-lg font-semibold flex items-center 
                justify-center gap-2 transition-all
                ${isValidQuery()
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                }
              `}
              whileHover={isValidQuery() ? { scale: 1.02 } : {}}
              whileTap={isValidQuery() ? { scale: 0.98 } : {}}
            >
              <Search size={18} />
              Query Range [{queryStart}, {queryEnd}]
            </motion.button>

            <p className="text-white/50 text-xs text-center">
              Find sum/min/max in the selected range
            </p>
          </motion.div>
        )}

        {/* POINT UPDATE TAB */}
        {activeTab === 'point' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 text-xs mb-1">Array Index</label>
                <input
                  type="number"
                  value={updateIndex}
                  onChange={(e) => setUpdateIndex(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  max={arrayLength - 1}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 
                           rounded-lg text-white text-sm focus:outline-none 
                           focus:border-white/40 font-mono"
                />
              </div>
              <div>
                <label className="block text-white/70 text-xs mb-1">New Value</label>
                <input
                  type="number"
                  value={updateValue}
                  onChange={(e) => setUpdateValue(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 
                           rounded-lg text-white text-sm focus:outline-none 
                           focus:border-white/40 font-mono"
                />
              </div>
            </div>
            
            <motion.button
              onClick={handlePointUpdate}
              disabled={!isValidPointUpdate()}
              className={`
                w-full py-3 rounded-lg font-semibold flex items-center 
                justify-center gap-2 transition-all
                ${isValidPointUpdate()
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                }
              `}
              whileHover={isValidPointUpdate() ? { scale: 1.02 } : {}}
              whileTap={isValidPointUpdate() ? { scale: 0.98 } : {}}
            >
              <Edit size={18} />
              Update arr[{updateIndex}] = {updateValue}
            </motion.button>

            <p className="text-white/50 text-xs text-center">
              Change single element and update tree
            </p>
          </motion.div>
        )}

        {/* RANGE UPDATE TAB */}
        {activeTab === 'range' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-white/70 text-xs mb-1">Start</label>
                <input
                  type="number"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  max={arrayLength - 1}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 
                           rounded-lg text-white text-sm focus:outline-none 
                           focus:border-white/40 font-mono"
                />
              </div>
              <div>
                <label className="block text-white/70 text-xs mb-1">End</label>
                <input
                  type="number"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(Math.min(arrayLength - 1, parseInt(e.target.value) || 0))}
                  min="0"
                  max={arrayLength - 1}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 
                           rounded-lg text-white text-sm focus:outline-none 
                           focus:border-white/40 font-mono"
                />
              </div>
              <div>
                <label className="block text-white/70 text-xs mb-1">Add Value</label>
                <input
                  type="number"
                  value={rangeValue}
                  onChange={(e) => setRangeValue(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 
                           rounded-lg text-white text-sm focus:outline-none 
                           focus:border-white/40 font-mono"
                />
              </div>
            </div>
            
            <motion.button
              onClick={handleRangeUpdate}
              disabled={!isValidRangeUpdate()}
              className={`
                w-full py-3 rounded-lg font-semibold flex items-center 
                justify-center gap-2 transition-all
                ${isValidRangeUpdate()
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
                }
              `}
              whileHover={isValidRangeUpdate() ? { scale: 1.02 } : {}}
              whileTap={isValidRangeUpdate() ? { scale: 0.98 } : {}}
            >
              <RefreshCw size={18} />
              Add {rangeValue} to [{rangeStart}, {rangeEnd}]
            </motion.button>

            <p className="text-white/50 text-xs text-center">
              Add value to all elements in range (Lazy Propagation)
            </p>
          </motion.div>
        )}
      </div>

      {/* Animation Controls */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h3 className="text-white/70 text-sm font-medium mb-3">Animation Controls</h3>
        
        <div className="flex gap-2 mb-4">
          <motion.button
            onClick={onPlayPause}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 
                     rounded-lg text-white font-medium flex items-center 
                     justify-center gap-2 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAnimating ? <Pause size={16} /> : <Play size={16} />}
            {isAnimating ? 'Pause' : 'Play'}
          </motion.button>
          
          <motion.button
            onClick={onStepForward}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg 
                     text-white flex items-center justify-center transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Step Forward"
          >
            <SkipForward size={16} />
          </motion.button>
          
          <motion.button
            onClick={onReset}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg 
                     text-white flex items-center justify-center transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Reset"
          >
            <RotateCcw size={16} />
          </motion.button>
        </div>

        {/* Speed Control */}
        <div>
          <div className="flex justify-between text-white/60 text-xs mb-2">
            <span>Speed</span>
            <span>{animationSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-white/40 text-xs mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationPanel;