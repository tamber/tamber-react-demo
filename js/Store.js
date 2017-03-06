import AppDispatcher from './dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import Constants from './constants/Constants';
import assign from 'object-assign';
import g from './Globals';
import Notifications from './NotificationsStore';

var CHANGE_EVENT = 'change';

var testItem = {
		id: "400",
		properties: {
			name: "Portal", 
			description: "<p>Portal&trade; is a new single player game from Valve. Set in the mysterious Aperture Science Laboratories, Portal has been called one of the most innovative new games on the horizon and will offer gamers hours of unique gameplay.<\/p>\r\n\t\t\t\t\t<p>The game is designed to change the way players approach, manipulate, and surmise the possibilities in a given environment; similar to how Half-Life&reg; 2's Gravity Gun innovated new ways to leverage an object in any given situation.<\/p>\r\n\t\t\t\t\t<p>Players must solve physical puzzles and challenges by opening portals to maneuvering objects, and themselves, through space.<\/p>\r\n\t\t\t\t\t",
			header_image: "http://cdn.akamai.steamstatic.com/steam/apps/400/header.jpg"

		}
	};
var testItems = [testItem, testItem, testItem, testItem, testItem];

var _store = {
	uid: null,
	section: g.Section.Recommended,
	events: null,
	items: testItems
};

function handleError(err) {
	Notifications.PushNotification(err, 1, null);
}

function simpleIDGen(){
	return (Math.random() + 1).toString(36).substring(12);
}

function saveEvents(id){
   localStorage.setItem(g.LocalStorageKey.Events, _store.events);
}

function loadEvents(){
	_store.events = localStorage.getItem(g.LocalStorageKey.Events);
}

function initUID(){
	var uid = localStorage.getItem(g.LocalStorageKey.UserId);
	if(uid == null || uid == 'undefined'){
		uid = simpleIDGen();
		localStorage.setItem(g.LocalStorageKey.UserId, uid);
	}
	_store.uid = uid;
}


function handleSection(sect){
	_store.section = sect;
}

function handleEventTracked(events, recommended){
	_store.events.push(events[0]);
}

function handleEventsRetrieved(events){
	console.log("events retrieved:", events);
	_store.events = events;
}

function handleItems(items){
	_store.items = items;
}

var Store = assign({}, EventEmitter.prototype, {
	GetState: function(){
		if (_store.uid == null){
	      	initUID();
	      	loadEvents();
	    }
		return _store;
	},
	getUID: function(){
		return _store.uid;
	},
	isItemLiked: function(id) {
		for (var i in _store.events){
			var event = _store.events[i];
			if (event.item == id && event.behavior == g.Behaviors.Like) {
				return true;
			}
		}
		return false;
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
	dispatcherIndex: AppDispatcher.register(function(payload) {
		var action = payload.action;
		switch(action.actionType) {
			// View Actions
			case Constants.GOTO_SECTION:
				handleSection(action.data);
		        Store.emitChange();
		        break;

		    // Server Actions
		    case Constants.EVENT_TRACKED:
		    	if (action.err) {
					handleError(action.err);
				} else {
					handleEventTracked(action.result.events, action.result.recommended);
				}
		        Store.emitChange();
		        break;
		    case Constants.EVENTS_RETRIEVED:
		    	if (action.err) {
					handleError(action.err);
				} else {
					handleEventsRetrieved(action.result.events);
				}
		        Store.emitChange();
		        break;
		    case Constants.ITEMS_RETRIEVED:
		    	if (action.err) {
					handleError(action.err);
				} else {
					handleItems(action.result);
				}
		        Store.emitChange();
		        break;
		}
		return true;
	})
});

module.exports = Store;