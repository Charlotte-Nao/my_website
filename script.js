// 个人日记网站JavaScript代码
// 数据存储
let diaries = JSON.parse(localStorage.getItem('myDiaries')) || [];
let memos = JSON.parse(localStorage.getItem('myMemos')) || [];
let currentImages = [];

// DOM元素
const themeToggle = document.getElementById('themeToggle');
const clearAllBtn = document.getElementById('clearAllBtn');
const currentDateEl = document.getElementById('currentDate');
const diaryTitle = document.getElementById('diaryTitle');
const diaryContent = document.getElementById('diaryContent');
const imageUploadArea = document.getElementById('imageUploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const saveDiaryBtn = document.getElementById('saveDiaryBtn');
const memoInput = document.getElementById('memoInput');
const memoList = document.getElementById('memoList');
const diaryList = document.getElementById('diaryList');
const imageGallery = document.getElementById('imageGallery');
const imageCount = document.getElementById('imageCount');
const totalDiaries = document.getElementById('totalDiaries');
const totalImages = document.getElementById('totalImages');
const totalMemos = document.getElementById('totalMemos');
const imageModal = document.getElementById('imageModal');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalInfo = document.getElementById('modalInfo');

// 初始化
function init() {
    updateCurrentDate();
    renderDiaries();
    renderMemos();
    renderImageGallery();
    updateStats();
    
    // 事件监听
    themeToggle.addEventListener('click', toggleTheme);
    clearAllBtn.addEventListener('click', clearAllData);
    saveDiaryBtn.addEventListener('click', saveDiary);
    imageUploadArea.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageUpload);
    closeModal.addEventListener('click', () => imageModal.style.display = 'none');
    
    // 备忘录输入框回车键
    memoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addMemo();
        }
    });
    
    // 拖拽上传
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.style.borderColor = 'var(--primary)';
    });
    
    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.style.borderColor = '';
    });
    
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.style.borderColor = '';
        if (e.dataTransfer.files.length) {
            imageInput.files = e.dataTransfer.files;
            handleImageUpload();
        }
    });
    
    // 点击模态框外部关闭
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
        }
    });
}

// 更新当前日期
function updateCurrentDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    currentDateEl.textContent = dateStr;
}

// 切换主题
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.className = 'fas fa-sun';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> 切换主题';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> 切换主题';
    }
}

// 处理图片上传
function handleImageUpload() {
    const files = imageInput.files;
    currentImages = [];
    imagePreview.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            currentImages.push(e.target.result);
            
            // 创建预览
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = '预览图片';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-img';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = function() {
                previewItem.remove();
                const index = currentImages.indexOf(e.target.result);
                if (index > -1) currentImages.splice(index, 1);
            };
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            imagePreview.appendChild(previewItem);
        };
        
        reader.readAsDataURL(file);
    }
}

// 保存日记
function saveDiary() {
    const title = diaryTitle.value.trim();
    const content = diaryContent.value.trim();
    
    if (!title && !content) {
        alert('请至少填写标题或内容');
        return;
    }
    
    const diary = {
        id: Date.now(),
        title: title || '无标题日记',
        content,
        images: [...currentImages],
        date: new Date().toLocaleString('zh-CN')
    };
    
    diaries.unshift(diary); // 添加到开头
    localStorage.setItem('myDiaries', JSON.stringify(diaries));
    
    // 清空表单
    diaryTitle.value = '';
    diaryContent.value = '';
    currentImages = [];
    imagePreview.innerHTML = '';
    imageInput.value = '';
    
    // 更新显示
    renderDiaries();
    renderImageGallery();
    updateStats();
    
    alert('日记保存成功！');
}

// 渲染日记列表
function renderDiaries() {
    diaryList.innerHTML = '';
    
    if (diaries.length === 0) {
        diaryList.innerHTML = '<p style="text-align: center; color: var(--gray);">还没有日记，开始记录吧！</p>';
        return;
    }
    
    diaries.forEach(diary => {
        const diaryItem = document.createElement('div');
        diaryItem.className = 'diary-item';
        diaryItem.dataset.id = diary.id;
        
        let imagesHtml = '';
        if (diary.images && diary.images.length > 0) {
            imagesHtml = '<div style="display: flex; gap: 5px; margin-top: 10px;">';
            diary.images.forEach((img, index) => {
                imagesHtml += `<img src="${img}" alt="日记图片" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; cursor: pointer;" onclick="viewImage('${img}', '${diary.title}')">`;
            });
            imagesHtml += '</div>';
        }
        
        diaryItem.innerHTML = `
            <div class="diary-header">
                <div class="diary-title">${diary.title}</div>
                <div class="diary-date">${diary.date}</div>
            </div>
            <div class="diary-content">${diary.content || '（无内容）'}</div>
            ${imagesHtml}
            <div class="diary-actions">
                <button class="action-btn edit-btn" onclick="editDiary(${diary.id})">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="action-btn delete-btn" onclick="deleteDiary(${diary.id})">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        `;
        
        diaryList.appendChild(diaryItem);
    });
}

// 编辑日记
function editDiary(id) {
    const diary = diaries.find(d => d.id === id);
    if (!diary) return;
    
    diaryTitle.value = diary.title;
    diaryContent.value = diary.content;
    currentImages = [...diary.images];
    
    // 更新预览
    imagePreview.innerHTML = '';
    currentImages.forEach(img => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        const imgEl = document.createElement('img');
        imgEl.src = img;
        imgEl.alt = '预览图片';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-img';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = function() {
            previewItem.remove();
            const index = currentImages.indexOf(img);
            if (index > -1) currentImages.splice(index, 1);
        };
        
        previewItem.appendChild(imgEl);
        previewItem.appendChild(removeBtn);
        imagePreview.appendChild(previewItem);
    });
    
    // 删除原日记
    deleteDiary(id, false);
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 删除日记
function deleteDiary(id, confirm = true) {
    if (confirm && !window.confirm('确定要删除这篇日记吗？')) return;
    
    diaries = diaries.filter(d => d.id !== id);
    localStorage.setItem('myDiaries', JSON.stringify(diaries));
    renderDiaries();
    renderImageGallery();
    updateStats();
}

// 添加备忘录
function addMemo() {
    const text = memoInput.value.trim();
    if (!text) return;
    
    const memo = {
        id: Date.now(),
        text,
        completed: false,
        date: new Date().toLocaleDateString('zh-CN')
    };
    
    memos.unshift(memo);
    localStorage.setItem('myMemos', JSON.stringify(memos));
    memoInput.value = '';
    renderMemos();
    updateStats();
}

// 渲染备忘录
function renderMemos() {
    memoList.innerHTML = '';
    
    if (memos.length === 0) {
        memoList.innerHTML = '<p style="text-align: center; color: var(--gray);">还没有备忘录</p>';
        return;
    }
    
    memos.forEach(memo => {
        const memoItem = document.createElement('li');
        memoItem.className = 'memo-item';
        
        memoItem.innerHTML = `
            <input type="checkbox" class="memo-checkbox" ${memo.completed ? 'checked' : ''} onchange="toggleMemo(${memo.id})">
            <span class="memo-text ${memo.completed ? 'completed' : ''}">${memo.text}</span>
            <span style="font-size: 0.8rem; color: var(--gray); margin-left: auto;">${memo.date}</span>
            <button style="background: none; border: none; color: var(--danger); margin-left: 10px; cursor: pointer;" onclick="deleteMemo(${memo.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        memoList.appendChild(memoItem);
    });
}

// 切换备忘录完成状态
function toggleMemo(id) {
    const memo = memos.find(m => m.id === id);
    if (memo) {
        memo.completed = !memo.completed;
        localStorage.setItem('myMemos', JSON.stringify(memos));
        renderMemos();
        updateStats();
    }
}

// 删除备忘录
function deleteMemo(id) {
    memos = memos.filter(m => m.id !== id);
    localStorage.setItem('myMemos', JSON.stringify(memos));
    renderMemos();
    updateStats();
}

// 渲染图片库
function renderImageGallery() {
    imageGallery.innerHTML = '';
    
    let allImages = [];
    diaries.forEach(diary => {
        if (diary.images && diary.images.length > 0) {
            diary.images.forEach(img => {
                allImages.push({
                    src: img,
                    title: diary.title,
                    date: diary.date
                });
            });
        }
    });
    
    imageCount.textContent = `${allImages.length} 张`;
    
    if (allImages.length === 0) {
        imageGallery.innerHTML = '<p style="text-align: center; color: var(--gray);">还没有图片</p>';
        return;
    }
    
    allImages.forEach(img => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.onclick = () => viewImage(img.src, img.title, img.date);
        
        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        imgEl.alt = '日记图片';
        
        galleryItem.appendChild(imgEl);
        imageGallery.appendChild(galleryItem);
    });
}

// 查看图片
function viewImage(src, title, date) {
    modalImage.src = src;
    modalInfo.innerHTML = `
        <p><strong>标题:</strong> ${title || '未命名'}</p>
        ${date ? `<p><strong>日期:</strong> ${date}</p>` : ''}
    `;
    imageModal.style.display = 'flex';
}

// 更新统计
function updateStats() {
    totalDiaries.textContent = diaries.length;
    
    let imageCount = 0;
    diaries.forEach(diary => {
        if (diary.images) imageCount += diary.images.length;
    });
    totalImages.textContent = imageCount;
    
    totalMemos.textContent = memos.length;
}

// 清空所有数据
function clearAllData() {
    if (!confirm('确定要清空所有数据吗？此操作不可撤销！')) return;
    
    diaries = [];
    memos = [];
    localStorage.removeItem('myDiaries');
    localStorage.removeItem('myMemos');
    
    renderDiaries();
    renderMemos();
    renderImageGallery();
    updateStats();
    
    alert('所有数据已清空');
}

// 将函数暴露到全局作用域，支持HTML内联事件调用
window.viewImage = viewImage;
window.editDiary = editDiary;
window.deleteDiary = deleteDiary;
window.toggleMemo = toggleMemo;
window.deleteMemo = deleteMemo;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);