'use client';

import { Search, DollarSign, Shield, Zap, CheckCircle, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Detection & Classification",
    description: "Automatically finds orphaned resources and classifies them by severity level.",
    details: [
      "Real-time scanning across clusters",
      "Severity classification system",
      "Multi-tenant resource mapping"
    ],
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Cost Attribution",
    description: "Shows real costs per resource with FinOps dashboards for waste analysis.",
    details: [
      "Cloud billing integration",
      "Real-time cost tracking",
      "Team/customer waste breakdown"
    ],
    color: "from-emerald-500 to-green-600"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Remediation",
    description: "One-click cleanup with auditable workflows and approval processes.",
    details: [
      "Automated cleanup workflows",
      "CLI automation tools",
      "Quarantine mode support"
    ],
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    title: "Open Source & Community",
    description: "Built in the open with community contributions and transparent development.",
    details: [
      "Transparent codebase for security",
      "Community-driven improvements",
      "Join our growing ecosystem"
    ],
    color: "from-orange-500 to-red-500"
  }
];

export default function SolutionSection() {
  return (
    <section className="py-24 bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-slate-500/10 to-gray-500/10 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-4"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            ORC – The Solution
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Guardrails for cluster hygiene
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-slate-300"
          >
            ORC runs inside your cluster(s), continuously scanning resources to detect orphans, misconfigs, and drifts. 
            It collects, explains, and acts automatically.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
                            <div className={`relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-800/50 hover:-translate-y-1 group hover:border-opacity-60`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-1.5">
                            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${feature.color} shadow-sm`} />
                          </div>
                          <span className="text-sm text-slate-300 leading-relaxed">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Enhanced hover effect with color tint */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                
                {/* Subtle background color tint */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-3 transition-opacity duration-500 rounded-2xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center rounded-2xl bg-gradient-to-r from-slate-500/10 to-gray-500/10 px-6 py-4 border border-slate-700">
            <Shield className="mr-3 h-5 w-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">
              ORC shifts from "just a cleanup script" to an infrastructure hygiene SaaS platform
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 