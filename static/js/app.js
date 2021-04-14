d3.json("../data/samples.json").then((data) => {
    // console.log(data.names[0]);
    var samples = data.samples;

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


     // User ID input
    
    var userSelection = d3.select('#selDataset')
    // .attr('value')
    userSelection.on('change', optionChanged)
    function optionChanged () {

        console.log(userSelection.property("value"))
    }

   

    function findId(value) {
        return value.id === '941'
    };
    
    idData = samples.filter(findId);

    // console.log(samples.filter(findId));

    var sortedData = idData.sort(function (a, b){
        return b.sample_values - a.sample_values;
    });

    // Object.values(samples).forEach(value => console.log(value.id));

    // Get all Sample IDs from dataset
    datasetId = samples.map(object => object.id);

    // Update HTML by adding option tag with id values
    Object.values(datasetId).forEach((value) => {
        var option = d3.select('select').append('option');
        option.attr('value', value)
        option.text(value)

    })


    


    // result.forEach(value => {
    //     var rows = tbody.append('tr')
    //     Object.entries(value).forEach(([key, value]) => {
    //         var data = rows.append('td');
    //         data.text(value);
    // console.log(sortedData[0].otu_ids.slice(0, 10))
    
// ///////////////////////////////////////////////////////////////////////////
//     function sortTwoArrays (samples, ids) {
//         var combined = [{'samples' : samples,
//                 'otu': ids}];

//         // for (var i=0; i < sliced1.lenght; i++) {
//         //     combined.push({'arr1' : sliced1[i], 'arr2' : sliced2[i]});
//         // }
//         // return combined
//         combined.sort(function(a, b) {
//             return b.samples - a.samples;
//         });
        
//         return combined
//     };
//     sorted = sortTwoArrays(sampleValues, otuIds)
//     // console.log(sorted[0].samples.length)

//     // Slice values
//     start = 0;
//     end = 10;

//     // Create empty arrays
//     samplesData = [];
//     otuId = [];
    
//     // Separate data into two arrays
//     for (j=0; j < sorted[0].samples.length; j++) {
//         samplesData.push(sorted[0].samples[j]);
//         otuId.push(sorted[0].otu[j]);
//     };
//     // console.log(samplesData)
//     // console.log(otuId)

//     //Slice data for index 0 and grab top 10 values
//     var slicedSamples = samplesData[0].slice(start, end);
//     var slicedOtu = otuId[0].slice(start, end);

//     // console.log(slicedSamples);
//     // console.log(slicedOtu);
// ////////////////////////////////////////////////////////////////////   

    // Slice values
    start = 0;
    end = 10;
    
    // console.log(sortedData[0].otu_ids.slice(0, 10))

    //Slice data for index 0 and grab top 10 values
    var slicedSamples = sortedData[0].sample_values.slice(start, end);
    var slicedOtu = sortedData[0].otu_ids.slice(start, end);

    var trace1 = {
        x: slicedSamples,
        y: slicedOtu,
        // text: (function (d) {
        //     return `OTU ${d}`;
        // }),
        type: "bar",
        orientation: 'h'
        // width: 50
    };

    // data
    data = [trace1];

    var layout = {
        title: 'Top 10 OTUs pero individual ID'
    };

   // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", data, layout); 

});

{/* <option value=""> 941</option> */}

// d3.json("data/samples.json", function(error, data) {
//     console.log(data);
// });

// d3.json("data/samples.json", function(data) {
//         console.log(data[0].names)
// });
///////////////////////////////////////
// combined = []
// x= [1167, 2859, 482, 2264, 41, 1189, 352, 189, 2318, 1977];
// y= [163, 126, 113, 78, 71, 51, 50, 47, 40, 40]

// var combined = [{'samples' : x,
//                 'otu': y}];
//////////////////////////////////////

// for (var i=0; i < x.lenght; i++) {
//     combined.push({'arr1' : x[i], 'arr2' : y[i]});
// }