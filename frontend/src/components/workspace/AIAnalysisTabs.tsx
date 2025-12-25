import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Sparkles, Search, MessageSquare, Check, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisComputations, AIInsights } from '@/types/api';

interface AIAnalysisTabsProps {
  computations: AnalysisComputations;
  aiInsights: AIInsights;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Target },
  { id: 'skillgap', label: 'Skill Gap', icon: TrendingUp },
  { id: 'rewrite', label: 'AI Rewrite', icon: Sparkles },
  { id: 'ats', label: 'ATS Optimization', icon: Search },
  { id: 'explain', label: 'Explainability', icon: MessageSquare },
];

const AIAnalysisTabs: React.FC<AIAnalysisTabsProps> = ({ computations, aiInsights }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Initialize rewrites state with API data
  const [rewrites, setRewrites] = useState(() => 
    aiInsights.rewritten_bullets.map((bullet, index) => ({
      id: index,
      original: "Original Bullet (from Resume)", // Note: Backend doesn't currently link original to new 1:1 in this array, assume generic or todo
      improved: bullet,
      accepted: null as boolean | null,
    }))
  );

  const handleRewriteAction = (id: number, accepted: boolean) => {
    setRewrites(prev => prev.map(r => r.id === id ? { ...r, accepted } : r));
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
  };

  return (
    <div className="glass-elevated p-4 md:p-6 h-full max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4 border-b border-border/30 custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-soft-gray/50'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springTransition}
              className="space-y-6"
            >
                  {/* Main Score */}
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={264}
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * computations.scores.overall_score) / 100 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="font-display text-4xl font-bold text-foreground"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, ...springTransition }}
                    >
                      {Math.round(computations.scores.overall_score)}%
                    </motion.span>
                    <span className="text-muted-foreground text-sm">Match Score</span>
                  </div>
                </div>
              </div>

              {/* Sub Scores */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Skills', score: computations.scores.skills_score },
                  { label: 'Experience', score: computations.scores.experience_score },
                  { label: 'Projects', score: computations.scores.project_score },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="bg-card/50 rounded-xl p-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, ...springTransition }}
                  >
                    <p className="text-2xl font-bold text-foreground">{Math.round(item.score)}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'skillgap' && (
            <motion.div
              key="skillgap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springTransition}
              className="space-y-4"
            >
              {/* Strong Skills */}
              <div className="bg-card/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-foreground text-sm">Strong Skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {computations.skill_gap.strong_matches.length > 0 ? (
                    computations.skill_gap.strong_matches.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-green-500/10 text-green-600 text-sm font-medium rounded-lg border border-green-500/20">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm italic">No strong matches found yet.</span>
                  )}
                </div>
              </div>

              {/* Weak Skills */}
              <div className="bg-card/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-foreground text-sm">Weak Matches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {computations.skill_gap.weak_matches.length > 0 ? (
                    computations.skill_gap.weak_matches.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-yellow-500/10 text-yellow-600 text-sm font-medium rounded-lg border border-yellow-500/20">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm italic">No weak matches identified.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-card/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <X className="w-4 h-4 text-destructive" />
                  <span className="font-semibold text-foreground text-sm">Missing Skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {computations.skill_gap.missing_skills.length > 0 ? (
                    computations.skill_gap.missing_skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-destructive/10 text-destructive text-sm font-medium rounded-lg border border-destructive/20">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm italic">No missing skills detected! Great job.</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rewrite' && (
            <motion.div
              key="rewrite"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springTransition}
              className="space-y-4"
            >
              <div className="text-sm text-muted-foreground mb-2">
                Note: These rewritten bullets are selected improvements based on your resume.
              </div>
              {rewrites.map((item, i) => (
                <motion.div
                  key={item.id}
                  className={`bg-card/50 rounded-xl p-4 border-2 transition-colors ${
                    item.accepted === true ? 'border-green-500/30 bg-green-500/5' :
                    item.accepted === false ? 'border-destructive/30 bg-destructive/5' :
                    'border-transparent'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, ...springTransition }}
                >
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Improved
                      </span>
                      <p className="text-sm text-foreground mt-1">{item.improved}</p>
                    </div>
                  </div>
                  
                  {item.accepted === null && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1 border-green-500/30 text-green-600 hover:bg-green-500/10"
                        onClick={() => handleRewriteAction(item.id, true)}
                      >
                        <Check className="w-4 h-4" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRewriteAction(item.id, false)}
                      >
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'ats' && (
            <motion.div
              key="ats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springTransition}
              className="space-y-4"
            >
              <div className="bg-card/50 rounded-xl p-4">
                <h3 className="font-semibold text-foreground text-sm mb-4">ATS Suggestions</h3>
                <div className="space-y-2">
                  {aiInsights.ats_suggestions.length > 0 ? (
                      aiInsights.ats_suggestions.map((suggestion, i) => (
                        <motion.div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, ...springTransition }}
                        >
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">{suggestion}</span>
                        </motion.div>
                      ))
                  ) : (
                      <p className="text-sm text-muted-foreground">No specific ATS suggestions found.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'explain' && (
            <motion.div
              key="explain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springTransition}
            >
              <div className="bg-card/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">AI Analysis Explanation</h3>
                </div>
                <div className="prose prose-sm text-muted-foreground">
                  {aiInsights.summary_explanation.split('\n\n').map((paragraph, i) => (
                    <motion.p
                      key={i}
                      className="mb-4 last:mb-0 text-sm leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, ...springTransition }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIAnalysisTabs;
