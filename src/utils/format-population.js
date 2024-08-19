export const formatPopulation = (population) => {
	if (!population) return "N/A";
	if (population >= 1_000_000_000) {
		return (population / 1_000_000_000).toFixed(2) + " billion";
	} else if (population >= 1_000_000) {
		return (population / 1_000_000).toFixed(2) + " million";
	} else {
		return population.toLocaleString();
	}
};
