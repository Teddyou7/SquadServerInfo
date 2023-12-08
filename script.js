// 获取当前系统时间
function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}/${month}/${day}, ${hours}:${minutes}:${seconds}`;
}

// 更新时间显示
function updateTimestamp() {
    const timestampElement = document.getElementById('timestamp');
    timestampElement.textContent = `查询时间：${getCurrentTimestamp()}`;
}

// 更新自动刷新间隔
function updateRefreshInterval() {
    const refreshInterval = parseInt(document.getElementById('refreshInterval').value);
    clearInterval(refreshTimer);
    if (refreshInterval > 0) {
        refreshTimer = setInterval(queryAndDisplayServers, refreshInterval);
    }
}

// 服务器查询对象
const serverQueries = [
    // { sort: '1', id: '20571240', name: '[华东多线]冲锋号#1-萌新进阶战斗服' },
    // { sort: '2', id: '20572613', name: '[华东多线]冲锋号#2-老兵抱团激斗服' },
    // { sort: '3', id: '20585885', name: '[华东多线]冲锋号#3-步战之王竞技服' },
    { sort: '4', id: '18068008', name: '[西南多线]冲锋号#4-公开飞行训练服' },
    { sort: '5', id: '19534421', name: '[西南多线]冲锋号#5-公开载具测试场' },
];

// 新增样式，服务器在线时底色为淡绿色
const ONLINE_COLOR = 'rgba(255, 255, 255, 0.8)';
// 新增样式，服务器离线时底色为淡红色
const OFFLINE_COLOR = 'rgba(255, 220, 220, 0.8)';

// 更新服务器信息
function updateServerInfo(serverInfo, serverName) {
    const serverContainer = document.getElementById('serverContainer');
    const playerReserveCount = serverInfo.details.squad_playerReserveCount || 0;
    const playerCountText = `${serverInfo.players} / ${serverInfo.maxPlayers}(${playerReserveCount})`;
    const statusText = serverInfo.status.toLowerCase() === 'offline' ? 'offline' : 'online';

    // 创建服务器容器元素
    const serverDiv = document.createElement('div');
    serverDiv.className = 'server-container';

    // 根据服务器状态添加相应的类
    serverDiv.classList.add(statusText === 'online' ? 'online' : 'offline');

    // 设置服务器信息
    serverDiv.innerHTML = `
        <h2>${serverName}</h2>
        <p>玩家数量：${playerCountText}</p>
        <p>当前地图：${serverInfo.details.map}</p>
        <p>状态：${statusText}</p>
    `;

    // 将服务器容器添加到页面
    serverContainer.appendChild(serverDiv);
}

// 设置超时时间，单位为毫秒
const timeout = 5000; // 5 seconds

// 查询并展示服务器信息
async function queryAndDisplayServers() {
    try {
        const serverResults = await Promise.race([
            queryAllServers(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('查询超时')), timeout))
        ]);

        if (serverResults) {
            // 清空原有内容
            const serverContainer = document.getElementById('serverContainer');
            serverContainer.innerHTML = '';

            // 展示查询结果
            serverResults.forEach(result => updateServerInfo(result.serverInfo, result.name));

            // 更新时间显示
            updateTimestamp();
        } else {
            // 查询失败或超时，显示错误信息
            document.getElementById('error').innerHTML = `<p>查询失败或超时。</p>`;
        }
    } catch (error) {
        console.error('查询服务器信息时出错:', error);
        document.getElementById('error').innerHTML = `<p>${error.message}</p>`;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

// 查询所有服务器信息
async function queryAllServers() {
    const promises = serverQueries.map(queryServerInfo);
    const serverResults = await Promise.all(promises);

    // 过滤掉为 null 的结果
    const validResults = serverResults.filter(result => result !== null);

    // 按照 sort 字段排序
    validResults.sort((a, b) => parseInt(a.serverInfo.details.sort) - parseInt(b.serverInfo.details.sort));

    return validResults;
}

// 查询单个服务器信息
async function queryServerInfo(query) {
    try {
        const response = await fetch(`https://api.battlemetrics.com/servers/${query.id}`, {
            headers: {
                'Accept-Charset': 'UTF-8'
            }
        });

        const data = await response.json();

        if (data && data.data) {
            return {
                name: query.name,
                serverInfo: data.data.attributes
            };
        } else {
            console.error(`${query.name}: 暂无服务器信息。`);
            return null;
        }
    } catch (error) {
        console.error(`查询服务器信息时出错 (${query.name}): ${error.message}`);
        return null;
    }
}

// 初始化页面时先执行一次查询
queryAndDisplayServers();

// 设置初始的自动刷新间隔为60秒
let refreshTimer = setInterval(queryAndDisplayServers, 60000);
