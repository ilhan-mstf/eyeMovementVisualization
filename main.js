window.onload = function() {

    var width = $(document).width(),
        height = $(document).height();

    var gridColor = "#F6004F",
        curveColor = "#666";

    var paused = false,
        finished = false,
        animationStarted = false;

    var svg = d3.select("#animationCanvas").append("svg").attr("width", width).attr("height", height);

    // Start animation
    function startAnimation() {
        curveHeight = 0;
        animationStarted = true;
        finished = false;
        drawMovements(0);
    }

    function drawMovements(i) {
        var path = svg.append("path")
            .attr("d", "M " + data[i].x1 + " " + data[i].y + " Q " + (data[i].x1 + (data[i].x2 - data[i].x1) / 2) + " " + (data[i].y - 30) + " " + data[i].x2 + " " + data[i].y)
            .attr("stroke", gridColor)
            .attr("stroke-width", "1")
            .attr("fill", "none");

        var totalLength = path.node().getTotalLength();

        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(data[i].duration)
            .ease("linear")
            .attr("stroke-dashoffset", 0)
            .each("end", function() {
                if (i + 1 < data.length) {
                    drawMovements(i + 1);
                }
            });
    }

    $("#startButton").click(function() {
        $(this).fadeOut(function() {
            startAnimation();
        });
    });

}
