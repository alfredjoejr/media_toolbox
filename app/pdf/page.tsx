"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  ChevronLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
  Search,
  Star,
  Files,
  FileArchive,
  Edit3,
  FileSpreadsheet,
  FileCheck,
  Lock,
  Unlock,
  Scissors,
  RotateCw,
  Trash2,
  FolderOutput,
  ArrowUpDown,
  Image as ImageIcon,
  FileImage,
  ScanText,
  Globe,
  Stamp,
  Hash,
  Layers,
  GitCompare,
  PenTool,
  Highlighter,
  EyeOff,
  Crop,
  Layers2,
  Receipt,
  ShieldAlert,
  Sliders,
  LayoutGrid,
  Maximize2,
  Wrench,
  Bookmark,
  CheckSquare,
  Sparkles,
  X,
  Filter,
  ArrowRight,
  Download,
  Loader2,
  Plus
} from "lucide-react";
import { useState, useRef, useMemo } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { encryptPDF } from "@pdfsmaller/pdf-encrypt-lite";

export interface PdfTool {
  id: string;
  title: string;
  description: string;
  category: "Organize" | "Convert" | "Edit" | "Security" | "Page Ops";
  icon: React.ElementType;
  color: string;
  popular?: boolean;
}

const PDF_TOOLS: PdfTool[] = [
  { id: "organize", title: "Organize PDFs", description: "Reorder, delete, or rotate pages in your document", category: "Organize", icon: Files, color: "text-blue-500 bg-blue-50", popular: true },
  { id: "merge", title: "Merge PDF", description: "Combine multiple PDF files into a single document", category: "Organize", icon: Files, color: "text-indigo-500 bg-indigo-50", popular: true },
  { id: "compress", title: "Compress PDF", description: "Reduce file size while optimizing maximum quality", category: "Organize", icon: FileArchive, color: "text-amber-500 bg-amber-50", popular: true },
  { id: "edit", title: "Edit PDF", description: "Add text, shapes, images, and freehand drawings", category: "Edit", icon: Edit3, color: "text-emerald-500 bg-emerald-50", popular: true },
  { id: "convert-to-pdf", title: "Convert to PDF", description: "Convert Word, Excel, PPT, or TXT into PDF format", category: "Convert", icon: FileCheck, color: "text-teal-500 bg-teal-50", popular: true },
  { id: "convert-pdf-to", title: "Convert PDF to ...", description: "Export PDF to Word, Excel, PowerPoint or Images", category: "Convert", icon: FileSpreadsheet, color: "text-cyan-500 bg-cyan-50", popular: true },
  { id: "protect", title: "Protect PDF", description: "Encrypt PDF files with a password and set permissions", category: "Security", icon: Lock, color: "text-red-500 bg-red-50", popular: true },
  { id: "unlock", title: "Unlock PDF", description: "Remove password security and permissions from PDF", category: "Security", icon: Unlock, color: "text-rose-500 bg-rose-50" },
  { id: "split", title: "Split PDF", description: "Separate one page or a whole range into distinct files", category: "Organize", icon: Scissors, color: "text-purple-500 bg-purple-50", popular: true },
  { id: "rotate", title: "Rotate PDF pages", description: "Rotate specific or all pages 90°, 180°, or 270°", category: "Page Ops", icon: RotateCw, color: "text-sky-500 bg-sky-50" },
  { id: "remove-pages", title: "Remove PDF pages", description: "Delete unwanted pages from your PDF file", category: "Page Ops", icon: Trash2, color: "text-red-500 bg-red-50" },
  { id: "extract-pages", title: "Extract PDF pages", description: "Extract selected pages into a brand new PDF", category: "Page Ops", icon: FolderOutput, color: "text-indigo-500 bg-indigo-50" },
  { id: "sort-pages", title: "Sort PDF pages", description: "Sort pages numerically, alphabetically, or manually", category: "Page Ops", icon: ArrowUpDown, color: "text-blue-500 bg-blue-50" },
  { id: "images-to-pdf", title: "Images to PDF", description: "Convert JPG, PNG, WEBP, and BMP images to PDF", category: "Convert", icon: ImageIcon, color: "text-pink-500 bg-pink-50" },
  { id: "pdf-to-images", title: "PDF to images", description: "Convert every page of PDF into high-res JPG/PNG", category: "Convert", icon: FileImage, color: "text-fuchsia-500 bg-fuchsia-50" },
  { id: "extract-images", title: "Extract PDF images", description: "Pull out all embedded graphics & photos from PDF", category: "Convert", icon: ImageIcon, color: "text-violet-500 bg-violet-50" },
  { id: "job-application", title: "Create PDF job application", description: "Build formatted resumes and cover letters quickly", category: "Edit", icon: FileText, color: "text-amber-600 bg-amber-50" },
  { id: "ocr", title: "PDF OCR", description: "Recognize text in scanned PDFs for search & copy", category: "Convert", icon: ScanText, color: "text-blue-600 bg-blue-50" },
  { id: "web-optimize", title: "Web optimize PDF", description: "Linearize PDF for fast web page loading", category: "Organize", icon: Globe, color: "text-teal-600 bg-teal-50" },
  { id: "watermark", title: "Add watermark", description: "Stamp image or text watermarks across pages", category: "Edit", icon: Stamp, color: "text-orange-500 bg-orange-50" },
  { id: "page-numbers", title: "Add page numbers", description: "Insert headers, footers, and page numbers easily", category: "Edit", icon: Hash, color: "text-purple-600 bg-purple-50" },
  { id: "overlay", title: "PDF Overlay", description: "Merge or overlay two PDF pages together", category: "Organize", icon: Layers, color: "text-indigo-600 bg-indigo-50" },
  { id: "compare", title: "Compare PDFs", description: "Highlight visual or text differences between PDFs", category: "Organize", icon: GitCompare, color: "text-slate-600 bg-slate-100" },
  { id: "sign", title: "Sign PDF", description: "Draw, type, or upload your electronic signature", category: "Edit", icon: PenTool, color: "text-emerald-600 bg-emerald-50", popular: true },
  { id: "annotate", title: "Annotate PDF", description: "Add highlights, comments, notes, and callouts", category: "Edit", icon: Highlighter, color: "text-yellow-600 bg-yellow-50" },
  { id: "blacken", title: "Blacken PDF", description: "Redact and permanently mask confidential information", category: "Security", icon: EyeOff, color: "text-slate-800 bg-slate-100" },
  { id: "crop", title: "Crop PDF", description: "Trim margins or crop specific regions of pages", category: "Page Ops", icon: Crop, color: "text-blue-500 bg-blue-50" },
  { id: "flatten", title: "Flatten PDF", description: "Merge form fields and layers into uneditable content", category: "Security", icon: Layers2, color: "text-stone-600 bg-stone-100" },
  { id: "create-invoice", title: "Create invoice", description: "Generate clean PDF billing invoices and quotes", category: "Edit", icon: Receipt, color: "text-green-600 bg-green-50" },
  { id: "remove-metadata", title: "Remove PDF Metadata", description: "Strip author, title, creation dates, and tags", category: "Security", icon: ShieldAlert, color: "text-rose-600 bg-rose-50" },
  { id: "edit-metadata", title: "Edit PDF metadata", description: "Modify PDF document title, author, subject, keywords", category: "Security", icon: Sliders, color: "text-sky-600 bg-sky-50" },
  { id: "viewer-preferences", title: "Edit viewer preferences", description: "Set default zoom, page layout, and toolbar display", category: "Page Ops", icon: Sliders, color: "text-indigo-500 bg-indigo-50" },
  { id: "pages-per-sheet", title: "Pages per sheet", description: "Print multiple pages per sheet (2-up, 4-up grid)", category: "Page Ops", icon: LayoutGrid, color: "text-violet-600 bg-violet-50" },
  { id: "change-page-size", title: "Change PDF page size", description: "Resize pages to A4, Letter, Legal, or custom scale", category: "Page Ops", icon: Maximize2, color: "text-cyan-600 bg-cyan-50" },
  { id: "repair", title: "Repair PDF", description: "Recover and fix corrupted or damaged PDF data", category: "Organize", icon: Wrench, color: "text-amber-700 bg-amber-50" },
  { id: "edit-bookmarks", title: "Edit PDF bookmarks", description: "Create and edit table of contents outlines", category: "Edit", icon: Bookmark, color: "text-blue-600 bg-blue-50" },
  { id: "fillable-form", title: "Create fillable PDF form", description: "Add text fields, checkboxes, and radio buttons", category: "Edit", icon: CheckSquare, color: "text-emerald-600 bg-emerald-50" },
];

export default function PdfToolbox() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTool, setSelectedTool] = useState<PdfTool | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  
  // Tool options state
  const [rotateAngle, setRotateAngle] = useState<number>(90);
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [pdfPassword, setPdfPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [pageRanges, setPageRanges] = useState<string>("1");
  const [pageNumberPosition, setPageNumberPosition] = useState<"bottom-right" | "bottom-center" | "top-right">("bottom-right");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaAuthor, setMetaAuthor] = useState<string>("");
  const [imageFormat, setImageFormat] = useState<"png" | "jpeg">("png");
  const [imageScale, setImageScale] = useState<number>(2.0);
  const [generatedImages, setGeneratedImages] = useState<{ name: string; url: string; page: number }[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<"extreme" | "recommended" | "low">("recommended");
  const [compressionStats, setCompressionStats] = useState<{ originalSize: number; compressedSize: number; ratio: number } | null>(null);

  // Tier 1 tool options
  const [cropMargins, setCropMargins] = useState({ top: 50, right: 50, bottom: 50, left: 50 });
  const [targetPageSize, setTargetPageSize] = useState<"a4" | "letter" | "legal">("a4");
  const [nUpLayout, setNUpLayout] = useState<2 | 4 | 9>(2);
  const [sortOrder, setSortOrder] = useState<"reverse" | "custom">("reverse");
  const [pageReorderStr, setPageReorderStr] = useState("");
  const [viewerPageLayout, setViewerPageLayout] = useState("SinglePage");
  const [viewerPageMode, setViewerPageMode] = useState("UseNone");
  const [blackenAreas, setBlackenAreas] = useState("1:50,700,500,30");

  // Tier 2 tool options
  const [signatureText, setSignatureText] = useState("");
  const [signatureMode, setSignatureMode] = useState<"type" | "draw">("type");
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);
  const [editTextContent, setEditTextContent] = useState("Hello World");
  const [editTextSize, setEditTextSize] = useState(16);
  const [editTextPage, setEditTextPage] = useState(1);
  const [annotateText, setAnnotateText] = useState("Note: ");
  const [annotatePage, setAnnotatePage] = useState(1);
  const [invoiceData, setInvoiceData] = useState({
    company: "", client: "", invoiceNum: "INV-001", date: new Date().toISOString().split("T")[0],
    items: [{ desc: "Service", qty: 1, price: 0 }] as { desc: string; qty: number; price: number }[],
    tax: 0, notes: ""
  });
  const [resumeData, setResumeData] = useState({
    name: "", email: "", phone: "", summary: "", experience: "", education: "", skills: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  const toggleFavorite = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const addSelectedFiles = (newFiles: FileList | File[]) => {
    const validPdfs: File[] = [];
    Array.from(newFiles).forEach((f) => {
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf") || f.type.startsWith("image/")) {
        validPdfs.push(f);
      }
    });

    if (validPdfs.length > 0) {
      setFiles((prev) => [...prev, ...validPdfs]);
      setProcessSuccess(false);
    } else {
      alert("Please upload valid PDF or Image files.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addSelectedFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setProcessSuccess(false);
    }
  };

  // REAL CLIENT-SIDE PDF PROCESSING WITH PDF-LIB
  const loadOrConvertFileToPdf = async (file: File, password?: string): Promise<PDFDocument> => {
    const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|bmp|gif|tiff?)$/i.test(file.name);

    if (isImage) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.create();
      let embeddedImage;
      const fileTypeLower = file.type.toLowerCase();
      const fileNameLower = file.name.toLowerCase();

      try {
        if (fileTypeLower === "image/png" || fileNameLower.endsWith(".png")) {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else if (fileTypeLower === "image/jpeg" || fileTypeLower === "image/jpg" || fileNameLower.endsWith(".jpg") || fileNameLower.endsWith(".jpeg")) {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else {
          // Canvas fallback for webp, bmp, gif
          const img = document.createElement("img");
          const blobUrl = URL.createObjectURL(file);
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = blobUrl;
          });
          const canvas = document.createElement("canvas");
          canvas.width = img.width || 800;
          canvas.height = img.height || 600;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL("image/png");
          const base64 = pngDataUrl.split(",")[1];
          const pngBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          embeddedImage = await pdfDoc.embedPng(pngBytes);
          URL.revokeObjectURL(blobUrl);
        }
      } catch {
        const img = document.createElement("img");
        const blobUrl = URL.createObjectURL(file);
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = blobUrl;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.width || 800;
        canvas.height = img.height || 600;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL("image/png");
        const base64 = pngDataUrl.split(",")[1];
        const pngBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        embeddedImage = await pdfDoc.embedPng(pngBytes);
        URL.revokeObjectURL(blobUrl);
      }

      const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
      });
      return pdfDoc;
    }

    const arrayBuffer = await file.arrayBuffer();
    try {
      return await PDFDocument.load(arrayBuffer, { ignoreEncryption: true, ...(password ? { password } : {}) } as any);
    } catch (err: any) {
      if (err?.message?.includes("No PDF header found")) {
        throw new Error(`"${file.name}" is not a valid PDF file. Please upload a valid PDF document.`);
      }
      if (err?.message?.toLowerCase().includes("password") || err?.message?.toLowerCase().includes("encrypted")) {
        throw new Error(`"${file.name}" is password protected. Please enter the correct password in the tool options.`);
      }
      throw err;
    }
  };

  const renderPdfToImages = async (file: File): Promise<{ name: string; url: string; page: number }[]> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "3.11.174"}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const results: { name: string; url: string; page: number }[] = [];

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const mimeType = imageFormat === "jpeg" ? "image/jpeg" : "image/png";
    const ext = imageFormat === "jpeg" ? "jpg" : "png";

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: imageScale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context as any,
        viewport: viewport,
        canvas: canvas as any,
      }).promise;

      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      const imageName = `${baseName}_page_${pageNum}.${ext}`;
      results.push({
        name: imageName,
        url: dataUrl,
        page: pageNum,
      });
    }

    return results;
  };

  const compressPdfDocument = async (
    file: File,
    level: "extreme" | "recommended" | "low",
    password?: string
  ): Promise<{ pdfBytes: Uint8Array; originalSize: number; compressedSize: number }> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "3.11.174"}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingParams: any = { data: new Uint8Array(arrayBuffer) };
    if (password) loadingParams.password = password;

    let pdfDoc: any;
    try {
      const loadingTask = pdfjsLib.getDocument(loadingParams);
      pdfDoc = await loadingTask.promise;
    } catch (err: any) {
      if (err?.name === "PasswordException" || err?.message?.toLowerCase().includes("password")) {
        throw new Error(`"${file.name}" is password protected. Please enter the password in options.`);
      }
      throw err;
    }

    const numPages = pdfDoc.numPages;
    const compressedPdf = await PDFDocument.create();

    let scale = 1.3;
    let quality = 0.65;

    if (level === "extreme") {
      scale = 1.0;
      quality = 0.45;
    } else if (level === "low") {
      scale = 1.6;
      quality = 0.82;
    }

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context as any,
        viewport: viewport,
        canvas: canvas as any,
      }).promise;

      const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
      const jpegImageBytes = await fetch(jpegDataUrl).then((res) => res.arrayBuffer());
      const embeddedJpeg = await compressedPdf.embedJpg(jpegImageBytes);

      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const newPage = compressedPdf.addPage([unscaledViewport.width, unscaledViewport.height]);
      newPage.drawImage(embeddedJpeg, {
        x: 0,
        y: 0,
        width: unscaledViewport.width,
        height: unscaledViewport.height,
      });
    }

    let finalBytes = await compressedPdf.save({ useObjectStreams: true });

    if (finalBytes.byteLength > file.size) {
      try {
        const origPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const structCompressed = await PDFDocument.create();
        const pages = await structCompressed.copyPages(origPdf, origPdf.getPageIndices());
        pages.forEach((p) => structCompressed.addPage(p));
        const structBytes = await structCompressed.save({ useObjectStreams: true });
        if (structBytes.byteLength < finalBytes.byteLength) {
          finalBytes = structBytes;
        }
      } catch {
        // ignore
      }
    }

    return {
      pdfBytes: finalBytes,
      originalSize: file.size,
      compressedSize: finalBytes.byteLength,
    };
  };

  const processPdfFile = async () => {
    const toolId = selectedTool?.id || "merge";
    const fromScratchTools = ["create-invoice", "job-application"];
    if (files.length === 0 && !fromScratchTools.includes(toolId)) return;
    setIsProcessing(true);
    setProcessSuccess(false);
    setCompressionStats(null);

    try {
      let finalPdfDoc: PDFDocument;

      // Tier 3: Coming Soon tools
      const comingSoonTools = ["ocr", "compare", "edit-bookmarks", "fillable-form"];
      if (comingSoonTools.includes(toolId)) {
        alert(`"${selectedTool?.title}" is coming soon! This feature requires additional libraries that are being integrated.`);
        setIsProcessing(false);
        return;
      }

      // From-scratch: Create Invoice
      if (toolId === "create-invoice") {
        const doc = await PDFDocument.create();
        const page = doc.addPage([595.28, 841.89]);
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
        const { width, height } = page.getSize();
        let y = height - 60;

        page.drawText("INVOICE", { x: 50, y, size: 28, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
        page.drawText(invoiceData.invoiceNum, { x: width - 200, y, size: 12, font, color: rgb(0.4, 0.4, 0.4) });
        y -= 20;
        page.drawText(`Date: ${invoiceData.date}`, { x: width - 200, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        y -= 30;

        if (invoiceData.company) {
          page.drawText("From:", { x: 50, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) });
          y -= 15;
          page.drawText(invoiceData.company, { x: 50, y, size: 12, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
        }
        if (invoiceData.client) {
          page.drawText("Bill To:", { x: 300, y: y + 15, size: 8, font, color: rgb(0.5, 0.5, 0.5) });
          page.drawText(invoiceData.client, { x: 300, y, size: 12, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
        }
        y -= 40;
        page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
        y -= 25;

        page.drawText("Description", { x: 50, y, size: 9, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
        page.drawText("Qty", { x: 350, y, size: 9, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
        page.drawText("Price", { x: 420, y, size: 9, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
        page.drawText("Total", { x: 490, y, size: 9, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
        y -= 15;
        page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });
        y -= 20;

        let subtotal = 0;
        invoiceData.items.forEach(item => {
          const total = item.qty * item.price;
          subtotal += total;
          page.drawText(item.desc || "Item", { x: 50, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
          page.drawText(String(item.qty), { x: 360, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
          page.drawText(`$${item.price.toFixed(2)}`, { x: 420, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
          page.drawText(`$${total.toFixed(2)}`, { x: 490, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
          y -= 22;
        });
        y -= 10;
        page.drawLine({ start: { x: 350, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
        y -= 20;

        const taxAmt = subtotal * (invoiceData.tax / 100);
        const grandTotal = subtotal + taxAmt;
        page.drawText("Subtotal:", { x: 400, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        page.drawText(`$${subtotal.toFixed(2)}`, { x: 490, y, size: 10, font: boldFont, color: rgb(0.2, 0.2, 0.2) });
        y -= 18;
        page.drawText(`Tax (${invoiceData.tax}%):`, { x: 400, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        page.drawText(`$${taxAmt.toFixed(2)}`, { x: 490, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
        y -= 22;
        page.drawText("TOTAL:", { x: 400, y, size: 13, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
        page.drawText(`$${grandTotal.toFixed(2)}`, { x: 490, y, size: 13, font: boldFont, color: rgb(0.1, 0.1, 0.1) });

        if (invoiceData.notes) {
          y -= 50;
          page.drawText("Notes:", { x: 50, y, size: 9, font: boldFont, color: rgb(0.4, 0.4, 0.4) });
          y -= 15;
          page.drawText(invoiceData.notes, { x: 50, y, size: 9, font, color: rgb(0.5, 0.5, 0.5), maxWidth: 400 });
        }
        page.drawText("Generated by Media ToolBox", { x: 50, y: 30, size: 7, font, color: rgb(0.7, 0.7, 0.7) });

        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Invoice_${invoiceData.invoiceNum}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsProcessing(false);
        setProcessSuccess(true);
        return;
      }

      // From-scratch: Job Application / Resume
      if (toolId === "job-application") {
        const doc = await PDFDocument.create();
        const page = doc.addPage([595.28, 841.89]);
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
        const { width, height } = page.getSize();
        let y = height - 60;

        page.drawText(resumeData.name || "Your Name", { x: 50, y, size: 24, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
        y -= 22;
        const contactParts = [resumeData.email, resumeData.phone].filter(Boolean);
        if (contactParts.length > 0) {
          page.drawText(contactParts.join("  \u2022  "), { x: 50, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        }
        y -= 20;
        page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 2, color: rgb(0.2, 0.4, 0.8) });
        y -= 25;

        const drawSection = (title: string, content: string) => {
          if (!content) return;
          page.drawText(title.toUpperCase(), { x: 50, y, size: 11, font: boldFont, color: rgb(0.2, 0.4, 0.8) });
          y -= 18;
          const lines = content.split("\n");
          lines.forEach(line => {
            if (y < 60) return;
            page.drawText(line, { x: 50, y, size: 10, font, color: rgb(0.2, 0.2, 0.2), maxWidth: width - 100 });
            y -= 14;
          });
          y -= 10;
        };

        drawSection("Professional Summary", resumeData.summary);
        drawSection("Experience", resumeData.experience);
        drawSection("Education", resumeData.education);
        drawSection("Skills", resumeData.skills);
        page.drawText("Generated by Media ToolBox", { x: 50, y: 30, size: 7, font, color: rgb(0.7, 0.7, 0.7) });

        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Resume_${(resumeData.name || "document").replace(/\s+/g, "_")}_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsProcessing(false);
        setProcessSuccess(true);
        return;
      }

      if (toolId === "compress" || toolId === "web-optimize") {
        const primaryFile = files[0];
        const { pdfBytes, originalSize, compressedSize } = await compressPdfDocument(primaryFile, compressionLevel, pdfPassword);
        
        const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));
        setCompressionStats({
          originalSize,
          compressedSize,
          ratio: savedPercent,
        });

        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        const outName = primaryFile.name.replace(/\.[^/.]+$/, "") + "_compressed.pdf";
        link.download = outName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsProcessing(false);
        setProcessSuccess(true);
        return;
      }

      if (toolId === "pdf-to-images" || toolId === "extract-images" || toolId === "convert-pdf-to") {
        const primaryFile = files[0];
        const renderedImages = await renderPdfToImages(primaryFile);
        setGeneratedImages(renderedImages);

        // Auto trigger download of PNG/JPG image(s)
        renderedImages.forEach((img, idx) => {
          setTimeout(() => {
            const link = document.createElement("a");
            link.href = img.url;
            link.download = img.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, idx * 250);
        });

        setIsProcessing(false);
        setProcessSuccess(true);
        return;
      }

      if (toolId === "merge") {
        // MERGE MULTIPLE PDFS / IMAGES
        finalPdfDoc = await PDFDocument.create();
        for (const file of files) {
          const loadedDoc = await loadOrConvertFileToPdf(file);
          const copiedPages = await finalPdfDoc.copyPages(loadedDoc, loadedDoc.getPageIndices());
          copiedPages.forEach((page) => finalPdfDoc.addPage(page));
        }
      } else if (toolId === "images-to-pdf") {
        // CONVERT IMAGES TO PDF
        finalPdfDoc = await PDFDocument.create();
        for (const file of files) {
          const loadedDoc = await loadOrConvertFileToPdf(file);
          const copiedPages = await finalPdfDoc.copyPages(loadedDoc, loadedDoc.getPageIndices());
          copiedPages.forEach((page) => finalPdfDoc.addPage(page));
        }
      } else {
        // SINGLE PDF TRANSFORMATIONS
        const primaryFile = files[0];
        const srcDoc = await loadOrConvertFileToPdf(primaryFile, pdfPassword);

        if (toolId === "protect") {
          if (!pdfPassword) {
            throw new Error("Please enter a password to protect the PDF.");
          }
          if (confirmPassword && pdfPassword !== confirmPassword) {
            throw new Error("Passwords do not match. Please re-enter matching passwords.");
          }
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach((page) => finalPdfDoc.addPage(page));
        } else if (toolId === "unlock") {
          if (!pdfPassword) {
            throw new Error("Please enter the password to unlock the PDF.");
          }
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach((page) => finalPdfDoc.addPage(page));
        } else if (toolId === "rotate") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach((page) => {
            const currentRot = page.getRotation().angle;
            page.setRotation(degrees((currentRot + rotateAngle) % 360));
            finalPdfDoc.addPage(page);
          });
        } else if (toolId === "watermark") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          const font = await finalPdfDoc.embedFont(StandardFonts.HelveticaBold);
          copiedPages.forEach((page) => {
            const { width, height } = page.getSize();
            page.drawText(watermarkText || "WATERMARK", {
              x: width / 4,
              y: height / 2,
              size: 42,
              font,
              color: rgb(0.8, 0.2, 0.2),
              opacity: 0.35,
              rotate: degrees(45),
            });
            finalPdfDoc.addPage(page);
          });
        } else if (toolId === "page-numbers") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          const font = await finalPdfDoc.embedFont(StandardFonts.Helvetica);
          const totalPages = copiedPages.length;
          copiedPages.forEach((page, idx) => {
            const { width, height } = page.getSize();
            const text = `Page ${idx + 1} of ${totalPages}`;
            let xPos = width - 100;
            let yPos = 30;
            if (pageNumberPosition === "bottom-center") {
              xPos = width / 2 - 30;
            } else if (pageNumberPosition === "top-right") {
              yPos = height - 30;
            }

            page.drawText(text, {
              x: xPos,
              y: yPos,
              size: 10,
              font,
              color: rgb(0.3, 0.3, 0.3),
            });
            finalPdfDoc.addPage(page);
          });
        } else if (toolId === "split" || toolId === "extract-pages" || toolId === "remove-pages") {
          finalPdfDoc = await PDFDocument.create();
          const totalCount = srcDoc.getPageCount();
          let pageIndicesToKeep: number[] = [];

          if (toolId === "remove-pages") {
            const removeList = pageRanges
              .split(",")
              .map((s) => parseInt(s.trim()))
              .filter((n) => !isNaN(n) && n >= 1 && n <= totalCount)
              .map((n) => n - 1);
            pageIndicesToKeep = srcDoc.getPageIndices().filter((idx) => !removeList.includes(idx));
          } else {
            // Split or Extract
            const keepList = pageRanges
              .split(",")
              .map((s) => parseInt(s.trim()))
              .filter((n) => !isNaN(n) && n >= 1 && n <= totalCount)
              .map((n) => n - 1);
            pageIndicesToKeep = keepList.length > 0 ? keepList : [0];
          }

          const copiedPages = await finalPdfDoc.copyPages(srcDoc, pageIndicesToKeep);
          copiedPages.forEach((page) => finalPdfDoc.addPage(page));
        } else if (toolId === "flatten") {
          finalPdfDoc = srcDoc;
          try {
            const form = finalPdfDoc.getForm();
            form.flatten();
          } catch {
            // Form might not exist, ignore
          }
        } else if (toolId === "edit-metadata") {
          finalPdfDoc = srcDoc;
          if (metaTitle) finalPdfDoc.setTitle(metaTitle);
          if (metaAuthor) finalPdfDoc.setAuthor(metaAuthor);
          finalPdfDoc.setProducer("MediaBox PDF Engine");
        } else if (toolId === "remove-metadata") {
          finalPdfDoc = srcDoc;
          finalPdfDoc.setTitle("");
          finalPdfDoc.setAuthor("");
          finalPdfDoc.setSubject("");
          finalPdfDoc.setKeywords([]);
          finalPdfDoc.setProducer("");
          finalPdfDoc.setCreator("");
        } else if (toolId === "repair") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach((page) => finalPdfDoc.addPage(page));
          finalPdfDoc.setProducer("MediaBox Repair Engine");
        } else if (toolId === "crop") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach((page) => {
            const { width, height } = page.getSize();
            page.setCropBox(
              cropMargins.left,
              cropMargins.bottom,
              width - cropMargins.left - cropMargins.right,
              height - cropMargins.top - cropMargins.bottom
            );
            finalPdfDoc.addPage(page);
          });
        } else if (toolId === "change-page-size") {
          const sizes: Record<string, [number, number]> = {
            a4: [595.28, 841.89],
            letter: [612, 792],
            legal: [612, 1008],
          };
          const [targetW, targetH] = sizes[targetPageSize] || sizes.a4;
          finalPdfDoc = await PDFDocument.create();
          for (let i = 0; i < srcDoc.getPageCount(); i++) {
            const srcPage = srcDoc.getPage(i);
            const { width: origW, height: origH } = srcPage.getSize();
            const embeddedPage = await finalPdfDoc.embedPage(srcPage);
            const scale = Math.min(targetW / origW, targetH / origH);
            const newPage = finalPdfDoc.addPage([targetW, targetH]);
            newPage.drawPage(embeddedPage, {
              x: (targetW - origW * scale) / 2,
              y: (targetH - origH * scale) / 2,
              width: origW * scale,
              height: origH * scale,
            });
          }
        } else if (toolId === "pages-per-sheet") {
          finalPdfDoc = await PDFDocument.create();
          const totalPages = srcDoc.getPageCount();
          const cols = nUpLayout === 2 ? 2 : nUpLayout === 4 ? 2 : 3;
          const rows = nUpLayout === 2 ? 1 : nUpLayout === 4 ? 2 : 3;
          const pageW = nUpLayout === 2 ? 841.89 : 595.28;
          const pageH = nUpLayout === 2 ? 595.28 : 841.89;
          const cellW = pageW / cols;
          const cellH = pageH / rows;

          for (let i = 0; i < totalPages; i += nUpLayout) {
            const newPage = finalPdfDoc.addPage([pageW, pageH]);
            for (let j = 0; j < nUpLayout && (i + j) < totalPages; j++) {
              const srcPage = srcDoc.getPage(i + j);
              const { width: origW, height: origH } = srcPage.getSize();
              const embeddedPage = await finalPdfDoc.embedPage(srcPage);
              const scale = Math.min(cellW / origW, cellH / origH) * 0.95;
              const col = j % cols;
              const row = Math.floor(j / cols);
              const x = col * cellW + (cellW - origW * scale) / 2;
              const y = pageH - (row + 1) * cellH + (cellH - origH * scale) / 2;
              newPage.drawPage(embeddedPage, { x, y, width: origW * scale, height: origH * scale });
            }
          }
        } else if (toolId === "overlay") {
          if (files.length < 2) {
            throw new Error("Please upload two PDF files to overlay. The second PDF will be overlaid on the first.");
          }
          const secondDoc = await loadOrConvertFileToPdf(files[1], pdfPassword);
          finalPdfDoc = await PDFDocument.create();
          const maxPages = Math.max(srcDoc.getPageCount(), secondDoc.getPageCount());
          for (let i = 0; i < maxPages; i++) {
            if (i < srcDoc.getPageCount()) {
              const basePage = srcDoc.getPage(i);
              const { width, height } = basePage.getSize();
              const embeddedBase = await finalPdfDoc.embedPage(basePage);
              const newPage = finalPdfDoc.addPage([width, height]);
              newPage.drawPage(embeddedBase, { x: 0, y: 0, width, height });
              if (i < secondDoc.getPageCount()) {
                const overlayPage = secondDoc.getPage(i);
                const embeddedOverlay = await finalPdfDoc.embedPage(overlayPage);
                newPage.drawPage(embeddedOverlay, { x: 0, y: 0, width, height });
              }
            }
          }
        } else if (toolId === "sort-pages" || toolId === "organize") {
          finalPdfDoc = await PDFDocument.create();
          const totalCount = srcDoc.getPageCount();
          let newOrder: number[];
          if (sortOrder === "reverse" && !pageReorderStr.trim()) {
            newOrder = Array.from({ length: totalCount }, (_, i) => totalCount - 1 - i);
          } else {
            const parsed = pageReorderStr.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= totalCount).map(n => n - 1);
            newOrder = parsed.length > 0 ? parsed : srcDoc.getPageIndices();
          }
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, newOrder);
          copiedPages.forEach((page) => finalPdfDoc.addPage(page));
        } else if (toolId === "viewer-preferences") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach((page) => finalPdfDoc.addPage(page));
          const catalog = finalPdfDoc.catalog;
          const { PDFName, PDFDict } = await import("pdf-lib");
          catalog.set(PDFName.of("PageLayout"), PDFName.of(viewerPageLayout));
          catalog.set(PDFName.of("PageMode"), PDFName.of(viewerPageMode));
          const vpDict = PDFDict.withContext(finalPdfDoc.context);
          vpDict.set(PDFName.of("FitWindow"), finalPdfDoc.context.obj(true));
          vpDict.set(PDFName.of("CenterWindow"), finalPdfDoc.context.obj(true));
          catalog.set(PDFName.of("ViewerPreferences"), vpDict);
        } else if (toolId === "blacken") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          const areas = blackenAreas.split("\n").map(line => {
            const [pageStr, coords] = line.split(":");
            if (!coords) return null;
            const parts = coords.split(",").map(s => parseFloat(s.trim()));
            return { page: parseInt(pageStr.trim()) - 1, x: parts[0] || 0, y: parts[1] || 0, w: parts[2] || 100, h: parts[3] || 20 };
          }).filter(Boolean) as { page: number; x: number; y: number; w: number; h: number }[];

          copiedPages.forEach((page, idx) => {
            areas.filter(a => a.page === idx).forEach(area => {
              page.drawRectangle({ x: area.x, y: area.y, width: area.w, height: area.h, color: rgb(0, 0, 0) });
            });
            finalPdfDoc.addPage(page);
          });
        } else if (toolId === "sign") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          const font = await finalPdfDoc.embedFont(StandardFonts.Courier);
          const lastIdx = copiedPages.length - 1;
          copiedPages.forEach((page, idx) => {
            if (idx === lastIdx && signatureMode === "type" && signatureText) {
              const { width } = page.getSize();
              page.drawText(signatureText, { x: width - 250, y: 80, size: 24, font, color: rgb(0, 0, 0.6) });
              page.drawLine({ start: { x: width - 260, y: 72 }, end: { x: width - 60, y: 72 }, thickness: 1, color: rgb(0.3, 0.3, 0.3) });
              page.drawText("Signature", { x: width - 200, y: 56, size: 8, font, color: rgb(0.5, 0.5, 0.5) });
            }
            finalPdfDoc.addPage(page);
          });
          // Handle canvas-drawn signature
          if (signatureMode === "draw" && signatureCanvasRef.current) {
            const canvas = signatureCanvasRef.current;
            const pngDataUrl = canvas.toDataURL("image/png");
            const base64 = pngDataUrl.split(",")[1];
            if (base64) {
              const pngBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
              const sigImage = await finalPdfDoc.embedPng(pngBytes);
              const lastPage = finalPdfDoc.getPage(finalPdfDoc.getPageCount() - 1);
              const { width } = lastPage.getSize();
              const sigW = 200;
              const sigH = (sigImage.height / sigImage.width) * sigW;
              lastPage.drawImage(sigImage, { x: width - sigW - 60, y: 60, width: sigW, height: sigH });
            }
          }
        } else if (toolId === "edit") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          const font = await finalPdfDoc.embedFont(StandardFonts.Helvetica);
          const targetPage = Math.min(editTextPage, copiedPages.length) - 1;
          copiedPages.forEach((page, idx) => {
            if (idx === targetPage && editTextContent) {
              const { height } = page.getSize();
              page.drawText(editTextContent, { x: 50, y: height - 50, size: editTextSize, font, color: rgb(0, 0, 0) });
            }
            finalPdfDoc.addPage(page);
          });
        } else if (toolId === "annotate") {
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          const font = await finalPdfDoc.embedFont(StandardFonts.HelveticaBold);
          const targetPage = Math.min(annotatePage, copiedPages.length) - 1;
          copiedPages.forEach((page, idx) => {
            if (idx === targetPage && annotateText) {
              const { width, height } = page.getSize();
              page.drawRectangle({ x: width - 220, y: height - 80, width: 200, height: 50, color: rgb(1, 0.96, 0.76), borderColor: rgb(0.9, 0.85, 0.5), borderWidth: 1 });
              page.drawText(annotateText, { x: width - 215, y: height - 60, size: 9, font, color: rgb(0.3, 0.25, 0), maxWidth: 190 });
            }
            finalPdfDoc.addPage(page);
          });
        } else {
          // Default fallthrough: copy all pages and save
          finalPdfDoc = await PDFDocument.create();
          const copiedPages = await finalPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach((page) => finalPdfDoc.addPage(page));
        }
      }

      // Generate PDF bytes and initiate instant browser download
      let pdfBytes = await finalPdfDoc.save();

      if (toolId === "protect") {
        pdfBytes = await encryptPDF(pdfBytes, pdfPassword, pdfPassword);
      }

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `MediaBox_${selectedTool?.id || "processed"}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsProcessing(false);
      setProcessSuccess(true);
    } catch (err: any) {
      console.error("Error processing PDF:", err);
      alert(err.message || "Error processing file. Please ensure the file is a valid PDF or image.");
      setIsProcessing(false);
    }
  };

  const filteredTools = useMemo(() => {
    return PDF_TOOLS.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === "All") return true;
      if (activeCategory === "Favorites") return !!favorites[tool.id];
      if (activeCategory === "Popular") return !!tool.popular;
      return tool.category === activeCategory;
    });
  }, [searchQuery, activeCategory, favorites]);

  return (
    <main
      className="w-full min-h-screen bg-[#f8f9fb] relative font-sans flex flex-col pb-20"
      style={{
        background:
          "radial-gradient(circle at 0% 0%, #d4e9ff 0%, #ffffff 50%, #fbe7ef 100%)",
      }}
    >
      {/* Navigation Header */}
      <header className="relative z-10 w-full px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white/70 backdrop-blur-xl rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-slate-900 border border-white/80 cursor-pointer"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              PDF Toolbox
            </h1>
            <p className="text-xs font-medium text-slate-500 hidden sm:block">
              Complete suite of PDF editing, conversion & page operation utilities
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-48 sm:w-72">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-10 pr-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace / Dropzone Container */}
      <section className="w-full max-w-7xl mx-auto px-6 mb-8 relative z-10">
        <AnimatePresence mode="wait">
          {files.length === 0 && selectedTool?.id !== "create-invoice" && selectedTool?.id !== "job-application" ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-white/40 backdrop-blur-[30px] rounded-[2.5rem] border border-white/80 p-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              <div
                className={`w-full h-56 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/60 scale-[0.99]"
                    : "border-blue-200/80 hover:border-blue-400 hover:bg-white/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: "pointer" }}
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 ring-8 ring-blue-50/50 shadow-sm">
                  <UploadCloud size={30} strokeWidth={2} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">
                  {selectedTool ? `Upload for ${selectedTool.title}` : "Drop your PDF or Image files here"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  or <span className="text-blue-600 font-semibold underline underline-offset-4">browse your computer</span>
                </p>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-file-zone"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-white/60 backdrop-blur-[40px] rounded-[2.5rem] border border-white/80 p-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] flex flex-col items-center text-center"
            >
              {/* Loaded Files List */}
              {files.length > 0 && (
              <div className="w-full max-w-2xl mb-6">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Uploaded Files ({files.length})
                  </span>
                  <button
                    onClick={() => addMoreInputRef.current?.click()}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add More Files
                  </button>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    multiple
                    ref={addMoreInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {files.map((f, idx) => (
                    <div
                      key={`${f.name}-${idx}`}
                      className="p-3 bg-white/80 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{f.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {(f.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(idx)}
                        className="p-1 text-slate-300 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Action Options Panel */}
              <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col gap-4 mb-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-500" />
                    Selected Tool: <span className="text-slate-900">{selectedTool ? selectedTool.title : "Merge PDF"}</span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> Ready
                  </span>
                </div>

                {/* Tool Specific Configurations */}
                {(selectedTool?.id === "compress" || selectedTool?.id === "web-optimize") && (
                  <div className="flex flex-col gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <FileArchive size={15} className="text-amber-600" /> Select Compression Level
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        {
                          id: "extreme",
                          label: "Extreme Compression",
                          desc: "Max size reduction, lower quality",
                          badge: "~70% Smaller",
                        },
                        {
                          id: "recommended",
                          label: "Recommended",
                          desc: "Good compression, clear quality",
                          badge: "~50% Smaller",
                        },
                        {
                          id: "low",
                          label: "Low Compression",
                          desc: "High quality, mild compression",
                          badge: "~25% Smaller",
                        },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setCompressionLevel(lvl.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            compressionLevel === lvl.id
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold">{lvl.label}</span>
                              <span
                                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  compressionLevel === lvl.id
                                    ? "bg-amber-400 text-slate-950"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {lvl.badge}
                              </span>
                            </div>
                            <p
                              className={`text-[10px] leading-tight ${
                                compressionLevel === lvl.id ? "text-slate-300" : "text-slate-400"
                              }`}
                            >
                              {lvl.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTool?.id === "protect" && (
                  <div className="flex flex-col gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Lock size={14} className="text-blue-600" /> Set Password Protection
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">PDF Password:</label>
                        <input
                          type="password"
                          value={pdfPassword}
                          onChange={(e) => setPdfPassword(e.target.value)}
                          placeholder="Enter password..."
                          className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Confirm Password:</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password..."
                          className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>
                    {confirmPassword && pdfPassword !== confirmPassword && (
                      <p className="text-[11px] font-semibold text-red-500">Passwords do not match</p>
                    )}
                  </div>
                )}

                {selectedTool?.id === "unlock" && (
                  <div className="flex flex-col gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Unlock size={14} className="text-emerald-600" /> Unlock Password Protected PDF
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-600">Current PDF Password:</label>
                      <input
                        type="password"
                        value={pdfPassword}
                        onChange={(e) => setPdfPassword(e.target.value)}
                        placeholder="Enter password to unlock..."
                        className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                  </div>
                )}
                {selectedTool?.id === "rotate" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Rotation Angle:</label>
                    <div className="flex gap-2">
                      {[90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => setRotateAngle(deg)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            rotateAngle === deg
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {deg}° Clockwise
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTool?.id === "watermark" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Watermark Text:</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. CONFIDENTIAL"
                      className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                )}

                {selectedTool?.id === "page-numbers" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Page Number Position:</label>
                    <div className="flex gap-2">
                      {[
                        { id: "bottom-right", label: "Bottom Right" },
                        { id: "bottom-center", label: "Bottom Center" },
                        { id: "top-right", label: "Top Right" },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setPageNumberPosition(pos.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            pageNumberPosition === pos.id
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedTool?.id === "split" || selectedTool?.id === "extract-pages" || selectedTool?.id === "remove-pages") && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">
                      {selectedTool.id === "remove-pages" ? "Page numbers to remove:" : "Page numbers to extract:"}
                    </label>
                    <input
                      type="text"
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      placeholder="e.g. 1, 2, 3"
                      className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                )}

                {selectedTool?.id === "edit-metadata" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-600">Document Title:</label>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="Title"
                        className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-600">Author Name:</label>
                      <input
                        type="text"
                        value={metaAuthor}
                        onChange={(e) => setMetaAuthor(e.target.value)}
                        placeholder="Author"
                        className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {(selectedTool?.id === "pdf-to-images" || selectedTool?.id === "extract-images" || selectedTool?.id === "convert-pdf-to") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600">Export Image Format:</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setImageFormat("png")}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            imageFormat === "png"
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          PNG (Lossless, High-Res)
                        </button>
                        <button
                          onClick={() => setImageFormat("jpeg")}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            imageFormat === "jpeg"
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          JPG (Compact)
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600">Resolution Quality:</label>
                      <div className="flex gap-1.5">
                        {[
                          { scale: 1.0, label: "1x Standard" },
                          { scale: 2.0, label: "2x Crisp" },
                          { scale: 3.0, label: "3x Ultra HD" },
                        ].map((res) => (
                          <button
                            key={res.scale}
                            onClick={() => setImageScale(res.scale)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              imageScale === res.scale
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {res.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Crop margins */}
                {selectedTool?.id === "crop" && (
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Crop size={14} className="text-blue-500" /> Crop Margins (points, 1pt ≈ 0.35mm)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(["top", "right", "bottom", "left"] as const).map(side => (
                        <div key={side} className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-500 capitalize">{side}</label>
                          <input type="number" value={cropMargins[side]} onChange={e => setCropMargins(prev => ({ ...prev, [side]: parseInt(e.target.value) || 0 }))} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Change page size */}
                {selectedTool?.id === "change-page-size" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Target Page Size:</label>
                    <div className="flex gap-2">
                      {[
                        { id: "a4", label: "A4 (210×297mm)" },
                        { id: "letter", label: "Letter (8.5×11\")" },
                        { id: "legal", label: "Legal (8.5×14\")" },
                      ].map(size => (
                        <button key={size.id} onClick={() => setTargetPageSize(size.id as any)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${targetPageSize === size.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pages per sheet */}
                {selectedTool?.id === "pages-per-sheet" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Layout:</label>
                    <div className="flex gap-2">
                      {[
                        { n: 2, label: "2-up (1×2 Landscape)" },
                        { n: 4, label: "4-up (2×2)" },
                        { n: 9, label: "9-up (3×3)" },
                      ].map(layout => (
                        <button key={layout.n} onClick={() => setNUpLayout(layout.n as 2 | 4 | 9)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${nUpLayout === layout.n ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                          {layout.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort / Organize pages */}
                {(selectedTool?.id === "sort-pages" || selectedTool?.id === "organize") && (
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <ArrowUpDown size={14} className="text-blue-500" /> Page Order
                    </div>
                    <div className="flex gap-2 mb-1">
                      {[
                        { id: "reverse", label: "Reverse Order" },
                        { id: "custom", label: "Custom Order" },
                      ].map(opt => (
                        <button key={opt.id} onClick={() => setSortOrder(opt.id as "reverse" | "custom")} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${sortOrder === opt.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {sortOrder === "custom" && (
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Page order (comma-separated):</label>
                        <input type="text" value={pageReorderStr} onChange={e => setPageReorderStr(e.target.value)} placeholder="e.g. 3, 1, 2, 4" className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                    )}
                  </div>
                )}

                {/* Overlay */}
                {selectedTool?.id === "overlay" && (
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200/60">
                    <p className="text-xs font-bold text-indigo-800">Upload two PDF files. The second PDF will be overlaid on top of the first.</p>
                  </div>
                )}

                {/* Blacken / Redact */}
                {selectedTool?.id === "blacken" && (
                  <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <EyeOff size={14} className="text-slate-700" /> Redaction Areas
                    </div>
                    <label className="text-[11px] text-slate-500 font-medium">Format: pageNumber:x,y,width,height (one per line, coordinates in points from bottom-left)</label>
                    <textarea value={blackenAreas} onChange={e => setBlackenAreas(e.target.value)} rows={3} placeholder={"1:50,700,500,30"} className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                  </div>
                )}

                {/* Sign PDF */}
                {selectedTool?.id === "sign" && (
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <PenTool size={14} className="text-emerald-600" /> Electronic Signature
                    </div>
                    <div className="flex gap-2 mb-1">
                      <button onClick={() => setSignatureMode("type")} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${signatureMode === "type" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>Type Signature</button>
                      <button onClick={() => setSignatureMode("draw")} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${signatureMode === "draw" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>Draw Signature</button>
                    </div>
                    {signatureMode === "type" ? (
                      <input type="text" value={signatureText} onChange={e => setSignatureText(e.target.value)} placeholder="Type your signature..." className="px-3.5 py-3 bg-white rounded-xl border border-slate-200 text-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" style={{ fontFamily: "cursive, 'Brush Script MT', serif" }} />
                    ) : (
                      <div className="flex flex-col gap-2">
                        <canvas
                          ref={signatureCanvasRef}
                          width={400}
                          height={150}
                          className="bg-white rounded-xl border border-slate-200 cursor-crosshair w-full"
                          onMouseDown={(e) => {
                            setIsDrawingSignature(true);
                            const canvas = signatureCanvasRef.current;
                            if (!canvas) return;
                            const ctx = canvas.getContext("2d");
                            if (!ctx) return;
                            const rect = canvas.getBoundingClientRect();
                            const scaleX = canvas.width / rect.width;
                            const scaleY = canvas.height / rect.height;
                            ctx.beginPath();
                            ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
                          }}
                          onMouseMove={(e) => {
                            if (!isDrawingSignature) return;
                            const canvas = signatureCanvasRef.current;
                            if (!canvas) return;
                            const ctx = canvas.getContext("2d");
                            if (!ctx) return;
                            const rect = canvas.getBoundingClientRect();
                            const scaleX = canvas.width / rect.width;
                            const scaleY = canvas.height / rect.height;
                            ctx.lineWidth = 2;
                            ctx.lineCap = "round";
                            ctx.strokeStyle = "#1e293b";
                            ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
                            ctx.stroke();
                          }}
                          onMouseUp={() => setIsDrawingSignature(false)}
                          onMouseLeave={() => setIsDrawingSignature(false)}
                        />
                        <button onClick={() => { const canvas = signatureCanvasRef.current; if (canvas) { const ctx = canvas.getContext("2d"); ctx?.clearRect(0, 0, canvas.width, canvas.height); } }} className="text-xs font-bold text-red-500 hover:text-red-700 self-end cursor-pointer">Clear Canvas</button>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400 font-medium">Signature will be placed at the bottom-right of the last page.</p>
                  </div>
                )}

                {/* Edit PDF */}
                {selectedTool?.id === "edit" && (
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Edit3 size={14} className="text-emerald-500" /> Add Text to PDF
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-xs font-bold text-slate-500">Text Content:</label>
                        <input type="text" value={editTextContent} onChange={e => setEditTextContent(e.target.value)} placeholder="Enter text..." className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Font Size:</label>
                        <input type="number" value={editTextSize} onChange={e => setEditTextSize(parseInt(e.target.value) || 12)} min={6} max={72} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">On Page:</label>
                        <input type="number" value={editTextPage} onChange={e => setEditTextPage(parseInt(e.target.value) || 1)} min={1} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Text will be placed at the top-left area of the specified page.</p>
                  </div>
                )}

                {/* Annotate */}
                {selectedTool?.id === "annotate" && (
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Highlighter size={14} className="text-yellow-600" /> Add Annotation
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-xs font-bold text-slate-500">Note Text:</label>
                        <input type="text" value={annotateText} onChange={e => setAnnotateText(e.target.value)} placeholder="Add a note..." className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">On Page:</label>
                        <input type="number" value={annotatePage} onChange={e => setAnnotatePage(parseInt(e.target.value) || 1)} min={1} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">A sticky-note style annotation will be placed at the top-right of the page.</p>
                  </div>
                )}

                {/* Viewer Preferences */}
                {selectedTool?.id === "viewer-preferences" && (
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Sliders size={14} className="text-indigo-500" /> Viewer Preferences
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Page Layout:</label>
                        <select value={viewerPageLayout} onChange={e => setViewerPageLayout(e.target.value)} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                          <option value="SinglePage">Single Page</option>
                          <option value="TwoColumnLeft">Two Column</option>
                          <option value="TwoPageLeft">Two Page</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Page Mode:</label>
                        <select value={viewerPageMode} onChange={e => setViewerPageMode(e.target.value)} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                          <option value="UseNone">Default</option>
                          <option value="UseOutlines">Show Bookmarks</option>
                          <option value="UseThumbs">Show Thumbnails</option>
                          <option value="FullScreen">Full Screen</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remove Metadata info */}
                {selectedTool?.id === "remove-metadata" && (
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/60">
                    <p className="text-xs font-bold text-rose-800">All metadata (title, author, subject, keywords, creator, producer) will be stripped from the PDF.</p>
                  </div>
                )}

                {/* Repair PDF info */}
                {selectedTool?.id === "repair" && (
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
                    <p className="text-xs font-bold text-amber-800">The PDF will be re-parsed and reconstructed. This can fix structural corruption, broken cross-references, and invalid objects.</p>
                  </div>
                )}

                {/* Create Invoice */}
                {selectedTool?.id === "create-invoice" && (
                  <div className="flex flex-col gap-3 bg-green-50/50 p-4 rounded-xl border border-green-200/60">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-900">
                      <Receipt size={14} className="text-green-600" /> Invoice Details
                    </div>
                    <p className="text-[10px] text-green-700 font-medium -mt-1">No file upload needed — a PDF will be generated from the form below.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Company Name:</label>
                        <input type="text" value={invoiceData.company} onChange={e => setInvoiceData(p => ({ ...p, company: e.target.value }))} placeholder="Your Company" className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Client Name:</label>
                        <input type="text" value={invoiceData.client} onChange={e => setInvoiceData(p => ({ ...p, client: e.target.value }))} placeholder="Client Name" className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Invoice #:</label>
                        <input type="text" value={invoiceData.invoiceNum} onChange={e => setInvoiceData(p => ({ ...p, invoiceNum: e.target.value }))} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Date:</label>
                        <input type="date" value={invoiceData.date} onChange={e => setInvoiceData(p => ({ ...p, date: e.target.value }))} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500">Line Items:</label>
                      {invoiceData.items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-6 flex flex-col gap-0.5">
                            {idx === 0 && <span className="text-[10px] text-slate-400 font-bold">Description</span>}
                            <input type="text" value={item.desc} onChange={e => { const items = [...invoiceData.items]; items[idx] = { ...items[idx], desc: e.target.value }; setInvoiceData(p => ({ ...p, items })); }} className="px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800" />
                          </div>
                          <div className="col-span-2 flex flex-col gap-0.5">
                            {idx === 0 && <span className="text-[10px] text-slate-400 font-bold">Qty</span>}
                            <input type="number" value={item.qty} onChange={e => { const items = [...invoiceData.items]; items[idx] = { ...items[idx], qty: parseInt(e.target.value) || 0 }; setInvoiceData(p => ({ ...p, items })); }} min={0} className="px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800" />
                          </div>
                          <div className="col-span-3 flex flex-col gap-0.5">
                            {idx === 0 && <span className="text-[10px] text-slate-400 font-bold">Price ($)</span>}
                            <input type="number" value={item.price} onChange={e => { const items = [...invoiceData.items]; items[idx] = { ...items[idx], price: parseFloat(e.target.value) || 0 }; setInvoiceData(p => ({ ...p, items })); }} min={0} step={0.01} className="px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800" />
                          </div>
                          <div className="col-span-1 flex justify-center">
                            {invoiceData.items.length > 1 && (
                              <button onClick={() => { const items = invoiceData.items.filter((_, i) => i !== idx); setInvoiceData(p => ({ ...p, items })); }} className="text-red-400 hover:text-red-600 cursor-pointer"><X size={14} /></button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button onClick={() => setInvoiceData(p => ({ ...p, items: [...p.items, { desc: "", qty: 1, price: 0 }] }))} className="text-xs font-bold text-blue-600 hover:text-blue-700 self-start flex items-center gap-1 cursor-pointer"><Plus size={12} /> Add Item</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Tax (%):</label>
                        <input type="number" value={invoiceData.tax} onChange={e => setInvoiceData(p => ({ ...p, tax: parseFloat(e.target.value) || 0 }))} min={0} step={0.5} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Notes:</label>
                        <input type="text" value={invoiceData.notes} onChange={e => setInvoiceData(p => ({ ...p, notes: e.target.value }))} placeholder="Payment terms, etc." className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Job Application / Resume */}
                {selectedTool?.id === "job-application" && (
                  <div className="flex flex-col gap-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <FileText size={14} className="text-amber-600" /> Resume / Cover Letter Builder
                    </div>
                    <p className="text-[10px] text-amber-700 font-medium -mt-1">No file upload needed — a PDF will be generated from the form below.</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Full Name:</label>
                        <input type="text" value={resumeData.name} onChange={e => setResumeData(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Email:</label>
                        <input type="email" value={resumeData.email} onChange={e => setResumeData(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Phone:</label>
                        <input type="tel" value={resumeData.phone} onChange={e => setResumeData(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Professional Summary:</label>
                      <textarea value={resumeData.summary} onChange={e => setResumeData(p => ({ ...p, summary: e.target.value }))} rows={2} placeholder="Brief professional summary..." className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500">Experience (one entry per line):</label>
                      <textarea value={resumeData.experience} onChange={e => setResumeData(p => ({ ...p, experience: e.target.value }))} rows={3} placeholder={"Software Engineer at Acme Corp (2020-2023)\nBuilt scalable web applications..."} className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Education:</label>
                        <textarea value={resumeData.education} onChange={e => setResumeData(p => ({ ...p, education: e.target.value }))} rows={2} placeholder={"B.S. Computer Science\nMIT, 2020"} className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500">Skills:</label>
                        <textarea value={resumeData.skills} onChange={e => setResumeData(p => ({ ...p, skills: e.target.value }))} rows={2} placeholder={"JavaScript, TypeScript, React\nNode.js, Python, SQL"} className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tier 3 Coming Soon notice */}
                {(selectedTool?.id === "ocr" || selectedTool?.id === "compare" || selectedTool?.id === "edit-bookmarks" || selectedTool?.id === "fillable-form") && (
                  <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-200/80 text-center">
                    <Sparkles size={20} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-bold text-slate-700">Coming Soon</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">This feature requires additional processing libraries and is currently under development.</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400 font-medium">
                    Processed instantly in browser memory
                  </span>
                  <button
                    onClick={processPdfFile}
                    disabled={isProcessing}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        {selectedTool?.id === "compress" || selectedTool?.id === "web-optimize"
                          ? "Compressing PDF..."
                          : selectedTool?.id === "pdf-to-images" || selectedTool?.id === "extract-images" || selectedTool?.id === "convert-pdf-to"
                          ? "Rendering Images..."
                          : "Processing..."}
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        {selectedTool?.id === "compress" || selectedTool?.id === "web-optimize"
                          ? "Compress & Download PDF"
                          : selectedTool?.id === "pdf-to-images" || selectedTool?.id === "extract-images" || selectedTool?.id === "convert-pdf-to"
                          ? "Convert & Download Images"
                          : "Process & Download"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Compression Stats Banner */}
              {compressionStats && (
                <div className="w-full max-w-2xl mb-4 p-4 bg-emerald-50/90 backdrop-blur-md rounded-2xl border border-emerald-200/80 shadow-sm text-left flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-emerald-950">PDF Compressed Successfully!</h4>
                        <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full">
                          {compressionStats.ratio}% Smaller
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                        Original: <span className="font-bold">{(compressionStats.originalSize / 1024 / 1024).toFixed(2)} MB</span> → Compressed: <span className="font-bold">{(compressionStats.compressedSize / 1024 / 1024).toFixed(2)} MB</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery of rendered images */}
              {generatedImages.length > 0 && (
                <div className="w-full max-w-2xl mb-6 p-5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm text-left">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Converted Image Pages ({generatedImages.length})</h3>
                      <p className="text-[11px] text-slate-400 font-medium">High-resolution PNG renders ready for download</p>
                    </div>
                    <button
                      onClick={() => {
                        generatedImages.forEach((img, idx) => {
                          setTimeout(() => {
                            const link = document.createElement("a");
                            link.href = img.url;
                            link.download = img.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }, idx * 200);
                        });
                      }}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} /> Download All ({generatedImages.length})
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                    {generatedImages.map((img) => (
                      <div key={img.name} className="group relative bg-slate-50 rounded-xl border border-slate-200/80 p-2 overflow-hidden flex flex-col items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={`Page ${img.page}`} className="w-full h-32 object-contain rounded-lg bg-white shadow-xs border border-slate-100 mb-2" />
                        <div className="w-full flex items-center justify-between px-1">
                          <span className="text-[11px] font-bold text-slate-600">Page {img.page}</span>
                          <a
                            href={img.url}
                            download={img.name}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                            title="Download Image"
                          >
                            <Download size={13} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {processSuccess && (
                <div className="mb-4 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl flex items-center gap-1.5 border border-emerald-100">
                  <CheckCircle2 size={16} /> Processed successfully! Your download has started.
                </div>
              )}

              <button
                onClick={() => {
                  setFiles([]);
                  setProcessSuccess(false);
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Clear files & start over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Category Filter Tabs */}
      <section className="w-full max-w-7xl mx-auto px-6 mb-6 relative z-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {["All", "Popular", "Organize", "Convert", "Edit", "Security", "Page Ops", "Favorites"].map(
            (cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]"
                      : "bg-white/60 hover:bg-white/90 text-slate-600 border border-white/80 backdrop-blur-md"
                  }`}
                >
                  {cat === "Favorites" && (
                    <Star
                      size={13}
                      className={isActive ? "fill-amber-400 text-amber-400" : "text-amber-500"}
                    />
                  )}
                  {cat}
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 relative z-10">
        {filteredTools.length === 0 ? (
          <div className="w-full py-16 text-center bg-white/40 backdrop-blur-xl rounded-3xl border border-white/80">
            <Filter size={36} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No tools found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or filter category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const IconComp = tool.icon;
              const isFav = !!favorites[tool.id];
              const isSelected = selectedTool?.id === tool.id;

              return (
                <motion.div
                  key={tool.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedTool(tool);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`relative p-5 rounded-[1.8rem] border backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? "bg-white/90 border-blue-500 ring-4 ring-blue-500/15 shadow-md"
                      : "bg-white/50 hover:bg-white/80 border-white/80 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm ${tool.color}`}
                      >
                        <IconComp size={24} strokeWidth={2} />
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(e, tool.id)}
                        className="p-1.5 rounded-full hover:bg-slate-100/80 transition-colors text-slate-300 hover:text-amber-400 cursor-pointer"
                        title={isFav ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star
                          size={16}
                          className={isFav ? "fill-amber-400 text-amber-400" : ""}
                        />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                      {["ocr", "compare", "edit-bookmarks", "fillable-form"].includes(tool.id) && (
                        <span className="ml-2 inline-block px-1.5 py-0.5 text-[9px] font-extrabold bg-slate-200 text-slate-500 rounded-md align-middle">SOON</span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100/60 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider">
                      {tool.category}
                    </span>
                    <span className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Select <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/60 flex items-center justify-between text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>100% Offline Client-Side Engine</span>
        </div>
        <span>Zero server uploads &bull; Fast & Private</span>
      </footer>
    </main>
  );
}

