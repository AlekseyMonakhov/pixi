// src/main.js
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

// Загрузка текстур
const backgroundTexture = PIXI.Texture.from('assets/bg.png');
const cardBackTexture = PIXI.Texture.from('assets/card-back.png');
const narutoCardTexture = PIXI.Texture.from('assets/naruto-card.png');
const sakuraCardTexture = PIXI.Texture.from('assets/sakura-card.png');
const jiraiyaCardTexture = PIXI.Texture.from('assets/jiraiya-card.png');
const tsunadeCardTexture = PIXI.Texture.from('assets/tsunade-card.png');
const killerBeeCardTexture = PIXI.Texture.from('assets/killerb-card.png');

const app = new PIXI.Application({ width: 960, height: 640 });
document.body.appendChild(app.view);

// Фон
const bg = new PIXI.Sprite(backgroundTexture);
bg.width = app.screen.width;
bg.height = app.screen.height;
app.stage.addChild(bg);

// Название игры
const title = new PIXI.Text('Find Naruto', {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffff66,
    fontWeight: 'bold',
    align: 'center',
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowDistance: 4
});
title.anchor.set(0.5);
title.x = app.screen.width / 2;
title.y = 50;
app.stage.addChild(title);

const CARD_WIDTH = 140;
const CARD_HEIGHT = 210;
const CARD_COUNT = 5;
const SPACING = 20;
const totalWidth = CARD_COUNT * CARD_WIDTH + (CARD_COUNT - 1) * SPACING;
const startX = (app.screen.width - totalWidth) / 2;
const centerY = app.screen.height / 2;

let attempts = 3;
let selectedIndex = null;
let winElements = [];

const textures = [
    narutoCardTexture,
    sakuraCardTexture,
    jiraiyaCardTexture,
    tsunadeCardTexture,
    killerBeeCardTexture
];

const textureOrder = shuffleArray(textures);
const winningIndex = textureOrder.findIndex(t => t === narutoCardTexture);
console.log(`Winning card index: ${winningIndex}`);
const attemptsText = new PIXI.Text(`Attempts: ${attempts}`, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    fontWeight: 'bold'
});
attemptsText.x = app.screen.width - 160;
attemptsText.y = 20;
app.stage.addChild(attemptsText);

const cards = [];
for (let i = 0; i < CARD_COUNT; i++) {
    const container = new PIXI.Container();
    container.x = startX + i * (CARD_WIDTH + SPACING) + CARD_WIDTH / 2;
    container.y = centerY;
    container.interactive = true;
    container.buttonMode = true;
    container.scale.set(1);

    const back = new PIXI.Sprite(cardBackTexture);
    back.width = CARD_WIDTH;
    back.height = CARD_HEIGHT;
    back.anchor.set(0.5);

    const front = new PIXI.Sprite(textureOrder[i]);
    front.width = CARD_WIDTH;
    front.height = CARD_HEIGHT;
    front.anchor.set(0.5);
    front.visible = false;

    container.addChild(back);
    container.addChild(front);

    container.on('pointerover', () => {
        if (selectedIndex === null) gsap.to(container.scale, { x: 1.05, y: 1.05, duration: 0.2 });
    });

    container.on('pointerout', () => {
        if (selectedIndex === null) gsap.to(container.scale, { x: 1, y: 1, duration: 0.2 });
    });

    container.on('pointertap', () => {
        if (selectedIndex !== null || attempts <= 0) return;
        selectedIndex = i;
        const originalY = container.y;

        gsap.to(container, {
            y: originalY - 20,
            duration: 0.2,
            onComplete: () => {
                gsap.to(container.scale, {
                    x: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        back.visible = false;
                        front.visible = true;
                        gsap.to(container.scale, {
                            x: 1,
                            duration: 0.3,
                            ease: 'power2.out',
                            onComplete: () => {
                                if (i === winningIndex) {
                                    showWinScene();
                                } else {
                                    attempts--;
                                    updateAttempts();
                                    if (attempts === 0) {
                                        showLockoutMessage();
                                    } else {
                                        showRestartButton(container, front, back, originalY);
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    cards.push({ container, back, front });
    app.stage.addChild(container);
}

function updateAttempts() {
    attemptsText.text = `Attempts: ${attempts}`;
    if (!app.stage.children.includes(attemptsText)) {
        app.stage.addChild(attemptsText);
    }
    gsap.killTweensOf(attemptsText.scale);
    gsap.fromTo(attemptsText.scale, { x: 1.4, y: 1.4 }, {
        x: 1,
        y: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.3)',
        overwrite: true
    });
}

function showWinScene() {
    const message = new PIXI.Text('🎉 You found Naruto! 🎉', {
        fontFamily: 'Arial',
        fontSize: 48,
        fill: 0xffcc00,
        fontWeight: 'bold',
        align: 'center',
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowDistance: 5
    });
    message.anchor.set(0.5);
    message.x = app.screen.width / 2;
    message.y = 100;
    message.alpha = 0;
    app.stage.addChild(message);
    winElements.push(message);

    gsap.to(message, { alpha: 1, duration: 1, ease: 'power2.out' });

    const claim = new PIXI.Graphics();
    claim.beginFill(0x00cc88);
    claim.drawRoundedRect(-125, -30, 250, 60, 15);
    claim.endFill();
    claim.x = app.screen.width / 2;
    claim.y = app.screen.height - 60;
    claim.interactive = true;
    claim.buttonMode = true;
    claim.alpha = 0;

    const claimText = new PIXI.Text('🎁 Claim your prize 🎁', {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff,
        fontWeight: 'bold'
    });
    claimText.anchor.set(0.5);
    claim.addChild(claimText);
    app.stage.addChild(claim);
    winElements.push(claim);

    gsap.to(claim, { alpha: 1, duration: 1.2, delay: 0.3 });

    for (let i = 0; i < 40; i++) {
        const spark = new PIXI.Graphics();
        spark.beginFill(Math.random() * 0xffffff);
        spark.drawCircle(0, 0, 4 + Math.random() * 4);
        spark.endFill();
        spark.x = app.screen.width / 2;
        spark.y = app.screen.height / 2;
        app.stage.addChild(spark);
        winElements.push(spark);

        const angle = Math.random() * Math.PI * 2;
        const distance = 300 + Math.random() * 300;
        const targetX = spark.x + Math.cos(angle) * distance;
        const targetY = spark.y + Math.sin(angle) * distance;

        gsap.to(spark, {
            x: targetX,
            y: targetY,
            alpha: 0,
            duration: 3,
            ease: 'power2.out',
            onComplete: () => app.stage.removeChild(spark)
        });
    }
}

function showLockoutMessage() {
    const lockout = new PIXI.Text('😞 Please return later', {
        fontFamily: 'Arial',
        fontSize: 36,
        fill: 0xff4444
    });
    lockout.anchor.set(0.5);
    lockout.x = app.screen.width / 2;
    lockout.y = app.screen.height - 100;
    app.stage.addChild(lockout);
    winElements.push(lockout);
}

function showRestartButton(container, front, back, originalY) {
    const button = new PIXI.Text('Try Again', {
        fontFamily: 'Arial',
        fontSize: 36,
        fill: 0xff0000,
        align: 'center'
    });
    button.anchor.set(0.5);
    button.x = app.screen.width / 2;
    button.y = app.screen.height - 100;
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointertap', () => {
        gsap.to(container.scale, {
            x: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                front.visible = false;
                back.visible = true;
                gsap.to(container.scale, {
                    x: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(container, {
                    y: originalY,
                    duration: 0.3
                });
                selectedIndex = null;
                shuffleCards();
                app.stage.removeChild(button);
            }
        });
    });
    app.stage.addChild(button);
    winElements.push(button);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function shuffleCards() {
    const shuffled = shuffleArray(cards);
    for (let i = 0; i < shuffled.length; i++) {
        const { container } = shuffled[i];
        const newX = startX + i * (CARD_WIDTH + SPACING) + CARD_WIDTH / 2;
        gsap.to(container, {
            x: newX,
            y: centerY,
            duration: 0.6,
            ease: 'power2.inOut',
            delay: 0.05 * i
        });
    }
    cards.length = 0;
    cards.push(...shuffled);
}
