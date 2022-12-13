export class FloatingMessage {
    constructor(value, x, y, targetX, targetY){
        // The value (text) will float from x and y to targetX and Y, and then dissappear
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.markedForDeletion = false;
        this.timer = 0;
    }
    update(){
        this.x += (this.targetX - this.x) * 0.03; // horizontal x will increase by 3% of the difference between the target position and the current position, making it slowly move towards the target
        this.y += (this.targetY - this.y) * 0.03;
        this.timer++;
        if (this.timer > 100) this.markedForDeletion = true;
    }
    draw(context){
        context.font = '20px Creepster';
        context.fillStyle = 'white';
        context.fillText = (this.value, this.x, this.y);
        context.fillStyle = 'black'; // Doubling up and offsetting text is an alternative to using canvas shadow properties
        context.fillText = (this.value, this.x - 2, this.y - 2);
        
    }             
}