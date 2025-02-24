import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p></p>
          <h3>Who Are We</h3>
          <p>
          Hope Cure Hospital is a premier healthcare institution dedicated to providing exceptional
           medical services with a patient-first approach. Founded with the mission to deliver
            compassionate and cutting-edge healthcare, the hospital offers a wide range of specialties, 
            including Optometrists, Cardiology, Neurology, Radiology, orthopedics, and more. 
            Equipped with state-of-the-art technology and staffed by highly skilled medical professionals,
           Hope Cure Hospital emphasizes quality, accessibility, and innovation in treatment.
          </p>
          
          <p>
          The hospital also fosters a holistic healing environment, offering wellness programs, counseling,
           and preventive care initiatives to promote overall well-being. Committed to serving the community
          , Hope Cure Hospital continually strives to set new benchmarks in patient care and medical excellence.
          </p>
          <p></p>
          <p></p>
        </div>
      </div>
    </>
  );
};

export default Biography;
