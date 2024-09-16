import { useLocation } from "react-router-dom";
import PopulationDetails from "./Population-Details";
import { useEffect } from "react";

function CountryLiteracy() {
	const { state: { literacies } = {} } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	// Handle cases where literacies might be undefined or empty
	if (!literacies || literacies.length === 0) {
		return <p>No Literacy data available.</p>;
	}

	return (
		<div className="country-states-container">
			<p style={{ fontWeight: "bold", padding: "5px", color: "red" }}>Remember: This data is being fetched from World Bank api.</p>
			{literacies.map(({ date: year, value, country }) => (
				<details
					key={year}
					open={value != null}
					className="state-details">
					<summary className="state-summary">
						<span>{year}</span>
					</summary>
					<PopulationDetails
						year={year}
						value={value}
						countryName={country.value}
						formattedValue={false}
					/>
				</details>
			))}
		</div>
	);
}

export default CountryLiteracy;
