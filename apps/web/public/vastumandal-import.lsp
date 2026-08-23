(vl-load-com)

(defun c:RDCAD_IMPORT ( / userProfile downloadsPath files newestFile newestTime fileTime dxfPath currentTime )
  (setq userProfile (getenv "USERPROFILE"))
  (if (not userProfile)
      (prompt "\nError: Could not find user profile path.")
    (progn
      (setq downloadsPath (strcat userProfile "\\Downloads\\"))
      (setq files (vl-directory-files downloadsPath "*.dxf" 1))
      
      (if (not files)
          (prompt "\nNo DXF files found in the Downloads folder.")
        (progn
          (setq newestFile nil)
          (setq newestTime 0)
          
          (foreach file files
            (setq fileTime (vl-file-systime (strcat downloadsPath file)))
            (if fileTime
              (progn
                ;; vl-file-systime returns a list: (year month dayofweek day hours mins secs)
                (setq currentTime (+ (* (nth 0 fileTime) 31536000) 
                                     (* (nth 1 fileTime) 2592000) 
                                     (* (nth 3 fileTime) 86400) 
                                     (* (nth 4 fileTime) 3600) 
                                     (* (nth 5 fileTime) 60) 
                                     (nth 6 fileTime)))
                (if (> currentTime newestTime)
                  (progn
                    (setq newestTime currentTime)
                    (setq newestFile file)
                  )
                )
              )
            )
          )
          
          (if newestFile
            (progn
              (setq dxfPath (strcat downloadsPath newestFile))
              (prompt (strcat "\nImporting: " dxfPath))
              (command "-insert" dxfPath pause "" "" "")
              
              ;; Create Standard Text Style
              (if (not (tblsearch "style" "VASTU_TEXT"))
                (command "-style" "VASTU_TEXT" "simplex.shx" "0" "1" "0" "N" "N" "N")
              )
              
              ;; Create Standard Dim Style
              (if (not (tblsearch "dimstyle" "VASTU_DIM"))
                (progn
                  (setvar "DIMTXSTY" "VASTU_TEXT")
                  (setvar "DIMTXT" 25)
                  (setvar "DIMASZ" 15)
                  (setvar "DIMEXE" 10)
                  (setvar "DIMEXO" 5)
                  (command "-dimstyle" "Save" "VASTU_DIM")
                )
              )
              
              ;; Scaffolding for reading BBS block data and generating a native Table
              (prompt "\nConfiguring block attributes and styles...")
              (command "dimstyle" "restore" "VASTU_DIM")
              
              (prompt "\nDXF imported successfully.")
            )
            (prompt "\nError: Could not determine the newest file.")
          )
        )
      )
    )
  )
  (princ)
)

(prompt "\nRDCAD Express Import tool loaded. Type RDCAD_IMPORT to insert your latest download.")
(princ)
