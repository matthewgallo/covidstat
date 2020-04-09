import React, { useEffect, useCallback } from 'react';
import PageWrapper from '../PageWrapper/PageWrapper';
import { useStoreon } from 'storeon/react';
import { Link } from 'react-router-dom';
import LeftArrow20 from '@carbon/icons-react/lib/arrow--left/20';
import Download20 from '@carbon/icons-react/lib/download/20';
import { RestApi } from '../../utils/RestApi';
import StatItem from '../StatItem/StatItem';

const ComparePage = ({ history, match }) => {
	const { dispatch, covidDataProperFormat, selectedCountriesToCompare, covidDataVariables } = useStoreon('covidDataProperFormat', 'selectedCountriesToCompare', 'covidDataVariables');

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
					countriesToCompare.push(item);
				}
			})
			if (countriesToCompare.length < 4 && countriesToCompare.length > 1) {
				dispatch('setSelectedCountries', countriesToCompare)
				dispatch('getDataVariables', countriesToCompare);
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
				{selectedCountriesToCompare && selectedCountriesToCompare.length && covidDataVariables && covidDataVariables.length
					? covidDataVariables.map((item, i) => {
						
						return (
							<div className={`c--compare-column c--compare-column-${i}`} key={i}>
								<p className="c--country-name-label">{item.country}</p>
								<StatItem
									statNumber={item?.confirmedCases}
									label={'Confirmed cases'}
									fluctuation={item?.finalConfirmedFluctuation}
									countIncrease={item?.confirmedCaseDifferential}
								/>
								<StatItem
									statNumber={item?.deaths}
									label={'Deaths'}
									fluctuation={item?.finalDeathFluctuation}
									countIncrease={item?.deathDifferential}
								/>
								<StatItem
									statNumber={item?.recovered}
									label={'Recovered'}
									fluctuation={item?.finalRecoveredFluctuation}
									countIncrease={item?.recoveredDifferential}
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