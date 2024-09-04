Yaimin
===
# 歡迎大家來到雅茗
<div align=center><img width="200" height="200" src="https://memeprod.ap-south-1.linodeobjects.com/user-template/834ce8fcd70f1d71ba160134c0c2335f.png" /></div>

## 注意事項
# Git指令
## 先確保在自己的分支開發，告一段落後，要準備上傳到github
1. 將自己的內容先存在本機端  
  a. `git add .`  
  b. `git commit -m "更新內容簡述"`
2. 切換到 dev 開發分支 -> `git checkout dev`
3. 確保dev為最新狀態 -> `git pull --no-commit --no-ff origin dev`
4. 回去檢查所有暫存檔案是否是你要的樣子(可能會很多檔案，要有耐心的一個個檢查)
5. 檢查沒問題後再下commit `git commit -m ""`
6. 切換回自己的分支 -> `git checkout 自己的分支名稱`
7. 將最新的 dev 資訊merge到自己的分支，有衝突就解決衝突 -> `git merge --no-commit --no-ff dev`
8. 一樣要回去檢查所有的暫存檔案和有衝突的檔案的更動內容是不是你要的(可能會很多檔案，要有耐心的一個個檢查)
9. 檢查完畢後，一樣再下commit `git commit -m ""`
10. 再將自己的分支更新到雲端 -> `git push origin 自己的分支名稱`
11. 切回dev，將dev更新至最新狀態  
   a. `git checkout dev`  
   b. `git merge --no-commit --no-ff 自己的分支名稱`
12. 在上傳前再次確認是否有人比你早一步上傳dev `git pull --no-commit --no-ff origin dev`
13. 如果有，要再回到步驟 4 ，沒有的話就執行下一步
14. 把dev更新到雲端 -> `git push origin dev`
15. 記得切回自己的分支，再繼續開發!!!!  -> `git checkout 自己的分支名稱`


# 開發時
1. 元件的css跟元件放一起  
2. pages 下方建立自己負責功能的對應資料夾(如商品列表 -> 就建立一個 product 的資料夾， 會員中心 -> user的資料夾... 等等)


---
<div align=center><img width="450" height="300" src="https://www.niusnews.com/upload/imgs/default/2019JuneM/toys/t9.jpg" /></div>
<div align=center><h1>大家加油!!</h1></div>
