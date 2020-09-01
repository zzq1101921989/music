$(".conter-list").mCustomScrollbar({
    // 禁用或者启用在不使用滚动条的时候隐藏，设置为true为启用，false为禁用。
    autoHideScrollbar: 'true'
});

// 获取存放音乐的父级
let musicCon = document.querySelector("#mCSB_1_container>ul>.music-con");
let musicImg = document.querySelector(".conter-right .song-info>a>img");
let musicName = document.querySelector(".conter-right .song-info>.song-name>a");
let musicPlayer = document.querySelector(".conter-right .song-info>.song-singer>a");
let musicAblum = document.querySelector(".conter-right .song-info>.song-ablum>a");
let musicLable = document.querySelector(".player-music-name");
let musicTimer = document.querySelector(".player-music-timer");

// 获取audio标签
let dio = document.querySelector("audio");
// new 一个播放器
let audio = new PlayerMusic(dio)


// 根据文件遍历每条歌曲
for (let i = 0; i < Music.length; i++) {
	// console.log(Music[i])
	creatMusic(i, Music[i]);
	// 全部歌曲链接装进音乐的构造函数里面去
	audio.audioAyy.push(Music[i].link_url);
}



// 初始化界面信息
function init(musicMsg){
	musicImg.src = musicMsg.cover;
	musicName.innerText = musicMsg.name;
	musicPlayer.innerText = musicMsg.singer;
	musicAblum.innerText = musicMsg.album;
	musicLable.innerText = musicMsg.name + " - " + musicMsg.singer;
	musicTimer.innerText = "00:00 / " + musicMsg.time;
}

// init(Music[0]);

// 创建每一条音乐
function creatMusic(index, music) {
	let musicDom = document.createElement("div");
	musicDom.classList.add("music-list");
	musicDom.innerHTML = '<div class="music-check"></div> <div class="music-number">'+ (index + 1) +'</div><div class="music-name">'+ music.name +'<div class="music-button" style="display: none; opacity: 1;"><a href="javascript:;" title="播放" class="music-play-btn"></a><a href="javascript:;" title="添加"></a><a href="javascript:;" title="下载"></a></div> </div> <div class="music-singer">'+ music.singer +'</div> <div class="music-timer"><span style="display: block;">'+ music.time +'</span> <a href="javascipt:;" title="删除" class="btn-close" style="display: none; opacity: 0.5;"></a></div>'
	musicCon.appendChild(musicDom);
	musicDom.idx = index;
	musicDom.Music = music;
}

let lyricUl = document.querySelector(".conter-right .song-text>ul")
// 创建每一条歌词
// function creatMusicLyric(lyric) {
	// let lyrics = new Lyric(lyric);  Lyric空对象，含有异步请求
	// console.log(lyrics.lyric); 输出的其实是undefined，因为都还没数据处理返回
	// lyrics.lyric.push(....) 是在console之后才处理好，
// 	let inner = "";
// 	lyric.forEach(function (item) {
// 		inner += `<li>${item}</li>`
// 	});
// 	console.log(inner);
// 	lyricUl.appendChild(inner);
// }

// creatMusicLyric(Music[0].link_lrc);

// 创建每一条歌词
function creatMusicLyric(lyric) {
	let lyrics = new Lyric(lyric, function(){
		// console.log(lyrics.lyric);
		let inner = "";
		lyrics.lyric.forEach(function (item) {
			inner += `<li>${item}</li>`
		});
		console.log(inner);
		lyricUl.innerHTML = inner;
	});
	
}

creatMusicLyric(Music[0].link_lrc);


// 获取非当前的其余相同类型的兄弟节点
// 第一个参数是全部的节点数组，第二个参数非当前的兄弟节点数组，第三个是当前所点击所点击的元素
function sibilng(AllDom, sibilngArr, thisDom) {
	for (let i = 0; i < AllDom.length; i++) {
		if (AllDom[i] != thisDom) {
			sibilngArr.push(AllDom[i]);
		}
	}
}


// 每一条歌曲的相关操作 (为了变量不冲突使用块级作用域)
{
	let musicList = document.querySelectorAll(".conter-list .music-list");
	let playerBtn = document.getElementsByClassName("music-play-btn");
	let bigPlayerBtn = document.querySelector(".foot-in .btn-play");
	let nextMusic = document.querySelector(".btn-next");
	let prevMusic = document.querySelector(".btn-prev");
	let musicCon = document.querySelector(".music-con");
	let deleteBtn = document.querySelectorAll(".btn-close");
	let currenIndex = null;
	let start = false;
	// 用来装非当前同类型的兄弟节点
	let sibliArr = [];
	let Musicbg = document.querySelector(".music-bg");
	// 获取播放进度条
	let progressCon = document.querySelector(".player-music-progress");
	let progressLine = document.querySelector(".progress-bar");
	let progressBar = document.querySelector(".progress-dot");
	// 创建一个进度条对象
	let progress = new Progress(progressCon, progressLine, progressBar);
	
	// 当鼠标放上去歌曲中的相关组件显示
	
	for (let i = 0; i < musicList.length; i++) {
		musicList[i].onmouseover = function () {
			this.children[2].children[0].style.display = "block";
			this.children[4].children[0].style.display = "none";
			this.children[4].children[1].style.display = "block";
		};
		musicList[i].onmouseout = function () {
			this.children[2].children[0].style.display = "none";
			this.children[4].children[0].style.display = "block";
			this.children[4].children[1].style.display = "none";
		}
	}
	
	// 歌曲中的播放按钮
	eventEntrust(musicCon, "click", function (e) {
		e = event || window.event;
		
		if (e.target.className === "music-play-btn") {
			sibliArr = [];
			// 渲染一些信息
			init(e.target.parentNode.parentNode.parentNode.Music);
			// 渲染
			Musicbg.style.background = "url("+ e.target.parentNode.parentNode.parentNode.Music.cover +")";
			// 类似jquery的siblings方法,获取当前页面下的所有歌曲
			let sibli = e.target.parentNode.parentNode.parentNode.parentNode.children;
			let currenThis = e.target.parentNode.parentNode.parentNode
			let musicUrl = e.target.parentNode.parentNode.parentNode.Music.link_url;
			let musicText = e.target.parentNode.parentNode.parentNode.Music.link_lrc;
			
			// 获取当前点击歌曲的索引值
			currenIndex = e.target.parentNode.parentNode.parentNode.idx;
			// 利用封装的方法去获取非当前同类型的兄弟节点歌曲
			sibilng(sibli, sibliArr, currenThis);
			
			// 判断是否是当前播放的歌曲，如果是同一首的播放暂停操作，就控制高亮部分
			if (e.target.className == "music-play-btn music-play1") {
				e.target.classList.remove("music-play1");
				bigPlayerBtn.classList.remove("music-play2");
				e.target.parentNode.parentNode.parentNode.childNodes[2].classList.remove("music-number2");
				e.target.parentNode.parentNode.parentNode.style.color = "rgba(225,225,225,0.5)";
			}else{
				e.target.classList.add("music-play1");
				bigPlayerBtn.classList.add("music-play2");
				e.target.parentNode.parentNode.parentNode.childNodes[2].classList.add("music-number2");
				e.target.parentNode.parentNode.parentNode.style.color = "#fff";
			}
			
			for (let i = 0; i < sibliArr.length; i++) {
				// 非当前歌曲的小播放按钮全部去掉class
				sibliArr[i].children[2].children[0].children[0].classList.remove("music-play1");
				sibliArr[i].style.color = "rgba(225,225,225,0.5)"
				sibliArr[i].childNodes[2].classList.remove("music-number2")
			}	
			
			// new一个获取歌词的构造函数
			creatMusicLyric(musicText)
			audio.Player(currenIndex, musicUrl);
		}
	})
	
	// 大播放按钮点击
	bigPlayerBtn.onclick = function () {
		
		if (currenIndex == null) {
			alert("当前没有播放的歌曲");
			return;
		}
		let musicUrl = musicCon.children[audio.playindex].Music.link_url
		// 判断大播放按钮的状态，如果真在播放然后再一次点击的时候
		if(this.className == "btn-play music-play2"){
			
			this.classList.remove("music-play2");
			musicCon.children[audio.playindex].children[2].children[0].children[0].classList.remove("music-play1");
			musicCon.children[audio.playindex].children[1].classList.remove("music-number2");
			musicCon.children[audio.playindex].style.color = "rgba(225,225,225,0.5)"
			
		}
		// 如果不在播放然后再一次点击的时候
		else{
			this.classList.add("music-play2");
			musicCon.children[audio.playindex].children[2].children[0].children[0].classList.add("music-play1");
			musicCon.children[audio.playindex].children[1].classList.add("music-number2");
			musicCon.children[audio.playindex].style.color = "#fff";
		}
		// 播放音乐
		audio.Player(currenIndex, musicUrl);
	}
	
	
	// 下一首点击
	nextMusic.onclick = function () {
		let index = audio.NextMusic();
		if (currenIndex != null) {
			ayutoEvent("click", musicCon.children[index].children[2].children[0].children[0]);
		}
	}
	prevMusic.onclick = function () {
		let index = audio.PrevMusic();
		if (currenIndex != null) {
			ayutoEvent("click", musicCon.children[index].children[2].children[0].children[0]);
		}
	}
	
	// eventEntrust 事件委托函数
	// 删除音乐按钮点击
	eventEntrust(musicCon, "click", function (e) {
		e = event || window.event;
		
		if (e.target.className === "btn-close") {
			let musicItem = e.target.parentNode.parentNode;
			let index = musicItem.idx;
			
			// 删除音乐钱判断当前没有进行播放
				// 这种情况是有
			if (musicItem.idx == audio.playindex) {
				ayutoEvent("click", nextMusic);
			}
			
			audio.DeletMusic(index);
			musicItem.remove();
			
			let musicList = document.querySelectorAll(".conter-list .music-list");
			for (let i = 0; i < musicList.length; i++) {
				musicList[i].idx = i;
				musicList[i].children[1].innerText = i + 1;
			}
		}
	})
		
	// 监听当前音乐播放器的进度, 通过放在ondurationchange上面能够在视频/音频（audio/video）的时长从 "NaN" 修改为正在的时长之后才去真正 进行ontimeupdate的才做
	dio.ondurationchange = function () {
		
		let durations = this.duration;
		
		dio.ontimeupdate = function (event) {
			
			
			let currentTimes = event.target.currentTime;
			
			let beingTimer = currentTimes / durations;
			
			// 进度条相关的操作
			progress.progressBarMove(function (val) {
				event.target.currentTime = durations * val;
			});
			if (progress.start == false) {
				progress.autoProgressMove(beingTimer * 100);
			}
			
			let timers = setPlayerTimer(currentTimes, durations);
			musicTimer.innerText = timers;
		}
	}
	
	// 进度条点击、音乐播放进度事件
	progress.ProgressClick(function (value) {
		audio.ProgressMusic(value);
	});
	
	// 处理播放时间函数
	function setPlayerTimer(currentTime, duration){
		let Curmin = Math.floor(currentTime / 60);
		let Cursec = Math.floor(currentTime % 60);
		let Maxmin = Math.floor(duration / 60);
		let Maxsec = Math.floor(duration % 60);
		if (Curmin < 10) {
			Curmin = "0" + Math.floor(currentTime / 60);
		}
		if (Cursec < 10) {
			Cursec = "0" + Math.floor(currentTime % 60);
		}
		if (Maxmin < 10) {
			Maxmin = "0" + Math.floor(duration / 60);
		}
		if (Maxsec < 10) {
			Maxsec = "0" + Math.floor(duration % 60);
		}
		let endTimer = Curmin + ":" + Cursec + " / " + Maxmin + ":" + Maxsec;
		// console.log(endTimer)
		return endTimer;
	}
	
	// 定义一个自动触发事件函数
	function ayutoEvent(type, dom){
		let e = document.createEvent("MouseEvent");
		e.initEvent(type, true, true);
		dom.dispatchEvent(e);
	}
	
	// 事件委托函数
	function eventEntrust(executeNode, type, fn) {
		executeNode.addEventListener(type, fn, false)
	}
}

	
	