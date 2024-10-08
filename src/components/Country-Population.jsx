import { useLocation } from "react-router-dom";
import PopulationDetails from "./Population-Details";
import { useEffect } from "react";

function CountryPopulation() {
	const { state: { populations } = {} } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	// Handle cases where populations might be undefined or empty
	if (!populations || populations.length === 0) {
		return <p>No population data available.</p>;
	}

	return (
		<div className="country-states-container">
			<p style={{ fontWeight: "bold", padding: "5px", color: "red" }}>Remember: This data is being fetched from World Bank api.</p>
			{populations.map(({ date: year, value, country }) => (
				<details
					key={year}
					className="state-details">
					<summary className="state-summary">
						<span>{year}</span>
					</summary>
					<PopulationDetails
						year={year}
						value={value}
						countryName={country.value}
						formattedValue={true}
					/>
				</details>
			))}
		</div>
	);
}

export default CountryPopulation;
