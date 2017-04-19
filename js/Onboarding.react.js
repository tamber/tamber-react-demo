import React from 'react';
import ItemsList from './components/ItemsList.react';
import Actions from './Actions';

const { bool, arrayOf, string, node, object } = React.PropTypes

var Onboarding = React.createClass({
	propTypes:{
		items: arrayOf(object)
	},
	initUser: function(){
		Actions.initUser();
	},
	render: function(){
		var style = {
			nav: {
				position:"fixed", 
				zIndex:100, 
				top:0, 
				left:0, 
				right:0, 
				height:62, 
				lineHeight:"62px", 
				textAlign:"center", 
				textTransform:"uppercase", 
				background:"#fff", 
				color:"#1a1d72", 
				boxShadow:"rgba(0, 0, 0, 0.08) 0px 2px 8px"
			},
			startBar: {
				position:"fixed", 
				cursor:"pointer", 
				zIndex:100, 
				bottom:0, 
				left:0, 
				right:0, 
				height:62, 
				lineHeight:"62px", 
				textAlign:"center", 
				textTransform:"uppercase", 
				background:"rgb(53, 36, 110)", 
				color:"rgba(255,255,255,0.92)", 
				boxShadow:"rgba(0, 0, 0, 0.08) 0px -2px 8px"
			},
			logo: {
				float:"left",
				marginLeft: 26,
				marginTop:4,
				width:95
			},
			logo_img: {
				width:"100%",
				height:23,
				backgroundImage:"url('./img/dark-logo.svg')",
				backgroundSize: "cover",
				display:"inline-block",
				position:"relative"
			}
		}
		return (<div>
					<div style={style.nav}>
						<div style={style.logo}><div style={style.logo_img}></div></div>
						<span style={{marginLeft:-127}}>Pick some games you like</span>
					</div>
					<ItemsList onboarding={true} items={this.props.items} show={true} />
					<div onClick={this.initUser} style={style.startBar}>
						Start
					</div>
				</div>)
	}
});

module.exports = Onboarding;