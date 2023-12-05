// 서버에 있는 값 가져와서 labels 폴더에 사진 저장하는거 

export default async(req, res) => {
    const fs = require('fs')
    const path = require('path')
    if(req.method === 'POST') { // 저장
        try {
            const {url, name} = req.body;
            const binaryData = Buffer.from(url, 'base64')
            const filePath = path.join(process.cwd(), '/public/labels', `${name}.jpg`)
            console.log(filePath)
            fs.writeFileSync(filePath, binaryData)
            res.json({success: true})
            console.log('성공')
        } catch (error) {
            console.log(error)
            res.json({error: error})
        }
        
    }

    else if(req.method === 'GET') {
        res.json('Hello World')
    }
    else if(req.method === 'DELETE') { // 삭제
        console.log('DELETE Method')
        try {
            const {name} = req.body;
            const filePath = path.join(process.cwd(), '/public/labels', `${name}.jpg`)
            fs.unlinkSync(filePath)
            res.json({success: '삭제완료'})
        } catch (error) {
            console.log(error)
            res.json({error: error})
        }
    }
}