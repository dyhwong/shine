newUserBoo = true;

function showManage(){
            hideScores();
            hideLog();
			$('.welcome').hide();
            setTimeout(function() {
            $(".manage").fadeIn('slow');
            }, 200);
        }

function hideManage(){
    $(".manage").fadeOut('fast');
}

function showScores(){
    console.log('showing');
    hideManage();
    hideLog();
	$('.welcome').hide();
    setTimeout(function() {
        $('.displaytable').fadeIn('slow');
        $(".all").fadeIn('slow');
    }, 150);
}

function hideScores(){
    $(".all").fadeOut('fast');
    $('.score-container').fadeOut('fast');
}

function showLog() {
    hideManage();
    if (!newUserBoo){
    hideScores();
    setTimeout(function() {
        $('.score-container').fadeIn('slow');
        $('.chart-header').fadeIn('slow');
        $('#scoreChart').fadeIn('slow');
        $('#timeChart').fadeIn('slow');
        $('.all').fadeIn('all');
    }, 150);
    }
    else{
        $('.welcome').css({'margin-top': '150px'});
        setTimeout(function() {
        $('.welcome').fadeIn('slow');
    },150);
    }
}

function hideLog() {
    $('#scoreChart').fadeOut('fast');
	$('#timeChart').fadeOut('fast');
    $('.chart-header').fadeOut('fast');
}

var chart;
var chartData = [];
var timeData = [];
var chartCursor;

displayTimeChart = function () {
    // generate some data first
    generateTimeData();
    setTimeout(function() {
        // SERIAL CHART    
        chart2 = new AmCharts.AmSerialChart();
        chart2.pathToImages = "http://www.amcharts.com/lib/3/images/";
        chart2.dataProvider = timeData;
        chart2.categoryField = "date";
        chart2.balloon.bulletSize = 5;
        chart2.color = "#002E5F";
        
        // listen for "dataUpdated" event (fired when chart is rendered) and call zoomChart method when it happens
        chart2.addListener("dataUpdated", zoomChart2);
        
        // AXES
        // category
        var categoryAxis2 = chart2.categoryAxis;
        categoryAxis2.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis2.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis2.dashLength = 1;
        categoryAxis2.minorGridEnabled = true;
        categoryAxis2.position = "bottom";
        categoryAxis2.axisColor = "#aaa";
		categoryAxis2.axisThickness = 4;
		categoryAxis2.title = '';
		categoryAxis2.titleColor = '#004384';
		categoryAxis2.titleFontSize = 16;
        
        // value                
        var valueAxis2 = new AmCharts.ValueAxis();
        valueAxis2.axisAlpha = 1;
        valueAxis2.dashLength = 1;
		valueAxis2.axisThickness = 4;
		valueAxis2.axisColor = "#aaa";
		valueAxis2.title = 'daily time played (minutes)';
		valueAxis2.titleColor = '#002E5F';
        valueAxis2.color = "#00235F";
		valueAxis2.titleFontSize = 16;
        chart2.addValueAxis(valueAxis2);
        
        // GRAPH
        var graph2 = new AmCharts.AmGraph();
		graph2.customBullet = 'images/star2.png';
		graph2.bulletSize = 18;
        graph2.title = "yellow line";
        graph2.valueField = "timePlayed";
        graph2.bullet = "round";
        graph2.bulletBorderColor = "#FFFFFF";
        graph2.bulletBorderThickness = 2;
        graph2.bulletBorderAlpha = 1;
        graph2.lineThickness = 2;
        graph2.lineColor = "#002b5e";
        graph2.negativeLineColor = "#efcc26";
        graph2.hideBulletsCount = 50; // this makes the chart to hide bullets when there are more than 50 series in selection	
		graph2.balloonText = "[[category]]<br><b><span style='font-size:12px; color:'#aaa'; '>time: [[timePlayed]] min</span></b>";
        chart2.addGraph(graph2);
    
    
    // HORIZONTAL GREEN RANGE
    var guide2 = new AmCharts.Guide();
    guide2.value = 0;
    guide2.toValue = 10000;
    guide2.fillColor = "#004384";
    guide2.inside = true;
    guide2.fillAlpha = 0.5;
    guide2.lineAlpha = 0;
    valueAxis2.addGuide(guide2);
        
        // CURSOR
        chartCursor2 = new AmCharts.ChartCursor();
        chartCursor2.cursorPosition = "mouse";
        chartCursor2.pan = false; // set it to false if you want the cursor to work in "select" mode
        chart2.addChartCursor(chartCursor2);
        
        // SCROLLBAR
        var chartScrollbar2 = new AmCharts.ChartScrollbar();
        chart2.addChartScrollbar(chartScrollbar2);
        
        // WRITE
        chart2.write("timeChart");
    }, 100);
}

// generate some random data, quite different range
function generateTimeData() {
    var timePlayed = new Array()
    $.get(
        '/graphtimes', {}
    ).done(function(data) {
        timePlayed = data;
        console.log('ajax')
    });
    
    var firstDate = new Date();
    console.log(timePlayed.length);
    setTimeout(function() {
        firstDate.setDate(firstDate.getDate() - timePlayed.length + 1);
    
        for (var i = 0; i < timePlayed.length; i++) {
            // we create date objects here. In your data, you can have date strings 
            // and then set format of your dates using chart.dataDateFormat property,
            // however when possible, use date objects, as this will speed up chart rendering.
            var newDate = new Date(firstDate);
            newDate.setDate(newDate.getDate() + i);
            
            //var scores = Math.round(Math.random() * 3000) +500;
            
            timeData.push({
                date: newDate,
                timePlayed: Number((timePlayed[i]/60000).toFixed(2))
            });
            console.log('data pushed');
            console.log(timeData);
        }
    }, 100);
    setTimeout(function() {console.log(timePlayed);}, 50);
}

// this method is called when chart is first inited as we listen for "dataUpdated" event
function zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
}

function zoomChart2() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    chart2.zoomToIndexes(timeData.length - 40, timeData.length - 1);
}

displayScoreChart = function () {
    // generate some data first
    generateChartData();
    setTimeout(function() {
        // SERIAL CHART    
        chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "http://www.amcharts.com/lib/3/images/";
        chart.dataProvider = chartData;
        chart.categoryField = "date";
        chart.balloon.bulletSize = 5;
        chart.color = "#002E5F";
        
        // listen for "dataUpdated" event (fired when chart is rendered) and call zoomChart method when it happens
        chart.addListener("dataUpdated", zoomChart);
        
        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.dashLength = 1;
        categoryAxis.minorGridEnabled = true;
        categoryAxis.position = "bottom";
        categoryAxis.axisColor = "#aaa";
		categoryAxis.axisThickness = 4;
		categoryAxis.title = '';
		categoryAxis.titleColor = '#004384';
		categoryAxis.titleFontSize = 16;
        
        // value                
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.axisAlpha = 1;
        valueAxis.dashLength = 1;
		valueAxis.axisThickness = 4;
		valueAxis.axisColor = "#aaa";
		valueAxis.title = 'daily cumulative score';
		valueAxis.titleColor = '#002E5F';
        valueAxis.color = "#00235F";
		valueAxis.titleFontSize = 16;
        chart.addValueAxis(valueAxis);
        
        // GRAPH
        var graph = new AmCharts.AmGraph();
		graph.customBullet = 'images/star2.png';
		graph.bulletSize = 18;
        graph.title = "yellow line";
        graph.valueField = "scores";
        graph.bullet = "round";
        graph.bulletBorderColor = "#FFFFFF";
        graph.bulletBorderThickness = 2;
        graph.bulletBorderAlpha = 1;
        graph.lineThickness = 2;
        graph.lineColor = "#002b5e";
        graph.negativeLineColor = "#efcc26";
        graph.hideBulletsCount = 50; // this makes the chart to hide bullets when there are more than 50 series in selection	
		graph.balloonText = "[[category]]<br><b><span style='font-size:12px; color:'#aaa'; '>total score: [[scores]]</span></b>";
        chart.addGraph(graph);
    
    
    // HORIZONTAL GREEN RANGE
    var guide = new AmCharts.Guide();
    guide.value = 0;
    guide.toValue = 10000;
    guide.fillColor = "#004384";
    guide.inside = true;
    guide.fillAlpha = 0.5;
    guide.lineAlpha = 0;
    valueAxis.addGuide(guide);
        
        // CURSOR
        chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        chartCursor.pan = false; // set it to false if you want the cursor to work in "select" mode
        chart.addChartCursor(chartCursor);
        
        // SCROLLBAR
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);
        
        // WRITE
        chart.write("scoreChart");
    }, 100);
}

// generate some random data, quite different range
function generateChartData() {
    var scores = new Array()
    $.get(
        '/graphscores', {}
    ).done(function(data) {
        scores = data;
        console.log('ajax')
    });
    
    var firstDate = new Date();
    console.log(scores.length);
    setTimeout(function() {
        firstDate.setDate(firstDate.getDate() - scores.length + 1);
    
        for (var i = 0; i < scores.length; i++) {
            // we create date objects here. In your data, you can have date strings 
            // and then set format of your dates using chart.dataDateFormat property,
            // however when possible, use date objects, as this will speed up chart rendering.
            var newDate = new Date(firstDate);
            newDate.setDate(newDate.getDate() + i);
            
            //var scores = Math.round(Math.random() * 3000) +500;
            
            chartData.push({
                date: newDate,
                scores: scores[i]
            });
            console.log('data pushed');
            console.log(chartData);
        }
    }, 100);
    setTimeout(function() {console.log(scores);}, 50);
}

// this method is called when chart is first inited as we listen for "dataUpdated" event
function zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
}

// changes cursor mode from pan to select
/*
function setPanSelect() {
    chartCursor.pan = true;
    chart.validateNow();
}
*/
function load(){
    $.get(
        '/graphtimes', {}
        ).done(function(data) {
        var timePlayed = data;
        var newUser = (timePlayed.length==0);
        if (!newUser){
            $('.welcome').hide();
            $('.chart-header').show();
            displayScoreChart();
            displayTimeChart();
            $('.all').css({'display':'inline-block'});
            $('.high').css({'display':'block'});
            $('.displaytable').css({'display':'block'});
            $('.table-header').show();
            newUserBoo = false;
        }
        else{
            $('.welcome').show();
            $('.chart-header').hide();
        }
     });

};
load();