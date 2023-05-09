
      // Set the dimensions and margins of the graph
      var margin = { top: 20, right: 30, bottom: 50, left: 60 };
      var width = 800 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;

      // Append the SVG object to the body of the page
      var svg = d3
        .select("#boroughGroupedBar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        console.log(d3.select("#boroughGroupedBar"));
      // Parse the Data
      d3.csv("borough_groupedCount.csv").then(function (data) {
        // List of subgroups = header of the csv files (excluded 'Borough' column)
        var subgroups = data.columns.slice(1);
        console.log(subgroups);
        // List of groups = unique values of the 'Borough' column
        var groups = d3.map(data, function (d) {
          return d.Borough;
        });
        console.log(groups);

        // Add X axis
        var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("dummy", d=> console.log("test"))
          .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        var y = d3.scaleLinear().domain([0, 600]).range([height, 0]);
        svg
          .append("g")
          .call(d3.axisLeft(y));

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.05])

        // color palette
        var color = d3.scaleOrdinal().domain(subgroups).range(["#00284b", "orange"]);

        // create a tooltip element
        var tooltip = d3.select("#boroughGroupedBar")
                      .append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

        // Add bars
        svg
          .append("g")
          .selectAll("g")
          // Enter in data = loop group per group
          .data(data)
          .enter()
          .append("g")
            .attr("transform", function (d) {return "translate(" + x(d.Borough) + ",0)";})
          .selectAll("rect")
          .data(function (d) {
            return subgroups.map(function (key) {return { key: key, value: d[key] };});
          })
          .enter()
          .append("rect")
          .attr("x", function (d) {return xSubgroup(d.key);})
          .attr("y", function (d) {return y(d.value);})
          .attr("width", xSubgroup.bandwidth())
          .attr("height", function (d) {return height - y(d.value);})
          .attr("fill", function (d) {return color(d.key);})
          
          svg.append("circle").attr("cx",600).attr("cy",70).attr("r", 6).style("fill", "#00284b")
          svg.append("circle").attr("cx",600).attr("cy",90).attr("r", 6).style("fill", "orange")
          svg.append("text").attr("x", 620).attr("y", 70).text("Public School").style("font-size", "15px").attr("alignment-baseline","middle")
          svg.append("text").attr("x", 620).attr("y", 90).text("Charter School").style("font-size", "15px").attr("alignment-baseline","middle")



       

        })




  