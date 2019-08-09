console.log(poll_code);
var file = location.pathname.split("/").pop();
var link = document.createElement("link");
link.href =
  "https://thinkpolls.herokuapp.com/static/poll_detail/css/pollview.css";
link.type = "text/css";
link.rel = "stylesheet";
link.media = "screen,print";
document.getElementsByTagName("head")[0].appendChild(link);
var lister = [];
var local_id;
get_option_data();
console.log(localStorage.getItem("thinkpolls"));
local_id = set_local_id();
console.log(localStorage.getItem("thinkpolls"));

//pre submit vote checker


document.getElementById('thinkpolls-submit').onclick = function () {

  radio_input_list = document.getElementsByName("option_value");
  radio_checker = false;
  for (i = 0; i < radio_input_list.length; i++) {
    console.log(radio_input_list[i].checked);
    if (radio_input_list[i].checked) {
      radio_checker = true;
    }
  }

  if (radio_checker) {
    submitvote()
  } else {
    alert("please select a option");
  }

}
//end of pre submit vot checker






function submitvote() {
  var radio_options = document.getElementsByName("option_value");
  var total_votes = 0;
  var result_percent;
  var result_votes;
  for (i = 0; i < radio_options.length; i++) {
    if (radio_options[i].checked) {
      console.log(radio_options[i].value);
      var option_checked = radio_options[i].value;
    }
  }

  var opt_cls = document.getElementsByClassName("option");
  for (i = 0; i < opt_cls.length; i++) {
    if (option_checked == opt_cls[i].innerText) {
      var result_percent = opt_cls[i].nextSibling.firstChild;
      var result_votes = opt_cls[i].nextSibling.lastChild.firstChild;
      result_votes.innerText++;
      console.log(result_percent);
      console.log(result_votes);
    }

    total_votes =
      parseInt(opt_cls[i].nextSibling.lastChild.firstChild.innerText) +
      total_votes;
  }
  for (i = 0; i < opt_cls.length; i++) {
    var result_votes = opt_cls[i].nextSibling.lastChild.firstChild;

    var result_percent = opt_cls[i].nextSibling.firstChild;
    result_percent.innerHTML =
      ((parseInt(result_votes.innerText) * 100) / total_votes).toFixed(1) + "%";
    opt_cls[i].lastChild.style.width =
      ((parseInt(result_votes.innerText) * 100) / total_votes).toFixed(1) + "%";
  }

  var request = new XMLHttpRequest();
  request.open(
    "POST",
    "https://thinkpolls.herokuapp.com/" + poll_code + "/api/option_submit",
    true
  );
  console.log("clicked");
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      console.log("submitted");
      var resp = request.responseText;
    } else {
      // We reached our target server, but it returned an error
      var resp = request.responseText;
      console.log(resp);
    }
  };

  request.onerror = function () {
    // There was a connection error of some sort
  };
  request.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded; charset=UTF-8"
  );
  data = JSON.stringify({ option_value: String(option_checked) });
  request.send(data);

  //show result
  var result_block = document.getElementsByClassName("all_result_wrapper")[0];
  var form_block = document.getElementById("form-block");
  form_block.style.transform = " translateX(-100%)";
  result_block.style.transform = "translateX(9%)";
  var vote_btn = document.getElementsByClassName("submit-button")[0];
  vote_btn.style.display = "none";
  sbt_btn_block = vote_btn.parentNode;
  poll_link = document.createElement("a");
  poll_link.setAttribute("href", "https://thinkpolls.herokuapp.com/" + poll_code);
  poll_link.innerHTML = "share";
  poll_link.setAttribute("target", "_blank");
  poll_link.setAttribute("class", "submit-button");
  sbt_btn_block.appendChild(poll_link);
  setcookie();
  change_cookie();
}
//function to get data
function get_option_data() {
  var request = new XMLHttpRequest();
  var jsonObject;
  request.open(
    "GET",
    "https://thinkpolls.herokuapp.com/" + poll_code + "/api/poll_details",
    true
  );

  request.onload = function () {
    var json = JSON.parse(request.responseText);
    console.log(json.options);
    jsonObject = json.options;
    var keyCount = Object.keys(jsonObject).length;
    console.log(keyCount);
    lister.push(json);
    show_results(jsonObject);

    //end of load html results
  };

  request.onerror = function () {
    // There was a connection error of some sort
  };

  request.send();
}
//end of function get data
//show results block
function show_results(option_list) {
  var keyCount = Object.keys(option_list).length;
  var total_votes = 0;
  var vote_counter = 0;
  for (i = 0; i < keyCount; i++) {
    vote_counter = parseInt(option_list[i].votes);
    total_votes = total_votes + vote_counter;
  }
  console.log(total_votes);
  parent = document.getElementsByClassName("poll-option-wrapper")[0];
  all_result_wrapper = document.createElement("div");
  all_result_wrapper.classList.add("all_result_wrapper");
  parent.appendChild(all_result_wrapper);
  for (i = 0; i < keyCount; i++) {
    // parent = document.getElementById("form-block");
    label_result_wrapper = document.createElement("div");
    label_result_wrapper.classList.add("label-result-wrapper");
    label_div = document.createElement("div");
    label_div.classList.add("option");
    label_div.innerHTML = option_list[i].option;
    label_background = document.createElement("div");
    label_background.classList.add("label-background");
    label_background.style.width =
      (option_list[i].votes / total_votes) * 100 + "%";
    label_div.appendChild(label_background);
    label_result_wrapper.appendChild(label_div);
    result_percent_block = document.createElement("div");
    result_percent_block.classList.add("result-percent-block");
    div = document.createElement("div");
    div.innerHTML =
      ((option_list[i].votes * 100) / total_votes).toFixed(1) + "%";
    result_percent_block.appendChild(div);
    result_no_votes = document.createElement("div");
    result_no_votes.classList.add("result-votes");
    result_no_vote_int = document.createElement("div");
    result_no_vote_int.innerHTML = option_list[i].votes;
    result_no_string = document.createElement("span");
    result_no_string.innerHTML = "votes";
    result_percent_block.appendChild(result_no_votes);
    label_result_wrapper.appendChild(result_percent_block);
    result_no_votes.appendChild(result_no_vote_int);
    result_no_votes.appendChild(result_no_string);
    all_result_wrapper.appendChild(label_result_wrapper);
  }
}
//end of function show results block

function change_cookie() {
  console.log(localStorage.getItem("thinkpolls"));
  old_id = localStorage.getItem("thinkpolls");
  new_id = old_id + "-" + poll_code;
  console.log(new_id);
  localStorage.setItem("thinkpolls", new_id);
}

function vote_checker() {
  old_id = localStorage.getItem("thinkpolls");
  poll_url = poll_code;
  flag = old_id.search(poll_url);
  if (flag == -1) {
    return true;
  } else {
    return false;
  }
}
setTimeout(show_results_checked, 2000);
//show results if already voted
function show_results_checked() {
  if (vote_checker() != true) {
    result_block = document.getElementsByClassName("all_result_wrapper")[0];
    form_block = document.getElementById("form-block");
    form_block.style.transform = " translateX(-100%)";
    result_block.style.transform = " translateX(9%)";
    vote_btn = document.getElementsByClassName("submit-button")[0];
    vote_btn.style.display = "none";
    sbt_btn_block = vote_btn.parentNode;
    poll_link = document.createElement("a");
    poll_link.setAttribute(
      "href",
      "https://thinkpolls.herokuapp.com/" + poll_code
    );
    poll_link.setAttribute("target", "_blank");
    poll_link.setAttribute("class", "submit-button");
    poll_link.innerHTML = "share";
    sbt_btn_block.appendChild(poll_link);
  }
}

function setcookie() {
  if (local_id == null) {
    local_id = set_local_id();
    setcookie();
  } else {
    if (local_id.length > 31) {
      local_id = local_id.substr(0, 30);
    }

    iframe_src =
      "https://thinkpolls.herokuapp.com/iframe/" + local_id + "-" + poll_code;
    console.log(iframe_src);
    iframe_gen = document.createElement("iframe");
    iframe_gen.style.display = "none";
    iframe_gen.setAttribute("src", iframe_src);
    document
      .getElementsByClassName("all_result_wrapper")[0]
      .appendChild(iframe_gen);
  }
}

function rdn_gen(len) {
  // list containing characters for the random string
  var stringArray = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "4",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];

  var rndString = "";

  // build a string with random characters
  for (var i = 1; i < len; i++) {
    var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
    rndString = rndString + stringArray[rndNum];
  }
  return rndString;
}

function set_local_id() {
  if (localStorage.getItem("thinkpolls") == null) {
    localStorage.setItem("thinkpolls", rdn_gen(30));
    local_id = localStorage.getItem("thinkpolls");
    return localStorage.getItem("thinkpolls");
  } else {
    local_id = localStorage.getItem("thinkpolls");
    return localStorage.getItem("thinkpolls");
  }
}
