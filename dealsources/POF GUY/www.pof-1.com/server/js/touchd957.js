Event.observe(document, 'dom:loaded', function()
{
	$$('.scroll').each(function (el)
	{
		new Wheel(el);
	});
});

var Wheel = Class.create(
{
	initialize: function(inElement)
	{
		this.element = $(inElement);
		
		if(!this.element)
		{
			return;
		}
	
		this.options = {
			decay: 1500,
			friction: 2
		};

		this.element.observe('touchstart', this.touchstart.bindAsEventListener(this));
		document.observe('touchmove', this.touchmove.bindAsEventListener(this));
		document.observe('touchend', this.touchend.bindAsEventListener(this));
		
		this.active = false;
	},
	
	reset: function(inEvent)
	{
		this.startScroll = this.element.scrollTop;
		this.time = [];
		this.x = [];
		this.y = [];

		this.time.push(new Date());
		this.x.push(inEvent.touches[0].screenX);
		this.y.push(inEvent.touches[0].screenY);
	},
	
	touchstart: function(inEvent)
	{
		this.active = true;
		
		this.reset(inEvent);

		if(this.decaying)
		{
			window.clearInterval(this.decaying);
			this.decaying = null;
		}
	},
	
	touchmove: function(inEvent)
	{
		if(this.active)
		{
			Event.stop(inEvent);
			
			this.x.push(inEvent.touches[0].screenX);
			this.y.push(inEvent.touches[0].screenY);
			this.time.push(new Date());
			
			this.element.scrollTop = this.startScroll - (this.y[this.y.length - 1] - this.y[0]);
			
			if((this.element.scrollTop >= (this.element.scrollHeight - this.element.getHeight())) || this.element.scrollTop == 0)
			{
				this.reset(inEvent);
			}
		}
	},
	
	touchend: function(inEvent)
	{
		if(this.active)
		{
			this.active = false;
			
			var length = this.time.length - 1;
			var i = length;
			var delta = 0;
			var velocity = 0;
			
			for(; i >= 0; i--)
			{
				delta = this.time[length] - this.time[i];
				
				if(delta > 200 || i == 0)
				{
					break;
				}
			}
			
			if(delta > 0)
			{
				velocity = (this.y[length] - this.y[i]) / delta;
				
				this.a				= (velocity / this.options.friction) / this.options.decay;
				this.c				= -this.a * Math.pow(this.options.decay, 2);
				this.startScroll	= this.element.scrollTop;
				this.startTime		= new Date();
				this.decaying		= window.setInterval(this.decay.bind(this), 0.2);
			}
		}
	},
	
	decay: function()
	{
		var delta = new Date() - this.startTime;
	
		if(delta > this.options.decay)
		{
			window.clearInterval(this.decaying);
			this.decaying = null;
			return;
		}
		
		var d = this.a * Math.pow(delta - this.options.decay, 2) + this.c;
		
		this.element.scrollTop = d + this.startScroll;
	}
});
