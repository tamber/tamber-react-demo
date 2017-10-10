import React from 'react';
import Icon from 'react-svg-icons';
import Store from '../Store';
import Actions from '../Actions';
import g from '../Globals';
import Item from './Item.react';
import IFrame from 'react-iframe'
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
			// position:"absolute",
			// top:60,
			// bottom:62,
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
//dangerouslySetInnerHTML={{__html:"&#128150;"}}
var ItemPage = React.createClass({
	propTypes:{
		item: object,
		nextItems: arrayOf(object),
	},
	render: function(){
		// display primary item
		// display next items in list
		// var boxStyle = style.grid.box,
		// 	imgStyle = style.grid.img,
		// 	textStyle = style.grid.text;
		// imgStyle.backgroundImage = "url('"+this.props.img+"')";
		var css;
		if (this.props.onboarding==true) {
			css = style.grid.container; 
		} else {
			css = style.grid.container; 
		}

		var items;

		var componentClasses = ['items-list'];
		if (this.props.nextItems != null && this.props.nextItems.length>0){
			componentClasses.push('in');
			componentClasses.push('show');
			items = this.props.nextItems.map(function(item, index){
				return <Item key={index} onboarding={false} small={true} id={item.id} name={item.properties.name} img={item.properties.header_image} description={item.properties.description} url={item.properties.url} />
			});
		} else {
			componentClasses.push('out');
		}
		return (
			<div style={{marginLeft:260}}>
				<IFrame url={this.props.item.url}
		        width="100%"
		        height="450px"
		        display="initial"
		        position="relative"
		        allowFullScreen/>
		        <div className={componentClasses.join(' ')} style={css} id="items-list">
					{items}
				</div>
			</div>
			)
	}
});

module.exports = ItemPage;