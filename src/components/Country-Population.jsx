import { Navigate, useLocation } from "react-router-dom";
import PopulationDetails from "./Population-Details";
import PageHeader from "./Page-Header";
import { useEffect } from "react";

function CountryPopulation() {
	const { state } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	// The data is passed through router state, so a refresh or direct visit has nothing to show.
	if (!state?.populations) return <Navigate to="/" replace />;
	const { populations, countryName } = state;

	return (
		<div className="page">
			<PageHeader title={`${countryName}: Population`} />
			{populations.length === 0 ? (
				<p>No population data available.</p>
			) : (
				<div className="country-states-container">
					<p className="note">This data is fetched from the World Bank API.</p>
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
			)}
		</div>
	);
}

export default CountryPopulation;
