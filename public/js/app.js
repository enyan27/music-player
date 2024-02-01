const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "君の夜をくれ",
      singer: "25時、ナイトコードで。× 巡音ルカ",
      path: "https://static.wikia.nocookie.net/projectsekai/images/3/30/Kimi_no_yoruwo_kure_%28Game_Version_-_25-ji%2C_Nightcord_de.%29.ogg/revision/latest?cb=20220829212604",
      image: "https://static.wikia.nocookie.net/projectsekai/images/f/fd/Kimi_no_yoruwo_kure_Game_Cover.png/revision/latest?cb=20220820125729"
    },
    {
      name: "drop pop candy",
      singer: "Vivid BAD SQUAD × 鏡音リン × 巡音ルカ",
      path: "https://static.wikia.nocookie.net/projectsekai/images/0/03/Drop_pop_candy_%28Game_Version_-_Vivid_BAD_SQUAD%29.ogg/revision/latest?cb=20210208082042",
      image: "https://static.wikia.nocookie.net/projectsekai/images/e/ef/Drop_pop_candy_Game_Cover.png/revision/latest?cb=20210129123849"
    },
    {
      name: "シネマ",
      singer: "Vivid BAD SQUAD × KAITO",
      path: "https://static.wikia.nocookie.net/projectsekai/images/d/d8/Cinema_%28Game_Version_-_Vivid_BAD_SQUAD%29.ogg/revision/latest?cb=20220216094805",
      image: "https://static.wikia.nocookie.net/projectsekai/images/1/1c/Cinema_Game_Cover.png/revision/latest?cb=20210508120450"
    },
    {
      name: "金木犀",
      singer: "Vivid BAD SQUAD × 鏡音レン",
      path: "https://static.wikia.nocookie.net/projectsekai/images/a/a6/Kinmokusei_%28Game_Version_-_Vivid_BAD_SQUAD%29.ogg/revision/latest?cb=20240101101734 ",
      image: "https://static.wikia.nocookie.net/projectsekai/images/6/68/Kinmokusei_Game_Cover.png/revision/latest?cb=20231231095135"
    },
    {
      name: "ももいろの鍵",
      singer: "MORE MORE JUMP × 巡音ルカ",
      path: "https://static.wikia.nocookie.net/projectsekai/images/0/0d/Event_092_bgm.ogg/revision/latest?cb=20230422163559",
      image: "https://static.wikia.nocookie.net/projectsekai/images/e/ef/Momoiro_no_Kagi_Game_Cover.png/revision/latest?cb=20230428142419"
    },
    {
      name: "ノマド",
      singer: "25時、ナイトコードで。× 鏡音リン",
      path: "https://static.wikia.nocookie.net/projectsekai/images/4/42/Event_053_bgm.ogg/revision/latest?cb=20220902004423",
      image: "https://static.wikia.nocookie.net/projectsekai/images/6/60/Nomad_Game_Cover.png/revision/latest?cb=20220319202124"
    },
    {
      name: "ロウワー",
      singer: "25時、ナイトコードで。 × MEIKO",
      path: "https://static.wikia.nocookie.net/projectsekai/images/3/35/Event_039_bgm.ogg/revision/latest?cb=20220902013154",
      image: "https://static.wikia.nocookie.net/projectsekai/images/7/7b/Lower_Game_Cover.png/revision/latest?cb=20211029070048"
    }
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý lặp lại một song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {

        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    this.loadConfig();

    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

    this.render();

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  }
};

app.start();