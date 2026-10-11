import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function PageHeader({ title }) {
	const navigate = useNavigate();
	return (
		<div className="page-header">
			<button onClick={() => navigate(-1)}>&larr; Back</button>
			<h2>{title}</h2>
		</div>
	);
}

PageHeader.propTypes = {
	title: PropTypes.string.isRequired
};

export default PageHeader;
