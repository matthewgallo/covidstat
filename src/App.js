import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { RestApi } from './utils/RestApi';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from './redux/commonActions';
import { TextInput } from 'carbon-components-react';
import { Link } from 'react-router-dom';
import PageWrapper from './PageWrapper';


const SCOPE = 'app';
function App(props) {
  const dispatch = useDispatch();
  const [previousCountries, setPreviousCountries] = useState([]);
  const covidData = useSelector(state => state[SCOPE] && state[SCOPE].covidData);
  const searchResults = useSelector(state => state[SCOPE] && state[SCOPE].searchResults);
  
  const fetchData = async () => {
    const covidData = await RestApi.get('https://pomber.github.io/covid19/timeseries.json');
    covidData['United States'] = covidData['US'];
    delete covidData['US'];
    dispatch(updateState(SCOPE, {
      covidData,
      currentSelectedCountry: []
    }))
  }

  useEffect(() => {
    // code to run on component mount
    fetchData();
  }, []);
    
    const handleSearch = (event) => {
      // console.log(covidData);
      const searchValue = event.target.value.toLocaleLowerCase();
      const updatedData = Object.entries(covidData);
      let searchResults = updatedData.filter(country => country[0].toLocaleLowerCase().indexOf(searchValue) !== -1);
      searchResults.length = 8;
      dispatch(updateState(SCOPE, {
        searchResults
      }))
      if (searchValue === '') {
        dispatch(updateState(SCOPE, {
          searchResults: []
        }))
      }
    }

    const setCurrentCountry = (urlFriendlyCountryName, country) => {
      dispatch(updateState(SCOPE, {
        currentSelectedCountry: country,
        searchResults: []
      }))
      setPreviousCountries(oldCountries => [...oldCountries, country]);
      props.history.push(`/country/${urlFriendlyCountryName}`)
    }

    const renderSearchItem = country => {
      const urlFriendlyCountryName = country[0].replace(/[. ,:-]+/g, "-").toLocaleLowerCase();
            return (
              <Link onClick={() => setCurrentCountry(urlFriendlyCountryName, country)}>
                <h2 className="c--search-result-item">{country[0]}</h2>
              </Link>
            )
    }

  return (
    <PageWrapper>
      <div className="c--main-app-container">
        <div className="c--inner-container">
          <h3>Welcome,<br /><span>search to see COVID-19 cases by country</span></h3>
          <TextInput
            disabled={!covidData ? true : false}
            onChange={event => handleSearch(event)}
            id="c--main-search-input"
            placeholder="Search by country"
          />
          <div className="c--search-results-container">
            {searchResults && searchResults.length ?
              searchResults.map(country => renderSearchItem(country))
              : ''
            }
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

App.propTypes = {
  covidData: PropTypes.object,
  searchAttributes: PropTypes.array,
  searchSettings: PropTypes.object,
  currentSelectedCountry: PropTypes.array,
  previouslySelectedCountries: PropTypes.array
};

export default App;
