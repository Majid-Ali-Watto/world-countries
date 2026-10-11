import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundry.jsx";
// import 'circle-loader/dist/bundle.css'
const CountryCard = lazy(() => import("./components/Country.jsx"));
const CountryPopulation = lazy(() => import("./components/Country-Population.jsx"));
const CountryLiteracy = lazy(() => import("./components/Country-Literacy.jsx"));
const CountryStates = lazy(() => import("./components/Country-States.jsx"));

const withBoundary = (element) => <ErrorBoundary>{element}</ErrorBoundary>;

const router = createBrowserRouter([
	{ path: "/", element: withBoundary(<App />) },
	{ path: "country/:ccn3", element: withBoundary(<CountryCard />) },
	{ path: "states", element: withBoundary(<CountryStates />) },
	{ path: "population", element: withBoundary(<CountryPopulation />) },
	{ path: "literacy", element: withBoundary(<CountryLiteracy />) }
]);

createRoot(document.getElementById("root")).render(
	<Suspense fallback={<div>Loading...</div>}>
		<RouterProvider router={router} />
	</Suspense>
);
