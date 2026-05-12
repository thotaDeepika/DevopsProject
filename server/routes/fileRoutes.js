const express = require('express');
const router = express.Router();
const { uploadFile, getWorkspaceFiles } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

router.post('/', protect, upload.single('file'), uploadFile);
router.get('/workspace/:workspaceId', protect, getWorkspaceFiles);

module.exports = router;
