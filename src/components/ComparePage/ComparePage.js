import React, { useEffect } from 'react';
import PageWrapper from '../PageWrapper/PageWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LeftArrow20 from '@carbon/icons-react/lib/arrow--left/20';
import { RestApi } from '../../utils/RestApi';
import { updateState } from '../../redux/commonActions';

const ComparePage = ({ match }) => {

	const dispatch = useDispatch();
	const selectedCountriesToCompare = useSelector(state => state['app'] && state['app'].selectedCountriesToCompare);
	console.log(selectedCountriesToCompare);

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
		console.log("THIS IS IT!", countriesToCompare);
		dispatch(updateState('app', {
			selectedCountriesToCompare: countriesToCompare
		}))

	}

	useEffect(() => {
		// code to run on component mount
		if (!selectedCountriesToCompare) {
			// console.log('we do not have the data for the selected countries.');
			console.log(match.params);
			const countryParams = match.params.countriesToCompare.split("+").join(",").replace(/-/g, ' ');
			const countryParamsArray = countryParams.split(',');
			console.log(countryParams);
			console.log(countryParamsArray);
			fetchData(countryParamsArray)
		}
	  }, []);

	return (
		<PageWrapper>
			Countries to compare:
			{selectedCountriesToCompare && selectedCountriesToCompare.length
				? selectedCountriesToCompare.map(item => {
					return (
						<>
						<h3>{item.country}</h3>
						</>
					)
				})
				: ''
			}
			<Link to={'/'} className="floating-button-link back-home-link">
				<LeftArrow20 />
			</Link>
		</PageWrapper>
	);
};

export default ComparePage;