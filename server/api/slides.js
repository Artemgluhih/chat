const express = require('express');
const router = express.Router();


const slides = [
  { url: '/images/slide1.png' },
  { url: '/images/slide2.png' },
  { url: '/images/slide3.png' },
  { url: '/images/slide4.png' },
  { url: '/images/slide5.png' },
  { url: '/images/slide6.png' },
  { url: '/images/slide7.png' }
];


router.get('/', (req, res) => {
  res.json(slides);
});

module.exports = router;
