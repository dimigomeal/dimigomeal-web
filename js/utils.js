let nowDate = new Date();

const getSec = (hour, minute, second) => {
  return hour * 3600 + minute * 60 + second;
}

const setDateDisplay = () => {
  $('#control #date').text(`${nowDate.getMonth() + 1}월 ${nowDate.getDate()}일 ${['일', '월', '화', '수', '목', '금', '토'][nowDate.getDay()]}요일`);
};

const now = () => {
  const nowTime = new Date();
  const nowSec = getSec(nowTime.getHours(), nowTime.getMinutes(), nowTime.getSeconds());

  if(nowSec < getSec(10, 0, 0)) {
    return {
      code: 0,
      text: 'breakfast'
    };
  } else if(nowSec < getSec(15, 0, 0)) {
    return {
      code: 1,
      text: 'lunch'
    };
  } else {
    return {
      code: 2,
      text: 'dinner'
    };
  }
};

let isFirst = true;
const getMeal = (date) => {
  $(`#app`).append(`<div id="loading" class="lds-dual-ring"></div>`);
  $.ajax({
    url: `https://디미고급식.com/api/${date}`,
    type: 'GET',
    success: (data) => {
      $('#loading').remove();
      $(`#list #item #menu #dish`).remove();
      for(const [key, value] of Object.entries(data.meal)) {
        if(['breakfast', 'lunch', 'dinner'].includes(key)) {
          const menus = value.split('/');
          for(const menu of menus) {
            $(`#list #item.${key} #menu`).append(`<div id="dish"><p id="indicator">-</p><p id="text">${menu}</p></div>`);
          }
        }
      }

      if(isFirst) {
        isFirst = false;
        $('#scroll').scrollLeft($('#list #item.breakfast').width() * now().code);
      }
    },
    error: () => {
      $('#loading').remove();
      $(`#list #item #menu #dish`).remove();
      $(`#list #item #menu`).append(`<div id="dish">데이터가 없습니다</div>`);
    }
  });
}

const init = () => {
  setDateDisplay();
  $('#scroll').scrollLeft($('#list #item.breakfast').width() * now().code);
  let controller = new ScrollMagic.Controller({
    container: '#scroll',
    vertical: false,
    globalSceneOptions: {
      duration: "100%"
    }
  });

  let background1 = TweenMax.fromTo("#background.breakfast", 1, {
    opacity: 1
  }, {
    opacity: 0
  });
  let background2 = TweenMax.fromTo("#background.lunch", 1, {
    opacity: 1
  }, {
    opacity: 0
  });

  let scene1 = new ScrollMagic.Scene({
    triggerElement: "#item.breakfast",
    triggerHook: 0
  })
  .setTween(background1)
  .addTo(controller);
  let scene2 = new ScrollMagic.Scene({
    triggerElement: "#item.lunch",
    triggerHook: 0
  })
  .setTween(background2)
  .addTo(controller);
}; init();

$(document).ready(() => {
  update();
});

const dateString = (date) => {
  const offset = new Date().getTimezoneOffset() * 60000;
  const now = new Date(new Date(date) - offset);
  return now.toISOString().slice(0, 10)
}

const update = () => {
  setDateDisplay();
  getMeal(dateString(nowDate));
};

const next = () => {
  nowDate.setDate(nowDate.getDate() + 1);
  update();
}; $("#control #next").click(next);

const pre = () => {
  nowDate.setDate(nowDate.getDate() - 1);
  update();
}; $("#control #pre").click(pre);

const today = () => {
  nowDate = new Date();
  update();
}; $("#control #date").click(today);

$(document).keydown(function(e){
  e.preventDefault();
  if(e.which == 37) {
    pre();
  }
  if(e.which == 39) {
    next();
  }
  if(e.which == 38) {
    $('#app #scroll').scrollLeft($('#app #scroll').scrollLeft() - $('#app #scroll').width());
  }
  if(e.which == 40) {
    $('#app #scroll').scrollLeft($('#app #scroll').scrollLeft() + $('#app #scroll').width());
  }
});