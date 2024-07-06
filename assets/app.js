const image = document.querySelector('#cover'),
    title = document.querySelector('#music-title'),
    artist = document.querySelector('#music-artist'),
    currentTimeEl = document.querySelector('#current-time'),
    durationEl = document.querySelector('#duration'),
    progress = document.querySelector('#progress'),
    playerProgress = document.querySelector('#player-progress'),
    prevBtn = document.querySelector('#prev'),
    nextBtn = document.querySelector('#next'),
    playBtn = document.querySelector('#play'),
    background = document.querySelector('#bg-img');

const music = new Audio();

const songs = [
    {
        path: 'assets/images/MOTTO!!!.ogg',
        displayName: 'MOTTO!!!',
        cover: 'assets/images/MOTTO!!!.png',
        artist: 'MORE MORE JUMP! × 初音ミク'
    },
    {
        path: 'assets/images/JUMPIN’_OVER!.ogg',
        displayName: 'JUMPIN’ OVER!',
        cover: 'assets/images/JUMPIN’_OVER!.png',
        artist: 'MORE MORE JUMP! × 初音ミク'
    },
];

let musicIndex = 0;
let isPlaying = false;

const togglePlay = () => {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

const playMusic = () => {
    isPlaying = true;
    playBtn.classList.replace('fa-play','fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

const pauseMusic = () => {
    isPlaying = false;
    playBtn.classList.replace('fa-pause','fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

const loadMusic = (song) => {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

const changeMusic = (direction) => {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

const updateProgressBar = () => {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2,'0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

const setProgressBar = (e) => {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);