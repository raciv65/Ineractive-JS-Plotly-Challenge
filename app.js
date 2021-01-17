var data_file="Data/Data.json"

// Defaut
function ini(){


    var selection=d3.select("#TestSubject");
    // Adding options for dash board
    d3.json(data_file).then(function (data){
        data.names.forEach(function (sample,i){
            selection
                .append("option")
                .text(sample)
                .property("value", i) 
                
       });


    })
   //Add Bar Chart 
  Plots(0)
  //Add 
}

function Plots(sample_selected){

    d3.json(data_file).then(function(data){

              
        let sample_values=data.samples[sample_selected].sample_values;
        let string_otu_ids=[]
        
        let otu_ids=data.samples[sample_selected].otu_ids;
        let otu_labels=data.samples[sample_selected].otu_labels;
        
        otu_ids.forEach(element=>{
            string_otu_ids.push("OTU "+element)
        })

           //Bar chart 
        let BarChart_trace=[{
           type:"bar",
            x: sample_values.slice(0,10),
            y: string_otu_ids.slice(0,10),
             orientation: "h"
         }];
         let layout={
             title: "Selected"
         };


        Plotly.newPlot("BarChart",BarChart_trace, layout);


      
        //Bubble Chart
        let Bubble_trace=[{
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            text: otu_labels,
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: "Bluered"
                }
        }];

        let Bubble_layout = {
            title: 'Bubble Chart',
            showlegend: false
          
          };
    
          Plotly.newPlot("BubbleChart",Bubble_trace, Bubble_layout);
             
        // Add info chart
        let select_card=d3.select("#TextChart").selectAll('p')
        let metadata=data.metadata[sample_selected]
        
        text_inChart=[]

          for (var key in metadata){
            
            text_inChart.push(key+" : "+metadata[key])
           }
        
           select_card.data(text_inChart)
           .enter()
           .append("p")
           .merge(select_card.data(text_inChart))
           .text(d=>`${d}`)

           //Gauge Charts
           let Gauge_trace = [
            {   type: "category",
                domain: { x: [0], y: [0] },
                value: metadata.wfreq,
                text:[" ","8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1"]
                
                
                
            }
        ];
        
        let Gauge_layout = {
            title:"Belly Button Washing Frequency <br> Scrubs per Week",
             width: 600,
             height: 500,
             margin: { t: 0, b: 0 }
             };
        
             Plotly.newPlot('GaugeChart', Gauge_trace, Gauge_layout);

        
    })
    
}



ini()


// When change selection
d3.selectAll("#TestSubject")
    .on("change", function(){
        Plots(d3.select(this).property('value'))
    });


