const express = require('express');
const cssRouter = express.Router();
const jsRouter = express.Router();
const assetsRouter = express.Router();

// CSS files route
cssRouter.use(express.static('css'));
cssRouter.get('/:slug', (req, res) => {
    res.sendFile(`${__dirname}/css/${req.params.slug}`);
});

// JavaScript files route
jsRouter.use(express.static('js'));
jsRouter.get('/:slug', (req, res) => {
    res.sendFile(`${__dirname}/js/${req.params.slug}`);
});

// Assets route
assetsRouter.use(express.static('assets'));
assetsRouter.get('/:slug', (req, res) => {
    res.sendFile(`${__dirname}/assets/${req.params.slug}`);
});

module.exports = {
    cssRouter,
    jsRouter,
    assetsRouter
};
