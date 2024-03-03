/**	 
* @date:28-01-2017
* @filename:user_controller.js
* @created 28-01-2017 3:28:50 PM
*/
(function(){
    angular
    .module('users',['FBAngular'])
    .controller('UserController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate',
        UserController
    ]);
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function UserController( $mdSidenav, $mdBottomSheet, $log, $q, $scope, $element, Fullscreen, $mdToast, $animate, $translate, dialogs) {
        $scope.toastPosition = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
        $scope.toggleSidenav = function(ev) {
            $mdSidenav('right').toggle();
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };
        $scope.showActionToast = function() {     
            var toast = $mdToast.simple()
            .content(help_array[0])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(help_array[1])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
          
            var toast2 = $mdToast.simple()
            .content(help_array[2])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(help_array[3])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition()); 
			
			var toast4 = $mdToast.simple()
            .content(help_array[4])
            .action(help_array[6])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());	
			
			var toast5 = $mdToast.simple()
            .content(help_array[5])
            .action(help_array[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
       
			/**for displaying help in the template*/
			$mdToast.show(toast).then(function() {
				$mdToast.show(toast1).then(function() {
					$mdToast.show(toast2).then(function() {
						$mdToast.show(toast3).then(function() {
							$mdToast.show(toast4).then(function() {
								$mdToast.show(toast5).then(function() {
					});
					});
					});
				});
			});
		});
	};
  
	var self = this;
	self.selected     = null;
	self.users        = [ ];
	self.toggleList   = toggleUsersList;

	$scope.showVariables = false; /** I hides the 'Variables' tab */
	$scope.isActive = true;
	$scope.isActive1 = true; 
	
	$scope.goFullscreen = function () {
		/** Full screen */
		if (Fullscreen.isEnabled())
			Fullscreen.cancel();
		else
			Fullscreen.all();
		/** Set Full screen to a specific element (bad practice) */
		/** Full screen.enable( document.getElementById('img') ) */
	};
	
	$scope.resetExperiment = function() {
	$mdToast.cancel();
	resetExperiment($scope);
	}

	$scope.toggle = function () {
		$scope.showValue=!$scope.showValue;
		$scope.isActive = !$scope.isActive;
	};  
	
	$scope.toggle1 = function () {
		$scope.showVariables=!$scope.showVariables;
		$scope.isActive1 = !$scope.isActive1;
	};
		   
	/** slider area of plate */
	$scope.changeResistance =  function() {
	/**find the resistance value from the rheostat key*/
	resistance = $scope.rheo_val=$scope.reseistanceVal;
	getResistance($scope);
	}
	
	/** Function for the dropdown list */
	$scope.changeLED = function() {	
	/**change the LED using the dropdown. Depend on the LED wavelength may vary.
	Resistance will taken from the rheostat.Set initial current voltage and resistance as '0'.
	Set initial light visibility and x position of the rheostat key*/		
		wavelength = $scope.led_array[$scope.LEDModel].wavelength;
		red = $scope.led_array[$scope.LEDModel].red;
		green = $scope.led_array[$scope.LEDModel].green;
		blue = $scope.led_array[$scope.LEDModel].blue;
		intensity = $scope.led_array[$scope.LEDModel].intensity;
		resistance = $scope.rheo_val=$scope.reseistanceVal = initial_voltage_reseistance;
		$scope.wavelength = wavelength;
		voltage_reading = ammeter_reading = changing_resistance = initial_voltage_reseistance;			
		glow_light = false;
		getChild("rheoKey").x = initial_rheo_key;
		/**Calculate the values and change the wavelength of the 
		LED based on the rheostst value*/
		changeWavelength($scope);	
		calculation($scope);		
	}
		
	/** Function for toggle the button */
	$scope.switchon = function() {	
	/**insert and remove key based on the display on the button (Insert key/ Remove key)*/
		($scope.switchon_txt!=switchoff_var) ? insertKey($scope) : removeKey($scope);		
	}
	/** Change event function of the check box Show result */
		$scope.showResult = function() {
			$scope.show_result=!$scope.show_result;/**display/hide result*/			
			plancks_stage.update();
	}	
	/**
	* First hide the bottom sheet IF visible, then
	* hide or Show the 'left' sideNav area
	*/
	function toggleUsersList() {
		$mdSidenav('right').toggle();
	}
}
})();