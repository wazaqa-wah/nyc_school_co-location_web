
var Stackmargin = {top: 10, right: 30, bottom: 20, left: 50},
    Stackwidth = 800 - Stackmargin.left - Stackmargin.right,
    Stackheight = 500 - Stackmargin.top - Stackmargin.bottom
    Stackpadding = 300;

// append the svg object to the body of the page
var Stacksvg = d3.select("#gradeStackedBar")
                  .append("svg")
                  .attr("width", Stackwidth + Stackmargin.left + Stackmargin.right)
                  .attr("height", Stackheight + Stackmargin.top + Stackmargin.bottom)
                  .append("g")
                  .attr("transform", `translate(${Stackmargin.left},${Stackmargin.top})`);

d3.csv("grade_count.csv").then( function(data) {

// List of StackedSubgroups = header of the csv files = soil condition here
  var Stacksubgroups = data.columns.slice(1)

// List of groups = species here = value of the first column called group -> I show them on the X axis
  var Stackgroups = data.map(d => (d.group))

// Add X axis
  var Stackx = d3.scaleBand()
                  .domain(Stackgroups)
                  .range([0, Stackwidth])
                  .padding([0.2])
      Stacksvg.append("g")
                  .attr("transform", `translate(0, ${Stackheight})`)
                  .call(d3.axisBottom(Stackx).tickSizeOuter(0));

// Add Y axis
  var Stacky = d3.scaleLinear()
            .domain([0, 400])
            .range([ Stackheight, 0 ]);
      Stacksvg.append("g")
            .call(d3.axisLeft(Stacky));

// color palette = one color per subgroup
  var color = d3.scaleOrdinal(d3.schemeTableau10);

//stack the data? --> stack per subgroup
  var stackedData = d3.stack().keys(Stacksubgroups)(data)

// Show the bars
Stacksvg.append("g")
          .selectAll("g")
          // Enter in the stack data = loop key per key = group per group
          .data(stackedData)
          // .enter()
          .join("g")
          .attr("fill", d => color(d.key))
          .selectAll("rect")
          // enter a second time = loop subgroup per subgroup to add all rectangles
          .data(d => d)
          .join("rect")
            .attr("x", d => Stackx(d.data.group))
            .attr("y", d => Stacky(d[1]))
            .attr("height", d => Stacky(d[0]) - Stacky(d[1]))
            .attr("width",Stackx.bandwidth())

var Stacklegend = Stacksvg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (Stackpadding + 12) + ', 0)');

    Stacklegend.selectAll('rect')
            .data(stackedData)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', function(d, i){
                return i * 18;
            })
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', function(d, i){
                return color(i);
            });
        
    Stacklegend.selectAll('text')
            .data(Stacksubgroups)
            .enter()
            .append('text')
            .text(function(d){
                return d;
            })
            .attr('x', 18)
            .attr('y', function(d, i){
                return i * 18;
            })
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'hanging')
            .attr('font-family','Verdana')
            .attr('font-size',10);
})