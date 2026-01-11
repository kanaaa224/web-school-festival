// メイン オブジェクト
const main = {

    initialize: () => {
        main.resize();
    },
    
    serverAPI: (requestData, callback, url) => {
        if (!requestData) return false;
        if (!callback) callback = () => {};
        if (!url) url = 'serverAPI/';
    
        $.ajax({
			type : 'post',
			url  : url,
			data : { 'data' : requestData },

			success : (data) => {
				callback(JSON.parse(data));
			},

			error : () => {
				callback();
			}
		});
    
        return true;
    },

    modal: {
        install: function(contents) {
            const id = 'modal';

            if(document.querySelector('#' + id) != null) return false;

            let element = document.createElement('div');
            element.innerHTML = '<div class="modal" id="' + id + '" onclick=main.modal.uninstall();>' + contents + '</div>';
            (document.body).append(element.firstChild);

            $('#' + id).hide();
            $('#' + id).fadeIn(100);
        },

        uninstall: function() {
            const id = 'modal';

            if(document.querySelector('#' + id) == null) return false;

            $('#' + id).fadeOut(100);
            setTimeout(() => {
                $('#' + id).remove();
            }, 100);
        }
    },

    resize: () => {
        let width = window.innerWidth, height = window.innerHeight;
        if(width < height) $('body').addClass('mobile');
        else $('body').removeClass('mobile');
    },

    header: {
        logo: function() {
            window.alert('トップページへの遷移実装予定');
        },

        profile: function() {
            main.modal.install('<div class="container"><h1>Profile</h1><h2>プロフィールについて紹介</h2><p>出身校: 国際電子ビジネス専門学校<br>出身学科: ITエンジニア科 ゲームプログラミングコース 4年制課程<br>氏名: 島袋 叶望<br>性別: 男<br><br><u class="button" onclick=window.alert("すみません、準備中です...");>詳細...</u></p></div>');
        },

        work: function() {
            main.modal.install('<div class="container"><h1>Work</h1><h2>制作について紹介</h2><p>作品一覧について「詳細...」ボタンからご閲覧頂けます。<br>Visual Studio 2022 の環境で DxLib または Unreal Engine を用いて制作しております。<br><br><u class="button" onclick=window.alert("すみません、準備中です...");>詳細...</u></p></div>');
        },

        skills: function() {
            main.modal.install('<div class="container"><h1>Skills</h1><h2>スキルについて紹介</h2><p>勉強中のプログラミング言語: C++、Javascript、Python<br>所有している資格: C言語プログラミング能力認定試験2級、情報処理能力認定試験3級、Webクリエイター能力認定試験エキスパート、J検2級、第二種電気工事士免許、DD3種工事担任者免許、2級陸上・海上無線技術者免許、ガス・アーク溶接技能者免許、マニュアル運転免許<br>取得中の資格: 基本情報技術者（FE）<br><br><u class="button" onclick=window.alert("すみません、準備中です...");>詳細...</u></p></div>');
        },

        darkmode: function() {
            if ($('body').hasClass('darkmode')) $('body').addClass('darkmode');
            else $('body').removeClass('darkmode');
        }
    }

};

////////////////////////////////////////////////////////////////////////////////////////////////////

// ページスクロール イベント
$(window).bind('scroll', function() {
    let h = 480; //$(window).height() - 100;
    if ($(window).scrollTop() > h) $('body').addClass('toContent');
    else $('body').removeClass('toContent');
});

// リサイズ イベント
window.onresize = main.resize;

// 初期化
$(document).ready(() => {
    main.initialize();
});