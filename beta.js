// var urlvariable;

// var XMLHttpRequest = require('xhr2');
//  var xhr = new XMLHttpRequest();
//     urlvariable = "text";

//     var ItemJSON;

//     ItemJSON = '[  {    "Id": 1,    "ProductID": "1",    "Quantity": 1,  },  {    "Id": 1,    "ProductID": "2",    "Quantity": 2,  }]';

//     URL = "https://testrestapi.com/additems?var=" + urlvariable;  //Your URL

//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
//     xmlhttp.open("POST", URL, false);
//     xmlhttp.setRequestHeader("Content-Type", "application/json");
//     xmlhttp.setRequestHeader('Authorization', 'Basic ' + window.btoa('apiusername:apiuserpassword')); //in prod, you should encrypt user name and password and provide encrypted keys here instead 
//     xmlhttp.onreadystatechange = callbackFunction(xmlhttp);
//     xmlhttp.send(ItemJSON);
//     alert(xmlhttp.responseText);

//     function callbackFunction(xmlhttp) 
// {
//     //alert(xmlhttp.responseXML);
// }




    // const { response } = require('express');
    // const express = require('express');
    const https = require('https');
    
  const url='https://shopping-cart-payment-api-100.herokuapp.com/discount/1000'
    https.get(url,function(response){

        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            console.log(parseInt(weatherData.discount));

        })
    })


