$(document).ready(function () {
  var id = localStorage.length;

  $("#search").on("click", function () {
    var city = $("#city").val();
    if (city.trim() != "") {
      check(city);
    }
    $("#city").val("");
  });

  function add_list(city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
    localStorage.setItem(id, city);
    id++;
    $("#list").empty();
    render_list();
  }

  function render_list() {
    for (var i = 0; i < localStorage.length; i++) {
      var text = localStorage.getItem(i);
      var btn = $("<button>");
      btn.text(text);
      btn.attr(
        "class",
        "list-group-item list-group-item-action cursor city-button"
      );

      $("#list").append(btn);
    }
  }
  render_list();

  $(".city-button").on("click", function () {
    getData($(this).text());
  });

  function check(city) {
    city.replace(" ", "+");
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=980478c26b1c7dfa008027fe37d9f392&units=imperial",
      method: "GET",
      success: function (data) {
        add_list(data.city.name);
        location.reload();
      },
      error: function () {
        console.log("fail");
        location.reload();
      },
    });
  }

  function getData(city) {
    if (city.includes(" ")) {
      city.replace(" ", "+");
    }
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=980478c26b1c7dfa008027fe37d9f392&units=imperial",
      method: "GET",
      success: function (data) {
        console.log(data);
        $("#content").empty();
        $("#forecast").empty();
        var new_data = data.list[0];
        var content_div = $("<div>");
        content_div.attr("id", "content_div");
        var header = $("<h2>").text(
          data.city.name + " " + new Date().toLocaleDateString()
        );
        var temp = $("<p>").text("Temperature: " + new_data.main.temp + " °F");
        var humidity = $("<p>").text("Humidity: " + new_data.main.humidity);
        var wind_speed = $("<p>").text("Wind Speed: " + new_data.wind.speed);
        var icon =
          "http://openweathermap.org/img/wn/" +
          new_data.weather[0].icon +
          "@2x.png";
        var icon_img = $("<img>").attr("src", icon);
        icon_img.attr("class", "icon");
        header.append(icon_img);
        get_UV(data.city.coord.lat, data.city.coord.lon);
        content_div.append(header, temp, humidity, wind_speed);

        for (var i = 0; i < data.list.length; i += 8) {
          var item = data.list[i];
          five_days(
            item.dt_txt.substring(0, 10),
            item.weather[0].icon,
            item.main.temp,
            item.main.humidity
          );
        }
        var forecast_title = $("<h2>").text("5-Day Forecast");
        $("#content").prepend(content_div, forecast_title);
      },
    });
  }

  function five_days(date, icon, temp, humidity) {
    var day = $("<div>").attr("class", "forecast_style");
    date = date.replaceAll("-", "/");
    date = date.substring(5) + "/" + date.substring(0, 4);
    var date_text = $("<h5>").text(date);
    var icon_img = $("<img>").attr(
      "src",
      "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    );
    var temp_text = $("<p>").text("temp: " + temp + " °F");
    var humidity_text = $("<p>").text("humidity: " + humidity);
    day.append(date_text, icon_img, temp_text, humidity_text);
    $("#content").append(day);
  }

  function get_UV(lat, lon) {
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=980478c26b1c7dfa008027fe37d9f392",
      method: "GET",
      success: function (data) {
        var uv = $("<p>").text("UV Index: " + data[0].value);
        $("#content_div").append(uv);
      },
    });
  }
});
