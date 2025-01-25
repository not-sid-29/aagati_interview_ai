const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  };
  
  export const saveFile = async (file, type) => {
    try {
      const fileName = `${generateUniqueId()}-${file.name}`;
      const filePath = `${type}/${fileName}`;
  
      // Convert to base64 for browser storage
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
  
      // Store in localStorage with metadata
      const files = JSON.parse(localStorage.getItem(type) || '{}');
      files[filePath] = {
        name: file.name,
        type: file.type,
        data: base64,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(type, JSON.stringify(files));
  
      return filePath;
    } catch (error) {
      console.error('File save error:', error);
      throw new Error(`Failed to save ${type} file`);
    }
  };
  
  export const saveCandidateData = async (candidateData) => {
    try {
      const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
      const newCandidate = {
        id: generateUniqueId(),
        ...candidateData,
        createdAt: new Date().toISOString()
      };
      
      candidates.push(newCandidate);
      localStorage.setItem('candidates', JSON.stringify(candidates));
      
      return newCandidate;
    } catch (error) {
      console.error('Failed to save candidate:', error);
      throw error;
    }
  };
  
  export const getFile = (filePath) => {
    const [type] = filePath.split('/');
    const files = JSON.parse(localStorage.getItem(type) || '{}');
    return files[filePath];
  };
  
  export const getCandidateData = (id) => {
    const candidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    return candidates.find(candidate => candidate.id === id);
  };