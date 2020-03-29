import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import store from './Store';

const ProviderWrapper = ({ children }) => (
	<Provider store={store}>
		{children}
	</Provider>
);

ProviderWrapper.propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
	store: PropTypes.object,
};

export default ProviderWrapper;
