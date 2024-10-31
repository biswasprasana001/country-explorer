// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CountryList from "./components/CountryList";
import CountryDetail from "./components/CountryDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CountryList />} />
        <Route path="/country/:countryCode" element={<CountryDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
