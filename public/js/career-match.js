$(document).ready(function(){
    $(".fold-up").click(function(){
    	// $(this).fadeToggle();
        $(this).siblings(".job-detail").fadeToggle();
        if ($(this).html().indexOf('Fold')>-1) {
        	$(this).text("Expand");
        } else {
        	$(this).text("Fold up");
        }
    });



});