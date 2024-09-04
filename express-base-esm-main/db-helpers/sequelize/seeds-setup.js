import * as fs from 'fs'
import path from 'path'
// 取得專案根目錄
import appRootPath from 'app-root-path'
// 修正 __dirname for esm, windows dynamic import bug
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function applySeeds(sequelize) {
  try {
    // 載入各檔案
    const seedsPath = path.join(appRootPath.path, 'seeds')
    const filenames = await fs.promises.readdir(seedsPath)

    for (const filename of filenames) {
      try {
        // 讀取文件並將 Buffer 轉為字符串
        const data = await fs.promises.readFile(
          path.join(seedsPath, filename),
          'utf8' // 確保以字符串形式讀取
        )

        // 解析 JSON 並打印處理信息
        const seeds = JSON.parse(data)
        console.log('Processing JSON: ', seeds)

        // 獲取模型名稱並插入數據
        const prop = filename.split('.')[0]
        await sequelize.models[prop].bulkCreate(seeds, {
          ignoreDuplicates: true,
          individualHooks: true, // trigger the beforeCreate hook
        })
      } catch (error) {
        console.error(`Error processing file ${filename}:`, error)
      }
    }
  } catch (err) {
    console.error('Error reading seeds directory:', err)
  }
}

// import * as fs from 'fs'
// import path from 'path'
// // 取得專案根目錄
// import appRootPath from 'app-root-path'
// // 修正 __dirname for esm, windows dynamic import bug
// import { fileURLToPath, pathToFileURL } from 'url'
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// export default async function applySeeds(sequelize) {
//   // 載入各檔案
//   const seedsPath = path.join(appRootPath.path, 'seeds')
//   const filenames = await fs.promises.readdir(seedsPath)

//   for (const filename of filenames) {
//     const data = await fs.promises.readFile(
//       pathToFileURL(path.join(seedsPath, filename))
//     )
//     const seeds = JSON.parse(data)
//     console.log('Processing JSON: ', seeds)
//     const prop = filename.split('.')[0]

//     await sequelize.models[prop].bulkCreate(seeds, {
//       ignoreDuplicates: true,
//       individualHooks: true, // trigger the beforeCreate hook
//     })
//   }
// }
