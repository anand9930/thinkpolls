function textAreaAdjust(o) {
  console.log(o.scrollHeight);
  if (o.scrollHeight == 58) {
  } else {
    o.style.height = "1px";
    o.style.height = 5 + o.scrollHeight + "px";
  }
}

$(document).ready(function() {
  function closepopup() {
    $(".modal-popup-bg").css({
      visibility: "hidden"
    });
  }

  $(document).on("click", ".addimage-block ,.popup-block", function(e) {
    $("#input-imageurl").val("");
    e.stopPropagation();
    console.log("a");

    if ($(this).attr("class") == "addimage-block") {
      img_request_block = $(this);
    }

    $(".modal-popup-bg").css({
      visibility: "visible"
    });

    //$(document).on("click", ".paste-url-block", function(e) {
    /*$(".paste-url-block ,.block2 ").click(function(e) {
      e.stopPropagation();
      console.log("b");
      $(".block2").css({
        display: "flex"
      });
      $(".block1").css({
        display: "none"
      });
    });*/

    //
    $(".modal-popup-bg").click(function() {
      closepopup();
    });

    $("#imgurlgot").click(function(e) {
      e.stopPropagation();

      var imageurl = $("#input-imageurl");
      if (imageurl.value == "") {
        // alert("please paste the url..");
      } else {
        var img_request_block_id = img_request_block.attr("id");
        $("#" + img_request_block_id).html(
          '<input name="' +
            img_request_block_id +
            '"type="url" value="' +
            imageurl.val() +
            '"><img src="' +
            imageurl.val() +
            '"/>'
        );

        $(".modal-popup-bg").css({
          visibility: "hidden"
        });
      }
    });
  });
  var addimgcounter = 1;
  $(document).on("click", ".extraimgblock", function() {
    //$(".extraimgblock").click(function() {
    var parent_block = $(this)
      .parent()
      .parent();
    // alert("hello");
    var big_parent = parent_block.parent();
    console.log(parent_block.attr("class")[1]);
    addimgcounter++;
    // alert(parent_class.attr("class")[1]);
    if (addimgcounter % 2 == 0) {
      big_parent.append(
        '<div class="label-wrapper a"><label id="option"> <div class="addimage-block" id="addimg' +
          (addimgcounter + 1) +
          '"> <div class="bg-add-img"></div></div></label></div>'
      );
      parent_block.addClass("b");
      var x = document.getElementById("hey").parentElement;
      x.parentElement.classList.remove("a");
      console.log(parent_block.attr("class")[1]);
    } else {
      big_parent.append(
        '<div class="label-wrapper b"><label id="option"> <div class="addimage-block" id="addimg' +
          (addimgcounter + 1) +
          '"> <div class="bg-add-img"></div></div></label></div>'
      );
      var big_big_parent = big_parent.parent();
      big_parent.after(
        '<div class="label-grid-wrapper"><div class="label-wrapper a"><label id="option"><div class="extraimgblock" id="hey">     <div class="addextra-img"></div></div></label></div>'
      );
    }
  });
});
