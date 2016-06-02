/*           2016.06.01 created by RooLearnGear             */
window.onload=function(){
	//set default date value to today
	var today = new Date();
	document.getElementById("bookdate").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

	var answer = document.getElementById('answer');
	var departure,arrival,bookdate;

	//when click submitButton
	document.getElementById('submitButton').onclick=function(){
		departure = document.getElementById('departure').value;//departure IATA code, like TSA
		arrival = document.getElementById('arrival').value;//arrival IATA code
		var x = new XMLHttpRequest;
		var url = 'http://www.easytraffic.com.tw/OpenService/Air/AirDeparture?$filter=IATA%20eq%20%27' + departure + '%27%20and%20EDestination%20eq%20%27' + arrival + '%27';
		x.open('GET', url,true);
		x.responseType = 'json';
		x.onreadystatechange = function(){
			if(x.readyState==4){//state ready
				var result = x.response;
				var i = 0;
				var html = '<tr><td>Airline</td><td>Schedule Time</td><td>Website</td></tr>';
				while(i<result.length){
					var website;
					switch(result[i].EAirlines){
						case 'GE'://復興
							website = 'http://www.tna.com.tw/tw/';
							break;
						case 'B7'://立榮
							website = 'https://www.uniair.com.tw/uniweb/index.aspx';
							break;
						case 'EF'://遠東
							website = 'http://www.fat.com.tw/';
							break;
						case 'AE'://華信
							website = 'http://www.mandarin-airlines.com/index2015/index.html';
							break;
						default:
							website = '';
							break;
					}
					html+='<tr><td>' + result[i].Airlines +'</td><td>'+ result[i].Schedule_Time + '</td><td><a href="'+website+'" target="_blank">GO!</a></td></tr>';
					i++;
				}
				answer.innerHTML = '';//set answer empty
				answer.innerHTML = html;//put answer
				var des = 'from' + departure + 'to' + arrival;//from TSA to RMQ
				document.getElementById('description').innerHTML = des;//put description
			}
		};
  		x.send();
	};

	//when click skyscanner
	document.getElementById('skyscanner').onclick=function(){
		departure = document.getElementById('departure').value;//departure IATA code, like TSA
		arrival = document.getElementById('arrival').value;//arrival IATA code
		var full_departure,full_arrival;
		full_departure = IATAConverter(departure);//convert RMQ to taichung
		full_arrival = IATAConverter(arrival);//like above

		bookdate = document.getElementById('bookdate').value;//2016-07-31
		var date = bookdate.replace(/-/g,'').substring(2);//160731
		var monthyear = dateConverter(bookdate);//return format : july-2016

		var url = 'https://www.skyscanner.com.tw/transport/flights/' + departure + '/' + arrival + '/' + date + '/airfares-from-' 
				+ full_departure + '-to-' + full_arrival +'-in-' + monthyear 
				+'.html?adults=1&children=0&infants=0&cabinclass=economy&rtn=0&preferdirects=true&outboundaltsenabled=false&inboundaltsenabled=false#results';
		window.open(url, '_blank');
	};
};

//convert IATA to location
function IATAConverter(iata){
			switch(iata){
			case 'MZG':
				return 'makung';
			case 'KHH':
				return 'kaohsiung';
			case 'TSA':
				return 'taipei-sung-shan';
			case 'RMQ':
				return 'taichung';
			default:
				return 'null';
				break;
		}
}

//convert from bookdate to monthyear
function dateConverter(bookdate){
	var year = bookdate.substring(0,4);//2016
	var temp = bookdate.substring(5,7);//07
	switch(temp){
		case '01':
			return 'january-' + year;
		case '02':
			return 'february-' + year;
		case '03':
			return 'march-' + year;
		case '04':
			return 'april-' + year;
		case '05':
			return 'may-' + year;
		case '06':
			return 'june-' + year;
		case '07':
			return 'july-' + year;
		case '08':
			return 'august-' + year;
		case '09':
			return 'september-' + year;
		case '10':
			return 'october-' + year;
		case '11':
			return 'november-' + year;
		case '12':
			return 'december-' + year;	
		default:
			return 'wrong';
	}
}