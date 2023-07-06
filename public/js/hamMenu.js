$(function(){

    
    //모바일 메뉴 클릭 동작
    //모바일 메뉴 포지션의 위치로 움직임

    $(".ham").click(function(e){
        e.preventDefault();
        $("#ham_menu").stop().animate({"right":0+"%"},500)
    });
    $(".ham_close").click(function(e){
        e.preventDefault();
        $("#ham_menu").stop().animate({"right":-100+"%"},500)
    });

    //모바일 서브 메뉴 드롭다운

    $(".hamDepth1 li").click(function(e){
        e.preventDefault();
        $(".hamDepth1 li").removeClass("on");
        $(this).addClass("on");
      

       
        $(this).siblings().children(".hamDepth2").stop().slideUp();

        $(this).children(".hamDepth2").stop().slideDown();
    });



});