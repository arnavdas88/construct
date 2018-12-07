import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ico = require('./img/add-icon.svg');

const colors = {"start": "#61ffd7", "conv": "#8663f7", "pool": "#4fb5ff", "dense": "#ff644d"};
const menuOptions = ["Convolution Layer", "Pooling Layer", "Dense Layer"]
const menuKey = {"Convolution Layer": "conv", "Pooling Layer": "pool", "Dense Layer": "dense"}

function colorize(color){
    return({background: color});
}

function tintColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function hexToRgbA(hex, alpha){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+ alpha +')';
    }
    throw new Error('Bad Hex');
}


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
      <div class="layer" style={colorize(colors[this.state.type])} onClick={() => this.clicked()}>
        <img src={ico} alt=""/>
      </div>
    );
  }
}


class Add extends React.Component {
  constructor(props){
    super(props);
    this.state = {color: this.props.color, menuItems: this.props.menuItems, onClick: this.props.onClick, menuVisible: false};
    this.setMenuVisibility = this.setMenuVisibility.bind(this)
  }

  setMenuVisibility(visible) {
    this.setState({menuVisible: visible});
  }

  menuVisibility() {
    if(this.state.menuVisible){
      return({display: 'inline'});
    } else {
      return({display: 'none'});
    }
  }

  getGradient(color){
    return({
      background: 'linear-gradient(to right,' + hexToRgbA(color, 0.2) + ' 0%,' + hexToRgbA(color, 0.1) + ' 100%)',
      border: '1px solid' + color,
      color: tintColor(color, 0.5)
    });
  }

  drawMenuItems() {
    var menuItems = [];

    for (var i = 0; i < this.state.menuItems.length; i++) {
      const key = menuKey[this.state.menuItems[i]].slice();
      menuItems.push(
        <div class="menuitem" style={this.getGradient(colors[key])} onClick={() => this.state.onClick(key)}>{this.state.menuItems[i]}</div>
      );
    }

    return(
      <div class="menu" style={this.menuVisibility()}>
        {menuItems}
      </div>
    );
  }

  render() {
    return(
      <div class="addmenu" onMouseEnter={() => this.setMenuVisibility(true)} onMouseLeave = {() => this.setMenuVisibility(false)}>
        <div class="add" style={colorize(colors[this.state.color])}><img src={ico}/></div>
        {this.drawMenuItems()}
      </div>
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

    out.push(<Add menuItems={menuOptions} color={this.state.items[this.state.items.length-1].props.type} onClick={this.addLayer}/>);
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

