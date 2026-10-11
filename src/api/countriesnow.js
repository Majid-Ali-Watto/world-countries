import axios from "axios";

// The POST variants now answer with a redirect to these GET endpoints, which loses the request body.
const client = axios.create({ baseURL: "https://countriesnow.space/api/v0.1", timeout: 30000 });

export async function getStates(country) {
	const { data } = await client.get("/countries/states/q", { params: { country } });
	return data.data.states;
}

export async function getCities(country, state, signal) {
	const { data } = await client.get("/countries/state/cities/q", { params: { country, state }, signal });
	return data.data;
}
