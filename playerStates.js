import { Dust, Fire, Splash } from './particles.js';




// A simple enum object that will pair values and names of each it state. It will help with code readability
// The order of states in this enum must be exactly the same as the order of states in the this.states array in the Player class constructor
const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6
}

// Each state will have its own class so that we can give each state its own enter() method  and handleInput() method
// The enter() method will set the player up when it enters that particular state
// The handleInput() method will react to different user inputs depending on which state the player is at that moment in time
class State {
    constructor(state, game){
        this.state = state;
        this.game = game;
    }
}

// The Sitting state will stop the game from scrolling while the player is sitting down
export class Sitting extends State {
    constructor(game){
        super('SITTING', game) // In a child class, the super() method must always be called before using the this. keyword, otherwise you get an error
    }
    enter(){
        this.game.player.frameX = 0; // This ensures that there is not blinking when we switch sprites
        this.game.player.maxFrame = 4; // 5 frames, counting from 0
        this.game.player.frameY = 5; // The sitting sprites are on the 6th row of the spritesheet. We start from 0
    }
    // This will run 60 times per second
    handleInput(input){ // input contains the keys array that is constructed with InputHandler() class
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')){
            this.game.player.setState(states.RUNNING, 1) // Passing in a number instead of RUNNING would also work, but it would be less readable. The second argument is the game speed
        } else if (input.includes('Enter')){
            this.game.player.setState(states.ROLLING, 2)
        }
    }
}


// The Running state
export class Running extends State {
    constructor(game){
        super('RUNNING', game)
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3; // The running sprites are on the 4th row of the spritesheet. We start from 0

    }
    handleInput(input){ 
        // .unshift() adds one or more elements to the beginning of an array and returns the new length of the array
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.6, this.game.player.y + this.game.player.height));
        if (input.includes('ArrowDown')){
            this.game.player.setState(states.SITTING, 0) // The 0 stops the game(background) from moving while the player is sitting
        } else if (input.includes('ArrowUp')){
            this.game.player.setState(states.JUMPING, 1)
        } else if (input.includes('Enter')){
            this.game.player.setState(states.ROLLING, 2)
        }
    }
}

// The Jumping state
export class Jumping extends State {
    constructor(game){
        super('JUMPING', game)
    }
    enter(){
        if (this.game.player.onGround()) this.game.player.vy -= 27
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;
    }
    handleInput(input){ 
        if (this.game.player.vy > this.game.player.weight){
            this.game.player.setState(states.FALLING, 1) 
        } else if (input.includes('Enter')){
            this.game.player.setState(states.ROLLING, 2)
        } else if (input.includes('ArrowDown')){
            this.game.player.setState(states.DIVING, 0)
        }
    }
}

// The Falling state
export class Falling extends State {
    constructor(game){
        super('FALLING', game)
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
    }
    handleInput(input){ 
        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1) 
        } else if (input.includes('ArrowDown')){
            this.game.player.setState(states.DIVING, 0)
        }
    }
}

// The Rolling state
export class Rolling extends State {
    constructor(game){
        super('ROLLING', game)
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
    }
    handleInput(input){ 
        // .unshift() adds one or more elements to the beginning of an array and returns the new length of the array. Using .push() will create gaps in the fire trail
        // This way, when we slice the particles array once maxParticles is reached (0, 50), we slice out OLD particles and keep new ones
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (!input.includes('Enter') && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1) 
        } else if (!input.includes('Enter') && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1) 
        } else if (input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround()){
            this.game.player.vy -= 27
        } else if (input.includes('ArrowDown') && !this.game.player.onGround()){
            this.game.player.setState(states.DIVING, 0)
        }
    }
}

// The Diving state
export class Diving extends State {
    constructor(game){
        super('DIVING', game)
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.game.player.vy = 15; // Makes the player speed towards the ground
    }
    handleInput(input){ 
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1)
            for (let i = 0; i < 30; i++){
                this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height))
                console.log('BOOM!') 
            }
        } else if (!input.includes('Enter') && this.game.player.onGround()){
            this.game.player.setState(states.ROLLING, 2) 
        }
    }
}


// The Hit state
export class Hit extends State {
    constructor(game){
        super('HIT', game)
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
    }
    handleInput(input){ 
        // The animation row will only play ONCE, then it will switch states
        // If the player reaches the end of the HIT animation row, and they're on the ground, switch back to the running state
        if (this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1)
        } // If they're in the air, switch to the falling state
            else if (this.game.player.frameX >= 10 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1) 
        }
    }
}