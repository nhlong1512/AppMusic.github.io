/*
1. Render songs ==> Done
2. Scroll top ==> Done
3. Play/ pause / seek ==> Done
4. CD rotate ==> Done
5. Next / prev ==> Done
6. Random ==> Done
7. Next/ Repeat when ended ==>Done
8. Active song ==> Done
9. Scroll active song into view ==> Done
10. Play song when click ==>Done
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const player = $('.player')
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Phố Mùa Đông",
            singer: "Hà Anh Tuấn",
            path: "./Music/Song1.mp3",
            image: "./Img/HAT1.jpg"
        },
        {
            name: "LK Đà Lạt Hoàng Hôn - Bài Thánh Ca Buồn",
            singer: "Hà Anh Tuấn",
            path: "https://tainhac123.com/download/lk-da-lat-hoang-hon-bai-thanh-ca-buon-live-ha-anh-tuan.AB3jNVnHv4L5.html",
            image: "./Img/HAT2.jpg"
        },
        {
            name: "Người Tình Mùa Đông",
            singer: "Hà Anh Tuấn",
            path: "./Music/Song3.mp3",
            image: "./Img/HAT3.jpg"
        },
        {
            name: "Chuyện Của Mùa Đông",
            singer: "Hà Anh Tuấn",
            path: "./Music/Song4.mp3",
            image: "./Img/HAT4.jpg"
        },
        {
            name: "Phố Sương Mù",
            singer: "Hà Anh Tuấn",
            path: "./Music/Song5.mp3",
            image: "./Img/HAT5.jpg"
        },
        {
            name: "Xuân Thì",
            singer: "Hà Anh Tuấn",
            path: "./Music/Song6.mp3",
            image: "./Img/HAT6.jpg"
        },
        {
            name: "Chưa Bao Giờ",
            singer: "Hà Anh Tuấn",
            path: "./Music/Song7.mp3",
            image: "./Img/HAT7.jpg"
        },
        {
            name: "Đi Đâu Để Thấy Hoa Bay",
            singer: "Hà Anh Tuấn",
            path: "./Music/Song8.mp3",
            image: "./Img/HAT8.jpg"
        },
        {
            name: "Giấc Mơ Chỉ Là Giấc Mơ",
            singer: "Hà Anh Tuấn",
            path: "./Music/Song9.mp3",
            image: "./Img/HAT9.jpg"
        },
        {
            name: "Cơn Mưa Tình Yêu",
            singer: "Hà Anh Tuấn",
            path: "./Music/Song10.mp3",
            image: "./Img/HAT10.jpg"
        }
    ],
    // setConfig: function(key, vaule){
    //     this.config[key] = vaule
    //     localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    // },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
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
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lý CD quay và dừng
        const cdThumbAnimation = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,//10 seconds
            iterations: Infinity//Lặp vô hạn lần
        })
        cdThumbAnimation.pause()

        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop  
            if(newCdWidth <=0 ){
                cd.style.width = 0 + 'px'
            }else cd.style.width = newCdWidth +'px'
            cd.style.opacity = newCdWidth / cdWidth
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
            cdThumbAnimation.play()
        }

        //Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimation.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
           if(audio.duration){
               const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
               progress.value = progressPercent
           }
        }

        //Xử lý khi tua song 
        progress.onchange = function(e){
            const seekTime =  e.target.value/100 * audio.duration
            // console.log(seekTime)
            audio.currentTime = seekTime
        }

        //Xử lý prev Song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()
        }

        //Xử lý next Song 
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render();
            _this.scrollToActiveSong()
        }

        //Xử lý khi bấm vào nút Random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            // _this.setConfig('isRandom', _this.isRandom)  
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //Xử lý khi bấm vào nút Repeat
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            // _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xử lý nextSong khi onended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click();
            }
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //Xử lý khi click vào song
                if(songNode){
                    // console.log(songNode.dataset.index)
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
                block: 'nearest',
            })
        }, 300)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) this.currentIndex = 0
        this.loadCurrentSong();
    },

    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0) this.currentIndex = this.songs.length -1
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong();
    },

    start: function () {
        //Gán cấu hình từ config vào ứng dụng
        // this.loadConfig();

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        
        //Lắng nghe, xử lý các sự kiện (DOM Events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render Playlist
        this.render();

        //Hiển thị trạng thái ban đầu cho button repeat & random
        // randomBtn.classList.toggle('active', this.isRandom);
        // repeatBtn.classList.toggle('active', this.isRepeat);
    }

}

app.start();

/* **Lưu ý sửa một số bug trong app cần fix sau khi thi xong :D
1. Tìm hiểu về lỗi GET http://127.0.0.1:5500/favicon.ico 404 (Not Found)
mỗi khi vào chạy app ở mục console và fix.
2. Tua nhạc thường bị lỗi phải bấm nhiều lần mới được
3. Nút Repeat và nút Shuffle cùng active
4. Shuffle chưa tối ưu, 
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