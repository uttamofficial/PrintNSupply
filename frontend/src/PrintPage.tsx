import React, { useState } from 'react';
import { Upload, Trash2, ShoppingCart, FileText, CheckCircle2, X, Eye, Loader2 } from 'lucide-react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { useCart } from './components/CartContext';
import CloudinaryService from './services/cloudinaryService';

interface UploadedFile {
  name: string;
  size: number;
  url?: string;
  viewUrl?: string; // URL for viewing PDFs in browser (inline)
  downloadUrl?: string; // URL for downloading PDFs
  publicId?: string;
  pageCount?: number;
  format?: string;
  uploadProgress?: number; // Upload progress percentage
}

interface StickerOption {
  id: string;
  label: string;
  price: number;
  selected: boolean;
}

function PrintPage() {
  const { addToCart } = useCart();
  
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [orientation, setOrientation] = useState('Portrait');
  const [colorOption, setColorOption] = useState('Black & White');
  const [bindingOption, setBindingOption] = useState('No Binding');
  const [copies, setCopies] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<UploadedFile | null>(null);
  const [colorPages, setColorPages] = useState<string>(''); // For specific color pages
  
  // Stick files options based on thickness
  const [stickers, setStickers] = useState<StickerOption[]>([
    { id: 'stick-thin', label: 'Thin', price: 5, selected: false },
    { id: 'stick-medium', label: 'Medium', price: 15, selected: false },
    { id: 'stick-thick', label: 'Thick', price: 20, selected: false },
  ]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploadPromises = Array.from(fileList).map(async (file) => {
        // Validate file type
        if (file.type !== 'application/pdf') {
          throw new Error(`${file.name} is not a PDF file`);
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 50MB limit`);
        }

        // Add file to state immediately with 0% progress
        const tempFile: UploadedFile = {
          name: file.name,
          size: file.size / (1024 * 1024),
          uploadProgress: 0,
        };
        
        setFiles(prevFiles => [...prevFiles, tempFile]);

        // Upload to Cloudinary with progress tracking
        const result = await CloudinaryService.uploadFile(
          file, 
          'student_prints',
          (progress) => {
            // Update the file in the list with progress
            setFiles(prevFiles => 
              prevFiles.map(f => 
                f.name === file.name 
                  ? { ...f, uploadProgress: progress }
                  : f
              )
            );
          }
        );
        
        // Update file with complete data after upload
        const uploadedFile: UploadedFile = {
          name: file.name,
          size: file.size / (1024 * 1024),
          url: result.url,
          viewUrl: result.viewUrl || result.url,
          downloadUrl: result.downloadUrl || result.url,
          publicId: result.public_id,
          pageCount: result.pages || 1,
          format: result.format,
          uploadProgress: 100,
        };
        
        // Replace temp file with complete data
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.name === file.name ? uploadedFile : f
          )
        );
        
        return uploadedFile;
      });

      await Promise.all(uploadPromises);
      
    } catch (error: any) {
      console.error('Error uploading files:', error);
      setUploadError(error.message || 'Failed to upload files. Please try again.');
      // Remove failed uploads
      setFiles(prevFiles => prevFiles.filter(f => f.url));
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (index: number) => {
    const fileToRemove = files[index];

    // If the file was uploaded to Cloudinary, delete it
    if (fileToRemove.publicId) {
      try {
        await CloudinaryService.deleteFile(fileToRemove.publicId);
      } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
      }
    }

    setFiles(files.filter((_, i) => i !== index));
  };

  const toggleSticker = (stickerId: string) => {
    setStickers(prevStickers =>
      prevStickers.map(sticker =>
        sticker.id === stickerId
          ? { ...sticker, selected: !sticker.selected }
          : sticker
      )
    );
  };

  const handlePreviewPdf = async (file: UploadedFile) => {
    // If file doesn't have publicId, use direct URL
    if (!file.publicId) {
      setPreviewPdf(file);
      return;
    }

    try {
      // Use backend proxy to view PDF (bypasses Cloudinary 401 errors)
      console.log('🔍 Getting proxied URL for:', file.publicId);
      const proxiedUrl = CloudinaryService.getProxiedUrl(file.publicId);
      const downloadUrl = CloudinaryService.getProxiedDownloadUrl(file.publicId);
      
      // Update file with both view and download proxied URLs
      const fileWithProxiedUrl = {
        ...file,
        viewUrl: proxiedUrl,
        downloadUrl: downloadUrl,
      };
      
      setPreviewPdf(fileWithProxiedUrl);
      console.log('✅ Using proxied URL for preview:', proxiedUrl);
      console.log('✅ Using proxied URL for download:', downloadUrl);
    } catch (error) {
      console.warn('⚠️ Error getting proxied URL, using direct URL:', error);
      // Fallback to direct URL if backend fails
      setPreviewPdf(file);
    }
  };

  const parseColorPages = (pagesString: string, totalPages: number): number[] => {
    if (!pagesString.trim()) return [];
    
    const pages: number[] = [];
    const parts = pagesString.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        // Range: e.g., "5-10"
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start <= end && start > 0 && end <= totalPages) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        // Single page: e.g., "3"
        const pageNum = parseInt(trimmed);
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages && !pages.includes(pageNum)) {
          pages.push(pageNum);
        }
      }
    }
    
    return pages;
  };

  const calculatePrice = () => {
    // Calculate total pages from uploaded PDFs
    const totalPagesFromFiles = files.reduce((sum, file) => sum + (file.pageCount || 1), 0);
    
    let pagePrintingCost = 0;
    
    if (colorOption === 'Full Color') {
      // All pages in color
      pagePrintingCost = totalPagesFromFiles * 5 * copies;
    } else if (colorOption === 'Black & White') {
      // Check if user specified specific pages for color
      if (colorPages.trim()) {
        const colorPageNumbers = parseColorPages(colorPages, totalPagesFromFiles);
        const colorPagesCount = colorPageNumbers.length;
        const bwPagesCount = totalPagesFromFiles - colorPagesCount;
        
        pagePrintingCost = ((bwPagesCount * 2) + (colorPagesCount * 5)) * copies;
      } else {
        // All pages in B&W
        pagePrintingCost = totalPagesFromFiles * 2 * copies;
      }
    }
    
    // Binding price
    const bindingPrice = {
      'Normal Spiral Binding': 20,
      'Premium Hardcover': 50,
      'Soft Cover': 30,
      'No Binding': 0,
    }[bindingOption] || 0;
    
    // Calculate stick files price
    const stickFilesPrice = stickers
      .filter(s => s.selected)
      .reduce((sum, s) => sum + s.price, 0);

    const total = pagePrintingCost + bindingPrice + stickFilesPrice;
    return total;
  };

  const handleAddToCart = () => {
    if (files.length === 0) {
      alert('Please upload at least one PDF file');
      return;
    }

    const totalPagesFromFiles = files.reduce((sum, file) => sum + (file.pageCount || 1), 0);
    const productName = `Print Job - ${files.length} file(s), ${totalPagesFromFiles} pages × ${copies} ${copies > 1 ? 'copies' : 'copy'}`;

    addToCart({
      id: Date.now(), // Generate unique ID
      name: productName,
      price: calculatePrice(),
      image: 'https://cdn-icons-png.flaticon.com/512/2874/2874791.png',
      quantity: 1,
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Optionally navigate to cart
      // navigate('/cart');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-5 py-2.5 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-in">
          <CheckCircle2 size={18} />
          <span>Added to cart successfully!</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Upload & Files */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-600" />
                Upload Files
              </h2>

              {/* Error Message */}
              {uploadError && (
                <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {uploadError}
                </div>
              )}

              {/* Compact Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 py-20 text-center hover:border-blue-400 transition-colors mb-3 min-h-[340px] flex items-center justify-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer flex flex-col items-center ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className={`h-16 w-16 ${uploading ? 'text-gray-400' : 'text-blue-600'}`} />
                  <p className="mt-5 text-lg text-gray-600">
                    {uploading ? (
                      <>Uploading files... Please wait</>
                    ) : (
                      <>
                        <span className="text-blue-600 underline font-semibold">Click to browse</span> or drag & drop PDFs
                      </>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF only • Max 50MB per file
                  </p>
                </label>
              </div>

              {/* File List - Scrollable */}
              {files.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    <span>Uploaded Files ({files.length})</span>
                    <span className="text-xs font-normal text-gray-500">
                      {files.reduce((sum, f) => sum + f.size, 0).toFixed(2)} MB
                    </span>
                  </h3>
                  <div className="space-y-2 max-h-[340px] overflow-y-auto pr-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.size.toFixed(2)} MB
                              {file.url && ' • ✅'}
                            </p>
                            
                            {/* Progress Bar */}
                            {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                              <div className="mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${file.uploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          {file.url && (
                            <>
                              <button
                                onClick={() => handlePreviewPdf(file)}
                                className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                title="Preview"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                          )}
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            disabled={uploading}
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Settings & Pricing */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Print Settings</h2>

              <div className="space-y-3">
                {/* Pages, Copies and Binding - Same Row */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Pages (Read-only) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pages
                    </label>
                    <div className="w-full px-3 py-2 text-sm border-2 border-blue-200 bg-blue-50 rounded-lg font-semibold text-blue-700 flex items-center justify-center">
                      {files.reduce((sum, file) => sum + (file.pageCount || 0), 0) || 0}
                    </div>
                  </div>

                  {/* Copies */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Copies
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={copies}
                      onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Binding Options - Enhanced Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Binding
                    </label>
                    <div className="relative">
                      <select
                        value={bindingOption}
                        onChange={(e) => setBindingOption(e.target.value)}
                        className="w-full px-2 py-2 text-xs font-medium border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-blue-400 transition-all appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.3rem center',
                          backgroundSize: '1.2em 1.2em',
                          paddingRight: '1.8rem'
                        }}
                      >
                        <option value="No Binding">No Binding</option>
                        <option value="Normal Spiral Binding">Spiral (+₹20)</option>
                        <option value="Soft Cover">Soft (+₹30)</option>
                        <option value="Premium Hardcover">Premium (+₹50)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Color Option */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Color Option
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setColorOption('Black & White')}
                      className={`p-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                        colorOption === 'Black & White'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">B&W</div>
                      <div className="text-xs mt-0.5">₹2/page</div>
                    </button>
                    <button
                      onClick={() => setColorOption('Full Color')}
                      className={`p-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                        colorOption === 'Full Color'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">Color</div>
                      <div className="text-xs mt-0.5">₹5/page</div>
                    </button>
                  </div>
                  
                  {/* Specific Color Pages Input */}
                  {colorOption === 'Black & White' && files.length > 0 && (
                    <div className="mt-2 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Specific Pages in Color (Optional)
                      </label>
                      <input
                        type="text"
                        value={colorPages}
                        onChange={(e) => setColorPages(e.target.value)}
                        placeholder="e.g., 1,3,5-8"
                        className="w-full px-2.5 py-1.5 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-[10px] text-gray-600 mt-1">
                        Enter page numbers or ranges. Example: "1,3,5-8" will print pages 1, 3, and 5 through 8 in color
                      </p>
                    </div>
                  )}
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setOrientation('Portrait')}
                      className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        orientation === 'Portrait'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      onClick={() => setOrientation('Landscape')}
                      className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        orientation === 'Landscape'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                {/* Stick Files Options - Single Row */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Add Stick Files (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {stickers.map((sticker) => (
                      <button
                        key={sticker.id}
                        onClick={() => toggleSticker(sticker.id)}
                        className={`p-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                          sticker.selected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-semibold">{sticker.label}</div>
                        <div className="text-xs mt-0.5 text-gray-600">₹{sticker.price}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 italic">Based on thickness</p>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={2}
                    className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special requirements..."
                  />
                </div>

                {/* Price Summary - Compact */}
                <div className="border-t pt-3 mt-3">
                  <div className="space-y-1.5 text-xs">
                    {/* Show detailed breakdown if specific color pages are selected */}
                    {colorOption === 'Black & White' && colorPages.trim() && files.length > 0 ? (
                      <>
                        <div className="flex justify-between text-gray-600">
                          <span>
                            B&W Pages × {copies} {copies > 1 ? 'Copies' : 'Copy'}
                            <span className="text-[10px] text-gray-500 block">
                              {files.reduce((sum, file) => sum + (file.pageCount || 1), 0) - parseColorPages(colorPages, files.reduce((sum, file) => sum + (file.pageCount || 1), 0)).length} pages @₹2/page
                            </span>
                          </span>
                          <span className="font-medium">
                            ₹{((files.reduce((sum, file) => sum + (file.pageCount || 1), 0) - parseColorPages(colorPages, files.reduce((sum, file) => sum + (file.pageCount || 1), 0)).length) * 2 * copies).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>
                            Color Pages × {copies} {copies > 1 ? 'Copies' : 'Copy'}
                            <span className="text-[10px] text-gray-500 block">
                              {parseColorPages(colorPages, files.reduce((sum, file) => sum + (file.pageCount || 1), 0)).length} pages @₹5/page
                            </span>
                          </span>
                          <span className="font-medium">
                            ₹{(parseColorPages(colorPages, files.reduce((sum, file) => sum + (file.pageCount || 1), 0)).length * 5 * copies).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-gray-600">
                        <span>
                          {files.reduce((sum, file) => sum + (file.pageCount || 1), 0)} Pages × {copies} {copies > 1 ? 'Copies' : 'Copy'}
                          {colorOption && (
                            <span className="text-[10px] text-gray-500 block">
                              @₹{colorOption === 'Black & White' ? 2 : 5}/page
                            </span>
                          )}
                        </span>
                        <span className="font-medium">₹{(files.reduce((sum, file) => sum + (file.pageCount || 1), 0) * copies * (colorOption === 'Black & White' ? 2 : 5)).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {bindingOption !== 'No Binding' && (
                      <div className="flex justify-between text-gray-600">
                        <span>Binding</span>
                        <span className="font-medium">₹{
                          bindingOption === 'Normal Spiral Binding' ? 20 :
                          bindingOption === 'Premium Hardcover' ? 50 :
                          bindingOption === 'Soft Cover' ? 30 : 0
                        }</span>
                      </div>
                    )}
                    {stickers.some(s => s.selected) && (
                      <div className="flex justify-between text-gray-600">
                        <span>Stick Files</span>
                        <span className="font-medium">₹{stickers.filter(s => s.selected).reduce((sum, s) => sum + s.price, 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span className="text-blue-600">₹{calculatePrice().toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={files.length === 0 || uploading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                
                {files.length === 0 && (
                  <p className="text-xs text-center text-gray-500">
                    Upload PDF files to continue
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* PDF Preview Modal */}
      {previewPdf && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewPdf(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-semibold text-gray-800">PDF Preview</h3>
                  <p className="text-sm text-gray-600">{previewPdf.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Download Button in Modal */}
                <a
                  href={previewPdf.downloadUrl || previewPdf.url}
                  download
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
                {/* Close Button */}
                <button
                  onClick={() => setPreviewPdf(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Close preview"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-gray-100">
              <iframe
                src={previewPdf.viewUrl || previewPdf.url}
                className="w-full h-full border-0"
                title={`Preview of ${previewPdf.name}`}
              />
            </div>
            
            {/* Modal Footer */}
            <div className="p-3 border-t bg-gray-50 rounded-b-lg flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{previewPdf.size.toFixed(2)} MB</span>
                {previewPdf.pageCount && previewPdf.pageCount > 1 && (
                  <span className="ml-3">• {previewPdf.pageCount} pages</span>
                )}
              </div>
              <button
                onClick={() => setPreviewPdf(null)}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default PrintPage;