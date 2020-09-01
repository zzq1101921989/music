(function (window){
	function Progress(progressCon,progressLine,progressBar) {
		this.init(progressCon,progressLine,progressBar);
	};
	
	Progress.prototype = {
		
		constructor: Progress,
		
		val: null,
		
		start: false,
		
		init: function (progressCon,progressLine,progressBar) {
			this.progressCon = progressCon;
			this.progressLine = progressLine;
			this.progressBar = progressBar;
		},
		// 进度条拖拽事件
		progressBarMove: function (fn) {
			
			this.progressBar.onmousedown = function (e) {
				
				this.start = true;
				
				e = event || window.event;
				let oneX = e.clientX - this.progressBar.offsetLeft;
				
				document.documentElement.onmousemove = function (e){
					
					e = event || window.event;
					let x = e.clientX - oneX;
					
					if (x <= 0) {
						x = 0;
					}else if (x >= this.progressCon.offsetWidth) {
						x = this.progressCon.offsetWidth;
					}
					
					this.progressBar.style.left = x + "px";
					this.progressLine.style.width = x + "px";
					
				}.bind(this);
				
				document.documentElement.onmouseup = function () {
					document.documentElement.onmousemove = this.onmouseup = null;
					this.start = false;
					this.val = this.progressLine.offsetWidth / this.progressCon.offsetWidth
					fn(this.val);
				}.bind(this);
				
			}.bind(this);
			
		},
		// 进度条自动播放
		autoProgressMove: function (val){
			if (val >= 100) {
				val = 100;
			}
			this.progressBar.style.left = val + "%";
			this.progressLine.style.width = val + "%";
		},
		// 进度条点击进度
		ProgressClick: function (fn) {
			this.progressCon.onclick = function (e) {
				e = event || window.event;
				let X = Math.floor(e.clientX - this.progressCon.getBoundingClientRect().left - this.progressBar.offsetWidth * 0.5);
				this.progressLine.style.width = X + "px";
				this.progressBar.style.left = X + "px";
				let value = X / this.progressCon.offsetWidth;
				fn(value)
			}.bind(this);
		},
	}
	window.Progress = Progress;
})(window)