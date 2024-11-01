// client\src\components\CountryList.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import CountryCard from "./CountryCard";
import "../styles/CountryList.css";

const CountryList = () => {
  const [countries, setCountries] = useState([]); // All countries data
  const [displayedCountries, setDisplayedCountries] = useState([]); // Countries displayed
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [page, setPage] = useState(1); // Pagination page
  const ITEMS_PER_PAGE = 10; // Number of items per page

  const loader = useRef(null);

  // Fetch all countries initially
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data);
        setDisplayedCountries(data.slice(0, ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching countries data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Load more countries as the page number increases
  useEffect(() => {
    if (page > 1) {
      const nextCountries = countries.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      );
      setDisplayedCountries((prev) => [...prev, ...nextCountries]);
    }
  }, [page, countries]);

  // Infinite Scroll Observer
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  return (
    <div className="country-list">
      <header className="country-list-header">
        <h1 className="country-list-title">Countries of the World</h1>
        <button onClick={toggleViewMode} className="view-mode-button">
          Toggle to {viewMode === "grid" ? "List" : "Grid"} View
        </button>
      </header>

      <div className={viewMode}>
        {displayedCountries.map((country) => (
          <div className="country-container">
            <Link to={`/country/${country.cca3}`} key={country.cca3}>
              <CountryCard country={country} viewMode={viewMode} />
            </Link>
          </div>
        ))}
      </div>

      {isLoading && <div className="loading-spinner">Loading...</div>}

      {/* Loader div to trigger infinite scroll */}
      <div ref={loader} className="loading-spinner">
        {isLoading && <div>Loading more countries...</div>}
      </div>
    </div>
  );
};

export default CountryList;
