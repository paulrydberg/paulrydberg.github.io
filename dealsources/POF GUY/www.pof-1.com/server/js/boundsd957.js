var Popout = Class.create(
{	
	initialize: function(inElement, inOptions)
	{
		this.element = $(inElement);
		
		if(!this.element)
		{
			return;
		}
		
		this.options = {
			handle: null,
			toggle: true,
			showWhen: 'click',
			showDelay: 1000,
			hideWhen: null,
			activeClass: 'active',
			onActivate: null, // if onActivate returns true, showing will be delayed (i.e. Ajax request)
			onShow: null,
			onHide: null,
			fireChange: true
		};
		
		Object.extend(this.options, inOptions || {});
		
		this.overCount = 0;
		this.instance = 1;
		this.handle = $(this.options.handle);

		if(this.handle)
		{
			this.options.boundary = this.handle.ownerDocument;
			
			if(this.options.showWhen.indexOf('over') >= 0 || (this.options.hideWhen && this.options.hideWhen.indexOf('out') >= 0))
			{
				this.handle.on("mouseover", this.mouseover.bindAsEventListener(this));
				this.handle.on("mouseout", this.mouseout.bindAsEventListener(this));
				
				if(!this.options.hideWhen)
				{
					this.options.hideWhen = "click,blur,out";
				}
			}
			
			if(this.options.showWhen.indexOf('click') >= 0)
			{
				this.handle.on("mousedown", this.mousedown.bindAsEventListener(this));
				
				if(!this.options.hideWhen)
				{
					this.options.hideWhen = "click,blur";
				}
			}
			
			if(this.options.showWhen.indexOf('focus') >= 0)
			{
				if(this.handle.match("input,textarea"))
				{
					this.handle.on("focus", this.focus.bindAsEventListener(this));
				}

				var inputs = this.handle.select("input,textarea") || [];
				
				for(var i = 0; i < inputs.length; i++)
				{
					inputs[i].on("focus", this.focus.bindAsEventListener(this));
				}
				
				if(!this.options.hideWhen)
				{
					this.options.hideWhen = "click,blur";
				}
				
				this.options.toggle = false;
			}
			
			if(this.options.hideWhen.indexOf("blur") >= 0)
			{
				if(this.handle.match("input,textarea"))
				{
					this.handle.on("blur", this.blur.bindAsEventListener(this));
				}

				var inputs = this.element.select("input,textarea").concat(this.handle.select("input,textarea") || []);
				
				for(var i = 0; i < inputs.length; i++)
				{
					inputs[i].on("blur", this.blur.bindAsEventListener(this));
				}
			}
		}
		
		document.observe("behavior:resize", this.hide.bindAsEventListener(this));
		
		this.element.setStyle({display:"none"});
		this.element.show = this.show.bind(this);
		this.element.hide = this.hide.bind(this);
		
		this.document = this.element.ownerDocument;
	},
	
	mousedown: function(inEvent)
	{
		if(this.active)
		{
			var element = inEvent.element();

			if(element != this.element && !element.descendantOf(this.element))
			{
				if(this.options.hideWhen.indexOf("click") >= 0)
				{
					if(this.options.toggle || (element != this.handle && !element.descendantOf(this.handle)))
					{
						Event.stop(inEvent);
						
						this.hide();
		
						return;
					}
				}
			}
		
			if(!element.match("input,textarea"))
			{
				Event.stop(inEvent);
			}
		}
		else
		{
			//  doing the right click check here rather than at the top of this function allows
			//  right clicks to hide the popout if its active.
			if(this.options.showWhen.indexOf("click") >= 0 && (inEvent.button != 2 && !inEvent.ctrlKey))
			{
				this.activate.bind(this).defer();
			}
		}
	},
	
	mouseover: function(inEvent)
	{
		if(this.overCount == 0)
		{
			if(this.options.showWhen.indexOf("over") >= 0)
			{
				this.activateFunction = this.activate.bind(this).delay(this.options.showDelay / 1000);
			}
		}
		
		this.overCount++;
	},
	
	mouseout: function(inEvent)
	{
		this.overCount--;
		
		if(this.overCount <= 0)
		{
			this.overCount = 0;
			
			window.clearTimeout(this.activateFunction);

			if(this.options.hideWhen.indexOf("out") >= 0)
			{
				this.hide();
			}
		}
	},
	
	focus: function(inEvent)
	{
		if(this.options.showWhen.indexOf("focus") >= 0)
		{
			this.activate.bind(this).defer();
		}
	},
	
	blur: function(inEvent)
	{
		if(this.options.hideWhen.indexOf("blur") >= 0)
		{		
			this.checkFocus.bind(this).defer();
		}
	},
	
	checkFocus: function()
	{
		if(this.document.activeElement == this.handle || this.document.activeElement.descendantOf(this.element) || this.document.activeElement.descendantOf(this.handle))
		{
			return;
		}

		this.hide();
	},
	
	activate: function()
	{
		if(this.options.onActivate && !this.options.onActivate(this))
		{
			return;
		}
		
		this.show(this.instance);
	},
	
	show: function(inInstance)
	{
		if(!this.active && this.instance == inInstance)
		{
			this.active = true;
			
			this.element.setStyle({visibility:"hidden"});
			
			Position.panel(this.element, this.options);
			
			this.element.setStyle({visibility:"visible"});
			
			this.mousedownFunction = this.element.up("body").on("mousedown", this.mousedown.bindAsEventListener(this));
			
			var inputs = this.element.select("input,textarea");
			
			for(var i = 0; i < inputs.length; i++)
			{
				if(i == 0)
				{
					inputs[i].activate();
				}
				
				inputs[i].originalValue = inputs[i].value;
			}
	
			if(this.handle)
			{
				this.handle.addClassName(this.options.activeClass);
			}

			if(this.options.onShow)
			{
				this.options.onShow(this.handle);
			}
		}
	},
	
	hide: function()
	{
		if (!this.active)
			return;
		
		var inputs = this.element.select("input,textarea");
		
		for(var i = 0; i < inputs.length; i++)
		{
			if(inputs[i].originalValue != inputs[i].value)
			{
				if (this.options.fireChange)
				{
					Client.fire(inputs[i], "change");
				}
			}
		}
		
		this.instance++;
		
		this.element.setStyle({display:"none"});
		
		if(this.handle)
		{
			this.handle.removeClassName(this.options.activeClass);
		}
		
		if(this.mousedownFunction)
		{
			this.mousedownFunction.stop();
		}
		
		if(this.active)
		{
			if(this.options.onHide)
			{
				this.options.onHide(this.handle);
			}
			
			this.active = false;
		}
	}
});

var Bounds = Class.create(
{
	initialize: function()
	{
		if(arguments.length == 4)
		{	
			this.top = arguments[0];
			this.right = arguments[1];
			this.bottom = arguments[2];
			this.left = arguments[3];
		}
		else if(arguments.length == 1)
		{
			this.element = $(arguments[0]);
			
			this.update(true);
		}
	},

	clone: function()
	{
		return new Bounds(this.top, this.right, this.bottom, this.left);
	},

	update: function(inReset)
    {
		if(!this.element) return;

		if(this.element.viewport)
		{
			var offset = this.element.viewport.getScrollOffsets();
			var sizing = document.body.insert({top: "<div style='position:fixed; width:100%; height:100%'></div>"}).down();
		
			this.top        = offset.top;
			this.bottom     = offset.top + sizing.getHeight();
			this.left       = offset.left;
			this.right      = offset.left + sizing.getWidth();
			
			sizing.remove();
		}
		else if(this.element.cumulativeOffset)
		{
			if(inReset)
			{
				this.initialized = false;
				this.fixed = false;
				this.borderLeft = 0;
				this.borderTop = 0;
				this.ancestors = this.element.ancestors();
			}

			var offset      = this.element.cumulativeOffset();
			var position    = this.element.style.position || '';

			if(position != "fixed")
			{
				for(var i = 0; i < this.ancestors.length; i++)
				{
					if(this.ancestors[i] == this.element.ownerDocument.body)
					{
						break;
					}
					
					offset.left -= this.ancestors[i].scrollLeft || 0;
					offset.top  -= this.ancestors[i].scrollTop  || 0;

					if(!this.initialized)
					{
						position = this.ancestors[i].style.position || '';

						if(position != "static")
						{
							this.borderLeft += this.ancestors[i].measure("border-left");
							this.borderTop  += this.ancestors[i].measure("border-top");
						}

						if(position == "fixed")
						{
							this.fixed = true;
							
							break;
						}
					}
				}
			}

			if(position == "fixed")
			{
				var viewportOffset = this.element.ownerDocument.viewport.getScrollOffsets();

				offset.left += viewportOffset.left;
				offset.top  += viewportOffset.top;
				
				this.fixed = true;
			}

			this.top        = offset.top + this.borderTop;
			this.bottom     = this.top + this.element.measure("border-box-height");
			this.left       = offset.left + this.borderLeft;
			this.right      = this.left + this.element.measure("border-box-width");

			this.initialized = true;
		}
    },

	syncElement: function(inElement, inPositions)
	{
		var element = $(inElement) || this.element;

		if(!element)
		{
			return;
		}

		var left		= this.left;
		var top			= this.top;
		var width		= this.getWidth()  - (element.measure("border-box-width")  - element.measure("width")) ;
		var height		= this.getHeight() - (element.measure("border-box-height") - element.measure("height"));
		var position	= element.getStyle("position");
	
		if(position == "fixed")
		{
			var viewportOffset = element.ownerDocument.viewport.getScrollOffsets();

			left -= viewportOffset.left;
			top  -= viewportOffset.top;
		}
		else
		{
			if(position != "absolute")
			{
				element.setStyle({position: "relative"});
			}
			
			element.setStyle({left:"0px", top:"0px"});
			
			var elementBounds = new Bounds(element);
			
			left -= elementBounds.left;
			top -= elementBounds.top;
		}
		
		// -------
		
		var styles = {};
		
		if(!inPositions || inPositions.length == 0)
		{
			styles.left = left + "px";
			styles.top = top + "px";
			styles.width = width + "px";
			styles.height = height + "px";
		}
		else
		{
			if(inPositions.indexOf("left") >= 0)
			{
				styles.left = left + "px";
			}
			
			if(inPositions.indexOf("top") >= 0)
			{
				styles.top = top + "px";
			}
			
			if(inPositions.indexOf("width") >= 0)
			{
				styles.width = width + "px";
			}
			
			if(inPositions.indexOf("height") >= 0)
			{
				styles.bottom = height + "px";
			}
		}
		
		element.setStyle(styles);
	},

	getWidth: function()
	{
		return this.right - this.left;
	},

	setWidth: function(inWidth)
	{
		if(inWidth)
		{
			this.right = this.left + inWidth;
		}
	},

	getHeight: function()
	{
		return this.bottom - this.top;
	},

	setHeight: function(inHeight)
	{
		if(inHeight)
		{
			this.bottom = this.top + inHeight;
		}
	},

	moveBy: function(inDeltaX, inDeltaY)
	{
		this.top += inDeltaY;
		this.bottom += inDeltaY;
		this.left += inDeltaX;
		this.right += inDeltaX;

		return this;
	},

	moveTo: function(inX, inY)
	{
		var x = inX - this.left;
		var y = inY - this.top;

		this.moveBy(x, y);

		return {x: x, y: y};
	},

	moveWithin: function(inBounds)
	{
		var x = 0;
		var y = 0;

		if(this.left < inBounds.left)
		{
			x = inBounds.left - this.left;
		}
		else if(this.right > inBounds.right)
		{
			x = inBounds.right - this.right;
		}

		if(this.top < inBounds.top)
		{
			y = inBounds.top - this.top;
		}
		else if(this.bottom > inBounds.bottom)
		{
			y = inBounds.bottom - this.bottom;
		}

		this.moveBy(x, y);

		return {x: x, y: y};
	},

	moveRelative: function(inLocation, inRelativeBounds, inRelativeLocation, inOffsetX, inOffsetY)
	{
		var position = this.getPosition(inLocation);

		var relataivePosition = inRelativeBounds.getPosition(inRelativeLocation, inOffsetX, inOffsetY);
		
		var x = relataivePosition.x - position.x;
		var y = relataivePosition.y - position.y;

		this.moveBy(x, y);

		return {x: x, y: y};
	},

	moveCentered: function(inOuterBounds, inOffsetX, inOffsetY)
	{
		var offsetX = .5;
		var offsetY = .5;

		if(inOffsetX != undefined)
		{
			offsetX = inOffsetX;
			offsetY = inOffsetX;
		}

		if(inOffsetY != undefined)
		{
			offsetY = inOffsetY;
		}

		var left = inOuterBounds.left + (inOuterBounds.getWidth() - this.getWidth()) * offsetX;
		var top = inOuterBounds.top + (inOuterBounds.getHeight() - this.getHeight()) * offsetY;

		return this.moveTo(left, top);
	},

	clip: function(inBounds)
	{
		if(this.top < inBounds.top) this.top = inBounds.top;
		if(this.bottom > inBounds.bottom) this.bottom = inBounds.bottom;
		if(this.left < inBounds. left) this. left = inBounds. left;
		if(this.right > inBounds.right) this. right = inBounds. right;
	},

	contains: function(inX, inY)
	{
		return(inX >= this.left && inX <= this.right && inY >= this.top && inY <= this.bottom);
	},

	overlaps: function(inBounds)
	{
		if(this.contains(inBounds.left, inBounds.top)) return true;
		if(inBounds.contains(this.left, this.top)) return true;

		if(this.contains(inBounds.right, inBounds.top)) return true;
		if(inBounds.contains(this.right, this.top)) return true;

		if(this.contains(inBounds.left, inBounds.bottom)) return true;
		if(inBounds.contains(this.left, this.bottom)) return true;

		if(this.contains(inBounds.right, inBounds.bottom)) return true;
		if(inBounds.contains(this.right, this.bottom)) return true;

		return false;
	},

	getMiddle: function()
	{
		return { x: (this.left + this.right) / 2, y: (this.top + this.bottom) / 2 };
	},

	getPosition: function(inLocation, inOffsetX, inOffsetY)
	{
		var position = this.getMiddle();

		if(inLocation.indexOf("top") >= 0) position.y = this.top;
		else if(inLocation.indexOf("bottom") >= 0) position.y = this.bottom;

		if(inLocation.indexOf("left") >= 0) position.x = this.left;
		else if(inLocation.indexOf("right") >= 0) position.x = this.right;

		if(inOffsetX != undefined)
		{
			position.x += inOffsetX;
		}

		if(inOffsetY != undefined)
		{
			position.y += inOffsetY;
		}

		return position;
	},

	expand: function(inOffsetX, inOffsetY)
	{
		var offsetX = 0;
		var offsetY = 0;

		if(inOffsetX)
		{
			offsetX = inOffsetX;
			offsetY = inOffsetX;
		}

		if(!isNaN(inOffsetY))
		{
			offsetY = inOffsetY;
		}

		this.left -= offsetX;
		this.right += offsetX;

		this.top -= offsetY;
		this.bottom += offsetY;

		return this;
	},

	shrink: function(inOffsetX, inOffsetY)
	{
		return this.expand(-inOffsetX, -inOffsetY);
	},

	show: function()
	{
		if(!this.showElement)
		{
			this.showElement = new Element("div").setStyle({position:"absolute", backgroundColor:"yellow", opacity:0.25, zIndex:10000});
		
			document.body.insert({bottom: this.showElement});
		}

		this.showElement.setStyle({left: this.left + "px", top: this.top + "px", width: this.getWidth() + "px", height: this.getHeight() + "px" });
	}
});


var Synchronize = Class.create(
{
	initialize: function(inElement, inOptions)
	{
		this.element = $(inElement);
		
		if(!this.element)
		{
			return;
		}
		
		this.options = {
			to: null,
			positions: null
		};
	
		Object.extend(this.options, inOptions);
		
		this.to = $(this.options.to);
		
		if(!this.to)
		{
			return;
		}

		// -------

		document.observe('behavior:resize', this.update.bindAsEventListener(this));
		
		this.update();
	},
	
	update: function()
	{
		if(this.to.getStyle("display") == "none")
		{
			return;
		}
		
		var ancestors = this.to.ancestors();
		
		for(var i = 0; i < ancestors.length; i++)
		{
			if(ancestors[i].getStyle("display") == "none")
			{
				return;
			}
		}
		
		if(!this.toBounds)
		{
			this.toBounds = new Bounds(this.to);
		}
		else
		{
			this.toBounds.update();
		}

		this.toBounds.syncElement(this.element, this.options.positions);
	}
});

var Scroller = Class.create(
{
	initialize: function(inElement, inPosition, inOptions)
	{
		this.element = $(inElement);
		
		if(!this.element)
		{
			return;
		}
		
		this.position = Math.round(inPosition);
		
		this.options = {
			orientation: 'vertical',
			duration:500
		};
	
		Object.extend(this.options, inOptions);
		
		var increments = this.options.duration / 50;
		
		this.current = this.options.orientation == 'horizontal' ? inElement.scrollLeft : inElement.scrollTop;

		this.increment = (this.position - this.current) / increments;
	
		this.interval = setInterval(this.update.bind(this), 50);
	},
	
	update: function()
	{
		this.current += this.increment;

		if(this.options.orientation == 'horizontal')
		{
			this.element.scrollLeft = this.current;
		}
		else
		{
			this.element.scrollTop = this.current;
		}

		if(Math.round(this.current) == this.position)
		{
			clearInterval(this.interval);
			
			return;
		}
	}
});

function ScrollIntoView(inElement)
{
	var element = $(inElement);

	if(!element)
	{
		return;
	}

	var bounds = new Bounds(inElement);

	var ancestors = element.ancestors();

	for(var i = 0; i < ancestors.length; i++)
	{
		var height = ancestors[i].measure("height");

		if(ancestors[i].scrollHeight > height)
		{
			var ancestorBounds = new Bounds(ancestors[i] == document.body ? document.viewport : ancestors[i]);

			if(bounds.bottom > ancestorBounds.bottom || bounds.top < ancestorBounds.top)
			{
				var position = ancestors[i].scrollTop + (bounds.top - ancestorBounds.top) - (ancestorBounds.getHeight() - bounds.getHeight()) / 2;

				new Scroller(ancestors[i], position);
			}
			
			bounds = ancestorBounds;
		}
	}
};

var Position =
{
	panel:function(inElement, inOptions)
	{
		var element = $(inElement);
		
		if(!element)
		{
			return;
		}
		
		var options = {
			handle: null,
			xConstrain: null,
			yConstrain: null,
			direction: "top",
			align: "center",
			padding: 2,
			xOffset: 0,
			yOffset: 0,
			arrowSize: 0,
			arrowMargin: 5,
			arrowRatio: 0.8,
			boundary: document
		};
		
		Object.extend(options, inOptions || {});
		
		// ------------
		
		if(options.arrowRatio > 1)
		{
			options.arrowRatio = 1;
		}
		
		element.setStyle({display:"inline-block", position:"absolute", width:null, height:null});
		
		var handle = $(options.handle);
		var flipped = false;
		var elementBounds = new Bounds(element);
		var handleBounds = new Bounds(handle);
		var viewportBounds = new Bounds(options.boundary);
		
		if(options.xConstrain)
		{
			handleBounds.left = options.xConstrain - 1;
			handleBounds.right = options.xConstrain + 1;
		}
		
		if(options.yConstrain)
		{
			handleBounds.top = options.yConstrain - 1;
			handleBounds.bottom = options.yConstrain + 1;
		}
		
		if(Position.orientation(options.direction) == "horizontal" && elementBounds.getHeight() < (options.arrowMargin + options.arrowSize) * 2 + 4)
		{
			options.arrowSize = ((elementBounds.getHeight() - 4) / 2 - options.arrowMargin);
		}
		
		if(Position.orientation(options.direction) == "vertical" && elementBounds.getWidth() < (options.arrowMargin + options.arrowSize) * 2 + 4)
		{
			options.arrowSize = ((elementBounds.getWidth() - 4) / 2 - options.arrowMargin);
		}

		viewportBounds.shrink(5);
		
		elementBounds.moveRelative(Position.opposite(options.direction) + " " + options.align, handleBounds, options.direction + " " + options.align, Position.xAdjustment(options), Position.yAdjustment(options));

		var adjustment = elementBounds.moveWithin(viewportBounds);
		
		if(Position.flip(options.direction, adjustment))
		{
			options.direction = Position.opposite(options.direction);

			elementBounds.moveRelative(Position.opposite(options.direction) + " " + options.align, handleBounds, options.direction + " " + options.align, Position.xAdjustment(options), Position.yAdjustment(options));
		
			elementBounds.moveWithin(viewportBounds);
			
			flipped = true;
		}
		
		elementBounds.moveBy(options.xOffset, options.yOffset);
		
		elementBounds.syncElement();

		if(options.arrowSize > 0)
		{
			var arrow = element.down("canvas.arrow");
			
			if(!arrow)
			{
				arrow = new Element("canvas", {"class":"arrow"}).setStyle({position:"absolute", width:"1px", height:"1px"});
			
				element.insert({bottom: arrow});
			}
	
			var arrowBounds = new Bounds(arrow);
			var extentBounds = new Bounds();
			var arrowTheda = 0;
			var arrowOffsetX = 0;
			var arrowOffsetY = 0;
			var borderWidth = 0;
			var borderColor = "#000";

			if(options.direction == "top")
			{
				borderWidth = element.measure("border-bottom");
				borderColor = element.getStyle("border-bottom-color");
				
				arrowBounds.top = elementBounds.bottom - borderWidth;
				arrowBounds.setWidth((options.arrowSize + options.arrowMargin) * 2);
				arrowBounds.setHeight(options.arrowSize + borderWidth + options.arrowMargin);
				
				extentBounds.left = elementBounds.left;
				extentBounds.right = elementBounds.right;
				extentBounds.top = elementBounds.bottom - borderWidth;
				extentBounds.bottom = elementBounds.bottom + options.arrowSize + options.arrowMargin;
				
				arrowTheda = 0;
				arrowOffsetX = options.arrowSize;
			}
			else if(options.direction == "bottom")
			{
				borderWidth = element.measure("border-top");
				borderColor = element.getStyle("border-top-color");
				
				arrowBounds.bottom = elementBounds.top + borderWidth;
				arrowBounds.setWidth((options.arrowSize + options.arrowMargin) * 2);
				arrowBounds.setHeight(options.arrowSize + borderWidth + options.arrowMargin);
				
				extentBounds.left = elementBounds.left;
				extentBounds.right = elementBounds.right;
				extentBounds.top = elementBounds.top - options.arrowSize -  + options.arrowMargin;
				extentBounds.bottom = elementBounds.top + borderWidth;
				
				arrowTheda = Math.PI;
				arrowOffsetY = options.arrowSize + options.arrowMargin;
				arrowOffsetX = options.arrowSize;
			}
			else if(options.direction == "left")
			{
				borderWidth = element.measure("border-right");
				borderColor = element.getStyle("border-right-color");
				
				arrowBounds.left = elementBounds.right - borderWidth;
				arrowBounds.setWidth(options.arrowSize + borderWidth + options.arrowMargin);
				arrowBounds.setHeight((options.arrowSize + options.arrowMargin) * 2);
				
				extentBounds.top = elementBounds.top;
				extentBounds.bottom = elementBounds.bottom;
				extentBounds.left = elementBounds.right - borderWidth;
				extentBounds.right = elementBounds.right + options.arrowSize + options.arrowMargin;
				
				arrowTheda = 3 * Math.PI / 2;
				arrowOffsetX = -options.arrowMargin;
				arrowOffsetY = options.arrowSize + options.arrowMargin;
			}
			else if(options.direction == "right")
			{
				borderWidth = element.measure("border-left");
				borderColor = element.getStyle("border-left-color");
				
				arrowBounds.right = elementBounds.left + borderWidth;
				arrowBounds.setWidth(options.arrowSize + borderWidth + options.arrowMargin);
				arrowBounds.setHeight((options.arrowSize + options.arrowMargin) * 2);
				
				extentBounds.top = elementBounds.top;
				extentBounds.bottom = elementBounds.bottom;
				extentBounds.left = elementBounds.left - options.arrowSize - options.arrowMargin;
				extentBounds.right = elementBounds.left + borderWidth;
				
				arrowTheda = Math.PI / 2;
				arrowOffsetY = options.arrowSize + options.arrowMargin;
				arrowOffsetX = options.arrowSize;
			}
			
			arrowBounds.moveRelative(options.direction, handleBounds, Position.opposite(options.direction), 0, 0);
			arrowBounds.moveWithin(extentBounds);
			arrowBounds.syncElement();
		
			var arrowContext = arrow.getContext('2d');
			var boxShadow = element.getStyle("box-shadow") || element.getStyle("-webkit-box-shadow") || element.getStyle("-moz-box-shadow");
			
			arrow.width = arrowBounds.getWidth();
			arrow.height = arrowBounds.getHeight();
			arrowContext.clearRect(0, 0, arrowBounds.getWidth(), arrowBounds.getHeight());
			arrowContext.translate(arrowOffsetX + options.arrowMargin, arrowOffsetY);
			arrowContext.rotate(arrowTheda);
			arrowContext.save();
			
			if(boxShadow)
			{
				var bracket = boxShadow.indexOf(")");
				var offsets = boxShadow.substring(bracket + 2).split(" ");
				
				arrowContext.shadowOffsetX = parseInt(offsets[0]);
				arrowContext.shadowOffsetY = parseInt(offsets[1]);
				arrowContext.shadowBlur    = parseInt(offsets[2]);
				arrowContext.shadowColor   = boxShadow.substring(0, bracket + 1);
			}
			
			arrowContext.fillStyle = element.getStyle("background-color");
			arrowContext.beginPath();
			arrowContext.moveTo(-options.arrowSize * options.arrowRatio - 0.5, -borderWidth);
			arrowContext.lineTo(-0.5, options.arrowSize);
			arrowContext.lineTo(options.arrowSize * options.arrowRatio - 0.5, -borderWidth);
			arrowContext.closePath();
			arrowContext.fill();
			arrowContext.restore();
			
			if(borderWidth > 0)
			{
				arrowContext.save();
				arrowContext.lineWidth = borderWidth;
				arrowContext.strokeStyle = borderColor;
				arrowContext.beginPath();
				arrowContext.moveTo(-options.arrowSize * options.arrowRatio - 0.5, -borderWidth);
				arrowContext.lineTo(-0.5, options.arrowSize);
				arrowContext.lineTo(options.arrowSize * options.arrowRatio - 0.5, -borderWidth);
				arrowContext.stroke();
				arrowContext.restore();
			}
		}

		return {direction:options.direction, flipped:flipped};
	},
	
	opposite: function(inPosition)
	{
		if(inPosition == "top") return "bottom";
		if(inPosition == "bottom") return "top";
		if(inPosition == "left") return "right";
		if(inPosition == "right") return "left";
		
		return inPosition; 
	},
	
	orientation: function(inPosition)
	{
		return (inPosition == "top" || inPosition == "bottom") ? "vertical" : "horizontal";
	},
	
	xAdjustment: function(inOptions)
	{
		if (inOptions.direction == "left") return -(inOptions.padding + inOptions.arrowSize);
		if (inOptions.direction == "right") return (inOptions.padding + inOptions.arrowSize);
		
		return 0;
	},
	
	yAdjustment: function(inOptions)
	{	
		if (inOptions.direction == "top") return -(inOptions.padding + inOptions.arrowSize);
		if (inOptions.direction == "bottom") return (inOptions.padding + inOptions.arrowSize);

		return 0;
	},
	
	flip: function(inPosition, inAdjustment)
	{
		if((inPosition == "top" || inPosition == "bottom") && inAdjustment.y != 0) return true;
		if((inPosition == "left" || inPosition == "right") && inAdjustment.x != 0) return true;
		
		return false;
	}
};
