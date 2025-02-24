import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Departments = () => {
  const [activeIndex, setActiveIndex] = useState(null); // Track which card is expanded

  const departmentsArray = [
    {
      name: "Optometrists",
      imageUrl: "/departments/pedia.jpg",
      description: "Providing comprehensive eye care services, including vision correction and eye disease management.",
    },
    {
      name: "Orthopedics",
      imageUrl: "/departments/ortho.jpg",
      description: "Specialized in treating bone and joint issues with advanced orthopedic care.",
    },
    {
      name: "Cardiology",
      imageUrl: "/departments/cardio.jpg",
      description: "Expert care for heart-related conditions, including diagnostics and treatments.",
    },
    {
      name: "Neurology",
      imageUrl: "/departments/neuro.jpg",
      description: "Comprehensive neurological services for brain and nervous system health.",
    },
    {
      name: "Oncology",
      imageUrl: "/departments/onco.jpg",
      description: "Advanced cancer diagnosis and treatment with a compassionate approach.",
    },
    {
      name: "Radiology",
      imageUrl: "/departments/radio.jpg",
      description: "State-of-the-art imaging services to assist in accurate diagnoses.",
    },
    {
      name: "Physical Therapy",
      imageUrl: "/departments/therapy.jpg",
      description: "Rehabilitation services to improve mobility and reduce pain.",
    },
    {
      name: "Dermatology",
      imageUrl: "/departments/derma.jpg",
      description: "Expert care for skin, hair, and nail health.",
    },
    {
      name: "ENT",
      imageUrl: "/departments/ent.jpg",
      description: "Treatment for ear, nose, and throat conditions.",
    },
  ];

  const responsive = {
    extraLarge: {
      breakpoint: { max: 3000, min: 1324 },
      items: 4,
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 3,
    },
    medium: {
      breakpoint: { max: 1005, min: 700 },
      items: 2,
    },
    small: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
    },
  };

  const handleCardClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index); // Toggle the active card
  };

  return (
    <div className="container departments">
      <h2>Departments</h2>
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {departmentsArray.map((depart, index) => (
          <div
            key={index}
            className={`card ${activeIndex === index ? "active" : ""}`}
            onClick={() => handleCardClick(index)}
          >
            <img src={depart.imageUrl} alt="Department" />
            <div className="depart-name">{depart.name}</div>
            {activeIndex === index && (
              <div className="depart-description">{depart.description}</div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Departments;
