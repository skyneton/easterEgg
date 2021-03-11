function east_start() {
    let keyInputCheck = 0,
        canvas, offScreen,
        worker;
    const WORKER_URL = URL.createObjectURL(new Blob([`(${east.toString()})()`], { type: "text/javascript" }));
    window.addEventListener("keydown", e => {
        if(canvas) {
            if(e.keyCode == 27) {
                worker.terminate();
                canvas.remove();
            }
            return;
        }
        switch(keyInputCheck) {
            case 0: {
                if(e.keyCode == getCharCode('Q')) keyInputCheck++;
                else keyInputCheck = 0;
                break;
            }
            case 1: {
                if(e.keyCode == getCharCode('E')) keyInputCheck++;
                else keyInputCheck = 0;
                break;
            }
            case 2: {
                if(e.keyCode == getCharCode('A')) keyInputCheck++;
                else keyInputCheck = 0;
                break;
            }
            case 3: {
                if(e.keyCode == getCharCode('S')) keyInputCheck++;
                else keyInputCheck = 0;
                break;
            }
            case 4: {
                if(e.keyCode == getCharCode('T')) keyInputCheck++;
                else keyInputCheck = 0;
                break;
            }
            case 5: {
                if(e.keyCode == getCharCode('E')) keyInputCheck++;
                else keyInputCheck = 0;
                break;
            }
            case 6: {
                if(e.keyCode == getCharCode('R')) keyInputCheck++;
                else keyInputCheck = 0;
                break;
            }
        }

        if(keyInputCheck === 7) {
            keyInputCheck = 0;
            easterStart();
        }
    });
    window.addEventListener("resize", _ => {
        if(canvas) worker.postMessage({type: "resize", data: [window.innerWidth, window.innerHeight]});
    });

    const easterStart = () => {
        canvas = document.createElement("canvas");
        canvas.setAttribute("class", "easter_egg_canvas");
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        offScreen = canvas.transferControlToOffscreen();
        offScreen.width = window.innerWidth;
        offScreen.height = window.innerHeight;

        worker = new Worker(WORKER_URL);
        worker.postMessage({type: "canvas", data: offScreen}, [offScreen]);

        const eastData = new easter_module();
        worker.postMessage({type: "background", data: atob(eastData.getBackground())});
        worker.postMessage({type: "character", data: atob(eastData.getCharacter())});
    };

    const getCharCode = a => {
        return a.charCodeAt(0);
    }
}

new east_start();
