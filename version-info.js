// 获取GitHub Release信息的函数
async function fetchReleaseInfo(repo) {
    try {
        // 添加时间戳避免缓存
        const timestamp = new Date().getTime();
        // 获取所有releases而不是只获取latest
        const apiUrl = `https://api.github.com/repos/ggvcg/${repo}/releases?_=${timestamp}`;
        console.log('正在请求API:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const releases = await response.json();
        console.log('API返回数据:', releases);
        
        // 如果没有任何release
        if (!releases || releases.length === 0) {
            console.log('没有找到Release信息');
            return {
                version: 'v1.0.0',
                updateTime: '2024-03-14'
            };
        }
        
        // 获取第一个release（最新的）
        const latestRelease = releases[0];
        const result = {
            version: latestRelease.tag_name,
            updateTime: new Date(latestRelease.published_at).toLocaleDateString('zh-CN')
        };
        console.log('处理后的版本信息:', result);
        return result;
        
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
    console.log('开始更新版本信息...');
    try {
        // 更新轻量级浏览器版本信息
        console.log('正在获取浏览器版本信息...');
        const browserInfo = await fetchReleaseInfo('lite-browser');
        const browserVersionElements = document.querySelectorAll('.version-info[data-project="browser"]');
        console.log('找到浏览器版本元素数量:', browserVersionElements.length);
        browserVersionElements.forEach(element => {
            element.querySelector('.version').textContent = `当前版本: ${browserInfo.version}`;
            element.querySelector('.update-time').textContent = `更新时间: ${browserInfo.updateTime}`;
        });

        // 更新VIP视频解析工具版本信息
        console.log('正在获取视频解析工具版本信息...');
        const parserInfo = await fetchReleaseInfo('vip-video-parser');
        const parserVersionElements = document.querySelectorAll('.version-info[data-project="parser"]');
        console.log('找到解析器版本元素数量:', parserVersionElements.length);
        parserVersionElements.forEach(element => {
            element.querySelector('.version').textContent = `当前版本: ${parserInfo.version}`;
            element.querySelector('.update-time').textContent = `更新时间: ${parserInfo.updateTime}`;
        });
        
        console.log('版本信息更新完成');
    } catch (error) {
        console.error('更新版本信息失败:', error);
    }
}

// 页面加载完成后立即更新版本信息
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，开始初始化...');
    updateVersionInfo();
});

// 每60秒自动刷新一次版本信息
setInterval(updateVersionInfo, 60000); 