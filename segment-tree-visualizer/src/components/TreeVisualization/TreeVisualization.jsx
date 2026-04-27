import { useCallback, useMemo } from 'react';
import { useState, useEffect } from "react";
import '@xyflow/react/dist/style.css';
import { 
  ReactFlow, 
  Background, 
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import { motion } from 'framer-motion';
import TreeNode from './TreeNode';
import { convertTreeToGraph, optimizeLayout } from '../../utils/treeConverter';

/**
 * TREE VISUALIZATION COMPONENT
 * 
 * React Flow use karke segment tree ko visualize karta hai
 * Features:
 * - Interactive draggable nodes
 * - Zoom & pan controls
 * - MiniMap for navigation
 * - Smooth animations
 * - Custom node styling
 */
const TreeVisualization = ({ segmentTree, highlightedNodes = [] }) => {
  /**
   * CUSTOM NODE TYPES
   * Apna TreeNode component register karte hain
   */
  const nodeTypes = useMemo(() => ({ custom: TreeNode }), []);

  /**
   * GENERATE NODES & EDGES
   * Segment tree se React Flow format me convert
   */
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!segmentTree) {
      return { nodes: [], edges: [] };
    }

    // Tree array aur array length nikalo
    const tree = segmentTree.getTree();
    const n = segmentTree.n;
    const lazy = segmentTree.lazy;

    // Convert to graph
    const graph = convertTreeToGraph(tree, n, lazy);
    
    // Optimize layout for better positioning
    return optimizeLayout(graph.nodes, graph.edges);
  }, [segmentTree]);

  /**
   * REACT FLOW STATE
   * Nodes aur edges ko manage karne ke liye
   */
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  /**
   * UPDATE HIGHLIGHTED NODES
   * Jab animation chalti hai tab nodes highlight hote hain
   */
  useEffect(() => {
    if (highlightedNodes.length > 0 && nodes.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          const isHighlighted = highlightedNodes.includes(node.data.nodeIndex);
          return {
            ...node,
            data: {
              ...node.data,
              highlightState: isHighlighted ? 'active' : null
            }
          };
        })
      );
    } else if (highlightedNodes.length === 0 && nodes.length > 0) {
      // Clear all highlights
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            highlightState: null
          }
        }))
      );
    }
  }, [highlightedNodes, setNodes, nodes.length]);

  /**
   * EDGE STYLE CONFIGURATION
   * Edges ko glassmorphism style dena
   */
  const defaultEdgeOptions = {
    animated: false,
    style: { 
      stroke: 'rgba(255, 255, 255, 0.3)', 
      strokeWidth: 2 
    },
    type: 'smoothstep',
  };

  /**
   * FIT VIEW CALLBACK
   * Jab tree load ho to automatically fit kare viewport me
   */
  const onInit = useCallback((reactFlowInstance) => {
    setTimeout(() => {
      reactFlowInstance.fitView({ 
        padding: 0.2,
        duration: 800 
      });
    }, 100);
  }, []);

  // Agar tree nahi hai to empty state dikha do
  if (!segmentTree) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-white/50">
          <div className="text-6xl mb-4">🌳</div>
          <p className="text-xl">No tree built yet</p>
          <p className="text-sm mt-2">Build a tree to see visualization</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full relative"
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
        attributionPosition="bottom-left"
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        {/* Background Grid Pattern */}
        <Background 
          color="rgba(255, 255, 255, 0.1)" 
          gap={20}
          size={1}
          variant="dots"
        />

        {/* Zoom & Pan Controls */}
        <Controls 
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg"
          style={{
            button: {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }
          }}
        />

        {/* MiniMap for Navigation */}
        <MiniMap 
          nodeColor={(node) => {
            if (node.data.isLeaf) return 'rgba(59, 130, 246, 0.5)';
            return 'rgba(99, 102, 241, 0.5)';
          }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg"
          maskColor="rgba(0, 0, 0, 0.3)"
        />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-container p-3 text-xs text-white">
        <div className="font-semibold mb-2">Legend:</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500/30 border border-blue-400 rounded"></div>
            <span>Leaf Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-500/30 border border-indigo-400 rounded"></div>
            <span>Internal Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500/30 border border-purple-400 rounded"></div>
            <span>Has Lazy Update</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TreeVisualization;