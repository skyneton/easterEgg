const east = () => {
    let canvas, context, background, character, deltaTime = 1, time, textParticle1, textParticle2;
    self.onmessage = e => {
        const packet = e.data;
        switch(packet.type) {
            case "canvas": {
                canvas = packet.data;
                context = canvas.getContext("2d");
                break;
            }
            case "background": {
                createImageBitmap(new Blob([base64ToUInt(packet.data)], {type: "image/jpeg"})).then(getImageData(0));
                break;
            }
            case "character": {
                createImageBitmap(new Blob([base64ToUInt(packet.data)], {type: "image/png"})).then(getImageData(1));
                break;
            }
            case "resize": {
                canvas.width = packet.data[0];
                canvas.height = packet.data[1];
                break;
            }
        }
    };

    const getImageData = id => data => {
        switch(id) {
            case 0: {
                background = new Background(data);
                break;
            }
            case 1: {
                const x = Math.floor(Math.random() * canvas.width - data.width + data.width/2);
                const y = Math.floor(Math.random() * canvas.height - data.height + data.height/2);
                character = new Character(data, x, y);
                break;
            }
        }
        if(background && character) renderLoop();
    };

    const base64ToUInt = data => {
        const arr = new Uint8Array(data.length);
        for(let i = 0; i < data.length; i++) {
            arr[i] = data.charCodeAt(i);
        }

        return arr;
    };

    const renderLoop = () => {
        time = new Date().getTime();
        textParticle1 = new TextParticle();
        textParticle2 = new TextParticle();
        setInterval(render);
    };

    const render = () => {
        deltaTime = (new Date().getTime() - time) * 0.0001;
        time = new Date().getTime();
        context.clearRect(0, 0, canvas.width, canvas.height);
        character.update();
        textParticle1.update();
        textParticle2.update();
        draw();
    };

    const draw = () => {
        const width = canvas.width, height = canvas.height;
        context.save();
        context.translate(width/2, height/2);
        context.drawImage(background.getImage(), -width/2, -height/2, width, height);
        context.restore();

        context.drawImage(character.getImage(), character.getX(), character.getY());
        context.font = "italic 30px Calibri";
        context.fillText(textParticle1.getText(), textParticle1.getX(), textParticle1.getY());
        context.fillText(textParticle2.getText(), textParticle2.getX(), textParticle2.getY());
    };

    function TextParticle() {
        let textDrawTime, text, x, y;
        this.update = () => {
            const t = new Date().getTime();
            if(textDrawTime == undefined || t - textDrawTime > 1000) {
                textDrawTime = t;
                x = Math.floor(Math.random() * (canvas.width - 500)) + 250;
                y = Math.floor(Math.random() * (canvas.height - 500)) + 250;
                if(x < 0) x = 0;
                if(y < 0) y = 0;
                switch(Math.floor(Math.random() * 4)) {
                    case 0: text = "둠칫♬"; break;
                    case 1: text = "♫둠칫"; break;
                    case 2: text = "♪둠칫"; break;
                    default: text = "둠둠칫♪"; break;
                }
            }
        };
        this.getText = () => {
            return text;
        };
        this.getX = () => {
            return x;
        };
        this.getY = () => {
            return y;
        };
    }

    function Background(data) {
        const bitmap = data;
        this.getImage = () => {
            return bitmap;
        }
    }

    function Character(data, startX, startY) {
        const bitmap = data;
        let x = startX, y = startY, xDir = yDir = 1;
        this.update = () => {
            if(Math.random() * 100 <= 1) {
                x = Math.floor(Math.random() * canvas.width - bitmap.width);
                y = Math.floor(Math.random() * canvas.height - bitmap.height);
                Math.floor(Math.random() * 2) ? xDir = -1 : xDir = 1;
                Math.floor(Math.random() * 2) ? yDir = -1 : yDir = 1;
                if(x < 0) x = 0;
                if(y < 0) y = 0;
            }else {
                x += xDir * Math.floor((Math.random() * 17000 + 10000) * deltaTime);
                y += yDir * Math.floor((Math.random() * 17000 + 10000) * deltaTime);
                if(x > Math.floor(canvas.width - bitmap.width)) { xDir = -1; x = Math.floor(canvas.width - bitmap.width); }
                if(y > Math.floor(canvas.height - bitmap.height)) { yDir = -1; y = Math.floor(canvas.height - bitmap.height); }
                if(x < 0) { xDir = 1; x = 0; }
                if(y < 0) { yDir = 1; y = 0; }
            }
        };
        this.getX = () => {
            return x;
        };
        this.getY = () => {
            return y;
        };
        this.getImage = () => {
            return bitmap;
        }
    }
};