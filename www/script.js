// Frontend для ИАЦ МЧС России:

function mymapInit(r_map) {
	mymap = r_map;
}

function mapCentering(e) {
	mymap.setView([66, 100], 3);
}

function comparator(arr) {
    return function(a, b) {
		return ((arr[a] < arr[b]) ? -1 : ((arr[a] > arr[b]) ? 1 : 0));
    }
}

function getData(lat, lon) {
	var idxFiltr = idx.filter(function(id) { return (data["latitude"][id] === lat) && (data["longitude"][id] === lon); });
	idxFiltr = idxFiltr.sort(comparator(data["taken_date"])).reverse();
	
	var records = [
		{latitude : null,
		longitude : null,
		taken_date : "",
		t2m : null,
		d2m : null,
		tp : null},
		{latitude : null,
		longitude : null,
		taken_date : "",
		t2m : null,
		d2m : null,
		tp : null},
		{latitude : null,
		longitude : null,
		taken_date : "",
		t2m : null,
		d2m : null,
		tp : null},
		{latitude : null,
		longitude : null,
		taken_date : "",
		t2m : null,
		d2m : null,
		tp : null},
		{latitude : null,
		longitude : null,
		taken_date : "",
		t2m : null,
		d2m : null,
		tp : null},
		{latitude : null,
		longitude : null,
		taken_date : "",
		t2m : null,
		d2m : null,
		tp : null},
		{latitude : null,
		longitude : null,
		taken_date : "",
		t2m : null,
		d2m : null,
		tp : null}
	];
	for (var i = 0; i < idxFiltr.length; i++) {
		records[i]["latitude"] = data["latitude"][idxFiltr[i]];
		records[i]["longitude"] = data["longitude"][idxFiltr[i]];
		records[i]["taken_date"] = data["taken_date"][idxFiltr[i]];
		records[i]["t2m"] = data["t2m"][idxFiltr[i]];
		records[i]["d2m"] = data["d2m"][idxFiltr[i]];
		records[i]["tp"] = data["tp"][idxFiltr[i]];
	}
	
	var JSONdata = JSON.stringify(records);
	localStorage.setItem("data", JSONdata);
}	

Shiny.addCustomMessageHandler("eData", function(msg) {
	var recordsNum = msg.data["latitude"].length; 
	
	idx = [];
	for (var i = 0; i < recordsNum; i++) {
    	idx.push(i);
	}
	idx = idx.sort(comparator(msg.data["taken_date"])).reverse();
	
	data = {
		latitude : [],
		longitude : [],
		taken_date : [],
		t2m : [],
		d2m : [],
		tp : []
	}
	for (var i = 0; i < recordsNum; i++) {
    	data["latitude"][i] = msg.data["latitude"][idx[i]];
		data["longitude"][i] = msg.data["longitude"][idx[i]];
		data["taken_date"][i] = msg.data["taken_date"][idx[i]];
		data["t2m"][i] = msg.data["t2m"][idx[i]];
		data["d2m"][i] = msg.data["d2m"][idx[i]];
		data["tp"][i] = msg.data["tp"][idx[i]];
	}
	
	layerGroup = L.layerGroup();
	for (var i = 0; i < recordsNum; i++) {
		if (data["taken_date"][i] === data["taken_date"][0]) {
			var marker = L.circleMarker([data["latitude"][i], data["longitude"][i]], {
				radius: 6, 
				color: '#000000', 
				weight: 1, 
				fillColor: '#3388ff', 
				fillOpacity: 1
			}).addTo(layerGroup).bindPopup("lat: " + data["latitude"][i] + 
										   "<br>lon: " + data["longitude"][i] + 
										   "<br>t2m: " + data["t2m"][i] + 
										   "<br>d2m: " + data["d2m"][i] + 
										   "<br>tp: " + data["tp"][i] + 
										   "<br><a href='infographics/index.html' target='_blank' onclick='getData(" + data["latitude"][i] + ", " + data["longitude"][i] + ")'>Инфографика</a>"
										  );
			marker.on('mouseover', function(e) {
            	this.openPopup();
        	});
		}
		else break;
	}
	layerGroup.addTo(mymap);
});

Shiny.addCustomMessageHandler("clearMap", function(msg) {
	layerGroup.clearLayers();
});

function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch(e) {
		return false;
	}
}

window.onload = function() {
	if (!supports_html5_storage()) alert("Ваш браузер не поддерживает localStorage!");
}