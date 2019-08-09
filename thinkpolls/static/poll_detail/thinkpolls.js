function textAreaAdjust(o) {
  console.log(o.scrollHeight);
  if (o.scrollHeight == 62) {
  } else {
    o.style.height = "1px";
    o.style.height = 5 + o.scrollHeight + "px";
  }
}
$(document).ready(function() {
  $("textarea").on("keypress", function(e) {
    if (e.keyCode == 10 || e.keyCode == 13) {
      e.preventDefault();
    }
  });
  $(document)
    .on("mouseenter", ".box", function() {
      $(this)
        .siblings(".cross-btn")
        .css({
          visibility: "visible",
          opacity: " 1",
          transform: "translate(-70%, -30%) scale(1, 1)"
        });
      $(this)
        .siblings(".menu-btn")
        .css({
          visibility: "visible",
          opacity: " 1",
          transform: "translate(-130%, -90%) scale(1, 1)"
        });
    })
    .on("mouseleave", ".box", function() {
      $(this)
        .siblings(".cross-btn")
        .css({
          visibility: "hidden",
          opacity: " 0",
          transform: "translate(-70%, -30%) scale(0.1, 0.1)"
        });
      $(this)
        .siblings(".menu-btn")
        .css({
          visibility: "hidden",
          opacity: " 0",
          transform: "translate(-130%, -90%) scale(0.1, 0.1)"
        });
    });
  $(".cross-btn").hover(function() {
    $(this).css({
      visibility: "visible",
      opacity: " 1",
      transform: "translate(-70%, -30%) scale(1, 1)"
    });
    $(this)
      .siblings(".menu-btn")
      .css({
        visibility: "visible",
        opacity: " 1",
        transform: "translate(-130%, -90%) scale(1, 1)"
      });
  });
  $(".menu-btn").hover(function() {
    $(this).css({
      visibility: "visible",
      opacity: " 1",
      transform: "translate(-130%, -90%) scale(1, 1)"
    });
    $(this)
      .siblings(".cross-btn")
      .css({
        visibility: "visible",
        opacity: " 1",
        transform: "translate(-70%, -30%) scale(1, 1)"
      });
  });

  var option_counter = 2;

  $(document).on("click", "#lastoption", function() {
    option_counter++;
    $(".option-wrapper").append(
      ' <div class="option-block"><textarea type="text" name="option' +
        option_counter +
        '"class="box" id="lastoption"  placeholder="#option' +
        option_counter +
        '" rows="1"onkeyup="textAreaAdjust(this)"></textarea></div>'
    );
    $(this).removeAttr("id");
  });
});
