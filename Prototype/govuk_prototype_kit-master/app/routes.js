module.exports = {
    bind : function (app) {

        app.get('/', function (req, res) {
            res.render('index');
        });

        app.get('/examples/template-data', function (req, res) {
            res.render('examples/template-data', { 'name' : 'Foo' });
        });

        // add your routes here
        app.get('application_form_personal_details', function (req, res) {
            res.render('application_form_personal_details', {'message' : 'Hello world' , 'text' : 'Oh dear'});
        });

        app.get('application_form_address', function (req, res) {
            res.render('application_form_address', {'message' : 'Hello world' , 'text' : 'Oh dear'});
        });

        app.get('application_form_payment', function (req, res) {
            res.render('application_form_payment', {'message' : 'Hello world' , 'text' : 'Oh dear'});
        });

        app.get('application_form_fail_address', function (req, res) {
            res.render('application_form_fail_address', {'message' : 'Hello world' , 'text' : 'Oh dear'});
        });
        app.get('application_form_confirmation', function (req, res) {
            res.render('application_form_confirmation', {'message' : 'Hello world' , 'text' : 'Oh dear'});
        });


    }
};
