# SquadServerInfo
一个支持自动刷新的服务器信息查询页面，简易部署，支持灵活定制和自动刷新。

本项目依赖于BattleMetricsAPI使用时，请注意API速率限制。

A server information query page that supports automatic refresh, easy deployment, flexible customization, and automatic refresh.

Demo：[https://bctc-squad.cn/show/](https://bctc-squad.cn/show/)

DemoNginxCFG:
```
location /show {
    root   /usr/local/nginx/html/bctc/;
    index  index.html;
    location ~* \.(css|js)$ {
        try_files $uri =404;
    }
```

## 代码简易，灵活修改
直接修改html，修改背景图片URL和网站标题等信息。
## 通过直接编辑JS定义查询的服务器
![cfg](https://z1.ax1x.com/2023/12/08/pigvUhR.png)
```
{ sort: '4', id: '18068008', name: '[西南多线]冲锋号#4-公开飞行训练服' },

sort 排序顺序
id battlemetrics服务器ID
name 自定义服务器名称
```
## 示例
![show](https://z1.ax1x.com/2023/12/08/pigvw1x.png)
