var Scroll = Class.create(
{
	initialize: function(inElement, inOptions)
	{
		this.element = $(inElement);
		
		if(!this.element)
		{
			return;
		}
		
		this.options = {
			scrollTo: null,
			position: 0,
			height: 0,
			handle: null,
			save: true,
			maximize: false,
			distributeClass: null
		};
			
		Object.extend(this.options, inOptions);
		
		this.element.getScroll = this.getScroll.bind(this);
		
		// -------
		
		

		// -------
		
		var positionID = "scroll_" + this.element.identify();
	
		this.position = $(positionID);
		
		if(!this.position)
		{
			this.position = this.element.insert({before: "<input type='hidden' name='" + positionID + "' id='" + positionID + "'>"}).previous();
		}

		// -------
		
		if(this.options.handle)
		{
			this.handle = $(this.options.handle);
			
			if(this.handle)
			{
				this.handle.setStyle({cursor: 'row-resize'});
			
				this.handle.observe('mousedown', this.mousedown.bindAsEventListener(this));
			}
		}
		
		if(this.options.maximize)
		{

		}
		else if(this.handle && this.options.height > 0)
		{
			this.minimum = parseInt(this.element.getStyle("minHeight"));
			
			this.maximum = parseInt(this.element.getStyle("maxHeight"));
			
			this.element.setStyle({height: this.options.height + "px"});
		}

		// ------------
		
		if(this.options.scrollTo)
		{
			var scrollTo = this.element.select('.' + this.options.scrollTo).first();
		
			if(scrollTo)
			{
				this.element.scrollTop = scrollTo.positionedOffset().top;
			}
		} 
		else if(this.options.position > 0)
		{
			this.element.scrollTop = this.options.position;
		}

		// ------------
	
		this.element.observe('scroll', this.update.bindAsEventListener(this));
		
		document.observe('behavior:resize', this.update.bindAsEventListener(this));

		this.update();
	},
	
	getScroll: function()
	{
		return this;
	},
	
	update: function()
	{
		if(this.options.maximize)
		{
			//this.element.setStyle({height: null});
			
			var parent = this.element.up();
			
			var children = parent.childElements();
		
			var total = 0;
			
			for(var i = 0; i < children.length; i++)
			{
				total += children[i].measure("border-box-height");
			}
		
			var height = this.element.measure("border-box-height") + parent.measure("height") - total;
	
			this.element.setStyle({ height: height + "px" });

			if(this.options.distributeClass)
			{
				var rows = this.element.select("." + this.options.distributeClass);
				
				var remaining = height;
				
				var rowHeight = parseInt(height / rows.length);
	
				for(var i = 0; i < rows.length; i++)
				{
					if(i == (rows.length - 1))
					{
						rows[i].setStyle({height: remaining + "px"});
					}
					else
					{
						rows[i].setStyle({height: rowHeight + "px"});
					}
					
					remaining -= rowHeight;
				}
			}
		}
		
		if(this.options.save)
		{
			var visible = true;
			var ancestors = this.element.ancestors();
			
			for(var i = 0; i < ancestors.length; i++)
			{
				if(!ancestors[i].visible())
				{
					visible = false;
					
					break;
				}
			}
			
			if(visible)
			{
				this.position.value = this.element.scrollTop + "," + this.element.getHeight();
			}
		}
	},
	
	mousedown: function(inEvent)
	{
		if(this.handle)
		{
			this.mousemoveFunction = this.mousemove.bindAsEventListener(this);
			this.mouseupFunction = this.mouseup.bindAsEventListener(this);

			document.observe('mousemove', this.mousemoveFunction);
			document.observe('mouseup', this.mouseupFunction);
		
			this.sourceY = inEvent.pointerY();
			this.sourceHeight = this.element.getHeight();
			this.resizing = true;

			Event.stop(inEvent);
		}
	},
	
	mousemove: function(inEvent)
	{
		if(this.handle && this.resizing)
		{
			var height = this.sourceHeight + inEvent.pointerY() - this.sourceY;
	
			if(this.minimum > 0 && height < this.minimum)
			{
				height = this.minimum;
			}
	
			if(this.maximum > 0 && height > this.maximum)
			{
				height = this.maximum;
			}

			this.element.setStyle({height: height + "px"});
			
			Client.forceRedraw();
			
			document.fire('behavior:resize');
		}
	},
	
	mouseup: function(inEvent)
	{
		if(this.handle && this.resizing)
		{
			document.stopObserving('mousemove', this.mousemoveFunction);
			document.stopObserving('mouseup', this.mouseupFunction);
			
			this.resizing = false;
		}
	}
});