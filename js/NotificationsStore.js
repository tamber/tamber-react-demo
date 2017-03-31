var AppDispatcher = require('./dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./constants/Constants');
var assign = require('object-assign');

var OrderedSet = require('immutable').OrderedSet;

var CHANGE_EVENT = 'change';

var store = {
	Notifications: OrderedSet(),
	count: 0,
}

function getErrorNotificationBarStyle() {
  return { 
    background: '#cb0041',
    maxWidth: '440px',
    zIndex:'1000'
  }
}

function addNotification(msg, type, dismissAction){
	const id = store.Notifications.size + 1;
	const newCount = store.count + 1;
	switch (type){
	case 0:
		//standard notification
		break;
	case 1:
		//error notification
		store.Notifications = store.Notifications.add({
			message: msg,
			style: true,
			barStyle:getErrorNotificationBarStyle(),
			key: newCount,
			dismissAfter: 3000,
		});
		break;
	}
	store.count = newCount;
}

function removeNotification(notification){
  store.Notifications = store.Notifications.remove(notification);
}

var NotificationsStore = assign({}, EventEmitter.prototype, {

  GetNotificationsState: function(){
    return store;
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  // Called by other stores updating state (emitting change that affects notifications)
  PushNotification: function(msg, type, dismissAction){ 
  	addNotification(msg, type, dismissAction);
  },
  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
      case Constants.REMOVE_NOTIFICATION:
        removeNotification(action.data);
        NotificationsStore.emitChange();
        break;
     }
     return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = NotificationsStore;