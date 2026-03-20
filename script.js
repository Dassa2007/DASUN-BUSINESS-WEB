
document.getElementById('fileInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                splitImage(file);
            }
        });

        function splitImage(file) {
            const loading = document.getElementById('loading');
            const previewSection = document.getElementById('previewSection');
            const downloadAllBtn = document.getElementById('downloadAllBtn');
            const imageInfo = document.getElementById('imageInfo');
            
            loading.style.display = 'block';
            previewSection.innerHTML = '';
            downloadAllBtn.style.display = 'none';
            imageInfo.style.display = 'none';

            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Create canvas for original image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate dimensions for 6 equal parts (2 rows, 3 columns)
                    const partWidth = Math.floor(img.width / 3);
                    const partHeight = Math.floor(img.height / 2);
                    
                    // Display image info
                    imageInfo.innerHTML = `<i class="fas fa-info-circle"></i> frist image: ${img.width} x ${img.height} pixels | one image: ${partWidth} x ${partHeight} pixels`;
                    imageInfo.style.display = 'block';
                    
                    // Array to store all parts data
                    const parts = [];
                    
                    // Clear preview section
                    previewSection.innerHTML = '';
                    
                    // Split image into 6 parts
                    for (let row = 0; row < 2; row++) {
                        for (let col = 0; col < 3; col++) {
                            const partCanvas = document.createElement('canvas');
                            partCanvas.width = partWidth;
                            partCanvas.height = partHeight;
                            const partCtx = partCanvas.getContext('2d');
                            
                            // Draw the specific part with high quality
                            partCtx.imageSmoothingEnabled = true;
                            partCtx.imageSmoothingQuality = 'high';
                            
                            partCtx.drawImage(
                                img,
                                col * partWidth, row * partHeight, partWidth, partHeight,
                                0, 0, partWidth, partHeight
                            );
                            
                            // Convert to data URL with high quality PNG
                            const partDataUrl = partCanvas.toDataURL('image/png');
                            parts.push(partDataUrl);
                            
                            // Create preview item
                            const previewItem = document.createElement('div');
                            previewItem.className = 'preview-item';
                            
                            let partNumber;
                            if (row === 0 && col === 0) partNumber = '01 image';
                            else if (row === 0 && col === 1) partNumber = '02 image';
                            else if (row === 0 && col === 2) partNumber = '03 image';
                            else if (row === 1 && col === 0) partNumber = '04 image';
                            else if (row === 1 && col === 1) partNumber = '05 image';
                            else if (row === 1 && col === 2) partNumber = '06 image';
                            
                            previewItem.innerHTML = `
                                <img src="${partDataUrl}" alt="Part ${row * 3 + col + 1}">
                                <div class="part-number">${partNumber}</div>
                                <button class="download-btn" onclick="downloadPart('${partDataUrl}', 'dassa_tech_part_${row * 3 + col + 1}.png')">
                                    <i class="fas fa-download"></i> download 
                                </button>
                            `;
                            
                            previewSection.appendChild(previewItem);
                        }
                    }
                    
                    // Store parts for download all functionality
                    window.imageParts = parts;
                    
                    loading.style.display = 'none';
                    downloadAllBtn.style.display = 'block';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        // Download single part with high quality
        function downloadPart(dataUrl, filename) {
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            link.click();
            
            // Show success message
            alert('Image Download Done!');
        }

        // Download all parts
        document.getElementById('downloadAllBtn').addEventListener('click', function() {
            if (window.imageParts && window.imageParts.length > 0) {
                let successCount = 0;
                
                window.imageParts.forEach((part, index) => {
                    setTimeout(() => {
                        const partNumber = index + 1;
                        downloadPart(part, `dassa_tech_part_${partNumber}.png`);
                        successCount++;
                        
                        if (successCount === window.imageParts.length) {
                            setTimeout(() => {
                                alert('All Image Donghua Completely!');
                            }, 500);
                        }
                    }, index * 800); // 800ms delay between downloads
                });
            }
        });

        // Drag and drop functionality
        const uploadSection = document.querySelector('.upload-section');
        
        uploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadSection.style.borderColor = '#ffd700';
            uploadSection.style.background = 'rgba(255, 215, 0, 0.1)';
        });

        uploadSection.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadSection.style.borderColor = 'rgba(255,255,255,0.3)';
            uploadSection.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        uploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadSection.style.borderColor = 'rgba(255,255,255,0.3)';
            uploadSection.style.background = 'rgba(255, 255, 255, 0.1)';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                splitImage(file);
            } else {
                alert('selected image !');
            }
        });

        // Add keyboard shortcut (Ctrl+V) to paste image
        document.addEventListener('paste', function(e) {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    splitImage(file);
                    break;
                }
            }
        });

        // Show instructions
        console.log('DASSA TECH Image Splitter - ඡායාරූපයක් ඇද දමන්න හෝ Ctrl+V ඔබන්න');
