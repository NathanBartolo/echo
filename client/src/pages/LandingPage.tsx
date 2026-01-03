// ============================================
// LANDING PAGE - Home page with featured songs
// ============================================

import Header from "../components/Header";
import FeaturedSongs from "../components/FeaturedSongs";
import Footer from "../components/Footer";
const LandingPage = () => {
  return (
    <div>
      <Header />
      <FeaturedSongs/>
      <Footer/>
    </div>
  );
};

export default LandingPage;
