// 공통 UI 스크립트: 모바일 내비게이션 토글 + 상위/하위 드롭다운 메뉴
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      var expanded = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  document.querySelectorAll(".dropdown-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var item = btn.closest(".nav-item");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".nav-item.open").forEach(function (openItem) {
        openItem.classList.remove("open");
      });
      if (!wasOpen) item.classList.add("open");
    });
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-item.open").forEach(function (item) {
      item.classList.remove("open");
    });
  });

  // 언어 전환 버튼을 직접 클릭하면 그 선택을 기억해, 자동 언어 감지 스크립트가
  // 이후 방문에서 다시 되돌리지 않도록 합니다.
  document.querySelectorAll(".lang-switch").forEach(function (link) {
    link.addEventListener("click", function () {
      try {
        localStorage.setItem("ac_lang", link.getAttribute("data-lang"));
      } catch (e) {}
    });
  });
});
