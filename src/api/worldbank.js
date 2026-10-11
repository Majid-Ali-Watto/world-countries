import axios from "axios";

const client = axios.create({ baseURL: "https://api.worldbank.org/v2", timeout: 30000 });

export const POPULATION = "SP.POP.TOTL";
export const LITERACY_RATE = "SE.ADT.LITR.ZS";

// One request is enough: the series is ~65 yearly rows and per_page allows far more.
// Unknown countries get HTTP 200 with an error message instead of a data array, hence the fallback.
export async function getIndicator(alpha3, indicator) {
	const { data } = await client.get(`/country/${alpha3}/indicator/${indicator}`, { params: { format: "json", per_page: 200 } });
	return data[1] ?? [];
}
