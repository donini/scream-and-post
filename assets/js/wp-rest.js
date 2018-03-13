/**
 * Publish a post using the WP REST API 
 * @param {Decibel value} higherDb 
 * @param {Photo taken} imageTaken 
 */

function publishPost( higherDb, imageTaken ) {
  $.getJSON( "../../config", function( data ) {
    var restInfo = data;
    var apiUrl   = data.apiUrl;
    var mediaUrl   = data.mediaUrl;
    var username = data.credentials.username;
    var password = data.credentials.password;
    var postData = data.postData;

    if (postData.hasOwnProperty('title')) {
      var title      = postData.title;
      postData.title = title.replace('{db}', Math.round(higherDb));
    }

    if (postData.hasOwnProperty('content')) {
      var content      = postData.content;
      postData.content = content.replace('{db}', Math.round(higherDb)).replace('{image-taken}', imageTaken);
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

/**
 * Upload an image to WordPress media library using WP REST API
 * @param {The image to updalod} image 
 * @param {WP REST API URL} apiUrl 
 * @param {WP REST API Username} username 
 * @param {WP REST API Password} password 
 * @param {Decibel value} higherDb 
 */
function uploadImage( image, apiUrl, username, password, higherDb ) {

  var file = image;
  var formData = new FormData();
  var base64ImageContent = image.replace(/^data:image\/(png|jpg|gif);base64,/, "");
  var blob = base64ToBlob(base64ImageContent, 'image/png');

  formData.append('picture', blob);
  formData.append( 'file', blob );
  formData.append( 'title', 'new snapshot' );
  formData.append( 'caption', 'new snapshot' );

  // Fire the request.
  jQuery.ajax({
    url: apiUrl,
    method: 'POST',
    crossDomain: true,
    processData: false,
    contentType: false,
    data: formData,
    // headers: { 'Content-Disposition': 'attachment;filename=test.jpg' },
    beforeSend: function ( xhr ) {
        xhr.setRequestHeader( 'Authorization', 'Basic ' + Base64.encode( username + ':' + password ) );
    },
    success: function ( response , txtStatus, xhr ) {
      console.log( response.id );
      publishPost( higherDb, response.source_url);

    },
    error: function( response ) {
      console.log( 'error' );
      console.log( response );
    }
  });
}
