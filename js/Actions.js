import AppDispatcher from './dispatcher/AppDispatcher';
import Constants from './constants/Constants';
import g from './Globals';
var db = require('store');

var NUM_RECS = 50;

var pending = {
	trackEvent: {},
	retrieveEvents: false,
	updateRecs: false
}

var Actions = {
	init: function(){
		console.log("init called");
		// AppDispatcher.handleViewAction({
		//   actionType: Constants.INIT
		// });
		var guestId = db.get('tmb_uid');
		if (guestId != null && guestId != 'undefined'){
			this.retrieveEvents();
		}
	},
	initUser: function(){
		AppDispatcher.handleViewAction({
		  actionType: Constants.INIT_USER
		});
	},
	trackEvent: function(item, behavior, value, timestamp, get_recs){
		var event = {
			item: item,
			behavior: behavior,
			amount: value,
			created: timestamp
		};
		if(get_recs != null){
			get_recs.number = NUM_RECS;
			event.get_recs = get_recs;
		}

		if (event in pending.trackEvent){
			console.log("request already pending for event", event);
			return
		}
		pending.trackEvent[event] = true;

		AppDispatcher.handleViewAction({
		  actionType: Constants.TRACK_EVENT,
		  event: event
		});
		g.tamber.event.track(event, function(err, result) {
			console.log("err:", err, "result:", result);
			delete pending.trackEvent[event];
		     AppDispatcher.handleServerAction({
			  actionType: Constants.EVENT_TRACKED,
			  err: err,
			  event: event,
			  result: result
			});
		});
	},
	retrieveEvents: function(){
		if (pending.retrieveEvents){
			console.log("request already pending for retrieve events");
			return;
		}
		pending.retrieveEvents = true;
		g.tamber.event.retrieve({}, function(err, result) {
			pending.retrieveEvents = false;
			console.log("event retrieve:", result);
		     AppDispatcher.handleServerAction({
				actionType: Constants.EVENTS_RETRIEVED,
				err: err,
				result: result
			});
		});
	},
	updateRecs: function(){
		if (pending.updateRecs){
			console.log("request already pending for updateRecs");
			return;
		}
		pending.updateRecs = true;

		g.tamber.discover.next({
			number: NUM_RECS,
			get_properties: true
		},
		function(err, result) {
			pending.updateRecs = false;
			AppDispatcher.handleServerAction({
			  actionType: Constants.ITEMS_RETRIEVED,
			  err: err,
			  result: result
			});
		});
	},
	clickItem: function(item){
		AppDispatcher.handleViewAction({
		  actionType: Constants.GOTO_ITEM_PAGE,
		  data: item
		});
		var event = {
			item: item.id,
			behavior: "click",
		};

		if (event in pending.trackEvent){
			console.log("request already pending for event", event);
			return
		}
		pending.trackEvent[event] = true;
		AppDispatcher.handleViewAction({
		  actionType: Constants.TRACK_EVENT,
		  event: event
		});
		g.tamber.event.track(event, function(err, result) {
			console.log("err:", err, "result:", result);
			delete pending.trackEvent[event];
		     AppDispatcher.handleServerAction({
			  actionType: Constants.EVENT_TRACKED,
			  err: err,
			  event: event,
			  result: result
			});
		     g.tamber.discover.next({
				item: item.id,
				number: 10,
				get_properties: true,
			},
			function(err, result) {
				console.log("discover/next {get_properties: true} result:", result, "err:", err);
				AppDispatcher.handleServerAction({
				  actionType: Constants.ITEMS_RETRIEVED,
				  err: err,
				  result: result
				});
			});
		});

	},
	goToSection: function(section){
		AppDispatcher.handleViewAction({
		  actionType: Constants.GOTO_SECTION,
		  data: section
		});

		switch (section) {
			case g.Section.New:
				g.tamber.discover.new({
					number: 20,
					get_properties: true,
				},
				function(err, result) {
					console.log("discover/new {get_properties: true} result:", result, "err:", err);
					AppDispatcher.handleServerAction({
					  actionType: Constants.ITEMS_RETRIEVED,
					  err: err,
					  result: result
					});
				});
				break;
			case g.Section.Recommended:
				g.tamber.discover.next({
					number: 20,
					get_properties: true,
					randomness:0.1
				},
				function(err, result) {
					console.log("discover/next {get_properties: true} result:", result, "err:", err);
					AppDispatcher.handleServerAction({
					  actionType: Constants.ITEMS_RETRIEVED,
					  err: err,
					  result: result
					});
				});
				break;
			case g.Section.Hipster:
				g.tamber.discover.uac({
					number: NUM_RECS,
					get_properties: true
				},
				function(err, result) {
					console.log("discover/uac {get_properties: true} result:", result, "err:", err);
					AppDispatcher.handleServerAction({
					  actionType: Constants.ITEMS_RETRIEVED,
					  err: err,
					  result: result
					});
				});
				break;
			case g.Section.Hot:
				g.tamber.discover.hot({
					number: NUM_RECS,
					get_properties: true
				},
				function(err, result) {
					console.log("discover/hot {get_properties: true} result:", result, "err:", err);
					AppDispatcher.handleServerAction({
					  actionType: Constants.ITEMS_RETRIEVED,
					  err: err,
					  result: result
					});
				});
				break;
			case g.Section.Popular:
				AppDispatcher.handleViewAction({
				  actionType: Constants.RETRIEVE_ITEMS
				});
				g.tamber.discover.popular({
					number: NUM_RECS,
					get_properties: true
				},
				function(err, result) {
					console.log("discover/popular {get_properties: true} result:", result, "err:", err);
					AppDispatcher.handleServerAction({
					  actionType: Constants.ITEMS_RETRIEVED,
					  err: err,
					  result: result
					});
				});
				break;
		}
	},
	removeNotification: function(notification){
      AppDispatcher.handleViewAction({
        actionType: Constants.REMOVE_NOTIFICATION,
        data: notification
      });
   }
}

module.exports = Actions;