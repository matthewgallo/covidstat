import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useStoreon } from 'storeon/react';
import { RestApi } from '../../utils/RestApi';
import PageWrapper from '../PageWrapper/PageWrapper';
import StatItem from '../StatItem/StatItem';
import LeftArrow20 from '@carbon/icons-react/lib/arrow--left/20';
import Download20 from '@carbon/icons-react/lib/download/20';
import { SkeletonText } from 'carbon-components-react';
import Heatmap from '../Heatmap/Heatmap';
import { Dropdown } from 'carbon-components-react';
import { chunk } from '../../utils/chunk';

const CountryDetails = props => {
	const { dispatch, covidDataProperFormat, currentSelectedCountry } = useStoreon('covidDataProperFormat', 'currentSelectedCountry');
	const [finalHeatmapData, setFinalHeatmapData] = useState([]);
	const [heatmapType, setHeatmapType] = useState('confirmed');

	
	const fetchData = useCallback(async () => {
		dispatch('covidData/get', await RestApi.get('https://pomber.github.io/covid19/timeseries.json'));
	}, [dispatch]);
	
	const findCurrentSelectedCountry = useCallback(() => {
		const countryURLName = props.match.params.countryFriendlyName.replace(/-/g, ' ');
		const searchValue = countryURLName.toLocaleLowerCase();
		let searchResult = covidDataProperFormat && covidDataProperFormat.filter(country => country.country.toLocaleLowerCase() === searchValue);
		if (!currentSelectedCountry && !covidDataProperFormat) {
			fetchData();
		}
		if (covidDataProperFormat && !currentSelectedCountry) {
			dispatch('setCurrentCountry', searchResult && searchResult.length && searchResult);
		} else if (searchResult && !searchResult.length) {
			props.history.push('/');
		}
	}, [currentSelectedCountry, covidDataProperFormat, fetchData, dispatch, props.match.params.countryFriendlyName, props.history]);


	useEffect(() => {
		// code to run on component mount
		if (currentSelectedCountry) {
			let countryDataset = currentSelectedCountry[0].data;
			const updatedCountryData = setHeatMapView(countryDataset, 'confirmed')
			const countryDataByWeek = chunk(updatedCountryData, 7);
			const finalHeatmapData = countryDataByWeek.map((week, i) => {
				return ({
					bin: i,
					bins: [...week]
				})
			});
			setFinalHeatmapData(finalHeatmapData);
		} else {
			findCurrentSelectedCountry();
		}
	}, [fetchData, findCurrentSelectedCountry, dispatch, props.match.params.countryFriendlyName, props.history, covidDataProperFormat, currentSelectedCountry]);

	const setHeatMapView = (countryDataset, view) => {
		setHeatmapType(view);
		let binCount = 0;
			const updatedCountryData = countryDataset.map((item, i) => {
				const dailyCount = i > 0 ? item[view] - countryDataset[i - 1][view] : item[view];
				if (i % 7 === 0) {
					binCount = 0
				} else {
					binCount = binCount + 150;
				}
				return ({
					...item,
					bin: binCount,
					count: dailyCount,
				});
			});
			return updatedCountryData;
	}

	const countryData = currentSelectedCountry && currentSelectedCountry[0];
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

	const downloadCountryJSON = (event, currentCountry) => {
		event.preventDefault();
		const jsonCountry = {...currentCountry};
		let stringifiedJSON = JSON.stringify(jsonCountry);
        stringifiedJSON = [stringifiedJSON];
        const blob1 = new Blob(stringifiedJSON, { type: "text/plain;charset=utf-8" });
        const isIE = false || !!document.documentMode;
        if (isIE) {
            window.navigator.msSaveBlob(blob1, `${currentCountry && currentCountry[0].country} covid-19 data.json`);
        } else {
            const url = window.URL || window.webkitURL;
            const link = url.createObjectURL(blob1);
            const a = document.createElement("a");
            a.download = `${currentCountry && currentCountry[0].country} covid-19 data.json`;
            a.href = link;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
	}

	const heatmapChange = event => {
		const updatedCountryData = setHeatMapView(currentSelectedCountry[0].data, event.selectedItem.id);
		const countryDataByWeek = chunk(updatedCountryData, 7);
			const finalHeatmapData = countryDataByWeek.map((week, i) => {
				return ({
					bin: i,
					bins: [...week]
				})
			});
			setFinalHeatmapData(finalHeatmapData);
	}

	const heatmapOptions = [
		{
		  id: 'confirmed',
		  category: 'Confirmed'
		},
		{
		  id: 'deaths',
		  category: 'Deaths'
		},
		{
		  id: 'recovered',
		  category: 'Recovered'
		}
	  ];

	return (
		<PageWrapper>
			<h1>{currentSelectedCountry ? currentSelectedCountry[0].country : <SkeletonText style={{ width: '6rem', height: '1.25rem' }} />}</h1>
			{latestData ? <p className="c--last-updated">Last updated {latestDate}</p> : <SkeletonText style={{ width: '6rem', height: '1.25rem' }} />}
			<p className="c--fluctuation-label">&#176; Daily count</p>
			<p className="c--fluctuation-label">* Daily fluctuation</p>
			<div className="c--main-content-container">

				<div className="stat-items-container">
					<StatItem
						statNumber={confirmedCases}
						label={'Confirmed cases'}
						fluctuation={finalConfirmedFluctuation}
						countIncrease={confirmedCaseDifferential}
						activeStatItem={heatmapType === 'confirmed' ? true : false}
						/>
					<StatItem
						statNumber={deaths}
						label={'Deaths'}
						fluctuation={finalDeathFluctuation}
						countIncrease={deathDifferential}
						activeStatItem={heatmapType === 'deaths' ? true : false}
						/>
					<StatItem
						statNumber={recovered}
						label={'Recovered'}
						fluctuation={finalRecoveredFluctuation}
						countIncrease={recoveredDifferential}
						activeStatItem={heatmapType === 'recovered' ? true : false}
					/>
				</div>
				<div className="c--heatmap-container">
					<h3>Heatmap</h3>
					<Dropdown
						ariaLabel="Choose a category"
						disabled={false}
						id="c--heatmap-dropdown"
						itemToString={item => (item ? item.category : "")}
						items={heatmapOptions}
						onChange={event => heatmapChange(event)}
						type="inline"
						initialSelectedItem={heatmapOptions[0]}
						label={heatmapType}
					/>
					<Heatmap data={finalHeatmapData ? finalHeatmapData : []} type={heatmapType} />
				</div>
			</div>
			<Link to={'/'} className="floating-button-link back-home-link">
				<LeftArrow20 />
			</Link>
			{currentSelectedCountry && currentSelectedCountry.length &&
				<Link to={'/'} className="floating-button-link download-button-link" onClick={event => downloadCountryJSON(event, currentSelectedCountry)}>
					<Download20 />
				</Link>
			}
		</PageWrapper>
	);
};

export default CountryDetails;