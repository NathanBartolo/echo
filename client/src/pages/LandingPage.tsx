import Header from "../components/Header";
import TestBackend from "../components/TestBackend";
import FeaturedSongs from "../components/FeaturedSongs";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div>
      <Header />
      <TestBackend /> {/* This will show backend response */}
      <FeaturedSongs/>
      <Footer/>
    </div>
  );
};

export default LandingPage;
