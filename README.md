The light ES6 syntax. With many of the great features from CoffeeScript landing in ES6, but a very conservative path for ES6 feature to come to coffeescript (and many ES5 features still not in coffeescript *cough*named functions*cough*), AmericanoScript will bridge the gap as merely a reduction of some "clutter" in the language.

AmericanoScript Syntax is an ES6 shorthand, with these features:

* [X] Indent/Dedent  to control blocks (Python, Coffeescript)
* [X] CS Aliases (`and`, `or`, `is`)
* [X] No Semicolons (Insert a semicolon at end of every non-ambiguous line)
* [ ] Existential Operator (`foo.bar?.baz?`)
* [ ] Heredocs `"""`, #{} for interpolation.
* [ ] Literate (markdown document, with parsed code blocks.)
* [ ] Array slice/splice (`foo.bar[i..j]`, `foo.bar[m...n] = []`)
* [ ] Block Regex `/// ... ///` with whitespace.
* [ ] Drop parens around control structures (`if`, `for`, `while`, `switch`)

Targets - while not targeting these languages specifically, using the features should "Just Work".

* [ ] AtScript

    ```javascript
    @Component()
    class MyApp
      server:Server
      @Bind('name') name:string
      @Event('foo') fooFn:Function

      @Inject()
      constructor(@parent server:Server) {}
      greet():string {}
    ```

    Compiles to

    ```javascript
    @Component()
    class MyApp {
      server:Server;
      @Bind('name') name:string;
      @Event('foo') fooFn:Function;

      @Inject()
      constructor(@parent server:Server) {}
      greet():string {}
    }
    ```

* [ ] TypeScript

    ```typescript
    class Greeter
        constructor(public greeting: string) { }
        greet()
            return "<h1>" + this.greeting + "</h1>"

    var greeter = new Greeter("Hello, world!")
    var str = greeter.greet()
    document.body.innerHTML = str
    ```

    Compiles to

    ```typescript
    class Greeter {
        constructor(public greeting: string) { }
        greet() {
            return "<h1>" + this.greeting + "</h1>";
        }
    }
    var greeter = new Greeter("Hello, world!")
    var str = greeter.greet()
    document.body.innerHTML = str;
    ```
* [ ] ES6

* [ ] ES5

    ```javascript
    var Path = require('path')
    module.exports = function bootstrapConfig(config)
        config.vendors = config.vendors or {}
        config.vendors.prefix = config.vendors.prefix or []
        config.vendors.prefix.push(Path.resolve(__dirname, '../node_modules'))

        config.vendors.js = (config.vendors.js or []).concat([
            'jquery/dist/jquery.js',
            'bootstrap/dist/js/bootstrap.js',
        ])

        config.vendors.css = (config.vendors.css or []).concat([
            'bootstrap/dist/css/bootstrap.css',
            'bootstrap/dist/css/bootstrap-theme.css',
        ])
        return config
    ```

    compiles to

    ```javascript
    var Path = require('path')
    module.exports = function bootstrapConfig(config) {
        config.vendors = config.vendors || {}
        config.vendors.prefix = config.vendors.prefix || []
        config.vendors.prefix.push(Path.resolve(__dirname, '../node_modules'))

        config.vendors.js = (config.vendors.js || []).concat([
            'jquery/dist/jquery.js',
            'bootstrap/dist/js/bootstrap.js'
        ])

        config.vendors.css = (config.vendors.css || []).concat([
            'bootstrap/dist/css/bootstrap.css',
            'bootstrap/dist/css/bootstrap-theme.css',
        ])
        return config;
    }
    ```

# Changelog

* **0.0.1** *2014-11-08* First implementation of faux-compiler.
