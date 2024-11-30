import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Tooltip = ({ data, color, position }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const width = 250;
        const height = 150;
        const margin = { top: 10, right: 10, bottom: 20, left: 30 };

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.month))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => xScale(d.month))
            .attr("y", (d) => yScale(d.value))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(0) - yScale(d.value))
            .attr("fill", color);

        svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickSizeOuter(0).ticks(3))
            .selectAll("text")
            .style("font-size", "10px");

        svg
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(3))
            .selectAll("text")
            .style("font-size", "10px");
    }, [data, color]);

    return (
        <div
            style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                pointerEvents: "none",
                background: "white",
                border: "1px solid lightgray",
                borderRadius: "4px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "5px",
                fontSize: "12px",
                width: "270px",
                overflow: "hidden",
            }}
        >
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default Tooltip;
