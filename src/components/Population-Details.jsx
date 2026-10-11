import { formatPopulation } from "../utils/format-population";
import PropTypes from "prop-types";
const msgFor = {
	true: "population",
	false: "literacy rate"
};
function formatValue(value, isPopulation) {
	if (value == null) return "not reported";
	if (!isPopulation) return <strong>{value.toFixed(2)}%</strong>;
	return (
		<>
			<strong>{value.toLocaleString()}</strong> ({formatPopulation(value)})
		</>
	);
}

function PopulationDetails({ year, countryName, value, formattedValue }) {
	return (
		<span className="population-info">
			<em>
				In <u>{year}</u>, the {msgFor[formattedValue]} of&nbsp;
				<strong>
					<mark>{countryName}</mark>
				</strong>
				&nbsp; was {formatValue(value, formattedValue)}
			</em>
			.
		</span>
	);
}
PopulationDetails.propTypes = {
	year: PropTypes.string,
	countryName: PropTypes.string,
	value: PropTypes.number,
	formattedValue: PropTypes.bool
};
export default PopulationDetails;
