package com.careerportal.career_portal_backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    
    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/upload/resume")
    public ResponseEntity<Map<String, String>> uploadResume(@RequestParam("file") MultipartFile file) {
        logger.info("Received resume upload request for file: {}", file.getOriginalFilename());
        return uploadFile(file, "resumes", new String[]{"pdf", "doc", "docx"});
    }

    @PostMapping("/upload/photo")
    public ResponseEntity<Map<String, String>> uploadPhoto(@RequestParam("file") MultipartFile file) {
        logger.info("Received photo upload request for file: {}", file.getOriginalFilename());
        return uploadFile(file, "photos", new String[]{"jpg", "jpeg", "png", "gif"});
    }

    private ResponseEntity<Map<String, String>> uploadFile(MultipartFile file, String subDir, String[] allowedExtensions) {
        Map<String, String> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("error", "Please select a file to upload");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file extension
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                response.put("error", "Invalid file name");
                return ResponseEntity.badRequest().body(response);
            }

            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
            boolean validExtension = false;
            for (String ext : allowedExtensions) {
                if (ext.equals(fileExtension)) {
                    validExtension = true;
                    break;
                }
            }

            if (!validExtension) {
                response.put("error", "Invalid file type. Allowed types: " + String.join(", ", allowedExtensions));
                return ResponseEntity.badRequest().body(response);
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir, subDir);
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String uniqueFilename = UUID.randomUUID().toString() + "." + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Copy file to the target location
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String relativePath = subDir + "/" + uniqueFilename;
            response.put("filePath", relativePath);
            response.put("originalName", originalFilename);
            response.put("message", "File uploaded successfully");

            logger.info("File uploaded successfully: {}", relativePath);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            logger.error("Error uploading file", e);
            response.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}