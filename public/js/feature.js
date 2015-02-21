$(document).ready(function(){
    $("#home").on("click", function(){
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $(".container").css("display" , "none");
        $(".cover").css("display" , "block");
        $(".site-wrapper").css("height" , "100%");
        $(".site-wrapper").css("padding-bottom" , "0px");
        $(".site-wrapper").css("margin-bottom" , "0px");
    });

    $("#feature").on("click", function(){
    	$(this).siblings().removeClass("active");
        $(this).addClass("active");
        $(".container").css("display" , "block");
        $(".cover").css("display" , "none");
        $(".site-wrapper").css("height" , "0px");
        $(".site-wrapper").css("padding-bottom" , "100px");
        $(".site-wrapper").css("margin-bottom" , "20px");
    });


});
