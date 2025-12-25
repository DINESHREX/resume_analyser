import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface UploadScreenProps {
  onAnalyze: (file: File, jobDescription: string) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onAnalyze }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  const handleAnalyze = () => {
    if (file && jobDescription.trim()) {
      setIsExiting(true);
      setTimeout(() => onAnalyze(file, jobDescription), 800);
    }
  };

  const isReady = file && jobDescription.trim().length > 0;

  const springTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence mode="wait">
        {!isExiting ? (
          <motion.div
            key="upload-card"
            className="glass-elevated p-6 md:p-10 max-w-3xl w-full"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ 
              scale: 0,
              opacity: 0,
              borderRadius: "50%",
              transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
            }}
            transition={springTransition}
          >
            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...springTransition }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-secondary mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Analysis</span>
              </motion.div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                AI Resume Intelligence
              </h1>
              <p className="text-muted-foreground text-base md:text-lg">
                Upload your resume and job description for AI-powered optimization
              </p>
            </motion.div>

            {/* Drop Zone */}
            <motion.div
              className={`
                relative border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer
                transition-all duration-300 ease-out mb-6
                ${isDragging 
                  ? 'border-primary bg-soft-gray' 
                  : 'border-steel-blue/40 bg-card hover:border-primary/60 hover:bg-soft-gray/50'
                }
                ${file ? 'border-solid border-primary/40 bg-accent/20' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={springTransition}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <motion.div
                animate={{
                  scale: isDragging ? 1.1 : 1,
                  y: isDragging ? -5 : 0,
                }}
                transition={springTransition}
              >
                {file ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={springTransition}
                    className="flex flex-col items-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-3">
                      <FileText className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground text-lg">{file.name}</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      {(file.size / 1024).toFixed(1)} KB • Ready for analysis
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <motion.div 
                      className="w-16 h-16 rounded-3xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mx-auto mb-4"
                      animate={{ 
                        y: [0, -6, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Upload className="w-8 h-8 text-primary" />
                    </motion.div>
                    <p className="font-semibold text-foreground text-lg mb-1">
                      {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      or <span className="text-secondary font-medium hover:underline">browse files</span>
                    </p>
                    <p className="text-muted-foreground/60 text-xs mt-3">
                      Supports PDF & DOCX files
                    </p>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Job Description Textarea */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...springTransition }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-accent/50 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <label className="font-semibold text-foreground">Job Description</label>
              </div>
              <Textarea
                placeholder="Paste the Job Description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[160px] bg-card/80 border-border/50 focus:border-primary/50 resize-none text-foreground placeholder:text-muted-foreground/60"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Paste the complete job description for accurate matching
              </p>
            </motion.div>

            {/* Analyze Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ...springTransition }}
            >
              <Button
                variant="navy"
                size="xl"
                className="w-full group relative overflow-hidden"
                disabled={!isReady}
                onClick={handleAnalyze}
              >
                <motion.span
                  className="absolute inset-0 bg-secondary"
                  initial={{ y: "100%" }}
                  whileHover={{ y: "0%" }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Analyze Resume & Job Match
                </span>
              </Button>
              {!isReady && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  {!file ? 'Upload your resume' : 'Enter job description'} to continue
                </p>
              )}
            </motion.div>

            {/* Features */}
            <motion.div
              className="mt-8 grid grid-cols-3 gap-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {['AI Matching', 'Skill Gap Analysis', 'ATS Optimization'].map((feature, i) => (
                <motion.div
                  key={feature}
                  className="p-2 rounded-xl bg-soft-gray/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, ...springTransition }}
                >
                  <span className="text-xs font-medium text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="genie-effect"
            className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-primary"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{
              boxShadow: '0 0 60px hsl(210 40% 51% / 0.5)',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadScreen;
