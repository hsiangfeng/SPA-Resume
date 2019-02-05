$(document).ready(function () {
  $('.scrollTop').click(function (e) {
    e.preventDefault()
    var target = $(this).attr('href')
    var targetTop = $(target).offset().top
    console.log(target, targetTop)
    $('html,body').animate({ scrollTop: targetTop }, 1000)
  })
  $(window).scroll(function () {
    var scrollPos = $(window).scrollTop();
    var widthHight = $(window).height();
    //console.log(scrollPos,widthHight);
    var skillTop = $('#skilled').position().top;
    if (skillTop <= (scrollPos + widthHight / 2)) {
      $('#skilled .progress-bar').each(function () {
        var thisValue = $(this).data('progress')
        $(this).css('width', thisValue + '%')
      })
    }
  })
  window.onload = () => {
    $('.banner-text').fadeIn(1000);
  }
})