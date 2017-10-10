import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Icon from 'react-svg-icons';

const { arrayOf, string, node, object } = React.PropTypes

const style = {
	container: {
	    top: 61,
   		width: 260,
    	bottom: 0,
    	left: 0,
    	position: "fixed",
    	overflowY:"scroll"
	},
	credits: {
		bottom: 0,
		left: 0,
		width: 260,
		height: 73,
		position: "fixed",
		background:"#35246e",
		boxShadow: "rgba(0, 0, 0, 0.2) -1px -5px 10px"
	},
	logs: {
		top: 61,
   		width: 260,
    	bottom: 73,
    	left: 0,
    	position: "fixed",
    	overflowY:"scroll"
	},
	block: {
		container: {
			margin:"10px",
			background:"#231c4c",
			borderRadius:4,
			boxShadow: "0 15px 35px rgba(0,0,0,.1), 0 3px 10px rgba(0,0,0,.07)",
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

function scrollToBottom(){
	var log = document.getElementById("logs-list");
	log.scrollTop = log.scrollHeight;
}

var Log = React.createClass({
	propTypes:{
		events: arrayOf(object),
	},
	componentDidMount(){
		scrollToBottom();
	},
	componentDidUpdate(prevProps, prevState) {
		scrollToBottom();
	},
	render: function(){
		var logs = [];
		if(this.props.events != null){
			logs = this.props.events.map(function(event, index){
				return <LogBlock key={index} event={event} />
			});
		}
		return (
			<div>
				<div style={style.container}>
					<Icon name='curve' width={"100%"} height={"100%"} preserveAspectRatio={"none"} />
				</div>
				<div id="logs-list" style={style.logs}>
					{logs}
					<div style={{height:140}}></div>
				</div>
				<div style={style.credits}>
					<Icon name='credits' width={"71%"} height={"100%"} />
				</div>
			</div>)
	}
});

module.exports = Log;