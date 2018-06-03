var EMPTY = "";
var CONTROL_KEY	= -1;
var ALT_KEY		= -2;
var SHIFT_KEY	= -3;
var META_KEY	= -4;

var Action = Class.create(
{
	initialize: function()
	{
		this.actions = [];
		this.conditions = [];
		this.processFailed = false;
		this.lastElements = [];
		
		document.observe('click', this.test.bindAsEventListener(this));
		 
		document.observe('keydown', this.test.bindAsEventListener(this));
		 
		document.observe("behavior:change", this.test.bindAsEventListener(this));

		document.observe("change", this.test.bindAsEventListener(this));
		
		return this;
	},

	call: function(inStatement)
	{
		this.actions.push({ passedFunction: this._call.bind(this), statement: inStatement});
		
		return this;
	},
	
	to: function()
	{
		this.setActionObject(arguments);
		
		return this;
	},

	from: function()
	{
		return this.to(arguments);
	},
	
	click: function()
	{
		this.actions.push({ passedFunction: this._click.bind(this) });
		
		this.setActionObject(arguments);
		
		return this;
	},
	
	show: function()
	{
		this.actions.push({ passedFunction: this._show.bind(this), failedFunction: this._hide.bind(this) });
	
		this.setActionObject(arguments);
		
		return this;
	},
	
	hide: function()
	{
		this.actions.push({ passedFunction: this._hide.bind(this), failedFunction: this._show.bind(this) });
	
		this.setActionObject(arguments);
		
		return this;
	},
	
	toggle: function()
	{
		this.actions.push({ passedFunction: this._toggle.bind(this) });
		
		this.setActionObject(arguments);
		
		return this;
	},

	enable: function()
	{
		this.actions.push({ passedFunction: this._enable.bind(this), failedFunction: this._disable.bind(this) });

		this.setActionObject(arguments);

		return this;
	},

	disable: function()
	{
		this.actions.push({ passedFunction: this._disable.bind(this), failedFunction: this._enable.bind(this) });

		this.setActionObject(arguments);

		return this;
	},

	addClassName: function(inValue)
	{
		this.actions.push({ passedFunction: this._addClassName.bind(this), failedFunction: this._removeClassName.bind(this), className: inValue });

		return this;
	},

	removeClassName: function(inValue)
	{
		this.actions.push({ passedFunction: this._removeClassName.bind(this), failedFunction: this._addClassName.bind(this), className: inValue });

		return this;
	},
	
	setActionObject: function(inArguments)
	{
		if(this.actions.length == 0)
		{
			throw("No actions have be declared");
		}
		
		var action = this.actions[this.actions.length - 1];
		
		if(action.elements)
		{
			throw("Elements have already been defined");
		}
	
		action.elements = [];
		if(inArguments)
		{
			for(var i = 0; i < inArguments.length; i++)
			{
				var element = $(inArguments[i]);

				if(element)
				{
					action.elements.push(element);
				}
			}

			if(action.elements.length == 0)
			{
				action.elements = $(document.body).select(inArguments[0]);
			}
		}
	},
	
	_call: function(inAction)
	{
		if(inAction.statement)
		{
			if(Object.isFunction(inAction.statement))
			{
				inAction.statement();
			}
			else
			{
				eval(inAction.statement);
			}
		}
	},

	_click: function(inAction)
	{
		if(inAction.elements)
		{
			for(var i = 0; i < inAction.elements.length; i++)
			{
				inAction.elements[i].click();
			}
		}
	},
	
	_enable: function(inAction)
	{
		if(inAction.elements)
		{
			for(var i = 0; i < inAction.elements.length; i++)
			{
				if(inAction.elements[i].enable)
				{
					inAction.elements[i].enable();
				}
				else
				{
					inAction.elements[i].disabled = false;
				}
			}
		}
	},
	
	_disable: function(inAction)
	{
		if(inAction.elements)
		{
			for(var i = 0; i < inAction.elements.length; i++)
			{
				if(inAction.elements[i].disable)
				{
					inAction.elements[i].disable();
				}
				else
				{
					inAction.elements[i].disabled = true;
				}
			}
		}
	},
	
	_show: function(inAction)
	{
		if(inAction.elements)
		{
			var changed = false;

			for(var i = 0; i < inAction.elements.length; i++)
			{
				if(inAction.elements[i].getStyle("display") == "none")
				{
					changed = true;
				}

				inAction.elements[i].show();
			}

			if(changed)
			{
				document.fire("behavior:resize");
			}
		}
	},
	
	_hide: function(inAction)
	{
		if(inAction.elements)
		{
			var changed = false;

			for(var i = 0; i < inAction.elements.length; i++)
			{
				if(inAction.elements[i].getStyle("display") != "none")
				{
					changed = true;
				}

				inAction.elements[i].hide();
			}

			if(changed)
			{
				document.fire("behavior:resize");
			}
		}
	},
	
	_toggle: function(inAction)
	{
		if(inAction.elements)
		{
			for(var i = 0; i < inAction.elements.length; i++)
			{
				if(inAction.elements[i].getStyle('display') == "none")
				{
					inAction.elements[i].show();
				}
				else
				{
					inAction.elements[i].hide();
				}
			}
		}
	},

	_addClassName: function(inAction)
	{
		if(inAction.elements)
		{
			for(var i = 0; i < inAction.elements.length; i++)
			{
				inAction.elements[i].addClassName(inAction.className);
			}
		}
	},

	_removeClassName: function(inAction)
	{
		if(inAction.elements)
		{
			for(var i = 0; i < inAction.elements.length; i++)
			{
				inAction.elements[i].removeClassName(inAction.className);
			}
		}
	},
	
	// -------------

	setConditionObject: function(inObject)
	{
		var object = new String(inObject);
		
		if(object.startsWith("[") && object.endsWith("]"))
		{
			this.conditions.push({ testFunction: this._eval.bind(this), statement: object.substring(1, object.length - 1) });
				
			this.processFailed = true;
		}
		else if(Object.isNumber(inObject))
		{
			this.lastKey = inObject;
		}
		else
		{
			var element = $(inObject);
			
			if(element)
			{
				this.lastElements = [element];
			}
			else
			{
				this.lastElements = $(document.body).select(inObject);
			}
			
			for(var i = 0; i < this.lastElements.length; i++)
			{
				this.lastElements[i].focused = false;
				
				this.lastElements[i].onfocus = function() { this.focused = true; }.bind(this.lastElements[i]);
			    
			    this.lastElements[i].onblur = function() { this.focused = false; }.bind(this.lastElements[i]);
			}
		}
	},
	
	when: function(inCondition)
	{
		this.setConditionObject(inCondition);
	
		return this;
	},
	
	and: function(inCondition)
	{
		this.setConditionObject(inCondition);
		
		return this;
	},
	
	or: function(inCondition)
	{
		this.conditions.push({ testFunction: this._or.bind(this) });
		
		this.setConditionObject(inCondition);
		
		return this;
	},
	
	is: function(inValue)
	{
		if(this.lastElements.length == 0)
		{
			throw("no condition object set");
		}

		if(!inValue)
		{
			inValue = "";
		}

		this.conditions.push({ testFunction: this._is.bind(this), value: inValue, elements: this.lastElements });
			
		this.processFailed = true;
		
		return this;
	},

	isNot: function(inValue)
	{
		if(this.lastElements.length == 0)
		{
			throw("no condition object set");
		}

		if(!inValue)
		{
			inValue = "";
		}

		this.conditions.push({ testFunction: this._isnot.bind(this), value: inValue, elements: this.lastElements });
			
		this.processFailed = true;

		return this;
	},
	
	isClicked: function()
	{
		if(this.lastElements.length == 0)
		{
			throw("no condition object set");
		}

		this.conditions.push({ testFunction: this._clicked.bind(this), element: this.lastElements[0], ancestors: this.lastElements[0].ancestors()});
		
		return this;
	},
	
	isChanged: function()
	{
		if(this.lastElements.length == 0)
		{
			throw("no condition object set");
		}
		
		this.lastElements[0].on("change", this.test.bindAsEventListener(this)); // todo make this work with all the last elements

		this.conditions.push({ testFunction: this._changed.bind(this), element: this.lastElements[0], ancestors: this.lastElements[0].ancestors()});
		
		return this;
	},
	
	isPressed: function()
	{
		if(!this.lastKey)
		{
			throw("no condition object set");
		}

		this.conditions.push({ testFunction: this._pressed.bind(this), key: this.lastKey});
		
		return this;
	},
	
	hasFocus: function()
	{
		if(this.lastElements.length == 0)
		{
			throw("no condition object set");
		}

		this.conditions.push({ testFunction: this._focused.bind(this), elements: this.lastElements});

		return this;
	},
	
	losesFocus: function()
	{
		if(this.lastElements.length == 0)
		{
			throw("no condition object set");
		}

		this.conditions.push({ testFunction: this._blurred.bind(this), elements: this.lastElements});

		return this;
	},
	
	isActive: function()
	{
		if(this.lastElements.length == 0)
		{
			throw("no condition object set");
		}

		this.conditions.push({ testFunction: this._isactive.bind(this), elements: this.lastElements});

		return this;
	},
	
	isNotActive: function()
	{
		if(this.lastElements.length == 0)
		{
			throw("no condition object set");
		}

		this.conditions.push({ testFunction: this._isnotactive.bind(this), elements: this.lastElements});

		return this;
	},

	// -------------
	
	test: function(inEvent)
	{
		this.passed = true;
		
		for(var i = 0; i < this.conditions.length; i++)
		{
			var condition = this.conditions[i];
			
			if(condition.testFunction && !condition.testFunction(condition, inEvent))
			{
				this.passed = false;
			}
		}
	
		for(var i = 0; i < this.actions.length; i++)
		{
			var action = this.actions[i];
			
			if(this.passed && action.passedFunction)
			{
				action.passedFunction(action);
			}
			
			if(!this.passed && this.processFailed && action.failedFunction)
			{
				action.failedFunction(action);
			}
		}
	},
	
	_or: function()
	{
		this.passed = true;
		
		return true;
	},
	
	_pressed: function(inCondition, inEvent)
	{
		if(inCondition.key > 0)
		{
			return inCondition.key == inEvent.keyCode;
		}
		else if(inEvent.shiftKey && inCondition.key == SHIFT_KEY)
		{
			return true;
		}
		else if(inEvent.metaKey && inCondition.key == META_KEY)
		{
			return true;
		}
		else if(inEvent.ctrlKey && inCondition.key == CONTROL_KEY)
		{
			return true;
		}
		else if(inEvent.altKey && inCondition.key == ALT_KEY)
		{
			return true;
		}
		
		return false;
	},
	
	_clicked: function(inCondition, inEvent)
	{
		if(inEvent.type == "click")
		{
			if(inEvent.element() == inCondition.element)
			{
				return true;
			}
			else
			{
				for(var i = 0; i < inCondition.ancestors.length; i++)
				{
					if(inCondition.ancestors[i] == inCondition.element)
					{
						return true;
					}
				}
			}
		}
		
		return false;
	},
	
	_changed: function(inCondition, inEvent)
	{
		if(inEvent.type == "change")
		{
			if(inEvent.element() == inCondition.element)
			{
				return true;
			}
			else
			{
				for(var i = 0; i < inCondition.ancestors.length; i++)
				{
					if(inCondition.ancestors[i] == inCondition.element)
					{
						return true;
					}
				}
			}
		}
		
		return false;
	},
	
	_focused: function(inCondition)
	{
		for(var i = 0; i < inCondition.elements.length; i++)
		{
			if(inCondition.elements[i] && inCondition.elements[i].focused)
			{
				return true;
			}
		}
	
		return false;
	},
	
	_blurred: function(inCondition)
	{
		for(var i = 0; i < inCondition.elements.length; i++)
		{
			if(inCondition.elements[i] && !inCondition.elements[i].focused)
			{
				return true;
			}
		}
	
		return false;
	},
	
	_isactive: function(inCondition)
	{
		for(var i = 0; i < inCondition.elements.length; i++)
		{
			if(inCondition.elements[i] && inCondition.elements[i] == Client.getActiveElement())
			{
				return true;
			}
		}
	
		return false;
	},
	
	_isnotactive: function(inCondition)
	{
		for(var i = 0; i < inCondition.elements.length; i++)
		{
			if(inCondition.elements[i] && inCondition.elements[i] != Client.getActiveElement())
			{
				return true;
			}
		}
	
		return false;
	},
	
	_is: function(inCondition)
	{
		if(inCondition.value == EMPTY)
		{
			for(var i = 0; i < inCondition.elements.length; i++)
			{
				if(inCondition.elements[i].value == EMPTY || inCondition.elements[i].hasClassName("empty"))
				{
					return true;
				}
			}
			
			return false;
		}
		
		for(var i = 0; i < inCondition.elements.length; i++)
		{
			if(inCondition.elements[i] && inCondition.elements[i].value == inCondition.value)
			{
				return true;
			}
		}

		return false;
	},

	_isnot: function(inCondition)
	{
		if(inCondition.value == EMPTY)
		{
			for(var i = 0; i < inCondition.elements.length; i++)
			{
				if(inCondition.elements[i].value != EMPTY && !inCondition.elements[i].hasClassName("empty"))
				{
					return true;
				}
			}
			
			return false;
		}

		for(var i = 0; i < inCondition.elements.length; i++)
		{
			if(inCondition.elements[i] && inCondition.elements[i].value != inCondition.value)
			{
				return true;
			}
		}

		return false;
	},

	_eval: function(inCondition)
	{
		if(inCondition.statement)
		{
			try
			{
				return eval(inCondition.statement);
			}
			catch(e)
			{
				return false;
			}
		}

		return false;
	}
});