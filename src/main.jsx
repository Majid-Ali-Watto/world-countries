// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CountryCard from "./Country.jsx";

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

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
