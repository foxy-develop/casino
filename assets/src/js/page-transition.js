jQuery(document).ready(function(event) {
  var isAnimating = false,
    newLocation = "";
  firstLoad = false;

  //запуск анимации для текущей страницы
  $("main").on("click", '[data-type="page-transition"]', function(event) {
    event.preventDefault();
    //определение страницы для загрузки
    var newPage = $(this).attr("href");
    //проверям - была ли анимация для этой страницы
    if (!isAnimating) changePage(newPage, true);
    firstLoad = true;
  });

  //кнопка назад
  $(window).on("popstate", function() {
    if (firstLoad) {
      /*
      Safari
      */
      var newPageArray = location.pathname.split("/"),
        //адресс загружаемой страницы
        newPage = newPageArray[newPageArray.length - 1];

      if (!isAnimating && newLocation != newPage) changePage(newPage, false);
    }
    firstLoad = true;
  });

  function changePage(url, bool) {
    isAnimating = true;
    // запуск анимации
    $("body").addClass("page-is-changing");
    $(".cd-loading-bar").one(
      "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
      function() {
        loadNewContent(url, bool);
        newLocation = url;
        $(".cd-loading-bar").off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
      }
    );
    //в случае если это тугой браузер
    if (!transitionsSupported()) {
      loadNewContent(url, bool);
      newLocation = url;
    }
  }

  function loadNewContent(url, bool) {
    url = "" == url ? "index.html" : url;
    var newSection = "cd-" + url.replace(".html", "");
    var section = $('<div class="cd-main-content ' + newSection + '"></div>');

    section.load(url + " .cd-main-content > *", function(event) {
      // загрузка нового контента в блок main
      $("main").html(section);
      //мнгновенный переход, если браузер тугой
      var delay = transitionsSupported() ? 1200 : 0;
      setTimeout(function() {
        //ожидаем конец анимации и загрузки новой странциы
        section.hasClass("cd-about") ? $("body").addClass("cd-about") : $("body").removeClass("cd-about");
        $("body").removeClass("page-is-changing");
        $(".cd-loading-bar").one(
          "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
          function() {
            isAnimating = false;
            $(".cd-loading-bar").off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend");
          }
        );

        if (!transitionsSupported()) isAnimating = false;
      }, delay);

      if (url != window.location && bool) {
        //добавляем адресс window.history
        //в случае, если адресс тот-же - ничего не меняемы
        window.history.pushState({ path: url }, "", url);
      }
    });
  }

  function transitionsSupported() {
    return $("html").hasClass("csstransitions");
  }
});
