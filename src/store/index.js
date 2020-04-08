import  { createStoreon } from 'storeon';
import { storeonDevtools } from 'storeon/devtools';

import { covidData } from './covidData';

export default createStoreon([
	covidData,
	process.env.NODE_ENV !== 'production' && storeonDevtools
])