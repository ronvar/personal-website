import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { AboutMe } from '@/components/AboutMe';
import { Skills } from '@/components/Skills';
import { Work } from '@/components/Work';
import { Experience } from '@/components/Experience';
import { Contact } from '@/components/Contact';
import { DevModeProvider } from '@/components/DevModeContext';
import { Terminal } from '@/components/Terminal';

export default function Home() {
  return (
    <DevModeProvider>
      <a className="skip-link btn btn-primary" href="#main">Skip to content</a>
      <Navbar />
      <Terminal />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <AboutMe />
        <Skills />
      </main>
      <Contact />
    </DevModeProvider>
  );
}
