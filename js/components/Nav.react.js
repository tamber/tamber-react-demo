import React from 'react';
import g from '../Globals';
import Actions from '../Actions';
import Store from '../Store';

const height = 60;
const style = {
	container: {
		top:0,
		left:0,
		width:"100%",
		zIndex:"500",
		height: height,
		background:"#fff",
		position:"fixed",
		borderBottom:"1px solid rgba(5,0,65,0.1)"
	},
	logo: {
		float:"left",
		marginLeft: 13,
		marginTop:19,
		width:103
	},
	logo_img: {
		width:"100%",
		height:26,
		backgroundImage:"url('./img/dark-logo.svg')",
		backgroundSize: "cover",
		display:"inline-block",
		position:"relative"
	},
	tabs: {
		fontFamily:'Aileron',
		fontWeight:"600",
		WebkitFontSmoothing:'subpixel-antialiased',
		listStyle: "none",
		marginTop:10,
		marginLeft: 40,
		textDecoration:"none",
		float: "left"
	},
	tabActive: {
		opacity:1,
		borderBottom:"4px solid #cb0041"
	}
}

var Nav = React.createClass({
	propTypes:{
		section: React.PropTypes.number,
	},
	handleTabClick: function(section){
		Actions.goToSection(section, Store.getUID());
	},
	render: function(){
		var r = g.Section.Recommended,
			h = g.Section.Hot,
			p = g.Section.Popular;
		return (
			<div className="nav" style={style.container}>
				<div style={style.logo}><div style={style.logo_img}></div></div>
				<ul className="tabs" style={style.tabs} >
					<li><a href="#" style={this.props.section == r ? style.tabActive : {}} onClick={this.handleTabClick.bind(null, r)}>Home</a></li>
					<li><a href="#" style={this.props.section == h ? style.tabActive : {}} onClick={this.handleTabClick.bind(null, h)}>Hot</a></li>
					<li><a href="#" style={this.props.section == p ? style.tabActive : {}} onClick={this.handleTabClick.bind(null, p)}>Popular</a></li>
				</ul>
			</div>)
	}
});

module.exports = Nav;