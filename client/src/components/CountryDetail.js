// client\src\components\CountryDetail.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/CountryDetail.css";

const CountryDetail = () => {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountryDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}`
        );
        const data = await response.json();
        setCountry(data[0]);
      } catch (error) {
        console.error("Error fetching country details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryDetail();
  }, [countryCode]);

  if (isLoading || !country) {
    return <div className="loading-spinner">Loading country details...</div>;
  }

  const {
    name,
    capital,
    population,
    area,
    flags,
    coatOfArms,
    maps,
    borders,
    region,
    subregion,
    languages,
  } = country;

  return (
    <div
      className="country-detail"
      style={{
        backgroundImage: coatOfArms.svg
          ? `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${coatOfArms.svg})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Link to="/" className="back-link">
        <button className="back-link-btn">← Back to Countries List</button>
      </Link>
      <div className="country-info-container">
        <h1 className="country-name">{name.common}</h1>
        <div className="country-info">
          <div className="country-flag-container">
            <img
              src={flags.svg}
              alt={`${name.common} flag`}
              className="country-flag"
            />
          </div>
          <div className="country-details">
            <p>
              <strong>Capital:</strong> {capital ? capital[0] : "N/A"}
            </p>
            <p>
              <strong>Population:</strong> {population.toLocaleString()}
            </p>
            <p>
              <strong>Area:</strong> {area.toLocaleString()} km²
            </p>
            <p>
              <strong>Region:</strong> {region}
            </p>
            <p>
              <strong>Subregion:</strong> {subregion}
            </p>
            <p>
              <strong>Languages:</strong>{" "}
              {languages ? Object.values(languages).join(", ") : "N/A"}
            </p>
            <p>
              <strong>Borders:</strong> {borders ? borders.join(", ") : "N/A"}
            </p>
            <a
              href={maps.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
