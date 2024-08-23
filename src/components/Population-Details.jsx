import { formatPopulation } from "../utils/format-population";
import PropTypes from "prop-types";
function PopulationDetails({ year, countryName, value }) {
	return (
		<span className="population-info">
			<em>
				In <u>{year}</u>, the population of&nbsp;
				<strong>
					<mark>{countryName}</mark>
				</strong>
				&nbsp; was <strong>{value?.toLocaleString()}</strong> ({formatPopulation(value)})
			</em>
			.
		</span>
	);
}
PopulationDetails.propTypes = {
	year: PropTypes.number,
	countryName: PropTypes.string,
	value: PropTypes.number
};
export default PopulationDetails;
