//Event listener to run when the DOM's content is loaded.
document.addEventListener("DOMContentLoaded", function() {
    
    let request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    request.send();
    //This function executes when the asynchronous request finishes loading, and updates the HTML using the d3 library.
    request.onload = function() {
        //The "json" variable holds the responseText, parsed. The "html" variable will be built up inside this function to create the graph using the json dataset.
        let json = JSON.parse(request.responseText);
        let html = "";

        //This is the year/value pair data for display in the graph.
        const dataset = json.data;

        //These are the constants used for the graph's dimensions and scale.
        const w = 1000;
        const h = 500;
        const padding = 80;
        const minDate = d3.min(dataset, (d) => d[0]).slice(0,4);
        const maxDate = d3.max(dataset, (d) => d[0]).slice(0,4);
        const minGDP = d3.min(dataset, (d) => d[1]);
        const maxGDP = d3.max(dataset, (d) => d[1]);
        const barWidth = 4;
        const yScale = d3.scaleLinear().domain([minGDP, maxGDP]).range([padding, h - padding]);
        const xScale = d3.scaleLinear().domain([0, dataset.length]).range([padding, w - padding]);
        const dateScale = d3.scaleLinear().domain([minDate, maxDate]).range([padding, w - padding]);
        const xAxis = d3.axisBottom(dateScale).tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(yScale);

        //The svg element, to which bars will be appended.
        const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
        //The div element used to show the #tooltip element.
        const title = svg.append("title").attr("id", "tooltip").style("opacity", 0).attr("title", "regular tooltip");

        //The individual bar elements.
        d3.select("svg").selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d) => h - yScale(d[1]))
        .attr("width", barWidth)
        .attr("height", (d) => yScale(d[1]) - padding)
        .attr("class", "bar")
            .on("mouseover", (d, i) => {
                title.transition()
                    .duration(200)
                    .text(
                        `${d[0]}, $${d[1]} Billion`
                    );
            })
            .on("mouseout", (d) => {
                title.transition()
                    .style("opacity", 0);
            });

        //The X Axis
        svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);

        //The Y Axis
        svg.append("g")
        .attr("transform", "translate("+(padding)+", 0)")
        .attr("id", "y-axis")
        .call(yAxis);

        //The Title
        svg.append("text")
        .attr("x", w/2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("id", "title")
        .text("United States GDP");

        //The Left-Hand Label
        svg.append("text")
        .attr("x", -padding-80)
        .attr("y", padding+30)
        .attr("text-anchor", "middle")
        .attr("class", "left-label")
        .text("Gross Domestic Product");

        
    }

});