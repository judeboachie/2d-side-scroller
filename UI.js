export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = document.getElementById('lives');

    }
    draw(context){
        context.save()
        context.shadowOffsetX = 2; // 2 pixels
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left'
        context.fillStyle = this.game.fontColor;
        
        //  Drawing the Score
        context.fillText(`Score: ${this.game.score}`, 20, 50);
        // the .fillText() method draws filled text on the canvas. The default colour of the text is black.
        // syntax: context.fillText(text, x, y, maxWidth)
        
        
        // Timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, 20, 80); // The timer shows milliseconds by default. Multiply by 0.001 and apply the .toFixed() method to address that. .toFixed(1) makes it so that we only see 1 decimal space
        
        // Player Lives
        for (let i = 0; i < this.game.lives; i++){
            // Draws the 5 hearts
            // 30 * i + 20 means: width of image * index + left margin of 20 pixels
            context.drawImage(this.livesImage, 30 * i + 20, 95, 25, 25)
        }



        // Game over messages
        if (this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if (this.game.score > this.game.winningScore) {
                context.fillText('You win!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('You killed 90 monsters! Refresh and try to beat your high score!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.fillText('You lose...', this.game.width * 0.5, this.game.height * 0.5 - 20);
            context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
            context.fillText('You weren\'t able to reach 90 points. Better luck next time!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
            
        }
        context.restore()
    }   
}