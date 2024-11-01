// client\src\components\CountryCard.js
import React from "react";
import "../styles/CountryCard.css";

const CountryCard = ({ country, viewMode }) => {
  const { name, capital, currencies, flags } = country;

  // Get currency details
  const currencyNames = currencies
    ? Object.values(currencies)
        .map((currency) => currency.name)
        .join(", ")
    : "N/A";

  return (
    <div className="country-card">
      <div className="country-card-flag">
        <img src={flags.svg} alt={`${name.common} flag`} />
      </div>
      <div className="country-card-details">
        <h2 className="country-card-name">{name.common}</h2>
        <p className="country-card-capital">
          Capital: {capital ? capital[0] : "N/A"}
        </p>
        <p className="country-card-currency">Currency: {currencyNames}</p>
      </div>
    </div>
  );
};

export default CountryCard;
