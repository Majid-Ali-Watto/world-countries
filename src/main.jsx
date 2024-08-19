// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CountryCard from "./components/Country.jsx";
import axios from "axios";
import { Suspense } from "react";
import Loading from "./components/Loader.jsx";
console.log = function (message) {
	console.info('my log:' ,message);
};
axios.defaults.baseURL = "https://restcountries.com/v3.1";
axios.defaults.timeout = 5000;


const cache = { countries: [] };
const router = createBrowserRouter([
	{
		path: "/",
		element: <App cache={cache} />
	},
	{
		path: "country",
		element: <CountryCard />
	}
]);

createRoot(document.getElementById("root")).render(
	<Suspense fallback={<Loading />}>
		<RouterProvider router={router} />
	</Suspense>
);
