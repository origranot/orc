import CallToActionSection from '@orc/web/components/marketing/landing/cta-section';
import HeroSection from '@orc/web/components/marketing/landing/hero-section';
import ProblemSection from '@orc/web/components/marketing/landing/problem-section';
import SolutionSection from '@orc/web/components/marketing/landing/solution-section';
import Particles from '@orc/web/ui/magicui/ui/particles';
import { SphereMask } from '@orc/web/ui/magicui/ui/sphere-mask';
import { SiteHeader } from '@orc/web/components/marketing/site-header';
import { SiteFooter } from '@orc/web/components/marketing/site-footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex-1 overflow-hidden">{children}</main>
      <SiteFooter />
    </>
  );
};

export default async function Page() {
  return (
    <MarketingLayout>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <CallToActionSection />
      <SphereMask />
      <Particles className="absolute inset-0 -z-10" quantity={50} ease={70} size={0.05} staticity={40} color={'#ffffff'} />
    </MarketingLayout>
  );
}
