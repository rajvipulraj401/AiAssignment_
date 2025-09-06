// import React from "react";

const About = () => {
  return (
    <>
      <h1> Hi! I am about page</h1>
    </>
  );
};

export default About;

/* 

import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import Home from "./components/Home";
import About from "./components/About";
//  Component hai toh unke name toh capital honge na (waise we can import by anyname )

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Link to="/" style={{ color: "red" }}>
          {" "}
          <h3> Home Show </h3>
        </Link>
        <br></br>
        <br></br>
        <Link to="/about"> About Dikhao</Link>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* link in path where the path you  want to link to open that component (/ is the
        root path) and then in elment props tell which component you want to link 
        
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;


*/
