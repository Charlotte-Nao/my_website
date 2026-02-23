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

        function loadSong(index) {
            const song = songs[index];
            titleEle.innerText = song.title; artistEle.innerText = song.artist;
            coverImg.src = song.cover; audio.src = song.src;
            document.querySelectorAll('.playlist li').forEach((li, i) => { li.classList.toggle('active', i === index); });
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

//WA页面的初始化
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

    if (window.waClockTimer) clearInterval(window.waClockTimer); 
    window.waClockTimer = setInterval(() => {
        if(!document.getElementById('wa-current-time')) { clearInterval(window.waClockTimer); return; }
        const now = new Date();
        waCurrentTime.innerText = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    }, 1000);

    waTextarea.addEventListener('input', () => { waWordCount.innerText = waTextarea.value.length; });

    waImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentImageBase64 = event.target.result;
                waImagePreview.src = currentImageBase64;
                waPreviewContainer.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        }
    });

    waRemoveImage.addEventListener('click', () => {
        currentImageBase64 = null; waImagePreview.src = '';
        waPreviewContainer.style.display = 'none'; waImageInput.value = ''; 
    });

    let posts = JSON.parse(localStorage.getItem('wa_posts')) || [];
    
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
                        <span>💬 ${c.text} <span class="wa-comment-time">${c.time}</span></span>
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
                        <input type="text" class="wa-comment-input" placeholder="写下评论..." id="comment-input-${index}">
                        <button class="wa-comment-btn" onclick="addComment(${index})">提交</button>
                    </div></div>`;
            postDiv.innerHTML = postHTML + commentsHTML;
            waFeed.appendChild(postDiv);
        });
    }
    
    renderPosts();

    waSubmitBtn.addEventListener('click', () => { 
        const content = waTextarea.value.trim();
        if (content === '' && !currentImageBase64) { alert('写点什么或者发张图吧！'); return; }
        posts.unshift({ content: content, image: currentImageBase64, time: waCurrentTime.innerText, wordCount: content.length, comments: [] }); 
        localStorage.setItem('wa_posts', JSON.stringify(posts)); 
        waTextarea.value = ''; waWordCount.innerText = '0'; waRemoveImage.click(); renderPosts();
    });

    window.addComment = function(postIndex) { 
        const inputEle = document.getElementById(`comment-input-${postIndex}`);
        const text = inputEle.value.trim();
        if (text === '') return;
        const now = new Date();
        const timeStr = String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        posts[postIndex].comments.push({ text: text, time: timeStr });
        localStorage.setItem('wa_posts', JSON.stringify(posts)); renderPosts();
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
        if(type === 'post') customModalMsg.innerText = "真的要删掉这条记录吗？不可恢复哦~ (；′⌒`)";
        else customModalMsg.innerText = "真的要删掉这条记录吗？不可恢复哦~ (；′⌒`)";
        customModal.classList.add('show');
        document.querySelectorAll('.wa-dropdown-menu').forEach(m => m.classList.remove('show'));
    };

    document.getElementById('modal-cancel-btn').addEventListener('click', () => { customModal.classList.remove('show'); pendingDeleteData = null; });
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        if (!pendingDeleteData) return;
        if (pendingDeleteData.type === 'post') posts.splice(pendingDeleteData.postIndex, 1);
        else if (pendingDeleteData.type === 'comment') posts[pendingDeleteData.postIndex].comments.splice(pendingDeleteData.commentIndex, 1);
        localStorage.setItem('wa_posts', JSON.stringify(posts));
        renderPosts(); customModal.classList.remove('show'); pendingDeleteData = null;
    });
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


//课表页面初始化
function initScheduleAndDDL() {
    const scheduleGrid = document.getElementById('schedule-grid');
    if (!scheduleGrid) return;
    
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
    window.saveCourse = function() {
        const startWeek = parseInt(document.getElementById('course-start-week').value); const endWeek = parseInt(document.getElementById('course-end-week').value);
        const weekType = document.getElementById('course-week-type').value; const day = parseInt(document.getElementById('course-day').value);
        const start = parseInt(document.getElementById('course-start').value); const end = parseInt(document.getElementById('course-end').value);
        const name = document.getElementById('course-name').value.trim(); const room = document.getElementById('course-room').value.trim();
        if (!name) { alert('课程名称不能为空！'); return; } if (start > end || startWeek > endWeek) { alert('节次/周次错误！'); return; }
        if (currentEditId) {
            const index = courses.findIndex(c => c.id === currentEditId);
            if (index > -1) { courses[index].startWeek = startWeek; courses[index].endWeek = endWeek; courses[index].weekType = weekType; courses[index].day = day; courses[index].start = start; courses[index].end = end; courses[index].name = name; courses[index].room = room; }
        } else { courses.push({ id: Date.now(), startWeek, endWeek, weekType, day, start, end, name, room, colorIndex: Math.floor(Math.random() * courseColors.length) }); }
        localStorage.setItem('my_courses', JSON.stringify(courses)); closeCourseModal(); renderSchedule();
    }
    window.deleteCourse = function() {
        if (currentEditId && confirm('确定要删除这节课吗？')) { courses = courses.filter(c => c.id !== currentEditId); localStorage.setItem('my_courses', JSON.stringify(courses)); closeCourseModal(); renderSchedule(); }
    }

    const ddlTaskInput = document.getElementById('ddl-task-input'); const ddlDateInput = document.getElementById('ddl-date-input');
    const ddlAddBtn = document.getElementById('ddl-add-btn'); const ddlList = document.getElementById('ddl-list');
    let ddls = JSON.parse(localStorage.getItem('my_ddls')) || [];

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

    ddlAddBtn.addEventListener('click', () => {
        const task = ddlTaskInput.value.trim(); const date = ddlDateInput.value;
        if (!task || !date) { alert('任务和日期都要填！'); return; }
        ddls.push({ task, date }); localStorage.setItem('my_ddls', JSON.stringify(ddls)); ddlTaskInput.value = ''; ddlDateInput.value = ''; renderDDLs();
    });

    const ddlConfirmModal = document.getElementById('ddl-confirm-modal'); let pendingDDLIndex = null;
    window.confirmCompleteDDL = function(index) { pendingDDLIndex = index; ddlConfirmModal.classList.add('show'); }
    document.getElementById('ddl-cancel-btn').addEventListener('click', () => { ddlConfirmModal.classList.remove('show'); pendingDDLIndex = null; });
    document.getElementById('ddl-confirm-btn').addEventListener('click', () => {
        if (pendingDDLIndex !== null) { ddls.splice(pendingDDLIndex, 1); localStorage.setItem('my_ddls', JSON.stringify(ddls)); renderDDLs(); ddlConfirmModal.classList.remove('show'); pendingDDLIndex = null; }
    });
    changeWeek(0); renderDDLs(); 
}

//提醒模块的初始化
function initRemindModule() {
    const remindList = document.getElementById('remind-list');
    if (!remindList) return;
    
    const remindTextInput = document.getElementById('remind-text'); const remindTimeInput = document.getElementById('remind-time');
    const remindFileInput = document.getElementById('remind-file-input'); const remindImgPreview = document.getElementById('remind-img-preview');
    const remindPreviewBox = document.getElementById('remind-img-preview-box'); const remindSubmitBtn = document.getElementById('remind-submit-btn');
    const remindRemoveImgBtn = document.getElementById('remind-remove-img');
    let remindImageBase64 = null; let reminds = JSON.parse(localStorage.getItem('my_reminds')) || [];

    remindFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) { const reader = new FileReader(); reader.onload = (event) => { remindImageBase64 = event.target.result; remindImgPreview.src = remindImageBase64; remindPreviewBox.style.display = 'block'; }; reader.readAsDataURL(file); }
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

    remindSubmitBtn.addEventListener('click', () => {
        const text = remindTextInput.value.trim(); const time = remindTimeInput.value;
        if (!text || !time) { alert('填好内容和时间！'); return; }
        reminds.push({ text: text, targetTime: time, image: remindImageBase64 }); localStorage.setItem('my_reminds', JSON.stringify(reminds));
        remindTextInput.value = ''; remindTimeInput.value = ''; remindRemoveImgBtn.click(); renderReminds();
    });

    window.toggleRemindMenu = function(menuId) { document.querySelectorAll('.remind-container .wa-dropdown-menu').forEach(menu => { if (menu.id !== menuId) menu.classList.remove('show'); }); document.getElementById(menuId).classList.toggle('show'); };
    const remindConfirmModal = document.getElementById('remind-confirm-modal'); let pendingRemindDeleteIndex = null;
    window.showRemindConfirm = function(index) { pendingRemindDeleteIndex = index; remindConfirmModal.classList.add('show'); document.querySelectorAll('.remind-container .wa-dropdown-menu').forEach(m => m.classList.remove('show')); };
    document.getElementById('remind-modal-cancel').addEventListener('click', () => { remindConfirmModal.classList.remove('show'); pendingRemindDeleteIndex = null; });
    document.getElementById('remind-modal-confirm').addEventListener('click', () => { if (pendingRemindDeleteIndex !== null) { reminds.splice(pendingRemindDeleteIndex, 1); localStorage.setItem('my_reminds', JSON.stringify(reminds)); renderReminds(); remindConfirmModal.classList.remove('show'); pendingRemindDeleteIndex = null; } });

    renderReminds();
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


// 留言模块的初始化
function initMessageBoard() {
    const commentListEle = document.getElementById('comment-list');
    if (!commentListEle) return;

    const qqInput = document.getElementById('comment-qq'); const nicknameInput = document.getElementById('comment-nickname');
    const textInput = document.getElementById('comment-text'); const submitBtn = document.getElementById('comment-submit');
    const countEle = document.getElementById('comment-count'); let comments = JSON.parse(localStorage.getItem('my_messages')) || [];

    function getDeviceBadge() {
        const ua = navigator.userAgent; let browser = "Web"; let os = "PC";
        if (ua.includes("Edg")) browser = "Edge"; else if (ua.includes("Chrome")) browser = "Chrome"; else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        if (ua.includes("Windows NT")) os = "Windows"; else if (ua.includes("Mac OS")) os = "macOS"; else if (ua.includes("Android")) os = "Android"; else if (ua.includes("iPhone")) os = "iOS";
        return `<span class="comment-os"><i class="fa-brands fa-${browser.toLowerCase()}"></i> ${browser}</span> <span class="comment-os"><i class="fa-brands fa-${os === 'Windows' ? 'windows' : (os === 'Android' ? 'android' : 'apple')}"></i> ${os}</span>`;
    }

    function getNowStr() { const now = new Date(); return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'); }

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

    submitBtn.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim(); const qq = qqInput.value.trim(); const text = textInput.value.trim();
        if (!nickname || !text) { alert('昵称和想说的话都是必填的哦！'); return; }
        comments.unshift({ nickname, qq, text, date: getNowStr(), deviceBadge: getDeviceBadge(), replies: [] }); localStorage.setItem('my_messages', JSON.stringify(comments)); textInput.value = ''; renderComments();
    });

    window.submitReply = function(index) {
        const textInput = document.getElementById(`reply-text-${index}`); const text = textInput.value.trim(); const replierName = document.getElementById('comment-nickname').value.trim();
        if (!text || !replierName) { alert('回复内容和上方昵称不能为空！'); return; }
        if (!comments[index].replies) comments[index].replies = []; comments[index].replies.push({ nickname: replierName, text: text, date: getNowStr() }); localStorage.setItem('my_messages', JSON.stringify(comments)); renderComments();
    };

    window.toggleMsgMenu = function(menuId) { document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(menu => { if (menu.id !== menuId) menu.classList.remove('show'); }); document.getElementById(menuId).classList.toggle('show'); };
    window.toggleReplyBox = function(index) { document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(m => m.classList.remove('show')); document.getElementById(`reply-box-${index}`).classList.toggle('show'); };

    const commentModal = document.getElementById('comment-confirm-modal'); const commentModalMsg = document.getElementById('comment-modal-msg'); let pendingDel = null;
    window.showCommentConfirm = function(type, cIndex, rIndex = -1) { pendingDel = { type, cIndex, rIndex }; commentModalMsg.innerText = type === 'comment' ? "确定要抹去这条留言的记忆吗？(。>︿<)" : "要删掉这条回复吗？"; commentModal.classList.add('show'); document.querySelectorAll('.message-board-container .wa-dropdown-menu').forEach(m => m.classList.remove('show')); };
    document.getElementById('comment-modal-cancel').addEventListener('click', () => { commentModal.classList.remove('show'); pendingDel = null; });
    document.getElementById('comment-modal-confirm').addEventListener('click', () => { if (!pendingDel) return; if (pendingDel.type === 'comment') comments.splice(pendingDel.cIndex, 1); else if (pendingDel.type === 'reply') comments[pendingDel.cIndex].replies.splice(pendingDel.rIndex, 1); localStorage.setItem('my_messages', JSON.stringify(comments)); renderComments(); commentModal.classList.remove('show'); pendingDel = null; });
    renderComments();
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
    initRandomImage(); initWAModule(); initFPS(); initScheduleAndDDL(); initRemindModule(); initMessageBoard(); initAboutRuntime();
});

// 2. 无刷新跳转后重新唤醒模块
document.addEventListener('PjaxContentLoaded', () => {
    initRandomImage(); initWAModule(); initFPS(); initScheduleAndDDL(); initRemindModule(); initMessageBoard(); initAboutRuntime();
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

            const headDialogues = [
                "嘿嘿，今天也要一起努力哦！", "稍微有点害羞呢……不过，并不讨厌啦。", "怎么啦？突然这样摸人家的头……", "有什么开心的事吗？笑得这么灿烂。",
                "既然你这么闲的话，要不要来帮我做三明治？", "今天天气真好呢，要一起去第 22 层的森林散步吗？", "辛苦啦！先把剑放下，喝杯热茶休息一下吧。",
                "结衣刚才还在找你呢，不去陪陪她吗？", "摸头可是会让人长不高的！……不过，下不为例哦。", "嗯……这种感觉，很让人安心呢。",
                "每次看到你平安回来，我就彻底放心了。", "好啦好啦，乖孩子乖孩子~（笑）"
            ];
            const chestDialogues = [
                "呀！你在摸哪里啊，变态！", "再乱碰的话，我可要拔剑了哦！闪烁之光可不是吃素的！", "唔……你这算是性骚扰哦，小心我吃掉你的属性点！",
                "你、你这家伙！快把手拿开啦！", "系统警告！这里可是圈内（安全区），不要做奇怪的动作！", "就算在 SAO 里没有痛觉，这种行为也是绝对禁止的！",
                "副团长的威严都要被你破坏了啦！给我去墙角反省一下！", "信不信我用八连击的『星屑飞溅』把你打飞出艾恩葛朗特？", "……你再这样，明天的早餐就只有发硬的黑面包了哦！"
            ];
            const bodyDialogues = [
                "真是的，好好工作啦，不要老是发呆！", "就算你这样一直戳我，我也不会马上给你做料理的啦！", "阿嚏！……难道是有人在说我坏话？",
                "别闹了啦，马上就要到楼层 Boss 的攻略会议时间了！", "哎呀，戳那里有点痒啦~", "肚子饿了吗？我包里还有之前用杂烩兔做好的特级炖肉哦。",
                "不要一直盯着我看啦，我的 HP 又没掉。", "今天你的状态不错嘛，有没有去野外好好练级？", "喂喂，身为攻略组的一员，可不要在这种地方偷懒啊！",
                "武器耐久度还好吗？回城的时候记得去莉兹的店里修理一下哦。", "如果累了的话，就在长椅上稍微睡一会儿吧，我帮你看着系统警报。"
            ];

            live2dCanvas.addEventListener('click', (event) => {
                const rect = live2dCanvas.getBoundingClientRect(); const clickY = event.clientY - rect.top; const relativeY = clickY / rect.height; 
                let chosenIndex; let spokenText = "";

                if (relativeY < 0.45) { chosenIndex = headPool[Math.floor(Math.random() * headPool.length)]; spokenText = headDialogues[Math.floor(Math.random() * headDialogues.length)];
                } else if (relativeY >= 0.45 && relativeY < 0.65) { chosenIndex = motions.angry[Math.floor(Math.random() * motions.angry.length)]; spokenText = chestDialogues[Math.floor(Math.random() * chestDialogues.length)];
                } else { const otherBodyPool = [...motions.sad, ...motions.sneeze, ...motions.repeat]; chosenIndex = otherBodyPool[Math.floor(Math.random() * otherBodyPool.length)]; spokenText = bodyDialogues[Math.floor(Math.random() * bodyDialogues.length)]; }

                model.motion('', chosenIndex); dialogBox.innerHTML = spokenText;
                dialogBox.classList.remove('show'); void dialogBox.offsetWidth; dialogBox.classList.add('show');
                clearTimeout(dialogTimer); dialogTimer = setTimeout(() => { dialogBox.classList.remove('show'); }, 4500); 
            });
            console.log("🌸 亚丝娜已完美装载入无刷新底层系统！");
        }).catch(err => { console.error("❌ 模型加载失败:", err); });
    }
});