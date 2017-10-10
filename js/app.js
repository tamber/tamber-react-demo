import React from 'react';
import ReactDOM from 'react-dom';
import Nav from './components/Nav.react';
import ItemsList from './components/ItemsList.react';
import ItemPage from './components/ItemPage.react';
import Log from './components/Log.react';
import Onboarding from './Onboarding.react';
import Store from './Store';
import NotificationsStore from './NotificationsStore';
import g from './Globals';
import Actions from './Actions';

var APP_CONFIG = require('../package.json').app_config;

// Notification handling
var NotificationStack = require('react-notification').NotificationStack;
var OrderedSet = require('immutable').OrderedSet;

function getState(){
	console.log("getting state");
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
		console.log("this.state.initialized", this.state.initialized);
		if (!this.state.initialized){
			Actions.init();
			return spinnerPage;
		} 
		console.log("here");
		if(APP_CONFIG.onboarding){
			if (this.state.initUser){
				return (<Onboarding items={this.state.items} />)
			} else if(this.state.events == null){
				Actions.retrieveEvents();
				return spinnerPage
			} else if (this.state.items.length < 1){
				if (!gotRecs) {
					Actions.updateRecs();
					gotRecs = true;
					return spinnerPage
				}
			}
		} else {
			if (!gotRecs) {
				Actions.updateRecs();
				gotRecs = true;
			}
		}
		console.log("events:", this.state.events);
		var body;
		switch(this.state.section){
			case g.Section.Item:
				body = <ItemPage item={this.state.currentItem} nextItems={this.state.items} />
				break;
			default:
				body = <ItemsList onboarding={false} events={this.state.events} items={this.state.items} show={!this.state.recsRefreshing} />
				break;
		}	
		return(
			<div>
				<Nav section={this.state.section} />
				{body}
				<Log events={this.state.events} />
				<NotificationStack 
				notifications={this.state.notifications.toArray()}
				onDismiss={notification => Actions.removeNotification(notification)}
				/>
			</div>
			)
	},
	_onChange: function() {
		console.log("change caught");
		this.setState(getState());
	}
});

ReactDOM.render(
	<App />,
	document.getElementById('app')
);