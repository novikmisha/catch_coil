import './tailwind.css';

let p5 = require('p5');

let mage;
let warlock;
let spell = null;
let spellSpeed = 7;
let gameStarted = false;
let score = 0;
let height;

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
    }


    cast() {
        warlock.castCd = Math.floor(Math.random() * 3) + 3;
        spell = warlock.getSpell();
        setTimeout(warlock.cast, warlock.castCd * 1000);
        spellSpeed += 0.4;
    }

    removeCoilTimeout() {
        warlock.coilCd = 0;
    }

    getSpell() {
        if (warlock.coilCd === 0
            && Math.random() > warlock.coilChance) {

            warlock.coilCd = 9;
            setTimeout(warlock.removeCoilTimeout, warlock.coilCd * 1000);

            return new Coil(130, height - 125, this.coil);
        }

        return new Bolt(130, height - 125, this.bolt);
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
        score += 1;
        spell = null;
    }
}

class Coil extends Spell {

    onHit() {
        if (mage.blocked) {
            score += 1;
            spell = null;
        } else {
            resetGame();
        }
    }
}

function resetGame() {
    gameStarted = false;
    spell = null;
    spellSpeed = 7;
}


const sketch = (s) => {

    let bg;
	let button;

    s.setup = () => {
        bg = s.loadImage('images/arena.jpg')

        height = Math.min(window.innerHeight, 450);
        s.createCanvas(600, height);

        warlock = new Warlock(20, height-150, s.loadImage('images/warlock_hero.png'), s.loadImage('images/coil.jpg'), s.loadImage('images/bolt.jpg'));
        mage = new Mage(480, height-150, s.loadImage('images/mage_hero.png'), s.loadImage('images/ice_block.jpg'));

        warlock.cast()
        
    }

    s.draw = () => {

        s.background(bg);

        s.textSize(32);
        s.fill(255, 255, 255);
        s.text('Score : ' + score, 250, 50)

        warlock.display(s);
        mage.display(s);

        if (spell != null)  {
            spell.display(s);
        }

        if (mage.blockCd > 0) {
            s.textSize(64);
            s.fill(255, 255, 255);
            s.text(mage.blockCd, 32, 70);
        }

    }
}

const sketchInstance = new p5(sketch, "play-window");
