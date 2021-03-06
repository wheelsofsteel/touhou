class Enemy {
    constructor(x, y, r, movementSpeed, directions, color, hp, sprite) {
        this.pos = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.movementSpeed = movementSpeed;
        this.r = r;
        this.color = color;
        this.sprite = sprites[sprite];
        this.patterns = [];
        this.directions = directions;
        this.dirCount = 0;
        this.pauseCount = 0;
        this.hp = hp;
        this.sprite = new Sprite(sprites[sprite.name], sprite.w, sprite.h,
                                 sprite.maxFrames, sprite.posX, sprite.posY);
    }
    drawEnemy() {
        this.sprite.animate(this.pos.x, this.pos.y, this.r);
    }
    drawPattern() {
        for (let i = 0; i < this.patterns.length; i++) {
            this.patterns[i].update();
        }
    }
    move(x, y, mag) {
        let location = createVector(x, y);
        location.sub(this.pos);
        location.setMag(mag);
        this.acc = location;
    }
    getDistance(d1, d2) {
        return int(dist(d1.x, d1.y, d2.x, d2.y));
    }
    changeDirection() {
        if (this.dirCount + 1 !== this.directions.length) {
            this.dirCount++;
        } else {
            this.dirCount = 0;
        }
    }
    pause() {
        this.fire();
        this.acc.mult(0);
        this.velocity.mult(0);
        if (this.pauseCount < this.directions[this.dirCount]["pause"]) {
            this.pauseCount++;
        } else {
            this.pauseCount = 0;
            this.directions[this.dirCount]["fired"] = false;
            this.changeDirection();
        }
    }
    fire() {
        if (!this.directions[this.dirCount]["fired"]) {
            this.patterns.push(this.patternGenerator(this.directions[this.dirCount]["pattern"]));
            this.directions[this.dirCount]["fired"] = true;
        }
    }
    outOfBounds() {
        const offset = 350;
        if (this.pos.x > width + offset ||
            this.pos.x < 0 - offset ||
            this.y > height + offset ||
            this.y < 0 - offset)
            return true;
    }
    update() {
        this.drawEnemy();
        this.drawPattern();

        this.pos.add(this.velocity);
        this.velocity.add(this.acc);

        let currentDirection = this.directions[this.dirCount]["dir"];

        if (this.getDistance(this.pos, currentDirection) < 50) {
            this.pause()
        }

        this.move(currentDirection.x, currentDirection.y, 0.1);

    }
    patternGenerator(pattern) {
        const patterns = {
            "normalShot": new Bullet(this.pos.x, this.pos.y, pattern.vx, pattern.vy, pattern.speed),
            "spiral": new Spiral(this.pos.x, this.pos.y, pattern.rotationRate, pattern.amount, pattern.maxAngle, pattern.k, pattern.movementSpeed),
        }
        return patterns[pattern.name];
    }
}

class Boss extends Enemy {
    constructor(x, y, r, movementSpeed) {
        const directions = [{
                "dir": createVector(150, 150),
                "pause": 140,
                "pattern": {
                    name: "spiral",
                    rotationRate: 2,
                    amount: 50,
                    maxAngle: 720,
                    k: 12,
                    movementSpeed: 3
                },
                "fired": false
            },
            {
                "dir": createVector(400, 600),
                "pause": 140,
                "pattern": {
                    name: "spiral",
                    rotationRate: 1,
                    amount: 60,
                    maxAngle: 720,
                    k: 8,
                    movementSpeed: 4
                },
                "fired": false
            },
            {
                "dir": createVector(width - 20, 800),
                "pause": 20,
                "pattern": {
                    name: "normalShot",
                    vx: 0,
                    vy: 15,
                    speed: 0.5
                },
                "fired": false
            }
        ];
        super(x, y, r, movementSpeed, directions);
    }
}

class Boss2 extends Enemy {
    constructor(x, y, r, movementSpeed) {
        const color = [255, 255, 100];
        const directions = [{
                "dir": createVector(350, 350),
                "pause": 140,
                "pattern": {
                    name: "spiral",
                    rotationRate: 2,
                    amount: 50,
                    maxAngle: 720,
                    k: 12,
                    movementSpeed: 3
                },
                "fired": false
            },
            {
                "dir": createVector(200, 600),
                "pause": 140,
                "pattern": {
                    name: "spiral",
                    rotationRate: 1,
                    amount: 60,
                    maxAngle: 720,
                    k: 8,
                    movementSpeed: 4
                },
                "fired": false
            },
            {
                "dir": createVector(width - 20, 600),
                "pause": 20,
                "pattern": {
                    name: "normalShot",
                    vx: 0,
                    vy: 15,
                    speed: 0.5
                },
                "fired": false
            }
        ];
        super(x, y, r, movementSpeed, directions, color);
    }
}

class Spinner extends Enemy {
    constructor(x, y, movementSpeed) {
        const color = [255, 255, 100];
        const hp = 5;
        const directions = [{
                "dir": createVector(x + 200, y + 400),
                "pause": 140,
                "pattern": {
                    name: "spiral",
                    rotationRate: 1,
                    amount: 60,
                    maxAngle: 720,
                    k: 8,
                    movementSpeed: 4
                },
                "fired": false
            },
            {
                "dir": createVector(-500, 600),
                "pause": 20,
                "pattern": "",
                "fired": false
            }
        ];
        const r = 24;
        const sprite = {
            "name" : "enemy",
            "w" : 48,
            "h" : 48,
            "maxFrames" : 3,
            "posX" : 0,
            "posY" : 128
        };
        super(x, y, r, movementSpeed, directions, color, hp, sprite);
    }

}

class RegularMob extends Enemy {
    constructor(x, y, movementSpeed) {
        const directions = [];
        const color = [0, 255, 100];
        const hp = 1;
        const r = 16;
        const sprite = {
            "name" : "enemy",
            "w" : 32,
            "h" : 32,
            "maxFrames" : 3,
            "posX" : 0,
            "posY" : 0
        };
        super(x, y, r, movementSpeed, directions, color, hp, sprite);
        this.a = 0;
    }
    update() {
        this.a++;
        this.pos.x -= cos(this.a);
        this.drawEnemy();
        this.pos.add(this.velocity);
        this.velocity.add(this.acc);
        this.velocity.limit(1);
        this.move(this.pos.x, this.pos.y + 5, 1);
    }

}
