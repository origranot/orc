'use client';

import { Check, Star, Zap, Shield, Users, Building2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@orc/web/ui/magicui/ui/button';
import Link from 'next/link';

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for small teams getting started with infrastructure hygiene",
    features: [
      "Up to 3 clusters",
      "Basic orphaned resource detection",
      "Dashboard access",
      "Email alerts",
      "Community support"
    ],
    cta: "Get Started Free",
    popular: false,
    icon: <Zap className="h-5 w-5" />
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "For growing teams that need advanced features and compliance",
    features: [
      "Up to 10 clusters",
      "Advanced detection & classification",
      "Cost attribution & FinOps dashboards",
      "GitOps integration",
      "Audit trails & compliance reports",
      "Priority support",
      "Custom resource types"
    ],
    cta: "Start Free Trial",
    popular: true,
    icon: <Shield className="h-5 w-5" />
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with complex compliance and security needs",
    features: [
      "Unlimited clusters",
      "Multi-cloud support",
      "Advanced RBAC & SSO",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantees",
      "On-premise deployment",
      "Custom reporting"
    ],
    cta: "Contact Sales",
    popular: false,
    icon: <Building2 className="h-5 w-5" />
  }
];

const benefits = [
  {
    icon: <DollarSign className="h-5 w-5" />,
    title: "ROI in 30 days",
    description: "Most teams see 10-30% infrastructure cost reduction within the first month"
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Security first",
    description: "Reduce attack surface and maintain compliance with automated hygiene"
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Team productivity",
    description: "Less debugging, faster deployments, and automated operational tasks"
  }
];

export default function PricingSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 mb-4"
          >
            <Star className="mr-2 h-4 w-4" />
            Simple Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Start free, scale as you grow
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Choose the plan that fits your team size and compliance needs. 
            All plans include our core infrastructure hygiene features.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative group ${plan.popular ? 'lg:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                    <Star className="mr-2 h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`relative overflow-hidden rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-primary shadow-lg' : 'hover:border-primary/20'
              }`}>
                <div className="text-center mb-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-lg text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'}`}
                >
                  {plan.cta}
                </Button>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">
            Why teams choose ORC
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="text-center group"
            >
              <div className="relative overflow-hidden rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h4>
                <p className="text-muted-foreground">
                  {benefit.description}
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
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center rounded-2xl bg-muted/50 px-6 py-4">
            <Shield className="mr-3 h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              All plans include enterprise-grade security and compliance features
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
