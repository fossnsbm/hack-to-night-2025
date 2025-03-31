"use client";

import { useEffect } from "react";

const is_mobile = "navigator" in globalThis ? /Mobi/i.test(navigator.userAgent) : false;

const STAR_SIZE = 1;
const STAR_FLOAT_SPEED = 8;
const STAR_NUM = 200;
const STAR_SHINE_DUR = 10000;

const MOON_SIZE = is_mobile ? 0.80 : 0.40;

const ASTRO_WIDTH = is_mobile ? 0.30 : 0.10;
const ASTRO_FLOAT_SPEED = 5;

type Vec2 = {
    x: number,
    y: number
}

type Star = {
    pos: Vec2,
    last_shined: number,
    shining_time: number,
    shining_factor: number,
    float_speed_factor: number
}

type Stars = {
    scroll_amount: number,
    stars: Star[]
}

type Moon = {
    pos: Vec2,
    offset: Vec2,
}

type Astronaut = {
    pos: Vec2
    float_dir: Vec2
    float_offset: Vec2,
    scroll_offset: Vec2
    offset: Vec2,
}

var page: HTMLDivElement;
var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;

var last_timestamp = 0;
var last_scroll_y = 0;

const imageMap = new Map<string, HTMLImageElement>();

const stars: Stars = {
    stars: [],
    scroll_amount: 0
}

const moon: Moon = {
    pos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
}

const astro: Astronaut = {
    pos: { x: 0, y: 0 },
    float_dir: { x: 0, y: 0 },
    float_offset: { x: 0, y: 0 },
    scroll_offset: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
}

function update(delta: number, timestamp: number) {
    const scroll_y_delta = page.scrollTop - last_scroll_y;
    last_scroll_y = page.scrollTop;

    // Stars

    stars.scroll_amount -= (scroll_y_delta / canvas.height) * 0.2;

    for (const star of stars.stars) {
        if (timestamp - star.last_shined > star.shining_time) {
            star.last_shined = timestamp;
        }

        const shining_elapsed = (timestamp - star.last_shined) / star.shining_time;
        star.shining_factor = (Math.sin(shining_elapsed * 2 * Math.PI) + 1) / 2;

        star.pos.x -= (star.float_speed_factor / canvas.width) * delta;
        star.pos.y -= (star.float_speed_factor / canvas.height) * delta;

        star.pos.y += stars.scroll_amount * delta;

        if (star.pos.x < 0) {
            star.pos.x += 1;
        } else if (star.pos.x > 1) {
            star.pos.x -= 1;
        }

        if (star.pos.y < 0) {
            star.pos.y += 1;
        } else if (star.pos.y > 1) {
            star.pos.y -= 1;
        }
    }

    stars.scroll_amount -= stars.scroll_amount * delta;

    // Moon

    const moon_pos: Vec2 = {
        x: (1 - (MOON_SIZE * 2/3)),
        y: (1 - ((MOON_SIZE * (canvas.width / canvas.height)) * 2/3))
    };
    
    const moon_scroll_goal: Vec2 = {
        x: 1 + MOON_SIZE,
        y: 2 + MOON_SIZE
    };

    moon.offset.x = (moon_scroll_goal.x - moon_pos.x) * (page.scrollTop / page.clientHeight);
    moon.offset.y = (moon_scroll_goal.y - moon_pos.y) * (page.scrollTop / page.clientHeight);
    
    moon.pos.x = moon_pos.x + moon.offset.x;
    moon.pos.y = moon_pos.y + moon.offset.y;
    
    // Astronaut
    const astro_src_dims = imgDims("astronaut.png");
    const astro_dims: Vec2 = {
        x: ASTRO_WIDTH,
        y: ((ASTRO_WIDTH * canvas.width) / (astro_src_dims.x / astro_src_dims.y)) / canvas.height
    };

    const astro_pos: Vec2 = {
        x: (1 - (1 - moon.pos.x) - (astro_dims.x * 2/3)),
        y: (1 - (1 - moon.pos.y) - (astro_dims.y * 2/3))
    };

    if (Math.random() < 0.001) {
        astro.float_dir.x *= -1
    }

    if (Math.random() < 0.001) {
        astro.float_dir.y *= -1
    }
    
    astro.float_offset.x += astro.float_dir.x * ASTRO_FLOAT_SPEED * delta * 0.0005;
    astro.float_offset.y += astro.float_dir.y * ASTRO_FLOAT_SPEED * delta * 0.0005;

    astro.float_offset.x = Math.max(Math.min(astro.float_offset.x, 0.05), -0.05);
    astro.float_offset.y = Math.max(Math.min(astro.float_offset.y, 0.05), -0.05);

    const astro_scroll_goal_x = 1 + astro_dims.x;
    const astro_scroll_goal_y = 0;

    astro.scroll_offset.x = (astro_scroll_goal_x - astro_pos.x) * (page.scrollTop / page.clientHeight);
    astro.scroll_offset.y = (astro_scroll_goal_y - astro_pos.y) * (page.scrollTop / page.clientHeight);

    astro.offset.x = astro.scroll_offset.x + astro.float_offset.x;
    astro.offset.y = astro.scroll_offset.y + astro.float_offset.y;
    
    astro.pos.x = astro_pos.x + astro.offset.x;
    astro.pos.y = astro_pos.y + astro.offset.y;
}

function render() {
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#081016";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars

    for (const star of stars.stars) {
        ctx.globalAlpha = Math.pow(star.shining_factor, 1 / 2.2);
        ctx.fillStyle = `rgb(255, 255, 255)`;
        ctx.fillRect(star.pos.x * canvas.width, star.pos.y * canvas.height, STAR_SIZE, STAR_SIZE);
    }

    // Images

    ctx.globalAlpha = 1.0;

    ctx.drawImage(
        imageMap.get("moon.png")!,
        moon.pos.x * canvas.width,
        moon.pos.y * canvas.height,
        MOON_SIZE * canvas.width,
        MOON_SIZE * canvas.width,
    );

    const astro_dims = imgDims("astronaut.png");
    
    ctx.drawImage(
        imageMap.get("astronaut.png")!,
        astro.pos.x * canvas.width,
        astro.pos.y * canvas.height,
        ASTRO_WIDTH * canvas.width,
        (ASTRO_WIDTH * canvas.width) / (astro_dims.x / astro_dims.y),
    );
}

function frame(timestamp: DOMHighResTimeStamp) {
    const delta = (timestamp - last_timestamp) / 1000;
    last_timestamp = timestamp;

    update(delta, timestamp);
    render();

    requestAnimationFrame(frame);
}

async function init() {
    page = document.getElementById("page")! as HTMLDivElement;
    canvas = document.getElementById("bg")! as HTMLCanvasElement;
    ctx = canvas.getContext("2d")!;

    await imgAdd("moon.png");
    await imgAdd("astronaut.png");

    for (let i = 0; i < STAR_NUM; i++) {
        stars.stars.push({
            pos: { x: Math.random(), y: Math.random() },
            last_shined: 0,
            shining_time: (STAR_SHINE_DUR * 0.2) + (Math.random() * (STAR_SHINE_DUR * 0.8)),
            float_speed_factor: (STAR_FLOAT_SPEED * 0.60) + (Math.random() * (STAR_FLOAT_SPEED * 0.40)),
            shining_factor: 0
        });
    }

    const resizeObserver = new ResizeObserver(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    resizeObserver.observe(document.body);

    window.addEventListener("blur", () => {
        stars.scroll_amount = 0;
    });

    requestAnimationFrame(frame);
}

function imgAdd(src: string): Promise<void> {
    return new Promise((res) => {
        const img = new Image();
        img.onload = () => res();
        img.src = src;

        imageMap.set(src, img);
    });
}

function imgDims(src: string): Vec2 {
    const img = imageMap.get(src)!;
    return { x: img.width, y: img.height };
}

function BackgroundCanvas() {
    useEffect(() => {
        init();
    }, [])

    return <canvas id="bg" className="fixed top-0 left-0 w-screen h-screen z-0"></canvas>
};

export default BackgroundCanvas;
