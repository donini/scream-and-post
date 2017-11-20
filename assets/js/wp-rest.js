function publishPost(higherDb) {
  $.getJSON( "../../config", function( data ) {
    var restInfo = data;
    var apiUrl   = data.apiUrl;
    var username = data.credentials.username;
    var password = data.credentials.password;
    var postData = data.postData;

    if (postData.hasOwnProperty('title')) {
      var title      = postData.title;
      postData.title = title.replace('{db}', Math.round(higherDb));
    }

    if (postData.hasOwnProperty('content')) {
      var content      = postData.content;
      postData.content = content.replace('{db}', Math.round(higherDb));
    }

    $.ajax({
        url: apiUrl,
        method: 'POST',
        crossDomain: true,
        data: postData,
        dataType: 'json',
        beforeSend: function ( xhr ) {
            xhr.setRequestHeader( 'Authorization', 'Basic ' + Base64.encode( username + ':' + password ) );
        },
        success: function( data, txtStatus, xhr ) {
            console.log( data );
            console.log( xhr.status );
        }
    });
  });
}