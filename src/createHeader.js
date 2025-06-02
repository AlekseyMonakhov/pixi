import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

function createHeader(app) {
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
}

export default createHeader;