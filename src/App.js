import React, { useState } from "react";
import * as d3 from "d3";

import FileUpload from "./components/FileUpload";
import StreamGraph from "./components/StreamGraph";
import Tooltip from "./components/Tooltip";
import "./App.css";

function App() {
    const [data, setData] = useState([]);
    const [legendData, setLegendData] = useState([]);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipColor, setTooltipColor] = useState("");

    const handleMouseOver = (modelKey, mousePosition) => {
        if (!data || data.length === 0) return;

        const tooltipBarData = data.map((d) => ({
            month: d3.timeFormat("%b")(d.Date),
            value: d[modelKey],
        }));

        const legendItem = legendData.find((item) => item.label === modelKey);
        setTooltipColor(legendItem ? legendItem.color : "gray");
        setTooltipData(tooltipBarData);
        setTooltipPosition(mousePosition);
    };

    const handleMouseOut = () => {
        setTooltipData(null);
    };

    return (
        <div>

            <div style={{backgroundColor: "#f0f0f0", padding: 20}}>
                <h1>CS450 - Assignment 6</h1>
                <FileUpload set_data={setData}/>
            </div>

            <div>
                {data.length > 0 && (
                    <div className="graph-container">
                        <div style={{flex: 1}}>
                            <StreamGraph
                                data={data}
                                setLegendData={setLegendData}
                                onHover={handleMouseOver}
                                onHoverOut={handleMouseOut}
                            />
                        </div>
                    </div>
                )}

                {tooltipData && (
                    <Tooltip
                        data={tooltipData}
                        color={tooltipColor}
                        position={tooltipPosition}
                    />
                )}
            </div>
        </div>
    );
}

export default App;