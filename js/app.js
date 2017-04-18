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
	var state = Store.GetState();
	state.notifications = NotificationsStore.GetNotificationsState().Notifications;
	return state;
}
var gotRecs = false;

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
		return true;
	},
	render: function(){
		var spinnerPage = <div className="spinner-container"> <span className="pong-loader"></span></div>;
		if (this.state.uid == null){
			Actions.init();
			return spinnerPage;
		} else if (this.state.initUser){
			return (<Onboarding items={this.state.items} />)
		} else if(this.state.events == null){
			Actions.retrieveEvents(this.state.uid);
			return spinnerPage
		} else if (this.state.items.length < 1){
			if (!gotRecs) {
				Actions.updateRecs(this.state.uid);
				gotRecs = true;
				return spinnerPage
			}
		}
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