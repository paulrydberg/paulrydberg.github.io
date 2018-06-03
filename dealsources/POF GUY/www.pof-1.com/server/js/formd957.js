Event.observe(window, "load", function()
{
	var forms = $$('form.changeable');

	for(var i = 0; i < forms.length; i++)
	{
		new Changable(forms[i]);
	}

	Forms.autoFocus();
});
	
// -----------

var Forms =
{
	changeables: new Hash(),
	
	callbacks: new Array(),
	
	initialize: function()
	{
		document.observe('keydown', this.keydown.bindAsEventListener(this));
    
		var test = document.createElement('input');
      
		this.placeholderSupported = 'placeholder' in test;
    
		this.autofocusSupported = 'autofocus' in test;
	},
	
	keydown: function(inEvent)
	{
		if(inEvent.keyCode == Event.KEY_RETURN)
		{
			var element = inEvent.element();

			if(element.up(".changeable"))
			{
				if(element.getAttribute("contenteditable"))
				{
					return;
				}
				else if(element.tagName.toLowerCase() == 'textarea')
				{
					return;
				}

				Event.stop(inEvent);
			}
		}
	},

	add: function(inChangable)
	{
		this.changeables.set(inChangable.form.identify(), inChangable);
	},
	
	get: function(inName)
	{
		this.changeables.get(inName);
	},
	
	addCallback: function(inAction)
	{
		this.callbacks.push(inAction);
	},

	supportsPlaceholder: function()
	{   
		return this.placeholderSupported;
	},
  
	supportsAutofocus: function()
	{
		this.autofocusSupported;
	},
  
	autoFocus: function()
	{
		if(this.autofocus)
		{
			this.autofocus.activate();
		}
	},
  
	setAutofocus: function(element)
	{
		if(!this.autofocus)
		{
			this.autofocus = element;
		}
	},
  
	submit: function()
	{
		var name;
	
		var hidden;
	
		for(var i = 0; i < arguments.length; i++)
		{
			if(Object.isString(arguments[i]))
			{
				name = arguments[i];
			}
			else
			{
				hidden = arguments[i];
			}
		}
		
		if(!name)
		{
			name = document.body.down(".changeable").identify();
		}
	  
		var changeable = this.changeables.get(name);
		
		if(changeable)
		{
			if(hidden)
			{
				var hiddens = new Hash(hidden);
				
				var keys = hiddens.keys();
				
				for(var i = 0; i < keys.length; i++)
				{
					var value = hiddens.get(keys[i]);
					
					if(!value && value != 0)
					{
						value = "true";
					}
				
					var hiddenElement = $(keys[i]);
          
					if(hiddenElement)
					{
						hiddenElement.value = value;
					}
					else
					{
						changeable.form.insert({bottom: "<input type='hidden' name='" + keys[i] + "' value='" + value + "'>"});
					}
				}
			}

			if(changeable.update())
			{
				changeable.form.submit();
			
				return true;
			}
		}
		
		return false;
	},
	
	submitUpdate: function(inHidden)
	{
		this.submit(null, inHidden);
	},
	
	submitDestination: function(destination, inHidden)
	{
		var sourceElement = $('source');
	
		if(destination == null || destination.length == 0)
		{
			destination = sourceElement.value;
		}
	
		if(destination.substring(destination.length - 1) == "_")
		{
			if(sourceElement)
			{
				var sourceParts = sourceElement.value.split("_");
			
				for(var i = 2; i < sourceParts.length; i++)
				{
					if(!destination.endsWith("_"))
					{
						destination += "_";
					}
					
					destination += sourceParts[i];
				}
			}
		}

		$('destination').value = destination;			

		this.submit(sourceElement.form.identify(), inHidden);
	},

	maxLength: function(element, inMaxLength)
	{
		if(element.value.length > inMaxLength)
		{
			element.value = element.value.substring(0, inMaxLength);
		}
	},
  
	clearLeaveMessage: function()
	{
		this.setLeaveMessage();  
	},
  
	setLeaveMessage: function(inMessage)
	{
		this.leaveMessage = inMessage;
  
		window.onbeforeunload = this.leaveMessage ? Forms.leave.bind(this) : null;
	},
  
	leave: function()
	{
		return this.leaveMessage;
	}
};

Forms.initialize();

// ---------

var Changable = Class.create(
{
	initialize: function(inElement)
	{
		this.form = $(inElement);
		
		this.checked = false;

		this.changed = new Element("input", {type:"hidden", name:(this.form.identify() + "_changed")});

		this.form.insert({bottom: this.changed});
		
		this.form.updateChanges = this.updateChanges.bind(this);
		
		this.form.resetChanges = this.resetChanges.bind(this);
		
		var elements = this.form.getElements();

		for(var i = 0; i < elements.length; i++)
		{
			if(elements[i].name.length > 0)
			{
				if(elements[i].present)
				{
					elements[i].present = elements[i].present.wrap(function(proceed)
					{ 
						if(this.hasClassName("empty"))
						{ 
							return false;
						}
						else
						{ 
							return proceed(); 
						} 
					}); 
				}
				
				if(elements[i].tagName == "TEXTAREA")
				{
					new TextArea(elements[i]);
				}
				
		        var placeholder = elements[i].getAttribute("placeholder");
		        
		        if(placeholder && !Forms.supportsPlaceholder())
		        {
		        	new AutoLabel(elements[i], placeholder);
		        }
						
				var autofocus = elements[i].getAttribute("autofocus");
				
				if(autofocus && !Forms.supportsAutofocus())
				{
					Forms.setAutofocus(elements[i]);
				}
				
				var required = elements[i].getAttribute("require");
				
				if(required == "true")
				{
					new Required(elements[i]);
				}
			}
		}
		
		this.resetChanges();

		this.form.observe('submit', this.update.bindAsEventListener(this));	
		
		Forms.add(this);
	},
	
	resetChanges: function()
	{
		this.original = new Hash();

		var elements = this.form.getElements();

		for(var i = 0; i < elements.length; i++)
		{
			if(elements[i].name.length > 0)
			{
				if(elements[i].hasClassName("empty"))
				{
					this.original.set(elements[i].name, "");
				}
				else
				{
					this.original.set(elements[i].name, elements[i].value);
				}
			}
		}
	},
	
	updateChanges: function()
	{
		var changedFields = [];
	    
		var elements = this.form.getElements();

		for(var i = 0; i < elements.length; i++)
		{
			if(elements[i].name.length > 0)
			{
				if(elements[i].type == 'select-one' || elements[i].type == 'select-multiple')
				{
					for(var j = 0; j < elements[i].options.length; j++)
					{
						if((elements[i].options[j].selected && !elements[i].options[j].defaultSelected) || (!elements[i].options[j].selected &&  elements[i].options[j].defaultSelected))
						{
							changedFields.push(elements[i].name);
			
							break;
						}
					}
				}
				else if(elements[i].type == 'checkbox' || elements[i].type == 'radio')
				{
					if((elements[i].checked && !elements[i].defaultChecked) || (!elements[i].checked &&  elements[i].defaultChecked))
					{
						changedFields.push(elements[i].name);
					}
				}
				else 
				{
					if(elements[i].hasClassName("empty"))
					{
						elements[i].value = "";
					}
					
					if(elements[i].value != this.original.get(elements[i].name))
					{
						changedFields.push(elements[i].name);
					}
				}
			}
		}

		if(changedFields.length > 0)
		{
			this.changed.value = changedFields.join(",");
		}
	},

	update: function(event)
	{
		if(this.checked)
		{
			if(event)
			{
				Event.stop(event);
			}
			
			return false;
		}

		for(var i = 0; i < Forms.callbacks.length; i++)
		{
			try
			{
				if(Object.isFunction(Forms.callbacks[i]))
				{
					Forms.callbacks[i]();
				}
				else
				{
					eval(Forms.callbacks[i]);
				}
			}
			catch(e)
			{
				console.log(e);
				
				if(event)
				{
					Event.stop(event);
				}
				
				return false;
			}
		}

		this.updateChanges();
    
		Forms.setLeaveMessage();
		
		this.checked = true;
		
		return true;
	}
});

var AutoLabel = Class.create(
{
	initialize: function(element, label)
	{
		this.element = $(element);
		this.label	= label;
		this.element.observe('blur',	this.blur.bindAsEventListener(this));
		this.element.observe('focus',	this.focus.bindAsEventListener(this));
		this.update(false);
	},
	
	blur: function(event)
	{
		this.update(false);
	},
	
	focus: function(event)
	{
		this.update(true);
	},
	
	update: function(focused)
	{
		if(this.element)
		{
			if(focused)
			{
				if(this.element.hasClassName("empty"))
				{
					if(this.element.value == this.label)
					{
						this.element.value = "";
					}
					
					this.element.removeClassName("empty");
					
					this.element.style.color = "";
				}
			}
			else
			{
				if(this.element.value.length == 0)
				{
					this.element.value = this.label;
					
					this.element.addClassName("empty");
				}
			}
		}
	}
});

var AutoEdit = Class.create(
{
	initialize: function(element)
	{
    	this.element = $(element);
    	this.container = this.element.up(".textfieldborder") || this.element;
		this.element.observe('blur',	this.blur.bindAsEventListener(this));
		this.element.observe('focus', this.focus.bindAsEventListener(this));
		this.update(false);
	},
	
	blur: function(event)
	{
		this.update(false);
	},
	
	focus: function(event)
	{
		this.update(true);
	},
	
	update: function(focused)
	{
		if(this.container)
		{
			if(focused)
			{
				this.container.removeClassName('autoedit');
			}
			else
			{
				this.container.addClassName('autoedit');
			}
		}
	}
});

var TextArea = Class.create(
{
	initialize: function(element)
	{
    	this.element = $(element);
		this.element.observe('scroll',	this.update.bindAsEventListener(this));
		this.element.scrollLeft = parseInt(this.element.getAttribute("scrollleft"), 0);
		this.element.scrollTop = parseInt(this.element.getAttribute("scrolltop"), 0);
		
		this.scrollElement = new Element("input", {type:"hidden", name:"scroll_" + this.element.identify()});
		
		var parent = this.element.up("form");
		
		if(!parent)
		{
			parent = document.body;
		}
		
		parent.insert({bottom: this.scrollElement});
		
		this.update();
	},
	
	update: function()
	{
		this.scrollElement.value = this.element.scrollLeft + "," + this.element.scrollTop;
	}
});

var Required = Class.create(
{
	initialize: function(element)
	{
    	this.element = $(element);
		this.element.observe('keyup',	this.update.bindAsEventListener(this));
		this.update();
	},

	update: function(event)
	{
		if(this.element)
		{
			if(this.element.value.length == 0 || this.element.hasClassName("empty"))
			{
				this.element.addClassName('required');
			}
			else
			{
				this.element.removeClassName('required');
			}
		}
	}
});

var Submit = Class.create(
{
	initialize: function(element, options)
	{
		this.element = $(element);
	
		this.options = {
			action: null,
			selectClass: 'quick',
			errorClass: 'error',
			parameters: {},
			onComplete: null,
			onError: null
		};
	
		Object.extend(this.options, options || {});
		
		this.requests = [];
		
		var elements = this.element.select("." + this.options.selectClass);
		
		for(var i = 0; i < elements.length; i++)
		{
			elements[i].observe("change", this.change.bindAsEventListener(this));
		}
	},
	
	change: function(inEvent)
	{
		var element = inEvent.element();
		
		var parameters = {};
		
		if(element.type == "checkbox")
		{
			parameters[element.name] = element.checked ? element.value : "";
		}
		else
		{
			parameters[element.name] = element.value;
		}
		
		Object.extend(parameters, this.options.parameters || {});
		
		var request = new Ajax.Request(this.options.action,
		{
			parameters: parameters, 
			
			onComplete: function(response)
			{
				if(response.status == 200)
				{
					this.complete(response);
				}
				else
				{
					this.error(response.request);
				}
			}.bind(this),

			onException: function(request, exception) { this.error(request); }.bind(this)
		});
		
		this.requests.push({request:request, element:element});
	},
	
	complete: function(response)
	{
		var element = this.getElement(response.request);
		
		if(this.options.onComplete)
		{
			if(!this.options.onComplete(element))
			{
				return;
			}
		}
	
		if(element)
		{
			element.removeClassName(this.options.errorClass);
		}
	},
	
	error: function(request)
	{
		var element = this.getElement(request);
		
		if(this.options.onError)
		{
			if(!this.options.onError(element))
			{
				return;
			}
		}
		
		if(element)
		{
			element.addClassName(this.options.errorClass);
		}
	},
	
	getElement: function(request)
	{
		var element = null;
	
		for(var i = 0; i < this.requests.length; i++)
		{
			if(this.requests[i] && request == this.requests[i].request)
			{
				element = this.requests[i].element;

				this.requests[i] = null;
				
				break;
			}
		}
	
		this.requests.compact();
		
		return element;
	}
});

var Navigator = Class.create(
{
	initialize: function(element, options)
	{
		this.element = $(element);
	
		this.options = {
			frequency: 250,
			defaultHash: null,
			onChange: null,
			onUpdate: null,
			basePath: null
		};
	
		Object.extend(this.options, options || {});
		
		window.setInterval(this.check.bind(this), this.options.frequency);
	},
	
	check: function()
	{
		if(!this.options.basePath || this.options.basePath == document.location.pathname)
		{
			if(this.currentHash != document.location.hash)
			{
				this.currentHash = document.location.hash;
				
				if(!this.currentHash)
				{
					this.currentHash = this.options.defaultHash;
					
					document.location.hash = this.options.defaultHash;
				}
				
				if(this.options.onChange)
				{
					this.options.onChange(this.currentHash, this);
				}
				
				if(this.options.updateURL)
				{
					this.request();
				}
			}
		}
	},
	
	request: function()
	{
		var parameters = new Hash();
		
		if(this.element)
		{
			var form = this.element.up('form');
		
			if(form)
			{
				parameters = new Hash(form.serialize(true));
			}
		}
		
		if(this.currentHash.startsWith('#'))
		{
			parameters.set("hash", this.currentHash.substring(1));
		}
		else
		{
			parameters.set("hash", this.currentHash);
		}

		new Ajax.Request(this.options.updateURL,
		{
			parameters: parameters,
			
			onComplete: function(response)
			{
				if(response.status == 200)
				{
					this.update(response);
				}
			}.bind(this)
		});
	},
	
	update: function(response)
	{
		if(this.element)
		{
			this.element.update(response.responseText);
			
			document.fire("behavior:resize");
		}
		
		if(this.options.onUpdate)
		{
			this.options.onUpdate(this.currentHash, this);
		}
	}
});
