// lables에 있는 애들 이름 다 가져오는거
export default async(req, res) => {
    if (req.method === 'GET') {
        const fs = require('fs')
        const path = require('path')

        const labelPath = path.join(process.cwd(), 'public', 'labels')
        const fileName = fs.readdirSync(labelPath)
        const fileWithoutJPG = fileName.map(item => {
            const nameWithout = path.parse(item).name
            return nameWithout
        })
        res.json(fileWithoutJPG)
    }
  


}