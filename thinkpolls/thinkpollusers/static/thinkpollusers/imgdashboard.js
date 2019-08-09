function show_data(o) {
  console.log(o);
  data_shown_input = o.nextElementSibling;
  if (data_shown_input.checked) {
    console.log("already viewed");
  } else {
    data_shown_input.checked = true;
    a_tag = o.nextElementSibling.nextElementSibling;
    console.log(a_tag);
    img_data_wrapper = a_tag.nextElementSibling.nextElementSibling;
    link_url = a_tag.getAttribute("href");

    poll_code = link_url.split("/")[3];

    img_poll_data_url =
      "https://thinkpolls.herokuapp.com/imagepoll/" +
      poll_code +
      "/api/imgpoll_details";

    var request = new XMLHttpRequest();
    request.open("GET", img_poll_data_url, true);

    request.onload = function() {
      console.log(poll_code);
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var data = JSON.parse(this.response);
        console.log(data.imageoptions);
        console.log(data.imageoptions[0].votes[0]);
        option_length = data.imageoptions.length;
        var total_votes = 0;
        for (j = 0; j < option_length; j++) {
          total_votes = total_votes + parseInt(data.imageoptions[j].votes[0]);
        }
        if (total_votes == 0) {
          total_votes = 1;
        }
        console.log(total_votes);
        for (i = 0; i < option_length; i++) {
          img_vote_wrapper = document.createElement("div");
          img_vote_wrapper.setAttribute("class", " img-vote-wrapper");
          //
          console.log(data.imageoptions[i].image_option_url);
          img = document.createElement("img");
          img.setAttribute("src", data.imageoptions[i].image_option_url);
          //
          vote_bk = document.createElement("div");
          vote_bk.setAttribute("class", "vote-bk ");
          //
          vote_width = document.createElement("div");
          vote_width.setAttribute("class", "vote-width ");
          vote_width.style.width =
            ((data.imageoptions[i].votes[0] * 100) / total_votes).toFixed(0) +
            "%";
          ///
          vote_value = document.createElement("div");
          vote_value.setAttribute("class", "vote-value ");
          vote_value.innerHTML = (
            (data.imageoptions[i].votes[0] * 100) /
            total_votes
          ).toFixed(0);
          span = document.createElement("span");
          span.innerHTML = "%";
          vote_value.appendChild(span);
          //
          vote_result = document.createElement("div");
          vote_result.setAttribute("class", "vote-result");
          vote_result.innerHTML = data.imageoptions[i].votes[0] + "  votes";
          //
          vote_bk.appendChild(vote_width);
          vote_bk.appendChild(vote_value);
          vote_bk.appendChild(vote_result);
          //
          img_vote_wrapper.appendChild(img);
          img_vote_wrapper.appendChild(vote_bk);
          img_data_wrapper.append(img_vote_wrapper);
        }
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();
  }
}
