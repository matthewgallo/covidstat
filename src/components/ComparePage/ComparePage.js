import React, { useEffect, useCallback } from 'react';
import PageWrapper from '../PageWrapper/PageWrapper';
import { useStoreon } from 'storeon/react';
import { Link } from 'react-router-dom';
import LeftArrow20 from '@carbon/icons-react/lib/arrow--left/20';
import Download20 from '@carbon/icons-react/lib/download/20';
import { RestApi } from '../../utils/RestApi';
import StatItem from '../StatItem/StatItem';

const ComparePage = ({ history, match }) => {
	const { dispatch, covidDataProperFormat, selectedCountriesToCompare } = useStoreon('covidDataProperFormat', 'selectedCountriesToCompare');

	const fetchData = useCallback(async () => {
		dispatch('covidData/get', await RestApi.get('https://pomber.github.io/covid19/timeseries.json'));
	}, [dispatch])

	const getSelectedCountries = useCallback(countryParamsArray => {
		let countriesToCompare = [];
		if (!covidDataProperFormat) {
			fetchData();
		} else {
			covidDataProperFormat && covidDataProperFormat.forEach(item => {
				if (countryParamsArray.includes(item.country.toLowerCase())) {
					// updatedData.filter(country => country[0].toLocaleLowerCase() === searchValue);
					countriesToCompare.push(item);
				}
			})
			if (countriesToCompare.length < 4 && countriesToCompare.length > 1) {
				dispatch('setSelectedCountries', countriesToCompare)
			} else {
				history.push('/');
			}
		}
	}, [covidDataProperFormat, dispatch, history, fetchData])
	
	useEffect(() => {
		// code to run on component mount
		const countryParams = match.params.countriesToCompare.split("+").join(",").replace(/-/g, ' ');
		const countryParamsArray = countryParams.split(',');
		getSelectedCountries(countryParamsArray);
	  }, [getSelectedCountries, match.params.countriesToCompare, covidDataProperFormat]);

	  const arrayToObject = (array, keyField) =>
		array.reduce((obj, item) => {
			obj[item[keyField]] = item
			return obj
		}, {});

	  const downloadCountryJSON = (event, currentCountries) => {
		event.preventDefault();
		const objectCountries = arrayToObject(currentCountries, 'country');
		let stringifiedJSON = JSON.stringify(objectCountries);
		stringifiedJSON = [stringifiedJSON];
        const blob1 = new Blob(stringifiedJSON, { type: "text/plain;charset=utf-8" });
		const isIE = false || !!document.documentMode;
        if (isIE) {
            window.navigator.msSaveBlob(blob1, `data.json`);
        } else {
            const url = window.URL || window.webkitURL;
            const link = url.createObjectURL(blob1);
            const a = document.createElement("a");
            a.download = `data.json`;
            a.href = link;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
	}

	const latestDate = selectedCountriesToCompare?.length && selectedCountriesToCompare[0].data[selectedCountriesToCompare[0].data.length - 1].date;
	return (
		<PageWrapper classProp="compare-page-wrapper">
			<h1>Compare</h1>
			<p className="c--last-updated">Last updated {latestDate ? latestDate : ''}</p>
			<p className="c--fluctuation-label">&#176; Daily count</p>
			<p className="c--fluctuation-label">* Daily fluctuation</p>
			<div className={`stat-items-container ${selectedCountriesToCompare?.length === 2 ? 'stat-items-container-mobile-2' : 'stat-items-container-mobile-3'}`}
			>
				{selectedCountriesToCompare && selectedCountriesToCompare.length
					? selectedCountriesToCompare.map((item, i) => {
						const latestData = item && item.data[item && item.data.length - 1];
						const yesterdaysData = item && item.data[item.data.length - 2];
						const dayBeforeYesterdaysData = item && item.data[item.data.length - 3];
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
						return (
							<div className={`c--compare-column c--compare-column-${i}`} key={i}>
								<p className="c--country-name-label">{item.country}</p>
								<StatItem
									statNumber={confirmedCases}
									label={'Confirmed cases'}
									fluctuation={finalConfirmedFluctuation}
									countIncrease={confirmedCaseDifferential}
								/>
								<StatItem
									statNumber={deaths}
									label={'Deaths'}
									fluctuation={finalDeathFluctuation}
									countIncrease={deathDifferential}
								/>
								<StatItem
									statNumber={recovered}
									label={'Recovered'}
									fluctuation={finalRecoveredFluctuation}
									countIncrease={recoveredDifferential}
								/>
							</div>
						)
					})
					: ''
				}
			</div>
			<Link to={'/'} className="floating-button-link back-home-link">
				<LeftArrow20 />
			</Link>
			{selectedCountriesToCompare && selectedCountriesToCompare.length &&
				<Link to={'/'} className="floating-button-link download-button-link" onClick={event => downloadCountryJSON(event, selectedCountriesToCompare)}>
					<Download20 />
				</Link>
			}
		</PageWrapper>
	);
};

export default ComparePage;