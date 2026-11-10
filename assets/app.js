/* 教師操守 · 資料站 —— 零依賴前端邏輯 */
(function () {
  "use strict";

  /* 閱讀進度 */
  var bar = document.getElementById("pg");
  var busy = false;
  function onScroll() {
    if (busy) return;
    busy = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      if (bar) bar.style.width = Math.min(100, Math.max(0, p * 100)) + "%";
      busy = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 導覽高亮 */
  var links = [].slice.call(document.querySelectorAll("#navlinks a"));
  var targets = links.map(function (a) {
    var el = document.querySelector(a.getAttribute("href"));
    return el ? { a: a, el: el } : null;
  }).filter(Boolean);

  if ("IntersectionObserver" in window && targets.length) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        seen[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
      });
      var best = null, top = 0;
      targets.forEach(function (t) {
        var v = seen[t.el.id] || 0;
        if (v > top) { top = v; best = t; }
      });
      if (best) links.forEach(function (l) { l.classList.toggle("active", l === best.a); });
    }, { rootMargin: "-70px 0px -55% 0px", threshold: [0, 0.12, 0.35, 0.7] });
    targets.forEach(function (t) { io.observe(t.el); });
  }

  /* 處分階梯：滑入時逐級顯示數字（尊重減少動態效果） */
  var steps = [].slice.call(document.querySelectorAll(".step .q"));
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window && steps.length) {
    steps.forEach(function (q) {
      q.style.opacity = "0";
      q.style.transition = "opacity .45s ease";
    });
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          setTimeout(function () { el.style.opacity = "1"; }, i * 70);
          io2.unobserve(el);
        }
      });
    }, { threshold: 0.35 });
    steps.forEach(function (q) { io2.observe(q); });
  }
})();
