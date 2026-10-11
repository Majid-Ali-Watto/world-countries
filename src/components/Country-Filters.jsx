import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function Select({ label, value, onChange, options, emptyLabel }) {
	return (
		<label className="filter">
			<span>{label}</span>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}>
				{emptyLabel && <option value="">{emptyLabel}</option>}
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</label>
	);
}

Select.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })).isRequired,
	emptyLabel: PropTypes.string
};

const toOptions = (values) => values.map((value) => ({ value, label: value }));

function CountryFilters({ filters, sort, options, activeCount, onChange, onReset }) {
	// Only matters on small screens, where the dropdowns are collapsed; open from the start when filters are already applied.
	const [expanded, setExpanded] = useState(activeCount > 0);
	const chipsRef = useRef(null);

	// On phones the chips scroll sideways; keep the selected one in view (e.g. after opening a shared link).
	useEffect(() => {
		chipsRef.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ inline: "center", block: "nearest" });
	}, [filters.continent]);

	return (
		<div className="filters">
			<div
				ref={chipsRef}
				className="chips"
				role="group"
				aria-label="Continent">
				{["", ...options.continents].map((continent) => (
					<button
						key={continent || "all"}
						className="chip"
						aria-pressed={filters.continent === continent}
						onClick={() => onChange({ continent })}>
						{continent || "All continents"}
					</button>
				))}
			</div>
			<button
				className="filters-toggle"
				aria-expanded={expanded}
				aria-controls="filter-row"
				onClick={() => setExpanded((open) => !open)}>
				{expanded ? "Hide filters & sort" : "Filters & sort"}
				{activeCount > 0 && ` (${activeCount})`}
			</button>
			<div
				id="filter-row"
				className={`filter-row${expanded ? " expanded" : ""}`}>
				{options.regions.length > 0 && (
					<Select
						label="Region"
						value={filters.region}
						// A subregion belongs to one region, so changing the region clears it.
						onChange={(region) => onChange({ region, subregion: "" })}
						options={toOptions(options.regions)}
						emptyLabel="All regions"
					/>
				)}
				{options.subregions.length > 0 && (
					<Select
						label="Subregion"
						value={filters.subregion}
						onChange={(subregion) => onChange({ subregion })}
						options={toOptions(options.subregions)}
						emptyLabel="All subregions"
					/>
				)}
				{options.hasUn && (
					<Select
						label="UN membership"
						value={filters.un}
						onChange={(un) => onChange({ un })}
						options={[
							{ value: "member", label: "UN members" },
							{ value: "non-member", label: "Non-members" }
						]}
						emptyLabel="Any"
					/>
				)}
				{options.hasLandlocked && (
					<Select
						label="Coastline"
						value={filters.landlocked}
						onChange={(landlocked) => onChange({ landlocked })}
						options={[
							{ value: "no", label: "Has a coast" },
							{ value: "yes", label: "Landlocked" }
						]}
						emptyLabel="Any"
					/>
				)}
				<Select
					label="Sort by"
					value={sort}
					onChange={(value) => onChange({ sort: value })}
					options={options.sorts}
				/>
				{(activeCount > 0 || filters.q) && (
					<button
						className="reset-button"
						onClick={onReset}>
						Clear filters
					</button>
				)}
			</div>
		</div>
	);
}

CountryFilters.propTypes = {
	filters: PropTypes.shape({
		q: PropTypes.string,
		continent: PropTypes.string,
		region: PropTypes.string,
		subregion: PropTypes.string,
		un: PropTypes.string,
		landlocked: PropTypes.string
	}).isRequired,
	sort: PropTypes.string.isRequired,
	options: PropTypes.shape({
		continents: PropTypes.arrayOf(PropTypes.string).isRequired,
		regions: PropTypes.arrayOf(PropTypes.string).isRequired,
		subregions: PropTypes.arrayOf(PropTypes.string).isRequired,
		hasUn: PropTypes.bool.isRequired,
		hasLandlocked: PropTypes.bool.isRequired,
		sorts: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })).isRequired
	}).isRequired,
	activeCount: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	onReset: PropTypes.func.isRequired
};

export default CountryFilters;
