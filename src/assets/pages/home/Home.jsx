import Hero from '../../components/Hero.jsx';
import About from '../../components/About.jsx';
import Skills from '../../components/Skills.jsx';
import Footer from '../../components/Footer.jsx';

function Home() {
  return (
    <main className="home-page-container">
      <Hero />
      <About />
      <Skills />
      <Footer />
    </main>
  );
}

export default Home;