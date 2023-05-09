
      // Set the dimensions and margins of the graph
      var margin1 = { top: 20, right: 30, bottom: 50, left: 60 };
      var width1 = 800 - margin1.left - margin1.right;
      var height1 = 500 - margin1.top - margin1.bottom;

      // Append the SVG object to the body of the page
      var svg1 = d3
        .select("#boroughGroupedBarCo")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.top + margin1.bottom)
        .append("g")
        .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

        console.log(d3.select("#boroughGroupedBarCo"));
      // Parse the Data
      d3.csv("co_location_borough_data.csv").then(function (data) {
        // List of subgroups = header of the csv files (excluded 'Borough' column)
        var subgroups1 = data.columns.slice(1);
        console.log(subgroups1);
        // List of groups = unique values of the 'Borough' column
        var groups1 = d3.map(data, function (d) {
          return d.Borough;
        });
        console.log(groups1);

        // Add X axis
        var x1 = d3.scaleBand().domain(groups1).range([0, width1]).padding([0.2]);
        svg1
          .append("g")
          .attr("transform", "translate(0," + height1 + ")")
          .attr("dummy", d=> console.log("test"))
          .call(d3.axisBottom(x1).tickSizeOuter(0));

        // Add Y axis
        var y1 = d3.scaleLinear().domain([0, 600]).range([height1, 0]);
        svg1
          .append("g")
          .call(d3.axisLeft(y1));

        // Another scale for subgroup position?
        var xSubgroup1 = d3.scaleBand().domain(subgroups1).range([0, x1.bandwidth()]).padding([0.05])

        // color palette
        var color1 = d3.scaleOrdinal().domain(subgroups1).range(["#00284b", "orange"]);

        // Add bars
        svg1
          .append("g")
          .selectAll("g")
          // Enter in data = loop group per group
          .data(data)
          .enter()
          .append("g")
            .attr("transform", function (d) {return "translate(" + x1(d.Borough) + ",0)";})
          .selectAll("rect")
          .data(function (d) {
            return subgroups1.map(function (key) {return { key: key, value: d[key] };});
          })
          .enter()
          .append("rect")
          .attr("x", function (d) {return xSubgroup1(d.key);})
          .attr("y", function (d) {return y1(d.value);})
          .attr("width", xSubgroup1.bandwidth())
          .attr("height", function (d) {return height1 - y1(d.value);})
          .attr("fill", function (d) {return color1(d.key);});

        svg1.append("circle").attr("cx",600).attr("cy",70).attr("r", 6).style("fill", "#00284b")
        svg1.append("circle").attr("cx",600).attr("cy",90).attr("r", 6).style("fill", "orange")
        svg1.append("text").attr("x", 620).attr("y", 70).text("Public School").style("font-size", "15px").attr("alignment-baseline","middle")
        svg1.append("text").attr("x", 620).attr("y", 90).text("Charter School").style("font-size", "15px").attr("alignment-baseline","middle")

        })




  