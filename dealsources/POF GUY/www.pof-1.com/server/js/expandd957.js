var Expand = Class.create(
{
	initialize: function(inElement, inOptions)
	{
		this.element = $(inElement);
		
		if(!this.element)
		{
			return;
		}
		
		this.element._expand = this;
		
		this.options = {
			select: 'expandable',
			expandedClass: 'expanded',
			collapsedClass: 'collapsed',
			latchClass: 'latch',
			multiple: true,
			required: false,
			latchOnly: false,
			openOnly: true,
			table: false,
			animate: true,
			assumeChildren: true,
			cookie: null,
			expanded: [],
			onExpand: null,
			onCollapse: null,
			expandText: "&#9660;",
			collapseText: "&#9658;",
			formName: null,
			orientation: 'vertical',
			expandUp: false
		};
	
		Object.extend(this.options, inOptions);
		
		this.element.expanded = this.getExpanded.bind(this);
		this.element.expandAll = this.expandAll.bind(this);
		this.element.collapseAll = this.collapseAll.bind(this);
		this.element.toggleAll = this.toggleAll.bind(this);
		this.element.expandTo = this.expandTo.bind(this);

		this.expanded = [];
		
		// -------
		
		var expandedID = "expanded_" + this.element.identify();
		
		this.expandedElement = $(expandedID);
		
		if(!this.expandedElement)
		{
			this.expandedElement = new Element("input", {"type":"hidden", "name":expandedID});
			
			var parent = this.element.up("form") || document.body;
			
			parent.insert({bottom: this.expandedElement});
		}

		// -------
		
		if(this.options.cookie)
		{
			var expansions = getCookie(this.options.cookie).split(",");
			
			for(var i = 0; i < expansions.length; i++)
			{
				this.options.expanded[this.options.expanded.length] = expansions[i];
			}
		}
		
		// -------
	
		var pieces = [];
		var maxHeight = this.element.measure("margin-box-height");
		var expandable = this.getExpandable();
		var totalExpanded = 0;
		
		for(var i = 0; i < expandable.length; i++)
		{
			expandable[i].latch = expandable[i].down('.' + this.options.latchClass);

			if(expandable[i].latch && this.options.latchOnly)
			{
				expandable[i].latch.observe('click', this.click.bindAsEventListener(this));
			}
			else
			{
				expandable[i].observe('click', this.click.bindAsEventListener(this));
			}
			
			expandable[i].child = $(expandable[i].identify() + "_child");
			
			var shouldExpand = this.options.expanded.indexOf(expandable[i].identify()) >= 0;
			
			if(!expandable[i].child && this.options.assumeChildren || (this.options.table && shouldExpand && !this.options.assumeChildren))
			{
				expandable[i].child = expandable[i].next();
			}

			expandable[i].origHeight = this.elementVisible(expandable[i]) ? expandable[i].measure("margin-box-height") : 0;

			if(expandable[i].origHeight > maxHeight)
			{
				maxHeight = expandable[i].origHeight;
			}

			if(expandable[i].child)
			{
				var visible = this.elementVisible(expandable[i].child);
				
				expandable[i].child.origHeight = visible ? expandable[i].child.measure("margin-box-height") : 0;
	
				if(expandable[i].child.origHeight > maxHeight)
				{
					maxHeight = expandable[i].child.origHeight;
				}
	
				expandable[i].child.origWidth = visible ? expandable[i].child.measure("margin-box-width") : 0;
			}
			
			if(this.options.expanded)
			{
				this.setExpanded(expandable[i], shouldExpand, false);
				totalExpanded += shouldExpand ? 1 : 0;
			}

			pieces.push(expandable[i]);
			
			if(expandable[i].child)
			{
				pieces.push(expandable[i].child);
			}
		}

		if(this.options.orientation == 'horizontal')
		{
			this.element.setStyle({height: maxHeight + "px"});

			for(var i = 0; i < pieces.length; i++)
			{
				if(pieces[i].origHeight < maxHeight)
				{
					var space = maxHeight - pieces[i].origHeight;
					var top = parseInt(space / 2);
					var bottom = space - top;
	
					pieces[i].setStyle({paddingTop: top + "px", paddingBottom:bottom + "px"});
				}
			}
		}

		if(this.options.required && totalExpanded == 0)
		{
			this.setExpanded(expandable[0], true, false);
		}

		this.update();
	},
	
	elementVisible: function(inElement)
	{
		while(inElement)
		{
			if(inElement.getStyle('display') == 'none')
			{
				return false;
			}

			inElement = inElement.parentElement;
		}

		return true;
	},
	
	toggleAll: function(inClass)
	{
		var expandable = this.getExpandable();
		
		var expanding = false;
		
		for(var i = 0; i < expandable.length; i++)
		{
			if(!inClass || expandable[i].hasClassName(inClass))
			{
				if(!expandable[i].hasClassName(this.options.expandedClass))
				{
					expanding = true;
					
					break;
				}
			}
		}
		
		for(var i = 0; i < expandable.length; i++)
		{
			if(!inClass || expandable[i].hasClassName(inClass))
			{
				this.setExpanded(expandable[i], expanding, this.options.animate);
			}
		}
		
		this.update();
	},
	
	expandAll: function(inClass)
	{
		var expandable = this.getExpandable();
		
		var expanding = true;
		
		for(var i = 0; i < expandable.length; i++)
		{
			if(!inClass || expandable[i].hasClassName(inClass))
			{
				this.setExpanded(expandable[i], expanding, this.options.animate);
			}
		}
		
		this.update();
	},

	collapseAll: function(inClass)
	{
		var expandable = this.getExpandable();
		
		var expanding = false;
		
		for(var i = 0; i < expandable.length; i++)
		{
			if(!inClass || expandable[i].hasClassName(inClass))
			{
				this.setExpanded(expandable[i], expanding, this.options.animate);
			}
		}
		
		this.update();
	},

	expandTo: function(inID, inCollapse)
	{
		var element = $(this.element.identify() + "_" + inID);
		
		if(!element)
		{
			element = $(inID);
		}
		
		if(inCollapse)
		{
			var expandables = this.getExpandable();
			
			for(var i = 0; i < expandables.length; i++)
			{
				this.setExpanded(expandables[i], false, false);
			}
		}
		
		while(element)
		{
			var up = element.up();
			
			element = null;
			
			if(up)
			{
				var parent = up.previous();
				
				if(parent && parent.hasClassName(this.options.select))
				{
					this.setExpanded(parent, true, false);
					
					element = parent;
				}
			}
		}
	},
	
	getExpandable: function()
	{
		if(!this.expandable)
		{
			this.expandable = this.element.select('.' + this.options.select);
			
			if(this.expandable.length == 0 && !this.options.table)
			{
				this.expandable[0] = this.element;
				this.expandable[0].addClassName(this.options.select);
			}
		}
		
		return this.expandable;
	},
	
	getExpanded: function(inTrim)
	{
		if(inTrim)
		{
			var name = this.element.identify();
			var results = new Array(length);
			var length = this.selected.length;
			
			while(length--)
			{
				results[length] = this.selected[length]
				
				if(results[length].startsWith(name))
				{
					results[length] = results[length].substring(name.length + 1);
				}
			}
			
			return results;
		}
		
		return this.selected;
	},
	
	setExpanded: function(inElement, inExpanded, inAnimate)
	{
		if(inElement)
		{
			if(inExpanded)
			{
				if(inElement.latch)
				{
					inElement.latch.update(this.options.expandText);
				}
				
				if(inElement.child && !inElement.hasClassName(this.options.expandedClass))
				{
					if(inAnimate)
					{
						this.animating = true;
	
						if(this.options.orientation == 'horizontal')
						{
							new Effect.Scale(inElement.child, 100, Object.extend({
								scaleContent: false,
								scaleY: false,
								scaleFrom: 0,
								scaleMode: {originalHeight: inElement.child.origHeight, originalWidth: inElement.child.origWidth},
								restoreAfterFinish: true,
								afterSetup: function(effect) {effect.element.makeClipping().setStyle({width: '0px'}).show();},
								afterFinishInternal: function(effect) { effect.element.undoClipping(); }
							}, { duration:0.4, afterFinish: this.doneAnimating.bind(this)}));
						}
						else
						{
							if(inElement.hasClassName("blind"))
							{
								Effect.BlindDown(inElement.child, { duration:0.4, afterFinish: this.doneAnimating.bind(this) });
							}
							else
							{
								Effect.SlideDown(inElement.child, { duration:0.4, afterFinish: this.doneAnimating.bind(this) });
							}
						}
					}
					else
					{
						inElement.child.setStyle({display:''});
						
						document.fire('behavior:resize');
					}
				}
				
				inElement.addClassName(this.options.expandedClass);
				inElement.removeClassName(this.options.collapsedClass);
				
				if(this.options.onExpand)
				{
					this.options.onExpand(inElement, inElement.child);
				}
			
				if(inElement.tagName.toLowerCase() == "input")
				{
					inElement.checked = "checked";
				}
				
				if(!inElement.child && this.options.table)
				{
					this.update();
	
					(this.options.formName) ? Forms.submit(this.options.formName) : Forms.submit();
				}
				
				return true;
			}
			else
			{
				if(inElement.latch)
				{
					inElement.latch.update(this.options.collapseText);
				}
				
				if(inElement.child && !inElement.hasClassName(this.options.collapsedClass))
				{
					if(inAnimate)
					{
						this.animating = true;
						
						if(this.options.orientation == 'horizontal')
						{
							inElement.child.makeClipping();
							new Effect.Scale(inElement.child, 0, Object.extend({
								scaleContent: false,
								scaleY: false,
								restoreAfterFinish: true,
								afterFinishInternal: function(effect) { effect.element.hide().undoClipping(); }
							}, { duration:0.4, afterFinish: this.doneAnimating.bind(this)}));
						}
						else
						{
							if(inElement.hasClassName("blind"))
							{
								Effect.BlindUp(inElement.child, { duration:0.4, afterFinish: this.doneAnimating.bind(this)});
							}
							else
							{
								Effect.SlideUp(inElement.child, { duration:0.4, afterFinish: this.doneAnimating.bind(this)});
							}
						}
					}
					else
					{
						inElement.child.setStyle({display:'none'});
						
						document.fire('behavior:resize');
					}
				}
				
				inElement.addClassName(this.options.collapsedClass);
				inElement.removeClassName(this.options.expandedClass);
				
				if(this.options.onCollapse)
				{
					this.options.onCollapse(inElement, inElement.child);
				}
				
				if(inElement.tagName == "input")
				{
					inElement.checked = null;
				}
				
				return false;
			}
		}
	},
	
	doneAnimating: function()
	{
		this.animating = false;
		
		document.fire('behavior:resize');
	},
	
	update: function()
	{
		var expandable = this.getExpandable();
			
		this.expanded = [];
		
		for(var i = 0; i < expandable.length; i++)
		{
			if(expandable[i].hasClassName(this.options.expandedClass))
			{
				this.expanded.push(expandable[i].identify());
			}
		}
		
		this.expandedElement.value = this.expanded.join(",");
		
		if(this.options.cookie)
		{
			setCookie(this.options.cookie, this.expanded.join(","), null, "index.html");
		}
	},
	
	click: function(inEvent)
	{
		if(this.animating)
		{
			return;
		}
		
		var clicked = inEvent.element();
		
		var element = clicked;
		
		if(!element.hasClassName(this.options.select))
		{
			element = element.up('.' + this.options.select);
		}
  
		if(!element)
		{
			return;
		}
	
		if(!this.options.multiple)
		{
			var expandable = this.getExpandable();
		
			for(var i = 0; i < expandable.length; i++)
			{
				var shouldHide = true;

				var testElement = expandable[i];

				while(testElement)
				{
					if(testElement == element)
					{
						shouldHide = false;

						break;
					}

					// expandables children are not in a tree under the parent - but rather sibling divs
                    if(testElement.up("div") && testElement.up().identify().endsWith("_child"))
                    {
                        if(testElement.up().down("#" + element.identify()))
                        {
                            shouldHide = false;
                            
                            break;
                        }
                    }

					testElement = testElement.child;

					if(testElement && !testElement.hasClassName(this.options.select))
					{
						testElement = testElement.down('.' + this.options.select);
					}
				}

				if(shouldHide)
				{
					this.setExpanded(expandable[i], false, this.options.animate);
				}
			}
		}

		var latchClicked = clicked.hasClassName(this.options.latchClass) || clicked.up('.' + this.options.latchClass);
		
		if(this.options.openOnly && !latchClicked && element.latch && element.hasClassName(this.options.expandedClass))
		{
			return;
		}
		
		if(this.options.required && element.hasClassName(this.options.expandedClass) && this.expanded.length == 1)
		{
			return;
		}
	
		this.setExpanded(element, element.checked || !element.hasClassName(this.options.expandedClass), this.options.animate);
				
		this.update();
	}
});
