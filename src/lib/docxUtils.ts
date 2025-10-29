import mammoth from 'mammoth';

export async function extractTextFromDOCX(docxUrl: string): Promise<string> {
  try {
    // Fetch the DOCX file
    const response = await fetch(docxUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Extract text using Mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return result.value.trim();
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw error;
  }
}