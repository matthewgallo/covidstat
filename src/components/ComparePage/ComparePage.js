import React, { useEffect } from 'react';
import PageWrapper from '../PageWrapper/PageWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LeftArrow20 from '@carbon/icons-react/lib/arrow--left/20';
import Download20 from '@carbon/icons-react/lib/download/20';
import { RestApi } from '../../utils/RestApi';
import { updateState } from '../../redux/commonActions';
import StatItem from '../StatItem/StatItem';
import { SkeletonText } from 'carbon-components-react';

const ComparePage = ({ history, match }) => {

	const dispatch = useDispatch();
	const selectedCountriesToCompare = useSelector(state => state['app'] && state['app'].selectedCountriesToCompare);

	
	useEffect(() => {
		const fetchData = async (countryParamsArray) => {
			const covidData = await RestApi.get('https://pomber.github.io/covid19/timeseries.json');
			covidData['United States'] = covidData['US'];
			delete covidData['US'];
			const mutatedData = Object.entries(covidData);
			const covidDataProperFormat = mutatedData.map(dataItem => { 
				return { 
					country: dataItem[0], 
					data: dataItem[1] 
				}; 
			});
	
			let countriesToCompare = [];
			covidDataProperFormat.forEach(item => {
				if (countryParamsArray.includes(item.country.toLowerCase())) {
					// updatedData.filter(country => country[0].toLocaleLowerCase() === searchValue);
					countriesToCompare.push(item);
				}
			})
			if (countriesToCompare.length) {
				dispatch(updateState('app', {
					selectedCountriesToCompare: countriesToCompare
				}))
			} else {
				history.push('/');
			}
	
		}
		// code to run on component mount
		if (!selectedCountriesToCompare) {
			const countryParams = match.params.countriesToCompare.split("+").join(",").replace(/-/g, ' ');
			const countryParamsArray = countryParams.split(',');
			fetchData(countryParamsArray)
		}
	  }, [dispatch, history, match, selectedCountriesToCompare]);

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
	// let latestDate;
	return (
		<PageWrapper classProp="compare-page-wrapper">
			<h1>Compare</h1>
			<p className="c--last-updated">Last updated {latestDate ? latestDate : <SkeletonText />}</p>
			<p className="c--fluctuation-label">&#176; Daily increase (count)</p>
			<p className="c--fluctuation-label">* Daily increase (percent)</p>
			<div className="stat-items-container">
				{selectedCountriesToCompare && selectedCountriesToCompare.length
					? selectedCountriesToCompare.map((item, i) => {
						const latestCountryData = item.data[item.data.length - 1];
						const yesterdaysData = item.data[item.data.length - 2];
						const confirmedCases = latestCountryData?.confirmed;
						const deaths = latestCountryData?.deaths;
						const recovered = latestCountryData?.recovered;
						const yesterdaysConfirmedCases = yesterdaysData?.confirmed;
						const yesterdaysDeaths = yesterdaysData?.deaths;
						const yesterdaysRecovered = yesterdaysData?.recovered;
						const confirmedCaseFluctuation = confirmedCases && yesterdaysConfirmedCases && Math.round(((Number(confirmedCases) / Number(yesterdaysConfirmedCases))*100) - 100);
						const deathFluctuation = deaths && yesterdaysDeaths && Math.round(((Number(deaths) / Number(yesterdaysDeaths))*100) - 100);
						const recoveredFluctuation = recovered && yesterdaysRecovered && Math.round(((Number(recovered) / Number(yesterdaysRecovered))*100) - 100);
						
						const confirmedCaseDifferential = confirmedCases && yesterdaysConfirmedCases && Math.round(Number(confirmedCases) - Number(yesterdaysConfirmedCases));
						const deathDifferential = deaths && yesterdaysDeaths && Math.round(Number(deaths) - Number(yesterdaysDeaths));
						const recoveredDifferential = recovered && yesterdaysRecovered && Math.round(Number(recovered) - Number(yesterdaysRecovered));
						return (
							<div className={`c--compare-column c--compare-column-${i}`}>
								<p className="c--country-name-label">{item.country}</p>
								<StatItem
									statNumber={confirmedCases}
									label={'Confirmed cases'}
									fluctuation={confirmedCaseFluctuation}
									differential={confirmedCaseDifferential}
								/>
								<StatItem
									statNumber={deaths}
									label={'Deaths'}
									fluctuation={deathFluctuation}
									differential={deathDifferential}
								/>
								<StatItem
									statNumber={recovered}
									label={'Recovered'}
									fluctuation={recoveredFluctuation}
									differential={recoveredDifferential}
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