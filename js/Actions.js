import AppDispatcher from './dispatcher/AppDispatcher';
import Constants from './constants/Constants';
import tamber from 'tamber';
import g from './Globals';

var client = {
	ApiUrl : "https://works.tamber.com/v1",
	DefaultTimeout: 80
}

var mytamber = tamber.New('UGINoEuqQufmhDbBl52Q', null, client);

var Actions = {
	trackEvent: function(user, item, behavior, value, timestamp){
		mytamber.Event.Track({
			user: user,
			item: item,
			behavior: behavior,
			value: value,
			created: timestamp
		}, function(err, result) {
		     AppDispatcher.handleServerAction({
			  actionType: Constants.EVENT_TRACKED,
			  err: err,
			  result: result
			});
		});
	},
	retrieveEvents: function(user){
		mytamber.Event.Retrieve({
			user: user
		}, function(err, result) {
		     AppDispatcher.handleServerAction({
				actionType: Constants.EVENTS_RETRIEVED,
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
				mytamber.Discover.Recommended(
					{user: user},
					function(err, result) {
						AppDispatcher.handleServerAction({
						  actionType: Constants.ITEMS_RETRIEVED,
						  err: err,
						  result: result
						});
					});
				break;
			case g.Section.Hot:
				mytamber.Discover.Hot(
					{},
					function(err, result) {
						AppDispatcher.handleServerAction({
						  actionType: Constants.ITEMS_RETRIEVED,
						  err: err,
						  result: result
						});
					});
				break;
			case g.Section.Popular:
				mytamber.Discover.Popular(
					{},
					function(err, result) {
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