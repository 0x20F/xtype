class Sprite {
    image;
    width;
    height;
    alpha = 1;

    constructor(url, width, height) {
        let image = new Image();
        image.src = url;

        this.image = image;
        this.width = width;
        this.height = height;
    }

    setAlpha = (alpha) => {
        alpha = alpha > 0 ? alpha : 0;
        this.alpha = alpha < 1 ? alpha : 1;
    }

    draw = (context) => {
        context.save();

        //context.translate((0 - this.width / 2), 0);
        //context.translate(this.width/2, this.height/2)
        context.globalAlpha = this.alpha;
        context.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        context.restore();
    }
}


export default Sprite;
