let p5 = require('p5');

let mage;
let warlock;
let spell = null;
let spellSpeed = 7;
let gameOver = false;
let score = 0;

class Hero {
    constructor(x, y, bg) {
        this.x = x;
        this.y = y;
        this.bg = bg;
    }

    display(s) {
        this._display(s, this.bg);
    }

    _display(s, bg) {
        s.image(bg, this.x, this.y, 110, 110);
        s.noFill();
        s.rect(this.x, this.y, 110, 110);
    }
}

class Mage extends Hero {
    constructor(x, y, bg, iceBlock) {
        super(x, y, bg);
        this.iceBlock = iceBlock;
        this.blocked = false;
        this.blockTime = 0;
        this.blockCd = 0;
    }

    display(s) {
        let bg = this.getDisplayBg();
        this._display(s, bg);
    }

    getDisplayBg() {
        if (this.blocked) {
            return this.iceBlock;
        }

        return this.bg;
    }

    block() {
        if (this.blockCd > 0) {

        } else {
            this.blocked = true;
            this.blockCd = 8;
            this.blockTime = 1;
            setTimeout(this.timeoutCd, 1000);
            setTimeout(this.timeoutBuff, 1000);
        }
    }

    timeoutBuff() {
        if (mage.blocked) {
            mage.blockTime -= 1;
            if (mage.blockTime === 0) {
                mage.blocked = false;
            } else {
                setTimeout(mage.timeoutBuff, 1000);
            }
        }
    }

    timeoutCd() {
        if (mage.blockCd > 0) {
            mage.blockCd -= 1;
            setTimeout(mage.timeoutCd, 1000);
        }
    }

}

class Warlock extends Hero {
    constructor(x, y, bg, coil, bolt) {
        super(x, y, bg);
        this.coil = coil;
        this.bolt = bolt;
        this.coilCd = 0;
        this.castCd = 0;
        this.coilChance = 0.4;
        setTimeout(this.cast, 2000);
    }


    cast() {
        warlock.castCd = Math.floor(Math.random() * 3) + 3;
        spell = warlock.getSpell();
        setTimeout(warlock.cast, warlock.castCd * 1000);
        spellSpeed += 0.1;
    }

    removeCoilTimeout() {
        warlock.coilCd = 0;
    }

    getSpell() {
        if (warlock.coilCd === 0
            && Math.random() > warlock.coilChance) {

            warlock.coilCd = 8;
            setTimeout(warlock.removeCoilTimeout, warlock.coilCd * 1000);

            return new Coil(130, 280, this.coil);
        }

        return new Bolt(130, 280, this.bolt);
    }
}

class Spell {
    constructor(x, y, bg) {
        this.x = x;
        this.y = y;
        this.bg = bg;
    }

    display(s) {
        if (this.checkHit(mage)) {
            this.onHit();
        }

        this.x += spellSpeed;
        s.image(this.bg, this.x, this.y, 40, 40);
        s.noFill();
        s.rect(this.x, this.y, 40, 40);
    }

    checkHit(hero) {
        return this.x > hero.x - 50;
    }

    onHit() {
    }
}

class Bolt extends Spell {

    onHit() {
        spell = null;
    }
}

class Coil extends Spell {

    onHit() {
        if (mage.blocked) {
            score += 1;
            spell = null;
        } else {
            gameOver = true
        }
    }
}


const sketch = (s) => {

    let bg;

    s.setup = () => {
        bg = s.loadImage('assets/images/arena.jpg')
        s.createCanvas(600, 450);

        warlock = new Warlock(20, 250, s.loadImage('assets/images/warlock_hero.png'), s.loadImage('assets/images/coil.jpg'), s.loadImage('assets/images/bolt.jpg'));
        mage = new Mage(480, 250, s.loadImage('assets/images/mage_hero.png'), s.loadImage('assets/images/ice_block.jpg'));
        
    }

    s.draw = () => {

        if (gameOver) {
            s.noLoop();
        }

        s.background(bg);
        warlock.display(s);
        mage.display(s);

        if (spell != null)  {
            spell.display(s);
        }

        document.getElementById("score").innerHTML = score;
    }
}

const sketchButton = (s) => {
    s.setup = () => {
        let canvas = s.createCanvas(100, 100);
        canvas.mouseClicked(() => { mage.block() })
    }

    s.draw = () => {
        if (gameOver) {
            s.noLoop();
        }
        s.background(mage.iceBlock);

        if (mage.blockCd > 0) {
            s.textSize(64);
            s.fill(255, 255, 255);
            s.text(mage.blockCd, 32, 70);
        }
    }
}
const sketchInstance = new p5(sketch, "play-window");
const buttonSketchInstance = new p5(sketchButton, "ice-block-button");
