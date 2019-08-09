$(document).ready(function() {
  //submit-btn
  //submit-btn
  $("#poll_submit").click(function() {
    radio_input_list = document.getElementsByClassName("input-option");
    radio_checker = false;
    for (i = 0; i < radio_input_list.length; i++) {
      console.log(radio_input_list[i].checked);
      if (radio_input_list[i].checked) {
        radio_checker = true;
      }
    }

    if (radio_checker) {
      document.getElementById("ckbox").checked = true;
      $("#poll_form").submit();
    } else {
      alert("please select a option");
    }
  });

  function closemodal() {
    $(".modal-bg").css({
      display: "none"
    });
  }
  function showmodal() {
    $(".modal-bg").css({
      display: "flex"
    });
  }
  $(".share-block").click(function() {
    $("#copylink >.modal-block-wrapper> .modal-text ").html("Copy link");
    showmodal();
  });
  $(".modal-bg").click(function() {
    closemodal();
  });
  $(".modal-section").click(function(e) {
    e.stopPropagation();
  });

  $("#copylink").click(function() {
    var current_url = String(window.location.href);
    console.log(current_url);

    navigator.clipboard.writeText(current_url).then(
      function() {
        console.log("Async: Copying to clipboard was successful!");
      },
      function(err) {
        console.error("Async: Could not copy text: ", err);
      }
    );

    $("#copylink >.modal-block-wrapper> .modal-text ").html("Copied!");
    setTimeout(closemodal, 600);
  });

  //fbshare
  $("#fbshare").click(function() {
    appid = "668055086954771";
    href = window.location.href;
    fb_sharelink =
      "https://www.facebook.com/dialog/share?app_id=" +
      appid +
      "&display=popup" +
      "&href=" +
      href +
      "&redirect_uri=" +
      href;
    window.open(fb_sharelink, "_blank");
  });

  //twitter share

  $("#twshare").click(function() {
    tw_sharelink =
      "https://twitter.com/intent/tweet?text=" + window.location.href;
    window.open(tw_sharelink, "_blank");
  });

  //whatsappshare
  $("#washare").click(function() {
    whatsapp_link = "whatsapp://send?text=" + window.location.href;
    window.open(whatsapp_link, "_blank");
  });

  $("#embed").click(function() {
    var html_code = $(".poll-block").html();
    var html_code_with_wrapper =
      "<div class='poll-block'>" + html_code + "</div>";
    navigator.clipboard.writeText(html_code_with_wrapper).then(
      function() {
        console.log("Async: Copying to clipboard was successful!");
      },
      function(err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  });
});
