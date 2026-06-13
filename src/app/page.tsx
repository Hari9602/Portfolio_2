import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Preloader from "@/components/layout/Preloader";
import CommandPalette from "@/components/layout/CommandPalette";
import ScrollSpy from "@/components/layout/ScrollSpy";
import ConsoleSignature from "@/components/layout/ConsoleSignature";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Expertise from "@/components/sections/Expertise";
import LiveOps from "@/components/sections/LiveOps";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Trajectory from "@/components/sections/Trajectory";
import Credentials from "@/components/sections/Credentials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <div className="grain" />
      <div className="noise-vignette" />
      <Cursor />
      <ScrollProgress />
      <ScrollSpy />
      <ConsoleSignature />
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Experience />
        <Expertise />
        <LiveOps />
        <Projects />
        <Skills />
        <Trajectory />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
    </SmoothScroll>
  );
}
