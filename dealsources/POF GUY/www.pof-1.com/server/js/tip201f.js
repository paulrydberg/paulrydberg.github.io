Event.observe(window, "load", function()
{
	window.TipManager.initialize();
});

// --------

window.TipManager =
{
	initialize: function()
	{
		var tips = $$('*[tip]');

		for(var i = 0; i < tips.length; i++)
		{
			var value = tips[i].getAttribute("tip");

			var options = {};
			
			if(value.isJSON())
			{
				options = value.evalJSON();
			}
			
			if(!options.content)
			{
				options = {content: value};
			}
			
			new Tip(tips[i], options);
		}
	
		this.tipElement = document.body.insert({bottom: this.buildTip()}).childElements().last();
	
		this.arrowElement = this.tipElement.down('.tiparrow', 0);
	
		this.contentElement = this.tipElement.down('.tipcontent', 0);
		
		document.observe('mousedown', this.mouseDown.bindAsEventListener(this));
		
		document.observe('mousemove', this.mouseMove.bindAsEventListener(this));
		
		document.observe('behavior:resize', this.hide.bindAsEventListener(this));
	
		this.initialized = true;
	},
	
	startShow: function(inTip)
	{
		if(inTip == null || inTip == this.tip)
		{
			return;
		}

		if(this.showing != null)
		{
			window.clearTimeout(this.showing);
			
			this.showing = null;
		}

		this.showing = window.setTimeout(this.show.bind(this, inTip), inTip.options.delay);	
	},

	show:function(inTip)
	{
		if(inTip == null)
		{
			return;
		}
		
		if(this.tip && this.tip.options.showWhen == 'in' && this.tipBounds != null && this.tipBounds.contains(this.mouseX, this.mouseY))
		{
			return; 
		}
		
		if(this.showing)
		{
			window.clearTimeout(this.showing);
			
			this.showing = null;
		}

		if(this.tip != null && inTip != this.tip)
		{
			this.hide();
		}

		// -----------

		var content = inTip.options.content || "";
		
		if(content.startsWith("url:"))
		{
			var parameters = new Hash();
			
			var form = inTip.element.up('form');
		
			if(form)
			{
				parameters = form.serialize(true);
			}
			
			new Ajax.Request(content.substring(4),
			{
				parameters: parameters,
				
				onComplete: function(response)
				{
					if(response.status == 200)
					{
						this.tip = inTip;
						
						this.update(response.responseText);
					}
				}.bind(this)
			});

			return;
		}
		else if(content.startsWith("help:"))
		{
			var id = content.substring(5);
			
			if(id.length == 0)
			{
				id = inTip.element.innerText;
			}
			
			inTip.options.more = "javascript:Help.open()";

			content = Help.getTip(id);
		}
		else if(content == "*")
		{
			content = inTip.element.innerText;
		}

		this.tip = inTip;
		
		this.update(content);
	},
	
	hide: function()
	{
		if(this.tip && this.tip.options.hideWhen == 'out' && this.tipBounds != null && this.tipBounds.contains(this.mouseX, this.mouseY))
		{
			return;
		}
		
		this.tipElement.setStyle({display:"none"});

		this.tip = null;
		
		this.tipBounds = null;
	},
	
	update: function(inContent)
	{
		if(this.tip == null)
		{
			return;
		}
		
		if(this.tip.options.more && this.tip.options.more.length > 0)
		{
			var padding = "";
			
			if(inContent.length > 0)
			{
				inContent += "<br>";
				padding = " padding-top:5px;";
			}
			
			inContent += "<div style='text-align:right;" + padding + "'><a style='color:#88a9d2' href='" + this.tip.options.more + "' target='_blank'>More &#9658;</a></div>";
		}
		
		this.contentElement.update(inContent);
		
		this.render();
	},

	render: function()
	{
		var offset = 0;
		
		this.elementBounds = new Bounds(this.tip.element);
		
		if(this.tip.options.showWhen == 'in')
		{
			if(!this.elementBounds.contains(this.mouseX, this.mouseY))
			{
				this.hide();
				
				return;
			}
			
			offset = this.mouseX - this.elementBounds.getPosition("center", 0, 0).x;
		}
		
		this.tipElement.setStyle({ visibility:"hidden", display:"block", minWidth:this.tip.options.minWidth + "px", maxWidth:this.tip.options.maxWidth + "px" });
	
		var arrowPosition = "down";
		
		var yOffset = this.tip.options.arrowSize -2;
	
		var viewportBounds = new Bounds(document).shrink(5);
		
		this.tipBounds = new Bounds(this.tipElement);

		this.tipBounds.moveRelative("bottom", this.elementBounds, "top", 0, -yOffset);

		var adjustment = this.tipBounds.moveWithin(viewportBounds);
	
		if(adjustment.y > 0)
		{
			var arrowPosition	= "up";
			
			this.tipBounds.moveRelative("top", this.elementBounds, "bottom", 0, yOffset);
		}

		this.tipBounds.moveBy(offset, 0);
		
		this.tipBounds.moveWithin(viewportBounds);
		
		this.tipBounds.syncElement(this.tipElement, "top left");

		// --------------
		
		var arrowBounds = new Bounds(this.arrowElement);
			
		if(arrowPosition == "down")
		{
			this.arrowElement.setStyle({backgroundPosition:"0px 100%"});
		
			arrowBounds.setHeight(this.tip.options.arrowSize + 1);
	
			arrowBounds.moveRelative("bottom", this.elementBounds, "top", 0, -1);
			
			arrowBounds.moveBy(offset, 0);
			
			var extentBounds = new Bounds(this.tipBounds.bottom - 1, this.tipBounds.right - 5, this.tipBounds.bottom + this.arrowElement.getHeight() - 1, this.tipBounds.left + 5);
			
			arrowBounds.moveWithin(extentBounds);
			
			this.tipBounds.bottom = this.elementBounds.bottom;
		}
		else
		{
			this.arrowElement.setStyle({backgroundPosition:"0px 0%"});
			
			arrowBounds.setHeight(this.tip.options.arrowSize + 1);
		
			arrowBounds.moveRelative("top", this.elementBounds, "bottom", 0, 1);
			
			arrowBounds.moveBy(offset, 0);
			
			var extentBounds = new Bounds(this.tipBounds.top - this.arrowElement.getHeight() + 1, this.tipBounds.right - 5, this.tipBounds.top + 1, this.tipBounds.left + 5);
			
			arrowBounds.moveWithin(extentBounds);
			
			this.tipBounds.top = this.elementBounds.top;
		}
					
		arrowBounds.syncElement();
		
		// -------------
		
		var interactive = false;
		var descendants = this.contentElement.descendants();
		
		for(var i = 0; i < descendants.length; i++)
		{
			if(descendants[i].tagName == "A")
			{
				interactive = true;
				break;
			}
		}
		
		if(!interactive)
		{
			this.tipBounds = null;
		}

		// -------------

		this.tipElement.setStyle({visibility:"visible"});
	},
	
	mouseMove: function(inEvent)
	{
		this.mouseX = inEvent.pointerX();
		this.mouseY = inEvent.pointerY();

		if(this.tip && this.tipBounds && this.tip.options.hideWhen == 'out')
		{
			var x = inEvent.pointerX();
			var y = inEvent.pointerY();
			
			if(!this.tipBounds.contains(x, y))
			{
				this.hide();
			}
		}
	},
	
	mouseDown: function(inEvent)
	{
		if(this.tip == null)
		{
			return;
		}
		
		var elementClicked = inEvent.element();

		if(elementClicked == this.tipElement || elementClicked.descendantOf(this.tipElement))
		{
			return;
		}

		if(this.tip.options.hideWhen == 'out')
		{
			this.hide();
		}
		else if(elementClicked != this.tip.element && !elementClicked.descendantOf(this.tip.Element))
		{
			this.hide();
		}
	},
	
	isShowing: function(inTip)
	{
		return inTip == this.tip;
	},
	
	buildTip: function()
	{
		var template = "";
		
 		template += "<div class='tip'>";
 		template += "<div class='tiparrow'></div>";
 		template += "<div class='tipcontent'></div>";
 		template += "</div>";
		
		return template;
	}
};

// -------------------

var Tip = Class.create(
{
	initialize: function(element, options)
	{
		this.element = $(element);
		
		if(!this.element)
		{
			return;
		}
		 
		this.options = {
			delay:		1200,
			maxWidth:	200,
			minWidth:	25,
			showWhen:	'in',
			hideWhen:	'out',
			decay:		100,
			content:	null,
			arrowSize:	6
		};
		
		Object.extend(this.options, options || { });
		
		this.element.setTip = this.setTip.bind(this);
		this.element.addClassName("hastip");
		
		// --------
		
		if(this.options.showWhen == 'click')
		{
			this.element.observe('click', this.show.bindAsEventListener(this));
		}
		else if(this.options.showWhen == 'focus')
		{
			this.element.observe('click', this.show.bindAsEventListener(this));
			this.element.observe('focus', this.show.bindAsEventListener(this));
			this.element.observe('keyup', this.keyup.bindAsEventListener(this));
		}
		else
		{
			this.element.observe('mouseover', this.mouseOver.bindAsEventListener(this));
			this.element.observe('mouseout', this.hide.bindAsEventListener(this));
		}
		
		if(this.options.hideWhen == 'blur')
		{
			this.element.observe('blur', this.hide.bindAsEventListener(this));
		}
	},
	
	setTip: function(inValue, shouldShow)
	{
		this.options.content = inValue;	

		if(TipManager.isShowing(this) || shouldShow)
		{
			this.show(this);
		}
	},
	
	mouseOver: function(event)
	{
		TipManager.startShow(this);	
	},
	
	keyup: function(event)
	{
		if(event.keyCode != Event.KEY_RETURN && event.keyCode != Event.KEY_TAB)
		{
			this.show(this);
		}
	},
	
	show: function(event)
	{
		TipManager.show(this);
	},
	
	hide: function()
	{
		TipManager.hide(this);
	}
});

window.Help =
{
	initialize: function(inOptions)
	{
		this.options = {};
		
		Object.extend(this.options, inOptions || {});
	},
	
	open: function(inSlug)
	{
		var slug = this.options.source;
		
		if(inSlug)
		{
			slug = inSlug;
		}
		
		var match = slug.match(/([a-zA-Z]+_[a-zA-Z]+)_.*/);
		
		if(match)
		{
			slug = match[1];
		}
		
		var params = $H({lang: this.options.lang, slug: slug});
		
		var url = this.options.server + "/" + this.options.application + "/pages" + "?" + params.toQueryString() + "#" + slug;
		
		window.open(url, "help", "tooolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=1,width=800,height=600");
	},
	
	search: function(inTerms)
	{
		var params = $H({lang: this.options.lang, terms: inTerms});
		
		var url = this.options.server + "/" + this.options.application + "/pages" + "?" + params.toQueryString();
		
		window.open(url, "help", "tooolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=1,width=800,height=600");
	},
	
	getTip: function(inID)
	{
		this.id = inID;
		
		if(this.tips == null)
		{
			this.loadTips();
			
			return "Loading...";
		}
		else
		{
			var tip = this.tips[inID];
			
			if(!tip || tip.length == 0)
			{
				return "";
			}
			
			return tip;
		}
	},
	
	loadTips: function()
	{
		var slug = this.options.source;
		var match = this.options.source.match(/([a-zA-Z]+_[a-zA-Z]+)_.*/);
		if(match) slug = match[1];
		var url = this.options.path + "/" + this.options.application + "/" + slug;

		new Ajax.Request(url,
		{
			method: 'get',
			onComplete: function(response)
			{
				if(response.status == 200)
				{
					this.tips = response.responseText.evalJSON();
					
					TipManager.update(this.tips[this.id]);
				}
				else
				{
					TipManager.update(response.responseText);
				}
			}.bind(this)
		});
	}
};
