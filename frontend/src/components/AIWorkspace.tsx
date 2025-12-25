import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResumeEditor from '@/components/workspace/ResumeEditor';
import AIAnalysisTabs from '@/components/workspace/AIAnalysisTabs';
import JobDescriptionPanel from '@/components/workspace/JobDescriptionPanel';
import { FullAnalysisResponse } from '@/types/api';

interface AIWorkspaceProps {
  resumeFile: File | null;
  jobDescription: string;
  analysisData: FullAnalysisResponse;
}

const AIWorkspace: React.FC<AIWorkspaceProps> = ({ jobDescription, analysisData }) => {
  const springTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Navigation */}
      <motion.nav
        className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={springTransition}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">AI Resume Intelligence</span>
          </div>
          
          <Button variant="navy" size="default" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Resume (PDF)</span>
            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full">
          {/* Left - Resume Editor */}
          <motion.div
            className="lg:col-span-3 order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, ...springTransition }}
          >
            <ResumeEditor 
              resumeContent={analysisData.computation.resume_data} 
              aiInsights={analysisData.ai_insights}
            />
          </motion.div>

          {/* Center - AI Analysis Tabs */}
          <motion.div
            className="lg:col-span-6 order-1 lg:order-2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...springTransition }}
          >
            <AIAnalysisTabs 
              computations={analysisData.computation}
              aiInsights={analysisData.ai_insights}
            />
          </motion.div>

          {/* Right - Job Description Panel */}
          <motion.div
            className="lg:col-span-3 order-3"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, ...springTransition }}
          >
            <JobDescriptionPanel jobDescription={jobDescription} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIWorkspace;
