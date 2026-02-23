import os
from mutagen.mp3 import MP3
from mutagen.id3 import ID3

# 设定你的音乐文件夹名称
MUSIC_DIR = "music"
OUTPUT_JS = os.path.join(MUSIC_DIR, "playlist.js")

playlist = []
print("🎵 蓝蔷薇之匣 - 开始扫描音乐数据库...")

# 遍历 music 文件夹下所有的文件
for filename in os.listdir(MUSIC_DIR):
    if filename.lower().endswith(".mp3"):
        filepath = os.path.join(MUSIC_DIR, filename)
        
        # 默认信息（如果文件缺少标签信息，就用文件名兜底）
        title = filename[:-4]
        artist = "Unknown"
        cover_path = "https://picsum.photos/100?random=1" # 默认兜底封面
        
        try:
            audio = MP3(filepath, ID3=ID3)
            
            # 1. 提取歌名 (TIT2)
            if 'TIT2' in audio:
                title = audio['TIT2'].text[0]
                
            # 2. 提取歌手 (TPE1)
            if 'TPE1' in audio:
                artist = audio['TPE1'].text[0]
                
            # 3. 提取内置封面 (APIC)
            for tag in audio.keys():
                if tag.startswith('APIC'):
                    cover_data = audio[tag].data
                    # 把封面图片提取出来，保存为 "歌名_cover.jpg"
                    cover_filename = f"{filename[:-4]}_cover.jpg"
                    cover_filepath = os.path.join(MUSIC_DIR, cover_filename)
                    
                    # 写入图片文件
                    with open(cover_filepath, "wb") as img_file:
                        img_file.write(cover_data)
                    
                    # 记录这张图片的路径
                    cover_path = f"music/{cover_filename}"
                    break
                    
        except Exception as e:
            print(f"⚠️ 警告: 无法读取 {filename} 的信息 ({e})")

        # 将整理好的这首歌加入数据库
        playlist.append({
            "title": str(title).replace('"', "'"),
            "artist": str(artist).replace('"', "'"),
            "src": f"music/{filename}",
            "cover": cover_path
        })
        print(f"✅ 已载入: {title} - {artist}")

# 开始写入 playlist.js
print("\n📝 正在生成 playlist.js ...")
with open(OUTPUT_JS, "w", encoding="utf-8") as f:
    f.write("// Blue Rose System - 自动生成的全局歌单库\n")
    f.write("window.FLA_Playlist = [\n")
    for song in playlist:
        f.write("    {\n")
        f.write(f"        title: \"{song['title']}\",\n")
        f.write(f"        artist: \"{song['artist']}\",\n")
        f.write(f"        src: \"{song['src']}\",\n")
        f.write(f"        cover: \"{song['cover']}\"\n")
        f.write("    },\n")
    f.write("];\n")

print(f"🎉 伟大工程完成！成功为你提取了 {len(playlist)} 首歌和它们的封面！")