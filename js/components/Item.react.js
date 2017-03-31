import React from 'react';
import Icon from 'react-svg-icons';
import Store from '../Store';
import Actions from '../Actions';
import g from '../Globals';
const { bool, string } = React.PropTypes

var style = {
	box: {
		padding:"26px 0px",
		display:"inline-block",
		minWidth:"100%"
		// padding:"30px 20px"
	},
	img: {
		backgroundSize: "cover",
		backgroundPosition:"50% 50%",
		width: "100%",
		height: "27vw"
	},
	text: {
		textAlign:"left"
	},
	grid: {
		box: {
			padding: 19,
			paddingBottom: 10,
			margin: 20,
			width:420,
			display:"inline-block",
			// display: "inline-table",
			borderRadius:4,
			border:"1px solid rgba(33,33,33,0.08)",
			boxShadow:" 0 15px 35px rgba(0,0,0,.1), 0 3px 10px rgba(0,0,0,.07)"
		},
		img: {
			backgroundSize: "cover",
			backgroundPosition:"50% 50%",
			width: "100%",
			height: 211
		},
		text: {
			maxHeight:120,
			minHeight:120,
			overflow: "hidden",
			textAlign:"left"
		}
	}
}

var LikeButton = React.createClass({
	propTypes:{
		id: string,
		onboarding: bool
	},
	onClick: function(){
		var get_recs = null;
		if(!this.props.onboarding){
			get_recs = {get_properties: true};
		}
		Actions.trackEvent(Store.getUID(), this.props.id, g.Behaviors.Like, 1, Math.floor(Date.now() / 1000), get_recs);
	},
	render: function(){
		const style = {
			cursor: "pointer",
			opacity:0.4
		}
		if(Store.isItemLiked(this.props.id)){
			console.log("item is liked");
			style.opacity = 1;
		}
		return(<div style={style} onClick={this.onClick}><Icon name='heart' width={38} height={38} /></div>)
	}
})

//dangerouslySetInnerHTML={{__html:"&#128150;"}}
var Item = React.createClass({
	propTypes:{
		id: string,
		name: string,
		img: string,
		description: string,
		url: string,
		onboarding: bool,
	},
	getInitialState: function() {
    	return {mouseEnterTime: null};
	},
	onMouseEnter: function(){
		this.setState({mouseEnterTime: Date.now()});
	},
	onMouseLeave: function(){
		if (this.state.mouseEnterTime != null && !this.props.onboarding){ // grid mode is used only for onboarding, where we only track explicit lacks
			var waitTime = (Date.now() - this.state.mouseEnterTime)/1000;
			if (waitTime >= 1.5 && waitTime < 120) { // only track hover events 90 seconds - 2 minutes (to ignore non-interactions)
 				Actions.trackEvent(Store.getUID(), this.props.id, g.Behaviors.Hover, waitTime, Math.floor(Date.now() / 1000));
			}
		} else {
			console.log("ERROR: onMouseLeave detected on node with no mouseEnterTime.");
		}
		this.setState({mouseEnterTime: null});
	},
	viewDetail: function(){
		var get_recs = null;
		if(!this.props.onboarding){
			get_recs = {get_properties: true};
		}
		Actions.trackEvent(Store.getUID(), this.props.id, g.Behaviors.ViewDetail, 1, Math.floor(Date.now() / 1000), get_recs);
	},
	render: function(){
		var boxStyle = style.grid.box,
			imgStyle = style.grid.img,
			textStyle = style.grid.text;
		imgStyle.backgroundImage = "url('"+this.props.img+"')";
		return (
			<div style={boxStyle} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
				<div style={imgStyle}></div>
				<h2 style={{textAlign:"left"}}><a onClick={this.viewDetail} href={this.props.url} target="_blank" style={{color:"inherit"}}>{this.props.name}</a><div style={{display:"inline-block", float:"right", marginTop:-5}}><LikeButton id={this.props.id} onboarding={this.props.onboarding} /></div></h2>

				<h4 style={textStyle} dangerouslySetInnerHTML={{__html:this.props.description}}></h4>
			</div>)
	}
});

module.exports = Item;