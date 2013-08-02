if (typeof gencon === 'undefined' || gencon === null){
    gencon = { events: null };
}

gencon.events = (function() {

	var

	filterEvents = function(events, filter) {
		return $.grep(events, filter);
	},

	isRpg = function(event) {
		return getEventType(event) === 'RPG - Role Playing Game';
	},

	startsAtOrAfter = function(date) {
		return getStartDate(event) >= date;
	},

	endsByOrBefore = function(date) {
		return getEndDate(event) <= date;
	},

	getCode = function(event) {
		return event['Game Code'];
	},

	getTitle = function(event) {
		return event['Title'];
	},

	getEventType = function(event) {
		return event['Event Type'];
	},

	getSystem = function(event) {
		return event['Game System'];
	},

	getStartDate = function(event) {
		return event['Start Date'];
	},

	getStartDateAsDate = function(event) {
		return new Date(event['Start Date']);
	},

	getStartDateFormatted = function(event) {
		return getFormattedDate(getStartDateAsDate(event));		
	},

	getEndDate = function(event) {
		return event['End Date'];
	},

	getEndDateAsDate = function(event) {
		return new Date(event['End Date']);
	},

	getEndDateFormatted = function(event) {
		return getFormattedDate(getEndDateAsDate(event));		
	},

	getDuration = function(event) {
		return event['Duration'];
	},

	getLocation = function(event) {
		return event['Location'];
	},

	getRoom = function(event) {
		return event['Room Name'];
	},

	getEventBrief = function(event, separator) {
		var temp = [];
		temp.push("Code:");
		temp.push(getCode(event));
		temp.push("Title:");
		temp.push(getTitle(event));
		temp.push("Type:");
		temp.push(getEventType(event));
		temp.push("System:");
		temp.push(getSystem(event));
		temp.push("Start:");
		temp.push(getStartDate(event));
		temp.push("End:");
		temp.push(getEndDate(event));
		temp.push("Duration:");
		temp.push(getDuration(event));
		temp.push("Location:");
		temp.push(getLocation(event));
		temp.push("Room:");
		temp.push(getRoom(event));
		return isUndefined(separator) ? temp.join(' ') : temp.join(separator);
	},

	getEventBlock = function(event, separator) {
		var temp = [];
		temp.push(getCode(event));
		temp.push(getTitle(event));
		temp.push(getSystem(event));
		temp.push(getStartDateFormatted(event) + ' - ' + getEndDateFormatted(event) + ' (' + getDuration(event) + ')');
		temp.push(getLocation(event) + ': ' + getRoom(event));
		return isUndefined(separator) ? temp.join('\n') : temp.join(separator);
	},

	sortByStartAndEndDate = function(a, b) {
		return getStartDateAsDate(a) === getStartDateAsDate(b) ? sortByEndDate(a, b) : sortByStartDate(a, b);
	},

	sortByStartDate = function(a, b) {
		return getStartDateAsDate(a) > getStartDateAsDate(b) ? 1 : -1;
	},

	sortByEndDate = function(a, b) {
		return getEndDateAsDate(a) > getEndDateAsDate(b) ? 1 : -1;
	},

	doEventsOverlap = function(a, b) {
		return getStartDateAsDate(a) < getEndDateAsDate(b) && getEndDateAsDate(a) > getStartDateAsDate(b);
	},

	isNonOverlappingEvent = function(candidateEvent, events) {
		return $.grep(events, function(event) { return doEventsOverlap(event, candidateEvent); }).length === 0;
	},

	getEventByCode = function(events, code) {
		return $.grep(events, function(event) {
			return getCode(event) === code;
		})[0];
	},

	getEventsFromCodes = function(events, codes) {
		return $.map(codes, function(code) {
			return getEventByCode(events, code);
		});
	},

	getGroupsOfNonOverlappingEvents = function(events) {
		var eventsToGroup = events.slice(0);
		length = events.length,
		groups = [];

		while (!areAllEventsGrouped(eventsToGroup)) {
			//console.log("All events are not grouped, so starting loop");
			groups.push(getGroupOfNonOverlappingEvents(eventsToGroup));
		}

		return groups;
	},

	areAllEventsGrouped = function(events) {
		return $.grep(events, function(event) {	return !event.isInGroup; }).length === 0;
	},

	getGroupOfNonOverlappingEvents = function(events) {
		var length = events.length,
			group = [];

		for (var i = 0; i < length; i++) {
			if (events[i].isInGroup) {
				continue;
			}

			if (isNonOverlappingEvent(events[i], group)) {
				group.push(events[i]);
				events[i].isInGroup = true;
			}
		}
		return group;
	},

	getFormattedDate = function(date){
		var minutes = date.getMinutes().toString().length > 1 ? date.getMinutes() : '00';
		return getDayName(date) + ' ' + date.getHours() + ':' + minutes;
	},

	getDayName = function(date){
		var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		return dayNames[date.getDay()];
	}

	isUndefined = function(object) {
		return typeof object === 'undefined';
	};

	return {
		isRpg: isRpg,
		filterEvents: filterEvents,
		startsAtOrAfter: startsAtOrAfter,
		endsByOrBefore: endsByOrBefore,
		getCode: getCode,
		getTitle: getTitle,
		getEventType: getEventType,
		getSystem: getSystem,
		getStartDate: getStartDate,
		getStartDateAsDate: getStartDateAsDate,
		getStartDateFormatted: getStartDateFormatted,
		getEndDate: getEndDate,
		getEndDateAsDate: getEndDateAsDate,
		getEndDateFormatted: getEndDateFormatted,
		getDuration: getDuration,
		getLocation: getLocation,
		getRoom: getRoom,
		getEventBrief: getEventBrief,
		getEventBlock: getEventBlock,
		sortByStartAndEndDate: sortByStartAndEndDate,
		sortByStartDate: sortByStartDate,
		sortByEndDate: sortByEndDate,
		doEventsOverlap: doEventsOverlap,
		isNonOverlappingEvent: isNonOverlappingEvent,
		getEventByCode: getEventByCode,
		getEventsFromCodes: getEventsFromCodes,
		getGroupsOfNonOverlappingEvents: getGroupsOfNonOverlappingEvents
	}
}());