var arrayol = [];

$('document').ready(function() {

	//define the margins for the graph
	var margins = {top:100,bottom:100,left:100,right:100},
		width = 800 - margins.left - margins.right,
		height = 500 - margins.top - margins.bottom;

	//define parse function
	var parsefunc = d3.time.format('%m/%d/%y').parse;
	//define axes

	//define x and y scales (functions that map from domain->range)
	var x = d3.time.scale().range([0,width]);
	var y = d3.scale.linear().range([height,0]);
	//then define xAxis and yAxis - functions that map from scales -> axes. 
	var xAxis = d3.svg.axis().scale(x).ticks(d3.time.years);
	var yAxis = d3.svg.axis().scale(y).ticks(4).orient('right');

	//define area fill (investigate)
	//define path (investigate)

	var svg = d3.select('.svgPlace').append('svg')
		.attr("height",height + margins.top + margins.bottom)
		.attr('width',width + margins.left + margins.right)
		.attr('id','svgid')

	//a line generation function
	var line = d3.svg.line()
    	.interpolate("monotone")
    	.x(function(d) { return x(d.date); })
    	.y(function(d) { return y(d.value); });

	function draw_axes(svg) {

	svg.append("rect").attr("height",height + margins.top + margins.bottom)
		.attr('width',width + margins.left + margins.right)
		.attr("stroke", "black").attr("stroke-width",1).attr("fill","white");
	svg = svg.append('g') //pretty clever - this changes the svg object so that the starting point is length margins.top down and margins.left to the left
			.attr('transform','translate('+margins.left+','+margins.top+')')
	svg.append('g') //g is a grouping element - way to organize things in d3
		.attr('class','x axis')
		.attr('transform','translate(0,'+height+')') //translate moves the point of origin so that the axes is positioned somewhereelse
		.call(xAxis)
	svg.append('g')
		.attr('class','y axis')
		.attr('transform','translate('+width+',0)')
		.call(yAxis)
		return svg
	}
	

	var currentVal = $('#currentValue');

	//Change the column headers. 
	function convertData(d) {
		d.value = parseFloat(d['25.6']);
		d.date = parsefunc(d['1/1/00']);
		return d
	}

	q = queue();
	q.defer(
		function (callback) {
				d3.csv('F28n.csv',function(data) {
				dataset=data;
				console.log(dataset);

				maxlength=dataset.length;
				callback(null,data)
			})}
	)
	q.await(
		function(err,res) {
			//there are two nulls in the data - will drop it here. 
			var filtered = res.filter(function (d) {
				
				if (d.value > 0) {
					return true;
				}
				else {
					return false
				}
			})
			arrayol = filtered;
			
			// x.domain([filtered[0].date,filtered[filtered.length - 1].date]);
			// var ymin = d3.min(filtered,function(d) {return d.value;});
			// var ymax = d3.max(filtered,function(d) {return d.value;});
			// console.log('min '+ymin + ',' + 'max '+ymax);
			// y.domain([ymin-10,ymax+10]).nice();
			// draw_axes(d3.select("#svgid"));

			console.log(res[0]);
			//populate the form <select> with options from each field
			$.each(res[0], function(field,value) {
				$('[name=DisplayFields]').append(
					$('<option></option>').val(field).html(field)
					)
			})
			
		}
		)

	
	$('#defaultSlider').change(function() {
			
			// every time the function changes, we need to clear the old circles
			$("#svgid").empty();
			currentVal.html(this.value);
			var setVal = this.value;
			
			var svg = draw_axes(d3.select("#svgid"));

			var last_dataset = dataset.filter(function(d,i) {
				var mappedVal = Math.ceil(setVal/100.0 * maxlength);
				if (i == mappedVal) { //This is pretty primitive
					return true;
				}
				else {
					return false;
				}
			})

			var up_to_last_dataset = dataset.filter(function(d,i) {
				
				if (d.date < last_dataset[0].date) { //This is pretty primitive
					return true;
				}
				else {
					return false;
				}
			})
		
			svg.selectAll("circle").data(last_dataset)
			.enter()
			.append("circle")
			
			.attr("cx",function(d,i) {
				return x(d.date);
			})
			.attr("cy",function(d,i) {
				console.log(y(d.value));
				return y(d.value);
				})
			.attr("r",function(d,i) {
				return 10;
			})

			svg.append('path')
				.attr('class','line')
				.attr('d',line(up_to_last_dataset))

		})
	

})

//make the axes skinnier - DONE
//put the balls in - DONE
//sync the data's range with the range of the graph - DONE
//have the ball leave a tail behind of lines

//replace the data filtration step with something better 

//choose which items to display: 
//drop down menu that loads the particular data. 

//also visualizing as a line instead of XX. 