import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Briefcase, Target, Sparkles, Check, Brain, AlertCircle } from 'lucide-react';
import { FullAnalysisResponse } from '@/types/api';
import { Button } from './ui/button';

interface AnalyzingLoaderProps {
  onComplete: (data: FullAnalysisResponse) => void;
  analysisPromise: Promise<FullAnalysisResponse> | null;
  onCancel: () => void;
}

const processSteps = [
  { icon: FileText, text: 'Parsing resume structure', color: 'from-primary to-secondary' },
  { icon: Briefcase, text: 'Extracting job requirements', color: 'from-secondary to-primary' },
  { icon: Target, text: 'Matching skills & keywords', color: 'from-primary to-accent' },
  { icon: Sparkles, text: 'Generating AI insights', color: 'from-accent to-secondary' },
];

const AnalyzingLoader: React.FC<AnalyzingLoaderProps> = ({ onComplete, analysisPromise, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<FullAnalysisResponse | null>(null);

  useEffect(() => {
    if (!analysisPromise) return;

    // Handle the API promise separately
    analysisPromise
      .then((data) => {
        setApiData(data);
      })
      .catch((err) => {
        setError(err.message || "An error occurred during analysis");
      });
  }, [analysisPromise]);

  useEffect(() => {
    if (error) return;

    const stepDuration = 800; // Slightly slower for better effect
    
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processSteps.length - 1) {
          setCompletedSteps((steps) => {
            if(!steps.includes(prev)) return [...steps, prev];
            return steps;
          });
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    // Watch for both completion conditions: Animation done AND Data received
    const checkCompletion = setInterval(() => {
        if (currentStep === processSteps.length - 1 && apiData) {
            setCompletedSteps((steps) => [...Array.from(new Set([...steps, processSteps.length - 1]))]);
            setTimeout(() => onComplete(apiData), 500);
            clearInterval(checkCompletion);
            clearInterval(stepInterval);
        }
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(checkCompletion);
    };
  }, [onComplete, apiData, error, currentStep]);

  const springTransition = {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
  };

  if (error) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Failed</h2>
        <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
        <Button onClick={onCancel} variant="outline">Try Again</Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Central Icon */}
      <motion.div
        className="relative mb-12"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={springTransition}
      >
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-dashed border-accent/40"
          style={{ width: 160, height: 160, margin: -20 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-secondary/30"
          style={{ width: 140, height: 140, margin: -10 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Central brain icon container */}
        <motion.div
          className="w-[120px] h-[120px] rounded-full relative overflow-hidden flex items-center justify-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)`,
            boxShadow: `0 0 60px hsl(202 100% 88% / 0.4), 0 0 120px hsl(210 40% 51% / 0.2)`,
          }}
        >
          {/* Animated neural lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ 
                top: '50%',
                transformOrigin: 'center',
                rotate: `${i * 30}deg`,
              }}
              animate={{ 
                opacity: [0.2, 0.8, 0.2],
                scaleX: [0.5, 1, 0.5],
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeInOut" 
              }}
            />
          ))}
          
          {/* Center icon */}
          <motion.div
            animate={{ 
              rotateY: [0, 180, 360],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * 45 * Math.PI / 180) * 80],
              y: [0, Math.sin(i * 45 * Math.PI / 180) * 80],
              opacity: [1, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      {/* Title */}
      <motion.h2
        className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ...springTransition }}
      >
        Analyzing Resume & Job Description
      </motion.h2>

      {/* Process Steps */}
      <motion.div
        className="w-full max-w-md space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {processSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index;
          const isCompleted = completedSteps.includes(index);
          
          return (
            <motion.div
              key={index}
              className={`
                flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-accent/20 border border-accent/40' : 
                  isCompleted ? 'bg-card/50' : 'bg-card/30'}
              `}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1, ...springTransition }}
            >
              <motion.div
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${isCompleted ? 'bg-primary' : isActive ? `bg-gradient-to-br ${step.color}` : 'bg-muted'}
                `}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={springTransition}
                    >
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                  )}
                </AnimatePresence>
              </motion.div>
              
              <div className="flex-1">
                <p className={`
                  text-sm font-medium transition-colors duration-300
                  ${isActive ? 'text-foreground' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/60'}
                `}>
                  {step.text}
                </p>
                {isActive && (
                  <motion.div
                    className="h-1 bg-accent/30 rounded-full mt-2 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default AnalyzingLoader;
