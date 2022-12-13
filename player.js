import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from './floatingMessages.js';

// This will draw and update our character
export class Player {
	constructor(game){
		this.game = game;
		this.width = 100;
		this.height = 91.3;
		this.x = 0;
		this.y = this.game.height - this.height - this.game.groundMargin;
		this.vy = 0; // Vertical speed
		this.weight = 1; // This gravity will work against vertical speed to make the jumps realistic
		this.image = player; // We don't really have to use document.getElementById('player'); because JS automatically creates references to all elements with IDs into the global namespace, using it's ID as a variable name
		this.frameX = 0; // Will cycle from left to right across the spritesheet animating the player. The index of the horizontal frame
		this.frameY = 0; // Will travel vertically across the spritesheet whenever we switch to a different state
		this.maxFrame; // Maximum number of frames in an animation. This will change whenever we change states
		this.fps = 20; // This dog spritesheet works best at 20fps
		this.frameInterval = 1000/this.fps; // 1000 milliseconds
		this.frameTimer = 0 // This will cycle between 0 and frameInterval, increasing by deltaTime for each frame. When it reaches the interval, it will trigger the next frame, and reset
		this.speed = 0;
		this.maxSpeed = 10; // This will be the players speed in pixels per frame
		this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)]; // An array of state classes	
		this.currentState =  null;
	}

	// This will move the character based on user input and cycle through the sprite frames
	update(input, deltaTime){
		this.checkCollision();
		this.currentState.handleInput(input) // input contains the keys array that is constructed with InputHandler() class
		// HORIZONTAL MOVEMENT
		this.x += this.speed
		// .includes() determines whether an array includes a certain value among its elements, returning true or false as appropriate
		if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed // Move to the right by 1 pixel
		else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed // Move to the left by 1 pixel
		else this.speed = 0
		// Horizontal boundaries

		// Prevents player from moving beyond the left and right sides of the canvas
		if (this.x < 0) this.x = 0
		if (this.x > this.game.width - this.width) this.x = this.game.width - this.width


		// VERTICAL MOVEMENT

		this.y += this.vy
		// If the player is in the air, start applying gravity
		if (!this.onGround()) this.vy += this.weight
		else this.vy = 0

		// Vertical boundaries
		if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin

		// SPRITE ANIMATION
		// Rmb, frameInterval is up to me, but it must work based on deltaTime, which depends on the power of you computer and the refresh rate of your screen
		// If frame timer reaches the end of the interval, reset it back to 0 for the next frame interval, and serve the next horizontal frame in the spritesheet
		// Otherwise, keep increasing the timer by deltaTime until it reaches the frame interval value
		if (this.frameTimer > this.frameInterval){
			this.frameTimer = 0
			if (this.frameX < this.maxFrame) this.frameX++
			else this.frameX = 0
		} else {
			this.frameTimer += deltaTime
		}
		
		
	}

	// This will take the values above and draw the currently active frame and current co-ordinates
	// It needs context as an argument to specify which canvas element we want to draw on
	draw(context){
		if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height) //.strokeRect() draws a rectangle that is stroked (outlined) according to the current strokeStyle and other context settings
		context.drawImage( // The longest version of .drawImage() takes 9 arguments, and that's what we need
 			this.image, // This image we want to draw
			this.frameX * this.width, // sx Source X of the rectangle we want to crop out from the source image
			this.frameY * this.height, // sy Source Y of the rectangle we want to crop out from the source image
			this.width, // sw Source width of the rectangle we want to crop out from the source image
			this.height, // sh Source height of the rectangle we want to crop out from the source image
			this.x, // X co-ord on the canvas (destination)
			this.y, // Y co-ord on the canvas
			this.width, // Width on the canvas
			this.height // Height on the canvas
			) 
	}

	// This checks to see if the player is off the ground or not
	onGround(){
		return this.y >= this.game.height - this.height - this.game.groundMargin
	}
	// Changes the player state
	setState(state, speed){
		this.currentState = this.states[state]
		this.game.speed = this.game.maxSpeed * speed; // The new game speed becomes the maxSpeed * the speed value passed in by the state the player just switched to
		this.currentState.enter()
	}
	// Cycle through the array of active enemy objects and compare their x/y/width/height to the player's x/y/width/height
	checkCollision(){
		this.game.enemies.forEach(enemy => {
			if (
				enemy.x < this.x + this.width && // Enemy left side overlapping player right side
				enemy.x + enemy.width > this.x && // Enemy right side to the right of player left side
				enemy.y < this.y + this.height && // Enemy head above player feet
				enemy.y + enemy.height > this.y // Enemy feet below player head
			){
				// Collision detected
				enemy.markedForDeletion = true
				this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
				// If the player destroys enemies while rolling or diving
				if (this.currentState === this.states[4] || this.currentState === this.states[5]){
					this.game.score++;
					// THIS Line of code breaks the game for some reason
					// this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50)) // The score will float from the enemy to the "Score" region of the screen
				} else {
					// Player gets hit and is stunned
					this.setState(6, 0) // Game speed set to 0 once the player is hit
					this.game.score -= 5;
					this.game.lives--;
					if (this.game.lives <= 0) this.game.gameOver = true;
				}
				
			} 
		})
	}
};

