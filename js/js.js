// <-- player -->
const playBtn = $(".player__play-btn");
const playerSplash = $(".player__splash");

const playerControls = $(".player__controls");

const playerProgress = $(".player__progress");
const playerVolumeLine = $(".player__volume-line");

const playerProgressCurrent = $(".player__timeline .player__current");
const playerVolumeCurrent = $(".player__volume .player__current");

const playerProgressHandler = $(".player__progress-handler");
const playerVolumeHandler = $(".player__volume-handler");

const playerVolumeBtn = $(".player__volume-btn");

let player = null;
let targetPressed = null;
let lastVolume = 0;
let preventProgressUpdate = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player-display", {
    height: "100%",
    width: "100%",
    videoId: "pdFmUeJZs_Q",
    playerVars: {
      controls: 0,
      modestbranding: 0,
      rel: 0,
      showinfo: 0,
      autoplay: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady() {
  playBtn.on("click", function () {
    if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  });

  const getOnMouseDown = (elem) => {
    return () => {
      targetPressed = elem;
    };
  };

  playerProgressHandler.on("mousedown", getOnMouseDown(playerProgressHandler));
  playerProgressHandler.on("touchstart", getOnMouseDown(playerProgressHandler));

  playerVolumeHandler.on("mousedown", getOnMouseDown(playerVolumeHandler));
  playerVolumeHandler.on("touchstart", getOnMouseDown(playerVolumeHandler));

  const onMouseMove = (e) => {
    if (targetPressed != null) {
      let mx = 0;
      if (e.type === "touchmove") {
        mx = e.touches[0].pageX;
      } else {
        mx = e.pageX;
      }

      if (targetPressed.is(playerProgressHandler)) {
        const x = mx - playerProgress.offset().left;

        const width = playerProgress.width();
        const f = x / width;
        const dur = player.getDuration();

        setPlayerElapsedTime(f * dur);
      } else if (targetPressed.is(playerVolumeHandler)) {
        const x = mx - playerVolumeLine.offset().left;
        const width = playerVolumeLine.width();

        const f = x / width;

        player.setVolume(f * 100);
      }
    }
  };

  playerControls.on("mousemove", onMouseMove);
  playerControls.on("touchmove", onMouseMove);

  const onMouseUp = () => {
    targetPressed = null;
  };

  playerControls.on("mouseup", onMouseUp);
  playerControls.on("mouseleave", onMouseUp);
  playerControls.on("touchend", onMouseUp);

  playerProgress.on("click", function (e) {
    const x = e.pageX - playerProgress.offset().left;
    const width = playerProgress.width();
    const f = x / width;
    const dur = player.getDuration();

    setPlayerElapsedTime(f * dur);
  });

  playerVolumeLine.on("click", function (e) {
    const x = e.pageX - $(this).offset().left;
    const width = $(this).width();
    const v = (x / width) * 100;

    player.setVolume(Math.floor(v));
  });

  playerVolumeBtn.on("click", function () {
    if (player.getVolume() === 0) {
      player.setVolume(lastVolume);
    } else {
      lastVolume = player.getVolume();
      player.setVolume(0);
    }
  });

  setInterval(() => {
    if (
      player.getPlayerState() === YT.PlayerState.PLAYING &&
      !preventProgressUpdate
    ) {
      updatePlayerProgress();
    }

    preventProgressUpdate = false;

    updateVolume();
  }, 10);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    playBtn.addClass("player__play-btn--pause");
    playerSplash.hide();
  } else if (
    event.data === YT.PlayerState.PAUSED ||
    event.data === YT.PlayerState.ENDED
  ) {
    playBtn.removeClass("player__play-btn--pause");
    playerSplash.show();

    if (event.data === YT.PlayerState.ENDED) {
      player.seekTo(0);
      player.pauseVideo();
    }
  }
}

function updatePlayerProgress(time) {
  if (time == null) {
    time = player.getCurrentTime();
  }

  const dur = player.getDuration();
  if (dur === 0) {
    playerProgressCurrent.css("width", "0%");
  }

  const f = time / dur;

  playerProgressCurrent.css("width", `${f * 100}%`);

  preventProgressUpdate = true;
}

function updateVolume() {
  let v = player.getVolume();

  playerVolumeCurrent.css("width", `${v}%`);
}

function setPlayerElapsedTime(time) {
  player.seekTo(time);

  updatePlayerProgress(time); // force update
}



// <-- screen-menu -->
class ScreenMenu {
  constructor(selector){
    this.menu = document.querySelector(selector)
  
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-menu]')
  
    if (target) {
      const event = target.dataset.menu
  
      this[event]()
    }
  })  
  }
  
  open() {
    this.menu.classList.add('open')
    document.body.style.overflow="hidden"
  }
  
  close() {
    this.menu.classList.remove('open')
    document.body.style.overflow="initial"
  }
  }
  
  var menu = new ScreenMenu('#screen-menu')
