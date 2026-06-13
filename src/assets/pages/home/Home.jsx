import Hero from '../../components/Hero.jsx';
import About from '../../components/About.jsx';
import Skills from '../../components/Skills.jsx';
import Projects from '../../components/Projects.jsx';
import Certificates from '../../components/Certificates.jsx';
import Contact from '../../components/Contact.jsx';
import Footer from '../../components/Footer.jsx';

function Home() {
  return (
    <main className="home-page-container">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certificates />
      <Contact />
      <Footer />
    </main>
  );
}

export default Home;