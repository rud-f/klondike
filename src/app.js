import * as PIXI from 'pixi.js';
import {gsap} from "gsap";
import {PixiPlugin} from "gsap/PixiPlugin";
import './styles.css';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);
//======================= Placement of all elements =============================

let Sprite = PIXI.Sprite;

const width = 1366;
const height = 626;
const app = new PIXI.Application({width, height, resolution: window.devicePixelRatio || 1,});
document.body.appendChild(app.view);

PIXI.Loader.shared
.add('bg', 'src/spritesheets/bg.png')
.add('src/spritesheets/subjects.json')
.add('src/animations/cows.json')
.add('src/animations/barrel.json')
.add('src/animations/smoke.json')
.load((loader, resources) => {
    const bg = new Sprite(resources.bg.texture);
    bg.width = width;
    bg.y = -400;
    app.stage.addChild(bg);

    const subjects = resources['src/spritesheets/subjects.json'].textures;
    const spritesCows = resources['src/animations/cows.json'].textures;
    const spritesBarrel = resources['src/animations/barrel.json'].textures;
    const spritesSmoke = resources['src/animations/smoke.json'].textures;

    const logo = new Sprite(subjects['logo']);
    logo.x = 48;
    app.stage.addChild(logo);

    const milkman = new PIXI.Container();
    milkman.addChild(new Sprite(subjects['milkman']));
    milkman.position.set(535, 95);
    app.stage.addChild(milkman);
    //-------------- algorithm for layout gardenbed-containerdes -------------------
    const setGardenbeds = new PIXI.Container();
    for (let i = 0; i < 6; i++) {
        setGardenbeds.addChild(
            new PIXI.Container().addChild(
                new Sprite(subjects['gardenbed'])
            )
        );
        const {width, height} = setGardenbeds.children[i];
        if(i) {                                            // i !== 0
            const {x, y} = setGardenbeds.children[i - 1].position;

            [setGardenbeds.children[i].x, setGardenbeds.children[i].y] = i % 2 !== 0 ?
                [x + width / 2 - 10, y + height / 2 - 7]
                : [x - width + 20, y]
        } else {
            [setGardenbeds.children[i].x, setGardenbeds.children[i].y] = [460, 380];
        }
        //planting wheat
        const wheat = new Sprite(subjects['wheat_1']);
        wheat.position.set(10, -50);
        setGardenbeds.children[i].addChild(wheat);
    }
    app.stage.addChild(setGardenbeds);
    //-------------------- creating toolbar ---------------------------------
    const toolsArea = new PIXI.Container();
    toolsArea.position.set(app.stage.width - 250, 35);
    const toolsBackground = new Sprite(subjects['tools_background']);
    toolsBackground.width = 180;
    toolsBackground.height = 555;
    const baseTop = new Sprite(subjects['tool_active_base']);
    const baseMiddle = new Sprite(subjects['tool_inactive_base']);
    const baseBottom = new Sprite(subjects['tool_inactive_base']);
    [baseTop, baseMiddle, baseBottom].map((base, i) => {
        base.position.set(15, 20 + 20 * i + 150 * i);
        base.width = base.height = 150;
        base.id = i;
    });
    const tool_1 = new Sprite(subjects['tool_1']);
    tool_1.anchor.set(.5, .5);
    tool_1.position.set(baseTop.width / 2 - 10, baseTop.height / 2 - 10);
    tool_1.scale.y = 1.2;
    tool_1.id = 1;
    baseTop.addChild(tool_1);
    [baseMiddle, baseBottom].map((base) => {
        base.addChild(new Sprite(subjects['questionmark']));
        base.children[0].anchor.set(.5, .5);
        base.children[0].position.set(base.width / 2 - 10, base.height / 2 - 10);
        base.children[0].scale.set(1.5, 1.2);
    });
    toolsArea.addChild(
        toolsBackground,
        baseTop,
        baseMiddle,
        baseBottom,
    );
    app.stage.addChild(toolsArea);
    //---------------- creating button 'install' --------------------------
    const button = new Sprite(subjects['button_green']);
    const styleButton = new PIXI.TextStyle({
        fontFamily: 'Helvetica',
        fontSize: 28,
        fill: 'black',
        stroke: 'white',
        fontWeight: 'bold',
        strokeThickness: 5,
        dropShadowBlur: 12,
    });
    const text = new PIXI.Text('Установить', styleButton);
    text.anchor.set(.5, .5);
    text.position.set(button.width / 2, button.height / 2);
    button.addChild(text);
    button.position.set(0, height - button.height);
    app.stage.addChild(button);
    button.interactive = true;
    button.on('click', () => document.location.href = 'https://klondikecity.info/');
    gsap.to(button, {pixi: {scaleX: 1.2, scaleY: 1.2}, repeat: -1, duration: 2, yoyo: true});
    //----------------- add cows -----------------------------------
    const cows = new PIXI.Container();
    cows.position.set(740, 340);
    const cowLeft = new PIXI.Container();
    cowLeft.position.set(0, 90);
    const cowRight = new PIXI.Container();
    cowRight.scale.x = -1;
    cowRight.position.set(250, 90);
    const cowTop = new PIXI.Container();
    cowTop.scale.x = -1;
    cowTop.position.set(180, 0);
    [cowLeft, cowRight, cowTop].map(i => {
        i.addChild(new Sprite(subjects['shadow']));
        i.addChild(new Sprite(spritesCows['cow_1']));
        i.children[0].position.set(0, 30);
        i.children[0].scale.set(2, 2);
    });
    cows.addChild(
        cowRight,
        cowLeft,
        cowTop
    );
    app.stage.addChild(cows);
    //--------------- dynamic elements(will be added later) -------------
    const prohibitingSign = new PIXI.Container();
    const ellipse = new Sprite(subjects['ellipse_1']);
    ellipse.anchor.set(.5, .5 );
    const x = new Sprite(subjects['x']);
    x.anchor.set(.5, .5);
    prohibitingSign.addChild(ellipse, x);
    prohibitingSign.scale.set(0, 0);

    const removeTool = (base) => {
        const i = base.id > 0 ? 2 : 0;
        base.children[i].destroy();
        const toolUsed = new Sprite(subjects['tool_used']);
        toolUsed.anchor.set(.5, .5);
        toolUsed.position.set(base.width / 2 - 10, base.height / 2 - 10);
        toolUsed.scale.set(1.2, 1.2);
        base.addChild(toolUsed);
    };

    const addTool = (base) => {
        const tool = new Sprite(subjects[`tool_${base.id + 1}`]);
        tool.anchor.set(.5, .5);
        tool.scale.set(.75, .75);
        tool.position.set(
            baseMiddle.children[1].width / 2,
            baseMiddle.height / 2 - 10,
        );
        tool.id = base.id + 1;
        tool.interactive = true;
        tool.buttonMode = true;
        tool
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
        setTimeout(() => {
            base.children[1].children[0].destroy();
            base.addChild(tool)
        }, 4000);
    };

    const endingBuildPicture = () => {
        const endingPicture =  new PIXI.Container();
        const shape288 = new Sprite(subjects['shape288']);
        const successBg = new Sprite(subjects['success_background']);
        const cheese = new Sprite(subjects['cheese']);
        const styleHeader = new PIXI.TextStyle({
            fontFamily: 'Arial sans-serif',
            fontSize: 56,
            fill: '#382721',
            fontWeight: 'bold',
        });
        const styleOther = new PIXI.TextStyle({
            fontFamily: 'Arial sans-serif',
            fontSize: 38,
            fill: '#382721',
        });
        const headerText = new PIXI.Text('Отличная работа!', styleHeader);
        headerText.position.set(0, -95);
        const bodyText = new PIXI.Text('Установите,', styleOther);
        bodyText.position.set(0, 75);
        const footerText = new PIXI.Text('чтобы продолжить!', styleOther );
        footerText.position.set(0, 95);

        logo.position.set(0, -successBg.height /2);
        button.position.set(0, successBg.height/2 - button.height / 4);
        text.position.set(0, 0);
        [headerText, bodyText, footerText, logo, button].map(sprite => sprite.scale.set(.5, .5));
        endingPicture.addChild(
            shape288,
            successBg,
            cheese,
            headerText,
            bodyText,
            footerText,
            button,
            logo
        );
        endingPicture.children.map(sprite => {
            sprite.anchor.set(.5, .5);
        });
        endingPicture.position.set(width / 2, height / 2);
        app.stage.addChild(endingPicture);
        return endingPicture;
    };
    //-------------- creation of the fields of objects to interact --------------
    cows._localBoundsRect = new PIXI.Rectangle(
        cows.position.x,
        cows.position.y,
        cows.width,
        cows.height
    );
    milkman._localBoundsRect = new PIXI.Rectangle(
        milkman.position.x,
        milkman.position.y,
        milkman.width,
        milkman.height
    );
    new PIXI.Rectangle(
        setGardenbeds.localTransform.tx,
        setGardenbeds.localTransform.ty,
        setGardenbeds.width,
        setGardenbeds.height
    );
//======================== Animation ===============================
    const invalidTarget = (tx, ty) => {
        prohibitingSign.position.set(tx, ty);
        app.stage.addChild(prohibitingSign);
        gsap.to(prohibitingSign, {pixi: {scaleX: 1, scaleY: 1}, duration: 0.3});
        gsap.to(prohibitingSign, {pixi: {scaleX: 0, scaleY: 0}, delay: 1});
    };
    let finger;
    const hint = (base = baseTop) => {
        finger = new Sprite(subjects['finger']);
        finger.alpha = 0;
        base.addChild(finger);
        const [x, y] = base === baseTop ? [-550, 300] : base === baseMiddle ? [-250, 150] : [-450, -220];
        gsap.to(finger, {pixi: {x: base.width / 2, y: base.height / 2}, duration: 1, repeat: -1, repeatDelay: 5});
        gsap.to(finger, {pixi: {alpha: 1}, duration: 1, delay: 1, repeat: -1, repeatDelay: 5});
        gsap.to(finger, {pixi: {x, y}, duration: 1, delay: 2,  repeat: -1, repeatDelay: 5});
        gsap.to(finger, {pixi: {alpha: 0}, duration: 1, delay: 3,  repeat: -1, repeatDelay: 5});
    };
    hint();

    const fillResource = (base) => {
        const container = new Sprite(subjects['tool_active_base']);
        container.anchor.y = 1;
        container.y = 133;
        container.height = 0;
        const unknownTool = new Sprite(subjects['tool_unknown']);
        unknownTool.anchor.set(.5, .5);
        unknownTool.position.set(base.width / 2 - 10, -base.height / 2 + 10);
        unknownTool.scale.set(1.5, 1.2);
        container.addChild(unknownTool);
        base.addChild(container);
        gsap.to(container, {pixi: {height: 133}, delay: 1.6, duration: .7});
        addTool(base)
    };

    const animationFlowResources = (resource, base) => {
        gsap.to(resource, {pixi: {y: resource.position.y - 100}, duration: 1});
        gsap.to(resource, {
            pixi: {
                x: base.worldTransform.tx + base.width / 2 - resource.width / 2,
                y: base.worldTransform.ty + base.height / 2 - resource.height / 2
            }, duration: 1, delay: 1
        });
        gsap.to(resource, {pixi: {scaleX: 0, scaleY: 0}, duration: 1, delay: 2});
    };

    const harvest = () => {
        removeTool(baseTop);
        for (let i = 5; i >= 0; i--) {
            setTimeout(() => {
                setGardenbeds.children[i].children[0].destroy();
                const resource = new Sprite(subjects['resource_1']);
                resource.position.set(
                    setGardenbeds.children[i].worldTransform.tx,
                    setGardenbeds.children[i].worldTransform.ty,
                );
                app.stage.addChild(resource);
                animationFlowResources(resource, baseMiddle);
            }, 250 * (5 - i));
        }
        fillResource(baseMiddle);
    };

    const milking = () => {
        removeTool(baseMiddle);
        cows.children.map((cow, i) => {
            setTimeout(() => {
                for (let j = 2; j < 6; j++) {
                    setTimeout(() => {
                        cow.children[1].destroy();
                        cow.addChild(new Sprite(spritesCows[`cow_${j}`]))
                    }, 200 * (j - 2));
                }
                const resource = new Sprite(subjects['resource_2']);
                i % 2 === 0 ?
                    resource.position.set(cow.worldTransform.tx + cow.width / 2, cow.worldTransform.ty)
                    :
                    resource.position.set(cow.worldTransform.tx, cow.worldTransform.ty);
                app.stage.addChild(resource);
                animationFlowResources(resource, baseBottom);
            }, 500 * i);

        });
        fillResource(baseBottom)
    };

    const cheeseMaking = () => {
        removeTool(baseBottom);
        for (let i = 1; i < 15; i++) {
            setTimeout(() => {
                milkman.children.map((sprite, i) => {if(i > 0) sprite.destroy()});
                const barrel = new Sprite(spritesBarrel[`barrel_${i}`]);
                barrel.position.set(100, 130);
                const smoke = new Sprite(spritesSmoke[`smoke_${i > 10 ? i - 10 : i}`]);
                smoke.position.set(120, -45);
                milkman.addChild(barrel, smoke);
            }, 150 * i)
        }

    };

    const ending = () => {
        setTimeout(() => {
            gsap.killTweensOf(button); // remove old animation
            app.stage.removeChild(toolsArea);
            gsap.to(app.stage.children, {pixi: {brightness: 0.2}, duration: 2});
            gsap.to(button, {pixi: {brightness: 1}, duration: 2});    // Это хак) По другому пришшлось бы
            gsap.to(logo, {pixi: {brightness: 1}, duration: 2});     // заново создавать элементы, чтобы они не темнели
            gsap.to(endingBuildPicture(), {pixi: {scaleX: 2, scaleY: 2}, duration: 2});
        }, 2000);
    };
//======================== Application logic =======================
    tool_1.interactive = true;
    tool_1.buttonMode = true;
    tool_1
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

    function onDragStart(event) {
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }

    function onDragMove() {
        if(this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }

    function onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
        isHitTarget.call(this);
    }

    function isHitTarget() {
        const {tx, ty} = this.worldTransform;
        const isTouchSetGardenbeds = setGardenbeds._localBoundsRect.contains(tx, ty);
        const isTouchCows = cows._localBoundsRect.contains(tx, ty);
        const isTouchMilkman = milkman._localBoundsRect.contains(tx, ty);
        switch (this.id) {
            case 1 :
                if(isTouchCows || isTouchMilkman) {
                    invalidTarget(tx, ty);
                    this.position.set(baseTop.width / 2 - 10, baseTop.height / 2 - 10);
                } else if(isTouchSetGardenbeds) {
                    baseTop.removeChild(finger);
                    harvest();
                    setTimeout(() => hint(baseMiddle), 4000)
                } else {
                    this.position.set(baseTop.width / 2 - 10, baseTop.height / 2 - 10)
                }
                break;
            case 2 :
                if(isTouchSetGardenbeds || isTouchMilkman) {
                    invalidTarget(tx, ty);
                    this.position.set(baseMiddle.width / 2 - 10, baseMiddle.height / 2 - 10);
                } else if(isTouchCows) {
                    baseMiddle.removeChild(finger);
                    milking();
                    setTimeout(() => hint(baseBottom), 4000)
                } else {
                    this.position.set(baseMiddle.children[1].width / 2, baseMiddle.height / 2 - 10,)
                }
                break;
            case 3 :
                if(isTouchSetGardenbeds || isTouchCows) {
                    invalidTarget(tx, ty);
                    this.position.set(baseBottom.width / 2 - 10, baseBottom.height / 2 - 10);
                } else if(isTouchMilkman) {
                    baseBottom.removeChild(finger);
                    cheeseMaking();
                    ending()
                } else {
                    this.position.set(baseBottom.children[1].width / 2, baseBottom.height / 2 - 10,)
                }
                break;
        }
    }
});



