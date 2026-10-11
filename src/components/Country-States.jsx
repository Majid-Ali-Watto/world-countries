import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader } from "circle-loader";
import { getCities } from "../api/countriesnow";
import PageHeader from "./Page-Header";

function CountryStates() {
	const { state } = useLocation();
	const [cities, setCities] = useState({});
	const [failedState, setFailedState] = useState();
	const abortControllerRef = useRef(null);

	useEffect(() => {
		window.scrollTo(0, 0);
		return () => abortControllerRef.current?.abort();
	}, []);

	// The data is passed through router state, so a refresh or direct visit has nothing to show.
	if (!state?.states) return <Navigate to="/" replace />;
	const { states, countryName } = state;

	async function loadCities(stateName) {
		if (cities[stateName]?.length > 0) return;

		abortControllerRef.current?.abort();
		abortControllerRef.current = new AbortController();
		setFailedState();
		Loader.start();

		try {
			const stateCities = await getCities(countryName, stateName, abortControllerRef.current.signal);
			setCities((prevCities) => ({ ...prevCities, [stateName]: stateCities }));
		} catch (error) {
			if (!axios.isCancel(error)) setFailedState(stateName);
		} finally {
			Loader.close();
		}
	}

	return (
		<div className="page">
			<PageHeader title={`${countryName}: States`} />
			{states.length === 0 ? <p>No States Found</p> : (
				<div className="country-states-container">
					{states.map((state) => (
						<details
							key={state.name}
							className="state-details">
							<summary className="state-summary">
								<span>{state.name}</span>
								{state.state_code && <span id="state-code">({state.state_code})</span>}
							</summary>
							<button
								className="link-button view-cities-link"
								onClick={() => loadCities(state.name)}>
								View Cities
							</button>
							<div className="cities-container">
								{cities[state.name]?.map((city) => (
									<span
										className="city-chip"
										key={city}>
										{city}
									</span>
								))}
								{cities[state.name]?.length === 0 && <p>No Cities Found</p>}
								{failedState === state.name && (
									<p
										className="alert"
										role="alert">
										Could not load cities. Please try again.
									</p>
								)}
							</div>
						</details>
					))}
				</div>
			)}
		</div>
	);
}

export default CountryStates;
