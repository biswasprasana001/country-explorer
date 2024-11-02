// client\src\components\CountryList.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import CountryCard from "./CountryCard";
import "../styles/CountryList.css";

const CountryList = () => {
  const [countries, setCountries] = useState([]); // All countries data
  const [displayedCountries, setDisplayedCountries] = useState([]); // Countries displayed
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'
  const [page, setPage] = useState(1); // Pagination page
  const [filterRegion, setFilterRegion] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 750);
  const ITEMS_PER_PAGE = 10; // Number of items per page

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 750;
      setIsSmallScreen(isSmall);

      if (isSmall) {
        setViewMode("grid"); // Set to grid on small screens
      }
    };

    // Initial check for screen size
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Apply filters and sorting before displaying countries
  useEffect(() => {
    let filteredCountries = [...countries];

    // Apply region filter
    if (filterRegion) {
      filteredCountries = filteredCountries.filter(
        (country) => country.region === filterRegion
      );
    }

    // Apply sorting
    if (sortOption === "populationAsc") {
      filteredCountries.sort((a, b) => a.population - b.population);
    } else if (sortOption === "populationDesc") {
      filteredCountries.sort((a, b) => b.population - a.population);
    } else if (sortOption === "areaAsc") {
      filteredCountries.sort((a, b) => a.area - b.area);
    } else if (sortOption === "areaDesc") {
      filteredCountries.sort((a, b) => b.area - a.area);
    }

    // Paginate filtered and sorted results
    setDisplayedCountries(filteredCountries.slice(0, page * ITEMS_PER_PAGE));
  }, [filterRegion, sortOption, page, countries]);

  // Search function
  const handleSearch = async () => {
    setIsLoading(true);
    let url = "";

    if (searchType === "name") {
      url = `https://restcountries.com/v3.1/name/${searchQuery}`;
    } else if (searchType === "capital") {
      url = `https://restcountries.com/v3.1/capital/${searchQuery}`;
    } else if (searchType === "language") {
      url = `https://restcountries.com/v3.1/lang/${searchQuery}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("No results found");
      const data = await response.json();
      setCountries(data);
      setDisplayedCountries(data.slice(0, ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching search results:", error);
      setCountries([]);
      setDisplayedCountries([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleFilterChange = (e) => {
    setFilterRegion(e.target.value);
    setPage(1); // Reset to first page after filter change
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1); // Reset to first page after sort change
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  return (
    <div className="country-list">
      <header className="country-list-header">
        <h1 className="country-list-title">Countries of the World</h1>
        {/* Show toggle button only on larger screens */}
        {!isSmallScreen && (
          <button onClick={toggleViewMode} className="view-mode-button">
            Toggle to {viewMode === "grid" ? "List" : "Grid"} View
          </button>
        )}
        <div className="controls">
          {/* Search Input */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

            <select
              onChange={handleSearchTypeChange}
              value={searchType}
              className="search-type-select"
            >
              <option value="name">Country</option>
              <option value="capital">Capital</option>
              <option value="language">Language</option>
            </select>
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>
          <div className="filter-container">
            <select
              onChange={handleFilterChange}
              value={filterRegion}
              className="filter-select"
            >
              <option value="">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>

            <select
              onChange={handleSortChange}
              value={sortOption}
              className="sort-select"
            >
              <option value="">Sort by</option>
              <option value="populationAsc">Population: Low to High</option>
              <option value="populationDesc">Population: High to Low</option>
              <option value="areaAsc">Area: Small to Large</option>
              <option value="areaDesc">Area: Large to Small</option>
            </select>
          </div>
        </div>
      </header>

      <div className={viewMode}>
        {displayedCountries.map((country) => (
          <div className="country-container">
            <Link to={`/country/${country.cca3}`}>
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
