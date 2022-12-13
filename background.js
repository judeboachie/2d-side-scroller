
// Parallax Backgrounds

// This is a helper class will handle logic for each state separately
class Layer {
    constructor(game, width, height, speedModifier, image){
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier; // Each layer will move at a different speed, but relative to the game speed
        this.image = image;
        this.x = 0;
        this.y = 0;
    }
    update(){
        // We update the horizontal x co-ord, the vertical y co-ord will always be zero
        // The background images are seamless, which means that when they scroll from left to right, we can't see where they end or begin
        if (this.x < -this.width) this.x = 0 // If the image has scrolled all the way behind the left edge of the game area and is now hidden, reset it to 0 so it can scroll again
        else this.x -= this.game.speed * this.speedModifier // Otherwise, keep decreasing x by the current game speed * speedModifier (for parallax, we need different layers to move at different speeds)
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
        // The trick to creating seamlessly scrolling backgrounds is to draw the same image twice, next to each other
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)

    }
}

export class Background {
    constructor(game){
        this.game = game;
        this.width = 1667;
        this.height = 500;
        this.layer1image = layer1; // We don't really have to use document.getElementById('layer1'); because JS automatically creates references to all elements with IDs into the global namespace, using it's ID as a variable name
        this.layer2image = layer2
        this.layer3image = layer3
        this.layer4image = layer4
        this.layer5image = layer5
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1image)
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2image)
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3image)
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4image)
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5image)
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5]; // This will hold all background layers
    }
    update(){
        this.backgroundLayers.forEach(layer => {
            layer.update()
        })
    }
    draw(context){
        this.backgroundLayers.forEach(layer => {
            layer.draw(context)
        })
    }
}