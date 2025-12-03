
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer middleware
const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadDir));

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Explicit GET route to serve the index.html file
app.get('/', (req, res) => {
    // Send the index.html file located in the 'public' directory
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));


    //loading files in upload folder
    fs.readdir(uploadDir, (err, files) => {
        if(err) {
            console.log('error', err)
            files = [];
        }

        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLocaleLowerCase();
            return ext === '.png' || ext === '.jpg' || ext === '.jpeg'
        })

        console.log(imageFiles)

        res.render('gallery-page', {
            imageNames : imageFiles 
        })
    })


});

// The POST route to handle the file upload
app.post('/upload-image', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File uploaded:', req.file.filename);
    res.status(200).send(`
        <h2>File uploaded successfully!</h2>
        <p>File path: /uploads/${req.file.filename}</p>
        <img src="/uploads/${req.file.filename}" alt="Uploaded Image" style="max-width: 300px;">
        <br><a href="/">Upload another file</a>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/*
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Ensure the 'screenshots' directory exists
const uploadDir = 'screenshots';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure multer for file storage
// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save files in the 'screenshots' directory
    },
    filename: function (req, file, cb) {
        // Create a unique filename with a timestamp
        cb(null, 'screenshot-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST endpoint to receive the screenshot
app.post('/screenshot', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(`Received and saved screenshot: \${req.file.filename}`);
    res.status(200).send('Screenshot received successfully.');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:\${port}`);
    console.log(`Waiting for screenshots on /screenshot endpoint...`);
});
*/