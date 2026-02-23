// 当网页所有的 HTML 内容都加载完毕后，再执行里面的代码
document.addEventListener("DOMContentLoaded", () => {
    
    // // ================= 模块一：侧边栏菜单点击弹窗 =================
    // const menuLinks = document.querySelectorAll('.sidebar-menu a');
    
    // menuLinks.forEach(link => {
    //     link.addEventListener('click', (event) => {
    //         // 阻止 `<a>` 标签默认的跳转行为
    //         event.preventDefault(); 
    //         // 获取点击的菜单文字内容
    //         const menuName = event.target.innerText.trim();
    //         // 弹出一个提示框作为占位接口，后续这里可以换成实际的跳转代码
    //         alert(`【接口预留】你点击了侧边栏的：[ ${menuName} ] 模块\n后续这里可以接入具体的页面加载逻辑。`);
    //     });
    // });

    // ================= 模块二：鼠标光彩拖尾 =================
    //const colors = ['#ffb6c1', '#87cefa', '#dda0dd', '#98fb98', '#ffdab9']; // 拖尾的颜色池
    //const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00']; // 更鲜艳的颜色池

    //const colors = ['#fb4444', '#f2ff00', '#35e026', '#30d2ff'];
    //const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFB6C1']; // 烟花效果的颜色池
    const colors = ['#00ff04', '#0095ff', '#FF0000', '#FFFF00']; // 烟花效果的颜色池

    document.addEventListener('mousemove', (e) => {
        // 创建一个 div 元素作为拖尾点
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        // 跟随鼠标坐标 (考虑网页滚动条的距离)
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';
        // 随机抽取一个颜色
        trail.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(trail);
        
        // 动画播放完毕后（600毫秒），将这个元素从网页中删除，防止内存泄漏
        setTimeout(() => {
            trail.remove();
        }, 600);
    });

    // ================= 模块三：点击烟花爆炸特效 =================
    document.addEventListener('click', (e) => {
        const particleCount = 30; // 每次点击产生的粒子数量
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            
            // 初始位置设定在鼠标点击的地方
            particle.style.left = e.pageX + 'px';
            particle.style.top = e.pageY + 'px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 计算粒子飞行的随机角度和距离
            const angle = Math.random() * Math.PI * 2; // 0 到 360 度
            const velocity = 100 + Math.random() * 100;  // 飞行距离 30px ~ 80px
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            // 将计算好的距离通过 CSS 变量传给 CSS 动画
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            document.body.appendChild(particle);
            
            // 动画结束后删除粒子
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
        // 2. 新增：生成会扩大的圆环
    const ring = document.createElement('div');
    ring.className = 'firework-ring';
    
    // 设置圆环的初始位置（鼠标点击位置）
    ring.style.left = e.pageX + 'px';
    ring.style.top = e.pageY + 'px';
    
    // 随机选择一个鲜艳的颜色
    ring.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(ring);
    
    // 圆环动画结束后删除
    setTimeout(() => {
        ring.remove();
    }, 800);


    });

   // ================= 模块四：全局抽屉音乐播放器 =================
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

        // 【核心操作区】：在这里填入你本地下载好的歌曲路径！
        // src 填写文件路径，比如 "music/song1.mp3"
        // cover 可以是每首歌对应的封面图，也可以统一用一张
        // 直接从你外部的 playlist.js 中读取百首歌单！
        const songs = window.FLA_Playlist || [];
        let currentIndex = 0;

        // 1. 点击箭头/封面拉出抽屉
        playerToggle.addEventListener('click', () => {
            globalPlayer.classList.toggle('expanded');
        });

        // 2. 渲染歌单
        function renderPlaylist() {
            playlistEle.innerHTML = '';
            songs.forEach((song, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${song.title}</span> <span style="font-size:10px; opacity:0.7">${song.artist}</span>`;
                if (index === currentIndex) li.classList.add('active');
                
                // 点击切歌
                li.addEventListener('click', () => {
                    currentIndex = index;
                    loadSong(currentIndex);
                    playMusic();
                });
                playlistEle.appendChild(li);
            });
        }

        // 3. 加载歌曲信息
        function loadSong(index) {
            const song = songs[index];
            titleEle.innerText = song.title;
            artistEle.innerText = song.artist;
            coverImg.src = song.cover;
            audio.src = song.src;
            
            // 更新列表中高亮的那一首
            document.querySelectorAll('.playlist li').forEach((li, i) => {
                li.classList.toggle('active', i === index);
            });
        }

        // 4. 播放控制逻辑
        function playMusic() {
            audio.play();
            coverImg.classList.add('playing'); // 让封面转起来
            btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>'; // 图标变成暂停
        }

        function pauseMusic() {
            audio.pause();
            coverImg.classList.remove('playing');
            btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
        }

        btnPlay.addEventListener('click', () => {
            if (audio.paused) {
                // 如果是第一次点播放，加载第一首歌
                if (!audio.src || audio.src === window.location.href) {
                    loadSong(currentIndex);
                }
                playMusic();
            } else {
                pauseMusic();
            }
        });

        btnNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % songs.length;
            loadSong(currentIndex);
            playMusic();
        });

        btnPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + songs.length) % songs.length;
            loadSong(currentIndex);
            playMusic();
        });

        // 播完自动切下一首
        audio.addEventListener('ended', () => {
            btnNext.click();
        });

        // 初始化加载数据
        if (songs.length > 0) {
            loadSong(currentIndex);
            renderPlaylist();
        }
    }
    // // ================= 模块五：左下角桌宠互动 =================
    // const webPet = document.getElementById('web-pet');
    // const petImg = document.getElementById('pet-img');
    // const petDialog = document.getElementById('pet-dialog');
    // let dialogTimer = null;

    // // 1. 桌宠根据鼠标位置转身
    // document.addEventListener('mousemove', (e) => {
    //     // 获取桌宠在屏幕上的水平中心点位置
    //     const petRect = petImg.getBoundingClientRect();
    //     const petCenterX = petRect.left + (petRect.width / 2);

    //     // 如果鼠标在桌宠的左边，让图片水平翻转；在右边则恢复正常
    //     if (e.clientX < petCenterX) {
    //         petImg.style.transform = 'scaleX(-1)';
    //     } else {
    //         petImg.style.transform = 'scaleX(1)';
    //     }
    // });

    // // 2. 点击桌宠弹出对话框
    // webPet.addEventListener('click', (event) => {
    //     // 阻止事件冒泡，防止触发网页的通用点击烟花特效（如果你想点桌宠也出烟花，可以删掉这行）
    //     event.stopPropagation(); 

    //     const messages = [
    //         "哇，你终于回来了~",
    //         "今天也要开心哦！",
    //         "需要我帮你找些什么吗？",
    //         "不要一直盯着我看啦...",
    //         "LINK START!"
    //     ];
        
    //     // 随机抽取一句话显示
    //     petDialog.innerText = messages[Math.floor(Math.random() * messages.length)];
    //     petDialog.classList.add('show');
        
    //     // 每次点击重置定时器，让对话框显示 3 秒后消失
    //     clearTimeout(dialogTimer);
    //     dialogTimer = setTimeout(() => {
    //         petDialog.classList.remove('show');
    //     }, 3000);
    // });

    // ================= 模块三：文章大图随机二次元番剧 =================
    // ================= 模块三：文章大图随机二次元番剧 =================
    // ================= 模块三：文章大图随机二次元番剧 =================
    // ================= 模块三：文章大图随机二次元番剧 =================
    // ================= 模块三：文章大图随机二次元番剧 =================

    const articleImg = document.querySelector('.article-image img');
    
    if (articleImg) {
        // 【方案一：直接使用公开的随机二次元图片 API（最省事，每次刷新自动换）】
        // 这里提供了一个优质的动漫壁纸随机接口，加上 getTime() 防止浏览器缓存同一张图
        articleImg.src = "https://t.alcy.cc/ycy?" + new Date().getTime();

        /*
        // 【方案二：精准控制 06-26 年特定热门番剧（推荐用于正式建站）】
        // 如果你希望只出现你指定的优质番剧截图，你可以把喜欢的图片下载到本地的 images 文件夹
        // 然后把它们的路径填在这个数组里：
        const myAnimeImages = [
            "images/clannad_2008.jpg",     
            "images/k_on_2009.jpg",        
            "images/sao_asuna_2012.jpg",      
            "images/fate_ubw_2014.jpg",       
            "images/frieren_2023.jpg"      
        ];
        
        // 随机抽取数组中的一张并替换：
        // const randomIndex = Math.floor(Math.random() * myAnimeImages.length);
        // articleImg.src = myAnimeImages[randomIndex];
        */
    }
    
    // ================= 模块四：WA 流水账页面专属逻辑 =================
    // ================= 模块四：WA 流水账页面专属逻辑 =================
    // ================= 模块四：WA 流水账页面专属逻辑 =================
    // ================= 模块四：WA 流水账页面专属逻辑 =================
    // ================= 模块四：WA 流水账页面专属逻辑 =================

    const waTextarea = document.getElementById('wa-textarea');
    
    // 只有当前页面存在输入框时，才执行WA的代码（防止在首页报错）
    if (waTextarea) {
        const waWordCount = document.getElementById('wa-word-count');
        const waCurrentTime = document.getElementById('wa-current-time');
        const waImageInput = document.getElementById('wa-image-input');
        const waImagePreview = document.getElementById('wa-image-preview');
        const waPreviewContainer = document.getElementById('wa-image-preview-container');
        const waRemoveImage = document.getElementById('wa-remove-image');
        const waSubmitBtn = document.getElementById('wa-submit-btn');
        const waFeed = document.getElementById('wa-feed');
        
        let currentImageBase64 = null; // 用于存储选择的图片

        // 1. 实时更新右下角时钟
        setInterval(() => {
            const now = new Date();
            // 格式化时间为 YYYY-MM-DD HH:mm:ss
            const timeString = now.getFullYear() + '-' + 
                               String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                               String(now.getDate()).padStart(2, '0') + ' ' + 
                               String(now.getHours()).padStart(2, '0') + ':' + 
                               String(now.getMinutes()).padStart(2, '0') + ':' + 
                               String(now.getSeconds()).padStart(2, '0');
            waCurrentTime.innerText = timeString;
        }, 1000);

        // 2. 实时监听输入，计算字数
        waTextarea.addEventListener('input', () => {
            const text = waTextarea.value;
            waWordCount.innerText = text.length;
        });

        // 3. 图片选择与预览逻辑
        waImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentImageBase64 = event.target.result; // 将图片转为 base64 文本
                    waImagePreview.src = currentImageBase64;
                    waPreviewContainer.style.display = 'inline-block';
                };
                reader.readAsDataURL(file);
            }
        });

        // 取消选择的图片
        waRemoveImage.addEventListener('click', () => {
            currentImageBase64 = null;
            waImagePreview.src = '';
            waPreviewContainer.style.display = 'none';
            waImageInput.value = ''; // 清空 file input
        });

// 4. 读取本地存储的帖子并渲染
// 4. 读取本地存储的帖子并渲染
        let posts = JSON.parse(localStorage.getItem('wa_posts')) || [];
        
        function renderPosts() {
            waFeed.innerHTML = '';
            posts.forEach((post, index) => {
                const postDiv = document.createElement('div');
                postDiv.className = 'wa-post';
                
                // 【修改】：右上角变成三个点，内置下拉菜单
                let postHTML = `
                    <div class="wa-post-header" style="display: flex; justify-content: space-between; align-items: center; position: relative;">
                        <span><i class="fa-regular fa-clock"></i> ${post.time} &nbsp;|&nbsp; 字数: ${post.wordCount}</span>
                        <div class="wa-more-options">
                            <button class="wa-more-btn" onclick="toggleMenu('post-menu-${index}')"><i class="fa-solid fa-ellipsis"></i></button>
                            <div id="post-menu-${index}" class="wa-dropdown-menu">
                                <button class="wa-delete-btn" onclick="showCustomConfirm('post', ${index})"><i class="fa-solid fa-trash-can"></i> 删除流水账</button>
                            </div>
                        </div>
                    </div>
                    <div class="wa-post-content">${post.content}</div>
                `;
                
                if (post.image) {
                    postHTML += `<img src="${post.image}" class="wa-post-image" alt="流水账配图">`;
                }
                
                // 【修改】：评论右侧也变成三个点
                let commentsHTML = `<div class="wa-comments">`;
                if (post.comments && post.comments.length > 0) {
                    post.comments.forEach((c, cIndex) => {
                        commentsHTML += `
                        <div class="wa-comment-item" style="display: flex; justify-content: space-between; align-items: center; position: relative;">
                            <span>💬 ${c.text} <span class="wa-comment-time">${c.time}</span></span>
                            <div class="wa-more-options">
                                <button class="wa-more-btn" onclick="toggleMenu('comment-menu-${index}-${cIndex}')"><i class="fa-solid fa-ellipsis"></i></button>
                                <div id="comment-menu-${index}-${cIndex}" class="wa-dropdown-menu">
                                    <button class="wa-delete-btn" onclick="showCustomConfirm('comment', ${index}, ${cIndex})"><i class="fa-solid fa-trash-can"></i> 删除评论</button>
                                </div>
                            </div>
                        </div>`;
                    });
                }
                commentsHTML += `
                        <div class="wa-comment-input-box">
                            <input type="text" class="wa-comment-input" placeholder="写下评论..." id="comment-input-${index}">
                            <button class="wa-comment-btn" onclick="addComment(${index})">提交</button>
                        </div>
                    </div>
                `;
                
                postDiv.innerHTML = postHTML + commentsHTML;
                waFeed.appendChild(postDiv);
            });
        }
        
        renderPosts();

        // [发布和评论的逻辑保持不变]
        waSubmitBtn.addEventListener('click', () => { /* 你的原代码 */
            const content = waTextarea.value.trim();
            if (content === '' && !currentImageBase64) { alert('写点什么或者发张图吧！'); return; }
            posts.unshift({ content: content, image: currentImageBase64, time: waCurrentTime.innerText, wordCount: content.length, comments: [] }); 
            localStorage.setItem('wa_posts', JSON.stringify(posts)); 
            waTextarea.value = ''; waWordCount.innerText = '0'; waRemoveImage.click(); renderPosts();
        });
        window.addComment = function(postIndex) { /* 你的原代码 */
            const inputEle = document.getElementById(`comment-input-${postIndex}`);
            const text = inputEle.value.trim();
            if (text === '') return;
            const now = new Date();
            const timeStr = String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
            posts[postIndex].comments.push({ text: text, time: timeStr });
            localStorage.setItem('wa_posts', JSON.stringify(posts)); renderPosts();
        };

        // ================= 【新增】交互与弹窗逻辑 =================
        // 控制下拉菜单的显示与隐藏
        window.toggleMenu = function(menuId) {
            // 先关掉页面上所有打开的菜单
            document.querySelectorAll('.wa-dropdown-menu').forEach(menu => {
                if (menu.id !== menuId) menu.classList.remove('show');
            });
            // 切换当前点击的菜单
            document.getElementById(menuId).classList.toggle('show');
        };

        // 点击空白处，自动收起下拉菜单
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.wa-more-options')) {
                document.querySelectorAll('.wa-dropdown-menu').forEach(menu => menu.classList.remove('show'));
            }
        });

        // 弹窗相关元素
        const customModal = document.getElementById('custom-confirm-modal');
        const customModalMsg = document.getElementById('anime-modal-msg');
        let pendingDeleteData = null; // 临时存储要删除的目标信息

        // 唤起自定义弹窗
        window.showCustomConfirm = function(type, postIndex, commentIndex = -1) {
            pendingDeleteData = { type, postIndex, commentIndex };
            // 根据删除类型，显示不同的卖萌文案
            if(type === 'post') {
                customModalMsg.innerText = "真的要删掉这条流水账吗？记忆就找不回啦~ (。>︿<)";
            } else {
                customModalMsg.innerText = "这条评论不想要了吗？确认删除嘛？(；′⌒`)";
            }
            customModal.classList.add('show');
            document.querySelectorAll('.wa-dropdown-menu').forEach(m => m.classList.remove('show')); // 关掉菜单
        };

        // 点击弹窗的“取消”
        document.getElementById('modal-cancel-btn').addEventListener('click', () => {
            customModal.classList.remove('show');
            pendingDeleteData = null;
        });

        // 点击弹窗的“确定”
        document.getElementById('modal-confirm-btn').addEventListener('click', () => {
            if (!pendingDeleteData) return;
            
            if (pendingDeleteData.type === 'post') {
                posts.splice(pendingDeleteData.postIndex, 1);
            } else if (pendingDeleteData.type === 'comment') {
                posts[pendingDeleteData.postIndex].comments.splice(pendingDeleteData.commentIndex, 1);
            }
            
            localStorage.setItem('wa_posts', JSON.stringify(posts));
            renderPosts();
            customModal.classList.remove('show'); // 关掉弹窗
            pendingDeleteData = null;
        });
    }
    // ================= 模块末尾：全局 FPS 帧率监测 =================
    const fpsBox = document.getElementById('fps-box');
    
    if (fpsBox) {
        let lastTime = performance.now();
        let frameCount = 0;

        function calculateFPS(currentTime) {
            frameCount++;
            const deltaTime = currentTime - lastTime;
            
            // 每 1000 毫秒（1秒）更新一次显示的数据，避免跳动太快看不清
            if (deltaTime >= 1000) { 
                const fps = Math.round((frameCount * 1000) / deltaTime);
                
                // 根据帧率自动换可爱的颜文字
                let face = "✨ (≧∇≦)ﾉ"; // 流畅
                if (fps < 30) {
                    face = "💦 (；′⌒`)"; // 卡顿
                } else if (fps < 50) {
                    face = "⭐ (・ω・)"; // 一般
                }
                
                fpsBox.innerText = `FPS: ${fps} ${face}`;
                // 找到 fpsBox.innerText 那一行，改成下面这样（带个名字更有归属感）
                //fpsBox.innerHTML = `Blue Rose Archive | <span id="fps-num"></span> FPS ${fps} ${face}`;
                
                // 重置计数器，开始下一秒的计算
                frameCount = 0;
                lastTime = currentTime;
            }
            // 让浏览器在下一次重绘时再次调用这个函数，形成无限循环
            requestAnimationFrame(calculateFPS);
        }
        
        // 启动帧率计算
        requestAnimationFrame(calculateFPS);
    }

   // ================= 模块五：课表与 DDL 专属逻辑 =================
   // ================= 模块五：课表与 DDL 专属逻辑 =================
   // ================= 模块五：课表与 DDL 专属逻辑 =================
   // ================= 模块五：课表与 DDL 专属逻辑 =================
   // ================= 模块五：课表与 DDL 专属逻辑 =================

    const scheduleGrid = document.getElementById('schedule-grid');
    
    if (scheduleGrid) {
        const courseColors = ['#fff0f1', '#e0f7fa', '#f3e5f5', '#fff9c4', '#ffe0b2', '#e8f5e9'];
        
        let courses = JSON.parse(localStorage.getItem('my_courses'));
        if (!courses) {
            courses = [
                { id: 1, startWeek: 1, endWeek: 16, weekType: 'all', day: 2, start: 2, end: 4, name: '人工智能工程基础(四)', room: '仙II-310', colorIndex: 1 },
                { id: 2, startWeek: 1, endWeek: 16, weekType: 'all', day: 3, start: 2, end: 4, name: '智能机器人创新实践', room: '基础实验楼', colorIndex: 2 },
                { id: 3, startWeek: 1, endWeek: 16, weekType: 'all', day: 4, start: 3, end: 4, name: '数字信号处理', room: '仙I-320', colorIndex: 4 },
                { id: 4, startWeek: 1, endWeek: 16, weekType: 'all', day: 1, start: 5, end: 7, name: '概率论与随机过程', room: '仙II-122', colorIndex: 3 },
                { id: 5, startWeek: 1, endWeek: 16, weekType: 'all', day: 2, start: 5, end: 6, name: '操作系统与Linux', room: '仙II-306', colorIndex: 5 },
                { id: 6, startWeek: 1, endWeek: 16, weekType: 'all', day: 3, start: 5, end: 6, name: '数学物理方法', room: '仙I-319', colorIndex: 0 }
            ];
            localStorage.setItem('my_courses', JSON.stringify(courses));
        }

        let currentWeek = 4; 
        const termStartDate = new Date('2026-03-02'); 

        window.changeWeek = function(delta) {
            currentWeek += delta;
            if (currentWeek < 1) currentWeek = 1; 
            if (currentWeek > 25) currentWeek = 25; 
            
            const start = new Date(termStartDate);
            start.setDate(start.getDate() + (currentWeek - 1) * 7);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            
            const formatStr = (d) => String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0');
            
            // 【核心修改】：判定是否进入假期 (第19周刚好是 07/06)
            let weekTitle = `第 ${currentWeek} 周`;
            if (currentWeek >= 19) {
                weekTitle = `🏝️ 假期中`;
            }
            
            document.getElementById('week-display').innerText = `${weekTitle} (${formatStr(start)} - ${formatStr(end)})`;
            renderSchedule(); 
        }

        function renderSchedule() {
            scheduleGrid.innerHTML = '';
            
            const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            days.forEach((d, index) => {
                const header = document.createElement('div');
                header.className = 'grid-cell grid-header';
                header.innerText = d;
                header.style.gridColumn = index + 1;
                header.style.gridRow = 1;
                scheduleGrid.appendChild(header);
            });

            const timeSlots = [
                "08:00-08:50", "09:00-09:50", "10:10-11:00", "11:10-12:00",
                "14:00-14:50", "15:00-15:50", "16:10-17:00", "17:10-18:00",
                "18:30-19:20", "19:30-20:20", "20:30-21:20", "21:30-22:20"
            ];

            for (let r = 1; r <= 12; r++) {
                const timeCell = document.createElement('div');
                timeCell.className = 'grid-cell time-col';
                timeCell.innerHTML = `
                    <span style="font-weight: bold; font-size: 12px; color: var(--text-main);">第${r}节</span>
                    <span style="font-size: 9px; opacity: 0.6; margin-top: 2px;">${timeSlots[r-1]}</span>
                `;
                timeCell.style.gridColumn = 1;
                timeCell.style.gridRow = r + 1;
                scheduleGrid.appendChild(timeCell);

                for (let c = 1; c <= 7; c++) {
                    const emptyCell = document.createElement('div');
                    emptyCell.className = 'grid-cell';
                    emptyCell.style.gridColumn = c + 1;
                    emptyCell.style.gridRow = r + 1;
                    emptyCell.style.cursor = 'pointer';
                    emptyCell.onclick = () => openCourseModal(null, c, r);
                    scheduleGrid.appendChild(emptyCell);
                }
            }

            // 【核心修改】：单双周与有效周次的三重过滤
            const activeCourses = courses.filter(c => {
                // 1. 判断是否在设定的起始到结束周内
                const inRange = currentWeek >= (c.startWeek || 1) && currentWeek <= (c.endWeek || 16);
                if (!inRange) return false;
                
                // 2. 判断单双周
                const type = c.weekType || 'all';
                if (type === 'odd' && currentWeek % 2 === 0) return false; // 单周课，当前是双周，不显示
                if (type === 'even' && currentWeek % 2 !== 0) return false; // 双周课，当前是单周，不显示
                
                return true;
            });

            activeCourses.forEach(course => {
                const card = document.createElement('div');
                card.className = 'course-card';
                card.style.backgroundColor = courseColors[course.colorIndex % courseColors.length];
                card.style.gridColumn = course.day + 1;
                card.style.gridRow = `${course.start + 1} / ${course.end + 2}`;
                
                // 如果是单双周课，在名字后面加个小提示
                let weekHint = '';
                if (course.weekType === 'odd') weekHint = '<br><span style="font-size:10px; opacity:0.7;">(单周)</span>';
                if (course.weekType === 'even') weekHint = '<br><span style="font-size:10px; opacity:0.7;">(双周)</span>';

                card.innerHTML = `<div class="course-name">${course.name}${weekHint}</div><div class="course-room">${course.room}</div>`;
                
                card.onclick = (e) => {
                    e.stopPropagation(); 
                    openCourseModal(course);
                };
                scheduleGrid.appendChild(card);
            });
        }

        const courseModal = document.getElementById('course-modal');
        let currentEditId = null;

        window.openCourseModal = function(course = null, defaultDay = 1, defaultStart = 1) {
            if (course) {
                document.getElementById('course-edit-id').value = course.id;
                document.getElementById('course-start-week').value = course.startWeek || 1;
                document.getElementById('course-end-week').value = course.endWeek || 16;
                document.getElementById('course-week-type').value = course.weekType || 'all'; // 读取单双周
                document.getElementById('course-day').value = course.day;
                document.getElementById('course-start').value = course.start;
                document.getElementById('course-end').value = course.end;
                document.getElementById('course-name').value = course.name;
                document.getElementById('course-room').value = course.room;
                currentEditId = course.id;
            } else {
                document.getElementById('course-edit-id').value = '';
                document.getElementById('course-start-week').value = 1;
                document.getElementById('course-end-week').value = 16;
                document.getElementById('course-week-type').value = 'all'; // 默认全周
                document.getElementById('course-day').value = defaultDay;
                document.getElementById('course-start').value = defaultStart;
                document.getElementById('course-end').value = defaultStart + 1 > 12 ? 12 : defaultStart + 1; 
                document.getElementById('course-name').value = '';
                document.getElementById('course-room').value = '';
                currentEditId = null;
            }
            courseModal.classList.add('show');
        }

        window.closeCourseModal = function() { courseModal.classList.remove('show'); }

        window.saveCourse = function() {
            const startWeek = parseInt(document.getElementById('course-start-week').value);
            const endWeek = parseInt(document.getElementById('course-end-week').value);
            const weekType = document.getElementById('course-week-type').value; // 保存单双周
            const day = parseInt(document.getElementById('course-day').value);
            const start = parseInt(document.getElementById('course-start').value);
            const end = parseInt(document.getElementById('course-end').value);
            const name = document.getElementById('course-name').value.trim();
            const room = document.getElementById('course-room').value.trim();

            if (!name) { alert('课程名称不能为空！'); return; }
            if (start > end) { alert('结束节次不能早于开始节次哦！'); return; }
            if (startWeek > endWeek) { alert('结束周不能早于开始周哦！'); return; }

            if (currentEditId) {
                const index = courses.findIndex(c => c.id === currentEditId);
                if (index > -1) {
                    courses[index].startWeek = startWeek;
                    courses[index].endWeek = endWeek;
                    courses[index].weekType = weekType;
                    courses[index].day = day; 
                    courses[index].start = start;
                    courses[index].end = end;
                    courses[index].name = name;
                    courses[index].room = room;
                }
            } else {
                courses.push({
                    id: Date.now(), startWeek, endWeek, weekType, day, start, end, name, room,
                    colorIndex: Math.floor(Math.random() * courseColors.length)
                });
            }
            
            localStorage.setItem('my_courses', JSON.stringify(courses));
            closeCourseModal();
            renderSchedule();
        }

        window.deleteCourse = function() {
            if (currentEditId && confirm('确定要删除这节课吗？')) {
                courses = courses.filter(c => c.id !== currentEditId);
                localStorage.setItem('my_courses', JSON.stringify(courses));
                closeCourseModal();
                renderSchedule();
            }
        }

        // ================= DDL 管理逻辑 =================
        const ddlTaskInput = document.getElementById('ddl-task-input');
        const ddlDateInput = document.getElementById('ddl-date-input');
        const ddlAddBtn = document.getElementById('ddl-add-btn');
        const ddlList = document.getElementById('ddl-list');

        let ddls = JSON.parse(localStorage.getItem('my_ddls')) || [];

        function renderDDLs() {
            ddlList.innerHTML = '';
            ddls.sort((a, b) => new Date(a.date) - new Date(b.date));

            ddls.forEach((ddl, index) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); 
                const targetDate = new Date(ddl.date);
                
                const diffTime = targetDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let badgeClass = 'badge-safe';
                let statusText = `剩 ${diffDays} 天`;

                if (diffDays < 0) {
                    badgeClass = 'badge-urgent';
                    statusText = '已逾期';
                } else if (diffDays === 0) {
                    badgeClass = 'badge-urgent';
                    statusText = '就在今天!';
                } else if (diffDays <= 3) {
                    badgeClass = 'badge-urgent';
                } else if (diffDays <= 7) {
                    badgeClass = 'badge-warning';
                }

                const item = document.createElement('div');
                item.className = 'ddl-item';
                item.style.borderLeftColor = diffDays <= 3 ? '#ff7675' : (diffDays <= 7 ? '#fdcb6e' : '#74b9ff');
                
                item.innerHTML = `
                    <div style="flex-grow: 1;">
                        <span class="ddl-task">${ddl.task}</span>
                        <span class="ddl-date"><i class="fa-regular fa-calendar"></i> ${ddl.date}</span>
                    </div>
                    <span class="ddl-badge ${badgeClass}">${statusText}</span>
                    <button class="wa-delete-btn" onclick="confirmCompleteDDL(${index})" style="margin-left: 15px;" title="完成/删除"><i class="fa-solid fa-check"></i></button>
                `;
                ddlList.appendChild(item);
            });
        }

        ddlAddBtn.addEventListener('click', () => {
            const task = ddlTaskInput.value.trim();
            const date = ddlDateInput.value;
            if (!task || !date) { alert('任务名称和截止日期都要填哦！'); return; }
            
            ddls.push({ task, date });
            localStorage.setItem('my_ddls', JSON.stringify(ddls));
            ddlTaskInput.value = ''; ddlDateInput.value = '';
            renderDDLs();
        });

        const ddlConfirmModal = document.getElementById('ddl-confirm-modal');
        let pendingDDLIndex = null;

        window.confirmCompleteDDL = function(index) {
            pendingDDLIndex = index;
            ddlConfirmModal.classList.add('show');
        }

        document.getElementById('ddl-cancel-btn').addEventListener('click', () => {
            ddlConfirmModal.classList.remove('show');
            pendingDDLIndex = null;
        });

        document.getElementById('ddl-confirm-btn').addEventListener('click', () => {
            if (pendingDDLIndex !== null) {
                ddls.splice(pendingDDLIndex, 1);
                localStorage.setItem('my_ddls', JSON.stringify(ddls));
                renderDDLs(); 
                ddlConfirmModal.classList.remove('show'); 
                pendingDDLIndex = null;
            }
        });

        changeWeek(0); // 这个会让网页加载时自动计算并显示日期
        renderDDLs(); 
    }

    // ================= 模块六：时光备忘录专属逻辑 =================
    // ================= 模块六：时光备忘录专属逻辑 =================
    // ================= 模块六：时光备忘录专属逻辑 =================
    // ================= 模块六：时光备忘录专属逻辑 =================
    // ================= 模块六：时光备忘录专属逻辑 =================
// ================= 模块六：时光备忘录专属逻辑 =================
    const remindList = document.getElementById('remind-list');
    
    if (remindList) {
        const remindTextInput = document.getElementById('remind-text');
        const remindTimeInput = document.getElementById('remind-time');
        const remindFileInput = document.getElementById('remind-file-input');
        const remindImgPreview = document.getElementById('remind-img-preview');
        const remindPreviewBox = document.getElementById('remind-img-preview-box');
        const remindSubmitBtn = document.getElementById('remind-submit-btn');
        const remindRemoveImgBtn = document.getElementById('remind-remove-img');

        let remindImageBase64 = null;
        let reminds = JSON.parse(localStorage.getItem('my_reminds')) || [];

        // 1. 图片预览逻辑
        remindFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    remindImageBase64 = event.target.result;
                    remindImgPreview.src = remindImageBase64;
                    remindPreviewBox.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        remindRemoveImgBtn.addEventListener('click', () => {
            remindImageBase64 = null;
            remindImgPreview.src = '';
            remindPreviewBox.style.display = 'none';
            remindFileInput.value = '';
        });

        // 2. 渲染卡片 HTML (包含三个点菜单)
        function renderReminds() {
            remindList.innerHTML = '';
            
            // 按时间先后排序
            reminds.sort((a, b) => new Date(a.targetTime) - new Date(b.targetTime));

            reminds.forEach((rmd, index) => {
                const card = document.createElement('div');
                card.className = 'remind-card';
                
                let imgHTML = '';
                if (rmd.image) {
                    imgHTML = `<img src="${rmd.image}" class="remind-card-img" alt="备忘配图">`;
                }

                card.innerHTML = `
                    ${imgHTML}
                    <div class="remind-card-content" style="position: relative;">
                        
                        <div class="wa-more-options" style="position: absolute; top: 15px; right: 15px;">
                            <button class="wa-more-btn" onclick="toggleRemindMenu('remind-menu-${index}')"><i class="fa-solid fa-ellipsis"></i></button>
                            <div id="remind-menu-${index}" class="wa-dropdown-menu">
                                <button class="wa-delete-btn" onclick="showRemindConfirm(${index})"><i class="fa-solid fa-trash-can"></i> 删除备忘</button>
                            </div>
                        </div>
                        
                        <div class="remind-card-text">${rmd.text}</div>
                        
                        <div class="countdown-row" data-target="${rmd.targetTime}" id="countdown-${index}">
                            计算中...
                        </div>
                    </div>
                `;
                remindList.appendChild(card);
            });
        }

        // 3. 发布备忘录
        remindSubmitBtn.addEventListener('click', () => {
            const text = remindTextInput.value.trim();
            const time = remindTimeInput.value;

            if (!text || !time) {
                alert('请填写备忘内容并选择目标时间哦！');
                return;
            }

            reminds.push({
                text: text,
                targetTime: time,
                image: remindImageBase64
            });

            localStorage.setItem('my_reminds', JSON.stringify(reminds));
            
            remindTextInput.value = '';
            remindTimeInput.value = '';
            remindRemoveImgBtn.click();
            
            renderReminds();
        });

        // 4. 下拉菜单与二次元弹窗逻辑
        window.toggleRemindMenu = function(menuId) {
            document.querySelectorAll('.remind-container .wa-dropdown-menu').forEach(menu => {
                if (menu.id !== menuId) menu.classList.remove('show');
            });
            document.getElementById(menuId).classList.toggle('show');
        };

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.wa-more-options')) {
                document.querySelectorAll('.remind-container .wa-dropdown-menu').forEach(menu => menu.classList.remove('show'));
            }
        });

        const remindConfirmModal = document.getElementById('remind-confirm-modal');
        let pendingRemindDeleteIndex = null;

        window.showRemindConfirm = function(index) {
            pendingRemindDeleteIndex = index;
            remindConfirmModal.classList.add('show');
            document.querySelectorAll('.remind-container .wa-dropdown-menu').forEach(m => m.classList.remove('show'));
        };

        document.getElementById('remind-modal-cancel').addEventListener('click', () => {
            remindConfirmModal.classList.remove('show');
            pendingRemindDeleteIndex = null;
        });

        document.getElementById('remind-modal-confirm').addEventListener('click', () => {
            if (pendingRemindDeleteIndex !== null) {
                reminds.splice(pendingRemindDeleteIndex, 1);
                localStorage.setItem('my_reminds', JSON.stringify(reminds));
                renderReminds();
                remindConfirmModal.classList.remove('show');
                pendingRemindDeleteIndex = null;
            }
        });

        renderReminds();

        // 5. 核心：每秒刷新一次页面上的所有倒计时
        setInterval(() => {
            const now = new Date().getTime();
            
            document.querySelectorAll('.countdown-row').forEach(container => {
                const targetStr = container.getAttribute('data-target');
                const targetDate = new Date(targetStr).getTime();
                const distance = targetDate - now;

                if (distance < 0) {
                    container.innerHTML = `<div class="time-finished">🎉 目标时间已到达！</div>`;
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                const fH = String(hours).padStart(2, '0');
                const fM = String(minutes).padStart(2, '0');
                const fS = String(seconds).padStart(2, '0');

                container.innerHTML = `
                    <div class="time-box"><span class="time-num">${days}</span><span class="time-label">DAYS</span></div>
                    <span style="font-size: 24px; color: var(--theme-pink); font-weight: bold;">:</span>
                    <div class="time-box"><span class="time-num">${fH}</span><span class="time-label">HOURS</span></div>
                    <span style="font-size: 24px; color: var(--theme-pink); font-weight: bold;">:</span>
                    <div class="time-box"><span class="time-num">${fM}</span><span class="time-label">MINS</span></div>
                    <span style="font-size: 24px; color: var(--theme-pink); font-weight: bold;">:</span>
                    <div class="time-box"><span class="time-num">${fS}</span><span class="time-label">SECS</span></div>
                `;
            });
        }, 1000);
    }

    // ================= 模块七：留言板 (left.html) 专属逻辑 =================
    // ================= 模块七：留言板 (left.html) 专属逻辑 =================
    // ================= 模块七：留言板 (left.html) 专属逻辑 =================
    // ================= 模块七：留言板 (left.html) 专属逻辑 =================
  // ================= 模块七：留言板 (left.html) 专属逻辑 =================
    const commentListEle = document.getElementById('comment-list');
    
    if (commentListEle) {
        const qqInput = document.getElementById('comment-qq');
        const nicknameInput = document.getElementById('comment-nickname');
        const textInput = document.getElementById('comment-text');
        const submitBtn = document.getElementById('comment-submit');
        const countEle = document.getElementById('comment-count');

        let comments = JSON.parse(localStorage.getItem('my_messages')) || [];

        // 获取设备小尾巴
        function getDeviceBadge() {
            const ua = navigator.userAgent;
            let browser = "Web"; let os = "PC";
            if (ua.includes("Edg")) browser = "Edge";
            else if (ua.includes("Chrome")) browser = "Chrome";
            else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

            if (ua.includes("Windows NT")) os = "Windows";
            else if (ua.includes("Mac OS")) os = "macOS";
            else if (ua.includes("Android")) os = "Android";
            else if (ua.includes("iPhone")) os = "iOS";

            return `<span class="comment-os"><i class="fa-brands fa-${browser.toLowerCase()}"></i> ${browser}</span> 
                    <span class="comment-os"><i class="fa-brands fa-${os === 'Windows' ? 'windows' : (os === 'Android' ? 'android' : 'apple')}"></i> ${os}</span>`;
        }

        // 格式化时间
        function getNowStr() {
            const now = new Date();
            return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        }

        function renderComments() {
            commentListEle.innerHTML = '';
            countEle.innerText = comments.length; // 仅统计主留言数

            comments.forEach((cmt, index) => {
                const item = document.createElement('div');
                item.className = 'comment-item';
                
                // 头像逻辑：如果填了正确的QQ，抓取QQ头像，否则用随机萌系头像
                const isQQ = /^[1-9][0-9]{4,10}$/.test(cmt.qq);
                const avatarSrc = isQQ ? `https://q1.qlogo.cn/g?b=qq&nk=${cmt.qq}&s=100` : `https://api.dicebear.com/7.x/adventurer/svg?seed=${cmt.nickname}`;

                // 渲染回复列表
                let repliesHTML = '';
                if (cmt.replies && cmt.replies.length > 0) {
                    repliesHTML += `<div class="comment-replies">`;
                    cmt.replies.forEach((reply, rIndex) => {
                        repliesHTML += `
                            <div class="reply-item">
                                <span class="reply-author">${reply.nickname}:</span> 
                                <span style="color: var(--text-main);">${reply.text}</span>
                                <span style="color: #aaa; font-size: 11px; margin-left: 10px;">${reply.date}</span>
                                
                                <div class="wa-more-options" style="position: absolute; top: 10px; right: 10px;">
                                    <button class="wa-more-btn" style="padding: 0 5px;" onclick="toggleMsgMenu('reply-menu-${index}-${rIndex}')"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                                    <div id="reply-menu-${index}-${rIndex}" class="wa-dropdown-menu">
                                        <button class="wa-delete-btn" onclick="showCommentConfirm('reply', ${index}, ${rIndex})"><i class="fa-solid fa-trash-can"></i> 删除回复</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    repliesHTML += `</div>`;
                }

                item.innerHTML = `
                    <div class="comment-avatar">
                        <img src="${avatarSrc}" alt="avatar">
                    </div>
                    <div class="comment-body" style="position: relative;">
                        <div class="comment-meta">
                            <span class="comment-author">${cmt.nickname}</span>
                            ${cmt.deviceBadge}
                            <div class="comment-date">${cmt.date}</div>
                        </div>
                        
                        <div class="wa-more-options" style="position: absolute; top: 0; right: 0;">
                            <button class="wa-more-btn" onclick="toggleMsgMenu('comment-menu-${index}')"><i class="fa-solid fa-ellipsis"></i></button>
                            <div id="comment-menu-${index}" class="wa-dropdown-menu">
                                <button class="wa-delete-btn" style="color: #74b9ff;" onclick="toggleReplyBox(${index})"><i class="fa-solid fa-reply"></i> 回复Ta</button>
                                <button class="wa-delete-btn" onclick="showCommentConfirm('comment', ${index})"><i class="fa-solid fa-trash-can"></i> 删除留言</button>
                            </div>
                        </div>

                        <div class="comment-content">${cmt.text}</div>
                        
                        ${repliesHTML}
                        
                        <div class="reply-input-box" id="reply-box-${index}">
                            <input type="text" id="reply-text-${index}" placeholder="回复 ${cmt.nickname} ...">
                            <button class="anime-btn confirm" style="padding: 0 15px; border-radius: 6px;" onclick="submitReply(${index})">发送</button>
                        </div>
                    </div>
                `;
                commentListEle.appendChild(item);
            });
        }

        // 提交主留言
        submitBtn.addEventListener('click', () => {
            const nickname = nicknameInput.value.trim();
            const qq = qqInput.value.trim();
            const text = textInput.value.trim();

            if (!nickname || !text) { alert('昵称和想说的话都是必填的哦！'); return; }

            comments.unshift({
                nickname: nickname,
                qq: qq,
                text: text,
                date: getNowStr(),
                deviceBadge: getDeviceBadge(),
                replies: []
            });

            localStorage.setItem('my_messages', JSON.stringify(comments));
            textInput.value = ''; 
            renderComments();
        });

        // 提交回复
        window.submitReply = function(index) {
            const textInput = document.getElementById(`reply-text-${index}`);
            const text = textInput.value.trim();
            // 回复者默认使用顶部填写的昵称，如果没填则提示
            const replierName = document.getElementById('comment-nickname').value.trim();

            if (!text) { alert('回复内容不能为空！'); return; }
            if (!replierName) { alert('请先在最上方的输入框填好你的【发言昵称】再进行回复哦！'); return; }

            if (!comments[index].replies) comments[index].replies = [];
            
            comments[index].replies.push({
                nickname: replierName,
                text: text,
                date: getNowStr()
            });

            localStorage.setItem('my_messages', JSON.stringify(comments));
            renderComments();
        };

        // UI 交互控制
        window.toggleMsgMenu = function(menuId) {
            document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(menu => {
                if (menu.id !== menuId) menu.classList.remove('show');
            });
            document.getElementById(menuId).classList.toggle('show');
        };
        
        window.toggleReplyBox = function(index) {
            document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(m => m.classList.remove('show'));
            document.getElementById(`reply-box-${index}`).classList.toggle('show');
        };

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.wa-more-options')) {
                document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(menu => menu.classList.remove('show'));
            }
        });

        // 二次元弹窗删除逻辑
        const commentModal = document.getElementById('comment-confirm-modal');
        const commentModalMsg = document.getElementById('comment-modal-msg');
        let pendingDel = null; // 存储要删除的类型和索引

        window.showCommentConfirm = function(type, cIndex, rIndex = -1) {
            pendingDel = { type, cIndex, rIndex };
            commentModalMsg.innerText = type === 'comment' ? "确定要抹去这条留言的记忆吗？(。>︿<)" : "要删掉这条回复吗？";
            commentModal.classList.add('show');
            document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(m => m.classList.remove('show'));
        };

        document.getElementById('comment-modal-cancel').addEventListener('click', () => {
            commentModal.classList.remove('show');
            pendingDel = null;
        });

        document.getElementById('comment-modal-confirm').addEventListener('click', () => {
            if (!pendingDel) return;
            
            if (pendingDel.type === 'comment') {
                comments.splice(pendingDel.cIndex, 1);
            } else if (pendingDel.type === 'reply') {
                comments[pendingDel.cIndex].replies.splice(pendingDel.rIndex, 1);
            }
            
            localStorage.setItem('my_messages', JSON.stringify(comments));
            renderComments();
            commentModal.classList.remove('show');
            pendingDel = null;
        });

        renderComments();
    }

    // ================= 模块八：关于页面 (about.html) 专属逻辑 =================
    const runtimeEle = document.getElementById('site-runtime');
    
    if (runtimeEle) {
        // 设定建站时间：2024年01月27日 00:00:00
        const startDate = new Date('2026-02-22T18:20:45').getTime();

        function updateRuntime() {
            const now = new Date().getTime();
            const diff = now - startDate;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // 保持秒数是两位的排版，看起来更舒服
            const formattedSeconds = String(seconds).padStart(2, '0');

            runtimeEle.innerText = `${days} 天 ${hours} 小时 ${minutes} 分 ${formattedSeconds} 秒`;
            
            // 下一秒再执行
            requestAnimationFrame(updateRuntime);
        }

        // 启动计时器
        updateRuntime();
    }



});