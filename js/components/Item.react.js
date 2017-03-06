import React from 'react';
import Icon from 'react-svg-icons';
import Store from '../Store';
import Actions from '../Actions';
import g from '../Globals'
const { string } = React.PropTypes

const style = {
	box: {
		width:"100%",
		padding:"26px 0px"
		// display:"inline-block",
		// padding:"30px 20px"
	},
	img: {
		backgroundSize: "cover",
		backgroundPosition:"50% 50%",
		width: "100%",
		height: "32vw"
	}
}

// heart: &#x2764
var LikeButton = React.createClass({
	propTypes:{
		id: string
	},
	onClick: function(){
		Actions.trackEvent(Store.getUID(), this.props.id, g.Behaviors.Like, 1, Math.floor(Date.now() / 1000));
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
		return(<div style={style} onClick={this.onClick}><Icon name='heart' width={46} height={46} /></div>)
	}
})

//dangerouslySetInnerHTML={{__html:"&#128150;"}}
var Item = React.createClass({
	propTypes:{
		id: string,
		name: string,
		img: string,
		description: string,
	},
	render: function(){
		style.img.backgroundImage = "url('"+this.props.img+"')";
		return (
			<div style={style.box}>
				<div style={style.img}></div>
				<h2>{this.props.name}<div style={{display:"inline-block", float:"right", marginTop:-5}}><LikeButton id={this.props.id} /></div></h2>

				<h4 dangerouslySetInnerHTML={{__html:this.props.description}}></h4>
			</div>)
	}
});

module.exports = Item;