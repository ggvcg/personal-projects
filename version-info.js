// 获取GitHub Release信息的函数
async function fetchReleaseInfo(repo) {
    try {
        // 添加时间戳避免缓存
        const timestamp = new Date().getTime();
        const response = await fetch(`https://api.github.com/repos/ggvcg/${repo}/releases/latest?_=${timestamp}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        const data = await response.json();
        
        // 如果API调用成功但没有返回数据
        if (!data || !data.tag_name) {
            console.log('API返回数据:', data);
            return {
                version: 'v1.0.0',
                updateTime: '2024-03-14'
            };
        }
        
        return {
            version: data.tag_name,
            updateTime: new Date(data.published_at).toLocaleDateString('zh-CN')
        };
    } catch (error) {
        console.error('获取版本信息失败:', error);
        return {
            version: 'v1.0.0',
            updateTime: '2024-03-14'
        };
    }
}

// 更新版本信息
async function updateVersionInfo() {
    try {
        // 更新轻量级浏览器版本信息
        const browserInfo = await fetchReleaseInfo('lite-browser');
        const browserVersionElements = document.querySelectorAll('.version-info[data-project="browser"]');
        browserVersionElements.forEach(element => {
            element.querySelector('.version').textContent = `当前版本: ${browserInfo.version}`;
            element.querySelector('.update-time').textContent = `更新时间: ${browserInfo.updateTime}`;
        });

        // 更新VIP视频解析工具版本信息
        const parserInfo = await fetchReleaseInfo('vip-video-parser');
        const parserVersionElements = document.querySelectorAll('.version-info[data-project="parser"]');
        parserVersionElements.forEach(element => {
            element.querySelector('.version').textContent = `当前版本: ${parserInfo.version}`;
            element.querySelector('.update-time').textContent = `更新时间: ${parserInfo.updateTime}`;
        });
    } catch (error) {
        console.error('更新版本信息失败:', error);
    }
}

// 页面加载完成后更新版本信息
document.addEventListener('DOMContentLoaded', updateVersionInfo);

// 每60秒自动刷新一次版本信息
setInterval(updateVersionInfo, 60000); 
