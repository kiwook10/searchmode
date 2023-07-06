$(function(){
    //visual area swiper
    const swiper = new Swiper('.visual', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        // autoplay: {
        //     delay: 2500,
        //     disableOnInteraction: true,
        //   },
      
        // If we need pagination
        pagination: {
            el: ".visual-pagination",
            clickable: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + "</span>";
            },
          },

      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
      });



    //monthly
    var swiper1 = new Swiper(".monthly", {
      loop: true,
      slidesPerView: 1,
      centeredSlides:true,
      autoplay: {
          delay: 2500,
          disableOnInteraction: true,
        },
      // Responsive breakpoints
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20
        },

        1200: {
          slidesPerView: 5,
          spaceBetween: 40
        }
  }  


    });


});