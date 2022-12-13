import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';
import { UI } from './UI.js';

// Javascript will wait for all resources such as stylesheets and images to be fully loaded and available before it runs
window.addEventListener('load', function(){
	const canvas = document.getElementById('canvas1')
	const ctx = canvas.getContext('2d')
	canvas.width = 900
	canvas.height = 500

	// This Game class will contain all game logic
	class Game {
		constructor(width, height){
			this.width = width;
			this.height = height;
			this.groundMargin = 80;
			this.speed = 0; // pixels per frame
			this.maxSpeed = 4;
			this.background = new Background(this)
			this.player = new Player(this); // The this keyword refers to Game object. We pass the game object to the player so we can access its properties (width and height) for collision detection
			this.input = new InputHandler(this);
			this.UI = new UI(this);
			this.enemies = []; // An array that holds all currently active enemy objects
			this.particles = []; // An array that holds all currently active particle objects
			this.collisions = []; // An array that holds all currently active collision objects
			this.floatingMessages = []; 
			this.maxParticles = 50; // Maximum amount of particles allowed in the game
			this.enemyTimer = 0; // When this reaches enemyInterval, a new enemy is added
			this.enemyInterval = 1000;
			this.debug = false;
			this.score = 0;
			this.winningScore = 90;
			this.fontColor = 'black';
			this.time = 60000; // When time reaches maxTime, the game level is complete
			this.maxTime = 0;
			this.gameOver = false; // When true, display a scoreboard, a custom message, and stop animating the game
			this.lives = 5 // Player lives
			this.player.currentState = this.player.states[0]; // This will point to indexes in the this.states array
			this.player.currentState.enter(); // When the player class is initialized for the first time, this method will activate its initial default state
		}

		// This will run for every animation frame and trigger all calculations that need to happen
		update(deltaTime){ // deltaTime is the number of milliseconds it takes to serve the next frame. We use this fps control
			this.time -= deltaTime;
			if (this.time < this.maxTime) this.gameOver = true;
			
			this.background.update()
			this.player.update(this.input.keys, deltaTime) // For every animation frame, the game will have a current list of active inputs
			
			// Handle Enemies
			if (this.enemyTimer > this.enemyInterval){ // Add an enemy when the timer reaches the interval, then reset the timer. Otherwise, continue to increase the timer by deltaTime
				this.addEnemy()
				this.enemyTimer = 0;
			} else {
				this.enemyTimer += deltaTime;
			}
			this.enemies.forEach(enemy => {
				enemy.update(deltaTime);

				//if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1); // 2 args: the index of the element to be removed, and the number of elements to remove at that index
			})

			// Handle messages
			this.floatingMessages.forEach(message => {
				message.update();
			})
			
			// Handle Particles
			this.particles.forEach((particle, index) => {
				particle.update()
				//if (particle.markedForDeletion) this.particles.splice(index, 1);
			})
			// Limit the maximum amount of particles we allow in the game
			if (this.particles.length > this.maxParticles) {
				// .slice() returns a shallow copy of a portion of an array into a new array object selected from start to end (end not included) where start and end represent the index of items in that array. The original array will not be modified unless you manually overwrite it
				this.particles.length = this.maxParticles; // Only the first 50 particles will be allowed in the array. 
			}

			// Handle Collision sprites
			this.collisions.forEach((collision, index) => {
				collision.update(deltaTime);
				//if (collision.markedForDeletion) this.collisions.splice(index, 1);
			});

			// .filter() runs a test on each element of an array and returns a new array with all the elements that passed the test (i.e., markedForDeletion = false)
			// This is better than .splice() because when enemies get spliced out and removed while you're still in the middle of cycling through the array, it changes the index of all the following elements. Because of this, their positions are not calculated correctly, and this causes the sprites to jump/wobble around (it's more noticecable with the ground enemies, but it's actually happening with ALL enemies) 
			this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion); // If the enemy has moved off screen, remove them from the enemies array
			this.particles = this.particles.filter(particle => !particle.markedForDeletion);
			this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
			this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
		} 
		// This will draw our images, score, etc
		draw(context){
			this.background.draw(context)
			this.player.draw(context);
			this.enemies.forEach(enemy => {
				enemy.draw(context)
			});
			this.particles.forEach(particle => {
				particle.draw(context)
			});
			this.collisions.forEach(collision => {
				collision.draw(context)
			});
			this.floatingMessages.forEach(message => {
				message.draw(context);
			});

			this.UI.draw(context);
		}
		// This will add enemies in a specific interval
		addEnemy(){
			// We only want to add ground enemies while the player is moving, otherwise they would just accumulate off screen while the player is sitting
			if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this)); // There's a 50% chance a ground enemy will spawn
			else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this))
			
			this.enemies.push(new FlyingEnemy(this));
			//console.log(this.enemies, this.particles, this.collisions, this.floatingMessages)			

		}
	}


	const game = new Game(canvas.width, canvas.height)
	let lastTime = 0 // This holds the value of the timestamp from the previous animation loop

	// Animation loop
	function animate(timeStamp){ // timeStamp is autogenerated by requestAnimationFrame() every time it loops/serves a new animation frame.
		const deltaTime = timeStamp - lastTime // deltaTime is the difference in milliseconds between the timeStamp from the current animation loop and the timeStamp from the last one. I.e., how long does each frame stay on screen before it's redrawn?
		lastTime = timeStamp
		ctx.clearRect(0, 0, canvas.width, canvas.height) // Refreshes the canvas after each frame so we don't see smears/old paint
		game.update(deltaTime)
		game.draw(ctx) // Calls the .draw() on game, which calls the .draw() method on player		
		if (!game.gameOver) requestAnimationFrame(animate)
		// requestAnimationFrame() has 2 special features.
		// 1st, it automatically adjusts the screen refresh rate to around 60fps for most people (unless you have some high-refresh rate gaming screen)
		// 2nd, it autogenerates a timestamp value and passes it as an argument to the function it's calling
	}
	animate(0) // This 0 is only for the very first call of animate
});