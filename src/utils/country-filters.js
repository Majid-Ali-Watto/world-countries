// Filter, sort and option helpers for the country list. Pure functions; the state lives in the URL.

const byNumber = (key, direction) => (a, b) => {
	// Countries without a value always go last, whichever way the sort runs.
	if (a[key] == null || b[key] == null) return (a[key] == null) - (b[key] == null);
	return direction * (a[key] - b[key]);
};

export const SORTS = {
	"name-asc": { label: "Name (A-Z)", compare: (a, b) => a.name.localeCompare(b.name) },
	"name-desc": { label: "Name (Z-A)", compare: (a, b) => b.name.localeCompare(a.name) },
	"population-desc": { label: "Population (high to low)", compare: byNumber("population", -1), needs: "population" },
	"population-asc": { label: "Population (low to high)", compare: byNumber("population", 1), needs: "population" },
	"area-desc": { label: "Area (large to small)", compare: byNumber("area", -1), needs: "area" },
	"area-asc": { label: "Area (small to large)", compare: byNumber("area", 1), needs: "area" }
};

export const DEFAULT_SORT = "name-asc";

export const EMPTY_FILTERS = { q: "", continent: "", region: "", subregion: "", un: "", landlocked: "" };

const matchesText = (country, query) =>
	[country.name, ...country.capital, ...country.continents, country.region, country.subregion].some((value) => value?.toLowerCase().includes(query));

export function filterCountries(countries, { q, continent, region, subregion, un, landlocked }) {
	const query = q.trim().toLowerCase();
	return countries.filter(
		(country) =>
			(!query || matchesText(country, query)) &&
			(!continent || country.continents.includes(continent)) &&
			(!region || country.region === region) &&
			(!subregion || country.subregion === subregion) &&
			(!un || country.unMember === (un === "member")) &&
			(!landlocked || country.landlocked === (landlocked === "yes"))
	);
}

export const sortCountries = (countries, sort) => [...countries].sort((SORTS[sort] ?? SORTS[DEFAULT_SORT]).compare);

const uniqueSorted = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

// Dropdown options come from the data itself; a filter whose data is missing (e.g. no region) gets no options and is hidden.
export function getFilterOptions(countries, { region }) {
	const has = (key) => countries.some((country) => country[key] != null);
	return {
		continents: uniqueSorted(countries.flatMap((country) => country.continents)),
		regions: uniqueSorted(countries.map((country) => country.region)),
		subregions: uniqueSorted(countries.filter((country) => !region || country.region === region).map((country) => country.subregion)),
		hasUn: has("unMember"),
		hasLandlocked: has("landlocked"),
		sorts: Object.entries(SORTS)
			.filter(([, { needs }]) => !needs || has(needs))
			.map(([value, { label }]) => ({ value, label }))
	};
}

export const countActiveFilters = (filters) => Object.entries(filters).filter(([key, value]) => key !== "q" && value).length;
