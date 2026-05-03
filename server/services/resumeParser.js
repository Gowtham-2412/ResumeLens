import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
import path from 'path'

const parseResume = async (fileBuffer, originalName) => {
    try {
        
        const ext = path.extname(originalName).toLowerCase();

        let extractedText = ""

        if(ext === '.pdf') {
            const parser = new PDFParse({ data: fileBuffer })
            const pdfData = await parser.getText()
            await parser.destroy()

            extractedText = pdfData.text;
        } else if(ext === '.docx'){
            const docData = await mammoth.extractRawText({ buffer: fileBuffer })

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
