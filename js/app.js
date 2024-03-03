if(navigator.serviceWorker) {
	navigator
		.serviceWorker
		.register('js/Resistivity_by_Four_Probe_Method/service_worker_Resistivity_by_Four_Probe_Method.js')
		.then(function(r) {
			console.log('NW  App now available offline');
		})
		.catch(function(e) {
			console.log('NW App NOT available offline');
			console.log(e);
		});
} else {
	console.log('Service workers are not supported');
}
