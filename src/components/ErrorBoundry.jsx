import  { Component } from "react";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render shows the fallback UI
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// Log the error or send it to an error reporting service
		console.error("Error caught in ErrorBoundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// Fallback UI when an error occurs
			return (
				<div className="error-boundary">
					<h1>Something went wrong.</h1>
					<p>We're sorry for the inconvenience. Please try refreshing the page if the problem persists.</p>
				</div>
			);
		}

		// Render children if no error is caught
		return this.props.children;
	}
}

export default ErrorBoundary;
