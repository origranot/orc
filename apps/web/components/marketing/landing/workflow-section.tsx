'use client';

import { Search, FileText, GitPullRequest, CheckCircle, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const workflowSteps = [
  {
    step: "1",
    icon: <Search className="h-5 w-5" />,
    title: "ORC Scans",
    description: "Continuously monitors your clusters",
    detail: "Finds 12 orphaned PVCs across 3 namespaces"
  },
  {
    step: "2",
    icon: <FileText className="h-5 w-5" />,
    title: "Dashboard Analysis",
    description: "Shows detailed breakdown",
    detail: "3 belong to churned customer X, 5 from release pipeline, 4 unlabeled"
  },
  {
    step: "3",
    icon: <DollarSign className="h-5 w-5" />,
    title: "Cost Calculation",
    description: "Real-time cost attribution",
    detail: "Total waste: $142/month"
  },
  {
    step: "4",
    icon: <GitPullRequest className="h-5 w-5" />,
    title: "Generate Cleanup PR",
    description: "Automated GitOps workflow",
    detail: "GitOps repo gets PR removing orphaned resources"
  },
  {
    step: "5",
    icon: <CheckCircle className="h-5 w-5" />,
    title: "Audit & Approval",
    description: "Track who/when cleanup happened",
    detail: "Full audit log with approval workflows"
  }
];

export default function WorkflowSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-4"
          >
            <FileText className="mr-2 h-4 w-4" />
            Example Workflow
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            See ORC in action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            From detection to cleanup, ORC automates the entire infrastructure hygiene workflow. 
            Here's how it works in practice.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative text-center group"
              >
                {/* Step number */}
                <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-xl font-bold shadow-lg">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
                
                {/* Content */}
                <div className="px-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {step.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center rounded-2xl bg-muted/50 px-6 py-4">
            <Users className="mr-3 h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              The entire process is automated, auditable, and follows your existing GitOps workflows
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 