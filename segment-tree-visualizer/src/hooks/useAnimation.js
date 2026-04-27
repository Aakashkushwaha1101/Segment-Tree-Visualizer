import { useState, useEffect, useRef } from 'react';

/**
 * CUSTOM HOOK: useAnimation
 * 
 * Animation steps ko manage karta hai
 * Features:
 * - Play/Pause control
 * - Step forward/backward
 * - Speed control
 * - Auto-play with delays
 * - Current step tracking
 */
const useAnimation = (steps = [], speed = 1) => {
  // ==================== STATE ====================
  
  const [currentStep, setCurrentStep] = useState(-1); // -1 = not started
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(speed);
  
  // Timer reference for cleanup
  const timerRef = useRef(null);

  // ==================== COMPUTED VALUES ====================
  
  const isComplete = currentStep >= steps.length - 1;
  const hasSteps = steps.length > 0;
  const currentStepData = currentStep >= 0 ? steps[currentStep] : null;

  // ==================== CLEANUP ====================
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // ==================== AUTO-PLAY EFFECT ====================
  
  useEffect(() => {
    if (!isPlaying || isComplete || !hasSteps) {
      return;
    }

    // Base delay (500ms) divided by speed
    const delay = 500 / animationSpeed;

    timerRef.current = setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        
        // Agar last step ho gaya to stop
        if (next >= steps.length - 1) {
          setIsPlaying(false);
        }
        
        return Math.min(next, steps.length - 1);
      });
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, animationSpeed, isComplete, hasSteps, steps.length]);

  // ==================== CONTROL FUNCTIONS ====================
  
  /**
   * Play/Pause toggle
   */
  const togglePlayPause = () => {
    if (isComplete) {
      // Agar complete hai to restart from beginning
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  /**
   * Step forward ek step
   */
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setIsPlaying(false); // Pause on manual step
    }
  };

  /**
   * Step backward ek step
   */
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setIsPlaying(false);
    }
  };

  /**
   * Reset to start
   */
  const reset = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  /**
   * Jump to specific step
   */
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      setIsPlaying(false);
    }
  };

  /**
   * Change animation speed
   */
  const changeSpeed = (newSpeed) => {
    setAnimationSpeed(Math.max(0.5, Math.min(3, newSpeed)));
  };

  /**
   * Start animation from beginning
   */
  const start = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // ==================== RETURN VALUES ====================
  
  return {
    // State
    currentStep,
    currentStepData,
    isPlaying,
    isComplete,
    hasSteps,
    animationSpeed,
    totalSteps: steps.length,
    
    // Controls
    togglePlayPause,
    stepForward,
    stepBackward,
    reset,
    goToStep,
    changeSpeed,
    start,
    
    // Setters (for external control)
    setIsPlaying,
    setCurrentStep,
  };
};

export default useAnimation;