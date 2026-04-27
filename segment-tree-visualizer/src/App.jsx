import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ArrayInput from './components/ArrayInput/ArrayInput';
import TreeVisualization from './components/TreeVisualization/TreeVisualization';
import OperationPanel from './components/OperationPanel/OperationPanel';
import SegmentTree from './algorithms/SegmentTree';
import useAnimation from './hooks/useAnimation';

function App() {
  // ==================== STATE ====================

  const [inputArray, setInputArray] = useState([1, 3, 5, 7, 9, 11]);
  const [segmentTree, setSegmentTree] = useState(null);
  const [operationType, setOperationType] = useState('sum');
  const [isTreeBuilt, setIsTreeBuilt] = useState(false);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [operationResult, setOperationResult] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState([]);

  // ==================== ANIMATION HOOK ====================

  const {
    currentStep,
    currentStepData,
    isPlaying,
    togglePlayPause,
    stepForward,
    reset,
    animationSpeed,
    changeSpeed,
    start,
  } = useAnimation(animationSteps, 1);

  // ==================== EFFECT ====================

  useEffect(() => {
    if (currentStepData) {
      const nodeInfo = {
        nodeIndex: currentStepData.node,
        type: currentStepData.type,
      };

      setHighlightedNodes([nodeInfo]);

      console.log(
        `Step ${currentStep}:`,
        currentStepData.type,
        `Node ${currentStepData.node}`
      );
    } else {
      setHighlightedNodes([]);
    }
  }, [currentStep, currentStepData]);

  // ==================== HANDLERS ====================

  const handleBuildTree = () => {
    if (inputArray.length === 0) {
      alert('Please enter an array first!');
      return;
    }

    const tree = new SegmentTree(inputArray, operationType);
    setSegmentTree(tree);

    const steps = tree.getBuildSteps();
    setAnimationSteps(steps);

    setIsTreeBuilt(true);
    setOperationResult(null);

    setTimeout(() => reset(), 50);

    console.log('✅ Tree Built!', tree.getTree());
  };

  const handleRangeQuery = (l, r) => {
    if (!segmentTree) {
      alert('Please build the tree first!');
      return;
    }

    const { result, steps } = segmentTree.rangeQuery(l, r);
    setAnimationSteps(steps);
    setOperationResult({ type: 'query', range: [l, r], result });
    setTimeout(() => start(), 100);
  };

  const handlePointUpdate = (idx, value) => {
    if (!segmentTree) {
      alert('Please build the tree first!');
      return;
    }

    const { steps } = segmentTree.pointUpdate(idx, value);

    const newArray = [...inputArray];
    newArray[idx] = value;
    setInputArray(newArray);

    setAnimationSteps(steps);
    setOperationResult({ type: 'point_update', index: idx, value });
    setTimeout(() => start(), 100);
  };

  const handleRangeUpdate = (l, r, value) => {
    if (!segmentTree) {
      alert('Please build the tree first!');
      return;
    }

    const { steps } = segmentTree.rangeUpdate(l, r, value);
    setAnimationSteps(steps);
    setOperationResult({ type: 'range_update', range: [l, r], value });
    setTimeout(() => start(), 100);
  };

  // ==================== UI ====================

  return (
    <div className="min-h-screen w-full p-6">
      <motion.header
        className="glass-container p-6 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🌳 Segment Tree Visualizer
            </h1>
            <p className="text-white/70 text-sm">
              Interactive visualization with smooth animations
            </p>
          </div>

          <div className="flex gap-2">
            {['sum', 'min', 'max'].map((type) => (
              <button
                key={type}
                onClick={() => setOperationType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  operationType === type
                    ? 'bg-white/30 text-white shadow-lg'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL */}
        <motion.div
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrayInput
            array={inputArray}
            setArray={setInputArray}
            onBuildTree={handleBuildTree}
            isTreeBuilt={isTreeBuilt}
          />

          {isTreeBuilt && (
            <OperationPanel
              arrayLength={inputArray.length}
              onRangeQuery={handleRangeQuery}
              onPointUpdate={handlePointUpdate}
              onRangeUpdate={handleRangeUpdate}
              isAnimating={isPlaying}
              onPlayPause={togglePlayPause}
              onStepForward={stepForward}
              onReset={reset}
              animationSpeed={animationSpeed}
              onSpeedChange={changeSpeed}
            />
          )}
        </motion.div>

        {/* RIGHT PANEL — FIX: explicit pixel height, no overflow-hidden on outer wrapper */}
        <motion.div
          className="lg:col-span-2 glass-container p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-white text-2xl font-semibold mb-4">
            Tree Visualization
          </h2>

          {/* FIX: fixed pixel height so ReactFlow can measure the container */}
          <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <TreeVisualization
              segmentTree={segmentTree}
              highlightedNodes={highlightedNodes}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;