/**	 
* @date:28-01-2017
* @filename:experiment.js
* @created 28-01-2017 3:28:50 PM
*/

/**calculation done here*/
calculation = function(scope){
	/**voltage V= reseistance X battery voltage in nm*/
	voltage_reading = resistance * battery_volt/1000;	
	/**Knee voltage can be calculated by Knee volt = 1.24 	x 10^-6/(? x 10^-9), where ? is the wavelength*/
	knee_volt = 1.24 *Math.pow(10,-6)/(wavelength * Math.pow(10,-9));	
	/**When the voltage less than the knee voltage, LED turn off 
	and the ammeter reading is approximately equal to '0'*/
	if(Number(voltage_reading)<knee_volt){		
		lightDisplay(false);
		ammeter_reading = 0;
		alpha_limit=0;
	}
/**	when knee voltage less than voltage the light start glow and will have 
maximum intensity at maximum voltage*/
	else{
		if(!glow_light){
			changing_resistance = resistance;
			glow_light = true;
		}		
		lightDisplay(true);//light display
		/**Ammeter reading= voltage/1200 x 1000 */
		ammeter_reading = voltage_reading / 1200 * 1000;
		/**Adjusting the intensity of the LED light depend upon the resistance from the slider*/
		alpha_limit=(resistance-changing_resistance)/(1000-changing_resistance);
	}
	if(start_flag){
		ammter_label = "0"+ammeter_reading.toFixed(3);//round with 0 prefix and 3 decimal points
		voltmeter_label="0"+voltage_reading.toFixed(3);			
	}
	getChild("light").alpha=alpha_limit;	
	/**display the voltmeter and ammeter values on the meters*/
	meterDisplay();
	plancks_stage.update();
}

/**the color of the image change depend on the wavelength of the light.
The color may vary from Violet to red  */
function changeWavelength(scope) {
	/**set the R, G, B and alpha value of the light using the slider depend upon 
	the wavlength of the LED selected*/
	var filter = new createjs.ColorFilter(0, 0, 0, intensity, red, green, blue, 0); /** ColorFilter is used for colour transformation */
	getChild("light").filters = [filter];
	getChild("light").cache(0, 0, getChild("light").getBounds().width, getChild("light").getBounds().height);
	getChild("light_under").filters = [filter];
	getChild("light_under").cache(0, 0, getChild("light_under").getBounds().width, getChild("light_under").getBounds().height);
	/**calculate the values based on the wavelength*/
	calculation(scope);
	plancks_stage.update();
}

getResistance = function(scope){
	/**move the rheostat key from the initial point to the other end base on the reseistanced. 
	It will depend on the resistance slider*/
	/**formulate an equation based on the slider value and x position of the rheostat key*/
	var _rheo_key_pos = MAX_RHEOSTAT_X-((1000-resistance)/12)*2; /**where MAX_RHEOSTAT_X is the maximum X value of the key,
	1000 is the maximum resistance, and set it as the x position of rheostat key*/	
	getChild("rheoKey").x = _rheo_key_pos;
	calculation(scope);
	plancks_stage.update();
}