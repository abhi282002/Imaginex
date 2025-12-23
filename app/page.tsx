import Features from '@/components/features';
import Hero from '@/components/hero';
import Pricing from '@/components/pricing';
import Editor from '@/components/editor';
import Footer from '@/components/footer';
export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Pricing />
      <Editor />
      <Footer />
    </div>
  );
}
