class Enemy {
    constructor(){
        this.frameX = 0; // Horizontal spritesheet navigation
        this.frameY = 0; // Vertical spritesheet navigation
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false; // For removing off screen enemies from the enemies array
    }
    update(deltaTime){ // deltaTime is the difference in milliseconds between the previous animation frame and the current one
        // Movement
        this.x -= this.speedX + this.game.speed; // For every animation frame, the enemy moves to the left while also accounting for the game speed 
        this.y += this.speedY; // For every animation frame, increase vertical y co-ord by the enemy's vertical speed 
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        // If the enemy has moved off screen, mark it for deletion so it can be spliced out of the enemies array
        if(this.x + this.width < 0) this.markedForDeletion = true;
     }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height) // Draws a hitbox around the enemy for debugging
        context.drawImage( // 9 arguments
            this.image, // The image we want to draw
            this.frameX * this.width, // Source X (cropping spritesheet)
            0, // Source Y (cropping spritesheet). This will always be 0 because the enemy spritesheets only have 1 row
            this.width, // Source width (cropping spritesheet)
            this.height, // Source height (cropping spritesheet)
            this.x, // Destination X (canvas)
            this.y, // Destination Y (canvas)
            this.width, // Destination width (canvas)
            this.height) // Destination height (canvas)

    }
}

export class FlyingEnemy extends Enemy {
    constructor(game){
        super(); 
        this.game = game;
        this.width = 60;
        this.height = 44;
        this.x = this.game.width + Math.random() * this.game.width * 0.5; // Starting position
        this.y = Math.random() * this.game.height * 0.5; // Starting position. They only spawn on the upper half of the game area
        this.speedX = Math.random() + 1; // Horizontal speed
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = document.getElementById('enemy_fly')
        this.angle = 0; // We will increase this slowly and feed it to Math.sin() to create a floating effect for flying enemies exclusively
        this.va = Math.random() * 0.1 + 0.1 // Velocity of angle. A random value between 0.1 and 0.2
    }
    update(deltaTime){
        super.update(deltaTime);
        // Floating effect
        // Passing a slowly increasing angle to Math.sin() will map the positions of the enemy along a sine wive
        this.angle += this.va 
        this.y += Math.sin(this.angle) 
    }

}

export class GroundEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('enemy_plant');
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
    }
    // If we don't declare update(deltaTime) and draw(context), Javascript will automatically travel up the prototype chain and find the methods on the parent Enemy class
}

export class ClimbingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5; // Random position in the top half of the game
        this.image = document.getElementById('enemy_spider_big');
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1 // Ternary operator. If Math.random is greater than 0.5, set speedY = to 1, else set it to -1. Some spiders will move up, and others will move down
        this.maxFrames = 5;
    }
    update(deltaTime){
        super.update(deltaTime)
        // Once the spiders reach the ground, have them climb back up
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
        // Delete the spider once the climb beyond the top of the screen
        if (this.y < -this.height) this.markedForDeletion = true; 
    }
    draw(context){
        super.draw(context)
        // Drawing a spider web
        context.beginPath();
        context.moveTo(this.x + this.width/2, 0) // Initial x and y co-ords of the line
        context.lineTo(this.x + this.width/2, this.y + 50); // The ending x and y co-ords
        context.stroke();
    }
}