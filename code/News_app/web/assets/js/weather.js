navigator.geolocation.getCurrentPosition((data)=>{
    console.log(data)
    let appid = '8e47c6db209d370ba495b5a1f9430f95'
    let url = 'http://api.openweathermap.org/data/2.5/weather?lat='+data.coords.latitude+'&lon='+data.coords.longitude+'&units=metric&cnt=2&APPID='+appid

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(xhttp.responseText))
            let response = JSON.parse(xhttp.responseText)
            console.log(JSON.parse(xhttp.responseText).weather[0].icon)
            document.getElementById('weatherIcon').src = 'https://openweathermap.org/img/w/'+response.weather[0].icon+'.png'
            document.getElementById('weatherText').innerHTML = response.weather[0].main
            document.getElementById('weatherLocation').innerHTML = response.name
            document.getElementById('weatherTemp').innerHTML = 'Temperature : '+response.main.temp + ' C, Humidity : ' + response.main.humidity +' %'
        }
    };
    xhttp.open("GET",url, true);
    xhttp.send();
});

