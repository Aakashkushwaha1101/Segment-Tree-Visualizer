import { useState, useEffect } from 'react';
import { useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import TreeNode from './Treenode';
import { convertTreeToGraph, optimizeLayout } from '../../utils/treeConverter';

const TreeVisualization = ({ segmentTree, highlightedNodes = [] }) => {

  // Register custom node type
  const nodeTypes = useMemo(() => ({ custom: TreeNode }), []);

  // Generate nodes & edges from segment tree
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!segmentTree) return { nodes: [], edges: [] };

    const tree = segmentTree.getTree();
    const n    = segmentTree.n;
    const lazy = segmentTree.lazy;

    console.log('Building graph — n:', n, 'tree:', tree);

    const graph = convertTreeToGraph(tree, n, lazy);
    console.log('Graph nodes:', graph.nodes.length, 'edges:', graph.edges.length);

    return optimizeLayout(graph.nodes, graph.edges);
  }, [segmentTree]);

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // ✅ FIX: sync React Flow state whenever initialNodes/initialEdges change
  // useNodesState only reads the initial value once on mount — without this
  // effect, clicking "Rebuild Tree" never updates what ReactFlow renders.
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Update highlighted nodes during animation
  useEffect(() => {
    if (nodes.length === 0) return;

    if (highlightedNodes.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          const isHighlighted = highlightedNodes.some(
            h => typeof h === 'number'
              ? h === node.data.nodeIndex
              : h.nodeIndex === node.data.nodeIndex
          );

          if (isHighlighted) {
            let highlightType = 'active';
            if (typeof highlightedNodes[0] === 'object' && highlightedNodes[0].type) {
              const t = highlightedNodes[0].type;
              if (t === 'complete_overlap')  highlightType = 'complete';
              else if (t === 'partial_overlap') highlightType = 'partial';
              else if (t === 'no_overlap')      highlightType = 'none';
              else if (t === 'lazy_applied')    highlightType = 'lazy';
              else if (t === 'update_complete') highlightType = 'update';
            }
            return { ...node, data: { ...node.data, highlightState: highlightType } };
          }

          return { ...node, data: { ...node.data, highlightState: null } };
        })
      );
    } else {
      setNodes((nds) =>
        nds.map((node) => ({ ...node, data: { ...node.data, highlightState: null } }))
      );
    }
  }, [highlightedNodes, setNodes, nodes.length]);

  // Edge styling
  const defaultEdgeOptions = {
    animated: false,
    style: { stroke: 'rgba(255,255,255,0.4)', strokeWidth: 2 },
    type: 'smoothstep',
  };

  // Fit view on load
  const onInit = useCallback((reactFlowInstance) => {
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
    }, 200);
  }, []);

  // Empty state
  if (!segmentTree) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌳</div>
          <p style={{ fontSize: '20px' }}>No tree built yet</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Build a tree to see visualization</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%', width: '100%', position: 'relative' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
        minZoom={0.1}
        maxZoom={2}
      >
        <Background
          color="rgba(255,255,255,0.08)"
          gap={20}
          size={1}
          variant="dots"
        />

        <Controls
          style={{ button: { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } }}
        />

        <MiniMap
          nodeColor={(node) => node.data.isLeaf
            ? 'rgba(59,130,246,0.8)'
            : 'rgba(99,102,241,0.8)'
          }
          maskColor="rgba(0,0,0,0.3)"
        />
      </ReactFlow>

      {/* Legend */}
      <div style={{
        position:       'absolute',
        bottom:         '16px',
        left:           '16px',
        background:     'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        border:         '1px solid rgba(255,255,255,0.15)',
        borderRadius:   '10px',
        padding:        '10px 14px',
        fontSize:       '12px',
        color:          '#fff',
        zIndex:         10,
      }}>
        <div style={{ fontWeight: 700, marginBottom: '6px' }}>Legend</div>
        {[
          { color: 'rgba(37,99,235,0.85)',  label: 'Leaf Node' },
          { color: 'rgba(79,70,229,0.85)',  label: 'Internal Node' },
          { color: 'rgba(124,58,237,0.85)', label: 'Has Lazy Update' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: 14, height: 14, background: color, borderRadius: 4 }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TreeVisualization;