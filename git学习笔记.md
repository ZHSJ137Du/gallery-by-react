2017-12-12 17:04:46

1.裸git仓库创建：
git init --bare (与git init不同地是，不生成.git文件夹)

所谓的裸服务器，就是指这里只有版本库的内容，没有工作区。
（因此没有相应的版本库）

git clone 在1的基础下，克隆一个版本库


2.配置使用者信息：
git config --global user.name "用户名"
git config --global user.email "admin@admin.com"


3.文件上传
git status

git diff

git add --fileName  //添加到暂缓区（.git文件夹）

git checkout --fileName

git commit -m "illustrate"  //提交暂缓区的修改文件到版本库

git push -u origin master //推送到repositoty远程版本库上

#备
>>
git repositoty: git版本管理平台（远程版本库）
.git文件夹： 暂缓区
与.git文件夹，同目录下的所有内容： 工作区


# 添加新功能后

git status //查询是否有新版本，必须

git pull //拉下文件

>>常用命令
git log //显示所有历史记录
git log -3 //只显示最近的3次提交记录
git log -p //显示每次提交的内容差异

# 　多次修改，应该对应多次add ，否则commit只会提交上一次add的内容
那怎么提交第二次修改呢？你可以继续git add再git commit，也可以别着急提交第一次修改，先git add第二次修改，再git commit，就相当于把两次修改合并后一块提交了： 

>>常用命令
git checkout -- file  //撤销修改

# 解析
命令git checkout –- readme.txt意思就是，
把readme.txt文件在工作区的修改全部撤销，这里有两种情况：

	一种是readme.txt自修改后还没有被放到暂存区，撤销修改就回到和版本库一模一样的状态；
　　
	一种是readme.txt已经添加到暂存区后，又作了修改，撤销修改就回到添加到暂存区后的状态。
　　
	总之，就是让这个文件回到最近一次git commit或git add时的状态。现在，看看readme.txt的文件内容：

>>常用命令 （版本回退）
git reset head -- file //撤销暂缓区中的修改，重新放回工作区
	head: 最示最新的版本

>>版本回退 （上一次push后的版本???）
git reflog （寻找本地提交版本commitId）

git reset -hard commitId回退本地分支


>>删除文件
rm file  //工作区

git status
确实要删除：
git rm file
git commit -m ".."  //将修改同步或提交到git远程库上
# 如果一个文件已经被提交到版本库，那么你永远不用担心误删，但是要小心，你只能恢复文件到最新版本，你会丢失最近一次提交后你修改的内容。

误删：
git checkout -- file //远程版本库替换工作区文件


#    git commit  -m 'all'      (也许会让你填提交信息，但是默认的有，就按Esc后再按shift加:然后输入wq再按Enter键)


# 一般操作
添加代码对应git add

提交代码对应git commit

抓取代码对应git fetch

拉取代码对应git pull

推送代码对应git push

