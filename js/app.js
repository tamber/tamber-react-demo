var React = require('react');
var ReactDOM = require('react-dom');
var Nav = require('./components/Nav.react'),
	ItemsList = require('./components/ItemsList.react'),
	Log = require('./components/Log.react');
var Actions = require('./Actions');
var Store = require('./Store'),
	NotificationsStore = require('./NotificationsStore');
var g = require('./Globals');

// Notification handling
var NotificationStack = require('react-notification').NotificationStack;
var OrderedSet = require('immutable').OrderedSet;

function getState(){
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
		if ((this.props.items != [] && this.props.item != null) && this.props.item != nextProps.items && this.nextProps.section == g.Section.Recommended) {
			Actions.updateRecs(Store.getUID());
		}
		return true;
	},
	render: function(){
		if(this.state.events == null){
			Actions.retrieveEvents(this.state.uid);
			return <div></div>
		}
		return(
			<div>
				<Nav section={this.state.section} />
				<ItemsList items={this.state.items} />
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