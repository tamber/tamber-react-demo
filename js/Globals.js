
var PHKeys = {
	name: "name",
	header_image: "thumbnail_url",
	description:"tagline",
	url: "discussion_url"
}

var SteamKeys = {
	name: "name",
	header_image: "header_image",
	description:"description",
	url: "url"
}

var Globals = {
	Section: {
		Recommended: 0,
		Hipster: 1,
		Popular: 2,
		Hot: 3
	},
	LocalStorageKey: {
		UserId: "user",
		Events: "events",
	},
	Behaviors: {
		Like: "like",
		Hover: "hover",
		ViewDetail: "view_detail"
	},
	ItemKeys: PHKeys
}

module.exports = Globals;