'use client';

import { motion } from 'framer-motion';
import { Building2, Users, Zap, Shield } from 'lucide-react';

const testimonials = [
  {
    quote: "ORC helped us identify and clean up $15K in monthly infrastructure waste within the first month.",
    author: "Sarah Chen",
    role: "Senior DevOps Engineer",
    company: "TechCorp"
  },
  {
    quote: "Finally, we have visibility into our cluster hygiene without writing custom scripts.",
    author: "Marcus Rodriguez",
    role: "Platform Lead",
    company: "CloudScale"
  },
  {
    quote: "Our auditors love the automated compliance reports. ORC made cluster governance effortless.",
    author: "Dr. Emily Watson",
    role: "Security Director",
    company: "FinTech Solutions"
  }
];

const stats = [
  { number: "500+", label: "Clusters monitored" },
  { number: "$2.1M", label: "Cost savings identified" },
  { number: "99.9%", label: "Uptime maintained" },
  { number: "24/7", label: "Automated monitoring" }
];

export default function ClientSection() {
  return (
    <section
      id="clients"
      className="py-24 bg-gradient-to-b from-muted/20 to-background"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <div className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
            <Users className="mr-2 h-4 w-4" />
            Trusted by DevOps Teams
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Join teams that have transformed their infrastructure hygiene
          </h2>
          <p className="text-lg text-muted-foreground">
            From startups to enterprises, teams are using ORC to automate cleanup, reduce costs, and maintain compliance.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <div className="mb-6">
                  <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.898 3.26 1.127-6.565L.49 6.56l6.627-.966L10 0l2.883 5.594 6.627.966-4.739 4.135 1.127 6.565z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-lg text-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-primary font-medium">{testimonial.company}</div>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center rounded-2xl bg-muted/50 px-6 py-4">
            <Shield className="mr-3 h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              SOC 2 Type II compliant • GDPR ready • Enterprise security standards
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
