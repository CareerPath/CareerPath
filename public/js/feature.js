$(document).ready(function(){
    $("#home").on("click", function(){
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $(".container").css("display" , "none");
        $(".cover").css("display" , "block");
        $(".site-wrapper-inner").css("height" , "100%");
    });

    $("#feature").on("click", function(){
    	$(this).siblings().removeClass("active");
        $(this).addClass("active");
        $(".container").css("display" , "block");
        $(".cover").css("display" , "none");
        $(".site-wrapper-inner").css("height" , "200px");
    });


});
