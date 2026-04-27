/**
 * TREE TO GRAPH CONVERTER
 * 
 * Ye utility Segment Tree ko React Flow ke nodes aur edges me convert karti hai
 * Visualization ke liye positions calculate karti hai
 */

/**
 * Tree ko nodes aur edges me convert karta hai
 * @param {Array} tree - Segment tree array
 * @param {number} n - Original array length
 * @param {Array} lazy - Lazy propagation array
 * @returns {Object} - {nodes, edges} for React Flow
 */
export const convertTreeToGraph = (tree, n, lazy = null) => {
  const nodes = [];
  const edges = [];
  
  // Helper: Check karo ki node valid hai
  const isValidNode = (nodeIdx, start, end) => {
    return start <= end && nodeIdx < tree.length && tree[nodeIdx] !== undefined;
  };
  
  /**
   * IMPROVED LAYOUT ALGORITHM
   * Binary tree ke liye optimized horizontal spacing
   */
  const calculatePosition = (level, positionInLevel, totalNodesInLevel) => {
    const LEVEL_HEIGHT = 100; // Vertical gap between levels
    const BASE_WIDTH = 800; // Total width for tree
    
    const y = level * LEVEL_HEIGHT + 50;
    
    // Horizontal spacing: center se spread karo
    const levelWidth = BASE_WIDTH / Math.pow(2, Math.max(0, level - 1));
    const spacing = levelWidth / (totalNodesInLevel + 1);
    const x = spacing * (positionInLevel + 1) - BASE_WIDTH / 2;
    
    return { x, y };
  };
  
  // Track karo har level me kitne nodes hain
  const levelCounts = {};
  const levelPositions = {};
  
  /**
   * RECURSIVE TRAVERSAL
   * Tree traverse karke nodes aur edges banao
   */
  const traverse = (nodeIdx, start, end, level = 0) => {
    if (!isValidNode(nodeIdx, start, end)) return;
    
    // Level tracking
    if (!levelCounts[level]) {
      levelCounts[level] = 0;
      levelPositions[level] = 0;
    }
    
    const positionInLevel = levelCounts[level];
    levelCounts[level]++;
    
    const nodeId = `node-${nodeIdx}`;
    
    // Position calculate karo
    const pos = calculatePosition(level, positionInLevel, Math.pow(2, level));
    
    // Node data prepare karo
    const nodeData = {
      id: nodeId,
      type: 'custom',
      position: pos,
      data: {
        nodeIndex: nodeIdx,
        range: [start, end],
        value: tree[nodeIdx],
        lazyValue: lazy && lazy[nodeIdx] !== undefined ? lazy[nodeIdx] : null,
        isLeaf: start === end,
        level,
        state: null, // Will be set during animation
      },
      draggable: true,
    };
    
    nodes.push(nodeData);
    
    // Agar leaf nahi hai to children process karo
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      const leftChild = 2 * nodeIdx + 1;
      const rightChild = 2 * nodeIdx + 2;
      
      // Left subtree
      if (isValidNode(leftChild, start, mid)) {
        traverse(leftChild, start, mid, level + 1);
        
        // Left edge banao
        edges.push({
          id: `edge-${nodeId}-left`,
          source: nodeId,
          sourceHandle: 'left',
          target: `node-${leftChild}`,
          type: 'smoothstep',
          animated: false,
          style: { 
            stroke: 'rgba(255, 255, 255, 0.3)', 
            strokeWidth: 2 
          },
        });
      }
      
      // Right subtree
      if (isValidNode(rightChild, mid + 1, end)) {
        traverse(rightChild, mid + 1, end, level + 1);
        
        // Right edge banao
        edges.push({
          id: `edge-${nodeId}-right`,
          source: nodeId,
          sourceHandle: 'right',
          target: `node-${rightChild}`,
          type: 'smoothstep',
          animated: false,
          style: { 
            stroke: 'rgba(255, 255, 255, 0.3)', 
            strokeWidth: 2 
          },
        });
      }
    }
  };
  
  // Root se start karo
  traverse(0, 0, n - 1, 0);
  
  return { nodes, edges };
};

/**
 * Animation ke liye node highlighting data generate karta hai
 * @param {Array} animationSteps - SegmentTree se milne wale steps
 * @returns {Array} - Processed animation frames
 */
export const processAnimationSteps = (animationSteps) => {
  return animationSteps.map((step, index) => {
    let highlightColor = 'rgba(99, 102, 241, 0.3)'; // Default blue
    let description = step.description || '';
    
    switch(step.type) {
      case 'complete_overlap':
        highlightColor = 'rgba(34, 197, 94, 0.5)'; // Green
        description = `✅ Complete overlap - Range [${step.range[0]}, ${step.range[1]}]`;
        break;
      case 'partial_overlap':
        highlightColor = 'rgba(251, 146, 60, 0.5)'; // Orange
        description = `⚠️ Partial overlap - Need to go deeper`;
        break;
      case 'no_overlap':
        highlightColor = 'rgba(239, 68, 68, 0.3)'; // Red
        description = `❌ No overlap - Skip this node`;
        break;
      case 'lazy_applied':
        highlightColor = 'rgba(168, 85, 247, 0.5)'; // Purple
        description = `💜 Lazy value applied: +${step.lazyValue}`;
        break;
      case 'update_complete':
        highlightColor = 'rgba(236, 72, 153, 0.5)'; // Pink
        description = `✨ Update complete - New value: ${step.value}`;
        break;
      case 'build':
      case 'node_created':
        highlightColor = 'rgba(99, 102, 241, 0.4)'; // Indigo
        description = `🔨 Building node [${step.range[0]}, ${step.range[1]}] = ${step.value}`;
        break;
      default:
        highlightColor = 'rgba(99, 102, 241, 0.3)';
        description = step.description || `Processing node ${step.node}`;
    }
    
    return {
      ...step,
      index,
      highlightColor,
      description,
      delay: index * 500, // Har step 500ms ke baad
    };
  });
};

/**
 * Get node color based on state
 */
export const getNodeColor = (nodeData, activeNodes = [], highlightType = null) => {
  const isActive = activeNodes.includes(nodeData.nodeIndex);
  
  if (isActive && highlightType) {
    switch(highlightType) {
      case 'complete':
        return 'bg-green-500/30 border-green-400';
      case 'partial':
        return 'bg-orange-500/30 border-orange-400';
      case 'none':
        return 'bg-red-500/20 border-red-300';
      case 'lazy':
        return 'bg-purple-500/30 border-purple-400';
      case 'update':
        return 'bg-pink-500/30 border-pink-400';
      default:
        return 'bg-indigo-500/20 border-indigo-300';
    }
  }
  
  if (nodeData.lazyValue !== null && nodeData.lazyValue !== 0) {
    return 'bg-purple-500/20 border-purple-300';
  }
  
  if (nodeData.isLeaf) {
    return 'bg-blue-500/20 border-blue-300';
  }
  
  return 'bg-indigo-500/10 border-indigo-200';
};

/**
 * LAYOUT OPTIMIZATION
 * Better positioning ke liye nodes ko center me shift karta hai
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @returns {Object} - Optimized {nodes, edges}
 */
export const optimizeLayout = (nodes, edges) => {
  if (nodes.length === 0) {
    return { nodes, edges };
  }

  // Sabse left aur right positions nikalo
  const allX = nodes.map(n => n.position.x);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const center = (minX + maxX) / 2;
  
  // Viewport center (approximate)
  const viewportCenter = 400;
  
  // Sabko center me shift karo
  const centeredNodes = nodes.map(node => ({
    ...node,
    position: {
      x: node.position.x - center + viewportCenter,
      y: node.position.y + 50 // Top padding
    }
  }));
  
  return { nodes: centeredNodes, edges };
};