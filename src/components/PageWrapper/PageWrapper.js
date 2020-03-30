import React from 'react';

const PageWrapper = ({ children }) => {
	return (
		<div className="c--page-wrapper">
			{children}
		</div>
	);
};

export default PageWrapper;