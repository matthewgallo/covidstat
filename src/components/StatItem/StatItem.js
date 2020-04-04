import React from 'react';
import LeftArrow20 from '@carbon/icons-react/lib/arrow--left/20';
import { SkeletonPlaceholder } from 'carbon-components-react';

const StatItem = ({ statNumber, label, backButton, fluctuation, countIncrease, activeStatItem }) => {
	const modifiedFluctuation = `${fluctuation}`;
	return (
		<>
		{!backButton ?
		<div className={`stat-item-container ${activeStatItem ? 'active-selected-stat-item' : ''}`}>
			<p
				className={`c--stat-number ${statNumber > 9999 ? 'c--large-stat-number' : ''}`}
				>
					{statNumber > 0 && statNumber}
					{statNumber === 0 && '0'}
			</p>
			<p className="c--fluctuation">
				{modifiedFluctuation ? `${modifiedFluctuation}%` : <SkeletonPlaceholder style={{
					width: '3rem',
					height: '1rem'
				}}/>}
				{'*'}
			</p>
			<p className="c--differential-label">{countIncrease > 0 ? `${countIncrease}\u00B0` : ''}</p>
			<p className="c--stat-label">{label}</p>
		</div>
		: <div className="stat-item-container">
			<LeftArrow20 />
		</div>
		}
		</>
	);
};

export default StatItem;