d3.json("../data/samples.json").then((data) => {
    // console.log(data.names[0]);
    var samples = data.samples;
    var metadata = data.metadata;
    
    // data.metadata.forEach((d) =>console.log(d.id === '940'))

    // var ids = samples.map(function(name) {
    //     // for (i=0; i<names.lenght; i++)
    //     return name.id
    // });
    // // console.log(ids[0]);

    // var sampleValues = samples.map(function(values) {
    //     return values.sample_values
    // });
    // // console.log(sampleValues[0])
        
    // var otuIds = samples.map(function(otu) {
    //     return otu.otu_ids
    // });
    // // console.log(otuIds[0])

    // var otuLabels = samples.map(function(labels) {
    //     return labels.otu_labels
    // });
    // // console.log(otuLabels[0])


    function findId(value) {
        var id = d3.select('#selDataset').property("value")
        console.log(`filter id: ${id}`)
        return value.id === id
    };

     // User ID input
    var userSelection = d3.select('#selDataset');

    //////////////////////////////
//    Test 100% functional
    // d3.select("#selDataset").on("change", function() {
    //     value = d3.select(this).property("value")
    //     console.log(value);
    // });
    /////////////////////////
    
    d3.select(window).on('load', initialLoad(data));
    userSelection.on('change', optionChanged);

    function initialLoad (data) {
        counter = 0
        // var input = d3.select(this).property("value")
        // var idData = samples.filter(findId);
        // // Prevent default behavior 
        // d3.event.preventDefault();

        var samples = data.samples;
        var metadata = data.metadata;
        // console.log(metadata)

        // Get all Sample IDs from dataset
        datasetId = samples.map(object => object.id);

        // Update HTML by adding option tag with id values
        Object.values(datasetId).forEach((value) => {
            var option = d3.select('select').append('option');
            option.attr('value', value);
            // select first value by default
            if (counter === 0) {
                option.attr('selected')
                counter += 1
            };
            option.text(value);
    });
        // This returned a string
        // console.log(typeof(d3.select('#selDataset').property("value")))

        // Grab default ID and change to Integer (it returned as a string) by using "+"
        defaultID = +d3.select('#selDataset').property("value")
        // console.log(typeof(defaultID))

        // Update HTML by adding metadata info
        var list = d3.select('#sample-metadata').append('ul');
        list.style('list-style-type', 'none');
        list.attr('class', 'list-group');
        metadata.forEach((meta) => {
            // console.log(typeof(meta.id))
            if (meta.id === defaultID) {
                Object.entries(meta).forEach(([key, value]) => {
                    console.log(`${key} : ${value}`)
                    var data = list.append('li');
                    data.attr('class', 'list-group-item');
                    data.style('font-size', '9px');
                    data.style('font-weight', 'bold');
                    data.style('text-transform', 'capitalize');
                    // if (key.lowered() === 'ethnicity') {
                    //     splitValue = value.split("/");
                    //     data.text(`${key} : ${splitValue[0]}`);
                    // }
                    data.text(`${key} : ${value}`);
                });
            }   
        });

        //--------------------------------------------------------//
        //                        Bar Plot                        //
        //--------------------------------------------------------//
        var idData = samples.filter(findId);

        var sortedData = idData.sort(function (a, b){
            return b.sample_values - a.sample_values;
            });

        start = 0;
        end = 10;
        
        var slicedSamples = sortedData[0].sample_values.slice(start, end).reverse();
        var slicedOtu = sortedData[0].otu_ids.slice(start, end).reverse();
        
        var trace1 = {
            x: slicedSamples,
            y: slicedOtu.map(function (d) {
                return `OTU ${d} `
            }),
            type: "bar",
            orientation: "h",
        };

        data = [trace1];

        var layout = {
            title: 'Top 10 OTUs for selected Subject ID'
        };

        Plotly.newPlot("bar", data, layout); 
    }


    function optionChanged(samples) {
        var input = d3.select(this).property("value")
        console.log(input)
        var samples = data.samples;
        var metadata = data.metadata;

        d3.select('#sample-metadata').html('');
        d3.select('#bar').html('');

        // var userSelection = input.property("value")
        var idData = samples.filter(findId);
        console.log(idData);

        var sortedData = idData.sort(function (a, b){
            return b.sample_values - a.sample_values;
        });
        console.log(sortedData)

        // Slice values
        start = 0;
        end = 10;

        //Slice data for index 0 and grab top 10 values
        var slicedSamples = sortedData[0].sample_values.slice(start, end).reverse();
        var slicedOtu = sortedData[0].otu_ids.slice(start, end).reverse();
        console.log(slicedOtu)

        var trace1 = {
            x: slicedSamples,
            y: slicedOtu.map(function (d) {
                return `OTU ${d} `
            }),
            // y: slicedOtu.map(d => `OTU ${d} `),
            // text: (function (d) {
            //     return `OTU ${d}`;
            // }),
            type: "bar",
            orientation: "h",
            // width: 50
        };
        // console.log(trace1)

        // data
        data = [trace1];
        console.log(data)

        var layout = {
            title: 'Top 10 OTUs for selected Subject ID'
        };

        // svg.selectAll("*").remove();
        // d3.select("svg").remove();

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", data, layout); 
        // Plotly.restyle("bar", data, layout)

    } 

});