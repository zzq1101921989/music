(function (window) {
	function PlayerMusic(audio) {
		this.audio = audio;
	}
	
	PlayerMusic.prototype = {
		
		constructor: PlayerMusic,
		
		playindex: -1,
		audioAyy: [],
		
		// 播放音乐
		Player: function (index, musicURl) {
			if (index == this.playindex) {
				if (this.audio.paused) {
					this.audio.play();
				}else{
					this.audio.pause();
				}
			}else{
				this.audio.src = musicURl;
				this.audio.play();
				this.playindex = index;
			}
			console.log(this.playindex);
			// console.log(this.audio.src);
		},
		// 下一首播放
		NextMusic: function () {
			
			if (this.playindex == -1) {
				alert("请先任意点击一首进行播放")
				return;
			}
			
			var index = this.playindex + 1;
			if(index >= this.audioAyy.length){
				index = 0;
			}
			return index;
		},
		// 上一首播放
		PrevMusic: function () {
			
			if (this.playindex == -1) {
				alert("请先任意点击一首进行播放")
				return;
			}
			
			var index = this.playindex - 1;
			if(index < 0){
				index = this.audioAyy.length - 1;
			}
			
			return index;
		},
		// 删除音乐操作
		DeletMusic: function (index) {
			this.audioAyy.splice(index, 1);
			if(index < this.playindex){
                // 播放中之前的音乐被删除，当前记录的currentIndex就要更新不然会下跳到当前这个的 + 1 会出现bug
                this.playindex = this.playindex - 1;
            }
		},
		// 音乐进度播放
		ProgressMusic: function (val) {
			this.audio.currentTime = this.audio.duration * val;
		}
	};
	
	window.PlayerMusic = PlayerMusic;
})(window)