$(function(){
    AOS.init();
    
    let indexA = 0;

    $(".spaceInfo li").click(function(e){
        e.preventDefault();

        indexA = $(this).attr("data-index");
       
        //모든 버튼 비활성화
        $(".spaceInfo li").removeClass("on");
        
        //클릭한 버튼만 활성화
        $(".spaceInfo li").eq(indexA).addClass("on");
        //해당하는 이미지 서서히 보이기
        $(".spacePic div").hide(); //한번에 사라지도록
        $(".spacePic div").eq(indexA).fadeIn(700);
        //li의 data값을 자동으로 가져와서 div의 순번값을 가져옴
    });


    //isotope 플러그인 시작세팅
    $('.snsBot').isotope({         
        // options
        itemSelector: '.all',      
        layoutMode: 'fitRows',
        transitionDuration: '1s'
        });


        //버튼 클릭시 정렬기능 수행
        $(".snsTab li").click(function(e){

            e.preventDefault();
            // 버튼 클릭시 해당 버튼의 data-filter 속성값을 가지고 오기
            let sorting = $(this).attr("data-filter");

            //정렬기능 수행
            $(".snsBot").isotope({ filter: sorting });
            
            $(".snsTab li").removeClass("on");
            $(this).addClass("on");


        });
    


});