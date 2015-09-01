// YOUR CODE HERE:

var url = 'https://api.parse.com/1/classes/chatterbox';
var message = {
  username: 'somebody',
  text: 'this is a message... boom.',
  roomname: 'room powerhouse'
};
var responseData = null;

// it begins......
$(document).ready(function() {


  $('#refreshButton').on('click', function() {
    refreshMessageList();
  });

  $('#submitMessage').on('click', function() {
    var text = $('#inputMessage').val();
    console.log("text: " + text);
    postMessage({
      username: 'the cat',
      text: text,
      roomname: 'the room'
    });

  });

  getMessages();

});

var refreshMessageList = function() {
  $('#messageContainer').empty();
  getMessages();
};

function escapeHtml(text) {
  return text.replace(/[\"&<>]/g, function (a) {
    return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[a];
  });
}

var updateDomWithMessage = function(data) {
  var results = data.results;
  _.each(results, function(item, index, coll) {
    if(item.username !== undefined){
      var escapedUser = escapeHtml(item.username);
    }
    if(item.text !== undefined) {
      var escapedText = escapeHtml(item.text);
    }
    var escapedTimestamp = escapeHtml(item.createdAt);
    var formattedTimestamp = moment(escapedTimestamp).fromNow();

    $('#messageContainer').append(
      '<div class="messageDiv">'+
        '<p>'+ 'Username: ' + escapedUser+'</p>'+
        '<p>' + 'Text: ' +escapedText+'</p>'+
        '<p>' + 'Timestamp: ' + formattedTimestamp + '</p>' +
      '</div>');
  });

};

var getMessages = function() {
  var ajaxCall =
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Messages retrieved');
        updateDomWithMessage(data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve messages');
      }
    });
  return ajaxCall;
}

var postMessage = function(messageObj) {
  var ajaxCall =
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(messageObj),
      contentType: 'application/json',
      success: function (data) {
        // responseData = data;
        console.log('chatterbox: Message sent');
        $('#inputMessage').val('');
        refreshMessageList();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  return ajaxCall;
};