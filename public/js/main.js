(function ($) {
  $(document).ready(function () {

    $('#chatter').submit(function() {
        $('#message').append('<li>'+$('#chatter input').val()+'</li>');
        $.post('/say', {message:$('#chatter input').val()});
        $('#chatter input').val('');
        return false;
    });

  });
})(jQuery);
