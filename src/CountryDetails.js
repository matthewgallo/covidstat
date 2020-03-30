import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from './redux/commonActions';
import { RestApi } from './utils/RestApi';
import PageWrapper from './PageWrapper';
import StatItem from './StatItem';
import LeftArrow20 from '@carbon/icons-react/lib/arrow--left/20';
import Download20 from '@carbon/icons-react/lib/download/20';
import { SkeletonPlaceholder } from 'carbon-components-react';

const CountryDetails = props => {
	const dispatch = useDispatch();
	const currentCountry = useSelector(state => state['app'] && state['app'].currentSelectedCountry)

	const fetchData = async (countryURLName) => {
		const covidData = await RestApi.get('https://pomber.github.io/covid19/timeseries.json');
		covidData['United States'] = covidData['US'];
		delete covidData['US'];
		const searchValue = countryURLName.toLocaleLowerCase();
		const updatedData = Object.entries(covidData);
		let searchResult = updatedData.filter(country => country[0].toLocaleLowerCase() === searchValue);
		dispatch(updateState('app', {
			currentSelectedCountry: [...searchResult[0]]
		}))
	  }

	useEffect(() => {
		// code to run on component mount
		if (!currentCountry) {
			// console.log('we do not have the data for the selected country.');
			const countryURLName = props.match.params.countryFriendlyName.replace(/-/g, ' ');
			fetchData(countryURLName)
		}
	  }, []);
	// console.log("Current country: ", currentCountry);
	const latestData = currentCountry && currentCountry[1][currentCountry[1].length - 1];
	const yesterdaysData = currentCountry && currentCountry[1][currentCountry[1].length - 2];
	const latestDate = latestData?.date;
	const confirmedCases = latestData?.confirmed;
	const deaths = latestData?.deaths;
	const recovered = latestData?.recovered;
	const yesterdaysConfirmedCases = yesterdaysData?.confirmed;
	const yesterdaysDeaths = yesterdaysData?.deaths;
	const yesterdaysRecovered = yesterdaysData?.recovered;

	const confirmedCaseFluctuation = confirmedCases && yesterdaysConfirmedCases && Math.round(((Number(confirmedCases) / Number(yesterdaysConfirmedCases))*100) - 100);
	const deathFluctuation = deaths && yesterdaysDeaths && Math.round(((Number(deaths) / Number(yesterdaysDeaths))*100) - 100);
	const recoveredFluctuation = recovered && yesterdaysRecovered && Math.round(((Number(recovered) / Number(yesterdaysRecovered))*100) - 100);
	
	const downloadCountryJSON = (event, currentCountry) => {
		event.preventDefault();
		const jsonCountry = {...currentCountry};
		let stringifiedJSON = JSON.stringify(jsonCountry);
        stringifiedJSON = [stringifiedJSON];
        const blob1 = new Blob(stringifiedJSON, { type: "text/plain;charset=utf-8" });
        const isIE = false || !!document.documentMode;
        if (isIE) {
            window.navigator.msSaveBlob(blob1, `${currentCountry && currentCountry[0]} data.json`);
        } else {
            const url = window.URL || window.webkitURL;
            const link = url.createObjectURL(blob1);
            const a = document.createElement("a");
            a.download = `${currentCountry && currentCountry[0]} data.json`;
            a.href = link;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
	}

	return (
		<PageWrapper>
			<h1>{currentCountry ? currentCountry[0] : <SkeletonPlaceholder />}</h1>
			<p className="c--last-updated">Last updated {latestDate ? latestDate : <SkeletonPlaceholder />}</p>
			<p className="c--fluctuation-label">* Represents data fluctuation from previous day</p>
			<div className="stat-items-container">
				<StatItem
					statNumber={confirmedCases}
					label={'Confirmed cases'}
					fluctuation={confirmedCaseFluctuation}
					/>
				<StatItem
					statNumber={deaths}
					label={'Deaths'}
					fluctuation={deathFluctuation}
					/>
				<StatItem
					statNumber={recovered}
					label={'Recovered'}
					fluctuation={recoveredFluctuation}
				/>
			</div>
			<Link to={'/'} className="floating-button-link back-home-link">
				<LeftArrow20 />
			</Link>
			{currentCountry && currentCountry.length &&
				<Link to={'/'} className="floating-button-link download-button-link" onClick={event => downloadCountryJSON(event, currentCountry)}>
					<Download20 />
				</Link>
			}
		</PageWrapper>
	);
};

export default CountryDetails;