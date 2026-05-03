import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
import fs from 'fs'
import path from 'path'

const parseResume = async (filePath) => {
    try {
        
        const ext = path.extname(filePath).toLowerCase();

        let extractedText = ""

        if(ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath)
            const parser = new PDFParse({ data: dataBuffer })
            const pdfData = await parser.getText()
            await parser.destroy()

            extractedText = pdfData.text;
        } else if(ext === '.docx'){
            const docData = await mammoth.extractRawText({path: filePath})

            extractedText = docData.value;
        } else {
            throw new Error("Unsupported file type")
        }

        return extractedText

    } catch (error) {
        throw new Error("Resume parsing failed: " + error.message)
    }
}

export default parseResume
