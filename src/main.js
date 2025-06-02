// src/main.js
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI(PIXI);

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

// Создаем контейнер для заголовка в стиле Наруто
const titleContainer = new PIXI.Container();
titleContainer.x = app.screen.width / 2;
titleContainer.y = 50;
app.stage.addChild(titleContainer);

// Создаем оранжевый фон, как в логотипе Наруто
const logoBackground = new PIXI.Graphics();
logoBackground.beginFill(0xff6600);
logoBackground.drawRect(-170, -30, 340, 60);
logoBackground.endFill();
titleContainer.addChild(logoBackground);

// Добавляем чёрную рамку
const logoOutline = new PIXI.Graphics();
logoOutline.lineStyle(5, 0x000000);
logoOutline.drawRect(-173, -33, 346, 66);
logoOutline.endFill();
titleContainer.addChild(logoOutline);

// Основной текст заголовка
const title = new PIXI.Text('FIND NARUTO', {
    fontFamily: 'Arial Black, Impact, sans-serif',
    fontSize: 38,
    fill: 0xffffff,
    fontWeight: 'bold',
    stroke: 0x000000,
    strokeThickness: 5,
    align: 'center',
    letterSpacing: 2
});
title.anchor.set(0.5);
titleContainer.addChild(title);

// Добавляем спиральный символ Узумаки (как символ деревни скрытого листа)
const spiralSymbol = new PIXI.Graphics();
spiralSymbol.lineStyle(4, 0x000000);
for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 15 * (1 - i / 10);
    spiralSymbol.arc(-140, 0, radius, angle, angle + Math.PI / 4);
}
spiralSymbol.beginFill(0x000000);
spiralSymbol.drawCircle(-140, 0, 4);
spiralSymbol.endFill();
titleContainer.addChild(spiralSymbol);

// Зеркальный символ справа
const spiralSymbol2 = new PIXI.Graphics();
spiralSymbol2.lineStyle(4, 0x000000);
for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 15 * (1 - i / 10);
    spiralSymbol2.arc(140, 0, radius, angle, angle + Math.PI / 4);
}
spiralSymbol2.beginFill(0x000000);
spiralSymbol2.drawCircle(140, 0, 4);
spiralSymbol2.endFill();
titleContainer.addChild(spiralSymbol2);

// Добавляем светлый блик сверху текста
const highlight = new PIXI.Graphics();
highlight.beginFill(0xffff99, 0.3);
highlight.drawRect(-160, -25, 320, 15);
highlight.endFill();
titleContainer.addChild(highlight);

// Анимации
// Вращение символов
gsap.to(spiralSymbol, {
    rotation: Math.PI * 2,
    duration: 8,
    repeat: -1,
    ease: 'none'
});

gsap.to(spiralSymbol2, {
    rotation: -Math.PI * 2,
    duration: 8,
    repeat: -1,
    ease: 'none'
});

// Пульсация всего контейнера
gsap.to(titleContainer.scale, {
    x: 1.03,
    y: 1.03,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
});

// Анимация блика
gsap.to(highlight, {
    alpha: 0.1,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
});

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
    // Добавляем затемнение для фона
    const overlay = new PIXI.Graphics();
    overlay.beginFill(0x000000, 0.5);
    overlay.drawRect(0, 0, app.screen.width, app.screen.height);
    overlay.endFill();
    overlay.alpha = 0;
    app.stage.addChild(overlay);
    winElements.push(overlay);

    gsap.to(overlay, { alpha: 1, duration: 0.6 });

    // Создаем контейнер для выигрышной сцены, но делаем его меньше
    const winContainer = new PIXI.Container();
    winContainer.x = app.screen.width / 2;
    winContainer.y = app.screen.height / 2;
    winContainer.scale.set(0);
    app.stage.addChild(winContainer);
    winElements.push(winContainer);

    // Добавляем более компактный фон для сообщения
    const msgBackground = new PIXI.Graphics();
    msgBackground.beginFill(0x222266, 0.85);
    msgBackground.lineStyle(4, 0xffcc00);
    msgBackground.drawRoundedRect(-250, -150, 500, 300, 30);
    msgBackground.endFill();
    winContainer.addChild(msgBackground);

    // Сообщение о победе
    const message = new PIXI.Text('🎉 You found Naruto! 🎉', {
        fontFamily: 'Arial',
        fontSize: 36,
        fill: 0xffcc00,
        fontWeight: 'bold',
        align: 'center',
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowDistance: 5
    });
    message.anchor.set(0.5);
    message.y = -80;
    winContainer.addChild(message);

    // Декоративные звездочки вокруг сообщения (меньше и компактнее)
    for (let i = 0; i < 10; i++) {
        const star = new PIXI.Graphics();
        star.beginFill(0xffff66);

        // Рисуем звезду вручную
        const outerRadius = 8;
        const innerRadius = 4;
        const spikes = 5;

        // Начинаем с вершины
        star.moveTo(0, -outerRadius);

        // Рисуем остальные точки звезды
        for (let j = 0; j < spikes; j++) {
            // Внешний угол
            const outerAngle = Math.PI * 2 * (j / spikes - 0.25);
            // Внутренний угол
            const innerAngle = Math.PI * 2 * ((j + 0.5) / spikes - 0.25);

            // Внешняя точка
            const outerX = Math.cos(outerAngle) * outerRadius;
            const outerY = Math.sin(outerAngle) * outerRadius;

            // Внутренняя точка
            const innerX = Math.cos(innerAngle) * innerRadius;
            const innerY = Math.sin(innerAngle) * innerRadius;

            // Рисуем линию к внутренней точке
            star.lineTo(innerX, innerY);

            // Если не последняя итерация, рисуем линию к следующей внешней точке
            if (j < spikes - 1) {
                star.lineTo(outerX, outerY);
            }
        }

        // Закрываем путь
        star.closePath();
        star.endFill();

        // Располагаем звезды в более компактной области
        star.x = Math.random() * 460 - 230;
        star.y = Math.random() * 260 - 130;
        star.scale.set(0.3 + Math.random() * 0.5);
        star.alpha = 0.6 + Math.random() * 0.4;
        star.rotation = Math.random() * Math.PI;
        winContainer.addChild(star);

        // Анимация вращения и пульсации
        gsap.to(star, {
            rotation: Math.PI * 2 + star.rotation,
            duration: 5 + Math.random() * 5,
            repeat: -1,
            ease: 'none'
        });

        gsap.to(star.scale, {
            x: star.scale.x * 1.3,
            y: star.scale.y * 1.3,
            duration: 0.8 + Math.random() * 0.7,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // Информационный текст под основным сообщением
    const infoText = new PIXI.Text('Congratulations on your victory!', {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff,
        align: 'center'
    });
    infoText.anchor.set(0.5);
    infoText.y = -30;
    winContainer.addChild(infoText);

    // Анимированное появление всего контейнера
    gsap.to(winContainer.scale, {
        x: 1, y: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.3
    });

    // Кнопка для получения приза
    const claim = new PIXI.Container();
    claim.y = 80;
    claim.interactive = true;
    claim.buttonMode = true;
    winContainer.addChild(claim);

    // Фон кнопки
    const claimBg = new PIXI.Graphics();
    claimBg.beginFill(0x00cc88);
    claimBg.lineStyle(3, 0x009966);
    claimBg.drawRoundedRect(-125, -30, 250, 60, 15);
    claimBg.endFill();
    claim.addChild(claimBg);

    // Блик для кнопки
    const claimHighlight = new PIXI.Graphics();
    claimHighlight.beginFill(0xffffff, 0.3);
    claimHighlight.drawRoundedRect(-120, -25, 240, 25, 12);
    claimHighlight.endFill();
    claim.addChild(claimHighlight);

    // Текст кнопки
    const claimText = new PIXI.Text('🎁 Claim your prize 🎁', {
        fontFamily: 'Arial',
        fontSize: 22,
        fill: 0xffffff,
        fontWeight: 'bold',
        dropShadow: true,
        dropShadowColor: '#007755',
        dropShadowDistance: 2
    });
    claimText.anchor.set(0.5);
    claim.addChild(claimText);

    // Эффект при наведении
    claim.on('pointerover', () => {
        gsap.to(claim.scale, { x: 1.05, y: 1.05, duration: 0.2 });
        claimText.style.fill = 0xffffcc;
    });

    claim.on('pointerout', () => {
        gsap.to(claim.scale, { x: 1, y: 1, duration: 0.2 });
        claimText.style.fill = 0xffffff;
    });

    claim.on('pointertap', () => {
        // Здесь логика при клике на кнопку
        window.open('https://example.com/claim', '_blank');
    });

    claim.alpha = 0;
    gsap.to(claim, { alpha: 1, duration: 0.8, delay: 1.5 });

    // Добавляем визуальные эффекты фейерверка
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const spark = new PIXI.Graphics();
            spark.beginFill(Math.random() > 0.5 ? 0xffcc00 : 0x00ccff);
            spark.drawCircle(0, 0, 3 + Math.random() * 5);
            spark.endFill();
            spark.x = app.screen.width / 2;
            spark.y = app.screen.height / 2;
            app.stage.addChild(spark);
            winElements.push(spark);

            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 400;
            const duration = 1.5 + Math.random() * 2;
            const targetX = spark.x + Math.cos(angle) * distance;
            const targetY = spark.y + Math.sin(angle) * distance;

            gsap.to(spark, {
                x: targetX,
                y: targetY,
                alpha: 0,
                duration: duration,
                ease: 'power2.out',
                onComplete: () => app.stage.removeChild(spark)
            });
        }, i * 50);
    }

    // Добавляем конфетти эффект
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = new PIXI.Graphics();
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetti.beginFill(color);

            if (Math.random() > 0.5) {
                confetti.drawRect(-5, -2, 10, 4);
            } else {
                confetti.drawCircle(0, 0, 4);
            }

            confetti.endFill();
            confetti.x = Math.random() * app.screen.width;
            confetti.y = -50;
            confetti.rotation = Math.random() * Math.PI * 2;
            app.stage.addChild(confetti);
            winElements.push(confetti);

            gsap.to(confetti, {
                y: app.screen.height + 50,
                x: confetti.x + (Math.random() * 200 - 100),
                rotation: Math.random() * Math.PI * 4,
                alpha: 0,
                duration: 5 + Math.random() * 5,
                ease: 'power1.in',
                onComplete: () => app.stage.removeChild(confetti)
            });
        }, 1000 + i * 40);
    }
}

function showLockoutMessage() {
    // Создаем контейнер для группировки элементов
    const container = new PIXI.Container();
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Добавляем полупрозрачный фон
    const background = new PIXI.Graphics();
    background.beginFill(0x000000, 0.7);
    background.drawRoundedRect(-200, -120, 400, 240, 20);
    background.endFill();

    // Добавляем иконку
    const sadEmoji = new PIXI.Text('😞', {
        fontSize: 72
    });
    sadEmoji.anchor.set(0.5);
    sadEmoji.y = -60;

    // Основной текст
    const lockoutText = new PIXI.Text('No attempts left', {
        fontFamily: 'Arial',
        fontSize: 36,
        fill: 0xffffff,
        fontWeight: 'bold',
        align: 'center'
    });
    lockoutText.anchor.set(0.5);
    lockoutText.y = 0;

    // Дополнительный текст
    const subText = new PIXI.Text('Please try again later', {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xcccccc,
        align: 'center'
    });
    subText.anchor.set(0.5);
    subText.y = 40;

    // Добавляем элементы в контейнер
    container.addChild(background, sadEmoji, lockoutText, subText);

    // Анимация появления
    container.alpha = 0;
    gsap.to(container, {
        alpha: 1,
        duration: 0.5,
        ease: 'power2.out'
    });

    // Добавляем эффект пульсации для эмоджи
    gsap.to(sadEmoji.scale, {
        x: 1.1,
        y: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    app.stage.addChild(container);
    winElements.push(container);
}

function showRestartButton(container, front, back, originalY) {
    // Создаем контейнер для кнопки
    const buttonContainer = new PIXI.Container();
    buttonContainer.x = app.screen.width / 2;
    buttonContainer.y = app.screen.height - 100;
    buttonContainer.interactive = true;
    buttonContainer.buttonMode = true;

    // Создаем фон кнопки
    const buttonBg = new PIXI.Graphics();
    buttonBg.beginFill(0xff3333);
    buttonBg.drawRoundedRect(-100, -25, 200, 50, 15);
    buttonBg.endFill();

    // Добавляем блик на кнопке для объемного эффекта
    const highlight = new PIXI.Graphics();
    highlight.beginFill(0xffffff, 0.3);
    highlight.drawRoundedRect(-95, -22, 190, 20, 10);
    highlight.endFill();

    // Текст кнопки
    const buttonText = new PIXI.Text('↺ Try Again', {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: 'bold'
    });
    buttonText.anchor.set(0.5);

    // Собираем кнопку
    buttonContainer.addChild(buttonBg, highlight, buttonText);

    // Анимация появления
    buttonContainer.alpha = 0;
    gsap.to(buttonContainer, {
        alpha: 1,
        duration: 0.5,
        ease: 'back.out(1.5)'
    });

    // Эффекты при наведении
    buttonContainer.on('pointerover', () => {
        gsap.to(buttonContainer.scale, { x: 1.05, y: 1.05, duration: 0.2 });
    });

    buttonContainer.on('pointerout', () => {
        gsap.to(buttonContainer.scale, { x: 1, y: 1, duration: 0.2 });
    });

    // Действие при нажатии
    buttonContainer.on('pointertap', () => {
        // Эффект нажатия
        gsap.to(buttonContainer.scale, {
            x: 0.95,
            y: 0.95,
            duration: 0.1,
            onComplete: () => {
                // Выполняем оригинальную логику
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

                        // Анимируем исчезновение кнопки
                        gsap.to(buttonContainer, {
                            alpha: 0,
                            duration: 0.3,
                            onComplete: () => app.stage.removeChild(buttonContainer)
                        });
                    }
                });
            }
        });
    });

    app.stage.addChild(buttonContainer);
    winElements.push(buttonContainer);
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
