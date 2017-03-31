import React from 'react';
import Item from './Item.react';
import g from '../Globals'

const { bool, arrayOf, string, node, object } = React.PropTypes

var style = {
	container: {
		bottom:0,
		right:0,
		position:"absolute",
		left:260,
		top:60,
		zIndex:50,
		WebkitBoxSizing:"border-box",
		MozBoxSizing:"border-box",
		boxSizing:"border-box",
		overflowX:"hidden",
		// padding:"30px 82px",
		padding:"30px 10px",
		textAlign:"center"
	},
	grid: {
		container:{
			bottom:0,
			right:0,
			left:0,
			// width:"100%",			
			position:"absolute",
			top:60,
			bottom:62,
			zIndex:50,
			WebkitBoxSizing:"border-box",
			MozBoxSizing:"border-box",
			boxSizing:"border-box",
			overflowX:"hidden",
			// padding:"34px 0",
			// display:"inline-flex",
			// justifyContent: "center",
			textAlign:"center"

		}
	}
}

var ItemsList = React.createClass({
	propTypes:{
		onboarding: bool,
		items: arrayOf(object),
		events: arrayOf(object),
		show: bool
	},
	shouldComponentUpdate: function(nextProps, nextState){
		if(nextProps.items != this.props.items){
			var resetScroll = true;
			if(nextProps.events != null && nextProps.events.length>0){
				if(nextProps.events[nextProps.events.length-1].behavior==g.Behaviors.Hover){
					resetScroll = false;
				}
			}
			if (resetScroll){
				var node = document.getElementById('items-list');
				node.scrollTop = 0;
			}
			
		}
		return true;
	},
	render: function(){
		var css;
		if (this.props.onboarding==true) {
			css = style.grid.container; 
		} else {
			css = style.container; 
		}
		var onboarding = this.props.onboarding;
		var items = this.props.items.map(function(item, index){
			return <Item key={index} onboarding={onboarding} id={item.id} name={item.properties.name} img={item.properties.header_image} description={item.properties.description} url={item.properties.url} />
		})

		// this.props.show = !this.props.show;
		var updatingLoaderClasses = ['updating-loader'];
		if(!this.props.show){
			updatingLoaderClasses.push('show');
		}
		var componentClasses = ['items-list'];
		if (this.props.show){
			componentClasses.push('in');
			componentClasses.push('show');
		} else {
			componentClasses.push('out');
		}
		return (
		<div>
			<h2 className={updatingLoaderClasses.join(' ')}>Updating recommendations system-wide...</h2>
			<div className={componentClasses.join(' ')} style={css} id="items-list">
				{items}
			</div>
		</div>)
	}
});

module.exports = ItemsList;