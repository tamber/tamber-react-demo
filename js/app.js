import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './components/Nav.react';
import ItemsList from './components/ItemsList.react';
import Log from './components/Log.react';
import Onboarding from './Onboarding.react';
import Actions from './Actions';
import Store from './Store';
import NotificationsStore from './NotificationsStore';
import g from './Globals';

// Notification handling
var NotificationStack = require('react-notification').NotificationStack;
var OrderedSet = require('immutable').OrderedSet;

function getState(){
	console.log("app getState called");
	var state = Store.GetState();
	state.notifications = NotificationsStore.GetNotificationsState().Notifications;
	return state;
}

var App = React.createClass({
	getInitialState: function() {
    	return getState();
	},
	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
		NotificationsStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		AccountStore.removeChangeListener(this._onChange);
		NotificationsStore.removeChangeListener(this._onChange);
	},
	shouldComponentUpdate: function(nextProps, nextState){
		console.log("app shouldComponentUpdate nextState");
		// if ((this.props.items != [] && this.props.items != null) && this.props.items != nextProps.items && this.nextProps.section == g.Section.Recommended) {
		// 	Actions.updateRecs(Store.getUID());
		// }
		return true;
	},
	render: function(){
		console.log("app render called");
		var spinnerPage = <div className="spinner-container"> <span className="pong-loader"></span></div>;
		if (this.state.uid == null){
			console.log("this.state.uid:", this.state.uid);
			Actions.init();
			return spinnerPage;
		} else if (this.state.initUser){
			console.log("this.state.initUser");
			return (<Onboarding items={this.state.items} />)
		} else if(this.state.events == null){
			console.log("this.state.events == null");
			Actions.retrieveEvents(this.state.uid);
			return spinnerPage
		} else if (this.state.items.length < 1){
			console.log("this.state.items.length < 1");
			Actions.updateRecs(this.state.uid);
			return spinnerPage
		}
		console.log("!this.props.recsRefreshing:", !this.state.recsRefreshing);
		return(
			<div>
				<Nav section={this.state.section} />
				<ItemsList onboarding={false} events={this.state.events} items={this.state.items} show={!this.state.recsRefreshing} />
				<Log events={this.state.events} />
				<NotificationStack 
				notifications={this.state.notifications.toArray()}
				onDismiss={notification => Actions.removeNotification(notification)}
				/>
			</div>
			)
	},
	_onChange: function() {
		this.setState(getState());
	}
});

ReactDOM.render(
	<App />,
	document.getElementById('app')
);