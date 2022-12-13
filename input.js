// Capture and keep track of user input

export class InputHandler {
    constructor(game){
        this.game = game;
        this.keys = []; // Keys will be added to this array when pressed if they aren't already in it, and removed from the array when released
        window.addEventListener('keydown', e => {

            // When an element has an index of -1, that means it is not present in the array
            if ((   e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Enter') && 
                    this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            } // Custom debug mode
                else if (e.key === 'd') this.game.debug = !this.game.debug;
        })
        window.addEventListener('keyup', e => {
            
            if (    e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Enter'){
                // This splice method takes at least two arguments: the index of the element you want to remove, and the number of elements you want to remove at that index
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
            console.log(e.key, this.keys)
        })
    }
}