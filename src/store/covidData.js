export function covidData (store) {
	// store.on('@init', () => ({
	// 	covidDataProperFormat: [],
	// 	currentSelectedCountry: [],
	// 	searchResults: [],
	// 	selectedCountriesToCompare: []
	// }))

	store.on('updateState', (state = {}, data) => {
		let newState = {
			...state,
		};
		if (data && data.scope && data.data) {
			newState[data.scope] = {
				...newState[data.scope],
				...data.data,
			};
		}
		return newState;
	})
  
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

	store.on('getDataVariables', ({covidDataVariables}, country) => {
		if (country.length > 1) {
			let countryVariables = [];
			country.forEach((item, i) => {
				const countryData = item && item;
				const countryName = item.country;
				const latestData = countryData && countryData.data[countryData && countryData.data.length - 1];
				const yesterdaysData = countryData && countryData.data[countryData.data.length - 2];
				const dayBeforeYesterdaysData = countryData && countryData.data[countryData.data.length - 3];
				const latestDate = latestData?.date;
				const confirmedCases = latestData?.confirmed;
				const deaths = latestData?.deaths;
				const recovered = latestData?.recovered;
				const yesterdaysConfirmedCases = yesterdaysData?.confirmed;
				const yesterdaysDeaths = yesterdaysData?.deaths;
				const yesterdaysRecovered = yesterdaysData?.recovered;
				const dayBeforeYesterdaysConfirmedCases = dayBeforeYesterdaysData?.confirmed;
				const dayBeforeYesterdaysDeaths = dayBeforeYesterdaysData?.deaths;
				const dayBeforeYesterdaysRecovered = dayBeforeYesterdaysData?.recovered;
	
				
				const confirmedCaseDifferential = confirmedCases && yesterdaysConfirmedCases && Math.round(Number(confirmedCases) - Number(yesterdaysConfirmedCases));
				const deathDifferential = deaths && yesterdaysDeaths && Math.round(Number(deaths) - Number(yesterdaysDeaths));
				const recoveredDifferential = recovered && yesterdaysRecovered && Math.round(Number(recovered) - Number(yesterdaysRecovered));
	
				const yesterdayconfirmedCaseDifferential = yesterdaysConfirmedCases && dayBeforeYesterdaysConfirmedCases && Math.round(Number(yesterdaysConfirmedCases) - Number(dayBeforeYesterdaysConfirmedCases));
				const yesterdaydeathDifferential = yesterdaysDeaths && dayBeforeYesterdaysDeaths && Math.round(Number(yesterdaysDeaths) - Number(dayBeforeYesterdaysDeaths));
				const yesterdayrecoveredDifferential = yesterdaysRecovered && dayBeforeYesterdaysRecovered && Math.round(Number(yesterdaysRecovered) - Number(dayBeforeYesterdaysRecovered));
	
				const confirmedCaseFluctuation = confirmedCaseDifferential && yesterdayconfirmedCaseDifferential !== 0 ? Math.round((confirmedCaseDifferential * 100) / yesterdayconfirmedCaseDifferential) : '';
				const finalConfirmedFluctuation = typeof confirmedCaseFluctuation !== 'string' && confirmedCaseFluctuation < 100
					? `-${100 - confirmedCaseFluctuation}`
					: yesterdayconfirmedCaseDifferential === 0 ? `+${confirmedCaseDifferential}` // the previous day was 0, since we can't divide a number by 0 then the fluctuation percentage is the current days differential number
					: `+${confirmedCaseFluctuation - 100}`;
					
				const deathFluctuation = deathDifferential && yesterdaydeathDifferential !== 0 ? Math.round((deathDifferential * 100) / yesterdaydeathDifferential) : '';
				const finalDeathFluctuation = typeof deathFluctuation !== 'string' && deathFluctuation < 100
					? `-${100 - deathFluctuation}`
					: yesterdaydeathDifferential === 0 && deathFluctuation > 100 ? `+${deathDifferential}` // the previous day was 0, since we can't divide a number by 0 then the fluctuation percentage is the current days differential number
					: `+${deathFluctuation - 100}`;
					
				const recoveredFluctuation = recoveredDifferential && yesterdayrecoveredDifferential !== 0 ? Math.round((recoveredDifferential * 100) / yesterdayrecoveredDifferential) : '';
				const finalRecoveredFluctuation = typeof recoveredFluctuation !== 'string' && recoveredFluctuation < 100
					? `-${100 - recoveredFluctuation}`
					: yesterdayrecoveredDifferential === 0 ? `+${recoveredDifferential}` // the previous day was 0, since we can't divide a number by 0 then the fluctuation percentage is the current days differential number
					: `+${recoveredFluctuation - 100}`;
					const countryVariable = {
						index: i,
						countryName,
						latestDate,
						confirmedCases,
						finalConfirmedFluctuation,
						confirmedCaseDifferential,
						deaths,
						finalDeathFluctuation,
						deathDifferential,
						recovered,
						finalRecoveredFluctuation,
						recoveredDifferential
					}
					countryVariables.push(countryVariable);
				});
				return {
					covidDataVariables: countryVariables
				};
		} else {
			const countryData = country && country[0];
			const latestData = countryData && countryData.data[countryData && countryData.data.length - 1];
			const yesterdaysData = countryData && countryData.data[countryData.data.length - 2];
			const dayBeforeYesterdaysData = countryData && countryData.data[countryData.data.length - 3];
			const latestDate = latestData?.date;
			const confirmedCases = latestData?.confirmed;
			const deaths = latestData?.deaths;
			const recovered = latestData?.recovered;
			const yesterdaysConfirmedCases = yesterdaysData?.confirmed;
			const yesterdaysDeaths = yesterdaysData?.deaths;
			const yesterdaysRecovered = yesterdaysData?.recovered;
			const dayBeforeYesterdaysConfirmedCases = dayBeforeYesterdaysData?.confirmed;
			const dayBeforeYesterdaysDeaths = dayBeforeYesterdaysData?.deaths;
			const dayBeforeYesterdaysRecovered = dayBeforeYesterdaysData?.recovered;
	
			
			const confirmedCaseDifferential = confirmedCases && yesterdaysConfirmedCases && Math.round(Number(confirmedCases) - Number(yesterdaysConfirmedCases));
			const deathDifferential = deaths && yesterdaysDeaths && Math.round(Number(deaths) - Number(yesterdaysDeaths));
			const recoveredDifferential = recovered && yesterdaysRecovered && Math.round(Number(recovered) - Number(yesterdaysRecovered));
	
			const yesterdayconfirmedCaseDifferential = yesterdaysConfirmedCases && dayBeforeYesterdaysConfirmedCases && Math.round(Number(yesterdaysConfirmedCases) - Number(dayBeforeYesterdaysConfirmedCases));
			const yesterdaydeathDifferential = yesterdaysDeaths && dayBeforeYesterdaysDeaths && Math.round(Number(yesterdaysDeaths) - Number(dayBeforeYesterdaysDeaths));
			const yesterdayrecoveredDifferential = yesterdaysRecovered && dayBeforeYesterdaysRecovered && Math.round(Number(yesterdaysRecovered) - Number(dayBeforeYesterdaysRecovered));
	
			const confirmedCaseFluctuation = confirmedCaseDifferential && yesterdayconfirmedCaseDifferential !== 0 ? Math.round((confirmedCaseDifferential * 100) / yesterdayconfirmedCaseDifferential) : '';
			const finalConfirmedFluctuation = typeof confirmedCaseFluctuation !== 'string' && confirmedCaseFluctuation < 100
				? `-${100 - confirmedCaseFluctuation}`
				: yesterdayconfirmedCaseDifferential === 0 ? `+${confirmedCaseDifferential}` // the previous day was 0, since we can't divide a number by 0 then the fluctuation percentage is the current days differential number
				: `+${confirmedCaseFluctuation - 100}`;
				
			const deathFluctuation = deathDifferential && yesterdaydeathDifferential !== 0 ? Math.round((deathDifferential * 100) / yesterdaydeathDifferential) : '';
			const finalDeathFluctuation = typeof deathFluctuation !== 'string' && deathFluctuation < 100
				? `-${100 - deathFluctuation}`
				: yesterdaydeathDifferential === 0 && deathFluctuation > 100 ? `+${deathDifferential}` // the previous day was 0, since we can't divide a number by 0 then the fluctuation percentage is the current days differential number
				: `+${deathFluctuation - 100}`;
				
			const recoveredFluctuation = recoveredDifferential && yesterdayrecoveredDifferential !== 0 ? Math.round((recoveredDifferential * 100) / yesterdayrecoveredDifferential) : '';
			const finalRecoveredFluctuation = typeof recoveredFluctuation !== 'string' && recoveredFluctuation < 100
				? `-${100 - recoveredFluctuation}`
				: yesterdayrecoveredDifferential === 0 ? `+${recoveredDifferential}` // the previous day was 0, since we can't divide a number by 0 then the fluctuation percentage is the current days differential number
				: `+${recoveredFluctuation - 100}`;
			return {
				covidDataVariables: {
					latestDate,
					confirmedCases,
					finalConfirmedFluctuation,
					confirmedCaseDifferential,
					deaths,
					finalDeathFluctuation,
					deathDifferential,
					recovered,
					finalRecoveredFluctuation,
					recoveredDifferential
				}
			}
		}
	});
}