(function () {
	function Lyric(path,fn){
		this.init(path,fn);
	}
	
	Lyric.prototype = {
		constructor: Lyric,
		
		// 存放歌词数组
		lyric: [],
		// 存放歌曲时间
		timerData: [],
		
		init: function (path,fn) {
			let $this = this
			$.ajax({
				url: path,
				dataType: "text",
				success: function (data) {
					 $this.SplitText(data);
					 fn();
				},
				error: function (error){
					console.log(error);
				}
			})
		},
		
		// 歌词处理分割
		SplitText: function (data) {
			this.lyric = [];
			this.timerData = [];
			let arr = data.split(/\n/);
			// [00:00.92]告白气球 - 周杰伦
			let musicReg = /\d+:\d+\.\d+/;
			let newText = [];
			newText = arr.filter(function (item) {
				return item.match(musicReg);
			});
			
			newText.forEach(function(item) {
				// console.log(this);
				
				let lyr = item.split("]")[1];
				
				if (lyr.length === 1) return true;
				this.lyric.push(lyr);
				
				let timer = item.split("]")[0].match(musicReg)[0];
				let min = timer.split(":")[0] * 60;
				let sec = timer.split(":")[1] / 1;
				let timers = Number((min + sec).toFixed(2));
				this.timerData.push(timers);
				
			}.bind(this));
			// console.log(this.lyric);
			// console.log(this.timerData
		},
	};
	
	window.Lyric = Lyric;
})(window)