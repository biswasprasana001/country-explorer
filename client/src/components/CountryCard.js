// client\src\components\CountryCard.js
import React, { useState, useEffect } from "react";
import "../styles/CountryCard.css";

const CountryCard = ({ country }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { name, capital, currencies, flags } = country;

  useEffect(() => {
    // a short delay to ensure animation runs only after component has mounted
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const currencyNames = currencies
    ? Object.values(currencies)
        .map((currency) => currency.name)
        .join(", ")
    : "N/A";

  return (
    <div className={`country-card ${isLoaded ? "loaded" : ""}`}>
      <div className="country-card-flag">
        <img src={flags.svg} alt={`${name.common} flag`} />
      </div>
      <div className="country-card-details">
        <h2 className="country-card-name">{name.common}</h2>
        <p className="country-card-capital">
          <strong>Capital:</strong> {capital ? capital[0] : "N/A"}
        </p>
        <p className="country-card-currency">
          <strong>Currency:</strong> {currencyNames}
        </p>
      </div>
    </div>
  );
};

export default CountryCard;
