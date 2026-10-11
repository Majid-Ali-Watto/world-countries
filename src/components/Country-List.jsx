import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import Flag from "./Flag";
import { formatPopulation } from "../utils/format-population";

const countryShape = PropTypes.shape({
	name: PropTypes.string.isRequired,
	ccn3: PropTypes.string,
	capital: PropTypes.arrayOf(PropTypes.string).isRequired,
	continents: PropTypes.arrayOf(PropTypes.string).isRequired,
	flag: PropTypes.object.isRequired,
	region: PropTypes.string,
	population: PropTypes.number,
	area: PropTypes.number
});

// Opens the country page, remembering the current filters so "Back" can restore them.
function DetailsLink({ country }) {
	const { search } = useLocation();
	if (!country.ccn3) return "No further data available";
	return (
		<Link
			to={`/country/${country.ccn3}`}
			state={{ from: search }}>
			View All Data
		</Link>
	);
}

DetailsLink.propTypes = { country: countryShape.isRequired };

function CountryCards({ countries }) {
	return (
		<div className="card-container">
			{countries.map((country, index) => (
				<div
					key={country.ccn3 || country.name}
					id={country.ccn3 || undefined}
					className="card">
					<h2 id="country-name">
						{index + 1}. {country.name}
					</h2>
					<Flag
						flag={country.flag}
						name={country.name}
						lazy
					/>
					<p>
						<strong>Capital:</strong> {country.capital.join(", ") || "N/A"}
					</p>
					<p>
						<strong>Continents:</strong> {country.continents.join(", ") || "N/A"}
					</p>
					<p>
						<DetailsLink country={country} />
					</p>
				</div>
			))}
		</div>
	);
}

CountryCards.propTypes = { countries: PropTypes.arrayOf(countryShape).isRequired };

function CountryRows({ countries }) {
	return (
		<ul className="country-list">
			{countries.map((country) => (
				<li
					key={country.ccn3 || country.name}
					id={country.ccn3 || undefined}
					className="country-row">
					<Flag
						flag={country.flag}
						name={country.name}
						lazy
						compact
					/>
					<div className="row-main">
						<strong>{country.name}</strong>
						<span>{country.capital.join(", ") || "No capital"}</span>
					</div>
					<span className="row-meta">{[country.region, country.continents.join(", ")].find(Boolean) || "N/A"}</span>
					<span className="row-meta">{country.population != null ? `${formatPopulation(country.population)} people` : "Population N/A"}</span>
					<span className="row-link">
						<DetailsLink country={country} />
					</span>
				</li>
			))}
		</ul>
	);
}

CountryRows.propTypes = { countries: PropTypes.arrayOf(countryShape).isRequired };

function CountryList({ countries, view }) {
	return view === "list" ? <CountryRows countries={countries} /> : <CountryCards countries={countries} />;
}

CountryList.propTypes = {
	countries: PropTypes.arrayOf(countryShape).isRequired,
	view: PropTypes.oneOf(["cards", "list"]).isRequired
};

export default CountryList;
