import AppDispatcher from './dispatcher/AppDispatcher';
import Constants from './constants/Constants';
import tamberPkg from 'tamber';
import g from './Globals';

const tamber = tamberPkg('tdQovPrfnduec1jhfuJi', 'nwHbdpsSTqmu19D0YGIG');
tamber.setApiUrl('https://works.tamber.com/v1');

var NUM_RECS = 30;

var pending = {
	trackEvent: {},
	retrieveEvents: false,
	updateRecs: false
}

var Actions = {
	init: function(){
		AppDispatcher.handleViewAction({
		  actionType: Constants.INIT
		});
	},
	initUser: function(){
		AppDispatcher.handleViewAction({
		  actionType: Constants.INIT_USER
		});
	},
	trackEvent: function(user, item, behavior, value, timestamp, get_recs){
		var event = {
			user: user,
			item: item,
			behavior: behavior,
			value: value,
			created: timestamp
		};
		if(get_recs != null){
			get_recs.number = NUM_RECS;
			event.get_recs = get_recs;
		}
		console.log("tracking event:", event);

		if (event in pending.trackEvent){
			console.log("request already pending for event", event);
			return
		}
		pending.trackEvent[event] = true;

		AppDispatcher.handleViewAction({
		  actionType: Constants.TRACK_EVENT,
		  event: event
		});
		tamber.event.track(event, function(err, result) {
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
	retrieveEvents: function(user){
		if (pending.retrieveEvents){
			console.log("request already pending for retrieve events");
			return;
		}
		pending.retrieveEvents = true;
		tamber.event.retrieve({
			user: user
		}, function(err, result) {
			pending.retrieveEvents = false;
		     AppDispatcher.handleServerAction({
				actionType: Constants.EVENTS_RETRIEVED,
				err: err,
				result: result
			});
		});
	},
	updateRecs: function(user){
		if (pending.updateRecs){
			console.log("request already pending for updateRecs");
			return;
		}
		pending.updateRecs = true;

		tamber.discover.recommended({
			user: user,
			number: NUM_RECS,
			get_properties: true
		},
		function(err, result) {
			pending.updateRecs = false;
			console.log("discover/recommended {get_properties: true} result:", result, "err:", err);
			AppDispatcher.handleServerAction({
			  actionType: Constants.ITEMS_RETRIEVED,
			  err: err,
			  result: result
			});
		});
	},
	goToSection: function(section, user){
		AppDispatcher.handleViewAction({
		  actionType: Constants.GOTO_SECTION,
		  data: section
		});

		switch (section) {
			case g.Section.Recommended:
				// AppDispatcher.handleViewAction({
				//   actionType: Constants.RETRIEVE_ITEMS
				// });
				tamber.discover.recommended({
					user: user,
					number: NUM_RECS,
					get_properties: true
				},
				function(err, result) {
					console.log("discover/recommended {get_properties: true} result:", result, "err:", err);
					AppDispatcher.handleServerAction({
					  actionType: Constants.ITEMS_RETRIEVED,
					  err: err,
					  result: result
					});
				});
				break;
			case g.Section.Hipster:
				// AppDispatcher.handleViewAction({
				//   actionType: Constants.RETRIEVE_ITEMS
				// });
				tamber.discover.uac({
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
				// AppDispatcher.handleViewAction({
				//   actionType: Constants.RETRIEVE_ITEMS
				// });
				tamber.discover.hot({
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
				tamber.discover.popular({
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