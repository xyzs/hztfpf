// JavaScript Document
$(function () {
    $('#chart_container').highcharts({
		chart: {
			type:"spline"
			},
        title: {
            text: '行程车速日趋势分析',
            x: -20 //center
        },
		xAxis: {
			allowDecimals:false,
			labels:{
				formatter:function() {
					return this.value+':00';
					}
				}
			},
        yAxis: {
            title: {
                text: '行程车速(公里/小时)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
			
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: '车速',
            data: []
        }
		]
    });
});

$(function () {
    $('#pie_container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
         title: {
            text: null
        },
        tooltip: {
    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
		legend:{
			align:"right",
			verticalAlign:'middle',
			layout:'vertical'
			},
		credits:{
			enabled:false
			},
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
					distance:10,
                    color: '#000000',
                    connectorColor: '#000000',
					connectorWidth: 2,//<b>{point.name}</b>: 
					inside:true,
                    format: '{point.percentage:.1f} %'
                },
				showInLegend:true
            }
        },
        series: [{
            type: 'pie',
            name: '行程车速分布',
            data: []
        }]
    });
});


	
$(document).ready(function(e) {
	var def_date = new Date();
	def_year = def_date.getYear();
	def_month = def_date.getMonth();
	def_day = def_date.getDay();
	def_zone = 1;//默认的区域编号
	
	
	
	data_req(def_year,def_month,def_day,def_zone); 
	rtetime_data_req(def_year,def_month,def_day,def_zone);
	rte_road_data_req(def_year,def_month,def_day,def_zone);
});

var t_itv=5
var max_val_time_l = 0
var max_val_time_r = t_itv/120;

var avg_val = -1

function data_update(data) {
	var max_val = -1;
	var max_val_time=0;
	var total_val = 0;
	
	chart_data = data;
	pie_data = new Array();
	pie_data.push(new Array("小于20公里/小时",0));
	pie_data.push(new Array("20—40公里/小时",0));
	pie_data.push(new Array("40-60公里/小时",0));
	pie_data.push(new Array("40-80公里/小时",0));
	pie_data.push(new Array("大于>80公里/小时",0));
	for (var i=0;i < data.length;i++) {
		tv=data[i];
		t = tv[0];
		v = tv[1];
		if(v>max_val){
			max_val = v;
			max_val_time = t; 
			}
		total_val+=v;
		
		//if (i == 0) {alert(v);alert(index)}
		if(v<20){pie_data[0][1]+=1/data.length;}
		if(v>=20&&v<40){pie_data[1][1]+=1/data.length;}
		if(v>=40&&v<60){pie_data[2][1]+=1/data.length;}
		if(v>=60&&v<80){pie_data[3][1]+=1/data.length;}
		if(v>=80){pie_data[4][1]+=1/data.length;}
		
		}
	max_val_time_l = max_val_time-t_itv/120;
	max_val_time_r = max_val_time+t_itv/120;
	var h = parseInt(max_val_time_l)>=10?String(parseInt(max_val_time_l)):('0'+String(parseInt(max_val_time_l)))
	var m = parseInt((max_val_time_l-parseInt(max_val_time_l))*60)
	m=m>=10?String(m):("0"+String(m))
	max_val_time_str=h+":"+m
	h = parseInt(max_val_time_r)>=10?String(parseInt(max_val_time_r)):('0'+String(parseInt(max_val_time_r)))
	m = parseInt((max_val_time_r-parseInt(max_val_time_r))*60)
	m=m>=10?String(m):("0"+String(m))
	max_val_time_str+="-"+h+":"+m
	$('#max_val').text(parseInt(max_val)+"   ↑");
	$('#time').text(max_val_time_str);
	avg_val = total_val/data.length
	$('#arv_val').text(parseInt(avg_val)+"  ↓");
	
	$('#total_val').text(parseInt(total_val)+"   ↓");
	//交通稳定度暂时没数据，用的是total_val/180
	$('#traf_stability').text(parseInt(total_val/180)+"   ↓"); 
	remove_avg_line()
	add_avg_line()
	remove_his_avg_line()
	add_his_avg_line(49)  
	$('#chart_container').highcharts().series[0].setData(chart_data);
	//$('#chart_container').highcharts().yAxis[0].setTitle({text:'行程车速(辆/'+t_itv+'分钟）'})
	$('#pie_container').highcharts().series[0].setData(pie_data);
	
	remove_max_timeband()
	add_max_timeband(max_val_time_l,max_val_time_r)
	 
	}
	
	
function rtetime_data_update(data) {
	$('#rtetime_max_val').text(data[1])
	$('#rtetime_min_val').text(data[0])
	$('#rtetime_arv_max_val').text(data[4])
	$('#rtetime_arv_arv_val').text(data[3])
	$('#rtetime_arv_min_val').text(data[2])
	}
	
	
function rte_road_data_update(data) {
	$(".rte_road_row").remove()
	for (var i = 0;i < data.length;i++) {
		
		$("#rte_roads").append("<tr class = 'rte_road_row'><td><div id='rte2_road_name'>"+data[i][0]+"</div></td><td><div id='rte2_max_val'>"+data[i][1]+"</div></td><td><div id='rte2_avg_val'>"+data[i][2]+"</div></td><td><div id='rte2_total_val'>"+data[i][3]+"</div></td></tr>")
		}
	
	
	
	
	}	
function rtetime_data_req(year,month,day,zone) {
	data = generate_rtetime_data()
	rtetime_data_update(data)
	}

function rte_road_data_req(year,month,day,zone) {
	data = generate_rteroad_data()
	rte_road_data_update(data)
	}

function data_req(year,month,day,zone) {
	data = generate_data()
	data_update(data)
	}


	
function set_t_itv(itv) {
	t_itv = itv
	}


var pline_id_pref='trfctl_l'
function add_tfctl_line() {
	chart = $('#chart_container').highcharts();
	chart.xAxis[0].addPlotLine({
                color:'red',            //线的颜色，定义为红色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:7.5,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,                //标示线的宽度，2px
				id:pline_id_pref+'1'
            });
	
	chart.xAxis[0].addPlotLine({
				color:'red',            //线的颜色，定义为红色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:8.5,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,               //标示线的宽度，2
				id:pline_id_pref+'2'
				});
		
	chart.xAxis[0].addPlotLine({
                color:'red',            //线的颜色，定义为红色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:17.5,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,                //标示线的宽度，2px
				id:pline_id_pref+'3'
            });
	
	chart.xAxis[0].addPlotLine({
				color:'red',            //线的颜色，定义为红色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:18.5,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,                //标示线的宽度，2
				id:pline_id_pref+'4'
				});	
	}
function remove_tfctl_line() {
	var chart = $('#chart_container').highcharts();
	for (var i = 0;i<4;i++) {
		var id=i+1
		chart.xAxis[0].removePlotLine(pline_id_pref+id+'');
		}
	
	
	}
band_id_pref = 'timeband'	
function add_max_timeband() {
	var chart = $('#chart_container').highcharts();
	chart.xAxis[0].addPlotBand({ // mark the weekend
                color: '#FF7F00',
                from: max_val_time_l,
                to: max_val_time_r,
				id: band_id_pref+'0'
            });
	}
function remove_max_timeband() {
	var chart = $('#chart_container').highcharts();
	chart.xAxis[0].removePlotBand(band_id_pref+'0')
	}


var avg_id_pref="avg_val_line"
function add_avg_line() {
	var chart = $('#chart_container').highcharts();
	chart.yAxis[0].addPlotLine({ // mark the weekend
              	color:'#1E90FF',            //线的颜色，定义为红色
                dashStyle:'ShortDot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:avg_val,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,               //标示线的宽度，2
				label:{
					text:"平均线",
					style: {
                        color: '#1E90FF',
                        fontWeight: 'bold'
                    }
					},
				id:avg_id_pref+'0'
            });
	}
	
function remove_avg_line() {
	var chart = $('#chart_container').highcharts();
	chart.yAxis[0].removePlotLine(avg_id_pref+'0');
	}


var his_avg_id_pref="his_avg_val_line"
function add_his_avg_line(h_avg_val) {
	var chart = $('#chart_container').highcharts();
	chart.yAxis[0].addPlotLine({ // mark the weekend
              	color:'#FF0000',            //线的颜色，定义为红色
                dashStyle:'ShortDot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:h_avg_val,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,               //标示线的宽度，2
				label:{
					align:'right',
					text:"历史平均线",
					style: {
                        color: '#FF0000',
                        fontWeight: 'bold'
                    }
					},
				id:his_avg_id_pref+'0'
            });
	}
	
function remove_his_avg_line() {
	var chart = $('#chart_container').highcharts();
	chart.yAxis[0].removePlotLine(his_avg_id_pref+'0');
	}
//test funciton

function generate_data() {
	dc = (24*60)/t_itv
	data = new Array()
	for (var i = 0;i<dc;i++) {
		t = i*t_itv/60;
		v = Math.random()*100;
		
		data.push([t,v]);
		}
	return data;
	}

function generate_rtetime_data() {
	data = new Array()
	data.push(100+parseInt(Math.random()*50))
	data.push(200+parseInt(Math.random()*50))
	data.push(300+parseInt(Math.random()*50))
	data.push(400+parseInt(Math.random()*50))
	data.push(1000+parseInt(Math.random()*50))
	return data
	}

var temp_road_name = new Array("文一路-保俶北路-教工路","教工路-余杭塘路-文一路","教工路-文二路-文一路","文一路-教工路-学院路","文一路-学院路-古翠路","学院路-文一路-余杭塘路","学院路-文一路-文二路")
function generate_rteroad_data() {
	data = new Array()
	for (var i = 0;i<7;i++) {
		h_data = new Array()
		h_data.push(temp_road_name[i])
		h_data.push(100+parseInt(Math.random()*50))
		h_data.push(200+parseInt(Math.random()*50))
		h_data.push(300+parseInt(Math.random()*50))
		data.push(h_data)
		}
	return data
	}
