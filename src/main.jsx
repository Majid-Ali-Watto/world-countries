import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundry.jsx";
// import 'circle-loader/dist/bundle.css'
const CountryCard = lazy(() => import("./components/Country.jsx"));
const CountryPopulation = lazy(() => import("./components/Country-Population.jsx"));
const CountryStates = lazy(() => import("./components/Country-States.jsx"));

axios.defaults.baseURL = "https://restcountries.com/v3.1";
axios.defaults.timeout = 30000;

console.log = function (...args) {
	console.info(...args);
};
console.error = function () {};

sessionStorage.clear();

const cache = { countries: [], state: "" };

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ErrorBoundary>
				<App cache={cache} />
			</ErrorBoundary>
		)
	},
	{
		path: "country",
		element: (
			<ErrorBoundary>
				<CountryCard />
			</ErrorBoundary>
		)
	},
	{
		path: "states",
		element: (
			<ErrorBoundary>
				<CountryStates />
			</ErrorBoundary>
		)
	},
	{
		path: "population",
		element: (
			<ErrorBoundary>
				<CountryPopulation />
			</ErrorBoundary>
		)
	}
]);

createRoot(document.getElementById("root")).render(
	<Suspense fallback={<div>Loading...</div>}>
		<RouterProvider router={router} />
	</Suspense>
);
