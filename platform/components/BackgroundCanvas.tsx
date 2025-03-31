"use client";

import { useEffect, useRef } from "react";

type Star = {
    x: number,
    y: number,
    last_shined: number,
    shining_time: number,
    shining_factor: number,
    float_speed_factor: number
}

const imageMap = new Map<string, HTMLImageElement>();
const is_mobile = "navigator" in globalThis ? /Mobi/i.test(navigator.userAgent) : false;

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var page: HTMLDivElement;

var last_timestamp = 0;
var last_scroll_y = 0;

const star_shine_time = 10000;
const star_float_speed = 5;
const no_of_stars = is_mobile ? 50 : 200;
const stars: Star[] = [];

var star_scroll_amount = 0;

const astro_float_speed = 5;
const astro_w = is_mobile ? 0.30 : 0.10;
const moon_size = is_mobile ? 0.80 : 0.40;

var moon_offset_x = 0, moon_offset_y = 0;

var astro_offset_float_x = 0, astro_offset_float_y = 0;
var astro_offset_scroll_x = 0, astro_offset_scroll_y = 0;
var astro_offset_x = 0, astro_offset_y = 0;
var astro_float_x = 1, astro_float_y = 1;

function render(timestamp: DOMHighResTimeStamp) {
    // Update

    const delta = (timestamp - last_timestamp) / 1000;
    last_timestamp = timestamp;

    const scroll_y_delta = page.scrollTop - last_scroll_y;
    last_scroll_y = page.scrollTop;

    // Update stars

    star_scroll_amount -= (scroll_y_delta / canvas.height) * 0.2;

    for (const star of stars) {
        if (timestamp - star.last_shined > star.shining_time) {
            star.last_shined = timestamp;
        }

        const shining_elapsed = (timestamp - star.last_shined) / star.shining_time;
        star.shining_factor = (Math.sin(shining_elapsed * 2 * Math.PI) + 1) / 2;

        star.x -= (star.float_speed_factor / canvas.width) * delta;
        star.y -= (star.float_speed_factor / canvas.width) * delta;

        star.y += star_scroll_amount * delta;

        if (star.x < 0) {
            star.x += 1;
        } else if (star.x > 1) {
            star.x -= 1;
        }

        if (star.y < 0) {
            star.y += 1;
        } else if (star.y > 1) {
            star.y -= 1;
        }
    }

    star_scroll_amount -= star_scroll_amount * delta;

    // Update images

    // Moon

    const _moon_x = (1 - (moon_size * 2/3));
    const _moon_y = (1 - ((moon_size * (canvas.width / canvas.height)) * 2/3));
    
    const moon_scroll_goal_x = 1 + moon_size;
    const moon_scroll_goal_y = 2 + moon_size;

    moon_offset_x = (moon_scroll_goal_x - _moon_x) * (page.scrollTop / page.clientHeight);
    moon_offset_x = (moon_scroll_goal_y - _moon_y) * (page.scrollTop / page.clientHeight);
    
    const moon_x = _moon_x + moon_offset_x;
    const moon_y = _moon_y + moon_offset_y;
    
    // Astro
    const [_astro_w, _astro_h] = imgDims("astronaut.png");
    const astro_h = ((astro_w * canvas.width) / (_astro_w / _astro_h)) / canvas.height;

    const _astro_x = (1 - (1 - moon_x) - (astro_w * 2/3));
    const _astro_y = (1 - (1 - moon_y) - (astro_h * 2/3));

    if (Math.random() < 0.001) {
        astro_float_x *= -1
    }

    if (Math.random() < 0.001) {
        astro_float_y *= -1
    }
    
    astro_offset_float_x += astro_float_x * astro_float_speed * delta * 0.0005;
    astro_offset_float_y += astro_float_y * astro_float_speed * delta * 0.0005;

    astro_offset_float_x = Math.max(Math.min(astro_offset_float_x, 0.05), -0.05);
    astro_offset_float_y = Math.max(Math.min(astro_offset_float_y, 0.05), -0.05);

    const astro_scroll_goal_x = 1 + astro_w;
    const astro_scroll_goal_y = 0;

    astro_offset_scroll_x = (astro_scroll_goal_x - _astro_x) * (page.scrollTop / page.clientHeight);
    astro_offset_scroll_y = (astro_scroll_goal_y - _astro_y) * (page.scrollTop / page.clientHeight);

    astro_offset_x = astro_offset_float_x + astro_offset_scroll_x;
    astro_offset_y = astro_offset_float_y + astro_offset_scroll_y;
    
    const astro_x = _astro_x  + astro_offset_x;
    const astro_y = _astro_y + astro_offset_y;

    // Render

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#081016";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render stars

    for (const star of stars) {
        ctx.globalAlpha = Math.pow(star.shining_factor, 1 / 2.2);
        ctx.fillStyle = `rgb(255, 255, 255)`;
        ctx.fillRect(star.x * canvas.width, star.y * canvas.height, 1, 1);
    }

    // Render images

    ctx.globalAlpha = 1.0;

    ctx.drawImage(
        imageMap.get("moon.png")!,
        moon_x * canvas.width,
        moon_y * canvas.height,
        moon_size * canvas.width,
        moon_size * canvas.width,
    );
    
    ctx.drawImage(
        imageMap.get("astronaut.png")!,
        astro_x * canvas.width,
        astro_y * canvas.height,
        astro_w * canvas.width,
        astro_h * canvas.height,
    );

    requestAnimationFrame(render);
}

function imgAdd(src: string) {
    const img = new Image();
    img.src = src;
    imageMap.set(src, img);
}

function imgDims(src: string): [number, number] {
    const img = imageMap.get(src)!;
    return [img.width, img.height];
}

function BackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        canvas = canvasRef.current!;
        ctx = canvas.getContext("2d")!;

        page = document.getElementById("page")! as HTMLDivElement;
        imgAdd("moon.png");
        imgAdd("astronaut.png");

        for (let i = 0; i < no_of_stars; i++) {
            const x = Math.random();
            const y = Math.random();
            const shining_time = (star_shine_time * 0.2) + (Math.random() * (star_shine_time * 0.8));
            const float_speed_factor = (star_float_speed * 0.60) + (Math.random() * (star_float_speed * 0.40));

            stars.push({
                x,
                y,
                last_shined: 0,
                shining_time,
                float_speed_factor,
                shining_factor: 0
            });
        }

        const resizeObserver = new ResizeObserver(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        resizeObserver.observe(document.body);

        window.addEventListener("blur", () => {
            star_scroll_amount = 0;
        });

        requestAnimationFrame(render);
    }, [])

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen z-0"></canvas>
};

export default BackgroundCanvas;
