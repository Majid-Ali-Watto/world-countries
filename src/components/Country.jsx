import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "circle-loader";

import { useLocation, useNavigate } from "react-router-dom";
import { formatPopulation } from "../utils/format-population";

function CountryCard() {
	const [countries, setCountries] = useState([]);
	const [borders, setBorders] = useState([]);
	const [bordersNames, setBordersNames] = useState([]);
	const location = useLocation();
	const navigate = useNavigate();
	const data = location.state.country;

	useEffect(() => {
		window.scrollTo(0, 0);
		async function fetchCountriesData() {
			try {
				const response = await axios.get(`/alpha?codes=${data}`);
				console.log(response.data);
				setCountries(response.data);
				setBorders(response.data[0].borders);
				sessionStorage.setItem("countries", JSON.stringify(response.data));
				sessionStorage.setItem("flag", JSON.stringify(true));
			} catch (error) {
				console.log(error);
			} finally {
				Loader.close();
			}
		}
		if (!JSON.parse(sessionStorage.getItem("flag"))) fetchCountriesData();
		else {
			setCountries(JSON.parse(sessionStorage.getItem("countries")));
			Loader.close();
		}
	}, [data]);

	useEffect(() => {
		if (!borders || borders.length === 0) return;
		async function getCountriesNames() {
			try {
				const response = await axios.get(`/alpha?codes=${borders.join(",")}&fields=name`);
				const names = response.data.map((country) => country.name.common);
				setBordersNames(names);
				sessionStorage.setItem("borders", JSON.stringify(names));
			} catch (error) {
				console.log(error);
			}
		}
		const names = JSON.parse(sessionStorage.getItem("borders"));
		if (!names || names?.length === 0) getCountriesNames();
		else setBordersNames(names);
	}, [borders]);

	function getStates(countryName) {
		Loader.start();
		let data = JSON.stringify({
			country: countryName
		});

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://countriesnow.space/api/v0.1/countries/states",
			headers: {
				"Content-Type": "application/json"
			},
			data: data
		};

		axios
			.request(config)
			.then((response) => {
				console.log(response.data);

				navigate("/states", { state: { states: response.data, countryName } });
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				Loader.close();
			});
	}
	function getPopoulation(countryName) {
		Loader.start();
		let data = JSON.stringify({
			country: countryName
		});

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://countriesnow.space/api/v0.1/countries/population",
			headers: {
				"Content-Type": "application/json"
			},
			data: data
		};

		axios
			.request(config)
			.then((response) => {
				console.log(response.data);
				navigate("/population", { state: { populations: response.data, countryName } });
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				Loader.close();
			});
	}

	return (
		<div className="country-card-container">
			{countries.length > 0
				? countries.map((country) => (
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
											<strong>Official Name</strong>
										</td>
										<td>{country.name.official}</td>
									</tr>
									<tr>
										<td>
											<strong>Short Name</strong>
										</td>
										<td>{country.fifa || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Internet Domain</strong>
										</td>
										<td>{country?.tld?.join(", ") || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Calling Code</strong>
										</td>
										<td>{country?.idd?.root + country.idd.suffixes?.slice(0, 1).join("") || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Capital</strong>
										</td>
										<td>{country.capital?.join(", ") || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Nationality</strong>
										</td>
										<td>{country?.demonyms?.eng?.f || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Languages</strong>
										</td>
										<td>{Object.values(country.languages || {}).join(", ")}</td>
									</tr>
									<tr>
										<td>
											<strong>Continents</strong>
										</td>
										<td>{country.continents?.join(", ")}</td>
									</tr>
									<tr>
										<td>
											<strong>Region</strong>
										</td>
										<td>{country.region}</td>
									</tr>
									<tr>
										<td>
											<strong>Sub-Region</strong>
										</td>
										<td>{country.subregion}</td>
									</tr>
									<tr>
										<td>
											<strong>UN Member</strong>
										</td>
										<td>{country.unMember ? "Yes" : "No"}</td>
									</tr>
									<tr>
										<td>
											<strong>Land Locked</strong>
										</td>
										<td>{country.landlocked ? "Yes" : "No"}</td>
									</tr>
									<tr>
										<td>
											<strong>Independent</strong>
										</td>
										<td>{country.independent ? "Yes" : "No"}</td>
									</tr>

									<tr>
										<td>
											<strong>Driving Side</strong>
										</td>
										<td>{country.car.side}</td>
									</tr>
									<tr>
										<td>
											<strong>Gini Index</strong>
										</td>
										<td>
											{Object?.keys(country?.gini || {})?.map((key) => country.gini?.[key])} %<li>0 represents perfect equality</li>
											<li>100 represents perfect inequality.</li>
										</td>
									</tr>
									<tr>
										<td>
											<strong>Time Zones</strong>
										</td>
										<td>{country.timezones?.join(", ")}</td>
									</tr>
									<tr>
										<td>
											<strong>Start of Week</strong>
										</td>
										<td>{country.startOfWeek[0].toUpperCase() + country.startOfWeek.slice(1)}</td>
									</tr>
									<tr>
										<td>
											<strong>Postal Code</strong>
										</td>
										<td>{country?.postalCode?.format || "N/A"}</td>
									</tr>
									<tr>
										<td>
											<strong>Currency</strong>
										</td>
										<td>
											{country?.currencies?.[Object.keys(country?.currencies || {})[0]]?.name} ({country?.currencies?.[Object.keys(country?.currencies || {})[0]]?.symbol})
										</td>
									</tr>
									<tr>
										<td>
											<strong>Currency Code</strong>
										</td>
										<td>{country.ccn3}</td>
									</tr>
									<tr>
										<td>
											<strong>Borders</strong>
										</td>
										<td>{bordersNames?.join(", ") || "None"}</td>
									</tr>
									<tr>
										<td>
											<strong>Area</strong>
										</td>
										<td>
											{country.area?.toLocaleString()} KM<sup>2</sup>
										</td>
									</tr>
									<tr>
										<td>
											<strong>Population</strong>
										</td>
										<td>{formatPopulation(country.population)}</td>
									</tr>
									<tr>
										<td>
											<strong>Map</strong>
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
							<br />
							<p style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap" }}>
								<a onClick={() => getStates(country.name.common)}>View {country.name.common}&apos;s states</a>
								<a onClick={() => getPopoulation(country.name.common)}>View {country.name.common}&apos;s Population</a>
							</p>
							<br />
							<button onClick={() => navigate("/")}>Back</button>
						</div>
				  ))
				: Loader.start()}
		</div>
	);
}

export default CountryCard;
