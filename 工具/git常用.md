# git 常用

## git命令

1. git clone 复制
2. git add . 新增
3. git commit -m ‘xxx’  提交
4. git push 发布
5. git branch xxx 新建分支
6. git checkout xxx 切换分支
7. git push origin xxx 发布分支
8. git merge xxx 合并分支
9. git rm xxx 删除文件
10. git log 提交日志
11. git reflog 记录每次git命令
12. git reset —hard 版本号 或者 HEAD-n
13. git push origin --delete xxx 删除分支

tips：
1. github SSH 获取  $ pbcopy < ~/.ssh/id_rsa.pub



## Github 
本地项目上传github步骤：
1. git init
2. git  add .
3. git commit -m ‘xxx’
4. git remote add origin xxx(github.git)
5. git pull origin master --allow-unrelated-histories  （若文件冲突）
6. git add . && git commit -m ‘解决冲突’
7. git push origin master   
