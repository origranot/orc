'use client';

import { Building2, DollarSign, Shield, Zap, Users, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const audiences = [
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Multi-tenant SaaS Teams",
    description: "Avoid paying for churned customers' resources and maintain clean tenant isolation.",
    value: "Cut 10-30% infra waste from customer churn"
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "FinOps Teams",
    description: "Get visibility into waste without writing custom scripts or manual audits.",
    value: "Real-time cost attribution & waste tracking"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Security & Compliance",
    description: "Reduce attack surface and prove cluster hygiene to auditors with detailed reports.",
    value: "Compliance-ready audit trails & security insights"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "SRE & Platform Teams",
    description: "Less cluster noise, fewer debugging mysteries, and automated operational tasks.",
    value: "Improved debugging & faster incident response"
  }
];

const businessValues = [
  {
    metric: "10-30%",
    label: "Infrastructure waste reduction",
    description: "Direct savings from unused storage, load balancers, and IPs"
  },
  {
    metric: "Zero",
    label: "Unknown resources",
    description: "Full visibility and ownership mapping for all infrastructure"
  },
  {
    metric: "24/7",
    label: "Automated monitoring",
    description: "Continuous scanning without manual intervention"
  },
  {
    metric: "100%",
    label: "Audit compliance",
    description: "Complete audit trails for all cleanup actions"
  }
];

export default function AudienceSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 mb-4"
          >
            <Target className="mr-2 h-4 w-4" />
            Who Needs This
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Built for modern infrastructure teams
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Whether you're managing multi-tenant clusters, optimizing costs, or ensuring compliance, 
            ORC provides the guardrails you need for infrastructure hygiene.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 mb-20">
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {audience.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {audience.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {audience.description}
                    </p>
                    <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {audience.value}
                    </div>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Business Value Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">
            Business Value
          </h3>
          <p className="text-lg text-muted-foreground">
            Transform your infrastructure operations with measurable outcomes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {businessValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="text-center group"
            >
              <div className="relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">
                  {value.metric}
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">
                  {value.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {value.description}
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 