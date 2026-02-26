// =========================================================================
// ==================== 云端数据库 Supabase 引擎点火 =========================
// =========================================================================
// 使用 Vercel 转发代理，绕过国内网络封锁
var SUPABASE_URL = window.location.origin + '/api/database';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdid3Vmc3VlYmd1bXp4d2dveXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5Njc5MjYsImV4cCI6MjA4NzU0MzkyNn0.YEyi6KJsKNgbU7VQKFSYcVWHXM5L03ha4oOK2LRrIqA'; 
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// =========================================================================
// ==================== 终极魔法：Pjax 无刷新页面跳转 ====================
// =========================================================================
document.addEventListener('click', async (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) return;

    e.preventDefault(); 

    try {
        document.body.style.cursor = 'wait'; 
        
        const response = await fetch(href);
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const newScreenContent = doc.querySelector('#magic-screen');
        
        if (newScreenContent) {
            document.querySelector('#magic-screen').innerHTML = newScreenContent.innerHTML;
            history.pushState(null, '', href);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
            const parentLi = link.parentElement;
            if(parentLi && parentLi.tagName === 'LI') parentLi.classList.add('active');

            // 派发事件，唤醒新页面里的 JS 模块
            document.dispatchEvent(new Event('PjaxContentLoaded'));
        } else {
             console.error("❌ 错误：新页面中没有找到 id='magic-screen'，强制刷新");
             window.location.href = href;
        }
    } catch (error) {
        window.location.href = href;
    } finally {
        document.body.style.cursor = 'default';
    }
});

window.addEventListener('popstate', () => { location.reload(); });

// =========================================================================
// ==================== 全局特效与播放器 (不参与页面刷新) ====================
// =========================================================================
const colors = ['#00ff04', '#0095ff', '#FF0000', '#FFFF00']; 
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(trail);
    setTimeout(() => { trail.remove(); }, 600);
});

document.addEventListener('click', (e) => {
    const particleCount = 30; 
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2; 
        const velocity = 100 + Math.random() * 100;  
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        document.body.appendChild(particle);
        setTimeout(() => { particle.remove(); }, 600);
    }
    const ring = document.createElement('div');
    ring.className = 'firework-ring';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
    ring.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(ring);
    setTimeout(() => { ring.remove(); }, 800);
});

document.addEventListener("DOMContentLoaded", () => {

    // ================= 终极魔法：静默预加载黑夜壁纸 =================
    const preloadDarkBg = new Image();
    // 关键点：只需写图片名字（相对路径），千万别带 D盘 前缀！
    preloadDarkBg.src = "sky.jpg";

    // ================= 模块十一：Link Start 昼夜交替系统 =================
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const linkStartAudio = document.getElementById('link-start-audio');
    
    // 1. 读取本地记忆：看看用户上次离开时是不是在“暗黑潜行状态”
    const isDarkMode = localStorage.getItem('sao_dark_mode') === 'true';

    // 如果上次是黑夜，网页刚加载时直接切成黑夜
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> System Log Out';
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            const body = document.body;
            // 切换 body 上的 dark-mode 类名
            body.classList.toggle('dark-mode');
            const currentlyDark = body.classList.contains('dark-mode');
            
            // // 2. 播放中二的科技提示音效
            // if (linkStartAudio) {
            //     linkStartAudio.currentTime = 0; // 进度归零
            //     linkStartAudio.play().catch(e => console.log('浏览器可能限制了自动播放音效'));
            // }

            // 3. 更改按钮文字，并把状态保存到浏览器的本地记忆中
            if (currentlyDark) {
                darkModeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> System Log Out';
                localStorage.setItem('sao_dark_mode', 'true');
            } else {
                darkModeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Link Start';
                localStorage.setItem('sao_dark_mode', 'false');
            }

            // 4. 【极度高能】：与亚丝娜联动！
            const dialogBox = document.getElementById('live2d-dialog');
            if (dialogBox) {
                // 【新增护盾 1】：切换昼夜时，强行打断亚丝娜正在说的其他语音
                if (window.currentAsunaAudio) {
                    window.currentAsunaAudio.pause();
                    window.currentAsunaAudio.currentTime = 0;
                }
                // 【新增护盾 2】：更新全局交互 ID，防止御守的幽灵计时器捣乱
                window.asunaInteractionId = Date.now();

                // 根据不同模式，亚丝娜说不同的话 (既然不配音，就只展示文字)
                dialogBox.innerHTML = currentlyDark 
                    ? "✨ Link Start！已接入暗黑网络，潜行请注意安全哦~" 
                    : "☀️ Log Out！欢迎回到现实世界，今天辛苦啦！";
                
                dialogBox.classList.remove('show');
                void dialogBox.offsetWidth; 
                dialogBox.classList.add('show');
                
                // 【核心修复】：统一移交给全局气泡管家，稳稳当当显示 4.5 秒！
                clearTimeout(window.globalBubbleTimer);
                window.globalBubbleTimer = setTimeout(() => { dialogBox.classList.remove('show'); }, 4500);
            }

        });
    }
    const globalPlayer = document.getElementById('global-player');
    if (globalPlayer) {
        const playerToggle = document.getElementById('player-toggle');
        const coverImg = document.getElementById('player-cover');
        const titleEle = document.getElementById('player-title');
        const artistEle = document.getElementById('player-artist');
        const btnPlay = document.getElementById('btn-play');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const playlistEle = document.getElementById('playlist');
        const audio = document.getElementById('bg-music');

        const songs = window.FLA_Playlist || [];
        let currentIndex = 0;

        playerToggle.addEventListener('click', () => { globalPlayer.classList.toggle('expanded'); });

        function renderPlaylist() {
            playlistEle.innerHTML = '';
            songs.forEach((song, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${song.title}</span> <span style="font-size:10px; opacity:0.7">${song.artist}</span>`;
                if (index === currentIndex) li.classList.add('active');
                li.addEventListener('click', () => { currentIndex = index; loadSong(currentIndex); playMusic(); });
                playlistEle.appendChild(li);
            });
        }

        // function loadSong(index) {
        //     const song = songs[index];
        //     titleEle.innerText = song.title; artistEle.innerText = song.artist;
        //     coverImg.src = song.cover; audio.src = song.src;
        //     document.querySelectorAll('.playlist li').forEach((li, i) => { li.classList.toggle('active', i === index); });
        // }

        // ================= 终极挂载：Hugging Face 全球 CDN 节点 =================
        // ================= 终极挂载：HF 国内高速公益镜像节点 =================
        // ================= 终极挂载：Vercel 穿透代理 =================
        // 不再直接连 HF，而是让 Vercel 帮我们中转
        const PROXY_BASE_URL = window.location.origin + '/api/music-proxy/';

        function loadSong(index) {
            const song = songs[index];
            titleEle.innerText = song.title; 
            artistEle.innerText = song.artist;
            
            // 使用 encodeURIComponent 处理中文路径，拼接到代理地址后面
            // 原本是 music/xxx.mp3，现在变成 /api/music-proxy/music/xxx.mp3
            const pathParts = song.src.split('/'); 
            const encodedFileName = encodeURIComponent(pathParts[1]); 
            
            // 封面和音频都走代理
            coverImg.src = PROXY_BASE_URL + pathParts[0] + '/' + encodeURIComponent(song.cover.split('/')[1]); 
            audio.src = PROXY_BASE_URL + pathParts[0] + '/' + encodedFileName;
            
            document.querySelectorAll('.playlist li').forEach((li, i) => { 
                li.classList.toggle('active', i === index); 
            });
        }
        function playMusic() { audio.play(); coverImg.classList.add('playing'); btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>'; }
        function pauseMusic() { audio.pause(); coverImg.classList.remove('playing'); btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>'; }

        btnPlay.addEventListener('click', () => {
            if (audio.paused) {
                if (!audio.src || audio.src === window.location.href) loadSong(currentIndex);
                playMusic();
            } else { pauseMusic(); }
        });
        btnNext.addEventListener('click', () => { currentIndex = (currentIndex + 1) % songs.length; loadSong(currentIndex); playMusic(); });
        btnPrev.addEventListener('click', () => { currentIndex = (currentIndex - 1 + songs.length) % songs.length; loadSong(currentIndex); playMusic(); });
        audio.addEventListener('ended', () => { btnNext.click(); });

        if (songs.length > 0) { loadSong(currentIndex); renderPlaylist(); }
    }
});

// =========================================================================
// ==================== 所有子页面功能模块的“包装盒” ====================
// =========================================================================

//随机图片部分初始化
function initRandomImage() {
    const articleImg = document.querySelector('.article-image img');
    if (articleImg) articleImg.src = "https://t.alcy.cc/ycy?" + new Date().getTime();
}

// WA页面的初始化 (全云端联机版)
function initWAModule() {
    const waTextarea = document.getElementById('wa-textarea');
    if (!waTextarea) return; 
    
    const waWordCount = document.getElementById('wa-word-count');
    const waCurrentTime = document.getElementById('wa-current-time');
    const waImageInput = document.getElementById('wa-image-input');
    const waImagePreview = document.getElementById('wa-image-preview');
    const waPreviewContainer = document.getElementById('wa-image-preview-container');
    const waRemoveImage = document.getElementById('wa-remove-image');
    const waSubmitBtn = document.getElementById('wa-submit-btn');
    const waFeed = document.getElementById('wa-feed');
    let currentImageBase64 = null; 

    // 时钟逻辑
    if (window.waClockTimer) clearInterval(window.waClockTimer); 
    window.waClockTimer = setInterval(() => {
        if(!document.getElementById('wa-current-time')) { clearInterval(window.waClockTimer); return; }
        const now = new Date();
        waCurrentTime.innerText = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    }, 1000);

    waTextarea.addEventListener('input', () => { waWordCount.innerText = waTextarea.value.length; });

    // // 图片读取逻辑 (与原本保持一致)
    // waImageInput.addEventListener('change', (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (event) => {
    //             currentImageBase64 = event.target.result;
    //             waImagePreview.src = currentImageBase64;
    //             waPreviewContainer.style.display = 'inline-block';
    //             const syncWrapper = document.getElementById('wa-sync-gallery-wrapper');
    //             if (syncWrapper) syncWrapper.style.display = 'block';
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // });

    // 【终极修复】：强制压缩 WA 留言板上传的图片，防止数据库撑爆！
    waImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width; let height = img.height;
                    const MAX_SIZE = 800; // 强行把几千像素的原图压缩到 800 像素
                    if (width > height && width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } 
                    else if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 将图片转为 JPEG 格式，画质压缩到 70%
                    currentImageBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    waImagePreview.src = currentImageBase64;
                    
                    const waPreviewContainer = document.getElementById('wa-image-preview-container');
                    if(waPreviewContainer) waPreviewContainer.style.display = 'inline-block';
                    const syncWrapper = document.getElementById('wa-sync-gallery-wrapper');
                    if (syncWrapper) syncWrapper.style.display = 'block';
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    waRemoveImage.addEventListener('click', () => {
        currentImageBase64 = null; waImagePreview.src = '';
        waPreviewContainer.style.display = 'none'; waImageInput.value = ''; 
        const syncWrapper = document.getElementById('wa-sync-gallery-wrapper');
        const syncCheckbox = document.getElementById('wa-sync-gallery-checkbox');
        const syncCaption = document.getElementById('wa-sync-gallery-caption');
        if (syncWrapper) {
            syncWrapper.style.display = 'none'; syncCheckbox.checked = false;
            syncCaption.style.display = 'none'; syncCaption.value = '';
        }
    });

    const waSyncCheckbox = document.getElementById('wa-sync-gallery-checkbox');
    const waSyncCaption = document.getElementById('wa-sync-gallery-caption');
    if (waSyncCheckbox && waSyncCaption) {
        waSyncCheckbox.addEventListener('change', function() {
            if (this.checked) { waSyncCaption.style.display = 'block'; waSyncCaption.focus(); } 
            else { waSyncCaption.style.display = 'none'; waSyncCaption.value = ''; }
        });
    }

    // ================= 云端核心：拉取数据 =================
    let posts = [];
    
    async function loadWAFromCloud() {
        try {
            // 同时拉取 WA 动态和对应的评论
            const { data: postsData, error: pErr } = await supabase.from('wa_posts').select('*').order('created_at', { ascending: false }).limit(20);
            const { data: commentsData, error: cErr } = await supabase.from('comments').select('*').eq('target_type', 'wa').order('created_at', { ascending: true });
            
            if (pErr || cErr) throw new Error("拉取失败");

            posts = postsData.map(post => {
                // 将评论匹配到对应的动态下
                const postComments = commentsData.filter(c => c.target_id === post.id).map(c => ({
                    db_id: c.id, text: c.content, time: new Date(c.created_at).toLocaleString(), nickname: c.nickname
                }));
                return {
                    db_id: post.id, content: post.content, image: post.image_url,
                    time: new Date(post.created_at).toLocaleString(),
                    wordCount: post.content ? post.content.length : 0,
                    comments: postComments
                };
            });
            renderPosts();
        } catch (error) { console.error("WA 同步异常:", error); }
    }

    function renderPosts() {
        waFeed.innerHTML = '';
        posts.forEach((post, index) => {
            const postDiv = document.createElement('div');
            postDiv.className = 'wa-post';
            
            let postHTML = `
                <div class="wa-post-header" style="display: flex; justify-content: space-between; align-items: center; position: relative;">
                    <span><i class="fa-regular fa-clock"></i> ${post.time} &nbsp;|&nbsp; 字数: ${post.wordCount}</span>
                    <div class="wa-more-options">
                        <button class="wa-more-btn" onclick="toggleMenu('post-menu-${index}')"><i class="fa-solid fa-ellipsis"></i></button>
                        <div id="post-menu-${index}" class="wa-dropdown-menu">
                            <button class="wa-delete-btn" onclick="showCustomConfirm('post', ${index})"><i class="fa-solid fa-trash-can"></i> 删除</button>
                        </div>
                    </div>
                </div>
                <div class="wa-post-content">${post.content}</div>
            `;
            if (post.image) postHTML += `<img src="${post.image}" class="wa-post-image">`;
            
            let commentsHTML = `<div class="wa-comments">`;
            if (post.comments && post.comments.length > 0) {
                post.comments.forEach((c, cIndex) => {
                    commentsHTML += `
                    <div class="wa-comment-item" style="display: flex; justify-content: space-between; align-items: center; position: relative;">
                        <span>💬 <span style="font-weight:bold; color:var(--theme-pink);">${c.nickname}:</span> ${c.text} <span class="wa-comment-time">${c.time}</span></span>
                        <div class="wa-more-options">
                            <button class="wa-more-btn" onclick="toggleMenu('comment-menu-${index}-${cIndex}')"><i class="fa-solid fa-ellipsis"></i></button>
                            <div id="comment-menu-${index}-${cIndex}" class="wa-dropdown-menu">
                                <button class="wa-delete-btn" onclick="showCustomConfirm('comment', ${index}, ${cIndex})"><i class="fa-solid fa-trash-can"></i> 删除</button>
                            </div>
                        </div>
                    </div>`;
                });
            }
            commentsHTML += `
                    <div class="wa-comment-input-box">
                        <input type="text" class="wa-comment-input" placeholder="写下评论 (附带昵称)..." id="comment-input-${index}">
                        <button class="wa-comment-btn" onclick="addComment(${index})">提交</button>
                    </div></div>`;
            postDiv.innerHTML = postHTML + commentsHTML;
            waFeed.appendChild(postDiv);
        });
    }

    // ================= 云端核心：发布 WA =================
    waSubmitBtn.addEventListener('click', async () => { 
        const content = waTextarea.value.trim();
        if (content === '' && !currentImageBase64) { alert('写点什么或者发张图吧！'); return; }
        
        waSubmitBtn.innerText = "发送中..."; waSubmitBtn.disabled = true;

        try {
            // 1. 存入 wa_posts 库
            const { error: postErr } = await supabase.from('wa_posts').insert([{ content: content, image_url: currentImageBase64 }]);
            if (postErr) throw postErr;

            // 2. 智能同步到相册库 (photos)
            const waSyncCheckbox = document.getElementById('wa-sync-gallery-checkbox');
            const waSyncCaption = document.getElementById('wa-sync-gallery-caption');
            const waSyncWrapper = document.getElementById('wa-sync-gallery-wrapper');
            
            if (waSyncCheckbox && waSyncCheckbox.checked && currentImageBase64) {
                let finalCaption = waSyncCaption.value.trim() || (content.length > 20 ? content.substring(0, 20) + '...' : content) || "未命名的记忆";
                await supabase.from('photos').insert([{ image_url: currentImageBase64, description: finalCaption }]);
                
                waSyncCheckbox.checked = false;
                if (waSyncCaption) { waSyncCaption.style.display = 'none'; waSyncCaption.value = ''; }
                if (waSyncWrapper) waSyncWrapper.style.display = 'none';
            }

            // 清理与刷新
            waTextarea.value = ''; waWordCount.innerText = '0'; waRemoveImage.click(); 
            await loadWAFromCloud();
        } catch(e) { alert("云端发送失败！网络波动或文件过大"); }
        finally { waSubmitBtn.innerText = "发布"; waSubmitBtn.disabled = false; }
    });

    // ================= 云端核心：提交评论 =================
    window.addComment = async function(postIndex) { 
        const inputEle = document.getElementById(`comment-input-${postIndex}`);
        const fullText = inputEle.value.trim();
        if (fullText === '') return;
        
        // 简单处理访客昵称提取 (格式：昵称 评论内容)
        let nickname = "匿名访客"; let text = fullText;
        if(fullText.includes(' ')) { nickname = fullText.split(' ')[0]; text = fullText.substring(nickname.length).trim(); }

        const targetDbId = posts[postIndex].db_id;

        try {
            await supabase.from('comments').insert([{ target_type: 'wa', target_id: targetDbId, nickname: nickname, content: text }]);
            inputEle.value = '';
            await loadWAFromCloud();
        } catch(e) { alert("评论失败！"); }
    };

    window.toggleMenu = function(menuId) {
        document.querySelectorAll('.wa-dropdown-menu').forEach(menu => { if (menu.id !== menuId) menu.classList.remove('show'); });
        document.getElementById(menuId).classList.toggle('show');
    };

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.wa-more-options')) document.querySelectorAll('.wa-dropdown-menu').forEach(menu => menu.classList.remove('show'));
    });

    const customModal = document.getElementById('custom-confirm-modal');
    const customModalMsg = document.getElementById('anime-modal-msg');
    let pendingDeleteData = null;

    window.showCustomConfirm = function(type, postIndex, commentIndex = -1) {
        pendingDeleteData = { type, postIndex, commentIndex };
        customModalMsg.innerText = "真的要删掉这条记录吗？不可恢复哦~ (；′⌒`)";
        customModal.classList.add('show');
        document.querySelectorAll('.wa-dropdown-menu').forEach(m => m.classList.remove('show'));
    };

    document.getElementById('modal-cancel-btn').addEventListener('click', () => { customModal.classList.remove('show'); pendingDeleteData = null; });
    
    // ================= 云端核心：删除数据 =================
    document.getElementById('modal-confirm-btn').addEventListener('click', async () => {
        if (!pendingDeleteData) return;
        try {
            if (pendingDeleteData.type === 'post') {
                const dbId = posts[pendingDeleteData.postIndex].db_id;
                await supabase.from('wa_posts').delete().eq('id', dbId);
                await supabase.from('comments').delete().eq('target_type', 'wa').eq('target_id', dbId); // 顺手清理孤儿评论
            } else if (pendingDeleteData.type === 'comment') {
                const dbId = posts[pendingDeleteData.postIndex].comments[pendingDeleteData.commentIndex].db_id;
                await supabase.from('comments').delete().eq('id', dbId);
            }
            await loadWAFromCloud();
        } catch (e) { alert("删除失败！"); }
        customModal.classList.remove('show'); pendingDeleteData = null;
    });

    // 网页加载时启动同步
    loadWAFromCloud();
}


//帧率显示模块部分
function initFPS() {
    const fpsBox = document.getElementById('fps-box');
    if (!fpsBox) return;
    if (window.fpsRequestID) cancelAnimationFrame(window.fpsRequestID);
    let lastTime = performance.now(); let frameCount = 0;
    function calculateFPS(currentTime) {
        frameCount++; const deltaTime = currentTime - lastTime;
        if (deltaTime >= 1000) { 
            const fps = Math.round((frameCount * 1000) / deltaTime);
            let face = "✨ (≧∇≦)ﾉ"; if (fps < 30) face = "💦 (；′⌒`)"; else if (fps < 50) face = "⭐ (・ω・)"; 
            fpsBox.innerText = `FPS: ${fps} ${face}`;
            frameCount = 0; lastTime = currentTime;
        }
        window.fpsRequestID = requestAnimationFrame(calculateFPS);
    }
    window.fpsRequestID = requestAnimationFrame(calculateFPS);
}


// =========================================================================
// ================= 课表页面初始化 (全云端联机版) =======================
// =========================================================================
async function initScheduleAndDDL() {
    const scheduleGrid = document.getElementById('schedule-grid');
    if (!scheduleGrid) return;
    
    const courseColors = ['#fff0f1', '#e0f7fa', '#f3e5f5', '#fff9c4', '#ffe0b2', '#e8f5e9'];
    
    let courses = []; let coursesDbId = null;
    let ddls = []; let ddlsDbId = null;

    // 1. 从云端统一记忆体拉取数据
    try {
        const { data: cData } = await supabase.from('app_data').select('*').eq('data_key', 'my_courses').single();
        if (cData) { courses = JSON.parse(cData.data_value); coursesDbId = cData.id; }
        
        const { data: dData } = await supabase.from('app_data').select('*').eq('data_key', 'my_ddls').single();
        if (dData) { ddls = JSON.parse(dData.data_value); ddlsDbId = dData.id; }
    } catch(e) { console.log("课表/DDL：云端初次加载或暂无数据"); }

    if (courses.length === 0) {
        courses = [
            { id: 1, startWeek: 1, endWeek: 16, weekType: 'all', day: 2, start: 2, end: 4, name: '人工智能工程基础(四)', room: '仙II-310', colorIndex: 1 },
            { id: 2, startWeek: 1, endWeek: 16, weekType: 'all', day: 3, start: 2, end: 4, name: '智能机器人创新实践', room: '基础实验楼', colorIndex: 2 },
            { id: 3, startWeek: 1, endWeek: 16, weekType: 'all', day: 4, start: 3, end: 4, name: '数字信号处理', room: '仙I-320', colorIndex: 4 },
            { id: 4, startWeek: 1, endWeek: 16, weekType: 'all', day: 1, start: 5, end: 7, name: '概率论与随机过程', room: '仙II-122', colorIndex: 3 },
            { id: 5, startWeek: 1, endWeek: 16, weekType: 'all', day: 2, start: 5, end: 6, name: '操作系统与Linux', room: '仙II-306', colorIndex: 5 },
            { id: 6, startWeek: 1, endWeek: 16, weekType: 'all', day: 3, start: 5, end: 6, name: '数学物理方法', room: '仙I-319', colorIndex: 0 }
        ];
    }

    // 云端保存黑魔法函数
    async function saveCoursesToCloud() {
        if (coursesDbId) { await supabase.from('app_data').update({ data_value: JSON.stringify(courses) }).eq('id', coursesDbId); } 
        else {
            const { data } = await supabase.from('app_data').insert({ data_key: 'my_courses', data_value: JSON.stringify(courses) }).select().single();
            if(data) coursesDbId = data.id;
        }
    }
    async function saveDDLsToCloud() {
        if (ddlsDbId) { await supabase.from('app_data').update({ data_value: JSON.stringify(ddls) }).eq('id', ddlsDbId); } 
        else {
            const { data } = await supabase.from('app_data').insert({ data_key: 'my_ddls', data_value: JSON.stringify(ddls) }).select().single();
            if(data) ddlsDbId = data.id;
        }
    }

    let currentWeek = 4; const termStartDate = new Date('2026-03-02'); 

    window.changeWeek = function(delta) {
        currentWeek += delta;
        if (currentWeek < 1) currentWeek = 1; if (currentWeek > 25) currentWeek = 25; 
        const start = new Date(termStartDate); start.setDate(start.getDate() + (currentWeek - 1) * 7);
        const end = new Date(start); end.setDate(end.getDate() + 6);
        const formatStr = (d) => String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0');
        let weekTitle = `第 ${currentWeek} 周`;
        if (currentWeek >= 19) weekTitle = `🏝️ 假期中`;
        document.getElementById('week-display').innerText = `${weekTitle} (${formatStr(start)} - ${formatStr(end)})`;
        renderSchedule(); 
    }

    function renderSchedule() {
        scheduleGrid.innerHTML = '';
        const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        days.forEach((d, index) => {
            const header = document.createElement('div'); header.className = 'grid-cell grid-header';
            header.innerText = d; header.style.gridColumn = index + 1; header.style.gridRow = 1; scheduleGrid.appendChild(header);
        });

        const timeSlots = ["08:00-08:50", "09:00-09:50", "10:10-11:00", "11:10-12:00", "14:00-14:50", "15:00-15:50", "16:10-17:00", "17:10-18:00", "18:30-19:20", "19:30-20:20", "20:30-21:20", "21:30-22:20"];

        for (let r = 1; r <= 12; r++) {
            const timeCell = document.createElement('div'); timeCell.className = 'grid-cell time-col';
            timeCell.innerHTML = `<span style="font-weight: bold; font-size: 12px; color: var(--text-main);">第${r}节</span><span style="font-size: 9px; opacity: 0.6; margin-top: 2px;">${timeSlots[r-1]}</span>`;
            timeCell.style.gridColumn = 1; timeCell.style.gridRow = r + 1; scheduleGrid.appendChild(timeCell);
            for (let c = 1; c <= 7; c++) {
                const emptyCell = document.createElement('div'); emptyCell.className = 'grid-cell';
                emptyCell.style.gridColumn = c + 1; emptyCell.style.gridRow = r + 1; emptyCell.style.cursor = 'pointer';
                emptyCell.onclick = () => openCourseModal(null, c, r); scheduleGrid.appendChild(emptyCell);
            }
        }

        const activeCourses = courses.filter(c => {
            const inRange = currentWeek >= (c.startWeek || 1) && currentWeek <= (c.endWeek || 16);
            if (!inRange) return false;
            const type = c.weekType || 'all';
            if (type === 'odd' && currentWeek % 2 === 0) return false; 
            if (type === 'even' && currentWeek % 2 !== 0) return false; 
            return true;
        });

        activeCourses.forEach(course => {
            const card = document.createElement('div'); card.className = 'course-card';
            card.style.backgroundColor = courseColors[course.colorIndex % courseColors.length];
            card.style.gridColumn = course.day + 1; card.style.gridRow = `${course.start + 1} / ${course.end + 2}`;
            let weekHint = ''; if (course.weekType === 'odd') weekHint = '<br><span style="font-size:10px; opacity:0.7;">(单周)</span>'; if (course.weekType === 'even') weekHint = '<br><span style="font-size:10px; opacity:0.7;">(双周)</span>';
            card.innerHTML = `<div class="course-name">${course.name}${weekHint}</div><div class="course-room">${course.room}</div>`;
            card.onclick = (e) => { e.stopPropagation(); openCourseModal(course); }; scheduleGrid.appendChild(card);
        });
    }

    const courseModal = document.getElementById('course-modal'); let currentEditId = null;

    window.openCourseModal = function(course = null, defaultDay = 1, defaultStart = 1) {
        if (course) {
            document.getElementById('course-edit-id').value = course.id; document.getElementById('course-start-week').value = course.startWeek || 1; document.getElementById('course-end-week').value = course.endWeek || 16;
            document.getElementById('course-week-type').value = course.weekType || 'all'; document.getElementById('course-day').value = course.day; document.getElementById('course-start').value = course.start;
            document.getElementById('course-end').value = course.end; document.getElementById('course-name').value = course.name; document.getElementById('course-room').value = course.room; currentEditId = course.id;
        } else {
            document.getElementById('course-edit-id').value = ''; document.getElementById('course-start-week').value = 1; document.getElementById('course-end-week').value = 16;
            document.getElementById('course-week-type').value = 'all'; document.getElementById('course-day').value = defaultDay; document.getElementById('course-start').value = defaultStart;
            document.getElementById('course-end').value = defaultStart + 1 > 12 ? 12 : defaultStart + 1; document.getElementById('course-name').value = ''; document.getElementById('course-room').value = ''; currentEditId = null;
        }
        courseModal.classList.add('show');
    }
    
    window.closeCourseModal = function() { courseModal.classList.remove('show'); }
    
    // 【核心接入云端】：保存课程
    window.saveCourse = async function() {
        const startWeek = parseInt(document.getElementById('course-start-week').value); const endWeek = parseInt(document.getElementById('course-end-week').value);
        const weekType = document.getElementById('course-week-type').value; const day = parseInt(document.getElementById('course-day').value);
        const start = parseInt(document.getElementById('course-start').value); const end = parseInt(document.getElementById('course-end').value);
        const name = document.getElementById('course-name').value.trim(); const room = document.getElementById('course-room').value.trim();
        
        if (!name) { alert('课程名称不能为空！'); return; } if (start > end || startWeek > endWeek) { alert('节次/周次错误！'); return; }
        
        if (currentEditId) {
            const index = courses.findIndex(c => c.id === currentEditId);
            if (index > -1) { courses[index].startWeek = startWeek; courses[index].endWeek = endWeek; courses[index].weekType = weekType; courses[index].day = day; courses[index].start = start; courses[index].end = end; courses[index].name = name; courses[index].room = room; }
        } else { courses.push({ id: Date.now(), startWeek, endWeek, weekType, day, start, end, name, room, colorIndex: Math.floor(Math.random() * courseColors.length) }); }
        
        document.body.style.cursor = 'wait'; // 鼠标变成转圈提示上传中
        await saveCoursesToCloud();
        document.body.style.cursor = 'default';
        closeCourseModal(); renderSchedule();
    }
    
    // 【核心接入云端】：删除课程
    window.deleteCourse = async function() {
        if (currentEditId && confirm('确定要删除这节课吗？')) { 
            courses = courses.filter(c => c.id !== currentEditId); 
            document.body.style.cursor = 'wait';
            await saveCoursesToCloud();
            document.body.style.cursor = 'default';
            closeCourseModal(); renderSchedule(); 
        }
    }

    const ddlTaskInput = document.getElementById('ddl-task-input'); const ddlDateInput = document.getElementById('ddl-date-input');
    const ddlAddBtn = document.getElementById('ddl-add-btn'); const ddlList = document.getElementById('ddl-list');

    function renderDDLs() {
        ddlList.innerHTML = ''; ddls.sort((a, b) => new Date(a.date) - new Date(b.date));
        ddls.forEach((ddl, index) => {
            const today = new Date(); today.setHours(0, 0, 0, 0); const targetDate = new Date(ddl.date);
            const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
            let badgeClass = 'badge-safe'; let statusText = `剩 ${diffDays} 天`;
            if (diffDays < 0) { badgeClass = 'badge-urgent'; statusText = '已逾期'; } else if (diffDays === 0) { badgeClass = 'badge-urgent'; statusText = '就在今天!'; } else if (diffDays <= 3) { badgeClass = 'badge-urgent'; } else if (diffDays <= 7) { badgeClass = 'badge-warning'; }
            const item = document.createElement('div'); item.className = 'ddl-item'; item.style.borderLeftColor = diffDays <= 3 ? '#ff7675' : (diffDays <= 7 ? '#fdcb6e' : '#74b9ff');
            item.innerHTML = `<div style="flex-grow: 1;"><span class="ddl-task">${ddl.task}</span><span class="ddl-date"><i class="fa-regular fa-calendar"></i> ${ddl.date}</span></div><span class="ddl-badge ${badgeClass}">${statusText}</span><button class="wa-delete-btn" onclick="confirmCompleteDDL(${index})" style="margin-left: 15px;" title="完成/删除"><i class="fa-solid fa-check"></i></button>`;
            ddlList.appendChild(item);
        });
    }

    // 【核心接入云端】：新增 DDL
    ddlAddBtn.addEventListener('click', async () => {
        const task = ddlTaskInput.value.trim(); const date = ddlDateInput.value;
        if (!task || !date) { alert('任务和日期都要填！'); return; }
        
        ddls.push({ task, date }); 
        ddlAddBtn.innerText = '...'; ddlAddBtn.disabled = true;
        await saveDDLsToCloud();
        ddlAddBtn.innerText = '添加'; ddlAddBtn.disabled = false;
        
        ddlTaskInput.value = ''; ddlDateInput.value = ''; renderDDLs();
    });

    const ddlConfirmModal = document.getElementById('ddl-confirm-modal'); let pendingDDLIndex = null;
    window.confirmCompleteDDL = function(index) { pendingDDLIndex = index; ddlConfirmModal.classList.add('show'); }
    document.getElementById('ddl-cancel-btn').addEventListener('click', () => { ddlConfirmModal.classList.remove('show'); pendingDDLIndex = null; });
    
    // 【核心接入云端】：完成/删除 DDL
    document.getElementById('ddl-confirm-btn').addEventListener('click', async () => {
        if (pendingDDLIndex !== null) { 
            ddls.splice(pendingDDLIndex, 1); 
            document.body.style.cursor = 'wait';
            await saveDDLsToCloud();
            document.body.style.cursor = 'default';
            renderDDLs(); ddlConfirmModal.classList.remove('show'); pendingDDLIndex = null; 
        }
    });
    
    // 初始化渲染页面
    changeWeek(0); renderDDLs(); 
}

// =========================================================================
// ================= 提醒模块的初始化 (全云端联机版) =======================
// =========================================================================
async function initRemindModule() {
    const remindList = document.getElementById('remind-list');
    if (!remindList) return;
    
    const remindTextInput = document.getElementById('remind-text'); const remindTimeInput = document.getElementById('remind-time');
    const remindFileInput = document.getElementById('remind-file-input'); const remindImgPreview = document.getElementById('remind-img-preview');
    const remindPreviewBox = document.getElementById('remind-img-preview-box'); const remindSubmitBtn = document.getElementById('remind-submit-btn');
    const remindRemoveImgBtn = document.getElementById('remind-remove-img');
    let remindImageBase64 = null; 
    
    let reminds = []; let remindsDbId = null;

    // 1. 从云端统一记忆体拉取数据
    try {
        const { data } = await supabase.from('app_data').select('*').eq('data_key', 'my_reminds').single();
        if (data) { reminds = JSON.parse(data.data_value); remindsDbId = data.id; }
    } catch(e) { console.log("备忘录：云端初次加载或暂无数据"); }

    async function saveRemindsToCloud() {
        if (remindsDbId) { await supabase.from('app_data').update({ data_value: JSON.stringify(reminds) }).eq('id', remindsDbId); } 
        else {
            const { data } = await supabase.from('app_data').insert({ data_key: 'my_reminds', data_value: JSON.stringify(reminds) }).select().single();
            if(data) remindsDbId = data.id;
        }
    }
    // 备忘对应照片压缩
    // remindFileInput.addEventListener('change', (e) => {
    //     const file = e.target.files[0];
    //     if (file) { const reader = new FileReader(); reader.onload = (event) => { remindImageBase64 = event.target.result; remindImgPreview.src = remindImageBase64; remindPreviewBox.style.display = 'block'; }; reader.readAsDataURL(file); }
    // });

    // 【终极修复】：强制压缩备忘录上传的图片，保护 app_data 数据库！
    remindFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width; let height = img.height;
                    const MAX_SIZE = 800; 
                    if (width > height && width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } 
                    else if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    remindImageBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    remindImgPreview.src = remindImageBase64;
                    remindPreviewBox.style.display = 'block';
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    remindRemoveImgBtn.addEventListener('click', () => { remindImageBase64 = null; remindImgPreview.src = ''; remindPreviewBox.style.display = 'none'; remindFileInput.value = ''; });

    function renderReminds() {
        remindList.innerHTML = ''; reminds.sort((a, b) => new Date(a.targetTime) - new Date(b.targetTime));
        reminds.forEach((rmd, index) => {
            const card = document.createElement('div'); card.className = 'remind-card';
            let imgHTML = rmd.image ? `<img src="${rmd.image}" class="remind-card-img">` : '';
            card.innerHTML = `${imgHTML}<div class="remind-card-content" style="position: relative;"><div class="wa-more-options" style="position: absolute; top: 15px; right: 15px;"><button class="wa-more-btn" onclick="toggleRemindMenu('remind-menu-${index}')"><i class="fa-solid fa-ellipsis"></i></button><div id="remind-menu-${index}" class="wa-dropdown-menu"><button class="wa-delete-btn" onclick="showRemindConfirm(${index})"><i class="fa-solid fa-trash-can"></i> 删除备忘</button></div></div><div class="remind-card-text">${rmd.text}</div><div class="countdown-row" data-target="${rmd.targetTime}" id="countdown-${index}">计算中...</div></div>`;
            remindList.appendChild(card);
        });
    }

    // 【核心接入云端】：添加备忘录
    remindSubmitBtn.addEventListener('click', async () => {
        const text = remindTextInput.value.trim(); const time = remindTimeInput.value;
        if (!text || !time) { alert('填好内容和时间！'); return; }
        
        reminds.push({ text: text, targetTime: time, image: remindImageBase64 }); 
        
        remindSubmitBtn.innerText = '上传中...'; remindSubmitBtn.disabled = true;
        await saveRemindsToCloud();
        remindSubmitBtn.innerText = '设置备忘'; remindSubmitBtn.disabled = false;
        
        remindTextInput.value = ''; remindTimeInput.value = ''; remindRemoveImgBtn.click(); renderReminds();
    });

    window.toggleRemindMenu = function(menuId) { document.querySelectorAll('.remind-container .wa-dropdown-menu').forEach(menu => { if (menu.id !== menuId) menu.classList.remove('show'); }); document.getElementById(menuId).classList.toggle('show'); };
    const remindConfirmModal = document.getElementById('remind-confirm-modal'); let pendingRemindDeleteIndex = null;
    window.showRemindConfirm = function(index) { pendingRemindDeleteIndex = index; remindConfirmModal.classList.add('show'); document.querySelectorAll('.remind-container .wa-dropdown-menu').forEach(m => m.classList.remove('show')); };
    document.getElementById('remind-modal-cancel').addEventListener('click', () => { remindConfirmModal.classList.remove('show'); pendingRemindDeleteIndex = null; });
    
    // 【核心接入云端】：删除备忘录
    document.getElementById('remind-modal-confirm').addEventListener('click', async () => { 
        if (pendingRemindDeleteIndex !== null) { 
            reminds.splice(pendingRemindDeleteIndex, 1); 
            document.body.style.cursor = 'wait';
            await saveRemindsToCloud();
            document.body.style.cursor = 'default';
            renderReminds(); remindConfirmModal.classList.remove('show'); pendingRemindDeleteIndex = null; 
        } 
    });

    renderReminds();
    
    // 倒计时刷新器
    if (window.remindTimer) clearInterval(window.remindTimer);
    window.remindTimer = setInterval(() => {
        if(!document.querySelector('.countdown-row')) { clearInterval(window.remindTimer); return; }
        const now = new Date().getTime();
        document.querySelectorAll('.countdown-row').forEach(container => {
            const targetDate = new Date(container.getAttribute('data-target')).getTime(); const distance = targetDate - now;
            if (distance < 0) { container.innerHTML = `<div class="time-finished">🎉 目标时间已到达！</div>`; return; }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24)); const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            container.innerHTML = `<div class="time-box"><span class="time-num">${days}</span><span class="time-label">DAYS</span></div><span style="font-size: 24px; color: var(--theme-pink); font-weight: bold;">:</span><div class="time-box"><span class="time-num">${String(hours).padStart(2, '0')}</span><span class="time-label">HOURS</span></div><span style="font-size: 24px; color: var(--theme-pink); font-weight: bold;">:</span><div class="time-box"><span class="time-num">${String(minutes).padStart(2, '0')}</span><span class="time-label">MINS</span></div><span style="font-size: 24px; color: var(--theme-pink); font-weight: bold;">:</span><div class="time-box"><span class="time-num">${String(seconds).padStart(2, '0')}</span><span class="time-label">SECS</span></div>`;
        });
    }, 1000);
}


// 留言模块的初始化 (全网络云端联机版)
function initMessageBoard() {
    const commentListEle = document.getElementById('comment-list');
    if (!commentListEle) return;

    const qqInput = document.getElementById('comment-qq'); const nicknameInput = document.getElementById('comment-nickname');
    const textInput = document.getElementById('comment-text'); const submitBtn = document.getElementById('comment-submit');
    const countEle = document.getElementById('comment-count'); 
    let comments = []; // 本地缓存数组清空，全靠云端拉取

    function getDeviceBadge() {
        const ua = navigator.userAgent; let browser = "Web"; let os = "PC";
        if (ua.includes("Edg")) browser = "Edge"; else if (ua.includes("Chrome")) browser = "Chrome"; else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        if (ua.includes("Windows NT")) os = "Windows"; else if (ua.includes("Mac OS")) os = "macOS"; else if (ua.includes("Android")) os = "Android"; else if (ua.includes("iPhone")) os = "iOS";
        return `<span class="comment-os"><i class="fa-brands fa-${browser.toLowerCase()}"></i> ${browser}</span> <span class="comment-os"><i class="fa-brands fa-${os === 'Windows' ? 'windows' : (os === 'Android' ? 'android' : 'apple')}"></i> ${os}</span>`;
    }

    function getNowStr() { const now = new Date(); return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'); }

    // 【新增核心】：从云端 Supabase 抽取数据
    async function loadCommentsFromCloud() {
        try {
            const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            
            comments = data.map(row => {
                try {
                    // 解包高级富文本数据
                    const richData = JSON.parse(row.content);
                    return {
                        db_id: row.id, // 记录数据库真实 ID，为了删除时精准制导
                        nickname: row.nickname,
                        qq: richData.qq || '',
                        text: richData.text || row.content,
                        date: new Date(row.created_at).toLocaleString(), // 转换云端时间
                        deviceBadge: richData.deviceBadge || getDeviceBadge(),
                        replies: richData.replies || []
                    };
                } catch(e) {
                    return { db_id: row.id, nickname: row.nickname, qq: '', text: row.content, date: new Date(row.created_at).toLocaleString(), deviceBadge: getDeviceBadge(), replies: [] };
                }
            });
            renderComments();
        } catch (error) {
            console.error("跨次元通信失败：", error);
        }
    }

    function renderComments() {
        commentListEle.innerHTML = ''; countEle.innerText = comments.length;
        comments.forEach((cmt, index) => {
            const item = document.createElement('div'); item.className = 'comment-item';
            const isQQ = /^[1-9][0-9]{4,10}$/.test(cmt.qq); const avatarSrc = isQQ ? `https://q1.qlogo.cn/g?b=qq&nk=${cmt.qq}&s=100` : `https://api.dicebear.com/7.x/adventurer/svg?seed=${cmt.nickname}`;
            let repliesHTML = '';
            if (cmt.replies && cmt.replies.length > 0) {
                repliesHTML += `<div class="comment-replies">`;
                cmt.replies.forEach((reply, rIndex) => { repliesHTML += `<div class="reply-item"><span class="reply-author">${reply.nickname}:</span> <span style="color: var(--text-main);">${reply.text}</span><span style="color: #aaa; font-size: 11px; margin-left: 10px;">${reply.date}</span><div class="wa-more-options" style="position: absolute; top: 10px; right: 10px;"><button class="wa-more-btn" style="padding: 0 5px;" onclick="toggleMsgMenu('reply-menu-${index}-${rIndex}')"><i class="fa-solid fa-ellipsis-vertical"></i></button><div id="reply-menu-${index}-${rIndex}" class="wa-dropdown-menu"><button class="wa-delete-btn" onclick="showCommentConfirm('reply', ${index}, ${rIndex})"><i class="fa-solid fa-trash-can"></i> 删除回复</button></div></div></div>`; });
                repliesHTML += `</div>`;
            }
            item.innerHTML = `<div class="comment-avatar"><img src="${avatarSrc}"></div><div class="comment-body" style="position: relative;"><div class="comment-meta"><span class="comment-author">${cmt.nickname}</span>${cmt.deviceBadge}<div class="comment-date">${cmt.date}</div></div><div class="wa-more-options" style="position: absolute; top: 0; right: 0;"><button class="wa-more-btn" onclick="toggleMsgMenu('comment-menu-${index}')"><i class="fa-solid fa-ellipsis"></i></button><div id="comment-menu-${index}" class="wa-dropdown-menu"><button class="wa-delete-btn" style="color: #74b9ff;" onclick="toggleReplyBox(${index})"><i class="fa-solid fa-reply"></i> 回复Ta</button><button class="wa-delete-btn" onclick="showCommentConfirm('comment', ${index})"><i class="fa-solid fa-trash-can"></i> 删除留言</button></div></div><div class="comment-content">${cmt.text}</div>${repliesHTML}<div class="reply-input-box" id="reply-box-${index}"><input type="text" id="reply-text-${index}" placeholder="回复 ${cmt.nickname} ..."><button class="anime-btn confirm" style="padding: 0 15px; border-radius: 6px;" onclick="submitReply(${index})">发送</button></div></div>`;
            commentListEle.appendChild(item);
        });
    }

    // 【新增核心】：发送数据到云端
    submitBtn.addEventListener('click', async () => {
        const nickname = nicknameInput.value.trim(); const qq = qqInput.value.trim(); const text = textInput.value.trim();
        if (!nickname || !text) { alert('昵称和想说的话都是必填的哦！'); return; }
        
        submitBtn.innerText = "上传中..."; submitBtn.disabled = true;

        const richContent = JSON.stringify({ text: text, qq: qq, deviceBadge: getDeviceBadge(), replies: [] });

        try {
            const { error } = await supabase.from('messages').insert([{ nickname: nickname, content: richContent }]);
            if (error) throw error;
            textInput.value = '';
            await loadCommentsFromCloud(); // 重新拉取云端数据刷新页面
        } catch (error) {
            alert("留言发送失败，请检查网络！");
        } finally {
            submitBtn.innerText = "发表留言"; submitBtn.disabled = false;
        }
    });

    window.submitReply = async function(index) {
        const textInput = document.getElementById(`reply-text-${index}`); const text = textInput.value.trim(); const replierName = document.getElementById('comment-nickname').value.trim();
        if (!text || !replierName) { alert('回复内容和上方昵称不能为空！'); return; }

        const targetComment = comments[index];
        if (!targetComment.replies) targetComment.replies = [];
        targetComment.replies.push({ nickname: replierName, text: text, date: getNowStr() });

        const richContent = JSON.stringify({ text: targetComment.text, qq: targetComment.qq, deviceBadge: targetComment.deviceBadge, replies: targetComment.replies });

        try {
            const { error } = await supabase.from('messages').update({ content: richContent }).eq('id', targetComment.db_id);
            if (error) throw error;
            await loadCommentsFromCloud();
        } catch (e) { alert("回复发送失败！"); }
    };

    window.toggleMsgMenu = function(menuId) { document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(menu => { if (menu.id !== menuId) menu.classList.remove('show'); }); document.getElementById(menuId).classList.toggle('show'); };
    window.toggleReplyBox = function(index) { document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(m => m.classList.remove('show')); document.getElementById(`reply-box-${index}`).classList.toggle('show'); };

    const commentModal = document.getElementById('comment-confirm-modal'); const commentModalMsg = document.getElementById('comment-modal-msg'); let pendingDel = null;
    window.showCommentConfirm = function(type, cIndex, rIndex = -1) { pendingDel = { type, cIndex, rIndex }; commentModalMsg.innerText = type === 'comment' ? "确定要抹去这条留言的记忆吗？(。>︿<)" : "要删掉这条回复吗？"; commentModal.classList.add('show'); document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(m => m.classList.remove('show')); };
    
    document.getElementById('comment-modal-cancel').addEventListener('click', () => { commentModal.classList.remove('show'); pendingDel = null; });
    
    // 【新增核心】：从云端删除数据
    document.getElementById('comment-modal-confirm').addEventListener('click', async () => { 
        if (!pendingDel) return; 
        try {
            if (pendingDel.type === 'comment') {
                await supabase.from('messages').delete().eq('id', comments[pendingDel.cIndex].db_id);
            } else if (pendingDel.type === 'reply') {
                const targetComment = comments[pendingDel.cIndex];
                targetComment.replies.splice(pendingDel.rIndex, 1);
                const richContent = JSON.stringify({ text: targetComment.text, qq: targetComment.qq, deviceBadge: targetComment.deviceBadge, replies: targetComment.replies });
                await supabase.from('messages').update({ content: richContent }).eq('id', targetComment.db_id);
            }
            await loadCommentsFromCloud();
        } catch(e) { alert("删除失败！"); }
        commentModal.classList.remove('show'); pendingDel = null; 
    });
    
    // 首次进入页面时，直接拉取云端数据！
    loadCommentsFromCloud();
}


//关于部分的初始化
function initAboutRuntime() {
    const runtimeEle = document.getElementById('site-runtime');
    if (!runtimeEle) return;
    if (window.runtimeTimer) cancelAnimationFrame(window.runtimeTimer);
    const startDate = new Date('2026-02-22T18:20:45').getTime();
    function updateRuntime() {
        if(!document.getElementById('site-runtime')) return; 
        const now = new Date().getTime(); const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24)); const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        runtimeEle.innerText = `${days} 天 ${hours} 小时 ${minutes} 分 ${String(seconds).padStart(2, '0')} 秒`;
        window.runtimeTimer = requestAnimationFrame(updateRuntime);
    }
    updateRuntime();
}

// =========================================================================
// ==================== 双重唤醒执行区 ====================
// =========================================================================

// 1. 网页第一次从浏览器正常打开时执行
document.addEventListener("DOMContentLoaded", () => {
    initRandomImage(); initWAModule(); initFPS(); initScheduleAndDDL(); initRemindModule(); initMessageBoard(); initAboutRuntime();initTreeOmamori();initArchiveModule();
});

// 2. 无刷新跳转后重新唤醒模块
document.addEventListener('PjaxContentLoaded', () => {
    initRandomImage(); initWAModule(); initFPS(); initScheduleAndDDL(); initRemindModule(); initMessageBoard(); initAboutRuntime();initTreeOmamori();initArchiveModule();
});

// =========================================================================
// ==================== 亚丝娜专属：Live2D 引擎 (全局仅加载一次) ====================
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const live2dContainer = document.getElementById('live2d-container');
    const live2dCanvas = document.getElementById('live2d-canvas');

    if (live2dCanvas) {
        const app = new PIXI.Application({
            view: live2dCanvas, autoStart: true, backgroundAlpha: 0, resizeTo: live2dContainer, resolution: window.devicePixelRatio || 1, autoDensity: true
        });

        const modelUrl = "live2d_models/asuna/asuna_02.model.json"; 

        PIXI.live2d.Live2DModel.from(modelUrl).then(model => {
            app.stage.addChild(model);
            model.scale.set(0.18, 0.24); model.x = 0; model.y = 260; 
            live2dCanvas.style.cursor = 'pointer';

            const dialogBox = document.createElement('div'); dialogBox.id = 'live2d-dialog'; dialogBox.className = 'live2d-dialog'; live2dContainer.appendChild(dialogBox);
            let dialogTimer = null;

            const motions = { fun: [0, 1, 2], sad: [3, 4, 5], sneeze: [6], surprise: [7, 8, 9], repeat: [10, 11, 12], angry: [13, 14, 15] };
            const headPool = [...motions.fun, ...motions.surprise]; const bodyPool = [...motions.angry, ...motions.sad, ...motions.sneeze, ...motions.repeat];
            
            // 1. 【核心新增】：把模型挂载到全局，让所有系统都能操控她说话！
            window.asunaModel = model;

            // 2. 注入带音频路径的终极台词库
            const headDialogues = [
                { text: "嘿嘿，今天也要一起努力哦！", audio: "live2d_models/asuna/voice/head_01.mp3" },
                { text: "稍微有点害羞呢……不过，并不讨厌啦。", audio: "live2d_models/asuna/voice/head_02.mp3" },
                { text: "怎么啦？突然这样摸人家的头……", audio: "live2d_models/asuna/voice/head_03.mp3" },
                { text: "有什么开心的事吗？笑得这么灿烂。", audio: "live2d_models/asuna/voice/head_04.mp3" },
                { text: "既然你这么闲的话，要不要来帮我做三明治？", audio: "live2d_models/asuna/voice/head_05.mp3" },
                { text: "今天天气真好呢，要一起去第 22 层的森林散步吗？", audio: "live2d_models/asuna/voice/head_06.mp3" },
                { text: "辛苦啦！先把剑放下，喝杯热茶休息一下吧。", audio: "live2d_models/asuna/voice/head_07.mp3" },
                { text: "结衣刚才还在找你呢，不去陪陪她吗？", audio: "live2d_models/asuna/voice/head_08.mp3" },
                { text: "摸头可是会让人长不高的！……不过，下不为例哦。", audio: "live2d_models/asuna/voice/head_09.mp3" },
                { text: "嗯……这种感觉，很让人安心呢。", audio: "live2d_models/asuna/voice/head_10.mp3" },
                { text: "每次看到你平安回来，我就彻底放心了。", audio: "live2d_models/asuna/voice/head_11.mp3" },
                { text: "好啦好啦，乖孩子乖孩子~（笑）", audio: "live2d_models/asuna/voice/head_12.mp3" }
            ];

            const chestDialogues = [
                { text: "呀！你在摸哪里啊，变态！", audio: "live2d_models/asuna/voice/chest_01.mp3" },
                { text: "再乱碰的话，我可要拔剑了哦！闪烁之光可不是吃素的！", audio: "live2d_models/asuna/voice/chest_02.mp3" },
                { text: "唔……你这算是性骚扰哦，小心我吃掉你的属性点！", audio: "live2d_models/asuna/voice/chest_03.mp3" },
                { text: "你、你这家伙！快把手拿开啦！", audio: "live2d_models/asuna/voice/chest_04.mp3" },
                { text: "系统警告！这里可是圈内（安全区），不要做奇怪的动作！", audio: "live2d_models/asuna/voice/chest_05.mp3" },
                { text: "就算在 SAO 里没有痛觉，这种行为也是绝对禁止的！", audio: "live2d_models/asuna/voice/chest_06.mp3" },
                { text: "副团长的威严都要被你破坏了啦！给我去墙角反省一下！", audio: "live2d_models/asuna/voice/chest_07.mp3" },
                { text: "信不信我用八连击的『星屑飞溅』把你打飞出艾恩葛朗特？", audio: "live2d_models/asuna/voice/chest_08.mp3" },
                { text: "……你再这样，明天的早餐就只有发硬的黑面包了哦！", audio: "live2d_models/asuna/voice/chest_09.mp3" }
            ];

            const bodyDialogues = [
                { text: "真是的，好好工作啦，不要老是发呆！", audio: "live2d_models/asuna/voice/body_01.mp3" },
                { text: "就算你这样一直戳我，我也不会马上给你做料理的啦！", audio: "live2d_models/asuna/voice/body_02.mp3" },
                { text: "阿嚏！……难道是有人在说我坏话？", audio: "live2d_models/asuna/voice/body_03.mp3" },
                { text: "别闹了啦，马上就要到楼层 Boss 的攻略会议时间了！", audio: "live2d_models/asuna/voice/body_04.mp3" },
                { text: "哎呀，戳那里有点痒啦~", audio: "live2d_models/asuna/voice/body_05.mp3" },
                { text: "肚子饿了吗？我包里还有之前用杂烩兔做好的特级炖肉哦。", audio: "live2d_models/asuna/voice/body_06.mp3" },
                { text: "不要一直盯着我看啦，我的 HP 又没掉。", audio: "live2d_models/asuna/voice/body_07.mp3" },
                { text: "今天你的状态不错嘛，有没有去野外好好练级？", audio: "live2d_models/asuna/voice/body_08.mp3" },
                { text: "喂喂，身为攻略组的一员，可不要在这种地方偷懒啊！", audio: "live2d_models/asuna/voice/body_09.mp3" },
                { text: "武器耐久度还好吗？回城的时候记得去莉兹的店里修理一下哦。", audio: "live2d_models/asuna/voice/body_10.mp3" },
                { text: "如果累了的话，就在长椅上稍微睡一会儿吧，我帮你看着系统警报。", audio: "live2d_models/asuna/voice/body_11.mp3" }
            ];

live2dCanvas.addEventListener('click', (event) => {
                // ================= 【新增】：全局打断锁！=================
                // 只要点了亚丝娜，立刻生成新 ID，掐断御守的一切延时！
                window.asunaInteractionId = Date.now();
                // =======================================================

                const rect = live2dCanvas.getBoundingClientRect(); const clickY = event.clientY - rect.top; const relativeY = clickY / rect.height; 
                let chosenIndex; 
                let chosenDialogue; 

                if (relativeY < 0.45) { 
                    chosenIndex = headPool[Math.floor(Math.random() * headPool.length)]; 
                    chosenDialogue = headDialogues[Math.floor(Math.random() * headDialogues.length)];
                } else if (relativeY >= 0.45 && relativeY < 0.65) { 
                    chosenIndex = motions.angry[Math.floor(Math.random() * motions.angry.length)]; 
                    chosenDialogue = chestDialogues[Math.floor(Math.random() * chestDialogues.length)];
                } else { 
                    const otherBodyPool = [...motions.sad, ...motions.sneeze, ...motions.repeat]; 
                    chosenIndex = otherBodyPool[Math.floor(Math.random() * otherBodyPool.length)]; 
                    chosenDialogue = bodyDialogues[Math.floor(Math.random() * bodyDialogues.length)]; 
                }

                model.motion('', chosenIndex); 
                
                if (window.currentAsunaAudio) {
                    window.currentAsunaAudio.pause();
                    window.currentAsunaAudio.currentTime = 0; 
                }
                
                dialogBox.innerHTML = chosenDialogue.text;

                if (chosenDialogue.audio) {
                    window.currentAsunaAudio = new Audio(chosenDialogue.audio);
                    window.currentAsunaAudio.play().catch(err => console.log('语音拦截或未找到:', err));
                }

                dialogBox.style.top = '0px';
                dialogBox.style.bottom = 'auto';
                dialogBox.classList.remove('show'); void dialogBox.offsetWidth; dialogBox.classList.add('show');
                
                // ================= 【修改】：统一使用全局气泡管家 =================
                clearTimeout(window.globalBubbleTimer); 
                
                if (chosenDialogue.audio && window.currentAsunaAudio) {
                    window.globalBubbleTimer = setTimeout(() => { dialogBox.classList.remove('show'); }, 4500); 
                    window.currentAsunaAudio.addEventListener('loadedmetadata', () => {
                        clearTimeout(window.globalBubbleTimer);
                        const actualTime = window.currentAsunaAudio.duration * 1000 + 500; 
                        window.globalBubbleTimer = setTimeout(() => { dialogBox.classList.remove('show'); }, Math.max(4500, actualTime));
                    });
                } else {
                    window.globalBubbleTimer = setTimeout(() => { dialogBox.classList.remove('show'); }, 4500); 
                }
            });

            console.log("🌸 亚丝娜已完美装载入无刷新底层系统！");
        }).catch(err => { console.error("❌ 模型加载失败:", err); });
    }
});

// ================= 模块九：记忆碎片画廊 (全云端联机版) =================
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer) {
        
        const galleryInput = document.getElementById('gallery-image-input');
        const galleryPreview = document.getElementById('gallery-image-preview');
        const galleryPreviewBox = document.getElementById('gallery-preview-container');
        const galleryCaption = document.getElementById('gallery-caption-input');
        const gallerySubmit = document.getElementById('gallery-submit-btn');
        const galleryRemove = document.getElementById('gallery-remove-image');

        let currentGalleryBase64 = null;
        let galleryPhotos = [];

        // 核心：拉取云端相册
        async function loadPhotosFromCloud() {
            try {
const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false }).limit(20);
                if (error) throw error;
                galleryPhotos = data.map(row => ({ db_id: row.id, src: row.image_url, caption: row.description }));
                renderGallery();
            } catch (e) { console.error("照片云端同步失败:", e); }
        }

        // 压缩代码保持不变
        galleryInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width; let height = img.height;
                        const MAX_SIZE = 800; 
                        if (width > height && width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } 
                        else if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                        canvas.width = width; canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        currentGalleryBase64 = canvas.toDataURL('image/jpeg', 0.7);
                        galleryPreview.src = currentGalleryBase64;
                        galleryPreviewBox.style.display = 'block';
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        galleryRemove.addEventListener('click', () => {
            currentGalleryBase64 = null; galleryPreview.src = '';
            galleryPreviewBox.style.display = 'none'; galleryInput.value = '';
        });

        function renderGallery() {
            galleryContainer.innerHTML = ''; 
            galleryPhotos.forEach((photo, index) => {
                const card = document.createElement('div');
                card.className = 'photo-card';
                const randomRotate = (Math.random() * 6 - 3).toFixed(1);
                card.style.transform = `rotate(${randomRotate}deg)`;

                card.innerHTML = `
                    <img src="${photo.src}" alt="照片">
                    <div class="photo-caption">${photo.caption}</div>
                    <div class="wa-more-options" style="position: absolute; top: 10px; right: 10px;">
                        <button class="wa-more-btn" style="background: rgba(0,0,0,0.4); color: white; padding: 4px 10px; border-radius: 20px;" onclick="toggleGalleryMenu(event, 'gallery-menu-${index}')">
                            <i class="fa-solid fa-ellipsis"></i>
                        </button>
                        <div id="gallery-menu-${index}" class="wa-dropdown-menu" style="right: 0; top: 35px; min-width: 120px;">
                            <button class="wa-delete-btn" onclick="deletePhoto(event, ${index})"><i class="fa-solid fa-trash-can"></i> 删除记忆</button>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => openLightbox(index));
                galleryContainer.appendChild(card);
            });
        }

        // 核心：上传到云端
        gallerySubmit.addEventListener('click', async () => {
            const caption = galleryCaption.value.trim();
            if (!currentGalleryBase64) { alert('请先选择一张照片呀！'); return; }
            if (!caption) { alert('给这张照片写点回忆吧！'); return; }

            gallerySubmit.innerText = "上传中..."; gallerySubmit.disabled = true;

            try {
                await supabase.from('photos').insert([{ image_url: currentGalleryBase64, description: caption }]);
                galleryCaption.value = ''; galleryRemove.click();
                await loadPhotosFromCloud();
            } catch (e) {
                alert("云端传输失败！可能是图片即使压缩后仍超过限制，或网络波动。");
            } finally {
                gallerySubmit.innerText = "发布到画廊"; gallerySubmit.disabled = false;
            }
        });

        window.toggleGalleryMenu = function(event, menuId) {
            event.stopPropagation(); 
            document.querySelectorAll('#gallery-container .wa-dropdown-menu').forEach(menu => { 
                if (menu.id !== menuId) menu.classList.remove('show'); 
            });
            document.getElementById(menuId).classList.toggle('show');
        };

        window.deletePhoto = async function(event, index) {
            event.stopPropagation(); 
            if(confirm("确定要销毁这段记忆碎片吗？")) {
                const dbId = galleryPhotos[index].db_id;
                try {
                    await supabase.from('photos').delete().eq('id', dbId);
                    await loadPhotosFromCloud();
                } catch(e) { alert("销毁失败！"); }
            }
        };

        // 灯箱逻辑
        const lightboxModal = document.getElementById('lightbox-modal');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        let currentLightboxIndex = 0; 

        function openLightbox(index) {
            document.querySelectorAll('#gallery-container .wa-dropdown-menu').forEach(menu => menu.classList.remove('show'));
            currentLightboxIndex = index; updateLightboxContent(); lightboxModal.classList.add('show');
        }

        function updateLightboxContent() {
            if (galleryPhotos.length === 0) return;
            const photo = galleryPhotos[currentLightboxIndex];
            lightboxImg.src = photo.src; lightboxCaption.innerText = photo.caption;
        }

        function showPrev(e) { if (e) e.stopPropagation(); currentLightboxIndex = (currentLightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length; updateLightboxContent(); }
        function showNext(e) { if (e) e.stopPropagation(); currentLightboxIndex = (currentLightboxIndex + 1) % galleryPhotos.length; updateLightboxContent(); }

        if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
        if (lightboxNext) lightboxNext.addEventListener('click', showNext);
        lightboxClose.addEventListener('click', () => lightboxModal.classList.remove('show'));
        lightboxModal.addEventListener('click', (e) => { if (e.target === lightboxModal) lightboxModal.classList.remove('show'); });

        document.addEventListener('keydown', (e) => {
            if (lightboxModal.classList.contains('show')) {
                if (e.key === 'ArrowLeft') showPrev();
                else if (e.key === 'ArrowRight') showNext();
                else if (e.key === 'Escape') lightboxModal.classList.remove('show'); 
            }
        });
        
        // 初始加载云端相册
        loadPhotosFromCloud();
    }
// =========================================================================
// ================= 模块十二：树枝悬挂御守与亚丝娜三段交互 =================
// =========================================================================
function initTreeOmamori() {
    const treeSystem = document.getElementById('omamori-tree-system');
    const charm = document.getElementById('omamori-charm');

    if (!treeSystem || !charm) return;

// 命运采样库 (终极挂载音频版)
    const fateLibrary = [
        // 大吉
        { rank: "大吉", motto: "十连双黄！今天的你被系统和幸运女神同时眷顾了！", good: "单抽奇迹", bad: "头铁下毒池", item: "抽卡玄学歌", audio: "live2d_models/asuna/voice/omamori_01.mp3" },
        { rank: "大吉", motto: "玄学护体！明明一行代码都没改，Bug却奇迹般地自己消失了！", good: "一次编译通过", bad: "乱动祖传代码", item: "初音未来手办", audio: "live2d_models/asuna/voice/omamori_02.mp3" },
        { rank: "大吉", motto: "艾恩葛朗特万里无云，今天点外卖竟然被老板多送了一个鸡腿！", good: "尝试新口味", bad: "吃白水煮面", item: "冰镇可乐", audio: "live2d_models/asuna/voice/omamori_03.mp3" },
        // 中吉
        { rank: "中吉", motto: "随机点开的新番意外地神仙，恭喜发现一部宝藏神作！", good: "一口气追平进度", bad: "手贱搜百度百科", item: "薯片与爆米花", audio: "live2d_models/asuna/voice/omamori_04.mp3" },
        { rank: "中吉", motto: "就像在看日常番一样，今天什么都不做，发呆也是一件正经事。", good: "漫无目的地散步", bad: "设定严密的计划表", item: "微风与阳光", audio: "live2d_models/asuna/voice/omamori_05.mp3" },
        { rank: "中吉", motto: "喜欢的角色今天存活确认，不仅没发便当，甚至还有高光时刻！", good: "疯狂截图做壁纸", bad: "在弹幕里剧透", item: "速效救心丸", audio: "live2d_models/asuna/voice/omamori_06.mp3" },
        { rank: "中吉", motto: "烙铁温度刚刚好，焊点圆润饱满，今天你是实验室里的‘焊武帝’。", good: "飞线修复老主板", bad: "带电插拔排线", item: "松香与吸锡器", audio: "live2d_models/asuna/voice/omamori_07.mp3" },
        // 小吉
        { rank: "小吉", motto: "进门刚好踩着上课铃，踩着点上课，今天的时间管理大师就是你。", good: "随性出门转转", bad: "宅在家里发霉", item: "准时的手表", audio: "live2d_models/asuna/voice/omamori_08.mp3" },
        { rank: "小吉", motto: "OpenCV 识别到了奇怪的人脸？别怕，大概率只是墙上的海报反光。", good: "调参找到最优解", bad: "大半夜一个人测试", item: "偏振镜片", audio: "live2d_models/asuna/voice/omamori_09.mp3" },
        { rank: "小吉", motto: "今天撸到的猫咪脾气特别好，甚至主动翻肚皮给你摸。", good: "准备猫条加餐", bad: "试图给猫洗澡", item: "毛茸茸的触感", audio: "live2d_models/asuna/voice/omamori_10.mp3" },
        // 平安
        { rank: "平安", motto: "平凡的日常，才是最连续的奇迹。今天不如早点洗洗睡吧。", good: "躺平放空大脑", bad: "深夜网抑云", item: "柔软的抱枕", audio: "live2d_models/asuna/voice/omamori_11.mp3" },
        { rank: "平安", motto: "音乐播放器随机到了一首很久没听的动漫神曲，DNA 狠狠地动了！", good: "跟着副歌哼唱", bad: "外放打扰别人", item: "高解析度耳机", audio: "live2d_models/asuna/voice/omamori_12.mp3" },
        // 末吉
        { rank: "末吉", motto: "今天没有拯救世界的任务，只要按时吃满三顿饭就算是巨大成功。", good: "吃一顿好的", bad: "疯狂立Flag", item: "豪华版泡面", audio: "live2d_models/asuna/voice/omamori_13.mp3" },
        { rank: "末吉", motto: "虽然天气很好，但在屋里拉上窗帘躺着，也是对周末的一种尊重。", good: "裹紧小被子", bad: "强迫自己打扫卫生", item: "懒人沙发", audio: "live2d_models/asuna/voice/omamori_14.mp3" },
        // 小凶 / 凶
        { rank: "小凶", motto: "前方高能预警！今天上网极易惨遭剧透，建议断网保平安。", good: "关掉手机睡大觉", bad: "点开热搜和评论区", item: "物理断网器", audio: "live2d_models/asuna/voice/omamori_15.mp3" },
        { rank: "小凶", motto: "墨菲定律生效中：当你想给别人演示功能时，它一定会报错死机。", good: "提前录好演示视频", bad: "骄傲地疯狂点击", item: "理直气壮的甩锅借口", audio: "live2d_models/asuna/voice/omamori_16.mp3" },
        { rank: "凶", motto: "Git 提交备注随手乱写，刚 push 完就发现没法回头修改。", good: "假装什么都没发生", bad: "直视镜头三十秒", item: "最高级美颜滤镜", audio: "live2d_models/asuna/voice/omamori_17.mp3" }
    ];

    // 状态机：0=缩在屏幕外, 1=树枝已伸出, 2=亚丝娜已搭话, 3=正在出结果锁死
    let state = 0;

    // ---------------------------------------------------------
    // 核心 1：御守自身的点击流转逻辑
    // ---------------------------------------------------------
 // ---------------------------------------------------------
 // 状态机：改用全局变量，防止局部变量造成的幽灵状态
    window.omamoriState = 0;

    // ---------------------------------------------------------
    // 核心 1：御守自身的点击流转逻辑 
    // ---------------------------------------------------------
    charm.addEventListener('click', (e) => {
        // 【新增核心】：记录本次交互的唯一ID
        window.asunaInteractionId = Date.now();
        const currentId = window.asunaInteractionId; 
        
        const dialogBox = document.getElementById('live2d-dialog');

        function showAsunaDialog(text, duration = 4500, audioUrl = null) {
            if (!dialogBox) return;
            
            if (window.currentAsunaAudio) {
                window.currentAsunaAudio.pause();
                window.currentAsunaAudio.currentTime = 0;
            }

            dialogBox.style.top = '0px'; 
            dialogBox.style.bottom = 'auto';
            dialogBox.innerHTML = text;
            dialogBox.classList.remove('show');
            void dialogBox.offsetWidth; 
            dialogBox.classList.add('show');

            if (audioUrl) {
                window.currentAsunaAudio = new Audio(audioUrl);
                window.currentAsunaAudio.play().catch(err => console.log('语音拦截或未找到:', err));
            }

            // 【修改】：统一使用全局气泡管家
            clearTimeout(window.globalBubbleTimer);
            
            if (audioUrl && window.currentAsunaAudio) {
                window.globalBubbleTimer = setTimeout(() => { dialogBox.classList.remove('show'); }, duration); 
                window.currentAsunaAudio.addEventListener('loadedmetadata', () => {
                    clearTimeout(window.globalBubbleTimer);
                    const actualTime = window.currentAsunaAudio.duration * 1000 + 500; 
                    window.globalBubbleTimer = setTimeout(() => { dialogBox.classList.remove('show'); }, Math.max(duration, actualTime));
                });
            } else {
                window.globalBubbleTimer = setTimeout(() => { dialogBox.classList.remove('show'); }, duration);
            }
        }

        if (window.omamoriState === 0) {
            treeSystem.classList.remove('closed');
            window.omamoriState = 1;
            return; 
        }

        if (!dialogBox) { alert("亚丝娜还在赶来的路上，请稍等一秒再点哦！"); return; }

        charm.style.transform = "scale(0.9) rotate(-5deg)";
        setTimeout(() => charm.style.transform = "", 200);

        const todayStr = new Date().toLocaleDateString(); 
        const savedDate = localStorage.getItem('omamori_date');
        const savedFateStr = localStorage.getItem('omamori_result');

        if (window.omamoriState === 1) {
            if (savedDate === todayStr && savedFateStr) {
                window.omamoriState = 3; 
                showAsunaDialog("真是的，祈愿这种事一天只能做一次啦！太贪心的话可是会被系统弹出违规警告的哦~<br>不过……既然你没记住，我就破例再帮你调取一次今天的日志吧！", 4500, "live2d_models/asuna/voice/omamori_deny.mp3");
                dialogBox.style.top = 'auto';
                dialogBox.style.bottom = 'calc(100% - 90px)'; 

                const showHistoryFateAction = () => {
                    // 【拦截器】：如果这期间你点了别的地方，ID 已经变了，立刻放弃执行这句台词！
                    if (window.asunaInteractionId !== currentId) return; 
                    
                    const fate = JSON.parse(savedFateStr);
                    const speech = `今日运势：【${fate.rank}】<br>“${fate.motto}”<br>宜：${fate.good}<br>忌：${fate.bad}<br>幸运物：${fate.item}`;
                    
                    showAsunaDialog(speech, 6000, fate.audio); 
                    dialogBox.style.top = 'auto';
                    dialogBox.style.bottom = 'calc(100% - 90px)'; 
                    
                    const closeTreeAction = () => {
                        if (window.asunaInteractionId !== currentId) return; // 【拦截器】
                        treeSystem.classList.add('closed');
                        window.omamoriState = 0; 
                        dialogBox.style.top = '5px'; 
                        dialogBox.style.bottom = 'auto';
                    };
                    
                    if (window.currentAsunaAudio) {
                        window.currentAsunaAudio.addEventListener('loadedmetadata', () => {
                            if (window.asunaInteractionId !== currentId) return; // 【拦截器】
                            const actualTime = window.currentAsunaAudio.duration * 1000 + 500;
                            setTimeout(closeTreeAction, Math.max(6000, actualTime));
                        });
                        window.currentAsunaAudio.addEventListener('error', () => {
                            if (window.asunaInteractionId !== currentId) return; 
                            setTimeout(closeTreeAction, 6000);
                        });
                    } else {
                        setTimeout(closeTreeAction, 6000);
                    }
                };

                if (window.currentAsunaAudio) {
                    window.currentAsunaAudio.addEventListener('loadedmetadata', () => {
                        if (window.asunaInteractionId !== currentId) return; // 【拦截器】
                        const denyTime = window.currentAsunaAudio.duration * 1000 + 500;
                        setTimeout(showHistoryFateAction, Math.max(4500, denyTime));
                    });
                    window.currentAsunaAudio.addEventListener('error', () => {
                        if (window.asunaInteractionId !== currentId) return;
                        setTimeout(showHistoryFateAction, 4500);
                    });
                } else {
                    setTimeout(showHistoryFateAction, 4500);
                }

            } else {
                showAsunaDialog("✨ 咦？这里挂着一个御守！<br>要来看看今天的运势吗？再点一下试试看吧~", 5000, "live2d_models/asuna/voice/omamori_greet.mp3");
                window.omamoriState = 2;
            }
        } 
        else if (window.omamoriState === 2) {
            window.omamoriState = 3; 
            showAsunaDialog("正在向系统提交祈愿请求...", 2000); 
            
            setTimeout(() => {
                if (window.asunaInteractionId !== currentId) return; // 【拦截器】
                
                const fate = fateLibrary[Math.floor(Math.random() * fateLibrary.length)];
                localStorage.setItem('omamori_date', todayStr);
                localStorage.setItem('omamori_result', JSON.stringify(fate));
                
                const speech = `今日运势：【${fate.rank}】<br>“${fate.motto}”<br>宜：${fate.good}<br>忌：${fate.bad}<br>幸运物：${fate.item}`;
                
                showAsunaDialog(speech, 6000, fate.audio); 
                dialogBox.style.top = 'auto';
                dialogBox.style.bottom = 'calc(100% - 90px)'; 
                
                const closeTreeAction = () => {
                    if (window.asunaInteractionId !== currentId) return; // 【拦截器】
                    treeSystem.classList.add('closed');
                    window.omamoriState = 0; 
                    dialogBox.style.top = '5px'; 
                    dialogBox.style.bottom = 'auto';
                };
                
                if (window.currentAsunaAudio) {
                    window.currentAsunaAudio.addEventListener('loadedmetadata', () => {
                        if (window.asunaInteractionId !== currentId) return; // 【拦截器】
                        const actualTime = window.currentAsunaAudio.duration * 1000 + 500;
                        setTimeout(closeTreeAction, Math.max(6000, actualTime));
                    });
                    window.currentAsunaAudio.addEventListener('error', () => {
                        if (window.asunaInteractionId !== currentId) return;
                        setTimeout(closeTreeAction, 6000);
                    });
                } else {
                    setTimeout(closeTreeAction, 6000);
                }
            }, 1000);
        }
    });

    // ---------------------------------------------------------
    // 核心 2：全局防误触侦测 (无情打断版)
    // ---------------------------------------------------------
    document.addEventListener('click', (e) => {
        if (window.omamoriState === 0) return;

        const isClickOmamori = e.target.closest('#omamori-tree-system');

        // 只要你点的不是御守本体，树枝统统收回，所有动作统统掐断！
        if (!isClickOmamori) {
            // ================= 终极杀手锏 =================
            window.asunaInteractionId = Date.now(); // 强制发个新 ID，让后面排队的语音全部自杀
            // ==============================================
            
            treeSystem.classList.add('closed');
            window.omamoriState = 0; 
            
            const dialogBox = document.getElementById('live2d-dialog');
            // 只清理属于抽签的文本，如果气泡已经被亚丝娜的其他动作（比如你刚刚摸了她的头）覆盖了，就不关气泡
            if (dialogBox && (dialogBox.innerHTML.includes('运势') || dialogBox.innerHTML.includes('祈愿') || dialogBox.innerHTML.includes('一天只能做一次') || dialogBox.innerHTML.includes('挂着一个御守'))) {
                dialogBox.classList.remove('show');
                if (window.currentAsunaAudio) {
                    window.currentAsunaAudio.pause();
                    window.currentAsunaAudio.currentTime = 0;
                }
            }
        }
    });}

    // =========================================================================
// ================= 模块十三：ACG 归档系统 (全云端联机版) =================
// =========================================================================
function initArchiveModule() {
    const archiveGrid = document.getElementById('archive-grid');
    if (!archiveGrid) return; // 如果不是归档页面，直接退出

    const toggleBtn = document.getElementById('archive-toggle-editor');
    const editorBox = document.getElementById('archive-editor-box');
    const submitBtn = document.getElementById('arc-submit-btn');
    
    // 表单元素
    const inputCategory = document.getElementById('arc-category');
    const inputTitle = document.getElementById('arc-title');
    const inputReview = document.getElementById('arc-review');
    const coverInput = document.getElementById('arc-cover-input');
    const extraInput = document.getElementById('arc-extra-input');
    const previewArea = document.getElementById('arc-preview-area');
    
    let coverBase64 = null;
    let extraImagesBase64 = []; // 存多张额外截图
    let archivesData = [];

    // 1. 编辑器展开/收起开关
    toggleBtn.addEventListener('click', () => {
        const isHidden = editorBox.style.display === 'none';
        editorBox.style.display = isHidden ? 'block' : 'none';
        toggleBtn.innerHTML = isHidden ? '<i class="fa-solid fa-angle-up"></i> 收起编辑器' : '<i class="fa-solid fa-pen-nib"></i> 封存新的记忆';
    });

    // 2. 超级画质压缩引擎 (复用你的 800px 算法)
    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width; let height = img.height;
                    const MAX_SIZE = 800; 
                    if (width > height && width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } 
                    else if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7)); // 压到 70% 画质，极其轻量
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    // 3. 处理主封面图上传
    coverInput.addEventListener('change', async (e) => {
        if (e.target.files[0]) {
            coverBase64 = await compressImage(e.target.files[0]);
            renderPreviews();
        }
    });

    // 4. 处理多张额外截图上传
    extraInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        for (let file of files) {
            if (extraImagesBase64.length >= 9) { // 限制最多 9 张截图防撑爆
                alert("最多只能添加 9 张额外截图哦！"); break;
            }
            const base64 = await compressImage(file);
            extraImagesBase64.push(base64);
        }
        renderPreviews();
    });

    // 5. 渲染预览区
    function renderPreviews() {
        previewArea.innerHTML = '';
        if (coverBase64) {
            previewArea.innerHTML += `
                <div style="position:relative;">
                    <span style="position:absolute; top:2px; left:2px; background:var(--theme-pink); color:white; font-size:10px; padding:2px 6px; border-radius:4px;">封面</span>
                    <img src="${coverBase64}" style="height:80px; border-radius:4px; border:2px solid var(--theme-pink);">
                </div>`;
        }
        extraImagesBase64.forEach((imgBase64, index) => {
            previewArea.innerHTML += `
                <div style="position:relative;">
                    <img src="${imgBase64}" style="height:80px; border-radius:4px; border:1px solid #ccc;">
                    <button onclick="removeExtraImage(${index})" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:18px; height:18px; cursor:pointer; font-size:10px;">X</button>
                </div>`;
        });
    }

    window.removeExtraImage = function(index) {
        extraImagesBase64.splice(index, 1);
        renderPreviews();
    };

    // ================= 云端拉取与展示 =================
    async function loadArchivesFromCloud() {
        try {
            const { data, error } = await supabase.from('acg_archives').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            archivesData = data;
            renderArchiveGrid('all'); // 默认显示全部
        } catch (e) {
            console.error("归档拉取失败:", e);
        }
    }

    function renderArchiveGrid(filter) {
        archiveGrid.innerHTML = '';
        const filteredData = filter === 'all' ? archivesData : archivesData.filter(item => item.category === filter);
        
        filteredData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'arc-card';
            card.innerHTML = `
                <img src="${item.cover_image}" class="arc-card-cover">
                <div class="arc-card-info">
                    <div class="arc-card-title">${item.title}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="arc-badge badge-${item.category}">${item.category}</span>
                        <span style="font-size:11px; color:#888;">${new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
            // 点击卡片打开详情弹窗
            card.addEventListener('click', () => openArchiveModal(item));
            archiveGrid.appendChild(card);
        });
    }

    // 分类过滤器点击事件
    document.querySelectorAll('.arc-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.arc-filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderArchiveGrid(e.target.getAttribute('data-filter'));
        });
    });

    // ================= 弹窗系统 =================
    const modal = document.getElementById('arc-detail-modal');
    let currentDetailId = null;

    function openArchiveModal(item) {
        currentDetailId = item.id;
        document.getElementById('arc-detail-cover').src = item.cover_image;
        document.getElementById('arc-detail-title').innerText = item.title;
        document.getElementById('arc-detail-meta').innerHTML = `
            <div style="margin-bottom:10px;"><span class="arc-badge badge-${item.category}">${item.category}</span></div>
            <div style="font-size:12px; color:#888;">入档时间：${new Date(item.created_at).toLocaleString()}</div>
        `;
        document.getElementById('arc-detail-review').innerText = item.review;
        
        // 渲染额外截图
        const extraGallery = document.getElementById('arc-detail-extra-images');
        extraGallery.innerHTML = '';
        if (item.extra_images) {
            const imagesArray = JSON.parse(item.extra_images);
            imagesArray.forEach(imgSrc => {
                extraGallery.innerHTML += `<img src="${imgSrc}" onclick="window.open('${imgSrc}')" title="点击查看原图">`;
            });
        }
        
        modal.classList.add('show');
    }

    document.getElementById('arc-detail-close').addEventListener('click', () => modal.classList.remove('show'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });

    // ================= 云端核心：发布与删除 =================
    submitBtn.addEventListener('click', async () => {
        const title = inputTitle.value.trim();
        const category = inputCategory.value;
        const review = inputReview.value.trim();

        if (!title || !coverBase64) { alert("作品标题和封面图是必须要填的哦！"); return; }

        submitBtn.innerText = "上传封存中..."; submitBtn.disabled = true;

        try {
            await supabase.from('acg_archives').insert([{ 
                category: category, 
                title: title, 
                cover_image: coverBase64, 
                extra_images: JSON.stringify(extraImagesBase64), 
                review: review 
            }]);
            
            // 清空表单
            inputTitle.value = ''; inputReview.value = ''; coverBase64 = null; extraImagesBase64 = []; renderPreviews();
            toggleBtn.click(); // 收起编辑器
            await loadArchivesFromCloud(); // 重新拉取
        } catch(e) {
            alert("上传失败！如果传了太多图，请减少几张截图试试。");
        } finally {
            submitBtn.innerText = "发布归档"; submitBtn.disabled = false;
        }
    });

    document.getElementById('arc-detail-delete').addEventListener('click', async () => {
        if (confirm("真的要从档案馆中彻底抹除这部作品的记录吗？")) {
            try {
                await supabase.from('acg_archives').delete().eq('id', currentDetailId);
                modal.classList.remove('show');
                await loadArchivesFromCloud();
            } catch(e) { alert("删除失败！"); }
        }
    });

    // 网页加载时启动同步
    loadArchivesFromCloud();
}