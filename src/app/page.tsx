import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { AboutMe } from '@/components/AboutMe';
import { Skills } from '@/components/Skills';
import { Work } from '@/components/Work';
import { Experience } from '@/components/Experience';
import { DevModeProvider } from '@/components/DevModeContext';
import { Terminal } from '@/components/Terminal';

export default function Home() {
  return (
    <DevModeProvider>
      <Navbar />
      <Terminal />
      <main>
        <Hero />
        <AboutMe />
        <Skills />
        <Work />
        <Experience />
      </main>
    </DevModeProvider>
  );
}
