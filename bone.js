/**
 * Bone.js 0.0.1
 * (c) 2010-2015 zechau
 *
 * a small JS framework providing model + view
 * this project is inspired by Backbone.js
 */

(function(factory){
    window.Bone = factory(window, {});

}(function(root, Bone){

    var previousBone = root.Bone;

    // Current version of the library. Keep in sync with `package.json`.
    Bone.VERSION = '0.0.1';

    // Runs Bone.js in *noConflict* mode, returning the `Bone` variable
    // to its previous owner. Returns a reference to this Backbone object.
    Bone.noConflict = function() {
        root.Bone = previousBone;
        return this;
    };

    Bone.Model = function(attributes, options){
        var attrs;
        attributes = attributes || {};
        arguments.length > 1 ? attrs = attributes : options = attributes;
        this.attributes = {};
        this.set(attrs);
        this._old_ = {};
        for(var key in options){
            if(this[key]){
                this._old_[key] = this[key];
            }
            this[key] = options[key];
        }
        this.initialize.apply(this, arguments);
    };

    Bone.Model.prototype = {
        constructor: Bone.Model,
        initialize: function(){},
        setUrl: function(base, params){
            var query = [];
            params = params || {};
            for(var key in params){
                query.push(key + '=' + params[key]);
            }
            return this.url = base + '?' + query.join('&');
        },
        fetch: function(){
            var args = Array.prototype.slice.call(arguments, 0);
            Bone.sync.apply(this, ['read'].concat(args));
        },
        set: function(attrs){
            for(var key in attrs){
                this.attributes[key] = attrs[key];
            }
        },
        parse: function(){},
        toJSON: function(){
            return this.attributes;
        },
        get: function(key){
            return this.attributes[key];
        }
    }

    Bone.View = function(options){
        options = options || {};

        this._old_ = {};
        for(var key in options){
            if(this[key]){
                this._old_[key] = this[key];
            }
            this[key] = options[key];
        }

        this.el = this.el || document.createElement(this.tagName || 'div');
        this.initialize.apply(this, arguments);
    }
    Bone.View.prototype = {
        constructor: Bone.View,
        initialize: function(){},
        render: function(){},
        template: function(){
            return '';
        }
    }

    Bone.templateEngine = function(tpl, data){
        var fn = new Function("obj",
            "var p=[];" +
            "with(obj){p.push('" + tpl
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'") + "');} return p.join('');");

        return data ? fn(data) : fn;
    }

    Bone.sync = function (method, opts) {
        //nee to be overrode
    }

    Bone.Model.extend = Bone.View.extend = function(protoProps){
        var parent = this,
            child;

        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        //copy static properties
        for(var k in parent){
            child[k] = parent[k];
        }

        for(k in parent.prototype){
            child.prototype[k] = parent.prototype[k];
        }

        for(k in protoProps){
            child.prototype[k] = protoProps[k];
        }
    }

    return Bone;
}));
