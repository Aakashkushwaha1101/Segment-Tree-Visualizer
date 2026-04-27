/**
 * TREE TO GRAPH CONVERTER
 *
 * Segment Tree ko React Flow ke nodes aur edges me convert karti hai
 */

/**
 * Tree ko nodes aur edges me convert karta hai
 * @param {Array} tree  - Segment tree array (size 4*n, zeros for unused)
 * @param {number} n    - Original array length
 * @param {Array} lazy  - Lazy propagation array
 * @returns {Object}    - { nodes, edges } for React Flow
 */
export const convertTreeToGraph = (tree, n, lazy = null) => {
  const nodes = [];
  const edges = [];

  if (!tree || !n || n <= 0) {
    console.warn('convertTreeToGraph: invalid input', { tree, n });
    return { nodes, edges };
  }

  const NODE_WIDTH   = 140;
  const LEVEL_HEIGHT = 120;

  /**
   * xCounter increments once per LEAF node (in-order traversal).
   * Internal nodes center themselves between left and right child x.
   * This guarantees no overlaps for any tree shape.
   */
  let xCounter = 0;

  /**
   * Returns the x position of the node so the parent can center itself.
   */
  const traverse = (nodeIdx, start, end, level) => {
    if (nodeIdx >= tree.length || start > end) return null;

    const nodeId   = `node-${nodeIdx}`;
    const isLeaf   = start === end;
    const mid      = Math.floor((start + end) / 2);
    const leftIdx  = 2 * nodeIdx + 1;
    const rightIdx = 2 * nodeIdx + 2;

    let x;

    if (isLeaf) {
      // Assign next horizontal slot
      x = xCounter * NODE_WIDTH;
      xCounter++;
    } else {
      // Traverse left subtree first
      const leftX  = traverse(leftIdx,  start,   mid, level + 1);
      // Traverse right subtree
      const rightX = traverse(rightIdx, mid + 1, end, level + 1);

      // Center this node between its two children
      if (leftX !== null && rightX !== null) {
        x = (leftX + rightX) / 2;
      } else if (leftX !== null) {
        x = leftX;
      } else if (rightX !== null) {
        x = rightX;
      } else {
        x = xCounter * NODE_WIDTH;
        xCounter++;
      }

      // Add edges only for valid children
      if (leftX !== null) {
        edges.push({
          id: `edge-${nodeId}-left`,
          source: nodeId,
          sourceHandle: 'left',
          target: `node-${leftIdx}`,
          type: 'smoothstep',
          animated: false,
          style: { stroke: 'rgba(255,255,255,0.35)', strokeWidth: 2 },
        });
      }
      if (rightX !== null) {
        edges.push({
          id: `edge-${nodeId}-right`,
          source: nodeId,
          sourceHandle: 'right',
          target: `node-${rightIdx}`,
          type: 'smoothstep',
          animated: false,
          style: { stroke: 'rgba(255,255,255,0.35)', strokeWidth: 2 },
        });
      }
    }

    nodes.push({
      id: nodeId,
      type: 'custom',
      position: { x, y: level * LEVEL_HEIGHT },
      data: {
        nodeIndex:      nodeIdx,
        range:          [start, end],
        value:          tree[nodeIdx],
        lazyValue:      lazy ? (lazy[nodeIdx] ?? null) : null,
        isLeaf,
        level,
        highlightState: null,
      },
      draggable: true,
    });

    return x;
  };

  traverse(0, 0, n - 1, 0);

  console.log(`convertTreeToGraph: ${nodes.length} nodes, ${edges.length} edges`);
  return { nodes, edges };
};

/**
 * LAYOUT OPTIMIZATION
 * Center the whole tree horizontally with padding
 */
export const optimizeLayout = (nodes, edges) => {
  if (nodes.length === 0) return { nodes, edges };

  const allX    = nodes.map(n => n.position.x);
  const minX    = Math.min(...allX);
  const PADDING = 60;

  const centeredNodes = nodes.map(node => ({
    ...node,
    position: {
      x: node.position.x - minX + PADDING,
      y: node.position.y + PADDING,
    },
  }));

  return { nodes: centeredNodes, edges };
};

/**
 * Process animation steps for highlighting
 */
export const processAnimationSteps = (animationSteps) => {
  return animationSteps.map((step, index) => {
    let highlightColor = 'rgba(99,102,241,0.3)';
    let description    = step.description || '';

    switch (step.type) {
      case 'complete_overlap':
        highlightColor = 'rgba(34,197,94,0.5)';
        description    = `✅ Complete overlap [${step.range[0]}, ${step.range[1]}]`;
        break;
      case 'partial_overlap':
        highlightColor = 'rgba(251,146,60,0.5)';
        description    = `⚠️ Partial overlap — going deeper`;
        break;
      case 'no_overlap':
        highlightColor = 'rgba(239,68,68,0.3)';
        description    = `❌ No overlap — skipping`;
        break;
      case 'lazy_applied':
        highlightColor = 'rgba(168,85,247,0.5)';
        description    = `💜 Lazy applied: +${step.lazyValue}`;
        break;
      case 'update_complete':
        highlightColor = 'rgba(236,72,153,0.5)';
        description    = `✨ Updated → ${step.value}`;
        break;
      case 'build':
      case 'node_created':
        highlightColor = 'rgba(99,102,241,0.4)';
        description    = `🔨 Built [${step.range[0]}, ${step.range[1]}] = ${step.value}`;
        break;
      default:
        description = step.description || `Processing node ${step.node}`;
    }

    return { ...step, index, highlightColor, description, delay: index * 500 };
  });
};

/**
 * Get Tailwind color class for a node based on its state
 */
export const getNodeColor = (nodeData, activeNodes = [], highlightType = null) => {
  if (activeNodes.includes(nodeData.nodeIndex) && highlightType) {
    switch (highlightType) {
      case 'complete': return 'bg-green-500/30 border-green-400';
      case 'partial':  return 'bg-orange-500/30 border-orange-400';
      case 'none':     return 'bg-red-500/20 border-red-300';
      case 'lazy':     return 'bg-purple-500/30 border-purple-400';
      case 'update':   return 'bg-pink-500/30 border-pink-400';
      default:         return 'bg-indigo-500/20 border-indigo-300';
    }
  }
  if (nodeData.lazyValue) return 'bg-purple-500/20 border-purple-300';
  if (nodeData.isLeaf)    return 'bg-blue-500/20 border-blue-300';
  return 'bg-indigo-500/10 border-indigo-200';
};