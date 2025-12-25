import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface JobDescriptionPanelProps {
  jobDescription: string;
}

const mockExtractedData = {
  skills: [
    { name: 'React', matched: true },
    { name: 'TypeScript', matched: true },
    { name: 'Node.js', matched: true },
    { name: 'AWS', matched: true },
    { name: 'Kubernetes', matched: false },
    { name: 'CI/CD', matched: true },
    { name: 'Terraform', matched: false },
    { name: 'Go', matched: false },
  ],
  missingKeywords: ['Kubernetes', 'Terraform', 'Go', 'System Design', 'Agile'],
  hints: [
    "Add specific metrics to quantify achievements",
    "Include cloud certifications if available",
    "Mention experience with container orchestration",
  ],
};

const mockJD = `We are looking for a Senior Software Engineer to join our platform team. The ideal candidate will have:

- 5+ years of experience with React and TypeScript
- Strong background in Node.js and backend development
- Experience with AWS cloud services
- Knowledge of Kubernetes and container orchestration
- Familiarity with CI/CD pipelines
- Experience with Terraform for infrastructure as code
- Excellent communication skills

Nice to have:
- Go programming experience
- System Design knowledge
- Agile methodology experience`;

const JobDescriptionPanel: React.FC<JobDescriptionPanelProps> = ({ jobDescription }) => {
  const displayJD = jobDescription || mockJD;

  const springTransition = {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
  };

  return (
    <div className="glass-elevated p-4 h-full max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/30">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-bold text-base">Job Description</h2>
          <p className="text-xs text-muted-foreground">Extracted insights</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {/* JD Text */}
        <motion.div
          className="bg-card/50 rounded-xl p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Full Description</p>
          <div className="max-h-40 overflow-y-auto text-sm text-foreground whitespace-pre-wrap leading-relaxed custom-scrollbar">
            {displayJD}
          </div>
        </motion.div>

        {/* Extracted Skills */}
        <motion.div
          className="bg-card/50 rounded-xl p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ...springTransition }}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {mockExtractedData.skills.map((skill, i) => (
              <motion.span
                key={i}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  skill.matched 
                    ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                    : 'bg-destructive/10 text-destructive border border-destructive/20'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.03, ...springTransition }}
              >
                {skill.matched ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {skill.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Missing Keywords */}
        <motion.div
          className="bg-destructive/5 border border-destructive/20 rounded-xl p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...springTransition }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-xs font-medium text-destructive uppercase tracking-wider">Missing Keywords</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mockExtractedData.missingKeywords.map((keyword, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded-lg"
              >
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Hints */}
        <motion.div
          className="bg-accent/30 border border-accent/50 rounded-xl p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...springTransition }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium text-primary uppercase tracking-wider">Improvement Hints</p>
          </div>
          <ul className="space-y-2">
            {mockExtractedData.hints.map((hint, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2 text-xs text-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, ...springTransition }}
              >
                <span className="text-primary mt-0.5">•</span>
                {hint}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDescriptionPanel;
