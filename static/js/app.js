d3.json("../data/samples.json").then((data) => {
    // console.log(data.names[0]);
    var samples = data.samples;
    var metadata = data.metadata;

    function findId(value) {
        var id = d3.select('#selDataset').property("value")
        // console.log(`filter id: ${typeof(id)}`)
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

         //--------------------Demographic Info ---------------------------//

        // Grab default ID and change to Integer (it was a string) by using "+"
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
                    // console.log(`${key} : ${value}`)
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

        var randomColorBar = randomColors(slicedOtu);
        
        var trace1 = {
            x: slicedSamples,
            y: slicedOtu.map(function (d) {
                return `OTU ${d} `
            }),
            type: "bar",
            orientation: "h",
            marker: {
                color: randomColorBar,
            },
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
            // yaxis: {
                // ticks: 'inside',
            //   title: {
            //     text: 'OTU ID',
            //     font: {
            //       family: 'Courier New, monospace',
            //       size: 18,
            //       color: '#7f7f7f'
            //     }
            //   }
            // }
          };
        
          // Generate the Bar Plot to the div tag with id "bar"
        Plotly.newPlot("bar", barData, barLayout); 

        //---------------------Bubble Chart ---------------------------//
        var sortedSamples = sortedData[0].sample_values;
        var sortedOtu = sortedData[0].otu_ids;
        var sortedOtuLabels = sortedData[0].otu_labels;
        
        // Function to generate random color codes
        function randomColors(n) {
            var randomColorsArray = [];
            for (var i = 0; i < n.length; i++) {
              var randomNumber = Math.floor(Math.random()*16777215).toString(16);
              randomColorsArray.push(`#${randomNumber}`);
            }
            return randomColorsArray;
          };

        var randomColor = randomColors(sortedOtu);
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

        // Data
        bubbleData = [bubbleTrace1];

        // Plot layout
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

        // Plot the Bubble Chart to the div tag with id "bubble"
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


        //---------------------Gauge Chart ---------------------------//
        metadata.forEach((meta) => {
            if (meta.id === defaultID) {
                Object.entries(meta).forEach(([key, value]) => {

                    // This conditional statement is to store washing frequency to be used in the gauge chart
                    if (key === 'wfreq') {
                        var wfreq = value;

                        var gaugeData = [
                            {
                                domain: { x: [0, 1], y: [0, 1] },
                                value: wfreq,
                                title: {
                                    text:'Scrubs per Week',
                                    font: {
                                        family: 'Courier New, monospace',
                                        size: 22,
                                        },
                                    },
                                type: "indicator",
                                mode: "gauge+number",
                                marker: {
                                    size: 12,
                                    symbol: ['line-ew',"diamond-open","line-ew","line-ew","diamond-open","line-ew"]
                                },
                                gauge: {
                                    axis: {range: [null, 9],
                                             tickmode: "array", 
                                             tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                                             ticktext: ['0', '0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9']
                                            },
                                    bar: { color: "#4da6ff" },    
                                    steps: [
                                      { range: [0, 1], color: "#EBEBEB", name:'0-1'},
                                      { range: [1, 2], color: "#E2ECDA" },
                                      { range: [2, 3], color: "#D8EFC5" },
                                      { range: [3, 4], color: "#C8F0A8" },
                                      { range: [4, 5], color: "#B5F284" },
                                      { range: [5, 6], color: "#9EF15A" },
                                      { range: [6, 7], color: "#82F128" },
                                      { range: [7, 8], color: "#367602" },
                                      { range: [8, 9], color: "#204503", name: '8-9' }

                                    ],
                                }
                            }];
                        var gaugelayout = {
                            title: {
                            text:'Belly Button Washing Frequency',
                            font: {
                                family: 'Courier New, monospace',
                                size: 22,
                                },
                            },
                            width: 600, 
                            height: 500,
                        };
                        
                        // Plot the Gauge Chart to the div tag with id "gauge"
                        Plotly.newPlot('gauge', gaugeData, gaugelayout);

                    };
                });
            }   
        });
    };

    //--------------------------------------------------------//
    //                Function Subject ID Change              //
    //--------------------------------------------------------//
    function optionChanged() {
        var input = +d3.select(this).property("value")

        d3.select('#sample-metadata').html('');
        d3.select('#bar').html('');

        var idData = samples.filter(findId);

        var sortedData = idData.sort(function (a, b){
            return b.sample_values - a.sample_values;
        });

        // Slice values
        start = 0;
        end = 10;

        //Slice data for index 0 and grab top 10 values
        var slicedSamples = sortedData[0].sample_values.slice(start, end).reverse();
        var slicedOtu = sortedData[0].otu_ids.slice(start, end).reverse();

        //---------------------Bar Plot ---------------------------//
        var randomColorBar = randomColors(slicedOtu);
        var barTrace = {
            x: slicedSamples,
            y: slicedOtu.map(function (d) {
                return `OTU ${d} `
            }),
            // y: slicedOtu.map(d => `OTU ${d} `),
            // text: xxx,
            type: "bar",
            orientation: "h",
            marker: {
                color: randomColorBar},
        };

        // Data
        barData = [barTrace];

        // Layout
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
            // yaxis: {
            //      ticks: 'inside',
            //   title: {
            //     text: 'OTU ID',
            //     font: {
            //       family: 'Courier New, monospace',
            //       size: 18,
            //       color: '#7f7f7f'
            //     }
            //   }
            // }
          };

        // Generate the Bar Plot to the div tag with id "bar"
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

        // Data
        bubbleData = [bubbleTrace];

        // Layout
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

        // Plot the Bubble Chart to the div tag with id "bubble"
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

        //---------------------Gauge Chart ---------------------------//
        metadata.forEach((meta) => {
            if (meta.id === input) {
                Object.entries(meta).forEach(([key, value]) => {
                    // Thins conditional statement is to sytore qashing frequency to be used in the gauge chart
                    if (key === 'wfreq') {
                        var wfreq = value;
                        var gaugeData = [
                            {
                                domain: { x: [0, 1], y: [0, 1] },
                                value: wfreq,
                                title: {
                                    text:'Scrubs per Week',
                                    font: {
                                        family: 'Courier New, monospace',
                                        size: 22,
                                        },
                                    },
                                type: "indicator",
                                mode: "gauge+number",
                                marker: {
                                    size: 12,
                                    symbol: ['line-ew',"diamond-open","line-ew","line-ew","diamond-open","line-ew"]
                                },
                                gauge: {
                                    axis: {range: [null, 9],
                                             tickmode: "array", 
                                             tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                                             ticktext: ['0', '0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9']
                                            },
                                    bar: { color: "#4da6ff" },
                                        
                                    steps: [
                                      { range: [0, 1], color: "#EBEBEB" },
                                      { range: [1, 2], color: "#E2ECDA" },
                                      { range: [2, 3], color: "#D8EFC5" },
                                      { range: [3, 4], color: "#C8F0A8" },
                                      { range: [4, 5], color: "#B5F284" },
                                      { range: [5, 6], color: "#9EF15A" },
                                      { range: [6, 7], color: "#82F128" },
                                      { range: [7, 8], color: "#367602" },
                                      { range: [8, 9], color: "#204503" }

                                    ],
                                }
                            }];

                            var gaugelayout = {
                                title: {
                                text:'Belly Button Washing Frequency',
                                font: {
                                  family: 'Courier New, monospace',
                                  size: 22,
                                    },
                                },
                                width: 600, 
                                height: 500,
                            };
                        // Plot the Gauge Chart to the div tag with id "gauge"
                        Plotly.newPlot('gauge', gaugeData, gaugelayout);

                    };
                });
            }   
        });

        //--------------------- Demographic Info ---------------------------//
        // Update HTML by adding metadata info
        var list = d3.select('#sample-metadata').append('ul');
        list.style('list-style-type', 'none');
        list.attr('class', 'list-group');
        metadata.forEach((meta) => {
            // console.log(typeof(meta.id))
            if (meta.id === input) {
                Object.entries(meta).forEach(([key, value]) => {
                    // console.log(`${key} : ${value}`)
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