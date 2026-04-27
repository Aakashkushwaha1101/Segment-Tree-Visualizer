import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ArrayInput from './components/ArrayInput/ArrayInput';
import TreeVisualization from './components/TreeVisualization/TreeVisualization';
import OperationPanel from './components/OperationPanel/OperationPanel';
import SegmentTree from './algorithms/SegmentTree';
import useAnimation from './hooks/useAnimation';

/**
 * MAIN APP COMPONENT
 */
function App() {
  // ==================== STATE ====================
  const [inputArray, setInputArray] = useState([1, 3, 5, 7, 9, 11]);
  const [segmentTree, setSegmentTree] = useState(null);
  const [operationType, setOperationType] = useState('sum');
  const [isTreeBuilt, setIsTreeBuilt] = useState(false);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [operationResult, setOperationResult] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState([]);

  // ==================== CUSTOM HOOK ====================
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
      setHighlightedNodes([currentStepData.node]);
    } else {
      setHighlightedNodes([]);
    }
  }, [currentStep, currentStepData]);

  // ==================== BUILD TREE ====================
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
    reset(); // ✅ fixed (previously setCurrentStep(0))
    setOperationResult(null);

    console.log('✅ Tree Built!', tree.getTree());
  };

  // ==================== RANGE QUERY ====================
  const handleRangeQuery = (l, r) => {
    if (!segmentTree) {
      alert('Please build the tree first!');
      return;
    }

    const { result, steps } = segmentTree.rangeQuery(l, r);

    setAnimationSteps(steps);
    setOperationResult({
      type: 'query',
      range: [l, r],
      result,
    });

    setTimeout(() => start(), 100);

    console.log(`Query [${l}, ${r}] = ${result}`);
  };

  // ==================== POINT UPDATE ====================
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
    setOperationResult({
      type: 'point_update',
      index: idx,
      value,
    });

    setTimeout(() => start(), 100);

    console.log(`Updated arr[${idx}] = ${value}`);
  };

  // ==================== RANGE UPDATE ====================
  const handleRangeUpdate = (l, r, value) => {
    if (!segmentTree) {
      alert('Please build the tree first!');
      return;
    }

    const { steps } = segmentTree.rangeUpdate(l, r, value);

    setAnimationSteps(steps);
    setOperationResult({
      type: 'range_update',
      range: [l, r],
      value,
    });

    setTimeout(() => start(), 100);

    console.log(`Range Update [${l}, ${r}] += ${value}`);
  };

  // ==================== UI ====================
  return (
    <div className="min-h-screen w-full p-6">
      {/* Header */}
      <motion.header
        className="glass-container p-6 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
                className={`px-4 py-2 rounded-lg font-medium
                  ${
                    operationType === type
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
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

          {/* Result */}
          {operationResult && (
            <div className="glass-container p-4">
              <h3 className="text-white font-semibold mb-2">Result:</h3>

              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
                <p className="text-white font-mono">
                  {operationResult.type === 'query'
                    ? `Query [${operationResult.range[0]}, ${operationResult.range[1]}] = ${operationResult.result}`
                    : operationResult.type === 'point_update'
                    ? `arr[${operationResult.index}] = ${operationResult.value}`
                    : `Range [${operationResult.range[0]}, ${operationResult.range[1]}] += ${operationResult.value}`}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Panel */}
        <motion.div
          className="lg:col-span-2 glass-container p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ height: '600px' }}
        >
          <h2 className="text-white text-2xl font-semibold mb-4">
            Tree Visualization
          </h2>

          <div className="h-[calc(100%-3rem)] bg-white/5 rounded-xl overflow-hidden">
            <TreeVisualization
              segmentTree={segmentTree}
              highlightedNodes={highlightedNodes}
            />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-white/50 text-sm">
        <p>Built with React, Framer Motion, React Flow & Tailwind CSS 💜</p>
      </footer>
    </div>
  );
}

export default App;