import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Loader } from "circle-loader";
import { describeError, getCountries } from "./api/restcountries";
import CountryFilters from "./components/Country-Filters";
import CountryList from "./components/Country-List";
import { countActiveFilters, DEFAULT_SORT, EMPTY_FILTERS, filterCountries, getFilterOptions, SORTS, sortCountries } from "./utils/country-filters";

const VIEWS = [
	{ value: "cards", label: "Cards" },
	{ value: "list", label: "List" }
];

function App() {
	const [countries, setCountries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const { hash } = useLocation();
	// Filters, sort and view live in the URL so they survive opening a country and coming back, and can be shared.
	const [params, setParams] = useSearchParams();

	const filters = useMemo(() => Object.fromEntries(Object.keys(EMPTY_FILTERS).map((key) => [key, params.get(key) ?? ""])), [params]);
	const sort = SORTS[params.get("sort")] ? params.get("sort") : DEFAULT_SORT;
	const view = params.get("view") === "list" ? "list" : "cards";

	function updateParams(changes) {
		setParams(
			(previous) => {
				const next = new URLSearchParams(previous);
				for (const [key, value] of Object.entries(changes)) {
					if (value) next.set(key, value);
					else next.delete(key);
				}
				return next;
			},
			{ replace: true }
		);
	}

	useEffect(() => {
		getCountries()
			.then(setCountries)
			.catch((err) => setError(describeError(err, "Could not load countries. Please check your connection and refresh the page.")))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (loading) {
			Loader.start();
			return;
		}
		Loader.close();
		// Coming back from a country page: scroll to the card that was opened.
		const card = hash && document.getElementById(hash.slice(1));
		if (card) card.scrollIntoView({ block: "nearest" });
		else window.scrollTo(0, 0);
	}, [loading, hash]);

	const options = useMemo(() => getFilterOptions(countries, filters), [countries, filters]);
	const visibleCountries = useMemo(() => sortCountries(filterCountries(countries, filters), sort), [countries, filters, sort]);
	const activeCount = countActiveFilters(filters);

	return (
		<>
			<header className="app-header">
				<abbr title="Explore Countries, States, Cities, and Population Insights">
					<h2 id="header-title">World Atlas</h2>
				</abbr>
				<div className="search-container">
					<input
						type="search"
						aria-label="Search countries"
						placeholder="Search by country, capital or region..."
						value={filters.q}
						onChange={(e) => updateParams({ q: e.target.value })}
						className="search-bar"
					/>
				</div>
			</header>
			<main className="listing">
				{error && (
					<p
						className="alert"
						role="alert">
						{error}
					</p>
				)}
				{!loading && !error && (
					<>
						<CountryFilters
							filters={filters}
							sort={sort}
							options={options}
							activeCount={activeCount}
							onChange={updateParams}
							onReset={() => updateParams({ ...EMPTY_FILTERS, sort: "" })}
						/>
						<div className="results-bar">
							<p
								aria-live="polite"
								className="result-count">
								Showing {visibleCountries.length} of {countries.length} countries
							</p>
							<div
								className="view-toggle"
								role="group"
								aria-label="View">
								{VIEWS.map(({ value, label }) => (
									<button
										key={value}
										aria-pressed={view === value}
										onClick={() => updateParams({ view: value === "cards" ? "" : value })}>
										{label}
									</button>
								))}
							</div>
						</div>
						{visibleCountries.length > 0 ? (
							<CountryList
								countries={visibleCountries}
								view={view}
							/>
						) : (
							<p className="empty">No countries match your search and filters.</p>
						)}
					</>
				)}
			</main>
		</>
	);
}

export default App;
