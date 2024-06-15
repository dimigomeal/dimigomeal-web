let date;

const now = () => {
  const time = date.format("HH:mm:ss");

  if (time < "08:00:00") {
    return 0;
  } else if (time < "14:00:00") {
    return 1;
  } else {
    return 2;
  }
};

const getMeal = (date) => {
  $(`#app`).append(`<div id="loading" class="lds-dual-ring"></div>`);
  $.ajax({
    url: `https://api.디미고급식.com/meal/${date}`,
    type: "GET",
    success: (data) => {
      $(`#list #item #menu #dish`).remove();
      for (const [key, value] of Object.entries(data)) {
        if (!["breakfast", "lunch", "dinner"].includes(key)) continue;

        const menus = value.split(/\/(?![^()]*\))/);
        if (menus.length == 1 && menus[0] == "") {
          $(`#list #item.${key} #menu`).append(
            `<div id="dish">데이터가 없습니다</div>`
          );
          continue;
        }

        for (const menu of menus) {
          $(`#list #item.${key} #menu`).append(
            `<div id="dish"><p id="indicator">-</p><p id="text">${menu}</p></div>`
          );
        }
      }
    },
    error: () => {
      $(`#list #item #menu #dish`).remove();
      $(`#list #item #menu`).append(`<div id="dish">데이터가 없습니다</div>`);
    },
    complete: () => {
      $("#loading").remove();
    },
  });
};

const control = (type) => {
  switch (type) {
    case "today":
      date = moment();
      break;
    case "yesterday":
      date.subtract(1, "day");
      break;
    case "tomorrow":
      date.add(1, "day");
      break;
    default:
      date = moment(type);
      break;
  }

  $("#control #date").text(date.format("M월 D일 ddd요일"));
  getMeal(date.format("YYYY-MM-DD"));
};

const init = () => {
  control();

  let controller = new ScrollMagic.Controller({
    container: "#scroll",
    vertical: false,
    globalSceneOptions: {
      duration: "100%",
    },
  });

  new ScrollMagic.Scene({
    triggerElement: "#item.breakfast",
    triggerHook: 0,
  })
    .setTween(
      TweenMax.fromTo(
        "#background.breakfast",
        1,
        {
          opacity: 1,
        },
        {
          opacity: 0,
        }
      )
    )
    .addTo(controller);

  new ScrollMagic.Scene({
    triggerElement: "#item.lunch",
    triggerHook: 0,
  })
    .setTween(
      TweenMax.fromTo(
        "#background.lunch",
        1,
        {
          opacity: 1,
        },
        {
          opacity: 0,
        }
      )
    )
    .addTo(controller);

  $("#scroll").scrollLeft($("#list #item.breakfast").width() * now());

  $("#control #pre").click(() => control("yesterday"));
  $("#control #next").click(() => control("tomorrow"));
  $("#control #date").click(() => control("today"));

  $(document).keydown(function (e) {
    if (!(e.which >= 37 && e.which <= 40)) return;
    e.preventDefault();
    switch (e.which) {
      case 37:
        control("yesterday");
        break;
      case 39:
        control("tomorrow");
        break;
      case 38:
        $("#scroll").scrollLeft(
          $("#scroll").scrollLeft() - $("#scroll").width()
        );
        break;
      case 40:
        $("#scroll").scrollLeft(
          $("#scroll").scrollLeft() + $("#scroll").width()
        );
        break;
    }
  });
};

$(document).ready(() => {
  init();
});
