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
                colorscale: "Earth"
                }
        }];

        let Bubble_layout = {
            title: 'Bubble Chart',
            showlegend: false
          
          };
    
          Plotly.newPlot("BubbleChart",Bubble_trace, Bubble_layout);
             
        // Add info chart
        let select_card=d3.select("#TextChart")
        let metadata=data.metadata[sample_selected]
        
          for (var key in metadata){
            select_card
            .append("p")
            .text(key+" : "+metadata[key])
           }


        
    })
    
}



ini()


// When change selection
d3.selectAll("#TestSubject")
    .on("change", function(){
        Plots(d3.select(this).property('value'))
    });


   ;

