import { useState } from "react";
import PropTypes from "prop-types";

// Shows the flag image; when it is missing or fails to load, the alt text is shown in its place.
function Flag({ flag, name, lazy = false, compact = false }) {
	const [failed, setFailed] = useState(false);

	if (!flag.svg || failed) {
		return (
			<div
				className="flag flag-placeholder"
				role="img"
				aria-label={flag.alt || `Flag of ${name}`}>
				{!compact && (flag.alt || `No flag available for ${name}`)}
			</div>
		);
	}

	return (
		<img
			src={flag.svg}
			alt={flag.alt || `Flag of ${name}`}
			title={flag.alt}
			className="flag"
			loading={lazy ? "lazy" : "eager"}
			onError={() => setFailed(true)}
		/>
	);
}

Flag.propTypes = {
	flag: PropTypes.shape({ svg: PropTypes.string, alt: PropTypes.string }).isRequired,
	name: PropTypes.string.isRequired,
	lazy: PropTypes.bool,
	compact: PropTypes.bool
};

export default Flag;
