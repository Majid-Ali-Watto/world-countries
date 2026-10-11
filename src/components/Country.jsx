import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "circle-loader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { describeError, getCountry, getCountryNames } from "../api/restcountries";
import { getStates } from "../api/countriesnow";
import { getIndicator, LITERACY_RATE, POPULATION } from "../api/worldbank";
import Flag from "./Flag";
import { formatPopulation } from "../utils/format-population";

const yesNo = (value) => (value == null ? "N/A" : value ? "Yes" : "No");
const capitalize = (text) => (text ? text[0].toUpperCase() + text.slice(1) : "N/A");

function detailRows(country, borderNames) {
	const { currency, gini } = country;
	return [
		["Official Name", country.officialName || "N/A"],
		["FIFA Code", country.fifa || "N/A"],
		["Internet Domain", country.tld?.join(", ") || "N/A"],
		["Calling Code", country.callingCode || "N/A"],
		["Capital", country.capital.join(", ") || "N/A"],
		["Nationality", country.demonym || "N/A"],
		["Languages", country.languages?.join(", ") || "N/A"],
		["Continents", country.continents.join(", ") || "N/A"],
		["Region", country.region || "N/A"],
		["Sub-Region", country.subregion || "N/A"],
		["UN Member", yesNo(country.unMember)],
		["Land Locked", yesNo(country.landlocked)],
		["Independent", yesNo(country.independent)],
		["Driving Side", capitalize(country.drivingSide)],
		[
			"Gini Index",
			gini ? (
				<>
					{gini.value} % ({gini.year})
						<small className="hint">0 represents perfect equality, 100 perfect inequality.</small>
				</>
			) : (
				"N/A"
			)
		],
		["Time Zones", country.timezones?.join(", ") || "N/A"],
		["Start of Week", capitalize(country.startOfWeek)],
		["Postal Code", country.postalCode || "N/A"],
		["Currency", currency ? `${currency.name} (${currency.symbol})` : "N/A"],
		["Currency Code", currency?.code || "N/A"],
		["Borders", borderNames.join(", ") || "None"],
		[
			"Area",
			country.area ? (
				<>
					{country.area.toLocaleString()} KM<sup>2</sup>
				</>
			) : (
				"N/A"
			)
		],
		["Population", formatPopulation(country.population)],
		[
			"Map",
			country.mapUrl ? (
				<a
					href={country.mapUrl}
					target="_blank"
					rel="noopener noreferrer">
					View Map
				</a>
			) : (
				"N/A"
			)
		]
	];
}

function CountryCard() {
	const { ccn3 } = useParams();
	const navigate = useNavigate();
	// The list passes its filters along (as a query string) so Back lands on the same filtered view.
	const { state } = useLocation();
	const [country, setCountry] = useState();
	const [borderNames, setBorderNames] = useState([]);
	const [error, setError] = useState();

	useEffect(() => {
		window.scrollTo(0, 0);
		const controller = new AbortController();
		Loader.start();

		(async () => {
			try {
				const data = await getCountry(ccn3, controller.signal);
				setCountry(data);
				setBorderNames(await getCountryNames(data.borders).catch(() => data.borders));
			} catch (err) {
				if (!axios.isCancel(err)) setError(describeError(err, "Could not load this country. Please try again."));
			} finally {
				Loader.close();
			}
		})();

		return () => controller.abort();
	}, [ccn3]);

	// Fetches the data for a sub-page, then opens it; the sub-pages receive it through router state.
	async function openPage(path, load) {
		setError();
		Loader.start();
		try {
			navigate(path, { state: { ...(await load()), countryName: country.name } });
		} catch {
			setError("Could not load that data right now. Please try again.");
		} finally {
			Loader.close();
		}
	}

	const backButton = (
		<button
			className="back-button"
			onClick={() => navigate(`/${state?.from ?? ""}${country ? `#${country.ccn3}` : ""}`)}>
			&larr; Back
		</button>
	);

	if (!country) {
		return error ? (
			<div className="page">
				{backButton}
				<p
					className="alert"
					role="alert">
					{error}
				</p>
			</div>
		) : null;
	}

	return (
		<div className="page">
			{backButton}
			<div className="country-card">
				<div className="flag-coat-container">
					<Flag
						key={country.ccn3}
						flag={country.flag}
						name={country.name}
					/>
				</div>
				<h2>{country.name}</h2>
				<table className="details-table">
					<tbody>
						{detailRows(country, borderNames).map(([label, value]) => (
							<tr key={label}>
								<td>
									<strong>{label}</strong>
								</td>
								<td>{value}</td>
							</tr>
						))}
					</tbody>
				</table>
				{error && (
					<p
						className="alert"
						role="alert">
						{error}
					</p>
				)}
				<div className="actions">
					<button
						className="action-button"
						onClick={() => openPage("/states", async () => ({ states: await getStates(country.name) }))}>
						View {country.name}&apos;s states
					</button>
					<button
						className="action-button"
						onClick={() => openPage("/population", async () => ({ populations: await getIndicator(country.alpha3, POPULATION) }))}>
						View {country.name}&apos;s Population
					</button>
					<button
						className="action-button"
						onClick={() => openPage("/literacy", async () => ({ literacies: await getIndicator(country.alpha3, LITERACY_RATE) }))}>
						View {country.name}&apos;s Literacy Rate
					</button>
				</div>
			</div>
		</div>
	);
}

export default CountryCard;
