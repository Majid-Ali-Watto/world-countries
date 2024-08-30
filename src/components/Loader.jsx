// class Loader {
// 	static start() {
// 		// Check if the loader is already in the DOM
// 		if (!document.querySelector(".loading-overlay")) {
// 			// Create the loader container
// 			const loaderContainer = document.createElement("div");
// 			loaderContainer.innerHTML = `
//         <div class="loading-container loading-overlay">
//           <div class="loading-spinner"></div>
//           <p>Loading...</p>
//         </div>
//       `;
// 			// Append it to the body or a specific container
// 			document.body.appendChild(loaderContainer);
// 			console.log("Loading started");
// 		}
// 	}

// 	static close() {
// 		// Find and remove the loader from the DOM
// 		const loader = document.querySelector(".loading-overlay");
// 		if (loader) {
// 			loader.remove();
// 			console.log("Loading stopped");
// 		}
// 	}
// }

// export { Loader };
