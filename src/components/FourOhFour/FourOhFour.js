import React from 'react';
import PageWrapper from '../PageWrapper/PageWrapper';
import { Link } from 'react-router-dom';
import LeftArrow20 from '@carbon/icons-react/lib/arrow--left/20';

const FourOhFour = () => {
	return (
		<PageWrapper>
			<h1>Uh oh, page not found</h1>
			<Link to={'/'} className="floating-button-link back-home-link">
				<LeftArrow20 />
			</Link>
		</PageWrapper>
	);
};

export default FourOhFour;