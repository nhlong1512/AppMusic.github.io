/*
1. Render songs ==> Done
2. Scroll top ==> Done
3. Play/ pause / seek ==> Done
4. CD rotate ==> Done
5. Next / prev ==> Done
6. Random ==> Done
7. Next/ Repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
console.log(prevBtn)
console.log(nextBtn)

const app = {
    currentIndex: 0,
    isPlaying: false,
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

    render: function () {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
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
        $('.playlist').innerHTML = htmls.join('');
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
            audio.currentTime = seekTime
        }

        //Xử lý next Song 
        nextBtn.onclick = function(){
            _this.nextSong()
            audio.play()
        }
        //Xử lý prev Song
        prevBtn.onclick = function(){
            _this.prevSong();
            audio.play();
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
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

    start: function () {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        
        //Lắng nghe, xử lý các sự kiện (DOM Events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render Playlist
        this.render();
    }

}

app.start();

