import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Loader } from "./Loader";

function CountryStates() {
	const location = useLocation();
	const states = location.state.states;
	const countryName = location.state.countryName;
	const [cities, setCities] = useState({});
	const abortControllerRef = useRef(null);

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	function getCities(stateName) {
		if (cities[stateName] && cities[stateName].length > 0) return;

		Loader.start();

		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		abortControllerRef.current = new AbortController();
		const signal = abortControllerRef.current.signal;

		const data = JSON.stringify({
			country: countryName,
			state: stateName
		});

		const config = {
			method: "post",
			signal,
			maxBodyLength: Infinity,
			url: "https://countriesnow.space/api/v0.1/countries/state/cities",
			headers: {
				"Content-Type": "application/json"
			},
			data: data
		};

		axios
			.request(config)
			.then((response) => {
				setCities((prevCities) => ({
					...prevCities,
					[stateName]: response.data.data
				}));
			})
			.catch((error) => {
				if (axios.isCancel(error)) {
					console.error("Operation canceled");
				} else {
					console.error("Error fetching cities:", error);
				}
			})
			.finally(() => {
				Loader.close();
			});
	}

	if (states.data.states.length === 0) {
		return <h2>No States Found</h2>;
	}

	return (
		<div className="country-states-container">
			{states.data.states.map((state) => (
				<details
					key={state.state_code}
					className="state-details">
					<summary className="state-summary">
						<span>{state.name}</span>
						<span id="state-code">({state.state_code})</span>
					</summary>
					<a
						className="view-cities-link"
						onClick={() => getCities(state.name)}>
						View Cities
					</a>
					<div className="cities-container">
						{cities[state.name]?.map((city) => (
							<span
								className="city-chip"
								key={city}>
								{city}
							</span>
						))}
						{cities[state.name]?.length === 0 && <p>No Cities Found</p>}
					</div>
				</details>
			))}
		</div>
	);
}

export default CountryStates;
