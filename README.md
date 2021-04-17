# Belly Button Biodiversity

### Background
Built an interactive dashboard to explore the [Belly Button Biodiversity dataset](http://robdunnlab.com/projects/belly-button-biodiversity/) which catalogs the microbes that colonize human navel.

The dataset reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.

###  Design

Using `Javascript`, `Plotly` and `D3js` library to read a `.json` file to generate the followings using a dropdown menu contaning the test subject ID:

* Demographic Information section.
* Bar Plot of the top 10 OTUs found in selected individuals.
* Bubble Chart that displays each sample.
* Gauge Chart representing weekly washing frequency.

All sections and charts mentioned above update everytime a new subject ID is selected.

### Reference
* Refer to the [Plotly.js documentation](https://plot.ly/javascript/) to learn more about this library.
* [Hulcr, J. et al.(2012) A Jungle in There: Bacteria in Belly Buttons are Highly Diverse, but Predictable.](http://robdunnlab.com/projects/belly-button-biodiversity/results-and-data/)
