import { Suspense, useEffect, useState } from "react";
import "./CountryCard.css"; // Separate styling file
import axios from "axios";
import Loading from "./Loader";
import { useLocation } from "react-router-dom";

function CountryCard() {
	const [countries, setCountries] = useState([]);
	const location = useLocation();
	const data = location.state;

	useEffect(() => {
		sessionStorage.setItem("flag", JSON.stringify(true));

		async function fetchCountriesData() {
			try {
				const response = await axios.get(`https://restcountries.com/v3.1/alpha?codes=${data}`);
				setCountries(response.data);
			} catch (error) {
				console.log(error);
			}
		}
		fetchCountriesData();
	}, [data]);

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
		<Suspense fallback={<Loading />}>
			<div className="country-card-container">
				{countries.length > 0 ? (
					countries.map((country) => (
						<div
							key={country.name.common}
							className="country-card">
							<div className="flag-coat-container">
								<img
									src={country.flags.svg}
									alt={country.flags.alt}
									className="flag"
									loading="lazy"
								/>
								<img
									src={country.coatOfArms.svg}
									alt={country.coatOfArms.alt}
									className="coat-of-arms"
									loading="lazy"
								/>
							</div>
							<h2>{country.name.common}</h2>
							<table className="details-table">
								<tbody>
									<tr>
										<td>
											<strong>Official Name:</strong>
										</td>
										<td>{country.name.official}</td>
									</tr>
									<tr>
										<td>
											<strong>Short Name:</strong>
										</td>
										<td>{country.fifa || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Internet Domain:</strong>
										</td>
										<td>{country?.tld?.join(", ") || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Capital:</strong>
										</td>
										<td>{country.capital?.join(", ") || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Nationality:</strong>
										</td>
										<td>{country?.demonyms?.eng?.f || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Languages:</strong>
										</td>
										<td>{Object.values(country.languages || {}).join(", ")}</td>
									</tr>
									<tr>
										<td>
											<strong>Continents:</strong>
										</td>
										<td>{country.continents?.join(", ")}</td>
									</tr>
									<tr>
										<td>
											<strong>Region:</strong>
										</td>
										<td>{country.region}</td>
									</tr>
									<tr>
										<td>
											<strong>Sub-Region:</strong>
										</td>
										<td>{country.subregion}</td>
									</tr>
									<tr>
										<td>
											<strong>UN Member:</strong>
										</td>
										<td>{country.unMember ? "Yes" : "No"}</td>
									</tr>
									<tr>
										<td>
											<strong>Time Zones:</strong>
										</td>
										<td>{country.timezones?.join(", ")}</td>
									</tr>
									<tr>
										<td>
											<strong>Start of Week:</strong>
										</td>
										<td>{country.startOfWeek[0].toUpperCase() + country.startOfWeek.slice(1)}</td>
									</tr>
									<tr>
										<td>
											<strong>Postal Code:</strong>
										</td>
										<td>{country?.postalCode?.format || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Currency:</strong>
										</td>
										<td>
											{country?.currencies?.[Object.keys(country?.currencies || {})[0]]?.name} ({country?.currencies?.[Object.keys(country?.currencies || {})[0]]?.symbol})
										</td>
									</tr>
									<tr>
										<td>
											<strong>Currency Code:</strong>
										</td>
										<td>{country.ccn3}</td>
									</tr>
									<tr>
										<td>
											<strong>Borders:</strong>
										</td>
										<td>{country.borders?.join(", ") || "None"}</td>
									</tr>
									<tr>
										<td>
											<strong>Area:</strong>
										</td>
										<td>
											{country.area} KM<sup>2</sup>
										</td>
									</tr>
									<tr>
										<td>
											<strong>Population:</strong>
										</td>
										<td>{formatPopulation(country.population)}</td>
									</tr>
									<tr>
										<td>
											<strong>Map:</strong>
										</td>
										<td>
											<a
												href={country.maps.openStreetMaps}
												target="_blank"
												rel="noopener noreferrer">
												View Map
											</a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					))
				) : (
					<Loading />
				)}
			</div>
		</Suspense>
	);
}

export default CountryCard;
