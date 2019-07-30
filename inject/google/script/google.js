window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();
var patt = /[\u05D0-\u05EA]|[\u0620-\u063F]|[\u0641-\u064A]|[\u0675-\u06D3]|[\u0710-\u071C]|[\u071E-\u072F]|[\u074E-\u077F]|[\u08A0-\u08AC]|[\u08AE-\u08B4]|[\u07C1-\u07C9]|[\u07CC-\u07E9]/g;
var obsRun = false;
if (typeof(document.querySelector("[title='Search']")) != 'undefined' && document.querySelector("[title='Search']") != null) {
  document.querySelector("[title='Search']").setAttribute("dir", "auto");
}

browser.storage.local.get('google', function (items) {
  if (items.google == true || items.google == undefined) {
    let run_against_article = post_article => {
      if (!patt.test(post_article.innerText)) return;
      post_article.classList.add('fonttools-rtl');
    };

    let run_on_page = () => {
      let post_articles = document.querySelectorAll(
        'h1,h2,h3,h4,h5,h6,p,li,td,tr,pre,font,blockquote,small,center,span,a,div,strong,cite'
      );
      if (!post_articles.length) return;

      let i = 0,
        len = post_articles.length;
      for (; i < len; i++) run_against_article(post_articles[i]);
    };
    obsRun = true;
    run_on_page();
    new MutationObserver(run_on_page).observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});

browser.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.google != undefined) {
    browser.storage.local.get('google', function (items) {
      if (items.google == true || items.google == undefined) {
        let run_against_article = post_article => {
          if (!patt.test(post_article.innerText)) return;

          post_article.classList.add('fonttools-rtl');
        };

        let run_on_page = () => {
          let post_articles = document.querySelectorAll(
            'h1,h2,h3,h4,h5,h6,p,li,td,tr,pre,font,blockquote,small,center,span,a,div,strong,cite'
          );
          if (!post_articles.length) return;

          let i = 0,
            len = post_articles.length;
          for (; i < len; i++) run_against_article(post_articles[i]);
        };
        if (obsRun == false) {
          run_on_page();
          new MutationObserver(run_on_page).observe(document.body, {
            childList: true,
            subtree: true
          });
        } else {
          run_on_page();
        }
      }
    });
  }
});
