import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { ResumeContent, AIInsights } from '@/types/api';

interface ResumeEditorProps {
  resumeContent: ResumeContent;
  aiInsights: AIInsights;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeContent, aiInsights }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['raw', 'skills', 'experience', 'projects']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const SectionHeader = ({ id, title }: { id: string; title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-3 hover:bg-soft-gray/50 rounded-xl transition-colors"
    >
      <span className="font-semibold text-foreground text-sm">{title}</span>
      {expandedSections.includes(id) ? (
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <div className="glass-elevated p-4 h-full max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/30">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-bold text-base">Resume Viewer</h2>
          <p className="text-xs text-muted-foreground">Parsed content & AI suggestions</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        
        {/* Raw Text Preview (Since parser might be partial) */}
        <div className="bg-card/50 rounded-xl overflow-hidden">
          <SectionHeader id="raw" title="Extracted Text Preview" />
          {expandedSections.includes('raw') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-3"
            >
              <div className="text-xs text-muted-foreground whitespace-pre-wrap max-h-40 overflow-y-auto">
                {resumeContent.raw_text.slice(0, 500)}...
              </div>
            </motion.div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-card/50 rounded-xl overflow-hidden">
          <SectionHeader id="skills" title="Skills" />
          {expandedSections.includes('skills') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="px-3 pb-3"
            >
              <div className="flex flex-wrap gap-1.5">
                {resumeContent.skills.length > 0 ? (
                    resumeContent.skills.map((skill, i) => (
                    <span
                        key={i}
                        className="px-2 py-1 bg-accent/30 text-primary text-xs font-medium rounded-lg"
                    >
                        {skill}
                    </span>
                    ))
                ) : (
                    <span className="text-muted-foreground text-xs">No skills detected.</span>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Experience */}
        <div className="bg-card/50 rounded-xl overflow-hidden">
          <SectionHeader id="experience" title="Experience & Projects" />
          {expandedSections.includes('experience') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="px-3 pb-3 space-y-3"
            >
               {/* Display Experience List */}
               {resumeContent.experience.length > 0 && (
                   <div className="space-y-2">
                       <h4 className="text-xs font-semibold text-foreground">Experience:</h4>
                       {resumeContent.experience.map((exp, i) => (
                           <div key={i} className="text-xs text-muted-foreground pl-2 border-l-2 border-accent">
                               {exp}
                           </div>
                       ))}
                   </div>
               )}

               {/* Display Projects List */}
               {resumeContent.projects.length > 0 && (
                   <div className="space-y-2 mt-2">
                       <h4 className="text-xs font-semibold text-foreground">Projects:</h4>
                       {resumeContent.projects.map((proj, i) => (
                           <div key={i} className="text-xs text-muted-foreground pl-2 border-l-2 border-secondary">
                               {proj}
                           </div>
                       ))}
                   </div>
               )}

               {resumeContent.experience.length === 0 && resumeContent.projects.length === 0 && (
                    <span className="text-muted-foreground text-xs">No experience chunks detected.</span>
               )}
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResumeEditor;
