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
   * Vivid, visible colors — high opacity so nodes are always visible
   * regardless of background
   */
  const getNodeStyle = () => {
    // ── Highlight states (animation) ──────────────────────────────
    if (highlightState === 'active') {
      return {
        background: 'rgba(250, 204, 21, 0.85)',   // amber-400
        border:     '2px solid #fde047',
        boxShadow:  '0 0 20px 4px rgba(250,204,21,0.6), 0 4px 16px rgba(0,0,0,0.4)',
        color:      '#1a1a1a',
      };
    }
    if (highlightState === 'complete') {
      return {
        background: 'rgba(34, 197, 94, 0.85)',    // green-500
        border:     '2px solid #4ade80',
        boxShadow:  '0 0 20px 4px rgba(34,197,94,0.6), 0 4px 16px rgba(0,0,0,0.4)',
        color:      '#fff',
      };
    }
    if (highlightState === 'partial') {
      return {
        background: 'rgba(249, 115, 22, 0.85)',   // orange-500
        border:     '2px solid #fb923c',
        boxShadow:  '0 0 20px 4px rgba(249,115,22,0.6), 0 4px 16px rgba(0,0,0,0.4)',
        color:      '#fff',
      };
    }
    if (highlightState === 'none') {
      return {
        background: 'rgba(239, 68, 68, 0.75)',    // red-500
        border:     '2px solid #f87171',
        boxShadow:  '0 0 12px 2px rgba(239,68,68,0.4)',
        color:      '#fff',
      };
    }
    if (highlightState === 'lazy') {
      return {
        background: 'rgba(168, 85, 247, 0.85)',   // purple-500
        border:     '2px solid #c084fc',
        boxShadow:  '0 0 20px 4px rgba(168,85,247,0.6), 0 4px 16px rgba(0,0,0,0.4)',
        color:      '#fff',
      };
    }
    if (highlightState === 'update') {
      return {
        background: 'rgba(236, 72, 153, 0.85)',   // pink-500
        border:     '2px solid #f472b6',
        boxShadow:  '0 0 20px 4px rgba(236,72,153,0.6), 0 4px 16px rgba(0,0,0,0.4)',
        color:      '#fff',
      };
    }

    // ── Default states ────────────────────────────────────────────
    if (lazyValue !== null && lazyValue !== 0) {
      return {
        background: 'rgba(124, 58, 237, 0.80)',   // violet-600
        border:     '2px solid #a78bfa',
        boxShadow:  '0 0 14px 2px rgba(124,58,237,0.45), 0 4px 12px rgba(0,0,0,0.35)',
        color:      '#fff',
      };
    }
    if (isLeaf) {
      return {
        background: 'rgba(37, 99, 235, 0.80)',    // blue-600
        border:     '2px solid #60a5fa',
        boxShadow:  '0 0 14px 2px rgba(37,99,235,0.45), 0 4px 12px rgba(0,0,0,0.35)',
        color:      '#fff',
      };
    }
    // Internal node
    return {
      background: 'rgba(79, 70, 229, 0.80)',      // indigo-600
      border:     '2px solid #818cf8',
      boxShadow:  '0 0 14px 2px rgba(79,70,229,0.45), 0 4px 12px rgba(0,0,0,0.35)',
      color:      '#fff',
    };
  };

  const nodeStyle = getNodeStyle();

  /**
   * ANIMATION VARIANTS
   */
  const nodeVariants = {
    hidden: {
      scale:   0,
      opacity: 0,
      rotate:  -180,
    },
    visible: {
      scale:   1,
      opacity: 1,
      rotate:  0,
      transition: {
        type:      'spring',
        stiffness: 260,
        damping:   20,
        delay:     level * 0.08,
      },
    },
    highlighted: {
      scale: 1.12,
      transition: {
        type:      'spring',
        stiffness: 300,
        damping:   15,
      },
    },
  };

  return (
    <>
      {/* Top Handle — parent connection */}
      {level > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background:  'rgba(255,255,255,0.6)',
            width:       10,
            height:      10,
            border:      '2px solid rgba(255,255,255,0.9)',
            borderRadius: '50%',
          }}
        />
      )}

      {/* Main Node */}
      <motion.div
        variants={nodeVariants}
        initial="hidden"
        animate={highlightState ? 'highlighted' : 'visible'}
        whileHover={{ scale: 1.06, y: -3 }}
        style={{
          ...nodeStyle,
          backdropFilter: 'blur(8px)',
          borderRadius:   '14px',
          minWidth:       '110px',
          padding:        '10px 16px',
          textAlign:      'center',
          position:       'relative',
          outline:        selected ? '3px solid rgba(255,255,255,0.8)' : 'none',
          transition:     'box-shadow 0.2s ease, background 0.2s ease',
          userSelect:     'none',
        }}
      >
        {/* Range label */}
        <div style={{
          fontSize:     '11px',
          fontFamily:   'monospace',
          opacity:      0.75,
          marginBottom: '4px',
          letterSpacing: '0.5px',
          color:        nodeStyle.color,
        }}>
          [{range[0]}, {range[1]}]
        </div>

        {/* Value */}
        <div style={{
          fontSize:   '22px',
          fontWeight: '800',
          fontFamily: 'monospace',
          lineHeight:  1,
          color:      nodeStyle.color,
        }}>
          {value}
        </div>

        {/* Lazy badge */}
        {lazyValue !== null && lazyValue !== 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              marginTop:    '6px',
              padding:      '2px 8px',
              background:   'rgba(139,92,246,0.9)',
              borderRadius: '999px',
              fontSize:     '11px',
              color:        '#fff',
              fontWeight:   '600',
            }}
          >
            Lazy: +{lazyValue}
          </motion.div>
        )}

        {/* Leaf indicator */}
        {isLeaf && (
          <div style={{
            marginTop: '4px',
            fontSize:  '10px',
            opacity:   0.65,
            color:     nodeStyle.color,
          }}>
            🍃 Leaf
          </div>
        )}

        {/* Level badge */}
        <div style={{
          position:     'absolute',
          top:          '-10px',
          right:        '-10px',
          width:        '20px',
          height:       '20px',
          background:   'rgba(255,255,255,0.25)',
          borderRadius: '50%',
          fontSize:     '10px',
          color:        '#fff',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          fontWeight:   '700',
          border:       '1px solid rgba(255,255,255,0.4)',
        }}>
          {level}
        </div>
      </motion.div>

      {/* Bottom Handles — children */}
      {!isLeaf && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="left"
            style={{
              left:        '28%',
              background:  'rgba(255,255,255,0.6)',
              width:       10,
              height:      10,
              border:      '2px solid rgba(255,255,255,0.9)',
              borderRadius: '50%',
            }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="right"
            style={{
              left:        '72%',
              background:  'rgba(255,255,255,0.6)',
              width:       10,
              height:      10,
              border:      '2px solid rgba(255,255,255,0.9)',
              borderRadius: '50%',
            }}
          />
        </>
      )}
    </>
  );
});

TreeNode.displayName = 'TreeNode';

export default TreeNode;