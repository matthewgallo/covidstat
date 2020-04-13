import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RestApi } from '../../utils/RestApi';
import { useStoreon } from 'storeon/react';
import { Button, MultiSelect, TextInput } from 'carbon-components-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../PageWrapper/PageWrapper';
import { Search16, Compare16 } from '@carbon/icons-react';

function App(props) {

  const { dispatch, covidDataProperFormat, searchResults, selectedCountriesToCompare } = useStoreon('covidDataProperFormat', 'searchResults', 'selectedCountriesToCompare');
  const [multiSelectInvalid, setMultiSelectInvalid] = useState(false);
  const [activeView, setActiveView] = useState('search');

  useEffect(() => {
    const fetchData = async () => {
      dispatch('covidData/get', await RestApi.get('https://pomber.github.io/covid19/timeseries.json'));
    }
      fetchData();
    }, [dispatch]);
    
    const handleSearch = (event) => {
      const searchValue = event.target.value.toLocaleLowerCase();
      let searchResults = covidDataProperFormat && covidDataProperFormat.filter(item => item.country.toLocaleLowerCase().indexOf(searchValue) !== -1);
      searchResults.length = 8;
      dispatch('setSearchResults', searchResults);
      if (searchValue === '') {
        dispatch('setSearchResults', []);
      }
    }

    const setCurrentCountry = (event, urlFriendlyCountryName, country) => {
      event.preventDefault();
      dispatch('setCurrentCountry', [country]);
      dispatch('setSearchResults', []);
      setActiveView('search');
      props.history.push(`/country/${urlFriendlyCountryName}`)
    }

    const renderSearchItem = item => {
      const urlFriendlyCountryName = item.country.replace(/[. ,:-]+/g, "-").toLocaleLowerCase();
            return (
              <Link key={item.country} to="/" onClick={event => setCurrentCountry(event, urlFriendlyCountryName, item)}>
                <h2 className="c--search-result-item">{item.country}</h2>
              </Link>
            )
    }

    const toggleView = view => {
      setActiveView(view);
      dispatch('setSelectedCountries', [])
      dispatch('setSearchResults', [])
    }
    
    const multiSelectChange = event => {
        dispatch('setSelectedCountries', event.selectedItems)
        if (event.selectedItems && event.selectedItems.length > 3) {
          setMultiSelectInvalid(true)
        }
        if ((event.selectedItems && event.selectedItems.length === 3) ||
          (event.selectedItems && event.selectedItems.length === 2)
          ) {
          setMultiSelectInvalid(false)
        }
    }

    const compareCountries = () => {
      if ((selectedCountriesToCompare && selectedCountriesToCompare.length === 1) ||
      !selectedCountriesToCompare?.length
      ) {
          setMultiSelectInvalid(true)
          return;
      }
      if (multiSelectInvalid) {
        return;
      }
      let compareUrl = [];
      selectedCountriesToCompare.map((item, i) => {
        return compareUrl.push(item.country.toString());
      })
      let combinedUrlCountries = compareUrl.join();
      combinedUrlCountries = combinedUrlCountries.replace(/[. :-]+/g, "-").toLocaleLowerCase();
      const formattedCompareUrl = combinedUrlCountries.replace(/,/g, '+');
      props.history.push(`/compare/${formattedCompareUrl}`)
      setActiveView('search');
    }

  return (
    <PageWrapper>
      <div className={`toggle-button-container ${activeView === 'search' ? 'search-container-active' : 'compare-container-active'}`}>
        <Button className={`c--toggle-icon-button ${activeView === 'search' ? 'search-button-active' : 'search-button-inactive'}`}
          onClick={() => toggleView('search')}
        >
          <Search16 />
        </Button>
        <Button className={`c--toggle-icon-button ${activeView === 'search' ? 'compare-button-inactive' : 'compare-button-active'}`}
          onClick={() => toggleView('compare')}
        >
          <Compare16 />
        </Button>
        <div className="toggle-background-slider" />
      </div>
      <div className="c--main-app-container">
        <div className="c--inner-container">
        <h3>Welcome,<br /><span>search or compare COVID-19 data by country</span></h3>
          {activeView === 'search'
          ? <>
          <TextInput
            disabled={!covidDataProperFormat ? true : false}
            onChange={event => handleSearch(event)}
            id="c--main-search-input"
            placeholder="Search by country"
            labelText=""
          />
          </>
          : <>
          <MultiSelect.Filterable
            ariaLabel="Choose an item"
            disabled={!covidDataProperFormat ? true : false}
            id="c--main-multi-select"
            itemToString={item => (item ? item.country : "")}
            items={covidDataProperFormat ? covidDataProperFormat : []}
            onChange={event => multiSelectChange(event)}
            placeholder="Select multiple countries to compare"
            type="default"
            invalid={multiSelectInvalid ? true : false}
            invalidText="Choose 2 or 3 countries to compare"
          />
          </>
          }
          <div className="c--submit-button-container">
            {activeView !== 'search' ? <Button className="c--compare-submit-button" onClick={() => compareCountries()} disabled={multiSelectInvalid ? true : false}>Compare countries</Button> : ''}
          </div>
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
  searchAttributes: PropTypes.array,
  searchSettings: PropTypes.object,
  currentSelectedCountry: PropTypes.array,
  previouslySelectedCountries: PropTypes.array
};

export default App;
