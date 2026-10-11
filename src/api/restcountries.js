import axios from "axios";

// v3.1 is retired; v5 needs an API key (https://restcountries.com/sign-up) whose allowed origins
// include the hostname this app is served from (the demo key is rejected from browsers).
const client = axios.create({
	baseURL: "https://api.restcountries.com/countries/v5",
	timeout: 30000,
	headers: { Authorization: `Bearer ${import.meta.env.VITE_RESTCOUNTRIES_API_KEY}` }
});

const PAGE_SIZE = 100; // maximum allowed on the free plan
const SUMMARY_FIELDS = "names.common,codes.alpha_3,codes.ccn3,capitals,continents,flag.url_svg,flag.description,region,subregion,population,area.kilometers,classification.un_member,landlocked";

const toSummary = (c) => ({
	name: c.names.common,
	ccn3: c.codes.ccn3,
	alpha3: c.codes.alpha_3,
	capital: (c.capitals ?? []).map(({ name }) => name),
	continents: c.continents ?? [],
	flag: { svg: c.flag.url_svg, alt: c.flag.description },
	region: c.region,
	subregion: c.subregion,
	population: c.population,
	area: c.area?.kilometers,
	unMember: c.classification?.un_member,
	landlocked: c.landlocked
});

const latestValue = (seriesByYear = {}) => {
	const latestYear = Object.keys(seriesByYear).sort().at(-1);
	return latestYear && { year: latestYear, value: seriesByYear[latestYear] };
};

const toDetail = (c) => ({
	...toSummary(c),
	officialName: c.names.official,
	fifa: c.codes.fifa,
	tld: c.tlds,
	callingCode: c.calling_codes?.[0] && `+${c.calling_codes[0]}`,
	demonym: c.demonyms?.eng?.f,
	languages: c.languages?.map(({ name }) => name),
	independent: c.classification?.sovereign,
	drivingSide: c.cars?.driving_side,
	gini: latestValue(c.economy?.gini_coefficient),
	timezones: c.timezones,
	startOfWeek: c.date?.start_of_week,
	postalCode: c.postal_code?.format,
	currency: c.currencies?.[0],
	borders: c.borders ?? [],
	mapUrl: c.links?.open_street_maps
});

// Local development (`npm run dev`) serves dummy-response.json instead of calling the API, so no key is needed.
// import.meta.env.DEV is statically `false` in production builds, which drops these branches together with
// the JSON file; it is therefore never part of the build output.
async function loadDummyCountries() {
	const { default: dummy } = await import("../../dummy-response.json");
	return dummy.data.objects;
}

async function fetchPage(offset) {
	if (import.meta.env.DEV) return (await loadDummyCountries()).slice(offset, offset + PAGE_SIZE);
	const { data } = await client.get("", { params: { limit: PAGE_SIZE, offset, response_fields: SUMMARY_FIELDS } });
	return data.data.objects;
}

async function fetchAllCountries() {
	const countries = [];
	for (let offset = 0; ; offset += PAGE_SIZE) {
		const page = await fetchPage(offset);
		countries.push(...page.map(toSummary));
		if (page.length < PAGE_SIZE) break;
	}
	return countries.sort((a, b) => a.name.localeCompare(b.name));
}

let countriesRequest;

// The full list is fetched once per page load and shared (also used to resolve border names).
export function getCountries() {
	countriesRequest ??= fetchAllCountries().catch((error) => {
		countriesRequest = undefined;
		throw error;
	});
	return countriesRequest;
}

export function describeError(error, fallback) {
	const status = error.response?.status;
	return status === 401 || status === 403 ? "The countries API rejected the request. Check VITE_RESTCOUNTRIES_API_KEY and that this site's origin is allowed for the key." : fallback;
}

async function fetchByCcn3(ccn3, signal) {
	// The dummy file only holds list-level fields, so the details page shows "N/A" for the rest.
	if (import.meta.env.DEV) return (await loadDummyCountries()).filter((c) => c.codes.ccn3 === ccn3);
	const { data } = await client.get(`/codes.ccn3/${encodeURIComponent(ccn3)}`, { signal });
	return data.data.objects;
}

export async function getCountry(ccn3, signal) {
	const [country] = await fetchByCcn3(ccn3, signal);
	if (!country) throw new Error(`Country ${ccn3} not found`);
	return toDetail(country);
}

export async function getCountryNames(alpha3Codes) {
	const countries = await getCountries();
	return alpha3Codes.map((code) => countries.find((c) => c.alpha3 === code)?.name ?? code);
}
