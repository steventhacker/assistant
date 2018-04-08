$(document).ready(function() {
    var timeout = setTimeout(function() {
        $('.check').on('click', function() {
        if ($(this).hasClass('checked')) {
            $(this).removeClass('checked');

            
        } else {
            $(this).addClass('checked');
        }
    });
    }, 1000);
});