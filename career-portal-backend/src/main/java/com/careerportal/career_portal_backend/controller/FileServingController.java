package com.careerportal.career_portal_backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class FileServingController {

    private static final Logger logger = LoggerFactory.getLogger(FileServingController.class);
    
    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    @GetMapping("/resumes/{filename:.+}")
    public ResponseEntity<Resource> serveResumeFile(@PathVariable String filename) {
        return serveFile("resumes", filename);
    }

    @GetMapping("/photos/{filename:.+}")
    public ResponseEntity<Resource> servePhotoFile(@PathVariable String filename) {
        return serveFile("photos", filename);
    }

    @GetMapping("/debug/files")
    public ResponseEntity<String> debugFiles() {
        try {
            Path uploadsPath = Paths.get(uploadDir);
            StringBuilder debug = new StringBuilder();
            debug.append("Upload directory: ").append(uploadsPath.toAbsolutePath()).append("\n");
            debug.append("Directory exists: ").append(uploadsPath.toFile().exists()).append("\n");
            
            if (uploadsPath.toFile().exists()) {
                debug.append("Contents:\n");
                java.io.File[] files = uploadsPath.toFile().listFiles();
                if (files != null) {
                    for (java.io.File file : files) {
                        debug.append("  ").append(file.getName()).append(" (").append(file.isDirectory() ? "dir" : "file").append(")\n");
                        if (file.isDirectory()) {
                            java.io.File[] subFiles = file.listFiles();
                            if (subFiles != null) {
                                for (java.io.File subFile : subFiles) {
                                    debug.append("    ").append(subFile.getName()).append("\n");
                                }
                            }
                        }
                    }
                }
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }

    private ResponseEntity<Resource> serveFile(String subDir, String filename) {
        try {
            Path filePath = Paths.get(uploadDir, subDir, filename);
            logger.info("Attempting to serve file: {} (absolute: {})", filePath, filePath.toAbsolutePath());
            
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                logger.info("Successfully serving file: {}", filePath);
                
                // Determine content type
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                        .body(resource);
            } else {
                logger.warn("File not found or not readable: {} (exists: {}, readable: {})", 
                    filePath, resource.exists(), resource.isReadable());
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            logger.error("Error serving file: {}/{}", subDir, filename, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Unexpected error serving file: {}/{}", subDir, filename, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private String determineContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        
        switch (extension) {
            case "pdf":
                return "application/pdf";
            case "doc":
                return "application/msword";
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            default:
                return "application/octet-stream";
        }
    }
}