'use client';

import Marquee from '@orc/web/ui/magicui/ui/marquee';
import { buttonVariants } from '@orc/web/ui/magicui/ui/button';
import { cn } from '@orc/web/ui/custom-ui/utils';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ChevronRight, Server, FileText, Wifi, Settings, ArrowDownCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { SiKubernetes } from 'react-icons/si';

// Define icons for each Kubernetes resource tile
const K8sPodIcon = (props: any) => <Server {...props} title="Pod" />;
const K8sDeploymentIcon = (props: any) => <FileText {...props} title="Deployment" />;
const K8sServiceIcon = (props: any) => <Wifi {...props} title="Service" />;
const K8sConfigMapIcon = (props: any) => <Settings {...props} title="ConfigMap" />;
const K8sIngressIcon = (props: any) => <ArrowDownCircle {...props} title="Ingress" />;
const K8sSecretIcon = (props: any) => <Lock {...props} title="Secret" />;

// Array of tiles representing various Kubernetes resources
const k8sTiles = [
  {
    icon: <K8sPodIcon className="size-full" />,
    bg: (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 
                   -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full 
                   bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-70 
                   blur-[20px] filter"
      ></div>
    ),
  },
  {
    icon: <K8sDeploymentIcon className="size-full" />,
    bg: (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 
                   -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full 
                   bg-gradient-to-r from-green-500 via-green-600 to-green-700 opacity-70 
                   blur-[20px] filter"
      ></div>
    ),
  },
  {
    icon: <K8sServiceIcon className="size-full" />,
    bg: (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 
                   -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full 
                   bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 opacity-70 
                   blur-[20px] filter"
      ></div>
    ),
  },
  {
    icon: <K8sConfigMapIcon className="size-full" />,
    bg: (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 
                   -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full 
                   bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 opacity-70 
                   blur-[20px] filter"
      ></div>
    ),
  },
  {
    icon: <K8sIngressIcon className="size-full" />,
    bg: (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 
                   -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full 
                   bg-gradient-to-r from-red-500 via-red-600 to-red-700 opacity-70 
                   blur-[20px] filter"
      ></div>
    ),
  },
  {
    icon: <K8sSecretIcon className="size-full" />,
    bg: (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 
                   -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full 
                   bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 opacity-70 
                   blur-[20px] filter"
      ></div>
    ),
  },
];

// Utility function to shuffle tiles randomly
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const Card = (card: { icon: JSX.Element; bg: JSX.Element }) => {
  const id = useId();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        transition: { delay: Math.random() * 2, ease: 'easeOut', duration: 1 },
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      key={id}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={controls}
      className={cn(
        'relative size-20 cursor-pointer overflow-hidden rounded-2xl border p-4',
        // Light mode styles
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // Dark mode styles
        'transform-gpu dark:bg-transparent dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      )}
    >
      {card.icon}
      {card.bg}
    </motion.div>
  );
};

export default function CallToActionSection() {
  const [randomTiles1, setRandomTiles1] = useState<typeof k8sTiles>([]);
  const [randomTiles2, setRandomTiles2] = useState<typeof k8sTiles>([]);
  const [randomTiles3, setRandomTiles3] = useState<typeof k8sTiles>([]);
  const [randomTiles4, setRandomTiles4] = useState<typeof k8sTiles>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRandomTiles1(shuffleArray([...k8sTiles]));
      setRandomTiles2(shuffleArray([...k8sTiles]));
      setRandomTiles3(shuffleArray([...k8sTiles]));
      setRandomTiles4(shuffleArray([...k8sTiles]));
    }
  }, []);

  return (
    <section id="cta">
      <div className="py-14">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee reverse className="-delay-[200ms] [--duration:10s]" repeat={5}>
              {randomTiles1.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:25s]" repeat={5}>
              {randomTiles2.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <Marquee reverse className="-delay-[200ms] [--duration:20s]" repeat={5}>
              {randomTiles1.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:30s]" repeat={5}>
              {randomTiles2.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <Marquee reverse className="-delay-[200ms] [--duration:20s]" repeat={5}>
              {randomTiles3.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:30s]" repeat={5}>
              {randomTiles4.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <div className="absolute z-10">
              <div className="mx-auto size-24 rounded-[2rem] border bg-white/10 p-3 shadow-2xl backdrop-blur-md dark:bg-black/10 lg:size-32">
                {/* Central icon remains the Kubernetes logo */}
                <SiKubernetes className="mx-auto size-16 text-black dark:text-white lg:size-24" />
              </div>
              <div className="z-10 mt-4 flex flex-col items-center text-center text-primary">
                <h1 className="text-3xl font-bold lg:text-4xl">Manage your Kubernetes resources effortlessly</h1>
                <p className="mt-2">Streamline your cluster operations with powerful dashboards and real-time insights.</p>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({
                      size: 'lg',
                      variant: 'outline',
                    }),
                    'group mt-4 rounded-[2rem] px-6',
                  )}
                >
                  Get Started
                  <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="absolute inset-0 -z-10 rounded-full bg-backtround opacity-40 blur-xl dark:bg-background" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-background to-70% dark:to-background" />
          </div>
        </div>
      </div>
    </section>
  );
}
