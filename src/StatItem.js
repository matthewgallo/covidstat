import React from 'react';
import LeftArrow20 from '@carbon/icons-react/lib/arrow--left/20';
import UpArrow16 from '@carbon/icons-react/lib/arrow--up-right/16';
import DownArrow16 from '@carbon/icons-react/lib/arrow--down-right/16';
import { SkeletonPlaceholder } from 'carbon-components-react';

const StatItem = ({ statNumber, label, backButton, fluctuation }) => {
	const modifiedFluctuation = `${fluctuation}`;
	return (
		<>
		{!backButton ?
		<div className="stat-item-container">
			<p
				className="c--stat-number"
				style={{
					fontSize: statNumber > 9999 && '2.625rem'
				}}
				>
					{statNumber > 0 && statNumber}
					{statNumber === 0 && '0'}
			</p>
			<p className="c--fluctuation">
				{modifiedFluctuation ? `${modifiedFluctuation}%` : <SkeletonPlaceholder style={{
					width: '3rem',
					height: '1rem'
				}}/>}
				{fluctuation && fluctuation > 0
					? <UpArrow16 />
					: ''
				}
				{fluctuation && fluctuation < 0
					? <DownArrow16 />
					: ''
				}
				{'*'}
			</p>
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