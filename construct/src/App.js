import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ico = require('./img/add-icon.svg');

const colors = {"start": "#61ffd7", "conv": "#8663f7", "pool": "#4fb5ff"};

class Connector extends React.Component {
  constructor(props){
    super(props);
    this.state = {l: this.props.l, r: this.props.r};

  }

  componentDidMount() {
    this.updateCanvas();
  }

  updateCanvas() {
    const width = this.refs.canvas.width;
    const height = this.refs.canvas.height;
    const ctx = this.refs.canvas.getContext('2d');
    var gradient=ctx.createLinearGradient(0,0,width,0);
    gradient.addColorStop("0",colors[this.state.l]);
    gradient.addColorStop("1.0",colors[this.state.r]);

    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);


    ctx.setLineDash([25, 30]);
    ctx.strokeStyle=gradient;

    ctx.lineCap = 'round';      
    ctx.lineWidth=10;
    ctx.stroke()
    // ctx.strokeStyle = '#ff0000';
    // ctx.stroke();
  }

  render() {
    return (
        <canvas class="connector" ref="canvas"/>
    );
  }
}



class Layer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      type: this.props.type,
      filters: this.props.filteres,
      size: this.props.size,
      stride: this.props.stride
    };
  }

  clicked(){
    alert("Clicked");
  }

  render(){
    const ico = require('./img/' + this.state.type + '-icon.svg');

    return(
      <div class={this.state.type + " layer"} onClick={() => this.clicked()}>
        <img src={ico} alt=""/>
      </div>
    );
  }
}


class Add extends React.Component {
  constructor(props){
    super(props);
    this.state = {color: this.props.color, onClick: this.props.onClick};
  }

  render() {
    return(
      <div class={this.state.color + " add"}></div>
    );
  }
}


class Container extends React.Component {
  constructor(props){
    super(props);
    this.state = {items: [<Layer type="start"/>]};
    this.addLayer = this.addLayer.bind(this); //bind to parent context
  }

  addLayer(type){
    const items_n = this.state.items.slice();
    items_n.push(<Layer type={type}/>);
    this.setState({items: items_n});
  }

  drawItems(){
    const out = this.state.items.slice();

    for (var i = 1; i < this.state.items.length; i++) {
      out.splice((i*2-1), 0, <Connector l={this.state.items[i-1].props.type} r={this.state.items[i].props.type}/>);
    }

    out.push(<Add color={this.state.items[this.state.items.length-1].props.type} onClick={this.addLayer}/>);
    return(out);
  }

  render(){
    return(
      <div class="container">
        {this.drawItems()}
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
          <Container/>
      </div>
      
    );
  }
}

export default App;

