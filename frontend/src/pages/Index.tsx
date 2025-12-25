import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UploadScreen from '@/components/UploadScreen';
import AnalyzingLoader from '@/components/AnalyzingLoader';
import AIWorkspace from '@/components/AIWorkspace';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import { analyzeResume } from '@/services/api';
import { FullAnalysisResponse } from '@/types/api';

type AppScreen = 'upload' | 'analyzing' | 'workspace';

const Index: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  
  // New State for API
  const [analysisPromise, setAnalysisPromise] = useState<Promise<FullAnalysisResponse> | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FullAnalysisResponse | null>(null);

  const handleAnalyze = (file: File, jd: string) => {
    setResumeFile(file);
    setJobDescription(jd);
    
    // Start API Call
    const promise = analyzeResume(file, jd);
    setAnalysisPromise(promise);
    
    setCurrentScreen('analyzing');
  };

  const handleAnalysisComplete = (data: FullAnalysisResponse) => {
    setAnalysisResult(data);
    setCurrentScreen('workspace');
  };

  const handleCancel = () => {
      setAnalysisPromise(null);
      setCurrentScreen('upload');
  }

  return (
    <>
      {/* SEO */}
      <title>AI Resume Intelligence Engine - Analyze & Optimize Your Resume</title>
      <meta name="description" content="Upload your resume and let our AI analyze, score, and optimize it for your dream job. Get ATS optimization, keyword analysis, and actionable tips." />
      
      <div className="relative min-h-screen bg-background overflow-hidden">
        <BackgroundBlobs />
        
        <AnimatePresence mode="wait">
          {currentScreen === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <UploadScreen onAnalyze={handleAnalyze} />
            </motion.div>
          )}

          {currentScreen === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <AnalyzingLoader 
                onComplete={handleAnalysisComplete} 
                analysisPromise={analysisPromise}
                onCancel={handleCancel}
              />
            </motion.div>
          )}

          {currentScreen === 'workspace' && analysisResult && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <AIWorkspace 
                analysisData={analysisResult}
                resumeFile={resumeFile} 
                jobDescription={jobDescription} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Index;
