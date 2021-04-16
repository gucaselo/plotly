d3.json("../data/samples.json").then((data) => {
    // console.log(data.names[0]);
    var samples = data.samples;
    var metadata = data.metadata;

    function findId(value) {
        var id = d3.select('#selDataset').property("value")
        console.log(`filter id: ${typeof(id)}`)
        return +value.id === +id
    };

     // User ID input
    var userSelection = d3.select('#selDataset');

    d3.select(window).on('load', initialLoad(data));
    userSelection.on('change', optionChanged);

    
    //--------------------------------------------------------//
    //                Function Initial Page Load              //
    //--------------------------------------------------------//
    function initialLoad(data) {
        counter = 0

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

         //--------------------Demographic Info ---------------------------//

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

        //---------------------Bar Plot ---------------------------//
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

        barData = [trace1];

        var barLayout = {
            title: {
              text:'Top 10 OTUs for selected Subject ID',
              font: {
                family: 'Courier New, monospace',
                size: 21
              },
            },
            xaxis: {
              ticks: 'inside',
              title: {
                text: 'Sample values',
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              },
            },
            yaxis: {
                ticks: 'inside',
            //   title: {
            //     text: 'OTU ID',
            //     font: {
            //       family: 'Courier New, monospace',
            //       size: 18,
            //       color: '#7f7f7f'
            //     }
            //   }
            }
          };

        Plotly.newPlot("bar", barData, barLayout); 

        //---------------------Bubble Chart ---------------------------//
        var sortedSamples = sortedData[0].sample_values;
        var sortedOtu = sortedData[0].otu_ids;
        var sortedOtuLabels = sortedData[0].otu_labels;
        // var  = Math.floor(Math.random()*16777215).toString(16);
        function randomColors(n) {
            var randomColorsArray = [];
            for (var i = 0; i < n.length; i++) {
              var randomNumber = Math.floor(Math.random()*16777215).toString(16);
              randomColorsArray.push(`#${randomNumber}`);
            }
            return randomColorsArray;
          };

        var randomColor = randomColors(sortedOtu);
        // console.log(randomColor);
        var bubbleTrace1 = {
            x: sortedOtu,
            y: sortedSamples,
            text: sortedOtuLabels,
            mode: 'markers',
            marker: {
                color: randomColor,
                size: sortedSamples,
                // sizemode: 'area',
                // sizeref: 1,
            },
        };

        // data
        bubbleData = [bubbleTrace1];
        // console.log(data)

        var bubbleLayout = {
            title: {
              text:'Bubble Chart of selected Subject ID',
              font: {
                family: 'Courier New, monospace',
                size: 24
              },
            },
            xaxis: {
              ticks: 'inside',
              title: {
                text: 'OTU ID',
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              },
            },
            yaxis: {
              ticks: 'inside',
              title: {
                text: 'Sample Values',
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              }
            }
          };

        // Plot the Bubble Chart to the div tag with id "plot"
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    }

    //--------------------------------------------------------//
    //                Function Subject ID Change              //
    //--------------------------------------------------------//
    function optionChanged() {
        var input = +d3.select(this).property("value")
        console.log(typeof(input))

        d3.select('#sample-metadata').html('');
        d3.select('#bar').html('');

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

        //---------------------Bar Plot ---------------------------//
        var barTrace = {
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
        };
        // console.log(trace1)

        // data
        barData = [barTrace];
        console.log(barTrace)

        var barLayout = {
            title: {
              text:'Top 10 OTUs for selected Subject ID',
              font: {
                family: 'Courier New, monospace',
                size: 21
              },
            },
            xaxis: {
              ticks: 'inside',
              title: {
                text: 'Sample values',
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              },
            },
            yaxis: {
                 ticks: 'inside',
            //   title: {
            //     text: 'OTU ID',
            //     font: {
            //       family: 'Courier New, monospace',
            //       size: 18,
            //       color: '#7f7f7f'
            //     }
            //   }
            }
          };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", barData, barLayout); 

        //---------------------Bubble Chart ---------------------------//
        var sortedSamples = sortedData[0].sample_values;
        var sortedOtu = sortedData[0].otu_ids;
        var sortedOtuLabels = sortedData[0].otu_labels;
    
        function randomColors(n) {
            var randomColorsArray = [];
            for (var i = 0; i < n.length; i++) {
              var randomNumber = Math.floor(Math.random()*16777215).toString(16);
              randomColorsArray.push(`#${randomNumber}`);
            }
            return randomColorsArray;
          };

        var randomColor = randomColors(sortedOtu);
        console.log(randomColor);
        var bubbleTrace = {
            x: sortedOtu,
            y: sortedSamples,
            text: sortedOtuLabels,
            mode: 'markers',
            marker: {
                color: randomColor,
                size: sortedSamples,
                // sizemode: 'area',
                // sizeref: 1,
            },
        };
        // console.log(trace1)

        // data
        bubbleData = [bubbleTrace];
        // console.log(data)

        var bubbleLayout = {
            title: {
              text:'Bubble Chart of selected Subject ID',
              font: {
                family: 'Courier New, monospace',
                size: 24
              },
            },
            xaxis: {
              ticks: 'inside',
              title: {
                text: 'OTU ID',
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              },
            },
            yaxis: {
              ticks: 'inside',
              title: {
                text: 'Sample Values',
                font: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              }
            }
          };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


        //--------------------- Demographic Info ---------------------------//
        // Update HTML by adding metadata info
        var list = d3.select('#sample-metadata').append('ul');
        list.style('list-style-type', 'none');
        list.attr('class', 'list-group');
        metadata.forEach((meta) => {
            // console.log(typeof(meta.id))
            if (meta.id === input) {
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

    } 

});