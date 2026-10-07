import { useCallback } from 'react';
import { useAppStore } from '../store/useStore';
import DxfParser from 'dxf-parser';

export function useProjectImport() {
  const restoreState = useAppStore(state => state.restoreState);
  const setPlotSpec = useAppStore(state => state.setPlotSpec);
  const setRates = useAppStore(state => state.setRates);

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
            try {
              const parser = new DxfParser();
              const dxf = parser.parseSync(content);

              if (dxf && dxf.entities) {
                let minX = Infinity, minY = Infinity;
                let maxX = -Infinity, maxY = -Infinity;
                let hasBoundary = false;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dxf.entities.forEach((entity: any) => {
                  if (entity.type === 'LWPOLYLINE' && entity.vertices) {
                    hasBoundary = true;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    entity.vertices.forEach((v: any) => {
                      if (v.x < minX) minX = v.x;
                      if (v.x > maxX) maxX = v.x;
                      if (v.y < minY) minY = v.y;
                      if (v.y > maxY) maxY = v.y;
                    });
                  }
                });

                if (hasBoundary && minX !== Infinity) {
                  const width = maxX - minX;
                  const length = maxY - minY;
                  setPlotSpec({ width, length });
                } else {
                  console.warn('No LWPOLYLINE found in DXF to extract boundary');
                }
              }
              resolve();
            } catch (err) {
              console.error('Failed to parse DXF:', err);
              reject(new Error('Invalid .dxf file format'));
            }
          } else if (extension === 'csv') {
            try {
              const lines = content.trim().split('\n');
              if (lines.length >= 2) {
                const headers = lines[0].split(',').map(h => h.trim());
                const values = lines[1].split(',').map(v => v.trim());

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rates: any = {};
                headers.forEach((header, i) => {
                  if (header === 'columnSize') {
                    rates[header] = values[i];
                  } else {
                    const num = Number(values[i]);
                    if (!isNaN(num)) {
                      rates[header] = num;
                    }
                  }
                });

                setRates(rates);
              }
              resolve();
            } catch (err) {
              console.error('Failed to parse CSV:', err);
              reject(new Error('Invalid .csv file format'));
            }
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
  }, [restoreState, setPlotSpec, setRates]);

  return { importFile };
}
