import * as consts from './consts.js';
import * as api    from './api.js';
import * as utils  from './utils.js';

const { $, on, create } = utils.dom;

import Granim    from 'https://cdn.jsdelivr.net/npm/granim@2.0.0/+esm';
import particles from 'https://cdn.jsdelivr.net/npm/particlesjs@2.2.3/+esm';

import CoverFlow from 'https://cdn.jsdelivr.net/gh/kanaaa224/coverflow-js@master/dist/coverflow.esm.min.js';

export default class App {
    constructor() {
        this.contents = [];
        this.state    = false;

        document.title = consts.app.name;

        (async () => {
            try {
                await api.main.connect();
            } catch(e) {
                console.error(e);
            }

            Element.prototype.add  = function(e) { this.appendChild(e);  return this; };
            Element.prototype.text = function(c) { this.textContent = c; return this; };

            $('main .container')
                .add(create('canvas', { id: 'granim',      style: 'position: absolute; width: 100%; height: 100%;' }))
                .add(create('canvas', { id: 'particles',   style: 'position: absolute; width: 100%; height: 100%;' }))
                .add(create('h1',     { text: 'portfolio', style: 'position: absolute; top: 0; right: 10rem; height: 100%; margin: 0; color: #ffffff40; pointer-events: none; writing-mode: vertical-rl; transform: rotate(180deg); text-align: center; white-space: nowrap; font-size: 12rem; font-family: "Syne", sans-serif;' }))
                .add(create('h1',     { text: '2025',      style: 'position: absolute; top: 7.5rem; right: 9rem; margin: 0; color: #ffffff1a; pointer-events: none; writing-mode: vertical-rl; transform: rotate(180deg); text-align: center; white-space: nowrap; font-size: 4rem; font-family: "Syne", sans-serif;' }))
                .add(create('div',    { id: 'coverFlow',   style: 'position: absolute; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;' }).add(create('div', { style: 'width: 100%; padding: 120px; backdrop-filter: blur(1rem);' })))
                .add(create('div',    { id: 'overlay',     style: 'position: absolute; width: 100%; height: 100%; pointer-events: none;' }));

            $('main .container #overlay')
                .add(create('div', { style: 'position: absolute; margin: 5rem 7.5rem; color: #ffffff80;' })
                    .add(create('h1', { text: 'ポートフォリオ', style: 'margin: 0; font-size: 3rem;' }))
                    .add(create('p',  { text: '学生の間に制作した作品集です。マウスや矢印キーを使って見たいコンテンツをクリックしてください！', style: 'margin: 0; font-size: 1.25rem; opacity: 0.75;' })))
                .add(create('div', { id: 'ui', style: 'position: absolute; bottom: 25%; left: 50%; transform: translate(-50%, 50%); width: 30rem; padding: 1.5rem; background-color: #0000000d; border-radius: 0.75rem; border: solid 0.25rem #0000000d; backdrop-filter: blur(0.5rem); text-align: center;' })
                    .add(create('h1', { text: 'タイトル', style: 'margin: 0; font-size: 1.5rem;' }))
                    .add(create('p',  { text: 'サブタイトル・2025', style: 'margin: 0; font-size: 0.75rem; opacity: 0.5;' }))
                    .add(create('p',  { text: 'コンテンツ', style: 'margin: 1rem 0 1.5rem 0; font-size: 1rem;' }))
                    .add(create('a',  { text: 'リンク', style: 'padding: 0.5rem 1rem; font-size: 1rem; background-color: #00000040; border-radius: 0.5rem; text-decoration: none; pointer-events: auto;', href: './' })));

            let granim = new Granim({
                element: '#granim',
                direction: 'left-right',
                opacity: [ 1, 1 ],
                transitionSpeed: 9000,
                states: {
                    'default-state': {
                        gradients: [
                            [ '#9645a2', '#8f5897' ],
                            [ '#8f5897', '#9645a2' ],
                            [ '#9645a2', '#725086' ],
                            [ '#725086', '#9645a2' ]
                        ]
                    }
                }
            });

            particles.init({
                selector: '#particles',
                color: '#ffffff40',
                speed: 0.1,
                sizeVariations: 7.5,
                maxParticles: 75
            });

            let contents = this.contents = await this.contentsFetch();

            const size = 220;

            const items = contents.map((item, i) => {
                const e = document.createElement('div');

                e.style.width           = `${size}px`;
                e.style.height          = `${size}px`;
                e.style.backgroundColor = '#0000001a';
                e.style.aspectRatio     = '1 / 1';

                e.style.borderRadius = '0.25rem';
                e.style.boxShadow    = '0 0 3rem 0 #0000001a';
                e.style.cursor       = 'pointer';

                e.style.border     = '0.25rem solid #7770';
                e.style.transition = 'border .25s ease';

                e.onmouseenter = () => {
                    e.style.border = '0.25rem solid #777';
                };

                e.onmouseleave = () => {
                    e.style.border = '0.25rem solid #7770';
                };

                e.style.display        = 'flex';
                e.style.justifyContent = 'center';
                e.style.alignItems     = 'center';

                if(item.image) e.innerHTML = `<img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;

                e.onclick = () => {
                    this.uiUpdate(i);
                };

                e.updatable = true;

                return e;
            });

            const coverFlow = new CoverFlow(items, true, Math.floor(window.innerWidth / size) - 1);

            coverFlow
                .attach($('main .container #coverFlow div'))
                .update();

            this.uiUpdate(coverFlow.index);

            window.addEventListener('wheel', e => {
                coverFlow.update(e.deltaY > 0 ? coverFlow.index + 1 : e.deltaY < 0 ? coverFlow.index - 1 : coverFlow.index);

                this.uiUpdate(coverFlow.index);

                if(!this.state) {
                    this.state = true;

                    setTimeout(() => {
                        this.state = false;
                    }, 9000);
                }
            }, { passive: true });

            window.addEventListener('keydown', e => {
                coverFlow.update(e.key === 'ArrowRight' ? coverFlow.index + 1 : e.key === 'ArrowLeft' ? coverFlow.index - 1 : coverFlow.index);

                if(e.key === 'D') coverFlow.destroy();
                if(e.key === 'A') coverFlow.attach($('main .container #coverFlow div')).update();

                this.uiUpdate(coverFlow.index);

                if(!this.state) {
                    this.state = true;

                    setTimeout(() => {
                        this.state = false;
                    }, 9000);
                }
            });

            /*let x = 0;

            window.addEventListener('touchstart', e => {
                x = e.changedTouches[0].clientX;
            }, { passive: true });

            window.addEventListener('touchend', e => {
                const diff = e.changedTouches[0].clientX - x;

                coverFlow.update(diff < -50 ? coverFlow.index + 1 : diff > 50 ? coverFlow.index - 1 : coverFlow.index);
            }, { passive: true });*/

            window.addEventListener('mousemove', e => {
                if(!this.state) {
                    this.state = true;

                    setTimeout(() => {
                        this.state = false;
                    }, 9000);
                }
            });

            setInterval(() => {
                if(!this.state) coverFlow.update(coverFlow.index + 1);

                this.uiUpdate(coverFlow.index);
            }, 3000);

            /*let e;

            $('main .container')
                .add(    create('p', { text: `${consts.app.name} - ${consts.app.version}` }))
                .add(e = create('p', { html: 'メインAPIのバージョンを取得: <span>未取得</span>', style: 'text-decoration: underline;' }));

            let h, l = on(e, 'click', h = async () => {
                l();

                try {
                    $('span', e)
                        .text('取得中...')
                        .text(await api.main.call({ method: 'version' }));
                } catch(e) {
                    console.error(e);
                }

                l = on(e, 'click', h);
            });*/
        })();

        if(window.innerWidth != 1920 || window.innerHeight != 1080) window.alert(`### 解像度が合っていません ###\n\nこのWebアプリを正しく表示させるにはビューポートの解像度を "1920x1080" に合わせる必要があります。\n\n現在の解像度: ${window.innerWidth}x${window.innerHeight}`);
    }

    async contentsFetch() {
        try {
            const response = await fetch('./res/contents.json');
            const contents = await response.json();

            return contents;
        } catch(e) {
            console.error(e);
        }
    }

    uiUpdate(index = 0) {
        const item = this.contents[index];
        const ui   = $('main .container #overlay #ui');

        $('h1', ui).text(item.title);
        $('p:nth-of-type(1)', ui).text(item.subtitle);
        $('p:nth-of-type(2)', ui).text(item.content);
        $('a', ui).setAttribute('href', item.url ?? '#');
        $('a', ui).textContent = '開く...';
    }
}