import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

/**
 * CUSTOM TREE NODE COMPONENT
 * 
 * Har node ko beautiful glassmorphism style me render karta hai
 * Features:
 * - Range display [start, end]
 * - Value display
 * - Lazy value badge (agar hai to)
 * - Color coding based on state
 * - Smooth animations
 */
const TreeNode = memo(({ data, selected }) => {
  const { range, value, lazyValue, isLeaf, level, highlightState } = data;

  /**
   * NODE COLOR SELECTION
   * State ke according color decide karta hai
   */
  const getNodeColor = () => {
    if (highlightState === 'complete') {
      return 'bg-green-500/30 border-green-400 shadow-green-500/50';
    }
    if (highlightState === 'partial') {
      return 'bg-orange-500/30 border-orange-400 shadow-orange-500/50';
    }
    if (highlightState === 'none') {
      return 'bg-red-500/20 border-red-300 shadow-red-500/30';
    }
    if (highlightState === 'lazy') {
      return 'bg-purple-500/30 border-purple-400 shadow-purple-500/50';
    }
    if (highlightState === 'update') {
      return 'bg-pink-500/30 border-pink-400 shadow-pink-500/50';
    }
    
    // Default state
    if (lazyValue !== null && lazyValue !== 0) {
      return 'bg-purple-500/20 border-purple-300 shadow-purple-500/30';
    }
    if (isLeaf) {
      return 'bg-blue-500/20 border-blue-300 shadow-blue-500/30';
    }
    return 'bg-indigo-500/15 border-indigo-300/50 shadow-indigo-500/20';
  };

  /**
   * ANIMATION VARIANTS
   * Node appear/disappear animations
   */
  const nodeVariants = {
    hidden: { 
      scale: 0,
      opacity: 0,
      rotate: -180
    },
    visible: { 
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: level * 0.1 // Har level thoda delay se appear hoga
      }
    },
    highlighted: {
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    }
  };

  return (
    <>
      {/* Top Handle - Parent se connect hone ke liye */}
      {level > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            width: 8,
            height: 8,
            border: '2px solid rgba(255, 255, 255, 0.5)',
          }}
        />
      )}

      {/* Main Node Container */}
      <motion.div
        variants={nodeVariants}
        initial="hidden"
        animate={highlightState ? "highlighted" : "visible"}
        className={`
          px-4 py-3 rounded-xl border-2
          backdrop-blur-md
          min-w-[100px] text-center
          shadow-lg
          transition-all duration-300
          ${getNodeColor()}
          ${selected ? 'ring-2 ring-white/50' : ''}
        `}
        whileHover={{ scale: 1.05, y: -2 }}
      >
        {/* Range Label */}
        <div className="text-white/60 text-xs font-mono mb-1">
          [{range[0]}, {range[1]}]
        </div>

        {/* Value Display */}
        <div className="text-white text-lg font-bold font-mono">
          {value}
        </div>

        {/* Lazy Value Badge (agar pending update hai) */}
        {lazyValue !== null && lazyValue !== 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-1 px-2 py-0.5 bg-purple-500/50 rounded-full text-xs text-white"
          >
            Lazy: +{lazyValue}
          </motion.div>
        )}

        {/* Leaf Indicator */}
        {isLeaf && (
          <div className="mt-1 text-xs text-white/40">
            🍃 Leaf
          </div>
        )}

        {/* Level Indicator (for debugging) */}
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-white/20 
                      rounded-full text-xs text-white/60 flex items-center justify-center">
          {level}
        </div>
      </motion.div>

      {/* Bottom Handles - Children ke liye (agar leaf nahi hai) */}
      {!isLeaf && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="left"
            style={{
              left: '30%',
              background: 'rgba(255, 255, 255, 0.3)',
              width: 8,
              height: 8,
              border: '2px solid rgba(255, 255, 255, 0.5)',
            }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="right"
            style={{
              left: '70%',
              background: 'rgba(255, 255, 255, 0.3)',
              width: 8,
              height: 8,
              border: '2px solid rgba(255, 255, 255, 0.5)',
            }}
          />
        </>
      )}
    </>
  );
});

TreeNode.displayName = 'TreeNode';

export default TreeNode;