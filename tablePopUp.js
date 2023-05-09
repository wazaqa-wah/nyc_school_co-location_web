
$(document).ready(function() {
    $('.rSquare').hover(
    function() {
        console.log(this)
        var content = $(this).text();
        var tooltip = $("<div/>")
        .addClass("tooltip")
        .text('Only '+ content + ' percent of the variable observed can be explained by this module.')
        .appendTo("body");
        var position = $(this).position();
        tooltip.css({
        top: position.top + 350, 
        left: position.left + $(this).outerWidth() / 2 - tooltip.outerWidth() / 2
        }).fadeIn(200);
    },
    function() {
        $(".tooltip").remove();
    });
});


  
$(document).ready(function() {
    $('.pValue').hover(
    function() {
        console.log(this)
        var content = $(this).text();
        var tooltip = $("<div/>")
        .addClass("tooltip")
        .text(content + ' is a very small p-value, smaller than the threashold 0.05 which makes it statisticall significant. We can reject the Null hypothesis and say when a school is co-located, it has an impact on this variable of the school.')
        .appendTo("body");
        var position = $(this).position();
        tooltip.css({
        top: position.top + 350,
        left: position.left + $(this).outerWidth() / 2 - tooltip.outerWidth() / 2
        }).fadeIn(200);
    },
    function() {
        $(".tooltip").remove();
    });
});


 

$(document).ready(function() {
    $('.estimate').hover(
    function() {
        console.log(this)
        var content = $(this).text();
        var tooltip = $("<div/>")
        .addClass("tooltip")
        .text('For one unit in a co-located public school, the rate of change of this independent variable increase by ' + content + ' .')
        .appendTo("body");
        var position = $(this).position();
        tooltip.css({
        top: position.top + 350,
        left: position.left + $(this).outerWidth() / 2 - tooltip.outerWidth() / 2
        }).fadeIn(200);
    },
    function() {
        $(".tooltip").remove();
    });
}); 
