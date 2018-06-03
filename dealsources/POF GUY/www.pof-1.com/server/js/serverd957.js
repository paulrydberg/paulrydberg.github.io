Object.extend(Event,
{
	wheel:function (event)
	{
		var delta = 0;
		
		if(!event)
		{
			event = window.event;
		}
		
		if(event.wheelDelta)
		{
			delta = event.wheelDelta / 120;
			
			if (window.opera)
			{
				delta = -delta;
			}
			
		}
		else if(event.detail)
		{
			delta = -event.detail / 3;
		}
		
		return Math.round(delta); //Safari Round
	}
});

//----------------

var Client = 
{
	selectable: true,
	
	initialize: function()
	{
		document.observe('keydown', this.keydown.bindAsEventListener(this));
		
		document.observe('keyup', this.keyup.bindAsEventListener(this));
		
		this.canvas = !!document.createElement('canvas').getContext;
		
		this.menus = [];
		
		this.activeElement = null;
	},
	
	hasCanvas: function()
	{
		return this.canvas;
	},
	
	resize: function()
	{
		document.fire('behavior:resize');
	},
	
	forceRedraw: function()
	{
		if(Prototype.Browser.IE)
		{
			document.body.addClassName("redraw");
			document.body.removeClassName("redraw");
		}
	},
	
	keydown: function(inEvent)
	{
		if(inEvent.keyCode == 18) // option
		{
			document.body.addClassName("optionkey");
		}
	},
	
	keyup: function(inEvent)
	{
		if(inEvent.keyCode == 18) // option
		{
			document.body.removeClassName("optionkey");
		}
	},

	link: function(inElement, inTarget)
	{
		if(document.body.hasClassName("optionkey"))
		{
			var element = $(inElement)
			
			var action = element.readAttribute('action');
			
			if(action.startsWith('javascript:'))
			{
				action = action.substring(11);
			}
		
			if(inTarget)
			{
				window.open(action, inTarget, 'toolbar=no,status=no,scrollbars=yes');
			}
			else
			{
				try
				{
					eval(action);
				}
				catch(e)
				{
					window.location.href = action;
				}
			}
		}
	},
	
	addMenu: function(inElement)
	{
		this.menus.push(inElement);
	},
	
	hideMenus: function()
	{
		for(var i = 0; i < this.menus.length; i++)
		{
			this.menus[i].hide();
		}
		
		this.menus.clear();
	},
	
	setActiveElement: function(inElement)
	{
		this.activeElement = $(inElement);
	},
	
	getActiveElement: function()
	{
		var tagName = document.activeElement.tagName.toLowerCase();
		
		if(tagName != "input" && tagName != "textarea" && tagName != "select" && document.activeElement.readAttribute("contenteditable") != "true")
		{
			return this.activeElement;
		}
		
		return document.activeElement;
	},
	
	fire: function(inElement, inEvent)
	{
	    var element = $(inElement);

	    if (document.createEvent)
	    {
	    	var event = document.createEvent('HTMLEvents');
	    	event.initEvent(inEvent, true, true);
	    	element.dispatchEvent(event);
	    }
	    else
	    {
	    	var event = document.createEventObject();
	    	event.eventType = inEvent;
	    	element.fireEvent(event.eventType, event);
	    }
	}
};

window.Client.initialize();

window.onresize = Client.resize.bind(Client);

// ------------



// --------------

if(!window.Format)
{
	window.Format = {};
}

Object.extend(window.Format, 
{
	parts: function(number, precision, thousands, decimal, currencyBefore, currencyAfter, negativeBefore, negativeAfter)
	{
		var x = Math.round(number * Math.pow(10, precision));
		
		if(x >= 0)
		{
			negativeBefore = negativeAfter = '';
		}
		
		if(precision <= 0)
		{
			decimal = '';
		}
		
		var y = ('' + Math.abs(x)).split('');
		
		var z = y.length - precision;

		if(z < 0)
		{
			z--;
		}

		for(var i = z; i < 0; i++)
		{
			y.unshift('0');
		}

		if(z < 0)
		{
			z = 1;
		}

		y.splice(z, 0, decimal);

		if(y[0] == decimal)
		{
			y.unshift('0');
		}

		while(z > 3)
		{
			z -= 3;
			y.splice(z, 0, thousands);
		}
		
		return currencyBefore + negativeBefore + y.join('') + negativeAfter + currencyAfter;
	},
	
	number: function(inNumber, inFormatA, inFormatB)
	{
		if(isNaN(inNumber))
		{
			return inNumber;
		}
		
		var type = "number";
		var precision = "0";
		
		if(inFormatA)
		{
			type = inFormatA.format;
			precision = inFormatA.precision;
		}
		
		if(inFormatB)
		{
			if(!type)
			{
				type = inFormatB.format;
			}
			
			if(isNaN(precision))
			{
				precision = inFormatB.precision;
			}
		}
		
		if(isNaN(precision))
		{
			precision = 0;
		}

		if(type == "number")
		{
			return this.parts(inNumber, precision, ',', '.', '', '', '-', '');
		}
		else if(type == "currency")
		{
			return this.parts(inNumber, precision, ',', '.', '$', '', '(', ')');
		}
		else if(type == "percent")
		{
			return this.parts(inNumber * 100,  precision, ',', '.', '', '%', '-', '');
		}
		else if(type == "date")
		{
			var date = new Date(inNumber * 24 * 60 * 60 * 1000);

			if(precision == 1)
			{
				return this.weekdays[date.getDay()] + " " + date.getDate() + " " + this.months[date.getMonth()];
			}
			else if(precision == 2)
			{
				return date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear();
			}
			else if(precision == 3)
			{
				return this.weekdays[date.getDay()] + " " + date.getDate() + " " + this.months[date.getMonth()] + " " + date.getFullYear();
			}
	
			return date.getDate() + " " + this.months[date.getMonth()];
		}
		else
		{
			return "" + inNumber;
		}
	},
	
	months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

	weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
});

//--------------

if(!window.Color)
{
	window.Color = {};
}

Object.extend(window.Color, 
{
	lighter: function(inColor, inAdjustment)
	{
		return this.adjust(inColor, inAdjustment, true);
	},
	
	darker: function(inColor, inAdjustment)
	{
		return this.adjust(inColor, inAdjustment, false);
	},
	
	shade: function(inColor, inAdjustment)
	{
		var hsv = this.RGBtoHSV(this.RGB(inColor));
		
		return this.adjust(inColor, inAdjustment, hsv.value <= 0.85);
	},
	
	adjust: function(inColor, inAdjustment, isLighter)
	{
		var rgb = this.RGB(inColor);
		var hsv = this.RGBtoHSV(rgb);
		
		if(rgb.red == rgb.green && rgb.red == rgb.blue)
		{
			if(isLighter)
			{
				hsv.value += (1.0 - hsv.value) * inAdjustment;
			}
			else
			{
				hsv.value -= (hsv.value) * inAdjustment;
			}
		}
		else
		{
			if(isLighter)
			{
				hsv.saturation -= (hsv.saturation) * inAdjustment;
				hsv.value += (1.0 - hsv.value) * inAdjustment;
			}
			else
			{
				hsv.value -= (hsv.value) * inAdjustment;
				hsv.saturation += (1.0 - hsv.saturation) * inAdjustment;
			}

		}

		return this.color(this.HSVtoRGB(hsv));
	},
	
	color: function(inRGBA)
	{
		var color = "#";
		
		color += this.intToHex(inRGBA.red) + this.intToHex(inRGBA.green) + this.intToHex(inRGBA.blue);
		
		if(inRGBA.alpha)
		{
			color += this.intToHex(inRGBA.alpha);
		}
		
		return color;
	},
	
	RGB: function(inColor)
	{
		var parts = {red:0, green:0, blue:0};

		if(inColor.charAt(0) == '#')
		{
			inColor = inColor.substring(1);
		}

		if(inColor.length == 3)
		{
			inColor = "" + inColor.charAt(0) + inColor.charAt(0) + inColor.charAt(1) + inColor.charAt(1) + inColor.charAt(2) + inColor.charAt(2);
		}

		if(inColor.length < 6)
		{
			return parts;
		}

		parts.red += this.hexToInt(inColor.charAt(0)) << 4;
		parts.red += this.hexToInt(inColor.charAt(1));

		parts.green += this.hexToInt(inColor.charAt(2)) << 4;
		parts.green += this.hexToInt(inColor.charAt(3));

		parts.blue += this.hexToInt(inColor.charAt(4)) << 4;
		parts.blue += this.hexToInt(inColor.charAt(5));

		if(inColor.length == 8)
		{
			parts.alpha = 0;
			parts.alpha += this.hexToInt(inColor.charAt(6)) << 4;
			parts.alpha += this.hexToInt(inColor.charAt(7));
		}

		return parts;
	},
	
	RGBtoHSV: function(inRGBA)
	{
		var h = 0.0;
		var s = 0.0;
		var v = 0.0;

		var r = inRGBA.red / 255.0;
		var g = inRGBA.green / 255.0;
		var b = inRGBA.blue / 255.0;

		var max = Math.max(r, Math.max(g, b));
		var min = Math.min(r, Math.min(g, b));

		v = max;

		if(max != 0.0)
		{
			s = (max - min) / max;
		}

		if(s != 0.0)
		{
			var delta = max - min;

			if(r == max)
			{
				h = (g - b) / delta;
			}
			else if(g == max)
			{
				h = 2.0 + (b - r) / delta;
			}
			else if(b == max)
			{
				h = 4.0 + (r - g) / delta;
			}

			h *= 60.0;

			if(h < 0.0)
			{
				h += 360.0;
			}
		}

		return { hue:h, saturation:s, value:v };
	},
	
	HSVtoRGB: function(inHSV)
	{
		var r = 0;
		var g = 0;
		var b = 0;
		var h = inHSV.hue;
		var s = inHSV.saturation;
		var v = inHSV.value;

		if(s == 0.0)
		{
			r = v;
			g = v;
			b = v;
		}
		else
		{
			h /= 60.0;

			var i = Math.floor(h);
			var f = h - i;
			var p = v * (1.0 - s);
			var q = v * (1.0 - s * f);
			var t = v * (1.0 - s * (1.0 - f));

			switch(i)
			{
				case 0:
					r = v;
					g = t;
					b = p;
					break;
				case 1:
					r = q;
					g = v;
					b = p;
					break;
				case 2:
					r = p;
					g = v;
					b = t;
					break;
				case 3:
					r = p;
					g = q;
					b = v;
					break;
				case 4:
					r = t;
					g = p;
					b = v;
					break;
				default: // case 5:
					r = v;
					g = p;
					b = q;
					break;
			}
		}

		return { red: parseInt(r *= 255), green: parseInt(g *= 255), blue: parseInt(b *= 255) };
	},
	
	hexToInt: function(inChar)
	{
		var index = this.hexValues.indexOf(inChar.toLowerCase().charAt(0));
		
		if(index < 0)
		{
			index = 0;
		}
		
		return index;
	},
	
	intToHex: function(inValue)
	{
		return ("" + this.hexValues[parseInt(inValue / 16)] + this.hexValues[inValue % 16]);
	},
	
	hexValues: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ]
});

//----------------

function sendemail(inEmail, inSubject, inMessage)
{
	var url = "mailto:" + inEmail + "?subject=" + inSubject + "&body=" + inMessage;

	window.location.href = url;
}

function sendErrorReport(inURL)
{
	window.open(inURL, 'errorreport', 'height=340,width=480,toolbar=no,status=no,scrollbars=yes');
}

function updateErrorDetails()
{
	var sourceWindow = window.opener;
	
	if(sourceWindow)
	{
		var error = sourceWindow.$('error_details');

		if(error)
		{
			$('details').value = error.innerHTML;
		}
		
		var problem = sourceWindow.$('error_problem');
		
		if(problem)
		{
			$('problem').value = problem.innerHTML;
		}
	}
}

// ----------------
// Pickers

var pickerElementID;

var pickerChangeAction;

function openPicker(inURL, inElementID, inChangeAction)
{
	pickerElementID = inElementID;

	pickerChangeAction = inChangeAction;

	try
	{
		var	newWindow = window.open(inURL, 'picker', 'width=640,height=640,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no');

		newWindow.focus();
	}
	catch(e)
	{
		alert('You must enable pop-up windows to use this feature.');
	}
}

function getPickerElement()
{
	if(pickerElementID)
	{
		var element = document.getElementById(pickerElementID);

		if(element)
		{
			return element.value;
		}
	}

	return null;
}

function updatePickerElement(inValue, inHTML)
{
	if(pickerElementID)
	{
		var fireChange = false;

		var element = document.getElementById(pickerElementID);

		if(element)
		{
			element.value = inValue;
		}

		var elementHTML = document.getElementById(pickerElementID + "_html");
		
		if(elementHTML)
		{
			elementHTML.innerHTML = inHTML;
		}

		if(pickerChangeAction)
		{
			eval(pickerChangeAction);
		}
	}

	pickerElementID = null;
}


// -------------
// Cookies

function checkCookies()
{
	var cookietest = getCookie("cookietest");

	var cookies = false;

	if(cookietest)
	{
		cookies = cookietest == "ok";
	}

	var detector = document.getElementById("cookiedetector");

	if(!cookies)
	{
		detector.style.display = "";
	}
	else
	{
		detector.style.display = "none";
	}
}

function setCookie(name, value, expirydays, path)
{
	var expiry;

	if(!name || name == "")
		return;
		
	if(expirydays && expirydays > 0)
	{
		var	expiryDate = new Date();
		
		expiryDate.setTime(expiryDate.getTime() + (expirydays * 24 * 60 * 60 * 1000));
		
		expiry = expiryDate.toGMTString();
	}
	
	var cookieString = name + "=" + escape(value) +
					   ((!expiry) ? "" : ("; expires=" + expiry)) +
					   ((!path)   ? "" : ("; path=" + path));

	document.cookie = cookieString;
}

function getCookie(name)
{
	var arg = name + "=";
	var arglength = arg.length;
	var cookielength = document.cookie.length;
	var i = 0;
	
	while(i < cookielength)
	{
		var j = i + arglength;
		
		if(document.cookie.substring(i, j) == arg)
		{
			k = document.cookie.indexOf(";", j);
			
			if(k < 0)
			{
				k = cookielength;
			}
			
			return unescape(document.cookie.substring(j, k));
		}
			
		i = document.cookie.indexOf(" ", i) + 1;
		
		if(i == 0)
		{
			break;
		}
	}
	
	return "";
}

function checkCapsLock(e)
{
	var myKeyCode = 0;
	var myShiftKey = false;
	var myCapsLock = false;

	if(document.all) // Internet Explorer
	{
		e = window.event;
		myKeyCode = e.keyCode;
		myShiftKey = e.shiftKey;
	}
	else if(document.layers) // Netscape 4
	{
		myKeyCode = e.which;
		myShiftKey = (myKeyCode == 16) ? true : false;
	}
	else if(document.getElementById) // Netscape 6
	{
		myKeyCode = e.which;
		myShiftKey = e.shiftKey || ( e.modifiers && ( e.modifiers & 4 ) );
	}

	if((myKeyCode >= 65 && myKeyCode <= 90) && !myShiftKey)
	{
		myCapsLock = true;
	}
	else if((myKeyCode >= 97 && myKeyCode <= 122) && myShiftKey)
	{
		myCapsLock = true;
	}

	var detector = document.getElementById("capslockdetector");

	if(myCapsLock)
	{
		detector.style.display = "";
	}
	else
	{
		detector.style.display = "none";
	}
}

// -------------
// messages

function verify(msg)
{
	return confirm(msg);
}

function question(inMessage, inDefault, inObject)
{
	var value = prompt(inMessage, inDefault);
	
	if(value)
	{
		inObject.value = value;
		
		return true;
	}
	
	return false;
}

var alreadyVerified = false;

function verifyOnce(msg)
{
	if(!alreadyVerified)
	{
		alreadyVerified = verify(msg);
	}
	
	return alreadyVerified;
}

// -------------------
// ui

function toggleRadioCheckBoxes(current)
{
	var isChecked = current.checked;

	for(i=0 ; i < eval('current.form.' + current.name + '.length'); i++)
	{
		eval('current.form.' + current.name + '[' + i + ']').checked = false;
	}

	if(isChecked)
	{
		current.checked = true;
	}
}

function updateRadioButtons(inName, inID, inTotal)
{
	for(var i = 1; i <= inTotal; i++)
	{
		var element = document.getElementById("other" + inName + i);
		
		if(element)
		{
			if(i == inID)
			{
				element.style.display = "";
			}
			else
			{
				element.style.display = "none";
			}
		}
	}
}

var inlineFrames = new Array();

function registerFrame(inName)
{
	inlineFrames[inlineFrames.length] = inName;
	
	resizeFrame(inName);
}

function resizeFrame(inName)
{
	var frame = document.getElementById("frameid_" + inName);
	
	if(frame)
	{
		var source = window.frames["framename_" + inName].document;
		
		if(source)
		{
			var offset = 0;
			
			if(document.getElementById && !document.all)
			{
				offset=20;
			}
			
			if (navigator.appName.indexOf("Microsoft")!=-1)
			{
				frame.height = source.body.scrollHeight;
			}
			else
			{
				frame.height = source.body.offsetHeight + offset;
			}
		}
	}
}

function resizeFrames()
{
	for(i = 0; i < inlineFrames.length; i++)
	{
		resizeFrame(inlineFrames[i]);
	}
}

function maxLength(inEvent, inElement, inLength)
{
	if(Prototype.Browser.IE)
	{
		;
	}
	else
	{
		if(inElement.selectionStart != inElement.selectionEnd)
		{
			return true;
		}
		else if(inEvent.which == 0 || inEvent.which == inEvent.DOM_VK_BACK_SPACE)
		{
			return true;
		}
	}
	
	if(inElement.value.length >= inLength)
	{
		inElement.value = inElement.value.substring(0, inLength);
		
		return false;
	}
	
	return true;
}

function trimLength(element, length)
{
	if(element.value.length >= length)
	{
		element.value = element.value.substring(0, length);
	}
}

// --------
// Messages

function Message(inName, inMessage)
{
	this.name = inName;
	this.message = inMessage;
}

var messages = new Array();

function addMessage(inName, inMessage)
{
	messages[messages.length] = new Message(inName, inMessage);
}

function getMessage(inName)
{
	for(i = 0; i < messages.length; i++)
	{
		if(messages[i].name == inName)
		{
			return messages[i].message;
		}
	}
}

function fixIE()
{
	if(Prototype.Browser.IE)
	{
		var cells = $(document.body).select('td');
		
		for(var i = 0; i < cells.length; i++)
		{
			var minWidth = cells[i].getStyle("min-width");
			
			var whiteSpace = cells[i].getStyle("white-space");

			if(minWidth && minWidth != "auto")
			{
				cells[i].insert({bottom: "<div style='width:" + parseInt(minWidth) + "px; margin:0px !important; padding:0px !important; border:0px !important; line-height:0px !important; height:0px !important;'>&nbsp;</div>"});
			}
			
			if(whiteSpace && whiteSpace == "nowrap")
			{
				cells[i].setAttribute("nowrap", "nowrap");
			}
		}
	}
}

/*
 *  This is an ugly, nasty, overly-specific hack for fixing screens with MenuTabs in Webkit.  It is a temporary solution until we
 *  can find a real solution to the problem. 
 */
function fixWebkit()
{
	if($('tabbar') != null)
	{
		var el = $('content');
		var r = el.style.right;
		
		el.style.right = '1px';
		
		(function(){el.style.right =  r}).defer();
	}
}

/*
 * Extend Prototype with OS detection: 
 * 		if (Prototype.OS.Windows) { // windows hacks; } 
 */
Object.extend(Prototype,
{
	OS :(function()
		{
			return {
				Windows:      navigator.userAgent.indexOf('Windows') > -1,
				Mac:          navigator.userAgent.indexOf('Mac') > -1,
				Linux:        navigator.userAgent.indexOf('Linux') > -1,
				UNIX:         navigator.userAgent.indexOf('X11') > -1
			}
		}
	)()
});

/*
 * Extend Prototype with IE versions: 
 * 		if (Prototype.Browser.IE6) { // ie6 mods; } 
 */
Object.extend(Prototype.Browser, {
	IE6: (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) ? (Number(RegExp.$1) == 6 ? true : false) : false,
	IE7: (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) ? (Number(RegExp.$1) == 7 ? true : false) : false,
	IE8: (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) ? (Number(RegExp.$1) == 8 ? true : false) : false,
	IE9: (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) ? (Number(RegExp.$1) == 9 ? true : false) : false
});

/*
 * Method similar to Prototypes Element.update, but does not scrape and execute scripts from contentElement.
 */
Element.Methods.simpleUpdate = function(element, contentElement)
{
	if (typeof contentElement == "string")
	{
		element.innerHTML = contentElement;
	}
	else
	{
		element.innerHTML='';
		element.appendChild(contentElement);
	}

	return element;
}

Element.addMethods();

