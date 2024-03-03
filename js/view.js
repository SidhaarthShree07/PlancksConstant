/**	 
* @date:28-01-2017
* @filename:view.js
* @created 28-01-2017 3:28:50 PM
*/
(function() {
    angular
        .module('users')
        .directive("experiment", directiveFunction)
})();

var plancks_stage, exp_canvas,MAX_RHEOSTAT_X, alpha_limit; 

var start_flag, switchon_var, red, green, blue, resistance, intensity, initial_voltage_reseistance;
/** Arrays declarations */
var work_function_array = circle_x_array = circle_y_array = wire_array = circle_array = [];

var ammter_label, voltmeter_label, line, line_flag, wire_numbers, glow_light, initial_rheo_key;

var voltage_reading, ammeter_reading, knee_volt, wavelength, battery_volt, changing_resistance;

/** Createjs shapes declarations */

function directiveFunction() {
    return {
        restrict: "A",
        link: function(scope, element, attrs, dialogs) {
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if (element[0].width > element[0].height) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }
            if (element[0].offsetWidth > element[0].offsetHeight) {
                element[0].offsetWidth = element[0].offsetHeight;
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }
			
            exp_canvas = document.getElementById("demoCanvas");
            exp_canvas.width = element[0].width;
            exp_canvas.height = element[0].height;

            /** Initialisation of stage */
            plancks_stage = new createjs.Stage("demoCanvas");
			queue = new createjs.LoadQueue(true);       
			/** Preloading the images */
			queue.loadManifest([{
				id: "background",
				src: "images/background.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "light",
				src: "images/light.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "light_under",
				src: "images/light_under.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "rheostat",
				src: "images/rheostat.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "battery",
				src: "images/battery.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "key_to_rheostat",
				src: "images/key_to_rheostat.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "battery_to_key",
				src: "images/battery_to_key.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "battery_to_rheostat",
				src: "images/battery_to_rheostat.svg",
				type: createjs.LoadQueue.IMAGE
			 }, 
			{
				 id: "battery_to_bulb",
				 src: "images/battery_to_bulb.svg",
				 type: createjs.LoadQueue.IMAGE
		 },
		 {
				 id: "bulb_to_voltmeter",
				src: "images/bulb_to_voltmeter.svg",
				 type: createjs.LoadQueue.IMAGE
			 },
			{
				 id: "rheostat_to_ammeter",
				 src: "images/rheostat_to_ammeter.svg",
				 type: createjs.LoadQueue.IMAGE
			 }, 
			{
				 id: "black_bulb_to_voltmeter",
				 src: "images/black_bulb_to_voltmeter.svg",
				 type: createjs.LoadQueue.IMAGE
			 },
			{
				id: "rheoKey",
				src: "images/rheostat_top_move.svg",
				type: createjs.LoadQueue.IMAGE
			 },
			{
				 id: "transistor_to_ammeter",
				 src: "images/transistor_to_ammeter.svg",
				 type: createjs.LoadQueue.IMAGE
			 },
			{
				 id: "transistor_to_bulb",
				 src: "images/transistor_to_bulb.svg",
				 type: createjs.LoadQueue.IMAGE
			},
			{
				 id: "insert_key",
				 src: "images/insert_key.svg",
				 type: createjs.LoadQueue.IMAGE
			 }, {
				id: "signal_arrow",
				src: "images/signal_arrow.svg",
				type: createjs.LoadQueue.IMAGE
			},
			{
				 id: "key_top_cover",
				 src: "images/key_top_cover.svg",
				 type: createjs.LoadQueue.IMAGE
			 }
			]);
            queue.installPlugin(createjs.Sound);            
            queue.on("complete", handleComplete, this);            
            loadingProgress(queue,plancks_stage,exp_canvas.width);            
            plancks_stage.enableDOMEvents(true);
            plancks_stage.enableMouseOver();
            createjs.Touch.enable(plancks_stage);
      		line = new createjs.Shape(); /** Line is created for connect the wires */
            function handleComplete() { 
                /** Loading images, text and containers */				
				loadImages(queue.getResult("background"), "background", 0, 0); 	
				loadImages(queue.getResult("rheostat"), "rheostat", 0, 0); 	
				loadImages(queue.getResult("rheoKey"), "rheoKey",385, 225); 	
				loadImages(queue.getResult("battery"), "battery",0, 0); 				
				loadImages(queue.getResult("light_under"), "light_under",279, 406); 
				loadImages(queue.getResult("light"), "light",280, 405); 
				loadImages(queue.getResult("insert_key"), "insert_key",251, 325); 
				loadImages(queue.getResult("key_top_cover"), "key_top_cover",221, 346); 			
				loadImages(queue.getResult("battery_to_key"), "battery_to_key", 0, 16);
				loadImages(queue.getResult("key_to_rheostat"), "key_to_rheostat", 0, 16);
				loadImages(queue.getResult("battery_to_rheostat"), "battery_to_rheostat", 0, 16);
				loadImages(queue.getResult("battery_to_bulb"), "battery_to_bulb", 0, 16);
				loadImages(queue.getResult("bulb_to_voltmeter"), "bulb_to_voltmeter", 0, 0);
				loadImages(queue.getResult("rheostat_to_ammeter"),"rheostat_to_ammeter", 0, 16);
				loadImages(queue.getResult("black_bulb_to_voltmeter"), "black_bulb_to_voltmeter", 0, 0);
				loadImages(queue.getResult("transistor_to_ammeter"), "transistor_to_ammeter", 0, 16);
				loadImages(queue.getResult("transistor_to_bulb"), "transistor_to_bulb", 0, 0);
				loadImages(queue.getResult("signal_arrow"), "signal_arrow", 300, 200);
				setText("ammeter_display", 520, 535, "", "black", 2.4,"digiface");
				setText("voltage_display", 100, 535, "", "black", 2.4,"digiface");
				setText("volt_display", 190, 545, "", "black", 1,"alphabetic");
				setText("mA_display", 605, 545, "", "black", 1,"alphabetic");			
                initialisationOfVariables(scope); 
                /** Function call for images used in the apparatus visibility */
                initialisationOfImages(scope);
                /** Function call for the initial value of the controls */
                initialisationOfControls(scope);
                /** Translation of strings using gettext */
                translationLabels();			
				scope.$apply();					
				plancks_stage.update();	
			}

            /** Add all the strings used for the language translation here. '_' is the short cut for 
            calling the gettext function defined in the gettext-definition.js */
            function translationLabels() { 
                /** This help array shows the hints for this experiment */
                help_array = [_("help1"), _("help2"), _("help3"), _("help4"),_("help5"),_("help6"),_("Next"), _("Close")];
                scope.heading = _("Determination of Planck's Constant");
                scope.variables = _("Variables");
                scope.result = _("Result");
				scope.copyright = _("copyright");
				scope.choose_material_list = _("Choose LED:");
				scope.rheoText = _("Rheostat value");
				scope.nm = _("nm");
				scope.Planckonstant = _("Planck's Constant");
				scope.wave_length_LED = _("Wavelength of the LED")
				scope.show_result_label = _("Show Result")
				scope.switchon_txt = switchon_var = _("Insert Key");
				switchoff_var = _("Remove key");				
				scope.reset_txt = _("Reset");		
                scope.led_array = [{				
                    led: _('Red LED (650 nm)'),
                    wavelength: 650,
                    index: 0,
					red:255,
					blue:0,
					green:0	,
					intensity:1					
                }, {
                    led: _('Green LED (510 nm)'),
                    wavelength: 510,
                    index: 1,
					red : 0,
					green : 255,
					blue : 0,
					intensity:1					
                }, {
                    led: _('Yellow LED (570 nm)'),
                    wavelength: 570,
                    index: 2,
					red:255,
					blue:0,
					green:255,
					intensity:1		
                }, {
                    led: _('Blue LED'),
                    wavelength: 475,
					 index: 3,
                   	red:0,
					blue:255,
					green:0,
					intensity:1
                },{
                    led: _('Infrared LED'),
					wavelength: 1110,
					index: 4,
					red:255,
					blue:255,
					green:255,
					intensity:0
                }];						
				plancks_stage.update();
            }			   
        }
    }
	plancks_stage.update();
}

/** All the texts loading and added to the natural_convection_stage */
function setText(name, textX, textY, value, color, fontSize,font) {
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
	_text.font = fontSize+"em "+font;
    _text.name = name;
    _text.text = value;
    _text.color = color;
    plancks_stage.addChild(_text); /** Adding text to the container */
}

/** All the images loading and added to the natural_convection_stage */
function loadImages(image, name, xPos, yPos) {
    var _bitmap = new createjs.Bitmap(image).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.name = name;
    _bitmap.cursor = "";
    plancks_stage.addChild(_bitmap); /** Adding bitmap to the container */
}

/** Function to return child element of stage */
function getChild(child_name) {
	return plancks_stage.getChildByName(child_name); /** Returns the child element of stage */
} 

/** All variables initialising in this function */
function initialisationOfVariables(scope) {
	/** initialize all the controls and variables for setting up the simulator
	set all the flags, initial voltage and current	*/	
	getChild("volt_display").text = getChild("mA_display").text = "";	
	start_flag = line_flag = glow_light = false;	
	wire_numbers = resistance = alpha_limit = changing_resistance = voltage = green = blue = initial_voltage_reseistance = 0;	
	wavelength = 650;
	red = 255;
	MAX_RHEOSTAT_X =552;	
	voltage_reading = battery_volt = 4.5;
	ammeter_reading = 3.75;	
	ammter_label = voltmeter_label = "";
	initial_rheo_key = getChild("rheoKey").x = 385;
	intensity = 1;	
	scope.wavelength = wavelength;
	/**name of the wires using in the simulator*/
	wire_array=["black_bulb_to_voltmeter","black_bulb_to_voltmeter", "bulb_to_voltmeter", "bulb_to_voltmeter", "battery_to_bulb","battery_to_bulb", "rheostat_to_ammeter", "rheostat_to_ammeter", "battery_to_rheostat", "battery_to_rheostat","battery_to_key", "battery_to_key","key_to_rheostat","key_to_rheostat", "transistor_to_ammeter","transistor_to_ammeter","transistor_to_bulb", "transistor_to_bulb"];
	/**circle at the endpoint of the device, where connection should be established*/
	circle_array=["voltmeter_circle1","bulb_circle1","voltmeter_circle2","bulb_circle2","battery_circle1","bulb_circle3","ammeter_circle2","rheo_circle3","battery_circle2","rheo_circle2","battery_circle3","key_circle1","rheo_circle1","key_circle2","transistor_circle2","ammeter_circle1","transistor_circle1","bulb_circle4"];
	/**x and y position of the circle*/
	circle_x_array = [85,295,180,305,70,295,630,660,80,590,155,240,395,282,465,520,370,305];
	circle_y_array = [570,455,570,455,210,445,570,250,210,340,210,340,340,340,408,570,408,448];
	circleDeclaration(); /** Circle declaration for connect the wires is created*/
	createCircleForConnection(scope); /** Ready for wire connection */	
	/**calculate the initial voltage, current and knee voltage using the initial values*/
	changeWavelength(scope);
}
/** Initialisation of all controls */
function initialisationOfControls(scope) {
	/**initialize all the controls used in the simulator*/	
	scope.controls_disable_key= true;
	scope.disable_rheo = true;
	scope.show_result = false;
	scope.showValue = false;
	scope.switchon_txt = switchon_var;	
	scope.LEDModel = scope.rheo_val = scope.reseistanceVal = 0;
	scope.wavelengthoflight = scope.wavelength_light = 100;		
}

/** Set the initial status of the images and text depends on its visibility and initial values */
initialisationOfImages = function(scope) {
/** set all the wires and light image hidden at the initial stage*/
	getChild("black_bulb_to_voltmeter").visible = false;
	getChild("bulb_to_voltmeter").visible = false;
	getChild("battery_to_bulb").visible = false;
	getChild("rheostat_to_ammeter").visible = false;
	getChild("battery_to_rheostat").visible = false;
	getChild("battery_to_key").visible = false;
	getChild("key_to_rheostat").visible = false;
	getChild("transistor_to_ammeter").visible = false;
	getChild("transistor_to_bulb").visible = false;
	getChild("insert_key").visible = false;
	getChild("key_top_cover").visible = false;	
	getChild("signal_arrow").visible=false;
	lightDisplay(false);	
	getChild("light").alpha=0;
	getChild("light_under").alpha=0.8;
}

/** Reset the experiment in the reset button event */
resetExperiment = function(scope) {
	for(var i=0;i<18;i++){//dynamic object creation
		plancks_stage.removeChild(getChild(circle_array[i]))
	} 
	initialisationOfVariables(scope);
	initialisationOfControls(scope);
	initialisationOfImages(scope);
	calculation(scope);		
	scope.resultValue = false;
	plancks_stage.update();
}

/**declare  2 shapes at the end of each wires for the connection with the devices */
circleDeclaration = function() {
/**declare 2 circles for the connection of 9 wires, one at each end. */
	for(var i=0;i<18;i++){//dynamic object creation
		this[circle_array[i]] = new createjs.Shape();
		this[circle_array[i]].mouseEnabled  = true;
	} 
	plancks_stage.update();
}

/** Create circle functions */
createCircleForConnection = function(scope) {
/**create 18 circles, 2 for each wires on its most ends. 4 wires are of red in color and remaining black*/
	var _color;
	for(var i=0;i<18;i++){
		(i==2||i==3||i==6||i==7||i==10||i==11||i==12||i==13)?(_color="red"):_color="black";
		/**draw circles with circle name, color, radius and x, y position*/
		drawShapeArc(this[circle_array[i]],circle_array[i], circle_x_array[i], circle_y_array[i], _color, 15, scope);//voltmeter black
	}
	plancks_stage.update();
}
/** Create circle shape here */
drawShapeArc = function(shapeName, name, xPos, yPos, color, radius, scope) {
	plancks_stage.addChild(shapeName);
	shapeName.name = name;
	shapeName.cursor = "pointer";
	shapeName.alpha =0.01;
	initialX = xPos;
	initialY = yPos;
	shapeName.graphics.setStrokeStyle(2);
	shapeName.graphics.beginFill(color).drawCircle(0, 0, radius);//circle  drawn
	shapeName.x = xPos;
	shapeName.y = yPos;
	/**drag the circle to its correponding circle for extablishing a connection*/ 
	shapeName.on("mousedown", function(evt) {
		this.parent.addChild(this);
		this.offset = {
			x: this.x - evt.stageX / plancks_stage.scaleX,
			y: this.y - evt.stageY / plancks_stage.scaleY
		};
	});
	shapeName.on("pressmove", function(evt) {
		this.x = (evt.stageX / plancks_stage.scaleX) + this.offset.x;
		this.y = (evt.stageY / plancks_stage.scaleY) + this.offset.y;
		shapeName.x = this.x;
		shapeName.y = this.y;
		line.graphics.clear();
		if (line_flag == false) {
		/**when we move from one circle to another a line will draw to the appropriate device 
		which shows a connection */
			line.graphics.moveTo(xPos, yPos).setStrokeStyle(3).beginStroke(color).lineTo(this.x, this.y);
			plancks_stage.addChild(line);
		}
		shapeName.on("pressup", function(evt) {
			line.graphics.clear();
			shapeName.x = xPos;
			shapeName.y = yPos;
			line.graphics.clear();
			/**increment the wire number for each successful connection*/
			if (line_flag) wire_numbers++;
			checkConnectionComplete(scope); /** Check the connection complete or not */
			line_flag = false; /** Set line flag as false */
		});
		/*the line will reset when  mouseup event triggers*/
		shapeName.on("mouseup", function(evt) {
			shapeName.alpha = 0.01;
			shapeName.x = xPos;
			shapeName.y = yPos;
			line.graphics.clear();			
			line_flag = false;			
		});		
		checkHitLead(name,shapeName.x,shapeName.y); /** Check hit occur in lead with wires */
	});
	plancks_stage.update();
 }

/** Lead hit with wires */
checkHitLead = function(name,xPos, yPos) {	
/**check the to and fro possible connection i.e A --> B and B --> A*/
	for(var i=0;i<18;i=i+2){/**forward connection*/
		switch (name){
		case circle_array[i] :checkHit(circle_array[i+1], wire_array[i], circle_array[i], xPos, yPos);
		break;
		}
		switch (name){/**backward connection*/
		case circle_array[i+1] :checkHit(circle_array[i], wire_array[i+1], circle_array[i+1], xPos, yPos);
		break;
		}
	}		
	plancks_stage.update();
}

/** Hit check function */
checkHit = function(spot, wire, name, xPos, yPos) {
	/** when the line hit on the correct connection, the corresponding wire will appears*/
	getChild("signal_arrow").visible=true;/** Shows the destination point */
	getChild("signal_arrow").x=this[spot].x+3;
	getChild("signal_arrow").y=this[spot].y-25;
	  var ptL =  this[spot].globalToLocal(xPos, yPos);
	   if ( this[spot].hitTest(ptL.x, ptL.y) ) {
		   line_flag = true;
		   line.graphics.clear();
		   plancks_stage.removeChild(line);
		   getChild(wire).visible = true;		 
		   getChild("signal_arrow").visible=false;
		   this[spot].mouseEnabled = this[name].mouseEnabled = false;			   
	   } 
	    else {			
		    releaseHit(spot,name); /** Spot invisible after sucessfull connection */
	    }
	plancks_stage.update();
}

/** Function for releasing the drag for hit */
releaseHit = function(spot, name) {
	this[name].on("pressup", function(evt) {	
		getChild("signal_arrow").visible=false;	/** Invisible the shape on release hit */		
	});
	plancks_stage.update();
}
/** Check the connection complete or not */
checkConnectionComplete = function(scope) {
/**Check whether all the 9 wires connected to the corresponding device ,
 so we can enable the 'insert key' button */
	if ( wire_numbers == 9 ) {
		scope.controls_disable_key=false; /** Enables all controls after the successdul connection*/
		scope.$apply();
	}
	plancks_stage.update();
}
insertKey = function(scope){
	/**invoke when click on the insert key button. Enable the rheostat key and 
	display the reading on ammter and voltmeter*/
	scope.switchon_txt=switchoff_var;
	getChild("insert_key").visible = getChild("key_top_cover").visible = true;	
	scope.disable_rheo	= false;
	start_flag = true;
	getChild("volt_display").text = "V";
	getChild("mA_display").text = "mA";	
	ammter_label = "0"+ammeter_reading.toFixed(3);
	voltmeter_label="0"+voltage_reading.toFixed(3);	
	/**calculate the voltage current and knee voltage when key is inserted*/
	calculation(scope);
	plancks_stage.update();
}
removeKey = function(scope){
/**when click on remove key function, it will remove all the controls, LED display remains off*/
	scope.switchon_txt=switchon_var	
	lightDisplay(false);	
	getChild("insert_key").visible = getChild("key_top_cover").visible = false;	
	scope.disable_rheo	= true;
	start_flag = false;
	/**It will clear the voltmeter and ammeter display*/
	ammter_label = voltmeter_label="";
	getChild("volt_display").text = getChild("volt_display").text = "";		
	meterDisplay();
	plancks_stage.update();
}

meterDisplay = function(){
/**display ammter and voltmeter display after insert the key*/
	getChild("ammeter_display").text=ammter_label;
	getChild("voltage_display").text=voltmeter_label;
}
lightDisplay = function(flag){
/**common function for display and hide the 'light' image*/
	getChild("light").visible = getChild("light_under").visible = flag;
}