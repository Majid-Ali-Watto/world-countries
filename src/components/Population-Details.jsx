import { formatPopulation } from "../utils/format-population";
import PropTypes from "prop-types";
const msgFor = {
	true: "population",
	false: "literacy rate"
};
function PopulationDetails({ year, countryName, value, formattedValue }) {
	return (
		<span className="population-info">
			<em>
				In <u>{year}</u>, the {msgFor[formattedValue]} of&nbsp;
				<strong>
					<mark>{countryName}</mark>
				</strong>
				&nbsp; was {formattedValue && <strong>{value?.toLocaleString()}</strong>} ({formatPopulation(value)})
			</em>
			.
		</span>
	);
}
PopulationDetails.propTypes = {
	year: PropTypes.number,
	countryName: PropTypes.string,
	value: PropTypes.number,
	formattedValue: PropTypes.bool
};
export default PopulationDetails;
