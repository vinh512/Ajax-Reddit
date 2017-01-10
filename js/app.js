/* - So we want the reddit page to load up new upon opening the page
     - if user wants to select which topic to load, we allow them
       - and call ajax request with particular topic
       - iterate & update html with new data */

$(document).ready(function(){
  var topic = "top";
  ajaxRequest(topic);

  $('#nav li a').on('click', function() {
    topic = ($(this).text() === 'promoted') ? 'ads' : $(this).text(); //special case for 'promoted' selection
    $('#main-content').empty(); //clears the page
    ajaxRequest(topic); //call function to make AJAX request
  });

  //Makes AJAX request & calls populate function upon success
  function ajaxRequest(topic) {
    var request = $.ajax({
      url: 'https://www.reddit.com/' + topic + '/.json',
      method: 'GET',
      beforeSend: function(){   /*loading gif*/ }
    });
    request.done(function(response){
      populateContent(response); //populate content
    });
  }

  function populateContent(response) {
    var results = response.data.children;
    var brokenImage, thumbNail;

    for (var i=0; i<results.length; i++) {
      thumbNail = results[i].data.thumbnail;

      /* If the Object has a thumbnail property, check to see if it has an actual thumbnail
       and apply a boolean value for the ternary. The indexOf method will return a '-1' if the
       argument is not found. Continuing with statement, else it has a brokenImage */
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

      // Forms the html statement that gets added into the DOM
      var elements = ['<li class=\"contentItem\">',
                        '<div class="row">',
                          '<div class="col-md-1">',
                            '<h4>' + results[i].data.score + '</h4>',
                          '</div>',
                          '<div class="col-md-3">',
                            '<img class=\"thumbnails\" src=\"' + (brokenImage ? 'images/RedditSnoo.png' : thumbNail) + '\"/>',
                          '</div>',
                          '<div class="col-md-8">',
                            '<h4 class=\"contentTitle\">' + title + '<h4/>',
                          '</div>',
                        '</div>',
                      '</li>'
                    ].join('');
      $('#main-content').append(elements);
    }
  } //end of populateContent function
});
