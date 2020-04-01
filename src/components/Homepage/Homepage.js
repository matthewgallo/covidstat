import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RestApi } from '../../utils/RestApi';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../../redux/commonActions';
import { Button, MultiSelect, TextInput } from 'carbon-components-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../PageWrapper/PageWrapper';
import { Search16, Compare16 } from '@carbon/icons-react';


const SCOPE = 'app';
function App(props) {
  const dispatch = useDispatch();
  const [multiSelectInvalid, setMultiSelectInvalid] = useState(false);
  const [activeView, setActiveView] = useState('search');
  // const [previousCountries, setPreviousCountries] = useState([]);
  const covidData = useSelector(state => state[SCOPE] && state[SCOPE].covidData);
  const covidDataProperFormat = useSelector(state => state[SCOPE] && state[SCOPE].covidDataProperFormat);
  const selectedCountriesToCompare = useSelector(state => state[SCOPE] && state[SCOPE].selectedCountriesToCompare);
  const searchResults = useSelector(state => state[SCOPE] && state[SCOPE].searchResults);
  

  useEffect(() => {
    const fetchData = async () => {
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
      dispatch(updateState(SCOPE, {
        covidData,
        covidDataProperFormat,
        currentSelectedCountry: [],
        selectedCountriesToCompare: []
      }))
    }
    // code to run on component mount
    fetchData();
  }, [dispatch]);
    
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
      setActiveView('search');
      // setPreviousCountries(oldCountries => [...oldCountries, country]);
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

    const toggleView = view => {
      setActiveView(view)
      dispatch(updateState(SCOPE, {
        selectedCountriesToCompare: [],
      }));
    }

    const multiSelectChange = event => {
        dispatch(updateState(SCOPE, {
          selectedCountriesToCompare: event.selectedItems
        }));
        if (event.selectedItems && event.selectedItems.length > 3) {
          dispatch(updateState(SCOPE, {
            multiSelectInvalid: setMultiSelectInvalid(true),
          }))
        }
        if ((event.selectedItems && event.selectedItems.length === 3) ||
          (event.selectedItems && event.selectedItems.length === 2)
          ) {
          dispatch(updateState(SCOPE, {
            multiSelectInvalid: setMultiSelectInvalid(false),
          }))
        }
    }

    const compareCountries = () => {
      if ((selectedCountriesToCompare && selectedCountriesToCompare.length === 1)) {
          dispatch(updateState(SCOPE, {
            multiSelectInvalid: setMultiSelectInvalid(true),
          }));
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
            disabled={!covidData ? true : false}
            onChange={event => handleSearch(event)}
            id="c--main-search-input"
            placeholder="Search by country"
            labelText=""
          />
          </>
          : <>
          <MultiSelect.Filterable
            ariaLabel="Choose an item"
            disabled={false}
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
  covidData: PropTypes.object,
  searchAttributes: PropTypes.array,
  searchSettings: PropTypes.object,
  currentSelectedCountry: PropTypes.array,
  previouslySelectedCountries: PropTypes.array
};

export default App;
