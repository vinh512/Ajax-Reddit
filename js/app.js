$(document).ready(function() {
  var topic = "top";
  ajaxRequest(topic); // Loads page with top posts

  // Toggles between dark or light themes
  $('button').on('click', function() {
    $('body').toggleClass('light');
    $('body').toggleClass('dark');
    ($(this).text() === 'dark theme') ? $(this).text('light theme') : $(this).text('dark theme')
    $(this).toggleClass('btnLight');
  });

  // Makes an AJAX call based on selected nav link
  $('#nav li a').on('click', function() {
    topic = ($(this).text() === 'promoted') ? 'ads' : $(this).text(); // the 'promoted' endpoint is 'ads'
    $('#main-content').empty();
    ajaxRequest(topic);
  });

  // Makes AJAX request & calls populate function upon success
  function ajaxRequest(topic) {
    var request = $.ajax({
      url: 'https://www.reddit.com/' + topic + '/.json',
      method: 'GET',
      beforeSend: function() {
        $('#loadIcon').show().html("<img class='loading' src='images/Loading.gif' />");
      }
    });
    request.done(function(response){
      $('#loadIcon').hide();
      populateContent(response); //populate page with content
    });
  }

  // Sets up the structure of a posting and populates the page with content
  function populateContent(response) {
    var results = response.data.children;
    var brokenImage, thumbNail;

    for (var i=0; i<results.length; i++) {
      thumbNail = results[i].data.thumbnail;

      // Replaces Snoo pic with missing thumbnails
      if (results[i].data.hasOwnProperty('thumbnail')) {
        brokenImage = (results[i].data.thumbnail.indexOf('http') === -1);
      } else {
        brokenImage = true;
      }

      // Address the gilded page that has different properties
      if (results[i].data.hasOwnProperty('title')) {
        title = results[i].data.title;
      } else {
        title = results[i].data.link_title;
      }

      // Constructs the html statement that gets appended into the DOM
      var elements = ['<li class=\"contentItem\">',
                        '<div class="row">',
                          // Displays the score
                          '<div class="col-md-1">',
                            '<p class="center">' + "Score:" + '<p>',
                            '<h4 class="center">' + results[i].data.score + '</h4>',
                          '</div>',
                          // Displays the correct thumbnail
                          '<div class="col-md-3">',
                            '<a href=' + results[i].data.url + '>',
                              '<img class=\"thumbnails\" src=\"' + (brokenImage ? 'images/RedditSnoo.png' : thumbNail) + '\"/>',
                            '</a>',
                          '</div>',
                          // Displays the link title
                          '<div class="col-md-8">',
                            '<a href=' + "https://www.reddit.com" + results[i].data.permalink + '\"' + '>',
                              '<h4 class=\"contentTitle\">' + title + '<h4/>',
                            '</a>',
                          '</div>',
                        '</div>',
                        '<hr/>',
                      '</li>'
                    ].join('');
      $('#main-content').append(elements);
    }
  } //end of populateContent function
});
