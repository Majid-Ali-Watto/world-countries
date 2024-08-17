import { Suspense, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Loading from "./Loader";

function App() {
	const [countries, setCountries] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	function SortByName(a, b) {
		if (a.name.common.toLowerCase() > b.name.common.toLowerCase()) return 1;
		else if (a.name.common.toLowerCase() < b.name.common.toLowerCase()) return -1;
		else return 0;
	}

	useEffect(() => {
		async function fetchCountriesData() {
			try {
				const response = await axios.get("https://restcountries.com/v3.1/all");
				setCountries(response.data.sort(SortByName));
			} catch (error) {
				console.log(error);
			}
		}
		fetchCountriesData();
	}, []);

	const filteredCountries = countries.filter((country) => {
		return country.name.common.toLowerCase().includes(searchQuery.toLowerCase()) || country.continents.map((val) => val.toLowerCase()).includes(searchQuery.toLowerCase());
	});

	const formatPopulation = (population) => {
		if (!population) return "N/A";
		if (population >= 1_000_000_000) {
			return (population / 1_000_000_000).toFixed(2) + " billion";
		} else if (population >= 1_000_000) {
			return (population / 1_000_000).toFixed(2) + " million";
		} else {
			return population.toLocaleString(); // For numbers less than a million
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
								/>
								<img
									src={country.coatOfArms.svg}
									alt={country.coatOfArms.alt}
									className="coat-of-arms"
								/>
								<p>
									<strong>Official Name:</strong> {country.name.official}
								</p>
								<p>
									<strong>Short Name:</strong> {country.fifa || "N/A"}
								</p>
								<p>
									<strong>Internet Domain:</strong> {country?.tld?.join(", ") || "N/A"}
								</p>

								<p>
									<strong>Capital:</strong> {country.capital?.join(", ") || "N/A"}
								</p>
								<p>
									<strong>Nationality:</strong> {country?.demonyms?.eng?.f || "N/A"}
								</p>
								<p>
									<strong>Languages:</strong> {Object.values(country.languages || {}).join(", ")}
								</p>
								<p>
									<strong>Continents:</strong> {country.continents?.join(", ")}
								</p>
								<p>
									<strong>Region:</strong> {country.region}
								</p>
								<p>
									<strong>Sub-Region:</strong> {country.subregion}
								</p>
								<p>
									<strong>UN Member:</strong> {country.unMember ? "Yes" : "No"}
								</p>
								<p>
									<strong>Time Zones:</strong> {country.timezones?.join(", ")}
								</p>
								<p>
									<strong>Start of Week:</strong>
									{country.startOfWeek
										.split("")
										.map((m, index) => (index == 0 ? m.toUpperCase() : m))
										.join("")}
								</p>
								<p>
									<strong>Postal Code:</strong> {country?.postalCode?.format || "N/A"}
								</p>
								<p>
									<strong>Currency:</strong> {country?.currencies?.[Object.keys(country?.currencies || {})[0]]?.name} ({country?.currencies?.[Object.keys(country?.currencies || {})[0]]?.symbol})
								</p>
								<p>
									<strong>Currency Code:</strong> {country.ccn3}
								</p>
								<p>
									<strong>Borders:</strong> {country.borders?.join(", ") || "None"}
								</p>
								<p>
									<strong>Area:</strong> {country.area} KM<sup>2</sup>
								</p>
								<p>
									<strong>Population:</strong> {formatPopulation(country.population)}
								</p>
								<p>
									<strong>Map:</strong>
									<a
										href={country.maps.openStreetMaps}
										target="_blank"
										rel="noopener noreferrer">
										View Map
									</a>
								</p>
							</div>
						))
					) : (
						<p>No countries found.</p>
					)}
				</div>
			</Suspense>
		</>
	);
}

export default App;
