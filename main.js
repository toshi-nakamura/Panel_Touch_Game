'use strict'

{
    class Panel{
        constructor(game){
            this.game = game;
            this.el = document.createElement('li');
            this.el.classList.add('inactive');
            this.el.addEventListener('click', () => {
                this.check();
            });
        }

        getEl(){
            return this.el;
        }

        activate(){
            this.el.classList.remove('inactive');
            this.el.classList.add('active');
            this.el.textContent = 'touch!';
        }

        reset(){
            this.el.classList.remove('active');
            this.el.classList.remove('touched');
            this.el.classList.add('inactive');
            this.el.textContent = undefined;
        }

        check(){
            if(this.el.classList.contains('inactive') || this.el.classList.contains('touched')){
                return;
            }
            this.el.classList.remove('active');
            this.el.classList.add('touched');
            this.game.addScore();
        }
    }

    class Board{
        constructor(game){
            this.game = game;
            this.timeoutId = undefined;
            this.panels = [];
            for(let i = 0; i < this.game.getLevel() ** 2; i++){
                this.panels.push(new Panel(this.game));
            }
            this.setUp();
        }

        setUp(){
            this.board = document.getElementById('board');
            this.panels.forEach(panel => {
                this.board.appendChild(panel.getEl());
            });
        }

        activate(){
            const nums = [];
            for(let i = 0; i < this.game.getLevel() ** 2; i++){
                nums.push(i);
            }
            this.selectPanel(nums);
        }

        inactivate(){
            this.panels.forEach(panel => {
                panel.reset();
            });
        }

        shuffle(arr){
            for(let i = arr.length - 1; i > 0; i--){
                const j = Math.floor(Math.random() * (i + 1));
                [arr[j], arr[i]] = [arr[i], arr[j]];
            }

            return arr;
        }

        selectPanel(arr){
            this.inactivate();
            const nums = this.shuffle([...arr]);
            for(let i = 0; i < this.game.getLevel() - 1; i++){
                const num = nums[i];
                this.panels[num].activate();
            }
            this.timeoutId = setTimeout(() => {
                this.selectPanel(nums);
            }, 2000);
        }

        stop(){
            clearTimeout(this.timeoutId);
            this.inactivate();
        }
    }

    class Game{
        constructor(level){
            this.level = level

            this.startTime = undefined;
            this.timeoutId = undefined;
            this.timeLimit = 15 * 1000;
            this.score = 0;
            this.bestScore = 0;

            this.board = new Board(this);
            this.setUp();
            this.getBtn().addEventListener('click', () => {
                if(btn.classList.contains('disabled')){
                    return;
                }
                this.start();
                btn.classList.add('disabled');
            });
        }

        setUp(){
            const container = document.getElementById('container');
            const PANEL_WIDTH = 70;
            const BOARD_PADDING = 10;
            container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + 'px';
        }

        getBtn(){
            const btn = document.getElementById('btn');
            return btn;
        }

        start(){
            this.showBestScore();
            this.score = 0;
            this.showScore();
            this.startTime = Date.now();
            this.board.activate();
            this.runTimer();
        }

        runTimer(){
            const timer = document.getElementById('timer');
            const timeLeft = this.timeLimit - (Date.now() - this.startTime);
            timer.textContent = (timeLeft / 1000).toFixed(1);
            this.timeoutId = setTimeout(() => {
                this.runTimer();
            }, 10);

            if(timeLeft < 0){
                this.stop();
            }
        }

        stop(){
            clearTimeout(this.timeoutId);
            this.board.stop();
            timer.textContent = '0.0';
            this.getBtn().classList.remove('disabled');
        }

        addScore(){
            this.score++;
            this.showScore();
        }

        showScore(){
            const scoreLabel = document.getElementById('score');
            scoreLabel.textContent = this.score;
        }

        showBestScore(){
            if(this.score > this.bestScore){
                this.bestScore = this.score;
            }
            const bestScore = document.getElementById('bestScore');
            bestScore.textContent = this.bestScore;
        }

        getLevel(){
            return this.level;
        }
    }

    new Game(5);
}