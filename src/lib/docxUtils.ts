import mammoth from 'mammoth';

export async function extractTextFromDOCX(docxUrl: string, signal?: AbortSignal): Promise<string> {
  console.log('Starting DOCX extraction for:', docxUrl);
  
  try {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Text extraction timed out')), 30000);
      
      // Clear timeout if aborted
      signal?.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('AbortError'));
      });
    });
    
    // Create extraction promise
    const extractionPromise = (async () => {
      console.log('Fetching DOCX file...');
      const response = await fetch(docxUrl, { signal });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log('Converting to array buffer...');
      const arrayBuffer = await response.arrayBuffer();
      console.log('File size:', arrayBuffer.byteLength, 'bytes');
      
      // Check if aborted before continuing
      if (signal?.aborted) {
        throw new Error('AbortError');
      }
      
      console.log('Extracting text with Mammoth...');
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      console.log('Extraction complete, text length:', result.value.length);
      return result.value.trim();
    })();
    
    // Race between extraction and timeout
    return await Promise.race([extractionPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw error;
  }
}