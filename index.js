var express = require('express');
var parser = require('body-parser');
var app = express();


var dataFile = require('./app/data/request.json');

app.use(parser.json());
app.use(parser.urlencoded({extended: true}))



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/api', function(request, response) {
  response.json(dataFile);
});

app.use(function(err, req, res, next) {
    //do logging and user-friendly error message display
    res.set('Content-Type', 'application/json');
    error = {"error": "Could not decode request: JSON parsing failed" };
    res.status(400);
    res.send(JSON.stringify(error));
})


app.post('/', function (req, res) {
    
    if (Object.keys(req.body).length) {
        r = { "response": [] };
        // loop through the payload
        for (index in req.body.payload) {
            data = req.body.payload[index];

            if ((! data.image ) || (! data.image.showImage)) {
                continue ;
            }

            if (! data.drm) {
                continue ;
            }

            if (! data.episodeCount) {
                continue ;
            }

            m = { "image": data.image.showImage, "slug": data.slug,"title": data.title };
            r.response.push(m);
        }
        res.set('Content-Type', 'application/json');
        //res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(r));
    }
    else {
        error = {"error": "Could not decode request: JSON parsing failed" };
        res.status(400);
        res.send(JSON.stringify(error));
    }
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


