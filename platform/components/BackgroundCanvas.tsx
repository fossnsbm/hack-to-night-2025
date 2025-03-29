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

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;

const star_shine_time = 10000;
const star_float_speed = 5;
const no_of_stars = /Mobi/i.test(navigator.userAgent) ? 50 : 200;
const stars: Star[] = [];

var last_timestamp = 0;
var mouse_x = 0;
var mouse_y = 0;
var scroll_y = 0;

function render(timestamp: DOMHighResTimeStamp) {
    const delta = (timestamp - last_timestamp) / 1000;
    last_timestamp = timestamp;

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#081016";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scroll_y_delta = scroll_y * delta;

    for (const star of stars) {
        if (timestamp - star.last_shined > star.shining_time) {
            star.last_shined = timestamp;
        }

        const shining_elapsed = (timestamp - star.last_shined) / star.shining_time;
        star.shining_factor = (Math.sin(shining_elapsed * 2 * Math.PI) + 1) / 2;

        star.x -= (star.float_speed_factor / canvas.width) * delta;
        star.y -= (star.float_speed_factor / canvas.width) * delta;

        star.y += scroll_y_delta * 0.1;

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

    scroll_y -= scroll_y_delta;

    for (const star of stars) {
        ctx.globalAlpha = Math.pow(star.shining_factor, 1 / 2.2);
        ctx.fillStyle = `rgb(255, 255, 255)`;
        ctx.fillRect(star.x * canvas.width, star.y * canvas.height, 1, 1);
    }

    requestAnimationFrame(render);
}

function BackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        canvas = canvasRef.current!;
        ctx = canvas.getContext("2d")!;

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

        const page = document.getElementById("page")!;
        let last_scroll_y = page.scrollTop;
        page.addEventListener("scroll", () => {
            const delta = last_scroll_y - page.scrollTop;
            last_scroll_y = page.scrollTop;
            scroll_y += (delta / canvas.height);
        });

        page.addEventListener("mousemove", (ev) => {
            mouse_x = ev.offsetX;
            mouse_y = ev.offsetY;
        });

        requestAnimationFrame(render);
    }, [])

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen z-0"></canvas>
};

export default BackgroundCanvas;
