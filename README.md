# World Atlas

## Overview

World Atlas is a comprehensive web application designed to provide detailed insights into countries, states, cities, and population data worldwide. The application allows users to explore demographic trends, geographic information, and various statistics about different regions.

## Features

- **Browse & filter**: Search by country, capital or region; filter by continent, region, subregion, UN membership and coastline; sort by name, population or area; switch between card and list views. Everything is kept in the URL (e.g. `/?continent=Asia&sort=population-desc&view=list`), so filtered views can be shared and survive opening a country and going back.
- **Country Information**: Access detailed information about countries, including states and cities.
- **State Data**: View state-level data, including population counts and city details.
- **City Insights**: Discover cities within states and explore their information.
- **Population Trends**: Analyze historical population data for countries.


- **Literacy Rate**: Browse adult literacy rates over time (where reported).

## Data sources

| Data | API |
| --- | --- |
| Countries, country details | [REST Countries v5](https://restcountries.com/docs/countries) (API key required) |
| States, cities | [CountriesNow](https://countriesnow.space) |
| Population, literacy rate | [World Bank](https://api.worldbank.org) |

## Setup

```bash
npm install
cp .env.example .env.local   # then add your REST Countries key
npm run dev
```

`npm run dev` does **not** call REST Countries: it serves the sample in `dummy-response.json`, so no key is needed
locally (details pages show "N/A" for fields the sample lacks). The file is only imported on that dev path and
is not part of the production build. To use the real API locally, run `npm run build && npm run preview`.

The REST Countries key (used by production builds) must have this app's hostname (for local development, `localhost`) in its
**CORS allowed origins** (https://restcountries.com/api-keys); the demo key is rejected from browsers.
The key is bundled into the client, so rely on the origin allow-list to protect it.

## Deploy to Netlify

The GitHub Actions workflow deploys the production build to Netlify when code is pushed to `master`, or when the workflow is run manually. Add these repository secrets in **Settings → Secrets and variables → Actions**:

- `NETLIFY_AUTH_TOKEN`: a Netlify personal access token.
- `NETLIFY_SITE_ID`: the site ID from the Netlify site settings.
- `VITE_RESTCOUNTRIES_API_KEY`: the REST Countries API key, configured to allow `worldcountrieslist.netlify.app` as an origin.

The Netlify site should use `dist` as its publish directory. The `public/_redirects` file enables direct navigation to client-side routes.
