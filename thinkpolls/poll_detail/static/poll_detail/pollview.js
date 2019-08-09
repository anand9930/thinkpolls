$(document).ready(function () {
  //submit-btn
  $("#poll_submit").click(function () {
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
    $(".embed-copy-block").css({ display: "none" });
  }
  function showmodal() {
    $(".modal-bg").css({
      display: "flex"
    });
  }
  $(".share-block").click(function () {
    $("#copylink >.modal-block-wrapper> .modal-text ").html("Copy link");
    $(".embed-copy-block button").html("copy embed code");
    showmodal();
  });
  $(".modal-bg").click(function () {
    closemodal();
  });
  $(".modal-section").click(function (e) {
    e.stopPropagation();
  });

  $(".modal-block").click(function (e) {
    e.stopPropagation();
    showmodal();
  });
  $(".embed-copy-block").click(function (e) {
    e.stopPropagation();
  });

  $("#copylink").click(function () {
    var current_url = String(window.location.href);
    console.log(current_url);

    navigator.clipboard.writeText(current_url).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );

    $("#copylink >.modal-block-wrapper> .modal-text ").html("Copied!");
    setTimeout(closemodal, 600);
  });

  $("#fbshare").click(function () {
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
  $("#twshare").click(function () {
    tw_sharelink =
      "https://twitter.com/intent/tweet?text=" + window.location.href;
    window.open(tw_sharelink, "_blank");
  });

  $("#washare").click(function () {
    whatsapp_link = "whatsapp://send?text=" + window.location.href;
    window.open(whatsapp_link, "_blank");
  });

  $("#embed").click(function () {
    $(".embed-copy-block").css({ display: "flex" });
    //start embed code generator
    poll_question = document.getElementById("question-block").innerText;
    var radio_options = document.getElementsByName("option_value");
    var poll_url = String(window.location.href);
    var poll_random_string = poll_url.split("/")[3];
    console.log(poll_random_string);
    option_list = [];
    console.log(radio_options.length);
    for (x = 0; x < radio_options.length; x++) {
      console.log(radio_options[x].value);
      option_list.push(radio_options[x].value);
    }
    console.log(poll_question);
    poll_wrapper = document.createElement("div"); //final wrapper
    poll_wrapper.classList.add("poll-wrapper");
    //
    big_parent = document.createElement("div");
    big_parent.classList.add("poll-block");
    poll_wrapper.appendChild(big_parent);
    //
    made_with_love = document.createElement("a");
    made_with_love.classList.add("poll-footer");
    made_with_love.setAttribute("href", "https://www.youtube.com");
    made_with_love.setAttribute("target", "_blank");
    made_with_love.innerHTML =
      'made with <svg id="love-svg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48" style=" fill:#000000;"><path fill="#FF3D00" d="M32.635,8C29.027,8,25.855,9.828,24,12.597C22.145,9.828,18.973,8,15.365,8C9.641,8,5,12.598,5,18.269C5,28.487,21.15,33.411,24,40c2.85-6.589,19-11.428,19-21.731C43,12.598,38.359,8,32.635,8"></path></svg>by thinkpolls<svg id="thinkpolls-svg" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 46 46"><path d="M36.83,1H11.17A10.17,10.17,0,0,0,1,11.17V36.83A10.17,10.17,0,0,0,11.17,47H36.83A10.17,10.17,0,0,0,47,36.83V11.17A10.17,10.17,0,0,0,36.83,1ZM30.18,8.13l4,3.93,3.94-4,1.77,1.77-3.93,4,4,3.93-1.77,1.77-4-3.93-4,4-1.75-1.76,3.93-4-4-3.95ZM13.51,41.9a1.78,1.78,0,1,1,1.77-1.77A1.77,1.77,0,0,1,13.51,41.9Zm2.58-7.84a3.67,3.67,0,0,0-1.26,3.21H12.11c0-2.17-.07-3,1.94-4.95.78-.74,1.39-1.32,1.3-2.47a1.78,1.78,0,0,0-1.84-1.66c-1.46,0-2.08,1.3-2.08,2.89H8.71c0-3.65,2.08-5.51,4.85-5.51s4.64,1.68,4.61,4.4A6,6,0,0,1,16.09,34.06ZM13.38,19.58a5.31,5.31,0,1,1,5.31-5.31A5.3,5.3,0,0,1,13.38,19.58ZM31.67,41.84l-5.48-5.32,2.26-2.26,3.22,3,6.87-7,2.27,2.26Z" transform="translate(-1 -1)"/></svg>';
    poll_wrapper.appendChild(made_with_love);
    //
    question_block = document.createElement("div");
    question_block.classList.add("question-block");
    question_block.innerHTML = poll_question;
    big_parent.appendChild(question_block);
    //
    poll_option_wrapper = document.createElement("div");
    poll_option_wrapper.classList.add("poll-option-wrapper");
    big_parent.appendChild(poll_option_wrapper);

    //
    form_block = document.createElement("form");
    form_block.setAttribute("id", "form-block");
    poll_option_wrapper.appendChild(form_block);
    //
    space_bar = document.createElement("div");
    space_bar.classList.add("space-bar");
    form_block.appendChild(space_bar);
    //
    for (i = 0; i < option_list.length; i++) {
      label_wrapper = document.createElement("div");
      label_wrapper.classList.add("label-wrapper");
      form_block.appendChild(label_wrapper);
      //
      //  <input type="radio" name="option_value" id="yo_1" value="fjftjft" />;
      input_radio = document.createElement("input");
      input_radio.setAttribute("type", "radio");
      input_radio.setAttribute("id", poll_random_string + i);
      input_radio.setAttribute("name", "option_value");
      input_radio.setAttribute("value", option_list[i]);
      label_wrapper.appendChild(input_radio);
      //
      radio_block = document.createElement("div");
      radio_block.classList.add("radio-block");
      // $(".radio-block").html(
      //  '<span class="rbo"><div class="svg-background"><svg width="24px" height="23px" viewBox="0 0 12 11"><polyline points="1 6.29411765 4.5 10 11 1"></polyline></svg></div></span>'
      // );
      radio_block.innerHTML =
        '<span class="rbo"><div class="svg-background"><svg width="24px" height="23px" viewBox="0 0 12 11"><polyline points="1 6.29411765 4.5 10 11 1"></polyline></svg></div></span>';
      label_wrapper.appendChild(radio_block);

      //
      //   <label for="yo_2" id="option" class="option-value" value="jtfjfj">
      //    jtfjfj
      //  </label>;

      label = document.createElement("label");
      label.setAttribute("for", poll_random_string + i);
      label.setAttribute("id", "option");
      label.setAttribute("class", "option-value");
      label.setAttribute("value", option_list[i]);
      label.innerHTML = option_list[i];
      label_wrapper.appendChild(label);
    }
    //
    sbt_block = document.createElement("div");
    sbt_block.classList.add("sbt-block");
    poll_option_wrapper.appendChild(sbt_block);

    //
    btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "submit-button");
    btn.setAttribute("id", "thinkpolls-submit");
    btn.innerHTML = "vote";
    sbt_block.appendChild(btn);

    //end of embed code generator

    embed_html = poll_wrapper.outerHTML;
    var script_poll_code = document.createElement("script");
    script_poll_code.innerHTML =
      "var poll_code='" + String(window.location.href).split("/")[3] + "'";

    var script_src = document.createElement("script");
    script_src.setAttribute(
      "src",
      "https://www.thinkpolls.com/static/poll_detail/embed.js"
    );
    console.log(script_poll_code, script_src);
    embed_code = embed_html + script_poll_code.outerHTML + script_src.outerHTML;
    $(".embed-copy-block textarea").val(embed_code);

    $(".embed-copy-block button").click(function () {
      console.log(embed_code);
      navigator.clipboard.writeText(embed_code).then(
        function () {
          console.log("Async: Copying to clipboard was successful!");
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );

      $(".embed-copy-block button").html("copied!");
      setTimeout(closemodal, 650);
    });
  });
});
