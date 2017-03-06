import React from 'react';
import Item from './Item.react';

const { arrayOf, string, node, object } = React.PropTypes

const style = {
	container: {
		bottom:0,
		right:0,
		position:"absolute",
		left:260,
		top:60,
		zIndex:50,
		WebkitBoxSizing:"border-box",
		mozBoxSizing:"border-box",
		boxSizing:"border-box",
		overflowX:"hidden",
		padding:"30px 92px",
	}
}
var ItemsList = React.createClass({
	propTypes:{
		items: arrayOf(object),
	},
	render: function(){
		var items = this.props.items.map(function(item, index){
			return <Item key={index} id={item.id} name={item.properties.name} img={item.properties.header_image} description={item.properties.description} />
		})
		return (
			<div style={style.container}>
				{items}
			</div>)
	}
});

module.exports = ItemsList;