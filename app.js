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
           level = metadata.wfreq


           var degrees = ((level)*20-180)*-1;
           
           radius = .5;
           var radians = degrees * Math.PI / 180;
           var x = radius * Math.cos(radians);
           var y = radius * Math.sin(radians);
     
           //Path to set needle
            var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
                pathX = String(x),
                space = ' ',
                pathY = String(y),
                pathEnd = ' Z';
            var path = mainPath.concat(pathX,space,pathY,pathEnd);
     
           var Gauge_data = [{ type: 'category',
             x: [0], y:[0],
               marker: {size: 28, color:'black'},
               showlegend: false,
               name: 'Scrubs per week',
               text: level,
               hoverinfo: 'text+name'
             },
             { values: [10,10/9,10/9,10/9,10/9,10/9,10/9,10/9,10/9,10/9],
               rotation: 90,
               
               text: [" ","8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1"],
               textinfo: 'text',
               textposition:'inside',      
               marker: {colors:['rgba(255,255,255,1)','rgba(0,105,11,.5)','rgba(10,120,22,0.5)','rgba(14,127,0,0.5)','rgba(110,154,22,.5)','rgba(170,202,42,.5)','rgba(202,209,95,.5)','rgba(210,206,145,.5)','rgba(232,225,202,.5)','rgba(240,230,215,.5)']},
               labels: [" ","8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1"],
               hoverinfo: 'label',
               hole: .5,
               type: 'pie',
               showlegend: false
             }];
     
           var Gauge_layout = {
             shapes:[{
                 type: 'path',
                 path: path,
                 fillcolor: 'black',
                 line: {
                   color: "black"
                 }
               }],
             title: 'Belly Button Washing Frequency <br> Scrubs per Week',
             height: 500,
             width:  500,
             xaxis: {visible: false, range: [-1, 1]},
             yaxis: {visible: false, range: [-1, 1]}
           };
 
Plotly.newPlot("GaugeChart", Gauge_data, Gauge_layout);

       
    })
    
}



ini()


// When change selection
d3.selectAll("#TestSubject")
    .on("change", function(){
        Plots(d3.select(this).property('value'))
    });


