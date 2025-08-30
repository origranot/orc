'use client';

import { Search, DollarSign, Shield, Zap, CheckCircle } from 'lucide-react';
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
    color: "from-slate-500 to-gray-500"
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
    color: "from-gray-500 to-slate-600"
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
    color: "from-slate-600 to-gray-700"
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
            className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-slate-300 mb-4"
          >
            <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" />
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
                            <div className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all duration-300 hover:bg-slate-800/70 hover:border-slate-600">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
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
                            <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${feature.color}`} />
                          </div>
                          <span className="text-sm text-slate-300 leading-relaxed">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Subtle hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg`} />
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
          <div className="inline-flex items-center rounded-lg bg-slate-800 px-6 py-4 border border-slate-700">
            <Shield className="mr-3 h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">
              ORC shifts from "just a cleanup script" to an infrastructure hygiene SaaS platform
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 