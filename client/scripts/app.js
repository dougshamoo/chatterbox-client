var rooms = [];
var currentRoom = null;
var url = 'https://api.parse.com/1/classes/chatterbox';
var message = {
  username: 'somebody',
  text: 'this is a message... boom.',
  roomname: 'room powerhouse'
};
var responseData = null;

$(document).ready(function() {
  $('#refreshButton').on('click', function() {
    refreshMessageList();
  });
  $('#submitMessage').on('click', function() {
    var text = $('#inputMessage').val();
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
  // return text.replace(/[\"&<>]/g, function (a) {
  //   return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[a];
  // });
  return _.escape(text);
}

var updateDomWithMessage = function(data, currentRoom) {
  var results = data.results;
  // _.filter ,
  console.log('results before filter');
  console.log(results);
  if (currentRoom !== null) {
    results = _.filter(results, function(item) {
      return item.roomname===currentRoom;
    });
  }
  console.log('results after filter');
  console.log(results);

  $('#messageContainer').empty();

  _.each(results, function(item, index, coll) {

    if(item.username === undefined || item.username === null) return;
    if(item.text === undefined || item.text === null) return;
    if(item.roomname === undefined || item.roomname === null) return;
    if(item.createdAt === undefined || item.createdAt === null) return;


    var escapedUser = escapeHtml(item.username);
    var escapedText = escapeHtml(item.text);
    var escapedRoom = escapeHtml(item.roomname);
    var escapedTimestamp = escapeHtml(item.createdAt);
    var formattedTimestamp = moment(escapedTimestamp).fromNow();

    $('#messageContainer').append(
      '<div class="messageDiv">'+
        '<p>'+ 'Username: ' + escapedUser+'</p>'+
        '<p>' + 'Text: ' +escapedText+'</p>'+
        '<p>' + 'Timestamp: ' + formattedTimestamp + '</p>' +
        '<p>' + 'Room: ' + escapedRoom + '</p>' +
      '</div>');
  });
};

var updateDomWithRooms = function(data) {
  var results = data.results;
  _.each(results, function(item, index, coll) {
    if (item.roomname) {
      rooms.push(item.roomname);
    }
  });
  rooms = _.uniq(rooms);
  var $rooms = $('#rooms');
  $rooms.empty();
  _.each(rooms, function(item, index, coll) {
    if(_.contains(item, '4chan')){
      var escapedRoom = escapeHtml(item);
    }
    $rooms.append($(
      '<li class="room">' +
        '<button>' +
          //escapedRoom +
        item+
        '</button>' +
      '</li>'));
    if (item === currentRoom) {
      $('.room > button').last().addClass('current');
    }
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
        updateDomWithRooms(data);
        $('.room > button').on('click', function() {
          if (currentRoom === $(this).text()) {
            currentRoom = null;
            $(this).removeClass('current');
          }
          else {
            currentRoom = $(this).text();
            $(this).addClass('current');
          }
          getMessages();
        });
        updateDomWithMessage(data, currentRoom);
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