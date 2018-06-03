if (!window.DatePickerManager)
{
	var DatePickerManager = { };
}

if(!window.TimePickerManager)
{
	var TimePickerManager = { };
}

Object.extend(DatePickerManager, 
{
	DAYS: ["S", "M", "T", "W", "T", "F", "S"],
	
	MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	
	initialize: function()
	{
		this.calendar = document.body.insert({bottom: this.buildCalendar()}).childElements().last();
		
		this.heading = this.calendar.down(".month");
		
		document.observe('mousedown', this.mouseDown.bindAsEventListener(this));
		
		this.calendar.observe('mouseup', this.mouseUp.bindAsEventListener(this));
		
		this.calendar.observe('dblclick', this.dblClick.bindAsEventListener(this));
		
		this.selected = { day: 0, month:0, year:0};
	
		this.initialized = true;
	},
	
	dblClick: function(event)
	{
		if(!event.element().descendantOf(this.heading))
		{
			this.hide();
		}
	},
	
	mouseDown: function(event)
	{
		if(this.picker)
		{
			var source = event.element();
			
			if(source == this.calendar || source.descendantOf(this.calendar) || source == this.picker.element)
			{
				if(source != this.picker.element)
				{
					Event.stop(event);
				}
			}
			else
			{
				this.hide();
			}
		}
	},
	
	mouseUp: function(event)
	{
		
	},

	keyDown: function(event)
	{
		if(event.keyCode == Event.KEY_DOWN || event.keyCode == Event.KEY_UP)
		{
			if(this.selected.day == 0)
			{
				var now = new Date();
				
				this.selected = {day: now.getDate(), month: now.getMonth(), year:now.getFullYear() };
			}
			else
			{
				if(event.keyCode == Event.KEY_DOWN)
				{
					if(event.altKey)
					{
						if(event.shiftKey)
						{
							this.selected.year++;
						}
						else
						{
							this.selected.month++;
						}
					}
					else
					{
						this.selected.day++;
					}
				}
				else
				{
					if(event.altKey)
					{
						if(event.shiftKey)
						{
							this.selected.year--;
						}
						else
						{
							this.selected.month--;
						}
					}
					else
					{
						this.selected.day--;
					}
				}
			}
			
			var date = new Date(this.selected.year, this.selected.month, this.selected.day);
			
			this.selected = {day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
			
			this.update();
		}
		else if(event.keyCode == Event.KEY_TAB || event.keyCode == Event.KEY_RETURN || event.keyCode == Event.KEY_ESC)
		{
			this.hide();
		}
	},
	
	keyUp: function(event)
	{
		if(event.keyCode != Event.KEY_DOWN && event.keyCode != Event.KEY_UP && event.keyCode != Event.KEY_TAB && event.keyCode != Event.KEY_RETURN && event.keyCode != Event.KEY_ESC)
		{
			this.readValue();
			
			this.update(true);
		}
	},
	
	previousMonth: function()
	{
		this.current.month--;
		
		if(this.current.month < 0)
		{
			this.current.month = 11;
			this.current.year--;
		}
		
		this.updateCalendar();
		
		this.activate();
	},
	
	nextMonth: function()
	{
		this.current.month++;
		
		if(this.current.month >= 12)
		{
			this.current.month = 0;
			this.current.year++;
		}
		
		this.updateCalendar();
		
		this.activate();
	},
	
	select: function(inID)
	{
		var offset 		= 0;
		var year		= this.current.year;
		var month		= this.current.month;
		var day			= this.monthMap[inID];
		
		if(day < 0)
		{
			if(inID < 20)
			{
				offset = -1;
			}
			else
			{
				offset = 1;
			}
			
			day = -day;
		}
	
		month += offset;
		
		if(month < 0)
		{
			month = 11;
			year--;
		}
		else if(month > 11)
		{
			month = 0;
			year++;
		}
		
		this.selected = {day: day, month:month, year:year};
		
		this.update();
	},
	
	selectToday: function()
	{
		var date = new Date();
		
		this.selected = {day: date.getDate(), month: date.getMonth(), year: date.getFullYear() };
		
		this.update();
	},
	
	selectOK: function()
	{
		this.activate();
		
		this.hide();
	},
	
	selectCancel: function()
	{
		this.picker.element.value = this.original;
		
		this.activate();
		
		this.hide();
	},
	
	update: function(ignore)
	{
		if(this.picker)
		{
			this.current = { month:this.selected.month, year:this.selected.year };
			
			this.updateCalendar();
	
			if(!ignore)
			{
				if(this.selected.day > 0 && this.selected.month >= 0 && this.selected.year > 0)
				{
					this.picker.element.value = this.selected.day + " " + this.getMonthName(this.selected.month).substring(0, 3) + " " + this.selected.year;
				}
				
				if(this.picker.element.onchange) 
				{
					this.picker.element.onchange();
				}
				
				this.activate();
				
				if(this.picker.options.onPick)
				{
					this.picker.options.onPick();
				}
			}
		}
	},
	
	activate: function()
	{
		this.picker.element.activate();
	},
	
	readValue: function()
	{
		if(this.picker)
		{
			this.selected = { day:0, month:this.current.month, year:this.current.year };
			
			var value = this.picker.element.value.strip();
			
			if(this.picker.element.hasClassName("empty"))
			{
				value = "";
			}

			var parts = /^(\d{1,2}) *(\w{3}) *(\d{4})$/.exec(value);
	
			if(parts)
			{
				var day = parseInt(parts[1]);
				var month = this.getMonth(parts[2]);
				var year = parseInt(parts[3]);
				
				if(day >= 1 && day <= 31 && month >= 0 && month <= 11 && year >= 0)
				{
					this.selected = { day:day, month:month, year:year };
				}
			}
		}
	},
	
	show: function(inPicker)
	{
		if(!this.initialized)
		{
			this.initialize();
		}

		if(inPicker && inPicker != this.picker)
		{
			Client.hideMenus();
			
			var now = new Date();

			this.today = {day: now.getDate(), month:now.getMonth(), year:now.getFullYear() };
			
			this.current = { month:this.today.month, year:this.today.year };
			
			this.picker = inPicker;
			
			this.selected = {day: 0, month:0, year:0};
			
			inParse = this.picker.element.value.length > 0;
			
			this.calendar.setStyle({ visiblity:"hidden", display:"block" });
			
			var viewportBounds = new Bounds(document).shrink(5);
			
			var elementBounds = new Bounds(this.picker.element);
			
			var calendarBounds = new Bounds(this.calendar);
		
			calendarBounds.moveRelative("topleft", elementBounds, "bottomleft", 0, 2);
			
			var adjustment = calendarBounds.moveWithin(viewportBounds);
			
			if(adjustment.y < 0)
			{
				calendarBounds.moveRelative("bottomleft", elementBounds, "topleft", 0, -2);
			}
			
			calendarBounds.syncElement(this.calendar, "top left");

			this.calendar.setStyle({visiblity:"visible", display: "block"});
			
			this.original = this.picker.element.hasClassName("empty") ? "" : this.picker.element.value;
			
			this.readValue();
			
			this.update(true);
			
			this.picker.element.addClassName("ignoresubmit");
			
			Client.addMenu(this);
		}
	},
	
	hide: function()
	{
		if(this.calendar)
		{
			this.calendar.setStyle({display: "none"});
		}
		
		if(this.picker)
		{
			this.picker.element.removeClassName("ignoresubmit");
		}
		
		this.picker = null;
	},
	
	updateCalendar: function()
	{
		this.monthMap = new Array();
	
		var dayOfFirst = new Date(this.current.year, this.current.month, 1).getDay();
		var daysInMonth = new Date(this.current.year, this.current.month + 1, 0).getDate();
		var offsetLast	= new Date(this.current.year, this.current.month, 0).getDate() - dayOfFirst + 1;
		var date = 1;
		var next = 1;
		
		if(dayOfFirst == 0)
		{
			dayOfFirst = 7;
			offsetLast -= 7;
		}
	
		for (var d = 0; d < 7; d++)
		{
			this.monthMap[d] = (d < dayOfFirst) ? -(offsetLast + d) : date++;
		}
		
		for (var w = 1; w < 6; w++)
		{
			for (d = 0; d < 7; d++)
			{
				this.monthMap[(w * 7) + d] = (date <= daysInMonth) ? date++ : -(next++);
			}
		}
		
		// -----------------
		
		$('calendar_month').update(this.getMonthName(this.current.month) + " " + this.current.year);	
		
		for (var w = 0; w < 6; w++)
		{
			for (var d = 0; d < 7; d++)
			{
				var i = (w * 7) + d;
			
				var day = this.monthMap[i];
				
				var cell = $("c_" + i);
				
				cell.removeClassName("othermonth");
				cell.removeClassName("selected");
				cell.removeClassName("today");
			
				if (day < 0)
				{
					cell.addClassName("othermonth");
				}
				
				cell.addClassName(((d == 0) || (d == 6)) ? "weekend" : "weekday");
				
				cell.update(Math.abs(day));
				
				if((this.selected.year == this.current.year) && (this.selected.month == this.current.month) && (this.selected.day == day))
				{
					cell.addClassName("selected");
				}
				
				if((this.today.year == this.current.year) && (this.today.month == this.current.month) && (this.today.day == day))
				{
					cell.addClassName("today");
				}
			}
		}
	},
	
	buildCalendar: function()
	{
		var template = "";
		
		template += "<div class='datemenu picker'>";
		template += "<table>";
		template += "<tr class='subheading month'>";
		template += "<td onclick='DatePickerManager.previousMonth();' class='arrows'>&#9668;</td>";
		template += "<td colspan='5' id='calendar_month'></td>"
		template += "<td onclick='DatePickerManager.nextMonth();' class='arrows'>&#9658;</td>";
		template += "</tr>";
		template += "<tr class='subheading days'>";
		
		for(var i = 0; i < this.DAYS.length; i++)
		{
			template += "<td>" + this.DAYS[i] + "</td>";
		}
		
		template += "</tr>";
		
		for(var week = 0; week < 6; week++)
		{
			template += "<tr class='week'>";
			
			for (var day = 0; day < 7; day++)
			{
				var id = ((7 * week) + day);
				
				template += "<td><div class='item' id='c_" + id + "' onclick='DatePickerManager.select(" + id + ")'>" + id + "</div></td>";
			}
			
			template += "</tr>";
		}
		
		template += "</table>";
		template += "<div class='subheading'>";
		template += "<div class='arrows' onclick='DatePickerManager.selectToday();' style='float:left'>Today</div>";
		template += "<div class='arrows' onclick='DatePickerManager.selectOK();' style='float:right'>OK</div>";
		template += "<div class='arrows' onclick='DatePickerManager.selectCancel();' style='float:right'>Cancel</div>";
		template += "</div>";
		template += "</div>";
	
		return template;
	},
	
	getMonth: function(inMonth)
	{
		for(var i = 0; i < this.MONTHS.length; i++)
		{
			if(inMonth.toLowerCase() == this.MONTHS[i].toLowerCase().substring(0, 3))
			{
				return i;
			}
		}

		return -1;
	},
	
	getMonthName: function(inMonth)
	{
		if(inMonth < 12)
		{
			return this.MONTHS[inMonth];
		}
		
		return "";
	}
});

Object.extend(TimePickerManager, 
{	
	initialize: function()
	{
		this.clock = document.body.insert({bottom: this.buildClock()}).childElements().last();
		
		this.other = this.clock.down('.other', 0);
		
		this.heading = this.clock.down('.day', 0);
		
		document.observe('mousedown', this.mouseDown.bindAsEventListener(this));
		
		this.clock.observe('mouseup', this.mouseUp.bindAsEventListener(this));
		
		this.clock.observe('dblclick', this.dblClick.bindAsEventListener(this));
		
		this.selected = { hour:-1, minute:-1};
	
		this.initialized = true;
	},
	
	dblClick: function(event)
	{
		if(!event.element().descendantOf(this.heading))
		{
			this.hide();
		}
	},

	mouseDown: function(event)
	{
		if(this.picker)
		{
			var source = event.element();
			
			if(source == this.clock || source.descendantOf(this.clock) || source == this.picker.element)
			{
				if(source != this.picker.element)
				{
					Event.stop(event);
				}
			}
			else
			{
				this.hide();
			}
		}
	},
	
	mouseUp: function(event)
	{
		
	},
	
	keyDown: function(event)
	{
		if(event.keyCode == Event.KEY_DOWN || event.keyCode == Event.KEY_UP)
		{
			if(this.selected.hour == -1)
			{
				var now = new Date();
				
				this.selected = {hour: now.getHours(), minute: now.getMinutes(), meridian:1 };
				
				this.update();
			}
			else
			{
				if(event.keyCode == Event.KEY_DOWN)
				{
					if(event.altKey)
					{
						if(event.shiftKey)
						{
							this.toggleMeridian();
						}
						else
						{
							this.nextHour();
						}
					}
					else
					{
						this.nextMinute();
					}
				}
				else
				{
					if(event.altKey)
					{
						if(event.shiftKey)
						{
							this.toggleMeridian();
						}
						else
						{
							this.previousHour();
						}
					}
					else
					{
						this.previousMinute();
					}
				}
			}
		}
		else if(event.keyCode == Event.KEY_TAB || event.keyCode == Event.KEY_RETURN || event.keyCode == Event.KEY_ESC)
		{
			this.hide();
		}
	},
	
	keyUp: function(event)
	{
		if(event.keyCode != Event.KEY_RETURN && event.keyCode != Event.KEY_TAB && event.keyCode != Event.KEY_DOWN && event.keyCode != Event.KEY_UP && event.keyCode != Event.KEY_ESC)
		{
			this.readValue();
			
			this.update(true);
		}
	},
	
	toggleMeridian: function()
	{
		if(this.selected.hour < 11)
		{
			this.selected.hour += 12;
		}
		else
		{
			this.selected.hour -= 12;
		}
		
		this.update();
	},
	
	previousHour: function()
	{
		this.selected.hour--;
		
		if(this.selected.hour < 0)
		{
			this.selected.hour = 23;
		}
		
		this.update();
	},
	
	nextHour: function()
	{
		this.selected.hour++;
		
		if(this.selected.hour > 23)
		{
			this.selected.hour = 0;
		}
		
		this.update();
	},
	
	previousMinute: function()
	{
		this.selected.minute--;
		
		if(this.selected.minute < 0)
		{
			this.selected.minute = 59;
			
			this.selected.hour--;
			
			if(this.selected.hour < 0)
			{
				this.selected.hour = 23;
			}
		}
		
		this.update();
	},
	
	nextMinute: function()
	{
		this.selected.minute++;
		
		if(this.selected.minute > 59)
		{
			this.selected.minute = 0;
			
			this.selected.hour++;
			
			if(this.selected.hour > 12)
			{
				this.selected.hour = 0;
			}
		}
		
		this.update();
	},
	
	selectHour: function(inHour)
	{
		if(this.selected.minute < 0)
		{
			this.selected.minute = 0;
		}
		
		if(this.selected.hour < 12)
		{
			this.selected.hour = inHour;
		}
		else
		{
			this.selected.hour = inHour + 12;
		}
		
		this.update();
	},
	
	selectMinute: function(inMinute)
	{
		if(this.selected.hour < 0)
		{
			this.selected.hour = 1;
		}
		
		this.selected.minute = inMinute;
		
		this.update();
	},
	
	selectMeridian: function(inMeridian)
	{
		if(inMeridian == "pm" && this.selected.hour < 12)
		{
			this.selected.hour += 12;
		}
		else if(inMeridian == "am" && this.selected.hour >= 12)
		{
			this.selected.hour -= 12;				
		}
		
		this.update();
	},
	
	selectNow: function()
	{
		var date = new Date();
		
		this.selected = {hour: date.getHours(), minute: date.getMinutes(), meridian: 1};
		
		this.update();
	},
	
	selectOK: function()
	{
		this.activate();
		
		this.hide();
	},
	
	selectCancel: function()
	{
		this.picker.element.value = this.original;
		
		this.activate();
		
		this.hide();
	},
	
	update: function(ignore)
	{
		this.updateClock();
		
		if(this.selected.hour >= 0 && this.selected.minute >= 0 && !ignore)
		{
			var hour = this.selected.hour < 12 ? this.selected.hour : this.selected.hour - 12;
			
			if(hour == 0)
			{
				hour = 12;
			}
			
			var minute = this.selected.minute < 10 ? "0" + this.selected.minute : this.selected.minute;
			
			var meridian = this.selected.hour < 12 ? "am" : "pm";

			this.picker.element.value = hour + ":" + minute + " " + meridian;
			
			this.activate();
		}
	},
	
	activate: function()
	{
		this.picker.element.activate();
	},
	
	readValue: function()
	{
		this.selected = {hour:-1, minute:-1};
		
		var value = this.picker.element.value.strip();
		
		if(this.picker.element.hasClassName("empty"))
		{
			value = "";
		}
	
		var parts = /^(\d{1,2}):(\d{2}) *(am|pm)$/i.exec(value);

		if(parts)
		{
			var hour = parseInt(parts[1]);
			var minute = parseInt(parts[2]);
			var meridian = parts[3];
			
			if(hour == 12)
			{
				hour = 0;
			}
			
			if(meridian && meridian.toLowerCase() == "pm")
			{
				hour += 12;
			}
			
			if(hour >= 0 && hour < 24 && minute >= 0 && minute <= 59 && meridian)
			{
				this.selected = {hour: hour, minute:minute};
			}
		}
	},
	
	show: function(inPicker)
	{
		if(!this.initialized)
		{
			this.initialize();
		}

		if(inPicker && inPicker != this.picker)
		{
			Client.hideMenus();
			
			this.picker = inPicker;
			
			this.selected = {hour:-1, minute:-1};
			
			inParse = this.picker.element.value.length > 0;
		
			this.clock.setStyle({ visiblity:"hidden", display:"block" });
			
			var viewportBounds = new Bounds(document).shrink(10);
			
			var elementBounds = new Bounds(this.picker.element);
			
			var clockBounds = new Bounds(this.clock);
			
			clockBounds.moveRelative("topleft", elementBounds, "bottomleft", 0, 2);
			
			var adjustment = clockBounds.moveWithin(viewportBounds);
			
			if(adjustment.y < 0)
			{
				clockBounds.moveRelative("bottomleft", elementBounds, "topleft", 0, -2);
			}
			
			clockBounds.syncElement(this.clock, "top left");

			this.clock.setStyle({visiblity:"visible", display: "block"});
			
			this.original = this.picker.element.hasClassName("empty") ? "" : this.picker.element.value;
			
			this.readValue();

			this.update(true);
			
			this.picker.element.addClassName("ignoresubmit");
			
			Client.addMenu(this);
		}
	},
	
	hide: function()
	{
		if(this.clock)
		{
			this.clock.setStyle({display: "none"});
		}
		
		if(this.picker)
		{
			this.picker.element.removeClassName("ignoresubmit");
		}
		
		this.picker = null;
	},
	
	updateClock: function()
	{
		for(var i = 0; i < 12; i++)
		{
			var hourElement = $('h_' + i);

			if(i == this.selected.hour || (i + 12) == this.selected.hour)
			{
				hourElement.addClassName("selected");
			}
			else
			{
				hourElement.removeClassName("selected");
			}
		}
		
		this.other.setStyle({display:"none"});
		
		for(var i = 0; i < 60; i += 5)
		{
			var minuteElement = $('m_' + i);
			
			var selected = Math.floor(this.selected.minute / 5) * 5;

			if(i == selected)
			{
				minuteElement.addClassName("selected");
				
				if(this.selected.minute != selected)
				{
					minuteElement.insert({bottom: this.other});
					
					this.other.update(":" + (this.selected.minute < 10 ? "0" + this.selected.minute : this.selected.minute));
					
					this.other.setStyle({display:""});
				}
			}
			else
			{
				minuteElement.removeClassName("selected");
			}
		}
		
		var am = $('am');
		var pm = $('pm');
		
		am.removeClassName("selected");
		pm.removeClassName("selected");
		
		if(this.selected.hour >= 0)
		{
			if(this.selected.hour < 12)
			{
				am.addClassName("selected");
			}
			else
			{
				pm.addClassName("selected");
			}
		}
	},
	
	buildClock: function()
	{
		var template = "";
		
		template += "<div class='datemenu picker'>";
		template += "<table>";
		template += "<tr class='day'>";
		template += "<td colspan='3' class='subheading'><span class='buttons arrows' onclick='TimePickerManager.previousHour()'>&#9668;</span> Hour <span class='buttons arrows' onclick='TimePickerManager.nextHour()'>&#9658;</span></td>";
		template += "<td rowspan='5' class='gutter'></td>";
		template += "<td colspan='3' class='subheading'><span class='buttons arrows' onclick='TimePickerManager.previousMinute()'>&#9668;</span> Minutes <span class='buttons arrows' onclick='TimePickerManager.nextMinute()'>&#9658;</span></td>";
		template += "<td rowspan='5' class='gutter'></td>";
		template += "<td></td>";
		template += "</tr>";
		template += "<tr>";
		template += "<td><div id='h_1' class='item' onclick='TimePickerManager.selectHour(1)'>1</div></td>";
		template += "<td><div id='h_2' class='item' onclick='TimePickerManager.selectHour(2)'>2</div></td>";
		template += "<td><div id='h_3' class='item' onclick='TimePickerManager.selectHour(3)'>3</div></td>";
		template += "<td><div id='m_0' class='item' onclick='TimePickerManager.selectMinute(0)'>:00</div></td>";
		template += "<td><div id='m_5' class='item' onclick='TimePickerManager.selectMinute(5)'>:05</div></td>";
		template += "<td><div id='m_10' class='item' onclick='TimePickerManager.selectMinute(10)'>:10</div></td>";
		template += "<td rowspan='4'><div id='am' class='item' onclick='TimePickerManager.selectMeridian(\"am\")'>am</div><div id='pm' class='item' onclick='TimePickerManager.selectMeridian(\"pm\")'>pm</div></td>";
		template += "</tr>";
		template += "<tr>";
		template += "<td><div id='h_4'  class='item' onclick='TimePickerManager.selectHour(4)'>4</div></td>";
		template += "<td><div id='h_5'  class='item' onclick='TimePickerManager.selectHour(5)'>5</div></td>";
		template += "<td><div id='h_6'  class='item' onclick='TimePickerManager.selectHour(6)'>6</div></td>";
		template += "<td><div id='m_15' class='item' onclick='TimePickerManager.selectMinute(15)'>:15</div></td>";
		template += "<td><div id='m_20' class='item' onclick='TimePickerManager.selectMinute(20)'>:20</div></td>";
		template += "<td><div id='m_25' class='item' onclick='TimePickerManager.selectMinute(25)'>:25</div></td>";
		template += "</tr>";
		template += "<tr>";
		template += "<td><div id='h_7'  class='item' onclick='TimePickerManager.selectHour(7)'>7</div></td>";
		template += "<td><div id='h_8'  class='item' onclick='TimePickerManager.selectHour(8)'>8</div></td>";
		template += "<td><div id='h_9'  class='item' onclick='TimePickerManager.selectHour(9)'>9</div></td>";
		template += "<td><div id='m_30' class='item' onclick='TimePickerManager.selectMinute(30)'>:30</div></td>";
		template += "<td><div id='m_35' class='item' onclick='TimePickerManager.selectMinute(35)'>:35</div></td>";
		template += "<td><div id='m_40' class='item' onclick='TimePickerManager.selectMinute(40)'>:40</div></td>";
		template += "</tr>";
		template += "<tr>";
		template += "<td><div id='h_10'  class='item' onclick='TimePickerManager.selectHour(10)'>10</div></td>";
		template += "<td><div id='h_11'  class='item' onclick='TimePickerManager.selectHour(11)'>11</div></td>";
		template += "<td><div id='h_0'   class='item' onclick='TimePickerManager.selectHour(0)'>12</div></td>";
		template += "<td><div id='m_45' class='item' onclick='TimePickerManager.selectMinute(45)'>:45</div></td>";
		template += "<td><div id='m_50' class='item' onclick='TimePickerManager.selectMinute(50)'>:50</div></td>";
		template += "<td><div id='m_55' class='item' onclick='TimePickerManager.selectMinute(55)'>:55</div></td>";
		template += "</tr>";
		template += "</table>";
		template += "<div class='selected other item'></div>";
		
		template += "<div class='subheading'>";
		template += "<div class='arrows' onclick='TimePickerManager.selectNow();' style='float:left'>Now</div>";
		template += "<div class='arrows' onclick='TimePickerManager.selectOK();' style='float:right'>OK</div>";
		template += "<div class='arrows' onclick='TimePickerManager.selectCancel();' style='float:right'>Cancel</div>";
		template += "</div>";
		template += "</div>";
	
		return template;
	}
});

// -----------

var DatePicker = Class.create(
{
	initialize: function(element, options)
	{
		this.element = $(element);
		
		if(!this.element)
		{
			return;
		}

		this.options = { };
		
		Object.extend(this.options, options || { });

		// --------
		
		this.element.observe('focus',		this.show.bindAsEventListener(this));
		this.element.observe('click',		this.show.bindAsEventListener(this));
		this.element.observe('keydown',		this.keydown.bindAsEventListener(this));
		this.element.observe('keyup',		this.keyup.bindAsEventListener(this));
	},
	
	show: function(event)
	{
		DatePickerManager.show(this);
	},
	
	keyup: function(event)
	{
		DatePickerManager.keyUp(event);
	},
	
	keydown: function(event)
	{
		if(DatePickerManager.picker == null && event.keyCode != Event.KEY_TAB && event.keyCode != Event.KEY_ESC)
		{
			DatePickerManager.show(this);
		}
		else
		{
			DatePickerManager.keyDown(event);
		}
	}
});

var TimePicker = Class.create(
{
	initialize: function(element, options)
	{
		this.element = $(element);
		
		if(!this.element)
		{
			return;
		}

		this.options = { };
		
		Object.extend(this.options, options || { });

		// --------
		
		this.element.observe('focus',		this.show.bindAsEventListener(this));
		this.element.observe('click',		this.show.bindAsEventListener(this));
		this.element.observe('keydown',		this.keydown.bind(this));
		this.element.observe('keyup',		this.keyup.bind(this));
	},
	
	show: function(event)
	{
		TimePickerManager.show(this);
	},

	keyup: function(event)
	{
		TimePickerManager.keyUp(event);
	},
	
	keydown: function(event)
	{
		if(TimePickerManager.picker == null && event.keyCode != Event.KEY_TAB && event.keyCode != Event.KEY_ESC)
		{
			TimePickerManager.show(this);
		}
		else
		{
			TimePickerManager.keyDown(event);
		}
	}
});