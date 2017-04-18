import AppDispatcher from './dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import Constants from './constants/Constants';
import assign from 'object-assign';
import g from './Globals';
import Notifications from './NotificationsStore';

var ItemsDB = require("../data/items.json");

var CHANGE_EVENT = 'change';

var testItems = [
	{
		"id": "78159",
		"properties": {
			"discussion_url": "https://www.producthunt.com/posts/pixel-by-google?utm_campaign=producthunt-api\u0026utm_medium=api\u0026utm_source=Application%3A+Tamber+%28ID%3A+4484%29",
			"name": "Pixel by Google",
			"redirect_url": "https://www.producthunt.com/r/860646657399af/78159?app_id=4484",
			"screenshot_300px": "https://api.url2png.com/v6/P5329C1FA0ECB6/8a1f30bab96c833dfa0d12b46ed00f71/png/?thumbnail_max_width=300\u0026url=https%3A%2F%2Fblog.google%2Fproducts%2Fpixel%2Fintroducing-pixel-our-new-phone-made-google%2F",
			"screenshot_850px": "https://api.url2png.com/v6/P5329C1FA0ECB6/17f73e0cebcf878e343c6490d4ea5005/png/?thumbnail_max_width=850\u0026url=https%3A%2F%2Fblog.google%2Fproducts%2Fpixel%2Fintroducing-pixel-our-new-phone-made-google%2F",
			"tagline": "Google's new phones, Pixel and Pixel XL",
			"thumbnail_url": "https://ph-files.imgix.net/65d05909-4f01-42e6-a53d-e970250fe0a6?auto=format\u0026fit=crop\u0026h=570\u0026w=430",
			"user_id": 72708
		},
		"tags": null,
		"created": 1475599505
	},
	{
		"id": "80878",
		"properties": {
			"discussion_url": "https://www.producthunt.com/posts/whale-2?utm_campaign=producthunt-api\u0026utm_medium=api\u0026utm_source=Application%3A+Tamber+%28ID%3A+4484%29",
			"name": "Whale",
			"redirect_url": "https://www.producthunt.com/r/e481fa02cd6f96/80878?app_id=4484",
			"screenshot_300px": "https://api.url2png.com/v6/P5329C1FA0ECB6/68d2b617ee02ade8023035b5141d550b/png/?thumbnail_max_width=300\u0026url=https%3A%2F%2Faskwhale.com",
			"screenshot_850px": "https://api.url2png.com/v6/P5329C1FA0ECB6/1807b03fd1c1c4d3a09f820175ea56fd/png/?thumbnail_max_width=850\u0026url=https%3A%2F%2Faskwhale.com",
			"tagline": "Video Q\u0026A with influencers and experts 🐳",
			"thumbnail_url": "https://ph-files.imgix.net/690ff922-3b27-4281-9397-38d7acba94ff?auto=format\u0026fit=crop\u0026h=570\u0026w=430",
			"user_id": 2
		},
		"tags": null,
		"created": 1477920583
	},
	{
		"id": "93945",
		"properties": {
			"discussion_url": "https://www.producthunt.com/posts/breaker-4?utm_campaign=producthunt-api\u0026utm_medium=api\u0026utm_source=Application%3A+Tamber+%28ID%3A+4484%29",
			"name": "Breaker",
			"redirect_url": "https://www.producthunt.com/r/9b21f0ba72cfd9/93945?app_id=4484",
			"screenshot_300px": "https://api.url2png.com/v6/P5329C1FA0ECB6/9066c13625c35c24d912150d879387e7/png/?thumbnail_max_width=300\u0026url=https%3A%2F%2Fbreaker.audio%2F",
			"screenshot_850px": "https://api.url2png.com/v6/P5329C1FA0ECB6/64ed4877eb611fd376de60eca3791918/png/?thumbnail_max_width=850\u0026url=https%3A%2F%2Fbreaker.audio%2F",
			"tagline": "The best app for listening to podcasts, with your friends 🎧",
			"thumbnail_url": "https://ph-files.imgix.net/5de38845-9c59-485a-be99-40cab79665d5?auto=format\u0026fit=crop\u0026h=570\u0026w=430",
			"user_id": 2
		},
		"tags": null,
		"created": 1490079840
	},
	{
		"id": "77458",
		"properties": {
			"discussion_url": "https://www.producthunt.com/posts/houseparty-4?utm_campaign=producthunt-api\u0026utm_medium=api\u0026utm_source=Application%3A+Tamber+%28ID%3A+4484%29",
			"name": "Houseparty",
			"redirect_url": "https://www.producthunt.com/r/b2ab0d7417bed5/77458?app_id=4484",
			"screenshot_300px": "https://api.url2png.com/v6/P5329C1FA0ECB6/510cd822720314ea012e8879ae5a6bd4/png/?thumbnail_max_width=300\u0026url=http%3A%2F%2Fjoinhouse.party",
			"screenshot_850px": "https://api.url2png.com/v6/P5329C1FA0ECB6/543574c2b33e15ad7d0c9578145e30f9/png/?thumbnail_max_width=850\u0026url=http%3A%2F%2Fjoinhouse.party",
			"tagline": "If FaceTime was built as a social network 🏠🎉",
			"thumbnail_url": "https://ph-files.imgix.net/be2d3574-3311-49a0-9dfc-cf08143aa4d3?auto=format\u0026fit=crop\u0026h=570\u0026w=430",
			"user_id": 14768
		},
		"tags": null,
		"created": 1475046946
	},
	{
		"id": "76024",
		"properties": {
			"discussion_url": "https://www.producthunt.com/posts/self-driving-uber?utm_campaign=producthunt-api\u0026utm_medium=api\u0026utm_source=Application%3A+Tamber+%28ID%3A+4484%29",
			"name": "Self-Driving Uber",
			"redirect_url": "https://www.producthunt.com/r/657ad664e36c94/76024?app_id=4484",
			"screenshot_300px": "https://api.url2png.com/v6/P5329C1FA0ECB6/4644324d8bcb31e4538c45bf4584e417/png/?thumbnail_max_width=300\u0026url=https%3A%2F%2Fnewsroom.uber.com%2Fpittsburgh-self-driving-uber",
			"screenshot_850px": "https://api.url2png.com/v6/P5329C1FA0ECB6/794301e2595510876edcf23f51157df8/png/?thumbnail_max_width=850\u0026url=https%3A%2F%2Fnewsroom.uber.com%2Fpittsburgh-self-driving-uber",
			"tagline": "The world’s first Self-Driving Ubers",
			"thumbnail_url": "https://ph-files.imgix.net/44547975-4b53-40db-a67f-9877203cd648?auto=format\u0026fit=crop\u0026h=570\u0026w=430",
			"user_id": 72708
		},
		"tags": null,
		"created": 1473850788
	}
];

cleanItems(testItems);

var defaultItems = testItems;

var _store = {
	// uid: "53875128",
	uid: null,
	initUser: false,
	section: g.Section.Recommended,
	events: null,
	recsRefreshing: false,
	items: []
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
	if(_store.events != null && _store.length < 1){
		_store.events = null;
	}
}

function initUID(){
	var uid = localStorage.getItem(g.LocalStorageKey.UserId);
	if(uid == null || uid == 'undefined'){
		uid = simpleIDGen();
		_store.initUser = true;
		localStorage.setItem(g.LocalStorageKey.UserId, uid);
		_store.items = defaultItems;
	}
	_store.uid = uid;
}

function handleInitUser(){
	_store.initUser = false;
	_store.items = [];
}

function handleSection(sect){
	_store.section = sect;
}

var eventDispatcher = {};

function undoEvent(event) {
	if(event in eventDispatcher) {
		for(var i = 0; i < _store.events.length; i++){
			if(_store.events[i] == event) {
				_store.events.splice(i, 1);
				break;
			}
		}
		delete eventDispatcher[event];
	}
}

function handleEventTracked(event){
	if (event == null){
		console.log("ERROR: handleEventTracked called on NULL EVENT");
		return
	}
	eventDispatcher[event] = true;
	if(_store.events == null){
		_store.events = [];
	}
	event.object = "event";
	_store.events.push(event);
	if(event.get_recs){
		_store.recsRefreshing = true;
	}
}

function handleEventTrackedResponse(events, recommended){
	// confirm success by removing from eventDispatcher
	if(events[0] in eventDispatcher) {
		delete eventDispatcher[events[0]];
	}
	if(recommended != null && recommended.length > 0){
		handleItems(recommended);
	}
	if(Object.keys(eventDispatcher).length<1){
		_store.recsRefreshing = false;
	}
}

function eventCompare(a,b) {
  if (a.created < b.created)
    return -1;
  if (a.created > b.created)
    return 1;
  return 0;
}

function handleEventsRetrieved(events){
	events.sort(eventCompare);
	_store.events = events;
	if(_store.events.length < 1) { // initial user
		_store.items = defaultItems;
		_store.initUser = true;
	}
}

function cleanItems(items) {
	items.map(function(item, index){
		if(item.hasOwnProperty('item')){
			items[index].id = item.item;
		} else {
			items[index].item = item.id;
		}
		items[index].properties.name = item.properties[g.ItemKeys.name];
		items[index].properties.header_image = item.properties[g.ItemKeys.header_image];
		items[index].properties.description = item.properties[g.ItemKeys.description];
		items[index].properties.url = item.properties[g.ItemKeys.url];
	});
}
function handleItems(discoverItems){
	var items = [];
	for(var i in discoverItems){
		if(discoverItems[i].item in ItemsDB) {
			items.push(ItemsDB[discoverItems[i].item]);
		}
	}
	cleanItems(items);
	_store.items = items;
}

function handleInit(){
	if (_store.uid == null){
      	initUID();
      	loadEvents();
    }
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
			if(event == null) {
				_store.events.splice(i, 1);
				continue;
			}
			// console.log("event:", event);
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
			case Constants.INIT:
				handleInit();
		        Store.emitChange();
		        break;
			// View Actions
			case Constants.GOTO_SECTION:
				handleSection(action.data);
		        Store.emitChange();
		        break;
		    case Constants.INIT_USER:
		    	handleInitUser();
		    	Store.emitChange();
		        break;
		     case Constants.TRACK_EVENT:
		    	handleEventTracked(action.event);
		        Store.emitChange();
		        break;
		    // Server Actions
		    case Constants.EVENT_TRACKED:
		    	if (action.err) {
		    		undoEvent(action.event);
					handleError(action.err);
				} else {
					handleEventTrackedResponse(action.result.events, action.result.recommended);
				}
		        Store.emitChange();
		        break;

		    case Constants.EVENTS_RETRIEVED:
		    	if (action.err) {
					handleError(action.err);
					handleEventsRetrieved([]);
				} else {
					handleEventsRetrieved(action.result.events);
				}
		        Store.emitChange();
		        break;

		    case Constants.RETRIEVE_ITEMS:
		    	_store.recsRefreshing = true;
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