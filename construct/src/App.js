import React from 'react';
import './App.css';
import * as NumericInput from "react-numeric-input";
import * as Scroll from 'react-scroll';

const menuOptions = ["conv", "pool", "recurrent", "noise", "dense"]
const ico = require('./img/add-icon.svg');
const up = require('./img/arrow-up.svg');
const down = require('./img/arrow-down.svg');

// var target = document.getElementById("menu");

const formatting = {
  "start": { 
    color: "#4fcebd",
    gradient: {l: "#61ffbe", r: "#3ea0bd"},
    shortname: "start",
    fullname: "Input Layer",
    icon: "./img/start-icon.svg",
    parameters: {"input shape": 10},
    parameterOptions: [
    {title: "input shape", type:"diminput", min:1, max:999},
    ]
  },
  "conv": { 
    color: "#b266d5",
    gradient: {l: "#d585be", r: "#9149eb"},
    shortname: "conv",
    fullname: "Convolution Layer",
    icon: "./img/conv-icon.svg",
    parameters: {dimension: "2D", filters: 10, size: 3, stride: 1, padding: "Same", "activation": "ReLU"},
    parameterOptions: [
    {title: "dimension", type:"dropdown", options:["2D", "1D"]},
    {title: "filters", type:"number", min:1, max:999},
	{title: "size", type:"number", min:1, max:999},
    {title: "stride", type:"number", min:1, max:999},
    {title: "padding", type:"dropdown", options:["Same", "Valid", "Causal"]},
    {title: "activation", type:"dropdown", options:["ReLU", "LeakyReLU", "tanh", "Sigmoid"]}
    ]

  },
  "pool": { 
    color: "#4a9fe9",
    gradient: {l: "#4fceff", r: "#4671d3"},
    shortname: "pool",
    fullname: "Pooling Layer",
    icon: "./img/pool-icon.svg",
    parameters: {size: 2, stride: 2, type: "Max", padding: "Same"},
    parameterOptions: [
    {title: "size", type:"number", min:1, max:999},
	{title: "stride", type:"number", min:1, max:999},
    {title: "type", type:"dropdown", options:["Max Pooling", "Avg Pooling"]},
    {title: "padding", type:"dropdown", options:["Same", "Zeros"]}
    ]
  },
  "dense": { 
    color: "#f98829",
    gradient: {l: "#feae1f", r: "#f56333"},
    shortname: "dense",
    fullname: "Dense Layer",
    icon: "./img/dense-icon.svg",
    parameters: {"neuron count": 10, activation: "ReLU"},
    parameterOptions: [
    {title: "neuron count", type:"number", min:1, max:999},
    {title: "activation", type:"dropdown", options:["ReLU", "LeakyReLU", "tanh", "Sigmoid"]}
    ]
  },
   "recurrent": { 
    color: "#ff6ac3",
    gradient: {l: "#ff94d8", r: "#ff3ead"},
    shortname: "recurrent",
    fullname: "Recurrent Layer",
    icon: "./img/recurrent-icon.svg",
    parameters: {count: 10, activation: "ReLU"},
    parameterOptions: [
    {title: "count", type:"number", min:1, max:999},
    {title: "activation", type:"dropdown", options:["ReLU", "LeakyReLU", "tanh", "Sigmoid"]}
    ]
  },
  "noise": { 
    color: "#787878",
    gradient: {l: "#a1a1a1", r: "#4f4f4f"},
    shortname: "noise",
    fullname: "Noise Layer",
    icon: "./img/noise-icon.svg",
    parameters: {count: 10, activation: "ReLU"},
    parameterOptions: [
    {title: "count", type:"number", min:1, max:999},
    {title: "activation", type:"dropdown", options:["ReLU", "LeakyReLU", "tanh", "Sigmoid"]}
    ]
  }
};

var scroller = Scroll.animateScroll;


function tintColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function hexToRgbA(hex, alpha){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length=== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+ alpha +')';
    }
    throw new Error('Bad Hex');
}

function getGradient(color, direction){
  return({
    background: 'linear-gradient(to ' + direction + ',' + hexToRgbA(color, 0.2) + ' 0%,' + hexToRgbA(color, 0.1) + ' 100%)',
    'border-color': color,
    color: tintColor(color, 0.5)
  });
}

function getGradient2(color1, color2, direction){
    return({
    background: 'linear-gradient(to ' + direction + ',' + color1 + ' 0%,' + color2 + ' 100%)',
  });
}



class Animation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {animate: true, angle: 0 , l:this.props.l, r:this.props.r};
    this.updateAnimationState = this.updateAnimationState.bind(this);
  }
  
  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }
  
  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }
  
  updateAnimationState() {
    if(this.state.animate){
      this.setState(prevState => ({ angle: prevState.angle + 1 }));
      this.rAF = requestAnimationFrame(this.updateAnimationState);
      if(this.state.angle > 120){
        this.setState({animate: false});
      }
    }
  }
  
  render() {
    return <Connector angle={this.state.angle} l={this.state.l} r={this.state.r} />
  }
}



class Connector extends React.Component {
  constructor(props){
    super(props);
    this.state = {l: this.props.l, r: this.props.r};
    this.canvasRef = React.createRef();
  }

  componentDidUpdate() {
    const {angle} = this.props;
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.save();

    var gradient=ctx.createLinearGradient(0,0,width,0);
    gradient.addColorStop("0",formatting[this.state.l].color);
    gradient.addColorStop("1",formatting[this.state.r].color);
    ctx.clearRect(0, 0, width, height);
    var x;
    var y;

    ctx.beginPath();
    ctx.moveTo(0, height/2);
    // ctx.lineTo(width, height/2+angle);

    for(x=0; x<=width; x+=5){
        y = Math.sin((x+angle*30)*Math.PI/180)*40/angle + height/2;
        ctx.lineTo(x,y);
    }

    ctx.setLineDash([25, 30]);
    ctx.strokeStyle=gradient;
    ctx.lineCap = 'round';      
    ctx.lineWidth=10;
    ctx.stroke()
    // ctx.strokeStyle = '#ff0000';
    // ctx.stroke();
    ctx.restore();
  }

  render() {
    return (
        <canvas class="connector" ref={this.canvasRef}/>
    );
  }
}

class DimensionInput extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			dim: this.props.dim,
			values: new Array(this.props.dim).fill(1)
		};

	}

	getButtons(minus){
		return(<div class="buttoncontainer"><button><img src={up}/></button><button><img src={down}/></button></div>);
	}

	render(){
		const output = [];
		output.push(<input class="diminputbox" type="number" defaultValue={this.state.values[0]}></input>);
		const buttons = [];

		for (var i = 1; i < this.state.values.length; i++) {
			output.push(' x ');
			output.push(<input class="diminputbox" type="number" defaultValue={this.state.values[i]}></input>);
		}

		output.push(this.getButtons(true));
		return(<div class="dimensioninput">{output}</div>);

	}
}

class Layer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: this.props.type,
      parameters: Object.assign({}, formatting[this.props.type].parameters),
      selected: true
    };
    this.input = React.createRef();
    this.toggleEditMenu = this.toggleEditMenu.bind(this);
  	}

   inputField(parameterOptions){
	const output = [];

	if(parameterOptions.type == "dropdown"){
		var options = [];


		for (var i = 0; i < parameterOptions.options.length; i++) {
			options.push(<option value={parameterOptions.options[i]}>{parameterOptions.options[i]}</option>);
		}

		return(
			<li>
			{parameterOptions.title}:&nbsp;
			<select name="type" defaultValue={this.state.parameters[parameterOptions.title]} onChange={(event) => this.handleChange(parameterOptions.title, event)}>
				{options}
			</select>
			</li>
		);
	}

	if(parameterOptions.type == "diminput"){
		return(
			<li>{parameterOptions.title}:&nbsp;
				<DimensionInput dim={2}/>
			</li>
		);
	}

	return(
	  <li>{parameterOptions.title}:&nbsp;
	  <input onFocus={this.handleFocus} type="number" onKeyPress={this.handleKeyPress} onChange={(event) => this.handleChange(parameterOptions.title, event)} defaultValue={this.state.parameters[parameterOptions.title]}></input></li>
	);
	}

  handleChange(parameter, event) {
  	const updatedState = Object.assign({}, this.state);
  	updatedState["parameters"][parameter] = event.target.value;
  	this.setState(updatedState);
  }

	handleKeyPress(event) {
	  if (event.key === 'Enter') {
		event.target.blur(false);
	  }
	}

	handleFocus(event) {
	  event.target.select();
	}

  toggleEditMenu(state){
    if(state != null){
      this.setState({selected: state});
    } else{
      this.setState({selected: !this.state.selected});
    }
  }

  getOptions(){
    if(this.state.parameters == null){
    	return(null);
    }
    const options = [];
    const keys = Object.keys(this.state.parameters);
    for (var i = 0; i < keys.length; i++) {
    	const parameter = keys[i];  	
    	options.push(this.inputField(formatting[this.state.name].parameterOptions[i]));
    }

    return(
		<ul>
            <hr/>
			{options}
		</ul>
    );
  }

  editMenu(){
    if(this.state.selected){
      return(
        <div>
          <div class="menuconnector">
            <div class="menuconnectorline" style={{'border-bottom-color': formatting[this.state.name].color}}></div>
          </div>
          <div class="editmenu" style={getGradient2(formatting[this.state.name].color, tintColor(formatting[this.state.name].color, -0.2), 'bottom')}>
            <h1>{formatting[this.state.name].fullname}</h1>
            {this.getOptions()}
          </div>
        </div>
      );
    }
  }

  render(){
     // const ico = require(formatting[this.state.name].icon); // not sure why this doesn't work
    const ico = require('./img/' + this.state.name + '-icon.svg');
	// <div class="layermenu" onMouseEnter={() => this.toggleEditMenu(true)} onMouseLeave={() => this.toggleEditMenu(false)}>
    return(
      <div class="layermenu">
        <div class="layer" style={getGradient2(formatting[this.state.name].gradient.l, formatting[this.state.name].gradient.r, "bottom")} onClick={() => this.toggleEditMenu()}>
          <img src={ico} alt=""/>
        </div>
        {this.editMenu()}
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
    if(visible){
    	//scroll to right
    }
  }

  menuVisibility() {
    if(this.state.menuVisible){
      return({visibility: "visible"});
    } else {
      return({visibility: "hidden"});
    }
  }

  menuHeight() {
    if(this.state.menuVisible){
      return({height: '100%'});
    } else {
      return({height: '0%'});
    }
  }

  drawMenuItems() {
    var menuItems = [];

    for (var i = 0; i < this.state.menuItems.length; i++) {
      const key = this.state.menuItems[i].slice();
      const ico = require('./img/' + key + '-icon.svg');
      menuItems.push(
        <div class="menuitem" style={getGradient(formatting[key].color, 'right')} onClick={() => this.state.onClick(key)}><img src={ico}/>{formatting[key].fullname}</div>
      );
    }

    return(
      <div class="menu" id="menu" style={this.menuVisibility()}>
        {menuItems}
      </div>
    );
  }

  render() {
    return(
      <div class="addmenu" style={this.menuHeight()} onMouseEnter={() => this.setMenuVisibility(true)} onMouseLeave = {() => this.setMenuVisibility(false)}>
        <div class="add" style={getGradient2(formatting[this.state.color].gradient.l, formatting[this.state.color].gradient.r, "bottom")} onClick={() => this.setMenuVisibility(true)}><img alt="" src={ico}/></div>
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
      out.splice((i*2-1), 0, <Animation l={this.state.items[i-1].props.type} r={this.state.items[i].props.type}/>);
    }

    out.push(<Add menuItems={menuOptions} color={this.state.items[this.state.items.length-1].props.type} onClick={this.addLayer}/>);
    return(out);
  }

  render(){
    return(
      <div class="container" id="container">
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

