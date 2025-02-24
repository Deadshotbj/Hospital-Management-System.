import React, { useContext } from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import MessageForm from "../components/MessageForm";
import Departments from "../components/Departments";

const Home = () => {
  return (
    <>
      <Hero
        title={
          <h1 className="hero-title">
            Welcome to HopeCare Medical Institute | Your Trusted Healthcare Provider
          </h1>
        }
        imageUrl={"/herooo.png"}
      />
      <Biography imageUrl={"/bioo.png"} />
      <Departments />
      <MessageForm />
    </>
  );
};

export default Home;
