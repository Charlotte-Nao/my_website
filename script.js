// 当网页所有的 HTML 内容都加载完毕后，再执行里面的代码
document.addEventListener("DOMContentLoaded", () => {
    
    // ================= 模块一：侧边栏菜单点击弹窗 =================
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // 阻止 `<a>` 标签默认的跳转行为
            event.preventDefault(); 
            // 获取点击的菜单文字内容
            const menuName = event.target.innerText.trim();
            // 弹出一个提示框作为占位接口，后续这里可以换成实际的跳转代码
            alert(`【接口预留】你点击了侧边栏的：[ ${menuName} ] 模块\n后续这里可以接入具体的页面加载逻辑。`);
        });
    });

    // ================= 模块二：鼠标光彩拖尾 =================
    const colors = ['#ffb6c1', '#87cefa', '#dda0dd', '#98fb98', '#ffdab9']; // 拖尾的颜色池
    
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
        const particleCount = 12; // 每次点击产生的粒子数量
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            
            // 初始位置设定在鼠标点击的地方
            particle.style.left = e.pageX + 'px';
            particle.style.top = e.pageY + 'px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 计算粒子飞行的随机角度和距离
            const angle = Math.random() * Math.PI * 2; // 0 到 360 度
            const velocity = 30 + Math.random() * 50;  // 飞行距离 30px ~ 80px
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
    });

    // ================= 模块四：音乐播放器控制 =================
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false; // 记录播放状态

    musicBtn.addEventListener('click', () => {
        // 如果你的 audio 标签里没有写 src，这里先用弹窗代替
        if (!bgMusic.getAttribute('src')) {
            alert("【音乐模块提示】\n需要在 index.html 的 <audio> 标签中填入真实的 mp3 文件路径才能播放喔！");
            return;
        }

        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            // 这里可以加一个提示，比如换回静态图片
        } else {
            bgMusic.play();
            isPlaying = true;
            // 这里可以加一个提示，比如把亚丝娜的图片换成正在听歌的动图
        }
    });

    // ================= 模块五：左下角桌宠互动 =================
    const webPet = document.getElementById('web-pet');
    const petImg = document.getElementById('pet-img');
    const petDialog = document.getElementById('pet-dialog');
    let dialogTimer = null;

    // 1. 桌宠根据鼠标位置转身
    document.addEventListener('mousemove', (e) => {
        // 获取桌宠在屏幕上的水平中心点位置
        const petRect = petImg.getBoundingClientRect();
        const petCenterX = petRect.left + (petRect.width / 2);

        // 如果鼠标在桌宠的左边，让图片水平翻转；在右边则恢复正常
        if (e.clientX < petCenterX) {
            petImg.style.transform = 'scaleX(-1)';
        } else {
            petImg.style.transform = 'scaleX(1)';
        }
    });

    // 2. 点击桌宠弹出对话框
    webPet.addEventListener('click', (event) => {
        // 阻止事件冒泡，防止触发网页的通用点击烟花特效（如果你想点桌宠也出烟花，可以删掉这行）
        event.stopPropagation(); 

        const messages = [
            "哇，你终于回来了~",
            "今天也要开心哦！",
            "需要我帮你找些什么吗？",
            "不要一直盯着我看啦...",
            "LINK START!"
        ];
        
        // 随机抽取一句话显示
        petDialog.innerText = messages[Math.floor(Math.random() * messages.length)];
        petDialog.classList.add('show');
        
        // 每次点击重置定时器，让对话框显示 3 秒后消失
        clearTimeout(dialogTimer);
        dialogTimer = setTimeout(() => {
            petDialog.classList.remove('show');
        }, 3000);
    });

    // ================= 模块六：文章大图随机二次元番剧 =================
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
    
});