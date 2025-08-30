'use client';

import { BorderBeam } from '@orc/web/ui/magicui/ui/border-beam';
import TextShimmer from '@orc/web/ui/magicui/ui/text-shimmer';
import { Button } from '@orc/web/ui/magicui/ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <section id="hero" className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8 bg-black">
      {/* GitHub Banner */}
      <div className="mb-12 inline-flex items-center justify-center">
        <Link
          href="https://github.com/origranot/orc"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative isolate flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-400/20 to-gray-400/20 px-6 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:from-slate-400/30 hover:to-gray-400/30"
        >
          <span className="relative">✨ Don&apos;t forget to star us on GitHub</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-slate-400/25 to-gray-400/25 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        </Link>
      </div>
      
              <h1 className="bg-gradient-to-br from-white via-gray-200 to-slate-400 bg-clip-text py-6 text-5xl font-bold leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          Keep your clusters
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-slate-300 via-gray-300 to-slate-400 bg-clip-text text-transparent">
            clean, cheap & compliant
          </span>
        </h1>
      
              <p className="mb-12 text-lg tracking-tight text-slate-300 md:text-xl text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms] max-w-4xl mx-auto">
          ORC automatically detects orphaned resources, wasted cloud spend, and security risks in your Kubernetes clusters.
          <br className="hidden md:block" /> 
          <span className="font-medium text-slate-200">
            Transform manual cleanup into automated infrastructure hygiene.
          </span>
        </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
        <Button className="group bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Link href="/register">Start Free Trial</Link>
          <ArrowRightIcon className="ml-2 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Button>
        
        <Button variant="outline" className="group border-2 border-slate-700 text-slate-300 px-8 py-3 text-lg font-semibold rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105">
          <Link href="#demo">Book Demo</Link>
          <ArrowRightIcon className="ml-2 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Button>
      </div>

      <div
        ref={ref}
        className="relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]"
      >
        <div
          className={`rounded-2xl border border-white/20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] ${
            inView ? 'before:animate-image-glow' : ''
          }`}
        >
          <BorderBeam size={200} duration={12} delay={11} colorFrom="var(--color-one)" colorTo="var(--color-two)" />

          <img
            src="/hero-dark.png"
            alt="ORC Dashboard showing orphaned resources and cost analysis"
            className="hidden relative w-full h-full rounded-[inherit] border object-contain dark:block"
          />
          <img
            src="/hero-light.png"
            alt="ORC Dashboard showing orphaned resources and cost analysis"
            className="block relative w-full h-full rounded-[inherit] border object-contain dark:hidden"
          />
        </div>
      </div>
    </section>
  );
}
