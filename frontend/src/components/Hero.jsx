import React, { useState } from "react";

const Hero = ({ title, imageUrl }) => {
  const [showMore, setShowMore] = useState(false);
  const handleLearnMoreClick = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="hero container">
      <div className="banner">
        <h1>{title}</h1>
        <p>Your health is our priority. Trusted by thousands of patients every year.</p>
        {showMore && (
          <p>
            We offer personalized care and advanced medical services tailored to your needs.
            Experience exceptional healthcare with our dedicated team.
          </p>
        )}
        <div>
          <button className="cta-button secondary" onClick={handleLearnMoreClick}>
            {showMore ? "Show Less" : "Learn More"}
          </button>
        </div>
      </div>
      <div className="banner">
        <img src={imageUrl} alt="hero" className="animated-image" />
      </div>
    </div>
  );
};

export default Hero;
