/*
1. Render songs ==> Done
2. Scroll top ==> DOne
3. Play/ pause / seek ==>Done
4. CD rotate ==> Done
5. Next / prev ==> Done
6. Random ==> Done
7. Next/ Repeat when ended ==> Done
8. Active song ==> Done
9. Scroll active song into view ==> Done
10. Play song when click ==> Done

11.
 **Lưu ý sửa một số bug trong app cần fix sau khi thi xong :D
1. Tìm hiểu về lỗi GET http://127.0.0.1:5500/favicon.ico 404 (Not Found)
mỗi khi vào chạy app ở mục console và fix. ==> Done
2. Tua nhạc thường bị lỗi phải bấm nhiều lần mới được  ==> Done
3. Nút Repeat và nút Shuffle cùng active
4. Shuffle chưa tối ưu
nên đưa tất cả bài nhạc vào một mảng
mỗi khi nó chạy thì lại remove nó ra cho đến
khi mảng về rỗng thì reset quá trình
5. Nên Css thêm cho prev và next Btn, sao cho khi bấm cảm giác được 
rằng mình đã bấm vào
6. Css Hover cho những nút
7. Mỗi lần active cho các bài nhạc khác thường phải render lại
8. Phần active nhạc thì sẽ scroll đến bài đó nhưng lại chưa tối ưu
9. Xử lý click option những bài khác sẽ không nhận(dòng 253)
9. Thêm các tính năng vào option 3 chấm 
*/


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Cảm Ơn Và Xin Lỗi",
            singer: "Chillies",
            path: "https://tainhac365.org/download-music/195263",
            image: "https://avatar-ex-swe.nixcdn.com/song/2019/07/25/0/e/3/2/1564036625572_640.jpg"
        },
        {
            name: "Giữa Đại Lộ Đông Tây",
            singer: "Uyên Linh",
            path: "https://tainhac365.org/download-music/454928",
            image: "https://e.dowload.vn/data/image/2021/03/20/loi-bai-hat-giua-dai-lo-dong-tay-700.jpg"
        },
        {
            name: "Tháng Mấy Anh Nhớ Em",
            singer: "Hà Anh Tuấn",
            path: "https://tainhac365.org/download-music/459824",
            image: "https://i.ytimg.com/vi/lxFmeBhoA1Y/maxresdefault.jpg"
        },
        {
            name: "Thanh Xuân",
            singer: "Da LAB",
            path: "https://tainhac365.org/download-music/25726",
            image: "https://avatar-nct.nixcdn.com/song/2018/08/24/b/a/9/5/1535121377317_640.jpg"
        },
        {
            name: "Nơi Ấy Bình Yên",
            singer: "Hà Anh Tuấn",
            path: "https://tainhac365.org/download-music/25725",
            image: "https://avatar-nct.nixcdn.com/song/2017/07/18/0/e/e/2/1500362680062_640.jpg"
        },
        {
            name: "Xin Lỗi",
            singer: "Hồ Tiến Đạt",
            path: "https://tainhac365.org/download-music/197707",
            image: "https://avatar-nct.nixcdn.com/song/2017/12/13/6/6/b/e/1513149192270_640.jpg"
        },
        {
            name: "Chưa Bao Giờ",
            singer: "Hà Anh Tuấn",
            path: "https://tainhac365.org/download-music/17078",
            image: "https://avatar-nct.nixcdn.com/song/2017/08/08/0/6/6/b/1502178209742_640.jpg"
        },
        {
            name: "Cầu Hôn",
            singer: "Văn Mai Hương",
            path: "https://tainhac365.org/download-music/100209",
            image: "https://avatar-nct.nixcdn.com/song/share/2019/01/18/6/4/b/7/1547782985971.jpg"
        },
        {
            name: "Chuyện Rằng",
            singer: "Thịnh Suy",
            path: "https://tainhac365.org/download-music/391188",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwwYU_vimhKlY3IfxF6huv2a37bhiQ8Bd57w&usqp=CAU"
        },
        {
            name: "Mùa Yêu Đầu",
            singer: "Đinh Mạnh Ninh",
            path: "https://tainhac365.org/download-music/12431",
            image: "https://avatar-nct.nixcdn.com/singer/avatar/2016/01/25/4/1/1/7/1453715990328_600.jpg"
        }
    ],

    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return`
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
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
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get:function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lý CD quay khi play
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = (newCdWidth / cdWidth)
        }

        //Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        //Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        
        //Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = audio.currentTime / audio.duration * 100
                progress.value = progressPercent
            }
        }

        //Xử lý khi tua bài hát 
        progress.oninput = function (e){
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
            audio.pause()
        }

        progress.onchange = function(e){
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
            audio.play()
        }
        

        //Xử lý khi next song 
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Xử lý khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Xử lý khi random songs
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lý khi repeat songs
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xử lý next khi ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        //Lắng nghe hành vi click vào playlist 
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //Xử lý khi click vào song 
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //Xử lý khi click vào song option
                if(e.target.closest('.option')){

                }
            }
        }
    },

    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'center',
            })
        }, 200)
    },


    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path 
    },

    loadConfig:function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex 
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function(){
        //Tải cấu hình từ config vào ứng dụng
        this.loadConfig();

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        //Lắng nghe / Xử lý các sự kiện trong Dom Events
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()

        //Hiển thị trạng thái ban dầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },
}

app.start()

