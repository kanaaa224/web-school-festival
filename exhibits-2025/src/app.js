/*
    (c) 2023 kanaaa224. All rights reserved.
*/

import * as utils from 'https://cdn.jsdelivr.net/gh/kanaaa224/web-common@master/web-app-sources/utils.js';

const { $, create } = utils.dom; utils.dom.extend();

import CoverFlow from 'https://cdn.jsdelivr.net/gh/kanaaa224/coverflow-js@master/dist/coverflow.js';
import Granim    from 'https://cdn.jsdelivr.net/npm/granim@2.0.0/+esm';
import particles from 'https://cdn.jsdelivr.net/npm/particlesjs@2.2.3/+esm';

export default class App {

    constructor() {
        this.initialize();
    }

    async initialize() {
        let manifest = $('link[rel="manifest"]');

        const response = await fetch(manifest.href);
        const data     = await response.json();

        manifest = data;

        const link = create('link');

        link.rel  = 'icon';
        link.href = new URL(manifest.icons[0].src, response.url).href;

        document.head.appendChild(link);

        const title = document.title = manifest.name;

        await $('body').setHTMLWithFade(`
            <main></main>
            <footer>
                <p>© 2025 <a href="https://kanaaa224.github.io" target="_blank">kanaaa224</a>. All rights reserved.</p>
            </footer>
        `);

        $('body')
            .add(create('div',    { class: 'background' })
            .add(create('canvas', { id:    'granim'     }))
            .add(create('canvas', { id:    'particles'  })));

        const granim = new Granim({
            element: '#granim',
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

        particles.init({ selector: '#particles', color: '#ffffff40', speed: 0.1, sizeVariations: 7.5, maxParticles: 75 });

        await $('main').setHTMLWithFade(`
            <article class="loading">
                <section>
                    <span class="mdi mdi-loading mdi-spin"></span>読み込み中...
                </section>
            </article>
        `);

        try {
            const response = await fetch('./res/contents.json');
            const data     = await response.json();
            const contents = data;

            for(const content of contents) {
                await new Promise(resolve => {
                    const img = new Image();

                    img.onload = img.onerror = resolve;
                    img.src    = content.image;
                });
            }

            await this.main(contents);
        } catch(e) {
            console.error(e);
        }
    }

    async main(contents) {
        await $('main').setHTMLWithFade(`
            <article>
                <section class="A">
                    <h1>${ document.title }</h1>
                    <p>マウスや矢印キーを使って、見たいコンテンツをクリックしてください！</p>
                </section>
                <section class="B">
                    <h1></h1>
                    <p></p>
                    <button>開く</button>
                </section>
                <section class="C"></section>
            </article>
        `);

        let items = [];

        const size = 200;

        for(const content of [ ...contents, ...contents, ...contents ]) {
            const item = create('div');

            item.style = `
                inline-size: ${size}px;

                aspect-ratio: 1 / 1;

                background: url('${content.image}')  center / contain no-repeat;

                border-radius: .25rem;

                cursor: pointer;
            `;

            item.onclick = () => {
                const container = 'main article section.B';

                if($(`${container} h1`).innerText === content.title) return;

                $(`${container} h1`).setHTMLWithFade(content.title);
                $(`${container} p`) .setHTMLWithFade(content.subtitle);

                $(`${container} button`).onclick = () => { this.open(content.url); };
            };

            item.updatable = true;

            items.push(item);
        }

        const coverFlow = new CoverFlow(items, true);

        coverFlow
            .attach($('main article section.C'))
            .update();

        items[coverFlow.index].onclick();

        window.addEventListener('wheel', (e) => {
            coverFlow.update(e.deltaY > 0 ? coverFlow.index + 1 : e.deltaY < 0 ? coverFlow.index - 1 : coverFlow.index);

            items[coverFlow.index].onclick();
        }, { passive: true });

        window.addEventListener('keydown', e => {
            coverFlow.update(e.key === 'ArrowRight' ? coverFlow.index + 1 : e.key === 'ArrowLeft' ? coverFlow.index - 1 : coverFlow.index);

            items[coverFlow.index].onclick();
        });
    }

    async open(url) {
        if($('dialog')) return;

        let dialog = null;

        $('body').add(dialog = create('dialog'));

        await dialog.setHTMLWithFade(`
            <div>
                <iframe src="${url}"></iframe>
                <p>"${ url }"を表示中 | 画面の外側を押して終了</p>
            </div>
        `);

        dialog.on('click', e => { if(e.target === dialog) this.close(); });
    }

    async close() {
        await $('dialog').setHTMLWithFade('');

        $('dialog').remove();
    }

}