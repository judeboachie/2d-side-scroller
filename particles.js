class Particle {
    constructor(game){
        this.game = game;
        this.markedForDeletion = false;
    }
    update(){
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.97; // For every frame, the size of each particle will decrease by 5%
        if (this.size < 0.5) this.markedForDeletion = true // When the particle size is less than 0.5 pixels, delete it
    }
}


export class Dust extends Particle {
    constructor(game, x, y){
        super(game)
        this.size = Math.random() * 10 + 10;
        this.x = x;
        this.x = y;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color = 'rgba(0,0,0,0.2)';
    }
    draw(context){
        // Drawing circles
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2); // x, y, radius, start angle, end angle
        context.fillStyle = this.color;
        context.fill();
    }
}

// When the Player hits the ground at high speed
export class Splash extends Particle{
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 100 + 100 // A random number between 10 and 200 pixels
        this.x = x - this.sizee * 0.4;
        this.x = y - this.sizee * 0.5;
        this.speedX = Math.random() * 6 - 4; // A random number between -4 and 2 because we want the particles to splash in both directions horizontally
        this.speedY = Math.random() * 2 + 2; // A random number between 2 and 4
        this.gravity = 0;
        this.image = document.getElementById('fire');
    }
    update(){
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}


// For attack animation
export class Fire extends Particle{
    constructor(game, x, y){
        super(game);
        this.image = document.getElementById('fire');
        this.size = Math.random() * 100 + 50 // Size will be a random value between 50 and 150 pixels
        this.x = x;
        this.y = y;
        this.speedX = 1; // 1 frame per pixel
        this.speedY = 1;
        this.angle = 0; // To make the individual fire images rotate
        this.va = Math.random() * 0.2 - 0.1 // Velocity of angle. A random value between -0.1 and 0.1
    }
    update(){
        super.update();
        this.angle += this.va;
        this.x += Math.sin(this.angle * 5); // This gives the fire a wavy motion

    }
    draw(context){
        // All the canvas settings declared between .save() and .restore() will only affect this fire particle
        // This makes sure that the rotations don't overflow to other elements
        context.save()
        context.translate(this.x, this.y) // First, we must translate the rotation center point from its default position (0,0) on the canvas) over the center of the item we want to rotate 
        context.rotate(this.angle) // This takes an angle value in radians, and it will rotate everything that is drawn after this call, unless we restore canvas back to its original default state
        context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size) // Image, x, y, width, and height
        context.restore()
    }
}