import React from 'react';

const PageWrapper = ({ children, classProp }) => {
	return (
		<div className={`c--page-wrapper ${classProp ? classProp : ''}`}>
			{children}
		</div>
	);
};

export default PageWrapper;