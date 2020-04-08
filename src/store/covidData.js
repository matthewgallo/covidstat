export function covidData (store) {
	// store.on('@init', () => ({
	// 	covidDataProperFormat: [],
	// 	currentSelectedCountry: [],
	// 	searchResults: [],
	// 	selectedCountriesToCompare: []
	// }))
  
	store.on('covidData/get', ({ covidDataProperFormat }, data) => {
		data['United States'] = data['US'];
		delete data['US'];
		const mutatedData = Object.entries(data);
		const properFormat = mutatedData.map(dataItem => { 
			return { 
			country: dataItem[0], 
			data: dataItem[1] 
			}; 
		});

		return { covidDataProperFormat: properFormat }
	});

	store.on('setCurrentCountry', ({currentSelectedCountry}, data) => {
		let newCountry = [...data];
		return {
			currentSelectedCountry: newCountry
		}
	});

	store.on('setSearchResults', ({searchResults}, data) => {
		return {
			searchResults: data
		}
	});

	store.on('setSelectedCountries', ({selectedCountriesToCompare}, data) => {
		return {
			selectedCountriesToCompare: data
		}
	});
}