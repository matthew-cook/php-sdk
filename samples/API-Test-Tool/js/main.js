function saveProfile() {
  var update = false;

  if ($('#profileNameField').is(':hidden')) {
     var profileName = $('#userProfiles').val();
     $('#rmProfile').show();
     update = true;
  }else{
     $('#rmProfile').hide();
     var profileName = $('#profileNameField').val();
  }

  if (profileName.length > 0) {
      var host = $('#hostField').val();
      var port = $('#portField').val();
      var isSecure = $('#schemeField').prop('checked');
      var appID = $('#appIDField').val();
      var appKey = $('#appKeyField').val();
      
      var newProfile = { 'HOST': host,
                         'PORT': port, 
                         'SECURE': isSecure,
                         'APPID': appID,
                         'APPKEY': appKey
                       };
     localStorage.setItem(profileName, JSON.stringify(newProfile)); 

     if (update) {
         $('#successalert').fadeIn(1000).delay(1000).fadeOut(1000);
     }else{

         var userProfiles = localStorage.getItem("userProfiles");

         if (userProfiles == "" || userProfiles == null){
              localStorage.setItem('userProfiles', profileName);
         }else{
              localStorage.setItem('userProfiles', userProfiles+','+profileName);
         }
         $('#userProfiles').append("<option value='"+profileName+"'>"+profileName+"</option>");
         $("#userProfiles").val(profileName);
         $('#profileNameField').val("").parent().hide();
         $('#rmProfile').show();
         $('#successalert').fadeIn(1000).delay(1000).fadeOut(1000);
     }
  }
}

function loadProfile(profileName) {
  var profile = localStorage.getItem(profileName);
  if (profile){
      $('#profileNameField').parent().hide();
      $('#rmProfile').show();
      profile = JSON.parse(profile);
      $(hostField).val(profile['HOST']);
      $(portField).val(profile['PORT']);
      $(appIDField).val(profile['APPID']);
      $(appKeyField).val(profile['APPKEY']);

      if(profile['SECURE']){
          $('#schemeField').prop('checked', true);
      }else{
          $('#schemeField').prop('checked', false);
      }
  }else{
      $('#profileNameField').parent().show();
      $('#rmProfile').hide();
  }
}

function loadProfileList() {
    var userProfiles = localStorage.getItem("userProfiles");
    if (userProfiles) {
        var profiles = userProfiles.split(",");
        profiles.sort();
        for (var i = profiles.length - 1; i >= 0; i--) {
            $('#userProfiles').append("<option value='"+profiles[i]+"'>"+profiles[i]+"</option>");
        };
    }
    $("#userProfiles").val(localStorage.getItem('lastProfile'));
    loadProfile($("#userProfiles").val());
    $('#userProfiles').append("<option value='New Profile'>New Profile</option>");
}

function removeProfile() {
  var profile = $('#userProfiles').val();
  var profiles = localStorage.getItem('userProfiles');
  console.log(profiles);
  var p = profiles.split(',');
  var i = p.indexOf(profile);
    if(i != -1) {
    p.splice(i, 1);
  }
  localStorage.removeItem(profile);
  localStorage.removeItem('lastProfile');
  localStorage.setItem('userProfiles', p.toString());
}

function loadDefaults() {
  var defaultProfile = "New Profile";
  $('#hostField').val("valence.desire2learn.com");
  $('#portField').val("443");
  $('#appIDField').val('G9nUpvbZQyiPrk3um2YAkQ');
  $('#appKeyField').val('ybZu7fm_JKJTFwKEHfoZ7Q');
  $('#schemeField').prop('checked', true);
  $('#profileNameField').parent().show();
  $('#rmProfile').hide();
  $("#userProfiles").val(defaultProfile);
  localStorage.setItem('lastProfile', defaultProfile);
}

function doAPIRequest() {
  $('#responseField').val("");
  $('errorField1').addClass('hidden');
  $("errorField2").innerHTML = "";
  $("responseField").addClass('hidden');
  $("responseFieldLabel").addClass('hidden');
  $('#responseField').val("");

  var host = $('#hostField').val().trim();
  var port = $('#portField').val().trim();
  var scheme = $('#schemeField').is(':checked') ? 'https' : 'http';
  var req = $('#actionField').val().trim();
  var method = $('#GETField').is(':checked') ? "GET" :
         $('#POSTField').is(':checked') ? "POST" :
         $('#PUTField').is(':checked') ? "PUT" : "DELETE";
  var data = $('#dataField').val();
  var anon = $('#anonymousField').is(':checked');
  var appId = $('#appIDField').val().trim();
  var appKey = $('#appKeyField').val().trim();
  var userKey = $('#userKeyField').val().trim();
  var userId = $('#userIDField').val().trim();
  var contentType = $('#contentType').val().trim();
  $.ajax({
        url: "doRequest.php",
        data: {
          host: host,
          port: port,
          scheme: scheme,
          anon: anon,
          apiRequest: req,
          apiMethod: method,
          contentType: contentType,
          data: data,
          appId: appId,
          appKey: appKey,
          userId: userId,
          userKey: userKey
        },
        success: function(data) {
          var output;
          if(data == '') {
            output = 'Success!';
            return;
          } else {
            try {
              output = jQuery.parseJSON(data);
            } catch(e) {
              output = "Unexpected non-JSON response from the server: " + data;
            }
          }
          $('#statusField').val(output.statusCode);
          $('#responseField').val(output.response);
          $("#responseField").removeClass('hidden');
          $("#responseFieldLabel").removeClass('hidden');
        },
        error: function(jqXHR, textStatus, errorThrown) {
          $('#errorField1').removeClass('hidden');
          $("#errorField2").innerHTML = jqXHR.responseText;
        },
      });
  }

function setCredentials() {
  $('#authButtons').addClass('hidden');
  $("#manualAuthBtn").removeClass('hidden');
  $("#deauthBtn").addClass('hidden');
  $("#userFields").removeClass('hidden');
  $("#manualBtn").addClass('hidden');
  $("#authenticateBtn").addClass('hidden');
  $("#authNotice").addClass('hidden');
}

function exampleGetVersions() {
  hideData();
  document.getElementById("GETField").checked = true;
  document.getElementById("actionField").value = "/d2l/api/versions/";
}

function exampleWhoAmI() {
    hideData();
    document.getElementById("GETField").checked = true;
    document.getElementById("actionField").value = "/d2l/api/lp/1.0/users/whoami";
}

function exampleCreateUser() {
    showData();
    document.getElementById("POSTField").checked = true;
    document.getElementById("actionField").value = "/d2l/api/lp/1.0/users/";
    document.getElementById("dataField").value = "{\n  \"OrgDefinedId\": \"<string>\",\n  \"FirstName\": \"<string>\",\n  \"MiddleName\": \"<string>\",\n  \"LastName\": \"<string>\",\n  \"ExternalEmail\": \"<string>|null\",\n  \"UserName\": \"<string>\",\n  \"RoleId\": \"<number>\",\n  \"IsActive\": \"<boolean>\",\n  \"SendCreationEmail\": \"<boolean>\"\n}";
}

function showData() {
      $('.post-forms').removeClass('hidden');
}

function hideData() {
      $('.post-forms').addClass('hidden');
}

function deAuthenticate() {
  window.location.replace("index.php");
}
function authenticateFields() {
  $("#manualAuthBtn").addClass('hidden');
  $("#authenticateBtn").addClass('hidden');
  $("#authNotice").addClass('hidden');
  $('#deauthBtn').removeClass('hidden');
  document.getElementById("userIDField").disabled = true;
  document.getElementById("userKeyField").disabled = true;
  document.getElementById("hostField").disabled = true;
  document.getElementById("portField").disabled = true;
  document.getElementById("appKeyField").disabled = true;
  document.getElementById("appIDField").disabled = true;
  document.getElementById('userProfiles').disabled = true;
  document.getElementById('resetButton').disabled = true;
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}


$(document).ready(function(){
    loadProfileList();

  $('#userProfiles').change(function(){
      loadProfile(this.value);
      localStorage.setItem('lastProfile', this.value);
  });

  if ((document.getElementById("appIDField").value == '' ) && (document.getElementById("appKeyField").value == '')){
    loadDefaults();
  }

  if(document.getElementById("userIDField").value != "") {
    $("#manualBtn").addClass('hidden');
    $("#authenticateBtn").addClass('hidden');
    $("#authNotice").addClass('hidden');
    document.getElementById("userIDField").disabled = true;
    document.getElementById("userKeyField").disabled = true;
    document.getElementById("hostField").disabled = true;
    document.getElementById("portField").disabled = true;
    document.getElementById("appKeyField").disabled = true;
    document.getElementById("appIDField").disabled = true;
    document.getElementById('userProfiles').disabled = true;
    document.getElementById('resetButton').disabled = true;
  } else {
    $("#userFields").addClass('hidden');
    document.getElementById("hostField").disabled = false;
    document.getElementById("portField").disabled = false;
    document.getElementById("appKeyField").disabled = false;
  }
});