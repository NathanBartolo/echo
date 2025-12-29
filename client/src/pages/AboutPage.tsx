import NavBar from "../components/NavBar";
import "../styles/about.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <NavBar />

      <main className="about-content">

        <section className="story-section">
          <div className="story-grid">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Echo was born from a simple idea: music should be personal, discoverable, and meaningful. 
                We created a platform that doesn't just organize your music — it helps you create soundtracks 
                for your life's moments.
              </p>
              <p>
                Whether you're crafting the perfect road trip playlist, curating study vibes, or collecting 
                songs that bring back memories, Echo makes it effortless to discover, organize, and share 
                the music that matters to you.
              </p>
            </div>
            <div className="story-visual">
              <div className="floating-notes">
                <span>♪</span>
                <span>♫</span>
                <span>♬</span>
                <span>𝄞</span>
              </div>
            </div>
          </div>
        </section>

        

       
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Your Musical Journey?</h2>
            <p>Join thousands of music lovers who've made Echo their home for discovery and curation.</p>
            <button className="cta-button" onClick={() => window.location.href = '/discover'}>
              Start Exploring
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
