import { useLocation } from "react-router-dom";
import PopulationDetails from "./Population-Details";

function CountryPopulation() {
	const { state: { populations, countryName } = {} } = useLocation();

	// Handle cases where populations might be undefined or empty
	if (!populations || !populations.data || populations.data.populationCounts.length === 0) {
		return <p>No population data available.</p>;
	}

	return (
		<div className="country-states-container">
			{populations.data.populationCounts.map(({ year, value }) => (
				<details
					key={year}
					className="state-details">
					<summary className="state-summary">
						<span>{year}</span>
					</summary>
					<PopulationDetails
						year={year}
						value={value}
						countryName={countryName}
					/>
				</details>
			))}
		</div>
	);
}

export default CountryPopulation;
