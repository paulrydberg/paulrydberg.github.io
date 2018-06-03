var SCROLL_BAR_WIDTH = undefined;
var Table = Class.create(
{
	initialize: function(inElement, inOptions)
	{
		this.element = $(inElement);
		
		if(!this.element)
		{
			return;
		}
		
		if(SCROLL_BAR_WIDTH == undefined)
		{
			SCROLL_BAR_WIDTH = getScrollBarWidth();
		}
		
		this.options = {
			select: 'row',
			oddClass: 'odd',
			evenClass: 'even',
			alternate: false,
			columns: [],
			columnClass: 'col',
			groupClass: 'group'
		};
		
		Object.extend(this.options, inOptions);
		
		this.body = this.element.down('.body', 0);
		this.header = this.element.down('.header', 0);
		this.footer = this.element.down('.footer', 0);
		
		this.body.observe('scroll', this.scroll.bindAsEventListener(this));
		
		// ---------
		
		var groups = this.element.select('.' + this.options.groupClass);
		
		for(var i = 0; i < groups.length; i++)
		{
			groups[i].child = groups[i].next();
		}
		
		var columns = [];
		
		for(var i = 0; i < this.options.columns.length; i++)
		{
			columns[i] = {width: this.options.columns[i], elements: this.element.select('.' + this.options.columnClass + i)};
		}

		this.fixed = this.element.select('.fixed');
		
		// --------
		
		var tables = this.element.select('.flex');
		var rows = this.element.select('.grow');
		
		var firstRow = rows.first();
		var lastRow = rows.last();	
		
		if(this.body.hasClassName("scrollable"))
		{
			if(lastRow)
			{
				var borderWidth = lastRow.getStyle("border-top-width");
				var borderColor = lastRow.getStyle("border-top-color");
				var borderStyle = lastRow.getStyle("border-top-style");
	
				this.lastline = new Element("div").setStyle({height:"0px", borderTopWidth: borderWidth, borderTopColor: borderColor, borderTopStyle: borderStyle});
				this.body.insert({bottom: this.lastline});
				
				rows.push(this.lastline);
			}
		}
			
		if(firstRow)
		{
			firstRow.setStyle({borderTop:"0px"});
		}
		
		if(this.lastline || this.fixed.length > 0)
		{
			document.observe('behavior:resize', this.update.bindAsEventListener(this));
		}
		
		Table.CalculateDimensions(this.element, tables, columns, rows);
		
		this.element.setStyle({visibility:"visible"});
		
		this.update.bind(this).defer();
	},
	
	scroll: function(inEvent)
	{
		if(this.header)
		{
			this.header.scrollLeft = this.body.scrollLeft;
		}
		
		if(this.footer)
		{
			this.footer.scrollLeft = this.body.scrollLeft;
		}
	},
	
	update: function()
	{
		if(this.options.alternate)
		{
			var rows = this.element.select('.' + this.options.select);
	
			for(var i = 0; i < rows.length; i++)
			{
				if(i % 2 == 0)
				{
					rows[i].removeClassName(this.options.oddClass);
					rows[i].addClassName(this.options.evenClass);
				}
				else
				{
					rows[i].removeClassName(this.options.evenClass);
					rows[i].addClassName(this.options.oddClass);
				}
			}
		}
		
		try
		{
			var ancestors = this.body.ancestors();
			
			var hidden = false;
			
			for(var i = 0; i < ancestors.length; i++)
			{
				if("none" == ancestors[i].getStyle("display"))
				{
					hidden = true;
					break;
				}
			}
		
			var scrolling = !hidden && !(this.body.getHeight() >= this.body.scrollHeight);
	
			if(this.lastline)
			{
				this.lastline.setStyle({ visibility: scrolling ? "hidden" : "visible"});
			}
			
			for(var i = 0; i < this.fixed.length; i++)
			{
				this.fixed[i].setStyle({display:"none"});
				this.fixed[i].offsetHeight; // this forces a redraw of the element
				this.fixed[i].setStyle({display:"block", paddingRight: (scrolling ? (SCROLL_BAR_WIDTH + "px") : "0px")});
			}
		}
		catch(e)
		{
			console.log(e);
		}
	}
});

var Record = Class.create(
{
	initialize: function(inElement, inOptions)
	{
		this.element = $(inElement);
		
		if(!this.element)
		{
			return;
		}
		
		this.options = {
		};
		
		Object.extend(this.options, inOptions);
		
		var columns = [];
		
		columns[0] = {width: "1px",		elements: this.element.select(".fieldlabel.left")};
		columns[1] = {width: "inherit",	elements: this.element.select(".fieldvalue.left")};
		columns[2] = {width: "1px",		elements: this.element.select(".fieldlabel.right")};
		columns[3] = {width: "inherit",	elements: this.element.select(".fieldvalue.right")}
		
		var tables = this.element.select('.field > table');

		Table.CalculateDimensions(this.element, tables, columns);

		this.element.setStyle({visibility:"visible", position:"relative"});
	}
});

Table.CalculateDimensions = function(inElement, tables, columns, rows)
{
	for(var i = 0; i < tables.length; i++)
	{
		tables[i].setStyle({width:"1px"});
	}

	var hidden = [];

	for(var i = 0; i < columns.length; i++)
	{
		if(columns[i].elements.length == 0)
		{
			columns[i] = null;
			
			continue;
		}
	
		columns[i].widest = 0;

		for(var j = 0; j < columns[i].elements.length; j++)
		{
			if(j == 0)
			{
				var ancestors = columns[i].elements[j].ancestors();

				for(k = 0; k < ancestors.length; k++)
				{
						if(ancestors[k].getStyle("display") == "none")
						{
							hidden.push(ancestors[k]);
							
							ancestors[k].setStyle({display:""});
						}
				}
				
				columns[i].padding = columns[i].elements[j].measure("padding-left") + columns[i].elements[j].measure("padding-right");
			}

			var width = columns[i].elements[j].measure("border-box-width");
			
			if(width > columns[i].widest)
			{
				columns[i].widest = width;
			}
		}
	}
	
	for(var i = 0; i < hidden.length; i++)
	{
		hidden[i].setStyle({display:"none"});
	}
	
	columns = columns.compact();
	
	// ------

	var totalUnspecified = 0;
	var totalPercentageWidth = 0;
	var totalWidestWidth = 0;
	var lastUnspecified = -1;

	for(var i = 0; i < columns.length; i++)
	{
		var width = columns[i].width;
	
		if(width.endsWith("%"))
		{
			columns[i].widthPercentage = parseInt(width.substring(0, width.length - 1));

			totalPercentageWidth += columns[i].widthPercentage;
		}
		else if(width.endsWith("px"))
		{
			columns[i].widthPercentage = -1;
		}
		else
		{
			columns[i].widthPercentage = 0;

			totalUnspecified++;

			lastUnspecified = i;
			
			totalWidestWidth += columns[i].widest;
		}
	}

	if(totalPercentageWidth == 100)
	{
		for(var i = 0; i < columns.length; i++)
		{
			if(columns[i].widthPercentage == 0)
			{
				columns[i].widthPercentage = -1;
				columns[i].width = 0;
			}
		}
	}
	else if(totalPercentageWidth > 100)
	{
		totalPercentageWidth = 0;
		
		totalUnspecified = 0;
		
		lastUnspecified = -1;
		
		totalWidestWidth = 0;
		
		for(var i = 0; i < columns.length; i++)
		{
			if(columns[i].widthPercentage > 0)
			{
				columns[i].widthPercentage = 0;
				
				totalUnspecified++;

				lastUnspecified = i;
				
				totalWidestWidth += columns[i].widest;
			}
		}
	}

	if(totalUnspecified > 0)
	{
		var average = (100 - totalPercentageWidth) / totalUnspecified;
		
		for(var i = 0; i < columns.length; i++)
		{
			if(i == lastUnspecified)
			{
				columns[i].widthPercentage = 100;
			}
			else if(columns[i].widthPercentage == 0)
			{
				var weightedPercentage = average;
			
				columns[i].widthPercentage = weightedPercentage;
				
				totalPercentageWidth += weightedPercentage;
			}
		}
	}
	
	var rowWidth = 0;
	
	for(var i = 0; i < columns.length; i++)
	{
		if(columns[i].elements.length > 0)
		{
			var widest = (columns[i].widest - columns[i].padding);
			
			if(columns[i].width == "inherit")
			{
				columns[i].minWidth = widest + "px";
				columns[i].width = "";
			}
			else if(columns[i].widthPercentage > 0)
			{
				columns[i].width = columns[i].widthPercentage + "%";
				columns[i].minWidth = widest + "px";
			}
			else
			{
				var width = parseInt(columns[i].width);
	
				if(width < columns[i].widest)
				{
					columns[i].minWidth = widest + "px";
				}
				else
				{
					columns[i].minWidth = width + "px";
					
					widest = width;
				}
				
				columns[i].width = ""; 
			}
		}
		
		rowWidth += columns[i].padding + widest;
	}
	
	rowWidth += columns.length - 1;
	
	// --------
		
	for(var i = 0; i < columns.length; i++)
	{
		var styles = {minWidth: columns[i].minWidth, width: columns[i].width};
		
		var lastField = null;

		for(var j = 0; j < columns[i].elements.length; j++)
		{
			columns[i].elements[j].setStyle(styles);
		}
	}
	
	if(rows && rows.length > 0)
	{
		for(var i = 0; i < rows.length; i++)
		{
			var width = rowWidth - rows[i].measure("padding-left") - rows[i].measure("padding-right");
			
			rows[i].setStyle({minWidth: width + "px"});
		}
	}
	
	for(var i = 0; i < tables.length; i++)
	{
		tables[i].setStyle({width:""});
	}
};

function getScrollBarWidth () {  
    var inner = document.createElement('p');  
    inner.style.width = "100%";  
    inner.style.height = "200px";  
  
    var outer = document.createElement('div');  
    outer.style.position = "absolute";  
    outer.style.top = "0px";  
    outer.style.left = "0px";  
    outer.style.visibility = "hidden";  
    outer.style.width = "200px";  
    outer.style.height = "150px";  
    outer.style.overflow = "hidden";  
    outer.appendChild (inner);  
  
    document.body.appendChild (outer);  
    var w1 = inner.offsetWidth;  
    outer.style.overflow = 'scroll';  
    var w2 = inner.offsetWidth;  
    if (w1 == w2) w2 = outer.clientWidth;  
  
    document.body.removeChild (outer);  
  
    return (w1 - w2);  
};
