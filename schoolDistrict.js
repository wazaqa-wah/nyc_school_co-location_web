// Define the SVG container dimensions
const mapWidth = 570;
const mapHeight = 700;

const rightMargin = {top: 10, right: 70, bottom: 50, left: 30},
    graphWidth = 380,
    graphHeight = 190,
    barGraphH = 300;


// Create the SVG container and append it to the DOM
const mapSvg = d3.select("#schoolDistrictMap")
                .append("svg")
                .attr("width", mapWidth)
                .attr("height", mapHeight);

const mapcolorScale = d3.scaleSequential()
                    .domain([0, 1]) // Set the range of values for the color scale
                    .interpolator(d3.interpolateBlues);




// Define the file URLs
const schoolGeo = "School Districts.geojson";
const schoolCSV = "mapData.csv";
let update;
let barData1;
let barData2;

// Load the GeoJSON file and CSV file in parallel
// Load both files asynchronously using Promise.all()
Promise.all([d3.json(schoolGeo), d3.csv(schoolCSV)])
.then(([geoJsonData, csvData]) => {

    csvData.forEach(function(d) {
        d.co_pct = +d.co_pct;
    });
    
    
     // Define a projection for the map   
    const projection = d3.geoMercator()
                            .fitSize([mapWidth, mapHeight], geoJsonData);

        // Define a path generator
    const mapPath = d3.geoPath()
                    .projection(projection);

    // Add the GeoJSON data to the SVG container
    const mapPaths = mapSvg.selectAll("path")
        .data(geoJsonData.features)
        .enter()
        .append("path")
        .attr("d", mapPath)
        // .attr("fill", "#babd8d")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .style("fill", function(d){
            const co_pct = csvData.find(function(e) { return e.school_dist === d.properties.school_dist; }).co_pct;
                return mapcolorScale(co_pct);
        })
        .on("click", function(event, d) {

            const districtID = d.properties.school_dist;
            const districtData = csvData.filter((row) => row.school_dist === districtID);
            const datathing = Object.entries(districtData)
            // console.log(data)

            // console.log(datathing)
           
            // Remove the active class from all paths
            mapPaths.classed("active", false);
            // Add the active class to the clicked path
            d3.select(this).classed("active", true);
            // Change the fill color of the active path
            mapPaths.attr("stroke", function(d) {
                return d3.select(this).classed("active") ? "#eeba0b" : "White";
            
            });

            // reshape data into a dictionary
            let schoolDict = d3.group(districtData, d => d.school_dist);
            // console.log(schoolDict)
            schoolDict = Object.fromEntries(schoolDict);
            // console.log(schoolDict, districtID);
            schoolDict = schoolDict[districtID];
            // console.log(schoolDict[0]["Grade_6_8"]);
            

            const grades = [
                            {charter:{Grade_PreK_5: schoolDict[0]?.["Grade_PreK_5"] || 0, Grade_6_8: schoolDict[0]?.["Grade_6_8"] || 0, Grade_9_12: schoolDict[0]?.["Grade_9_12"] || 0}},
                            {public:{Grade_PreK_5: schoolDict[1]?.["Grade_PreK_5"] || 0, Grade_6_8: schoolDict[1]?.["Grade_6_8"] || 0, Grade_9_12: schoolDict[1]?.["Grade_9_12"] || 0}}
                            ];
            const race = [
                            {Asian: schoolDict[0]?.["pct_asian"]*100 || 0, Black: schoolDict[0]?.["pct_black"]*100 || 0, Hispanic: schoolDict[0]?.["pct_hispanic"]*100 || 0, Multi: schoolDict[0]?.["pct_multiple_race_categories_not_represented"]*100 || 0, White: schoolDict[0]?.["pct_white"]*100 || 0},
                            {Asian: schoolDict[1]?.["pct_asian"]*100 || 0, Black: schoolDict[1]?.["pct_black"]*100 || 0, Hispanic: schoolDict[1]?.["pct_hispanic"]*100 || 0, Multi: schoolDict[1]?.["pct_multiple_race_categories_not_represented"]*100 || 0, White: schoolDict[1]?.['pct_white']*100 || 0}
                            ];
            const demography = [
                            {English_language_learner: schoolDict[0]?.["pct_ell"]*100 || 0, Poverty: schoolDict[0]?.["pct_poverty"]*100 || 0, Student_with_disability: schoolDict[0]?.["pct_swd"]*100 || 0},
                            {English_language_learner: schoolDict[1]?.["pct_ell"]*100 || 0, Poverty: schoolDict[1]?.["pct_poverty"]*100 || 0, Student_with_disability: schoolDict[1]?.["pct_swd"]*100 || 0}
                            ];
            const score = [
                            {ELA_proficient: schoolDict[0]?.["Level3_4_ELA_proficient"]*100 || 0, Math_proficient: schoolDict[0]?.["Level3_4_Math_proficient"]*100 || 0, Four_year_grad: schoolDict[0]?.["Pct_4_year_august_graduate"]*100 || 0, Six_year_grad: schoolDict[0]?.["Pct_6_year_graduates"]*100 || 0},
                            {ELA_proficient: schoolDict[1]?.["Level3_4_ELA_proficient"]*100 || 0, Math_proficient: schoolDict[1]?.["Level3_4_Math_proficient"]*100 || 0, Four_year_grad: schoolDict[1]?.["Pct_4_year_august_graduate"]*100 || 0, Six_year_grad: schoolDict[1]?.["Pct_6_year_graduates"]*100 || 0}
                            ];
            
            console.log(demography)

            
            //  questionable area starts
            // stacked bar chart horizontal for grade distribution

            d3.select("#graph1")
            .select("svg")
            .remove();

            const graph1Svg = d3.select("#graph1")
                .append("svg")
                
                .attr("width", graphWidth)
                .attr("height", graphHeight)
                .append("g")
                .attr("transform", `translate(${rightMargin.left},${rightMargin.top})`);
            
            

            // Get the keys from the data
            const gardeKeys = Object.keys(grades[0]).map(k => Object.keys(grades[0][k]));
            // console.log(gardeKeys)
            // Create color scale
            const gradeColorScale = d3.scaleOrdinal()
                        .range(d3.schemeSet2)
                        .domain(gardeKeys[0]);

            const stack = d3.stack()
                .keys(gardeKeys[0])
                .value((d, key) => +d[Object.keys(d)[0]][key]);

            // console.log(stack(grades))
        
            // Create stacked data
            const stackedGradeData = stack(grades);
            // console.log(stackedGradeData)
            // Define scales
            const graph1xScale = d3.scaleLinear()
                        .domain([0, d3.max(stackedGradeData, d => d3.max(d, d => d[1]))])
                        .range([rightMargin.left, graphWidth - rightMargin.left - rightMargin.right]);

            const graph1yScale = d3.scaleBand()
                        .domain(stackedGradeData[0].map(d => d.data[Object.keys(d.data)[0]]))
                        .range([0, graphHeight - rightMargin.top - rightMargin.bottom])
                        .padding(0.1);

            // Add bars

            graph1Svg.append("g")
                        .selectAll("g")
                        // Enter in the stack data = loop key per key = group per group
                        .data(stackedGradeData)
                        .join("g")
                        .attr("fill", d => gradeColorScale(d.key))
                        .selectAll("rect")
                        // enter a second time = loop subgroup per subgroup to add all rectangles
                        .data(d => d)
                        .join("rect")
                        .attr("x", d => graph1xScale(d[0]))
                        .attr("y", d => graph1yScale(d.data[Object.keys(d.data)[0]]))
                        .attr("width", d => graph1xScale(d[1]) - graph1xScale(d[0]))
                        .attr("height", graph1yScale.bandwidth())
                        .on("mouseover", function(d) {
                            d3.select(this).style("opacity", 0.7);
                            const parent = d3.select(this.parentNode);
                            const key = parent.data()[0].key;
                            // console.log(key)
                            const xPos = parseFloat(d3.select(this).attr("x")) + graph1yScale.bandwidth() / 2;
                            const yPos = parseFloat(d3.select(this).attr("y")) + (graph1xScale(d[0]) - graph1xScale(d[1])) / 2;
                            graph1Svg.append("text")
                                .attr("class", "hover-text")
                                .attr("x", xPos)
                                .attr("y", yPos)
                                .attr("text-anchor", "middle")
                                .text(`${key}`);
                            })
                            .on("mouseout", function(d) {
                            d3.select(this).style("opacity", 1);
                            graph1Svg.selectAll(".hover-text").remove();
                        });
            // Add the x-axis
            graph1Svg.append("g")
            .attr("transform", `translate(${0}, ${graphHeight - rightMargin.bottom})`)
            .call(d3.axisBottom(graph1xScale).ticks(5));

            const yLabels = ["Charter","Public"]

            // Add the y-axis
            graph1Svg.append("g")
            .attr("transform", `translate(${rightMargin.left}, ${rightMargin.top})`)
            .call(d3.axisLeft(graph1yScale).tickFormat((d,i) => yLabels[i]));

        // pie chart for charter race
        d3.select("#graph2")
            .select("svg")
            .remove();

        const graph2Radius = Math.min(graphHeight, graphHeight) / 2 

        // append the svg object to the div 
        const graph2Svg = d3.select("#graph2")
        .append("svg")
            .attr("width", graphHeight)
            .attr("height", graphHeight)
        .append("g")
            .attr("transform", `translate(${graphHeight / 2}, ${graphHeight / 2})`);

        

        const pieData1 = race[0];
        // console.log(pieData1)

        // set the color scale
        const graph2Color = d3.scaleOrdinal()
                        .range(d3.schemeSet2);

        // Compute the position of each group on the pie:
        const graph2Pie = d3.pie()
                    .value(function(d) {return d[1]});
        const graph2Data = graph2Pie(Object.entries(pieData1));
        
        
        
        // shape helper to build arcs:
        const graph2Arc = d3.arc()
                            .innerRadius(0)
                            .outerRadius(graph2Radius);
        // build circle
        graph2Svg
        .selectAll('mySlices')
        .data(graph2Data)
        .join('path')
            .attr('d', graph2Arc)
            .attr('data-label', d => {
                // console.log(d, d.data);
                return d.data[0]
            })
            .attr('fill', function(d){ return(graph2Color(d.data[0])) })
            .attr("stroke", "grey")
            .style("stroke-width", "1px")
            .style("opacity", 0.7)
        graph2Svg
            .selectAll('mySlices')
            .data(graph2Data)
            .join('text')
            .text(function(d){ return d.data[0]})
            .attr("transform", function(d) { return `translate(${graph2Arc.centroid(d)})`})
            .style("text-anchor", "middle")
            .style("font-size", 9);

        // pie chart for public race
        d3.select("#graph3")
            .select("svg")
            .remove();

        const graph3Radius = Math.min(graphHeight, graphHeight) / 2 

        // append the svg object to the div 
        const graph3Svg = d3.select("#graph3")
        .append("svg")
            .attr("width", graphHeight)
            .attr("height", graphHeight)
        .append("g")
            .attr("transform", `translate(${graphHeight / 2}, ${graphHeight / 2})`);



        const pieData2 = race[1];
        // console.log(pieData2)

        // set the color scale
        const graph3Color = d3.scaleOrdinal()
                        .range(d3.schemeSet2);

        // Compute the position of each group on the pie:
        const graph3Pie = d3.pie()
                    .value(function(d) {return d[1]});
        const graph3Data = graph3Pie(Object.entries(pieData2));



        // shape helper to build arcs:
        const graph3Arc = d3.arc()
                            .innerRadius(0)
                            .outerRadius(graph3Radius);
        // build circle
        graph3Svg
            .selectAll('mySlices')
            .data(graph3Data)
            .join('path')
                .attr('d', graph3Arc)
                .attr('data-label', d => {
                    // console.log(d, d.data);
                    return d.data[0]
                })
                .attr('fill', function(d){ return(graph3Color(d.data[0])) })
                .attr("stroke", "grey")
                .style("stroke-width", "1px")
                .style("opacity", 0.7)
        graph3Svg
            .selectAll('mySlices')
            .data(graph3Data)
            .join('text')
            .text(function(d){ return d.data[0]})
            .attr("transform", function(d) { return `translate(${graph3Arc.centroid(d)})`})
            .style("text-anchor", "middle")
            .style("font-size", 9);

        // table
        function makeTable() {
            d3.select(".table tbody").selectAll('tr').remove();

            // console.log('before table',demography)
            const tr = d3.select(".table tbody")
                .selectAll("tr")
                .data(demography)
                .enter().append("tr");
            // console.log(tr)

            const td = tr.selectAll("td")
                .data(function(d, i) { console.log(d); return Object.values(d); })
                .enter()
                .append("td")
                .text(function(d) { console.log(d);return d + "%"; });
        }
        makeTable();

       
       


        // bar graph
        d3.select("#graph4")
        .select("svg")
        .remove();

    barData1 = score[0];
    barData2 = score[1];
    const graph4Svg = d3.select("#graph4")
            .append("svg")
            .attr("width", graphWidth )
            .attr("height", barGraphH + rightMargin.bottom)
            .append("g")
            .attr("transform", `translate(${rightMargin.left},${rightMargin.top})`);

    
    // console.log(barData1)

    const graph4xScale = d3.scaleBand()
                    .domain(Object.keys(barData1))
                    .range([0, graphWidth])
                    .padding(0.2);

    graph4Svg.append("g")
        .attr("transform", `translate(0,${barGraphH})`)
        .call(d3.axisBottom(graph4xScale));

    

    const graph4yScale = d3.scaleLinear()
                    .domain([0, d3.max(Object.values(barData1))])
                    .range([barGraphH, 0]);
    graph4Svg.append("g")
            .call(d3.axisLeft(graph4yScale));

           
    // A function that create / update the plot for a given variable:
    update = (data) => {
        d3.select("#graph4").selectAll('.bar').remove();
        d3.select("#graph4").selectAll('.bar-text').remove();

        const u = graph4Svg.selectAll(".bar")
        .data(Object.entries(data)).enter();

        // console.log(data)

        u
        .append("rect")
        .attr("class","bar")
        .transition()
        .duration(1000)
            .attr("x", d => graph4xScale(d[0]))
            .attr("y", d => graph4yScale(d[1]))
            .attr("width",  graph4xScale.bandwidth())
            .attr("height", d => barGraphH - graph4yScale(d[1]))
            .attr("fill", "steelblue")

        u.append("text")
        .transition()
        .duration(1000)
            .attr("class", "bar-text")
            .attr("x", d => graph4xScale(d[0]) + graph4xScale.bandwidth() / 2)
            .attr("y", d => graph4yScale(d[1]))
            .text(d => d[1].toFixed(2));
    }

    // Initialize the plot with the first dataset
    update(barData1)

    
        
    });

    // Add a label for each polygon
    const labels = mapSvg.selectAll("text")
        .data(geoJsonData.features)
        .enter()
        .append("text")
        .text(function(d) {
        // Set the label text to the name property
        return d.properties.school_dist;
        })
        .attr("x", function(d) {
        // Position the label at the centroid of the polygon
        return mapPath.centroid(d)[0];
        })
        .attr("y", function(d) {
        // Position the label at the centroid of the polygon
        return mapPath.centroid(d)[1];
        })
        .attr("text-anchor", "middle")
        .attr("font-family","Impact")
        .attr("font-size", "12px")
        .attr("fill", "#eeba0b");

    // Define a zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", function(event) {
        mapPaths.attr("transform", event.transform);
        labels.attr("transform", event.transform);
        });

    // Add the zoom behavior to the SVG container
    mapSvg.call(zoom);


})
