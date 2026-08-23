import { useCallback } from 'react';
import { useAppStore } from '../store/useStore';

export function useProjectImport() {
  const restoreState = useAppStore(state => state.restoreState);

  const importFile = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension) {
        reject(new Error('Unknown file type'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;

          if (extension === 'vastu') {
            const parsed = JSON.parse(content);
            // Validate schema version here if needed in the future
            if (parsed && parsed.state) {
              restoreState(parsed.state);
              resolve();
            } else {
              reject(new Error('Invalid .vastu file format'));
            }
          } else if (extension === 'dxf') {
            // TODO: Implement boundary polyline extraction
            console.warn('.dxf import not fully implemented yet');
            resolve();
          } else if (extension === 'csv') {
            // TODO: Implement rate card or survey points import
            console.warn('.csv import not fully implemented yet');
            resolve();
          } else {
            reject(new Error(`Unsupported file extension: .${extension}`));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      if (extension === 'vastu' || extension === 'csv') {
        reader.readAsText(file);
      } else if (extension === 'dxf') {
        // Read as text for basic parsing, or ArrayBuffer if using a specific library
        reader.readAsText(file);
      } else {
        reject(new Error(`Unsupported file extension: .${extension}`));
      }
    });
  }, [restoreState]);

  return { importFile };
}
