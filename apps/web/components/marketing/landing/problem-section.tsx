'use client';

import { AlertTriangle, DollarSign, Shield, Zap, Users, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const problems = [
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Wasted Cloud Spend",
    description: "Unused PVs, ELBs, and IPs silently drain your budget. Teams churn customers but forget to clean up their resources.",
    cost: "$142/month average waste per cluster",
    color: "from-rose-500 to-pink-500"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Security Risks",
    description: "Dangling endpoints, secrets in dead namespaces, and orphaned resources create attack vectors.",
    cost: "Increased attack surface & compliance risks",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Operational Inefficiency",
    description: "Manual cleanup processes waste engineering time and create inconsistent results across teams.",
    cost: "Reduced productivity & inconsistent results",
    color: "from-sky-500 to-blue-500"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "No Clear Ownership",
    description: "Resources without proper labels or RBAC mapping. Auditors hate unknown infrastructure.",
    cost: "Compliance violations & audit failures",
    color: "from-fuchsia-500 to-purple-500"
  }
];

export default function ProblemSection() {
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
            <AlertTriangle className="mr-2 h-4 w-4" />
            The Problem Today
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Kubernetes infrastructure hygiene is broken
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-slate-300"
          >
            Kubernetes + cloud infra evolves fast. Engineers deploy, scale, and delete services constantly. 
            But orphaned resources pile up, creating waste, security risks, and operational drag.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-800/50 hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${problem.color} text-white shadow-lg`}>
                      {problem.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {problem.title}
                    </h3>
                    <p className="text-slate-300 mb-3">
                      {problem.description}
                    </p>
                    <div className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-sm font-medium text-slate-300">
                      {problem.cost}
                    </div>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${problem.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
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
          <div className="inline-flex items-center rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-4 border border-amber-800">
            <Zap className="mr-3 h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-slate-300">
              Right now, teams rely on scripts, kubectl, or hope. It's manual, reactive, and error-prone.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 