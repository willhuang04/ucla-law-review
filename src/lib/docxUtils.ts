import mammoth from 'mammoth';

export async function extractTextFromDOCX(docxUrl: string): Promise<string> {
  try {
    // Fetch the DOCX file
    const response = await fetch(docxUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch DOCX file: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Downloaded DOCX file is empty or corrupt.');
    }
    // Extract text using Mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text could be extracted from this DOCX file.');
    }
    return result.value.trim();
  } catch (error: any) {
    console.error('Error extracting text from DOCX:', error);
    // Return a user-friendly error message for display
    return `Unable to extract text from DOCX file. Reason: ${error.message || error}`;
  }
}