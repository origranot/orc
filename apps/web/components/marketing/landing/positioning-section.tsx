'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Shield, DollarSign, Zap } from 'lucide-react';

const positioningPoints = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Clean",
    description: "Automatically detect and remove orphaned resources, unused storage, and abandoned namespaces"
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Cheap",
    description: "Cut 10-30% of infrastructure waste with real-time cost attribution and FinOps insights"
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Compliant",
    description: "Maintain audit trails, prove ownership, and meet compliance requirements automatically"
  }
];

export default function PositioningSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center rounded-full bg-primary/10 px-6 py-3 text-lg font-medium text-primary mb-6">
            <Zap className="mr-3 h-5 w-5" />
            Our Mission
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            ORC keeps your clusters
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              clean, cheap & compliant
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform manual infrastructure cleanup into automated hygiene. 
            Join teams that have eliminated waste, reduced security risks, and achieved compliance without the operational burden.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {positioningPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="relative overflow-hidden rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {point.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {point.description}
                </p>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          <div className="inline-flex items-center rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-6 border border-primary/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-2">
                Ready to transform your infrastructure hygiene?
              </div>
              <div className="text-muted-foreground">
                Start your free trial today and see the difference automated cleanup makes
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 