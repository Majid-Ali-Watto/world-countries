// Loading.js
import "./Loading.css"; // You can style your loader here
const Loading = () => {
	return (
		<div className="loading-container">
			<div className="loading-spinner"></div>
			<p>Loading...</p>
		</div>
	);
};

export default Loading;
