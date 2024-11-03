// client/src/components/CountryList.js
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Import the spinner
import CountryCard from "./CountryCard";
import "../styles/CountryList.css";

const ITEMS_PER_PAGE_LARGE = 10;
const ITEMS_PER_PAGE_SMALL = 5;

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [filterRegion, setFilterRegion] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 750);

  const ITEMS_PER_PAGE = isSmallScreen
    ? ITEMS_PER_PAGE_SMALL
    : ITEMS_PER_PAGE_LARGE;
  const loaderRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < 750;
      setIsSmallScreen(smallScreen);
      setViewMode(smallScreen ? "grid" : "list");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchCountries = useCallback(async (url) => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch countries");
      return await response.json();
    } catch (error) {
      console.error(error.message);
      setDisplayedCountries([]);
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries("https://restcountries.com/v3.1/all").then((data) => {
      setCountries(data || []);
      setDisplayedCountries((data || []).slice(0, ITEMS_PER_PAGE));
    });
  }, [fetchCountries, ITEMS_PER_PAGE]);

  const filteredCountries = useMemo(() => {
    let result = [...countries];
    if (filterRegion)
      result = result.filter((country) => country.region === filterRegion);
    if (sortOption) {
      result = result.sort((a, b) => {
        if (sortOption.includes("population")) {
          return sortOption === "populationAsc"
            ? a.population - b.population
            : b.population - a.population;
        }
        if (sortOption.includes("area")) {
          return sortOption === "areaAsc" ? a.area - b.area : b.area - a.area;
        }
        return 0;
      });
    }
    return result;
  }, [countries, filterRegion, sortOption]);

  useEffect(() => {
    setDisplayedCountries(filteredCountries.slice(0, page * ITEMS_PER_PAGE));
  }, [filteredCountries, page, ITEMS_PER_PAGE]);

  const handleSearch = useCallback(async () => {
    const endpointMap = {
      name: "name",
      capital: "capital",
      language: "lang",
    };
    const endpoint = endpointMap[searchType];
    const url = `https://restcountries.com/v3.1/${endpoint}/${searchQuery}`;
    const data = await fetchCountries(url);
    if (data) {
      setCountries(data);
      setDisplayedCountries(data.slice(0, ITEMS_PER_PAGE));
      setPage(1);
    }
  }, [searchType, searchQuery, fetchCountries, ITEMS_PER_PAGE]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          page * ITEMS_PER_PAGE < filteredCountries.length
        ) {
          setIsPaginating(true);
          setPage((prev) => prev + 1);
          setIsPaginating(false);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, filteredCountries, ITEMS_PER_PAGE, isLoading]);

  return (
    <div className="country-list">
      <header className="country-list-header">
        <h1 className="country-list-title">Countries of the World</h1>
        {!isSmallScreen && (
          <button
            onClick={() =>
              setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
            }
            className="view-mode-button"
          >
            Toggle to {viewMode === "grid" ? "List" : "Grid"} View
          </button>
        )}
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="search-input"
            />
            <select
              onChange={(e) => setSearchType(e.target.value)}
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
              onChange={(e) => setFilterRegion(e.target.value)}
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
              onChange={(e) => setSortOption(e.target.value)}
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
          <div key={country.cca3} className="country-container">
            <Link to={`/country/${country.cca3}`}>
              <CountryCard country={country} viewMode={viewMode} />
            </Link>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="loading-spinner">
          <ClipLoader color="#007bff" size={50} />
        </div>
      )}
      <div ref={loaderRef} className="loading-spinner">
        {isPaginating && <ClipLoader color="#007bff" size={30} />}
      </div>
    </div>
  );
};

export default CountryList;
