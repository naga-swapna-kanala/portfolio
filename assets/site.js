/* Theme toggle. The initial stamp happens in an inline <head> script so there
   is no flash of the wrong theme; this file only handles the click. */
(function () {
  "use strict";

  var root = document.documentElement;
  var btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  function current() {
    var set = root.getAttribute("data-theme");
    if (set === "dark" || set === "light") return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function label(mode) {
    btn.setAttribute(
      "aria-label",
      mode === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  label(current());

  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    label(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* private mode, blocked storage: the toggle still works for this page */
    }
  });
})();

/* Review panel: collects every red marker on the page into a floating
   checklist with jump links. Remove this block, and the markers, before
   going public (README: "Before going public"). */
(function () {
  "use strict";

  var marks = Array.prototype.slice.call(
    document.querySelectorAll(".todo[data-todo], .todo-pin[data-todo]")
  );
  if (!marks.length) return;

  marks.forEach(function (m, i) {
    if (!m.id) m.id = "review-" + (i + 1);
    m.setAttribute("tabindex", "0");
    m.setAttribute("role", "note");
    m.setAttribute("aria-label", "Needs review: " + m.getAttribute("data-todo"));
  });

  var box = document.createElement("aside");
  box.className = "review";
  box.setAttribute("aria-label", "Items to review before publishing");

  var items = marks
    .map(function (m, i) {
      var where = m.getAttribute("data-where") || "";
      return (
        '<li><a href="#' + m.id + '">' +
        '<span class="n">' + (i + 1) + "</span>" +
        '<span><span class="t">' + esc(m.getAttribute("data-todo")) + "</span>" +
        (where ? '<span class="w">' + esc(where) + "</span>" : "") +
        "</span></a></li>"
      );
    })
    .join("");

  box.innerHTML =
    '<button class="review__btn" type="button" aria-expanded="false">' +
    "Review before publishing " +
    '<span class="review__count">' + marks.length + "</span>" +
    "</button>" +
    '<div class="review__panel">' +
    '<div class="review__head">' +
    '<div class="review__title">' + marks.length + " item" + (marks.length === 1 ? "" : "s") + " on this page</div>" +
    '<div class="review__sub">Red highlights mark anything not yet confirmed. Hover one for the note. ' +
    "The prose was written from your resume bullets, so read each page once in full as well.</div>" +
    "</div>" +
    '<ul class="review__list">' + items + "</ul>" +
    '<div class="review__foot">' +
    '<label><input type="checkbox" data-hide-todos> Preview without markers</label>' +
    '<a href="/#work">Other pages</a>' +
    "</div></div>";

  document.body.appendChild(box);

  var btn = box.querySelector(".review__btn");
  btn.addEventListener("click", function () {
    var open = box.hasAttribute("data-open");
    if (open) {
      box.removeAttribute("data-open");
    } else {
      box.setAttribute("data-open", "");
    }
    btn.setAttribute("aria-expanded", String(!open));
  });

  box.querySelector("[data-hide-todos]").addEventListener("change", function (e) {
    if (e.target.checked) {
      document.body.setAttribute("data-hide-todos", "");
    } else {
      document.body.removeAttribute("data-hide-todos");
    }
  });

  box.querySelectorAll(".review__list a").forEach(function (a) {
    a.addEventListener("click", function () {
      var t = document.getElementById(a.getAttribute("href").slice(1));
      if (t) setTimeout(function () { t.focus({ preventScroll: true }); }, 350);
    });
  });

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();

/* Mark the nav link for the section currently in view. */
(function () {
  "use strict";

  var links = Array.prototype.slice.call(
    document.querySelectorAll('.navlinks a[href^="#"]')
  );
  if (!links.length || !("IntersectionObserver" in window)) return;

  var targets = links
    .map(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      return el ? { a: a, el: el } : null;
    })
    .filter(Boolean);
  if (!targets.length) return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var match = targets.filter(function (t) {
          return t.el === entry.target;
        })[0];
        if (!match) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) {
            l.removeAttribute("aria-current");
          });
          match.a.setAttribute("aria-current", "true");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  targets.forEach(function (t) {
    io.observe(t.el);
  });
})();
