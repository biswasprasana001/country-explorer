// client\src\components\CountryCard.js
import React from "react";
// import "./CountryCard.css";

const CountryCard = ({ country, viewMode }) => {
  const { name, capital, currencies, flags } = country;

  // Get currency details
  const currencyNames = currencies
    ? Object.values(currencies)
        .map((currency) => currency.name)
        .join(", ")
    : "N/A";

  return (
    <div className={`country-card ${viewMode}`}>
      <img
        src={flags.svg}
        alt={`${name.common} flag`}
        className="country-flag"
      />
      <h2>{name.common}</h2>
      <p>Capital: {capital ? capital[0] : "N/A"}</p>
      <p>Currency: {currencyNames}</p>
    </div>
  );
};

export default CountryCard;
