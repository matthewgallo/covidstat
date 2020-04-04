import React from "react";
import { Group } from "@vx/group";
import { scaleLinear } from "@vx/scale";
import { HeatmapRect } from "@vx/heatmap";
import localPoint from "@vx/event/lib/localPoint";
import { useTooltip, TooltipWithBounds } from "@vx/tooltip";
import { ScaleSVG } from '@vx/responsive';

const cool1 = "#a6c8ff";
const cool2 = "#002d9c";


export default ({
  width = 400,
  height = 200,
  separation = 0,
  margin = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
  },
  data,
  type
}) => {
  // utils
  const max = (data, value = d => d) => Math.max(...data.map(value));
  
  // accessors
  const bins = d => d.bins;
  const count = d => d.count;
  
  const colorMax = max(data, d => max(bins(d), count));
  const bucketSizeMax = max(data, d => bins(d).length);
  
  // scales
  const xScale = scaleLinear({
    domain: [0, data.length]
  });
  const yScale = scaleLinear({
    domain: [0, bucketSizeMax]
  });
  
  const rectColorScale = scaleLinear({
    range: [cool1, cool2],
    domain: [0, colorMax]
  });
  const opacityScale = scaleLinear({
    range: [0.1, 1],
    domain: [0, colorMax]
  });
  // bounds
  let size = width;
  if (size > margin.left + margin.right) {
    size = width - margin.left - margin.right - separation;
  }

  const xMax = size;
  const yMax = height - margin.bottom - margin.top;

  const binWidth = xMax / data.length;
  const binHeight = yMax / bucketSizeMax;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip
  } = useTooltip();

  const handleMouseOver = (event, columnData) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: columnData
    });
  }

  return (
    <div className="heatmap-outer-container">
      <ScaleSVG width={width} height={height}>
        <Group top={0} left={0}>
          <HeatmapRect
            data={data}
            xScale={xScale}
            yScale={yScale}
            colorScale={rectColorScale}
            opacityScale={opacityScale}
            binWidth={binWidth}
            binHeight={binHeight}
            gap={1}
          >
            {heatmap => {
              return heatmap.map(bins => {
                // console.log(bins);
                return bins.map(bin => {
                  // console.log(bin);
                  return (
                    <rect
                      key={`heatmap-rect-${bin.row}-${bin.column}`}
                      className="vx-heatmap-rect"
                      width={bin.width}
                      height={bin.height}
                      x={bin.x}
                      y={bin.y}
                      fill={bin.color}
                      fillOpacity={bin.opacity}
                      onMouseOut={hideTooltip}
                      onMouseOver={event => {
                        const { row, column } = bin;
                        handleMouseOver(event, { row, column, ...bin.bin })
                      }}
                    />
                  );
                });
              });
            }}
          </HeatmapRect>
        </Group>
      </ScaleSVG>
      {tooltipOpen && (
        <TooltipWithBounds
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          <p className="heatmap-tooltip-view-type-label">
            {type}
          </p>
          <p className="heatmap-tooltip-date-label">
            {tooltipData.date}
          </p>
          <p className="heatmap-tooltip-stat">
            {tooltipData.count}
          </p>
        </TooltipWithBounds>
      )}
      </div>
  );
};
