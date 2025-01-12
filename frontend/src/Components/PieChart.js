import React from "react";
import Plot from 'react-plotly.js';

const  PieChart=(props)=> {

  const {title, quantities, labels} = props;
  return (
    
    <div className="col-auto">
      <div className="card shadow mb-4">
          <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
          </div>
          <div className="card-body">
            <Plot
              data={[
                {values: quantities, labels: labels, type:'pie'},
              ]}
              layout={ {width: 640, height: 480, title: ''}}
            />
          </div>
      </div>
    </div>
    );
}

export default PieChart;