import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

const { arrayOf, string, node, object } = React.PropTypes

const style = {
	container: {
	    top: 61,
   		width: 260,
    	bottom: 0,
    	left: 0,
    	position: "fixed",
    	background: "#150c3f",
    	overflowY:"scroll"
	},
	block: {
		container: {
			margin:"10px",
			background:"#231c4c",
			borderRadius:4,
			boxShadow: "0 15px 35px rgba(0,0,0,.1), 0 3px 10px rgba(0,0,0,.07)"
		},
		text: {
			fontFamily:"Source Sans Pro",
			fontWeight:"400",
			padding: "8px"
		}
	},
}

var LogBlock = React.createClass({
	propTypes:{
		event: object,
	},
	render: function(){
		var codeText = JSON.stringify(this.props.event,undefined, 2);
		return(<div style={style.block.container}>
					<div style={style.block.text}>
						<SyntaxHighlighter language={"JSON"} useInlineStyles={false}>{codeText}</SyntaxHighlighter>
					</div>
				</div>
		);
	}
});

var Log = React.createClass({
	propTypes:{
		events: arrayOf(object),
	},
	render: function(){
		var logs = this.props.events.map(function(event, index){
			return <LogBlock key={index} event={event} />
		});
		return (
			<div style={style.container}>
				{logs}
			</div>)
	}
});

module.exports = Log;