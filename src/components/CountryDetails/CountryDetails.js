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
	const { dispatch, covidDataProperFormat, currentSelectedCountry, covidDataVariables } = useStoreon('covidDataProperFormat', 'currentSelectedCountry', 'covidDataVariables');
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
			dispatch('getDataVariables', currentSelectedCountry);
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
			{covidDataVariables ? <p className="c--last-updated">Last updated {covidDataVariables?.latestDate}</p> : <SkeletonText style={{ width: '6rem', height: '1.25rem' }} />}
			<p className="c--fluctuation-label">&#176; Daily count</p>
			<p className="c--fluctuation-label">* Daily fluctuation</p>
			<div className="c--main-content-container">

				<div className="stat-items-container">
					<StatItem
						statNumber={covidDataVariables?.confirmedCases}
						label={'Confirmed cases'}
						fluctuation={covidDataVariables?.finalConfirmedFluctuation}
						countIncrease={covidDataVariables?.confirmedCaseDifferential}
						activeStatItem={heatmapType === 'confirmed' ? true : false}
						/>
					<StatItem
						statNumber={covidDataVariables?.deaths}
						label={'Deaths'}
						fluctuation={covidDataVariables?.finalDeathFluctuation}
						countIncrease={covidDataVariables?.deathDifferential}
						activeStatItem={heatmapType === 'deaths' ? true : false}
						/>
					<StatItem
						statNumber={covidDataVariables?.recovered}
						label={'Recovered'}
						fluctuation={covidDataVariables?.finalRecoveredFluctuation}
						countIncrease={covidDataVariables?.recoveredDifferential}
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