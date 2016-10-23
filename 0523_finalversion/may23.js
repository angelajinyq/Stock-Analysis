/**
 * Created by Devin Liu on 2016/5/23.
 */
document.addEventListener("reset", function() {
    document.getElementById("results").innerHTML = "";
});

$(document).ready(function() {
    $("#submitStock").click(function(event) {
        event.preventDefault();
        var stockArray = [];
        var dates = [];
        var close_mat = [['raw close data']];
        var volume_mat = [['raw volume data']];
        var return_mat = [['raw return data']];

        var data = clickSubmit(stockArray,dates,close_mat,volume_mat,return_mat);
        //update_value(data[0],data[1]);
    });
});

function clickSubmit(stockArray,dates,close_mat,volume_mat,return_mat) {

    document.getElementById("results").innerHTML = "";

    stock = $("#stockSymbol").val();
    date_start = $("#date_start").val();
    date_end = $("#date_end").val();
    data_freq = $("#data_freq").val();
    // var stockArray = new Array();
    stockArray = stock.split(",");
    stockArray.push('^GSPC');

    // var return_mat = new Array(stockArray.length);

    function createArray(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = createArray.apply(this, args);
        }

        return arr;
    }

    // -------start "for" loop: --------- //
    for (var index = 0; index < stockArray.length; index++) {
        var url = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol ="'+stockArray[index]+'" and startDate="'+date_start+'" and endDate="'+date_end+'"&format=json&env=store://datatables.org/alltableswithkeys';

        var last_ajax = $.ajax({
            url: url,
            dataType: 'json',
            // cache: false,
            success: function (data) {
                var quotes = data.query.results.quote;

                var ticker = quotes.map(function (quote) {
                    return quote.Symbol;
                });
                document.getElementById("results").innerHTML += "Ticker: " + ticker[0].toUpperCase() + " <br />";

                dates = quotes.map(function (quote) {
                    return quote.Date;
                });

                var opens = quotes.map(function (quote) {
                    return quote.Open;
                });
                var highs = quotes.map(function (quote) {
                    return quote.High;
                });
                var lows = quotes.map(function (quote) {
                    return quote.Low;
                });
                var close = quotes.map(function (quote) {
                    return quote.Close;
                });
                var volume = quotes.map(function (quote) {
                    return quote.Volume;
                });
                var adj_close = quotes.map(function (quote) {
                    return quote.Adj_Close;
                });

                if (data_freq === 'w') {
                    // weekly data
                    var days = [];
                    for (var i = 0; i < dates.length; i++) {
                        var date_temp = dates[i].split('-');
                        days.push(new Date(date_temp[0], Number(date_temp[1]) - 1, date_temp[2]).getDay());
                    }

                    var weekly_date = new Array;
                    var weekly_open = new Array;
                    var weekly_highs = new Array;
                    var weekly_lows = new Array;
                    var weekly_close = new Array;
                    var weekly_volume = new Array;
                    var weekly_adj_close = new Array;

                    var temp_vol = new Array;
                    var last = 0;

                    for (var i = 0; i < days.length; i++) {
                        temp_vol.push(volume[i]);
                        if (days.length == i + 1 || days[i + 1] > days[i]) {
                            weekly_date.push(dates[last]);
                            weekly_open.push(opens[last]);
                            weekly_highs.push(math.max.apply(null, highs.slice(last, i + 1)));
                            weekly_lows.push(math.min.apply(null, lows.slice(last, i + 1)));
                            weekly_close.push(close[i]);
                            weekly_adj_close.push(adj_close[i]);

                            var vol = 0;
                            for (var j = 0; j < temp_vol.length; j++) {
                                vol += parseFloat(temp_vol[j]);
                            }
                            weekly_volume.push(vol);
                            temp_vol = [];
                            last = i + 1;
                        }
                    }
                    dates = weekly_date;
                    opens = weekly_open;
                    close = weekly_close;
                    highs = weekly_highs;
                    lows = weekly_lows;
                    volume = weekly_volume;
                    adj_close = weekly_adj_close;
                }
                else if (data_freq === 'm') {
                    // Monthly Data
                    var months = [];
                    for (i = 0; i < dates.length; i++) {
                        var date_temp = dates[i].split('-');
                        months.push(new Date(date_temp[0], Number(date_temp[1]) - 1, date_temp[2]).getMonth());
                    }
                    var monthly_date = new Array;
                    var monthly_open = new Array;
                    var monthly_highs = new Array;
                    var monthly_lows = new Array;
                    var monthly_close = new Array;
                    var monthly_volume = new Array;
                    var monthly_adj_close = new Array;

                    var temp_vol = new Array;
                    var last = 0;
                    for (i = 0; i < months.length; i++) {
                        temp_vol.push(volume[i]);
                        if (months.length == i + 1 || months[i + 1] < months[i]) {
                            monthly_date.push(dates[last]);
                            monthly_open.push(opens[last]);
                            monthly_highs.push(math.max.apply(null, highs.slice(last, i + 1)));
                            monthly_lows.push(math.min.apply(null, lows.slice(last, i + 1)));
                            monthly_close.push(close[i]);
                            monthly_adj_close.push(adj_close[i]);
                            var vol = 0;
                            for (var j = 0; j < temp_vol.length; j++) {
                                vol += parseFloat(temp_vol[j]);
                            }
                            monthly_volume.push(vol);
                            temp_vol = [];
                            last = i + 1;
                        }
                    }
                    dates = monthly_date;
                    opens = monthly_open;
                    close = monthly_close;
                    highs = monthly_highs;
                    lows = monthly_lows;
                    volume = monthly_volume;
                    adj_close = monthly_adj_close;
                }


                // Mean of Opens
                var opensTotal = 0;
                for (var i = 0; i < opens.length; i++) {
                    opensTotal += opens[i] - 0;
                }
                var opensMean = opensTotal/opens.length;

                /*
                 ADDING INDEX AFTER OPENMEAN:
                 document.getElementById("results").innerHTML +=  " Opens Mean " + index + " = " + opensMean.toFixed(2) + "<br />";
                 */
                document.getElementById("results").innerHTML +=  " Opens Mean =" + opensMean.toFixed(2) + "<br />";


                // Mean of Highs
                var highsTotal = 0;
                for (var i = 0; i < highs.length; i++) {
                    highsTotal += highs[i] - 0;
                }
                var highsMean = highsTotal/highs.length;
                document.getElementById("results").innerHTML += "Highs Mean =" + highsMean.toFixed(2) + "<br />";

                // Mean of Lows
                var lowsTotal = 0;
                for (var i = 0; i < lows.length; i++) {
                    lowsTotal += lows[i] - 0;
                }
                var lowsMean = lowsTotal/lows.length;
                document.getElementById("results").innerHTML+= "Lows Mean =" + lowsMean.toFixed(2) + "<br />";

                // Mean of Volume
                var volumeTotal = 0;
                for (var i = 0; i < volume.length; i++) {
                    volumeTotal += volume[i] - 0;
                }
                var volumeMean = volumeTotal/volume.length;
                document.getElementById("results").innerHTML += "Volume Mean =" + volumeMean.toFixed(0) + "<br />";

                // Mean of Adjusted Closes
                var adj_closeTotal = 0;

                var stockReturn = new Array();
                for (var i = 0; i < adj_close.length; i++) {
                    adj_closeTotal += adj_close[i] - 0;
                    if (i < (adj_close.length - 1)) {
                        stockReturn[i] = ((adj_close[i+1] - 0) - (adj_close[i] - 0))/(adj_close[i] - 0);
                    }
                }
                close_mat.push(adj_close);
                volume_mat.push(volume);
                return_mat.push(stockReturn);

                var adj_closeMean = adj_closeTotal/adj_close.length;
                var sumReturn = 0; // <-- **** This is changed in group to = 1;
                for (var i = 0; i < stockReturn.length; i++) {
                    sumReturn += stockReturn[i] - 0;
                }
                var meanReturn = sumReturn/stockReturn.length;
                document.getElementById("results").innerHTML += "Adjusted Close Mean =" + adj_closeMean.toFixed(2) + "<br />";

                document.getElementById("results").innerHTML += "Mean Return =" + meanReturn + "<br />";

                document.getElementById("results").innerHTML += "<br />";


            },

            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }
        });
    
    function check_ajax(){
        if(index == stockArray.length-1){
            if(return_mat.length != stockArray.length){
                setTimeout(check_ajax,100);
            }
        }
    }
    check_ajax();

    }


    function wait(){
        console.log('check ajax');
        console.log(stockArray.length);
        console.log(index);
        console.log(return_mat.length);
        if(return_mat.length == stockArray.length + 1) {
            update_value(stockArray, return_mat,0.02);
            draw_chart(dates,close_mat,volume_mat);
        }
        else{
            setTimeout(wait, 100);
        }
    }

    wait();

    console.log(return_mat);
    console.log('bcd');
    console.log(new Date());
    return [stockArray,return_mat];
}

function update_value(stockArray,return_mat,Rf) {

    //var return_mat = [[-0.00709633353045535, -0.002382429875972025, -0.035223880597014916, 0.01299511138613851, 0.0012216248490150411, 0.01281275245959453, 0.0060241566265059575, 0.026946046290655806, -0.025072944606413832, 0.01136369685189567, -0.01419278533412173, 0.03179370125974797, 0.008139476270960655, 0.06574394463667824],[-0.00709633353045535, -0.002382429875972025, -0.035223880597014916, 0.01299511138613851, 0.0012216248490150411, 0.01281275245959453, 0.0060241566265059575, 0.026946046290655806, -0.025072944606413832, 0.01136369685189567, -0.01419278533412173, 0.03179370125974797, 0.008139476270960655, 0.06574394463667824],[-0.00709633353045535, -0.002382429875972025, -0.035223880597014916, 0.01299511138613851, 0.0012216248490150411, 0.01281275245959453, 0.0060241566265059575, 0.026946046290655806, -0.025072944606413832, 0.01136369685189567, -0.01419278533412173, 0.03179370125974797, 0.008139476270960655, 0.06574394463667824],[-0.00709633353045535, -0.002382429875972025, -0.035223880597014916, 0.01299511138613851, 0.0012216248490150411, 0.01281275245959453, 0.0060241566265059575, 0.026946046290655806, -0.025072944606413832, 0.01136369685189567, -0.01419278533412173, 0.03179370125974797, 0.008139476270960655, 0.06574394463667824],[-0.005983486295082124, 0.0037204985465483817, -0.00020513666969827475, 0.009500711392836005, -0.009701609289259791, 0.008550785019257061, 0.00016949386508674768, 0.009653823458192032, -0.012329723957263469, -0.0007529293115636109, -0.0031645927543149177, 0.0002390650814483781, 0.005972346474723791, 0.008752581444892599]];
    var stock_data = [];
    var ratio_array = [];
    var Rm = return_mat[return_mat.length-1];
    var mean_Rm = ss.mean(Rm);
    for(var i = 1; i < return_mat.length-1; i++)
    {
        var Ri = return_mat[i];
        var mean_Ri = ss.mean(Ri);

        var beta_nume = 0;
        var beta_denom = 0;
        for(var j = 0; j < Ri.length;j++){
            beta_nume += (Ri[j] - mean_Ri) * (Rm[j] - mean_Rm);
            beta_denom += math.pow( (Rm[j] - mean_Rm),2);
        }
        var beta_i = beta_nume/beta_denom;

        var alpha_i = mean_Ri - beta_i * mean_Rm;

        var sigma_numo = 0;
        for(var j = 0; j < Ri.length;j++){
            sigma_numo += math.pow( (Ri[j] - alpha_i - beta_i * Rm[j] ),2);
        }
        var sigma_i = sigma_numo / (Ri.length - 2);

        var sort_ratio_i = (mean_Ri - Rf) / beta_i;

        var k_i = (mean_Ri - Rf) * beta_i / sigma_i;

        var l_i = math.pow(beta_i , 2) / sigma_i;

        stock_data.push({
            ticker : stockArray[i],
            return_values : Ri,
            beta : beta_i,
            alpha : alpha_i,
            sigma : sigma_i,
            k : k_i,
            l : l_i,
            sort_ratio : sort_ratio_i
        });

        ratio_array.push(sort_ratio_i);
    }


    function sortWithIndeces(toSort) {

        for (var i = 0; i < toSort.length; i++) {
            toSort[i] = [toSort[i], i];
        }

        toSort.sort(function(left, right) {
            return left[0] < right[0] ? -1 : 1;
        });

        toSort.sortIndices = [];

        for (var j = 0; j < toSort.length; j++) {
            toSort.sortIndices.push(toSort[j][1]);
            toSort[j] = toSort[j][0];
        }

        return toSort;
    }

    function sort_stocks(data,toSort){
        var sorted_array = sortWithIndeces(toSort);
        var temp = [];
        for(var i = 0; i<data.length;i++){
            temp.push(data[sorted_array.sortIndices[i]]);
        }
        return temp;
    }

    var new_stock_data = sort_stocks(stock_data, ratio_array);
    console.log(new_stock_data);

    var sigma_sp500 = 0;
    for(var i = 0; i < Rm.length; i++)
    {
        sigma_sp500 += math.pow((Rm[i] - mean_Rm),2);
    }
    sigma_sp500 = sigma_sp500/Rm.length;

    var c_array = [];
    for(var i = 0; i < stockArray.length-1; i++){
        sumK_i = 0;
        sumL_i = 0;
        for(var j=0; j < i+1; j++){
            console.log(i);
            console.log(j);
            console.log(new_stock_data[j]);
            sumK_i += new_stock_data[j].k;
            sumL_i += new_stock_data[j].l;
        }
        c_array[i] = sigma_sp500 * sumK_i / (1+ sigma_sp500 * sumL_i);
    }

    var c_star = c_array[c_array.length - 1];

    var z_array = [];
    for(var i = 0; i< stockArray.length-1; i++){
        z_array[i] = new_stock_data[i].l * ( new_stock_data[i].sort_ratio * c_star);
    }
    var z_sum = math.sum(z_array);

    var x_array = [];
    for(var i = 0; i< stockArray.length-1; i++){
        x_array[i] = z_array[i] / z_sum;
    }

    console.log('Asset allocation');
    console.log(x_array);
    document.getElementById("results").innerHTML += "<br />";
    document.getElementById("results").innerHTML += "Suggested Allocation: SIM model <br />";
    for(var i=0;i<x_array.length;i++)
    {
        document.getElementById("results").innerHTML += stockArray[i].toUpperCase() + ": "+ x_array[i].toFixed(4)*100 + "%<br />";  
    }
    document.getElementById("results").innerHTML += "<br />";


}

function draw_chart(dates,close_mat,volume_mat){

    var close_data = close_mat[close_mat.length - 1];
    var volume_data = volume_mat[close_mat.length - 1];

    var moveChart = dc.lineChart('#chart1');
    var volumeChart = dc.barChart('#chart2');

    var dateFormat = d3.time.format('%Y-%m-%d');
    var numberFormat = d3.format('.2f');

    function create_json(close_data,volume_data){
        var temp = new Array();
        for (var i = 0; i < close_data.length; i++) {
            temp.push( {
                //dd : dateFormat.parse(dates.reverse()[i]),
                //dd : dates.reverse()[i],
                dd: i,
                close : +close_data.reverse()[i],
                //open : +opens.reverse()[i],
                volume : +volume_data.reverse()[i]
            } );
        }
        return temp;
    }
    var data = create_json(close_data,volume_data);

    //var data = [{dd: 1, close:20,volume:50000000}, {dd: 2, close:25,volume:50000000}, {dd: 3, close:15,volume:50000000}, {dd: 4, close:30,volume:50000000}]

    console.log(data);
    var ndx = crossfilter(data);
    //var all = ndx.groupAll();

    // Dimension by full date
    var dateDimension = ndx.dimension(function (d) {
        return d.dd;
    });

    //// Group by total volume within move, and scale down result
    var volumeByDayGroup = dateDimension.group().reduceSum(function (d) {
        return d.volume / 500000000;
    });
    var DailyPriceGroup = dateDimension.group().reduceSum(function (d) {
        return d.close;
    });
    //#### Stacked Area Chart
    //Specify an area chart by using a line chart with `.renderArea(true)`.
    // <br>API: [Stack Mixin](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#stack-mixin),
    // [Line Chart](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md#line-chart)
    moveChart
    //.renderArea(true)
        .width(990)
        .height(400)
        .transitionDuration(1000)
        .margins({top: 30, right: 50, bottom: 25, left: 40})
        .dimension(dateDimension)
        .mouseZoomable(true)
        .rangeChart(volumeChart)
        .x(d3.scale.linear().domain([0, close_data.length]))
        .y(d3.scale.linear().domain([ss.min(close_data) - ss.min(close_data)*0.03 , ss.max(close_data) + ss.max(close_data)*0.03]))
        //.xUnits(d3.time.days)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        //.legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
        //.brushOn(false)
        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
        // legend.
        // The `.valueAccessor` will be used for the base layer
        .group(DailyPriceGroup, 'Daily Index Adj_close')
        .valueAccessor(function (d) {
            return d.value;
        });
    //.stack(DailyPriceGroup, 'Daily Index Adj_close', function (d) {
    //    return d.value;
    //});
    //.compose([
    //    dc.lineChart(moveChart).group(DailyPriceGroup)
    //])
    //.title(function (d) {
    //    var value = d.value.avg ? d.value.avg : d.value;
    //    if (isNaN(value)) {
    //        value = 0;
    //    }
    //    return dateFormat(d.key) + '\n' + numberFormat(value);
    //});

    volumeChart
        .width(990) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
        .height(300)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .dimension(dateDimension)
        .group(volumeByDayGroup)
        .x(d3.scale.linear().domain([0, close_data.length]))
        .y(d3.scale.linear().domain([ss.min(close_data) - ss.min(close_data)*0.03 , ss.max(close_data) + ss.max(close_data)*0.03]))
        //.xUnits(d3.time.days)
        .elasticY(true);

    dc.renderAll();
    dc.redrawAll();
    console.log($('#chart1'));
    console.log($('#chart2'));


}