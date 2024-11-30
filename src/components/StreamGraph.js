import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const StreamGraph = ({ data, setLegendData, onHover, onHoverOut }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const margin = { top: 20, right: 150, bottom: 50, left: 50 };
        const width = 600;
        const height = 400;

        const keys = Object.keys(data[0]).filter((key) => key !== "Date");
        const stackedData = d3
            .stack()
            .keys(keys)
            .offset(d3.stackOffsetWiggle)(data);

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(data, (d) => d.Date))
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([
                d3.min(stackedData, (layer) => d3.min(layer, (d) => d[0])),
                d3.max(stackedData, (layer) => d3.max(layer, (d) => d[1])),
            ])
            .range([height, 0]);

        const colorScale = d3
            .scaleOrdinal()
            .domain(keys)
            .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);

        // const legendData = keys.map((key) => ({
        //     label: key,
        //     color: colorScale(key),
        // }));

        const legendData = keys
            .map((key) => ({
                label: key,
                color: colorScale(key),
            }))
            .reverse();

        setLegendData(legendData);

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3
            .select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const area = d3
            .area()
            .x((d) => xScale(d.data.Date))
            .y0((d) => yScale(d[0]))
            .y1((d) => yScale(d[1]))
            .curve(d3.curveBasis);

        const layers = svg
            .selectAll(".layer")
            .data(stackedData)
            .enter()
            .append("path")
            .attr("class", "layer")
            .attr("d", area)
            .style("fill", (d) => colorScale(d.key))
            .style("stroke", "none");

        svg
            .append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(
                d3
                    .axisBottom(xScale)
                    .ticks(d3.timeMonth.every(1))
                    .tickFormat(d3.timeFormat("%b"))
            );

        // Legend
        const legend = svg
            .append("g")
            .attr(
                "transform",
                `translate(${width + 10}, ${height / 2 - (keys.length * 20) / 2})`
            );

        legend
            .selectAll(".legend-item")
            .data(legendData)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`)
            .each(function (d) {
                const g = d3.select(this);
                g.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", d.color);

                g.append("text")
                    .attr("x", 25)
                    .attr("y", 13)
                    .style("fill", "black")
                    .style("font-size", "12px")
                    .text(d.label);
            });

        layers
            .on("mousemove", (event, d) => {
                const mousePosition = {
                    x: event.pageX - 300,
                    y: event.pageY - 1,
                };
                onHover(d.key, mousePosition);
            })
            .on("mouseout", () => {
                onHoverOut();
            });
    }, [data, setLegendData, onHover, onHoverOut]);

    return <svg ref={svgRef}></svg>;
};

export default StreamGraph;


// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
//
// function StreamGraph({ data }) {
//     const svgRef = useRef();
//
//     useEffect(() => {
//         if (data.length === 0) return;
//
//         // Set dimensions and margins
//         const margin = { top: 20, right: 30, bottom: 50, left: 50 };
//         const width = 800 - margin.left - margin.right;
//         const height = 500 - margin.top - margin.bottom;
//
//         // Clear any existing SVG content
//         d3.select(svgRef.current).selectAll("*").remove();
//
//         // Create the SVG container
//         const svg = d3
//             .select(svgRef.current)
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom)
//             .append("g")
//             .attr("transform", `translate(${margin.left},${margin.top})`);
//
//         // Set up the stack generator
//         const stackKeys = ["GPT4", "Gemini", "PaLM2", "Claude", "LLaMA3"];
//         const stack = d3.stack().keys(stackKeys);
//
//         // Stack the data
//         const stackedData = stack(data);
//
//         // Create scales
//         const xScale = d3
//             .scaleTime()
//             .domain(d3.extent(data, (d) => d.date))
//             .range([0, width]);
//
//         const yScale = d3
//             .scaleLinear()
//             .domain([
//                 0,
//                 d3.max(stackedData, (layer) => d3.max(layer, (d) => d[1])),
//             ])
//             .range([height, 0]);
//
//         const colorScale = d3
//             .scaleOrdinal()
//             .domain(stackKeys)
//             .range(d3.schemeCategory10);
//
//         // Create the area generator
//         const area = d3
//             .area()
//             .x((d) => xScale(d.data.date))
//             .y0((d) => yScale(d[0]))
//             .y1((d) => yScale(d[1]));
//
//         // Add the streamgraph paths
//         svg
//             .selectAll("path")
//             .data(stackedData)
//             .join("path")
//             .attr("d", area)
//             .attr("fill", (d) => colorScale(d.key))
//             .attr("stroke", "black")
//             .attr("stroke-width", 0.5)
//             .on("mouseover", function (event, d) {
//                 d3.select(this).transition().duration(200).attr("opacity", 0.8);
//
//                 const [x, y] = d3.pointer(event);
//                 const date = xScale.invert(x);
//                 const formattedDate = d3.timeFormat("%B %Y")(date);
//
//                 d3.select("#tooltip")
//                     .style("left", `${event.pageX + 3}px`)
//                     .style("top", `${event.pageY + 3}px`)
//                     .style("opacity", 1)
//                     .html(`Model: ${d.key}<br>Hashtags: ${Math.round(yScale.invert(y))}<br>${formattedDate}`);
//             })
//             .on("mousemove", function (event) {
//                 d3.select("#tooltip")
//                     .style("left", `${event.pageX + 3}px`)
//                     .style("top", `${event.pageY + 3}px`);
//             })
//             .on("mouseout", function () {
//                 d3.select(this).transition().duration(200).attr("opacity", 1);
//                 d3.select("#tooltip").style("opacity", 0);
//             });
//
//         // Add x-axis
//         svg
//             .append("g")
//             .attr("transform", `translate(0,${height})`)
//             .call(d3.axisBottom(xScale).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b %Y")))
//             .selectAll("text")
//             .attr("transform", "rotate(-45)")
//             .style("text-anchor", "end");
//
//         // Add y-axis
//         svg.append("g").call(d3.axisLeft(yScale));
//     }, [data]);
//
//     return (
//         <div style={{ position: "relative" }}>
//             <svg ref={svgRef}></svg>
//             <div
//                 id="tooltip"
//                 style={{
//                     position: "absolute",
//                     background: "#fff",
//                     border: "1px solid #ddd",
//                     padding: "5px",
//                     borderRadius: "4px",
//                     pointerEvents: "none",
//                     opacity: 0,
//                 }}
//             ></div>
//         </div>
//     );
// }
//
// export default StreamGraph;
