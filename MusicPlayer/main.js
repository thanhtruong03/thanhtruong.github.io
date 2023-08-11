const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const cdWidth = cd.offsetWidth;
const playBtn = $('.btn-toggle-play');
const playing = $('.player');
const progress = $('#progress');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const songIsClicked = $('.song');

const app = {
    curIndex: 0, //Phát bài hát đầu tiên khi tải trang
    isPlaying: false, //Xét trạng thái đang phát hay chưa phát để xử lí nút Player
    isRandom: false,
    isRepeat: false,
    songs: [ 
        {
          name: "See tình",
          singer: "Hoàng Thùy Linh",
          path: "https://ve60.aadika.xyz/download/5tJyNMF-tWE/mp3/128/1691726787/e05f4bf5d81944707165e3f7cba305626ff3510220f1f9ac6a2bec890e04f51c/1?f=yt5s.io",
          image:
            "https://avatar-ex-swe.nixcdn.com/song/2022/02/20/f/c/1/9/1645341331047_300.jpg"
        },       
        {
          name: "Đau nhất vẫn là lặng im",
          singer: "Erik",
          path: "https://ve42.aadika.xyz/download/yz7vs3Z_Bik/mp3/128/1691726882/e8391830cc59e5aae0614ca89a5e903f7afd4327239c6e94b455a59c5bdde330/1?f=yt5s.io",
          image: "https://avatar-ex-swe.nixcdn.com/song/2022/02/17/9/0/5/9/1645081464853_300.jpg"
        },
        {
          name: "Ngày đầu tiên",
          singer: "Đức Phúc",
          path: "https://ve49.aadika.xyz/download/RL1xLD-kgR4/mp3/128/1691726930/a9dc832c35992dfa5888142a056d80d49f0144417eed405ca3f1af0904387c26/1?f=yt5s.io",
          image: "https://avatar-ex-swe.nixcdn.com/song/2022/02/11/4/8/f/8/1644555869460_300.jpg"
        },
        {
          name: "Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh",
          singer: "Erik",
          path:
            "https://ve43.aadika.xyz/download/6-HBXbi-i8U/mp3/128/1691726972/8c57dfdb95a4b65a5b284941257d9dfce0cee996e50413dac79d4ff88574b3ad/1?f=yt5s.io",
          image: "https://avatar-ex-swe.nixcdn.com/song/2022/01/26/4/e/f/e/1643184497199_300.jpg"
        },
        {
          name: "Making My Way",
          singer: "Sơn Tùng M-TP",
          path: "https://ve61.aadika.xyz/download/niPkap1ozUA/mp3/128/1691734249/289742e4f122efaed883d7084e8232a81d7a6cea2dbb3d7818a1a560e0d4f2d4/1?f=yt5s.io",
          image:
            "https://i.ytimg.com/vi/niPkap1ozUA/mqdefault.jpg"
        },
        {
          name: "Chạy về nơi phía anh",
          singer: "Khắc Việt",
          path:
            "https://ve126.aadika.xyz/download/1LKHcO0QnYI/mp3/128/1691727089/473f28f7dbff5e1793043a3b0fa5d2d9a50a8bdbaaa8113ad422d99ca276cd2c/1?f=yt5s.io",
          image:
            "https://avatar-ex-swe.nixcdn.com/song/2022/02/10/2/a/7/7/1644475457323_300.jpg"
        },
        {
          name: "Waiting for you",
          singer: "Mono",
          path: "https://ve65.aadika.xyz/download/CHw1b_1LVBA/mp3/128/1691734219/e0d5f3d437e5b1ccf701c6f017751938021a589fb7fea0463c048572a8c82412/1?f=yt5s.io",
          image:
            "https://i.ytimg.com/vi/CHw1b_1LVBA/mqdefault.jpg"
        }
    ], 
    render: function() {
      const htmls = this.songs.map((song, index) => {
        return `
          <div class="song ${index === app.curIndex ? 'active' : ''}">
            <div class="thumb" style="background-image: url('${song.image}')"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `
      })
      $('.playlist').innerHTML = htmls.join('');
    },

    defineProperties: function() {
      Object.defineProperty(this, "currentSong", {
        get: function () {
          return this.songs[this.curIndex];
        }
      })
    },

    hanldeEvents: function() {
      document.onscroll = function () {
        const scrollTop = document.documentElement.scrollTop || window.scrollY;
        const newCdWidth = cdWidth  - scrollTop;
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
      }

      //Xử lí CD quay
      const cdSpinning = { transform: 'rotate(360deg)'}
      const cdOptions = {
        duration: 20000, //thời gian quay 20s
        iterations: Infinity //số lần lặp lại
      }
      const cdHandleAnimate = cd.animate(cdSpinning, cdOptions);
      cdHandleAnimate.pause(); //Pause lại khi chưa phát nhạc

      //Xử lí nút play
      playBtn.onclick = function () {
        if (!app.isPlaying) {
          audio.play();
        } else {
          audio.pause();
        }
       }

      //Lắng nghe sự kiện audio đang playing hay pause để xử lí
      audio.onplay = function () {
        app.isPlaying = true; // Đang play thì add trạng thái playing cho nút play
        playing.classList.add('playing');
        cdHandleAnimate.play(); //Khi nhạc play thì bắt đầu quay
      }
      audio.onpause = function () {
        app.isPlaying = false; // Đang không play thì remove trạng thái playing
        playing.classList.remove('playing');
        cdHandleAnimate.pause(); //Khi nhạc pause thì dừng quay
      }

      //Xử lí tua bài hát
      audio.ontimeupdate = function() {
        if (audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
          progress.value = progressPercent;
        }
      }
      progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
      }
      
      //Xử lí lặp lại bài hát
      repeatBtn.onclick = function () {
        app.isRepeat = !app.isRepeat;
        repeatBtn.classList.toggle('active', app.isRepeat);
        app.repeatSong();
        audio.play();
      }

      //Xử lí random bài hát
      randomBtn.onclick = function () {
        app.isRandom = !app.isRandom;
        randomBtn.classList.toggle('active', app.isRandom);
        app.randomSong();
        app.render();
      }

      //Xử lí phát bài hát tiếp theo
      nextBtn.onclick = function () {   
        if (app.isRandom) {
          app.randomSong();
        } else {
          app.nextSong();
        }
        audio.play();
        app.render();
        app.scrollToView();
      }

      //Xử lí phát bài hát trước đó
      prevBtn.onclick = function () {
        if (app.isRandom) {
          app.randomSong();
        } else {
          app.prevSong();
        }
        audio.play();
        app.render();
        app.scrollToView();
      }

      //Xử lí tự chuyển qua bài hát khác khi phát hết bài
      audio.onended = function () {
        if (app.isRandom) {
          app.randomSong();
        } else {
          app.nextSong();
        }
        audio.play();
      }


    },
    
//CÁC HÀM XỬ LÍ
    
    clickSongToPlay: function () {

    },

    scrollToView: function () {
      const songIsActived = $('.song.active');
      songIsActived.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    },

    repeatSong: function () {
      audio.loop = true;
    },

    randomSong: function () {
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * app.songs.length);
      } while(randomIndex === app.curIndex)
      app.curIndex = randomIndex;
      app.loadCurSong();
      audio.play();      
    },
    //Hàm load bài hát tiếp theo
    nextSong: function () {
      app.curIndex++;
      if (app.curIndex >= app.songs.length) {
        app.curIndex = 0;
      }
      app.loadCurSong();
    },

    //Hàm load bài hát trước đó
    prevSong: function () {
      app.curIndex--;
      if (app.curIndex < 0) {
        app.curIndex = app.songs.length - 1;
      }
      app.loadCurSong();
    },

    //Load bài hát lên trình phát nhạc
    loadCurSong: function() {
      heading.textContent = this.currentSong.name; //thay tiêu đề ở thẻ h2 thành tên bài hát đầu tiên trong danh sách bài hát
      cdThumb.style.backgroundImage = `url(${this.currentSong.image})`; //load hình ảnh của bài hát
      audio.src = this.currentSong.path; // load link bài hát
    },
    start: function(){
      this.defineProperties();
      this.hanldeEvents();
      this.loadCurSong();
      this.render();
    }
}
app.start();
