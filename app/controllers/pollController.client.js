'use strict';




var pollData;
getPollsClient(function(d){
   pollData = d;

   
});
var lastList = "all";

//Add voting form event handler

/*$(document).ready(
   $("#votePoll").submit(function(event) {
   
      event.preventDefault();
   
      
   })
);*/
var colorArr = ['#afcecf','#ccffcc','#b3d9ff','#ffcc99','#304f50','#004d00','#0066cc','#cfe2e2','#ff8c1a'];
function buildChart(pollNum){
   var voteArr = [];
   var labelArr = [];

   
   getSpecificPollClient(pollNum, function(d){
      var p = d[0];
   
      voteArr = p.answers.map(function(val){
        return val.voteNum;
      });
      labelArr = p.answers.map(function(val){
         return val.answer;
      });

      var cData = {
         type: 'pie',
         data: {
            labels : labelArr,
            datasets : [{
                data: voteArr,
                backgroundColor: colorArr
            }]
         },
         options: {

         }
      };
      
      var options = {};
   
       // Get the context of the canvas element we want to select
       var ctx = document.getElementById("pieChart").getContext("2d");
   
       // Instantiate a new chart
       var myBarChart = new Chart(ctx,cData);
       
   });
}
function deletePollClient(pollNum){
   console.log('in delete poll for '+pollNum);
   var p = pollNum;
   var apiUrl = appUrl + '/api/polls/delete';
   
   
   var postedPoll = $.post(apiUrl, {
     number: p
   });
   postedPoll.fail(function(){
      console.log('failed');
   })
   postedPoll.always(function(data) {
      window.location.reload();

   });
}
function newPollClient(){
   var q = ($("#question").val());
   //q = $(q).text();//.replace('<script>','').replace('</script>','');
   var a = ($("#textarea").val());
   //a = $(a).text();//.replace('<script>','').replace('</script>','');
   var apiUrl = appUrl + '/api/polls/add';
   
   
   var postedPoll = $.post(apiUrl, {
     question: q,
     answers: a
   });
   
   postedPoll.always(function(data) {

      headHome();

   });
       
  // ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiUrl, function(data) {
         
         
 //  }));
}
function checkNewOption(){
   var v = $("#selectVote").val();
   if (v === "create new option"){
      $("#newOption").removeClass("hide");
   }
}
function addVoteClient(){
   var q = $("#pollQuestion").attr("value");
   var v;
   if ($("#newOption").val()){
      v = $("#newOption").val();
   }
   else v = $("#selectVote").val();
   $("#newOption").val("");
   $("#newOption").addClass("hide");
   
   v = encodeURIComponent(v);
   
   console.log(q);
   console.log(v);
   
   var apiUrl = appUrl + '/api/polls/addVote/'+q+'?vote='+v; 
       
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiUrl, function(data) {
         $("#selectVote").html("<option disabled selected value> you already voted!! </option>");
         
         var t = JSON.parse(data);
         console.log(t);
         
         var output = "<ul>Voting results for this poll:";
         for (let i = 0; i < t[0].answers.length; i++){
            output += "<li>"+t[0].answers[i].answer+": "+t[0].answers[i].voteNum+" votes</li>";
         }
         output += "</ul>"
         $("#pollOutcomeWrap").html(output);
         
         buildChart(t[0].number);
         
   }));
}

function getPollsClient(callback) {
  
   var apiUrl = appUrl + '/api/polls/all';

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
      callback(JSON.parse(data));
      
   }));
}
function getSpecificPollClient(pNum, callback) {
  
   var apiUrl = appUrl + '/api/polls/'+pNum;

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
      callback(JSON.parse(data));
      
   }));
}

function openPoll(poll,user){
   getSpecificPollClient(poll.replace("#p",""), function(d){
      var p = d[0];
      console.log('openpoll: '+poll);
      console.log(p);
      $("#viewPoll").removeClass("hide");
      if ($("#pollListWrap").attr("class","")){
         $("#pollListWrap").addClass("hide");
      }
      if ($("#myPollList").attr("class","")){
         $("#myPollList").addClass("hide");
      }
      //var q = $("#"+poll).val();
      $("#pollQuestion").html(p.question);
      $("#pollQuestion").attr("value", p.number);
      var opts = "<option disabled selected value> -- select an option -- </option>";
      for (let i = 0; i < p.answers.length; i++){
         let t = p.answers[i];
         opts += '<option>'+t.answer+'</option>';
      }
      opts += '<option>create new option</option>';
      $("#selectVote").html(opts);
      if(user){
         $("#deletePollBtn").attr("onclick","deletePollClient("+p.number+");");
         $("#deletePollBtn").removeClass("hide");
      }
      
      buildChart(p.number);
      
      $("#share").attr("data-href","https://pollspollspolls-iloanzi.c9users.io/poll?number="+p.number);
      $("#share").attr("href","https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpollspollspolls-iloanzi.c9users.io%2Fpoll%3Fnumber%3D"+p.number+"&amp;src=sdkpreparse");

   });
   //$("#votePoll").prop("action", "/api/polls/addVote/"+(poll[2]));
    
}
function showPollList(){
   getPollsClient(function(d){
      pollData = d;
      if (lastList === "user"){
         window.location.href = "https://pollspollspolls-iloanzi.c9users.io?list=user";
      }
      else {
         window.location.href = "https://pollspollspolls-iloanzi.c9users.io";
      }
   });
   
}
function openPollPage(num){
   window.location.href = "https://pollspollspolls-iloanzi.c9users.io/poll?number="+num;
}
function headHome(){
   window.location.href = "https://pollspollspolls-iloanzi.c9users.io/";
}
function openCreatePoll(){
   $("#newPoll").removeClass("hide");
   $("#viewPoll").addClass("hide");
}
function showMyPolls(){
   $("#viewPoll").addClass("hide");
   $("#myPollList").removeClass("hide");
   if ($("#pollListWrap").attr("class","")){
      $("#pollListWrap").addClass("hide");
   }
   if ($("#newPoll").attr("class","")){
      $("#newPoll").addClass("hide");
   }
   $("#myPollList").removeClass("hide");
   lastList = "user";
}