import NavBar from "../components/NavBar";
import "../styles/about.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <NavBar />

      <main className="about-content">
        <section className="about-intro">
          <h1>About The Beatles</h1>
          <p>
            The Beatles were an English rock band formed in Liverpool in 1960. With
            members John Lennon, Paul McCartney, George Harrison, and Ringo Starr,
            they became the most commercially successful and critically acclaimed
            act in the history of popular music.
          </p>
        </section>

        <section className="cards">
          <div id="card1" className="card">
            <img src="https://via.placeholder.com/700x1000?text=Paul+McCartney" alt="Paul McCartney" />
            <div className="overlay">
              <h3>Paul McCartney</h3>
              <p>
                Paul McCartney is a legendary musician, singer, and songwriter best known for his role as the
                bassist and one of the primary songwriters of The Beatles. His melodic bass lines, powerful voice,
                and iconic compositions such as "Hey Jude" and "Yesterday" helped shape the sound of the 1960s and beyond.
              </p>
            </div>
          </div>

          <div id="card2" className="card">
            <img src="https://via.placeholder.com/700x1000?text=George+Harrison" alt="George Harrison" />
            <div className="overlay">
              <h3>George Harrison</h3>
              <p>
                George Harrison, often called the "Quiet Beatle," was the lead guitarist and one of the key songwriters of The Beatles.
                His contributions to the band's music, including hits like "Here Comes the Sun" and "Something," highlighted his deep interest in spirituality and Indian culture.
              </p>
            </div>
          </div>

          <div id="card3" className="card">
            <img src="https://via.placeholder.com/700x1000?text=John+Lennon" alt="John Lennon" />
            <div className="overlay">
              <h3>John Lennon</h3>
              <p>
                John Lennon was an influential musician, peace activist, and one of the founding members of The Beatles.
                Known for his wit, creativity, and thought-provoking lyrics, Lennon was the driving force behind songs like "Imagine".
              </p>
            </div>
          </div>

          <div id="card4" className="card">
            <img src="https://via.placeholder.com/700x1000?text=Ringo+Starr" alt="Ringo Starr" />
            <div className="overlay">
              <h3>Ringo Starr</h3>
              <p>
                Ringo Starr, drummer for The Beatles, is known for his steady, innovative style that shaped their iconic sound.
                He sang hits like "Yellow Submarine" and continued to inspire music fans worldwide.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
