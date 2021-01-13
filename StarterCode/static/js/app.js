
// Initializes the page with a default plot
function init() {
    d3.json('samples.json').then((data)=>{
        //console.log(data);

        data.names.forEach(row => {
          //console.log(row);
            d3.select('#selDataset')
            .append('option')
            .text(row)
            .property('value');
        });
        getPlotforRequestedID(data.names[0]);
        getMetaData(data.names[0]);
    });
  };

function getMetaData(id){
  d3.json('samples.json').then((data)=>{
    // filter by ID
    var metadata=data.metadata.filter(meta=>meta.id.toString() === id)[0];
    console.log(metadata);
    d3.select('#sample-metadata').html('');
    Object.entries(metadata).forEach((row)=>{
      
      d3.select('#sample-metadata')
      .append('h6')
      .text(row[0] +' '+ ':' + ' ' +row[1] + '\n');
    });
  });

};

function getPlotforRequestedID(id){
    d3.json('samples.json').then((data)=>{
        console.log(data);
        
        // filter by ID
        var samples_id=data.samples.filter(s=>s.id.toString() === id)[0];
        //console.log(samples_id.id);

        //get top 10 sample_values for each filtered ID
        top10sample_values = samples_id.sample_values.slice(0,10).reverse();
        console.log('Top 10 Sample IDs:' + top10sample_values);
        
        //get top 10 otu_ids for each filtered ID
        top10otu_ids = samples_id.otu_ids.slice(0,10).reverse();
        console.log('Top 10 OTU IDs:' +top10otu_ids);
        // rename OTU ID as OTU_id
        plot_OTU_ID = top10otu_ids.map(d=> 'OTU_' + d);
        //get top 10 otu_labels for each filtered ID
        top10otu_labels = samples_id.otu_labels.slice(0,10).reverse();
        console.log('Top OTU Labels:' +top10otu_labels);

        var trace1={
          x:top10sample_values,
          y:plot_OTU_ID,
          text:top10otu_labels,
          type:'bar',
          orientation:'h',
          marker: {
            color: '#17BECF',
            opacity: 0.6,
            line: {
              color: 'rgb(8,48,107)',
              width: 1.5
            }
          },
        }

        var data = [trace1];

        var layout = {
          title: "BAR Chart for Top 10 OTU ID's for"+" " + samples_id.id,
          font:{
            family:'Raleway,sans-serif'
          },
          height:500,
          width:500,
          bargap:0.1,
          //yaxis:{title:"Top 10 OTU ID's"},
          xaxis:{title:'Top 10 Sample Values'},
        }

        var config = {
          scrollZoom: true,
         displaylogo:false, 
         responsive:true,
        }

        // bubble chart data config
        var trace2={
          x: top10otu_ids,
          y:top10sample_values,
          text:top10otu_labels,
          mode:'markers',
          marker:{
            size:top10sample_values,
            color:top10otu_ids,
          }
        }

        var data1 = [trace2];

        var layout1 = {
          title:'Bubble Chart for' + ' ' + samples_id.id,
          height:700,
          xaxis:{title:'Top 10 OTU ID"s'},
          yaxis:{title:'Top 10 Sample Values'},
          //width:700,
          //autosize:false,

        }

        var config = {
          scrollZoom: true,
          displaylogo:false, 
          responsive:true,
        }
        // using react function instead newPlot for better performance
        Plotly.react("bar",data,layout,config);
        Plotly.react('bubble',data1,layout1,config)


    })
}
// create the function for the change event
function optionChanged(id) {
  getPlotforRequestedID(id);
  getMetaData(id);
}
  init();

