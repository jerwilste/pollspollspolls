'use strict';

(function () {

   var gitUserValue = document.querySelector('#profile-username') || null;
 
   var apiUrl = appUrl + '/api/user/:id';

   function showHtmlElement (element){
      element.style.display = "block";
   }
   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }
   function hideHtmlElement (element){
       element.style.display = "none";
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);
      if (gitUserValue !== null) {
        // showHtmlElement(gitUserContainer);
         $('#gituser').removeClass("hide");
         $('#gitlogin').removeClass("show");
         $('#gitlogin').addClass("hide");
         $('#gitLogout').removeClass("hide");
         $('#createNewPoll').removeClass("hide");
         $('#myPolls').removeClass("hide");
         updateHtmlElement(userObject, gitUserValue, 'username');
         //showHtmlElement(gitLogout);
         //showHtmlElement(newPollButton);
         //hideHtmlElement(gitLogin)
      }
      
   }));
  
})();
