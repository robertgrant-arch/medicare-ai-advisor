import { Header } from '@/components/Header';
import { HeroChat } from '@/components/HeroChat';
import { TrustBar } from '@/components/TrustBar';
import { FeatureCards } from '@/components/FeatureCards';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-navy-50/30 to-white">
      <Header />
      <HeroChat />
      <TrustBar />
      <FeatureCards />
      <HowItWorks />
      <Footer />
    </main>
  );
}
