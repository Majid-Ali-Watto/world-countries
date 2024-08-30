import { useEffect, useState, useMemo, useCallback, memo } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { formatPopulation } from "./utils/format-population";
import { Loader } from "circle-loader";
// Move this outside of the App component
const cache = { countries: [], state: "" };

const App = memo(() => {
	const [countries, setCountries] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	// Memoize sorting function
	const sortByName = useCallback((a, b) => {
		return a.name.common.toLowerCase().localeCompare(b.name.common.toLowerCase());
	}, []);

	useEffect(() => {
		sessionStorage.clear();

		async function fetchCountriesData() {
			if (cache.countries.length > 0) {
				setCountries(cache.countries);
				return;
			}
			try {
				console.log("Fetching countries");
				const response = await axios.get("/all?fields=name,capital,continents,flags,population,ccn3");
				const sortedCountries = response.data.sort(sortByName);
				cache.countries = sortedCountries; // Store the reference to avoid mutation
				setCountries(sortedCountries);
			} catch (error) {
				console.error(error);
			}
		}

		fetchCountriesData()
			.then(() => {
				setTimeout(() => {
					if (cache.state) {
						const element = document.getElementById(cache.state);
						if (element) {
							element.scrollIntoView({ behavior: "instant", block: "nearest" });
						}
					} else {
						window.scrollTo(0, 0);
					}
				}, 0);
			})
			.finally(() => {
				Loader.close();
			});
	}, [sortByName]);

	// Memoize filtered countries
	const filteredCountries = useMemo(() => {
		const query = searchQuery.toLowerCase();
		console.log(query);
		return countries.filter((country) => {
			return country.name.common.toLowerCase().includes(query) || country.continents.some((continent) => continent.toLowerCase().includes(query));
		});
	}, [countries, searchQuery]);

	const gotoCountryPage = (country) => {
		cache.state = country.ccn3;
		navigate("/country", { state: { country: country.ccn3 } });
	};

	return (
		<>
			<section>
				<abbr title="Explore Countries, States, Cities, and Population Insights">
					<h2 id="header-title">World Atlas</h2>
				</abbr>
				<div className="search-container">
					<input
						tabIndex={1}
						type="search"
						placeholder="Search for a country..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-bar"
					/>
				</div>
			</section>
			<div className="card-container">
				{filteredCountries.length > 0 ? (
					filteredCountries.map((country, index) => (
						<div
							tabIndex={index + 2}
							id={country.ccn3}
							key={country.name.common}
							className="card">
							<div>
								<h2 id="country-name">
									{index + 1}. {country.name.common}
								</h2>
							</div>

							<img
								src={country.flags.svg}
								alt={country.flags.alt}
								className="flag"
								loading="lazy"
							/>
							<p>
								<strong>Capital:</strong> {country.capital?.join(", ") || "N/A"}
							</p>
							<p>
								<strong>Continents:</strong> {country.continents?.join(", ")}
							</p>
							<p>
								<strong>Population:</strong> {formatPopulation(country.population)}
							</p>
							<p>
								<a onClick={() => gotoCountryPage(country)}>View All Data</a>
							</p>
						</div>
					))
				) : searchQuery ? (
					<p>No data found</p>
				) : (
					Loader.start()
				)}
			</div>
		</>
	);
});

App.displayName = "App";

App.propTypes = {
	cache: PropTypes.shape({
		countries: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.shape({
					common: PropTypes.string.isRequired
				}).isRequired,
				capital: PropTypes.arrayOf(PropTypes.string),
				continents: PropTypes.arrayOf(PropTypes.string),
				flags: PropTypes.shape({
					svg: PropTypes.string.isRequired,
					alt: PropTypes.string
				}).isRequired,
				population: PropTypes.number
			})
		),
		state: PropTypes.string
	}).isRequired
};

export default App;
