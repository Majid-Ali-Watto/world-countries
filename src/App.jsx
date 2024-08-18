import { Suspense, useEffect, useState, useMemo, useCallback, memo } from "react";
import "./App.css";
import axios from "axios";
import Loading from "./Loader";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const App = memo(({ cache }) => {
	const [countries, setCountries] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	const SortByName = useCallback((a, b) => {
		return a.name.common.toLowerCase().localeCompare(b.name.common.toLowerCase());
	}, []);

	useEffect(() => {
		async function fetchCountriesData() {
			if (cache.countries.length > 0) {
				setCountries(cache.countries);
				return;
			}
			try {
				console.log("Fetching countries");
				const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,capital,continents,flags,population,ccn3");
				const sortedCountries = response.data.sort(SortByName);
				cache.countries = sortedCountries; // Avoid direct mutation; ensure fresh reference if necessary
				setCountries(sortedCountries);
			} catch (error) {
				console.log(error);
			}
		}

		fetchCountriesData();
	}, [cache, SortByName]);

	const filteredCountries = useMemo(
		() =>
			countries.filter((country) => {
				const query = searchQuery.toLowerCase();
				return country.name.common.toLowerCase().includes(query) || country.continents.some((continent) => continent.toLowerCase().includes(query));
			}),
		[countries, searchQuery]
	);

	const formatPopulation = (population) => {
		if (!population) return "N/A";
		if (population >= 1_000_000_000) {
			return (population / 1_000_000_000).toFixed(2) + " billion";
		} else if (population >= 1_000_000) {
			return (population / 1_000_000).toFixed(2) + " million";
		} else {
			return population.toLocaleString();
		}
	};

	return (
		<>
			<section>
				<h2>World Countries</h2>
				<div className="search-container">
					<input
						type="text"
						placeholder="Search for a country..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-bar"
					/>
				</div>
			</section>
			<Suspense fallback={<Loading />}>
				<div className="card-container">
					{filteredCountries.length > 0 ? (
						filteredCountries.map((country, index) => (
							<div
								key={country.name.common}
								className="card">
								<h2>
									{index + 1}. {country.name.common}
								</h2>
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
									<strong>All Data:</strong>
									<a onClick={() => navigate("/country", { state: country.ccn3 })}>View All Data</a>
								</p>
							</div>
						))
					) : (
						<Loading />
					)}
				</div>
			</Suspense>
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
		)
	}).isRequired
};

export default App;
