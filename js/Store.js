import AppDispatcher from './dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import Constants from './constants/Constants';
import assign from 'object-assign';
import g from './Globals';
import Notifications from './NotificationsStore';

var CHANGE_EVENT = 'change';

var testItem = {
		item: "400",
		properties: {
			name: "Portal", 
			description: "<p>Portal&trade; is a new single player game from Valve. Set in the mysterious Aperture Science Laboratories, Portal has been called one of the most innovative new games on the horizon and will offer gamers hours of unique gameplay.<\/p>\r\n\t\t\t\t\t<p>The game is designed to change the way players approach, manipulate, and surmise the possibilities in a given environment; similar to how Half-Life&reg; 2's Gravity Gun innovated new ways to leverage an object in any given situation.<\/p>\r\n\t\t\t\t\t<p>Players must solve physical puzzles and challenges by opening portals to maneuvering objects, and themselves, through space.<\/p>\r\n\t\t\t\t\t",
			header_image: "http://cdn.akamai.steamstatic.com/steam/apps/400/header.jpg"

		}
	};
var testItems = [
	{
		"id": "620",
		"properties": {
			"description": "The \u0026quot;Perpetual Testing Initiative\u0026quot; has been expanded to allow you to design co-op puzzles for you and your friends!",
			"header_image": "http://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg?t=1487174418",
			"name": "Portal 2",
			"removed": false
		},
		"tags": null,
		"created": 0
	}, 
	{
		"id": "292030",
		"properties": {
			"description": "The Witcher is a story-driven, next-generation open world role-playing game, set in a visually stunning fantasy universe, full of meaningful choices and impactful consequences. In The Witcher, you play as Geralt of Rivia, a monster hunter tasked with finding a child from an ancient prophecy.",
			"header_image": "http://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg?t=1479919850",
			"name": "The Witcher® 3: Wild Hunt",
			"removed": false
		},
		"tags": null,
		"created": 0
	},
	{
		"id": "383870",
		"properties": {
			"description": "Firewatch is a single-player first-person mystery set in the Wyoming wilderness, where your only emotional lifeline is the person on the other end of a handheld radio.",
			"header_image": "http://cdn.akamai.steamstatic.com/steam/apps/383870/header.jpg?t=1487294153",
			"name": "Firewatch",
			"removed": false
		},
		"tags": null,
		"created": 0
	},
	{
		"id": "3900",
		"properties": {
			"description": "With over 6 million units sold and unprecedented critical acclaim from fans and press around the world, Sid Meier's Civilization is recognized as one of the greatest PC game franchises of all-time. Now, Sid Meier and Firaxis Games will take this incredibly fun and addictive game to new heights by adding new ways to play and win, new tools to manage and expand your civilization, all-new easy to use mod capabilities and intense multiplayer modes and options*. Civilization IV will come to life like never before in a beautifully detailed, living 3D world that will elevate the gameplay experience to a whole new level. Civilization IV has already been heralded as one of the top ten games of 2005, and a must-have for gamers around the globe![/b]*Mac version's Online Multiplayer is no longer supported.[/b]",
			"header_image": "http://cdn.akamai.steamstatic.com/steam/apps/3900/header.jpg?t=1447366360",
			"name": "Sid Meier's Civilization® IV",
			"removed": false
		},
		"tags": null,
		"created": 0
	},
	{
		"id": "72850",
		"properties": {
			"description": "The Game of a GenerationVoted 'The Best Game of the Generation' by amazon.co.uk users, andAbout the GameEPIC FANTASY REBORNThe next chapter in the highly anticipated Elder Scrolls saga arrives from the makers of the 2006 and 2008 Games of the Year, Bethesda Game Studios. Skyrim reimagines and revolutionizes the open-world fantasy epic, bringing to life a complete virtual world open for you to explore any way you choose.LIVE ANOTHER LIFE, IN ANOTHER WORLDPlay any type of character you can imagine, and do whatever you want; the legendary freedom of choice, storytelling, and adventure of The Elder Scrolls is realized like never before.ALL NEW GRAPHICS AND GAMEPLAY ENGINESkyrim’s new game engine brings to life a complete virtual world with rolling clouds, rugged mountains, bustling cities, lush fields, and ancient dungeons.YOU ARE WHAT YOU PLAYChoose from hundreds of weapons, spells, and abilities.  The new character system allows you to play any way you want and define yourself through your actions.DRAGON R...",
			"header_image": "http://cdn.akamai.steamstatic.com/steam/apps/72850/header.jpg?t=1486501742",
			"name": "The Elder Scrolls V: Skyrim",
			"removed": false
		},
		"tags": null,
		"created": 0
	},
	{
		"id": "8870",
		"properties": {
			"description": "Indebted to the wrong people, with his life on the line, veteran of the U.S. Cavalry and now hired gun, Booker DeWitt has only one opportunity to wipe his slate clean. He must rescue Elizabeth, a mysterious girl imprisoned since childhood and locked up in the flying city of Columbia. Forced to trust one another, Booker and Elizabeth form a powerful bond during their daring escape. Together, they learn to harness an expanding arsenal of weapons and abilities, as they fight on zeppelins in the clouds, along high-speed Sky-Lines, and down in the streets of Columbia, all while surviving the threats of the air-city and uncovering its dark secret.Key FeaturesThe City in the Sky – Leave the depths of Rapture to soar among the clouds of Columbia. A technological marvel, the flying city is a beautiful and vibrant world that holds a very dark secret. Unlikely Mission – Set in 1912, hired gun Booker DeWitt must rescue a mysterious girl from the sky-city of Columbia or never leave it alive. Whip, Zip, and Kill –...",
			"header_image": "http://cdn.akamai.steamstatic.com/steam/apps/8870/header.jpg?t=1486444091",
			"name": "BioShock Infinite",
			"removed": false
		},
		"tags": null,
		"created": 0
	},
	{
		"id": "377160",
		"properties": {
			"description": "Bethesda Game Studios, the award-winning creators of Fallout 3 and The Elder Scrolls V: Skyrim, welcome you to the world of Fallout 4 – their most ambitious game ever, and the next generation of open-world gaming.",
			"header_image": "http://cdn.akamai.steamstatic.com/steam/apps/377160/header.jpg?t=1486403180",
			"name": "Fallout 4",
			"removed": false
		},
		"tags": null,
		"created": 0
	}
];

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
		console.log("initUID: setting initUser to true");
		_store.initUser = true;
		localStorage.setItem(g.LocalStorageKey.UserId, uid);
		_store.items = defaultItems;
	}
	_store.uid = uid;
}

function handleInitUser(){
	console.log("handleInitUser: setting initUser to false");
	_store.initUser = false;
	_store.items = [];
}

function handleSection(sect){
	_store.section = sect;
}

var eventDispatcher = {};

function undoEvent(event) {
	console.log("undo event:", event, "dispatcher:", eventDispatcher);
	if(event in eventDispatcher) {
		for(var i = 0; i < _store.events.length; i++){
			if(_store.events[i] == event) {
				console.log("found event, splicing");
				_store.events.splice(i, 1);
			}
		}
		delete eventDispatcher[event];
	}
}

function handleEventTracked(event){
	eventDispatcher[event] = true;
	if(_store.events == null){
		_store.events = [];
	}
	_store.events.push(event);
	if(event.get_recs){
		_store.recsRefreshing = true;
		console.log("recs refreshing");
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
		console.log("recs refreshed");
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
	console.log("event/retrieve events:", events);
	events.sort(eventCompare);
	_store.events = events;
	if(_store.events.length < 1) { // initial user
		console.log("handleEventsRetrieved length < 1, setting initUser to true");
		_store.items = defaultItems;
		_store.initUser = true;
	}
}

function handleItems(items){
	items.map(function(item, index){
		items[index].id = item.item;
	});
	_store.items = items;
}

function handleInit(){
	console.log("handleInit() called");
	if (_store.uid == null){
      	initUID();
      	loadEvents();
      	console.log("init store:", _store);
    }
}

var Store = assign({}, EventEmitter.prototype, {
	GetState: function(){
		if (_store.uid == null){
	      	initUID();
	      	loadEvents();
	      	console.log("GetState store:", _store);
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