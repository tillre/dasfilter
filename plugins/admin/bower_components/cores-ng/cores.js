(function() {

  //
  // module definitions
  //

  angular.module('cores',
                 ['ng',
                  'cores.services',
                  'cores.filters',
                  'cores.templates',
                  'cores.controllers',
                  'cores.directives']);

  angular.module('cores.services',
                 ['ng']);

  angular.module('cores.templates',
                 ['ng']);

  angular.module('cores.filters',
                 ['ng']);

  angular.module('cores.controllers',
                 ['ng']);

  angular.module('cores.directives',
                 ['ng',
                  'cores.services',
                  'cores.templates']);

})();
angular.module('cores').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('cr-array-controls.html',
    "<div ng-switch=\"numSchemas\">\n" +
    "\n" +
    "  <div ng-switch-when=\"1\" class=\"cr-array-top-controls btn-group\">\n" +
    "    <button ng-click=\"addItem()\" class=\"btn btn-default btn-xs\" type=\"button\">\n" +
    "      <span class=\"glyphicon glyphicon-plus\"></span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-switch-default class=\"btn-group\">\n" +
    "    <button class=\"btn btn-default btn-xs dropdown-toggle\"\n" +
    "            data-toggle=\"dropdown\" href=\"#\">\n" +
    "      <span class=\"glyphicon glyphicon-plus\"></span><span class=\"caret\"/>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "      <li ng-repeat=\"schema in schemas\">\n" +
    "        <a ng-click=\"addItem(schema)\">{{ schema.name }}</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('cr-array.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "\n" +
    "  <div ng-class=\"{ 'cr-indent': options.indent }\">\n" +
    "\n" +
    "    <div cr-array-controls index=\"0\" schemas=\"schemas\"></div>\n" +
    "\n" +
    "    <ul class=\"list-unstyled\">\n" +
    "      <li ng-repeat=\"item in model\" class=\"cr-item-group\">\n" +
    "\n" +
    "        <div class=\"cr-item-wrapper\" ng-class=\"{ 'has-label': showSchemaName }\">\n" +
    "          <div class=\"cr-item-controls btn-group\">\n" +
    "            <button class=\"btn btn-default btn-xs\" ng-click=\"moveUp($index)\" type=\"button\">\n" +
    "              <span class=\"glyphicon glyphicon-arrow-up\"></span>\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-default btn-xs\" ng-click=\"moveDown($index)\" type=\"button\">\n" +
    "              <span class=\"glyphicon glyphicon-arrow-down\"></span>\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-danger btn-xs\" ng-click=\"remove($index)\" type=\"button\">\n" +
    "              <span class=\"glyphicon glyphicon-minus\"></span>\n" +
    "            </button>\n" +
    "          </div>\n" +
    "\n" +
    "          <label class=\"cr-item-label\">{{ item.type_ }}</label>\n" +
    "\n" +
    "          <div cr-array-item\n" +
    "               model=\"item\"\n" +
    "               get-schema=\"getSchema(item.type_)\"\n" +
    "               path=\"{{ path }}.{{ $index }}\">\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div cr-array-controls index=\"$index + 1\" schemas=\"schemas\"></div>\n" +
    "\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-boolean.html',
    "<div class=\"checkbox\">\n" +
    "  <label class=\"control-label\">\n" +
    "    <input type=\"checkbox\" ng-model=\"model\"> {{label}}\n" +
    "  </label>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-control.html',
    "<div class=\"form-group\"\n" +
    "     ng-class=\"{ 'has-error': (dirty && !valid) || (required && !dirty) }\">\n" +
    "</div>"
  );


  $templateCache.put('cr-datetime.html',
    "<div class=\"row\">\n" +
    "  <label class=\"col-md-12 control-label\" ng-show=\"options.showLabel\">{{ label }}</label>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"input-group date\">\n" +
    "      <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar\"></span></span>\n" +
    "      <input type=\"text\" class=\"form-control\" data-format=\"D.MM.YYYY\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-3\">\n" +
    "    <div class=\"input-group time\">\n" +
    "      <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-time\"></span></span>\n" +
    "      <input type=\"text\" class=\"form-control\" data-format=\"H:mm\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-enum.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "  <select class=\"form-control\" ng-model=\"model\" ng-options=\"e for e in schema.enum\"></select>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-image-preview.html',
    "<div class=\"thumbnail\">\n" +
    "  <img ng-src=\"{{ baseUrl }}{{ model.file.url }}\">\n" +
    "</div>\n"
  );


  $templateCache.put('cr-image.html',
    "<div>\n" +
    "  <label class=\"control-label\">{{ label }}</label>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div class=\"thumbnail\">\n" +
    "        <img class=\"img-rounded\" height=\"140\" ng-src=\"{{ imgSrc }}\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <span class=\"btn btn-default cr-btn-file\">\n" +
    "        Browse <input type=\"file\">\n" +
    "      </span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-markdown.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "\n" +
    "  <div class=\"cr-editor clearfix\" ng-class=\"{ 'cr-border': options.showBorder }\">\n" +
    "    <textarea class=\"form-control cr-editor-area\" ng-model=\"model\" rows=\"1\"></textarea>\n" +
    "    <div class=\"cr-editor-preview\"></div>\n" +
    "    <div class=\"btn-group pull-right\">\n" +
    "      <button class=\"btn btn-default btn-sm\" ng-click=\"togglePreview()\" type=\"button\">\n" +
    "        {{ isPreview ? \"Edit\" : \"Preview\" }}\n" +
    "      </button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"dirty && !valid\">\n" +
    "      <p class=\"help-block\" ng-show=\"errors.maxLength\">Text is longer than {{ schema.maxLength }}</p>\n" +
    "      <p class=\"help-block\" ng-show=\"errors.minLength\">Text is shorter than {{ schema.minLength }}</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('cr-model-form.html',
    "<div>\n" +
    "  <form name=\"modelForm\"></form>\n" +
    "  <div ng-show=\"debug\">\n" +
    "    <h4>Model</h4>\n" +
    "    <pre>{{ model | json }}</pre>\n" +
    "    <h4>Validation:</h3>\n" +
    "    <ul>\n" +
    "      <li ng-repeat=\"(valid, name) in errors\">{{ name }} {{ valid }}</li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('cr-model-list-modal.html',
    "<div id=\"{{modalId}}\" class=\"modal fade\" tabindex=\"-1\">\n" +
    "  <div class=\"modal-dialog\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "        <h4 class=\"modal-title\">{{type}}</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\">\n" +
    "        <div cr-model-list\n" +
    "             type=\"{{type}}\"\n" +
    "             view=\"list.view\"\n" +
    "             params=\"list.params\"\n" +
    "             columns=\"list.columns\"\n" +
    "             autoload=\"false\"></div>\n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button ng-click=\"cancel\" class=\"btn btn-default pull-right\" data-dismiss=\"modal\">Cancel</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-model-list.html',
    "<div>\n" +
    "  <table class=\"table table-striped\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th ng-repeat=\"title in titles\">{{title}}</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"row in rows\" style=\"cursor:pointer;\" ng-click=\"select(row.id)\">\n" +
    "        <td ng-repeat=\"item in row.items\" ng-bind-html=\"item.value\"></td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "  <div ng-show=\"enablePrev || enableNext\">\n" +
    "    <ul class=\"pagination\">\n" +
    "      <li class=\"{{ !isLoading && enablePrev ? '' : 'disabled' }}\">\n" +
    "        <a href=\"\" ng-click=\"prev()\">Prev</a>\n" +
    "      </li>\n" +
    "      <li class=\"{{ !isLoading && enableNext ? '' : 'disabled' }}\">\n" +
    "        <a href=\"\" ng-click=\"next()\">Next</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('cr-model-resource.html',
    "<div>\n" +
    "  <div id=\"delete-modal\" class=\"modal fade\" tabindex=\"-1\">\n" +
    "    <div class=\"modal-dialog\">\n" +
    "      <div class=\"modal-content\">\n" +
    "        <div class=\"modal-header\">\n" +
    "          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
    "          <h4 class=\"modal-title\">Confirm deletion</h4>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "          <p>Really delete?</p>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "          <button class=\"btn btn-default pull-left\" data-dismiss=\"modal\" type=\"button\">Cancel</button>\n" +
    "          <button class=\"btn btn-danger\" ng-click=\"destroy()\" data-dismiss=\"modal\" type=\"button\">Delete</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div cr-model-form schema=\"schema\" model=\"model\" valid=\"valid\" debug=\"debug\"></div>\n" +
    "\n" +
    "  <div ng-switch on=\"state\">\n" +
    "    <div ng-switch-when=\"loading\" class=\"alert alert-info\">Loading...</div>\n" +
    "    <div ng-switch-when=\"saving\" class=\"alert alert-info\">Saving...</div>\n" +
    "    <div ng-switch-when=\"error\" class=\"alert alert-danger\">\n" +
    "      {{ error.message }}\n" +
    "      <ul>\n" +
    "        <li ng-repeat=\"e in unhandledErrors\">{{ e }}</li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div class=\"cr-model-controls well well-sm\">\n" +
    "    <div class=\"btn-toolbar\">\n" +
    "      <div class=\"btn-group\">\n" +
    "        <button ng-click=\"save()\" ng-class=\"{ disabled: !valid }\" class=\"btn btn-primary\" type=\"button\">Save</button>\n" +
    "      </div>\n" +
    "\n" +
    "      <button ng-click=\"toggleDebug()\" class=\"btn btn-default pull-right\" type=\"button\">Debug</button>\n" +
    "      <button ng-click=\"askDestroy()\" ng-show=\"!isNew() && !options.disableDelete\" class=\"btn btn-danger pull-right\" type=\"button\">Delete</button>\n" +
    "\n" +
    "      <div class=\"btn-group\">\n" +
    "        <button ng-repeat=\"button in options.buttons\"\n" +
    "                ng-click=\"buttonClick($event, button.event)\"\n" +
    "                class=\"btn btn-default\" type=\"button\">\n" +
    "          <span ng-if=\"button.icon\" class=\"glyphicon glyphicon-{{button.icon}}\"></span>\n" +
    "          {{button.title}}\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-multi-select-ref.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "\n" +
    "  <div ng-class=\"{ 'cr-indent': options.indent }\">\n" +
    "    <ul class=\"list-unstyled\">\n" +
    "      <li class=\"checkbox\" ng-repeat=\"row in rows\">\n" +
    "        <label class=\"control-label\">\n" +
    "          <input type=\"checkbox\" ng-model=\"row.selected\"/> {{ row.name }}\n" +
    "        </label>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-number.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "  <input class=\"form-control\" type=\"number\" ng-model=\"model\"/>\n" +
    "\n" +
    "  <div ng-show=\"dirty && !valid\">\n" +
    "    <p class=\"help-block\" ng-show=\"errors.multipleOf\">Number should be a multiple of {{ schema.multipleOf }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.minimum\">Number should be smaller or equal to {{ schema.minimum }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.maximum\">Number should be greater or equal to {{ schema.maximum }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.integer\">Number should be an integer</p>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-object.html',
    "<div>\n" +
    "  <label class=\"control-label cr-object-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "  <div ng-class=\"{ 'cr-indent': options.indent, 'form-inline': options.inline }\"\n" +
    "       class=\"properties\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-password.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <input class=\"form-control\" type=\"password\" ng-model=\"pass1\"/>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <input class=\"form-control\" type=\"password\" ng-model=\"pass2\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"dirty && !valid\">\n" +
    "    <p class=\"help-block\" ng-show=\"errors.maxLength\">Text is longer than {{ schema.maxLength }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.minLength\">Text is shorter than {{ schema.minLength }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.match\">Passwords do not match</p>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-readonly.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "  <span class=\"form-control\" disabled>{{ model }}</span>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-ref-preview.html',
    "<p>\n" +
    "  <span ng-repeat=\"path in options.previewPaths\">{{ model | crJsonPointer:path }}&nbsp;</span>\n" +
    "</p>\n"
  );


  $templateCache.put('cr-ref.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "\n" +
    "  <div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-body\">\n" +
    "      <div ng-show=\"model.id_\" class=\"cr-preview\"></div>\n" +
    "\n" +
    "      <div class=\"cr-ref-controls\">\n" +
    "        <div class=\"btn-group\">\n" +
    "          <button ng-click=\"newModel()\" ng-show=\"!options.selectOnly\" class=\"btn btn-default\" type=\"button\">New</button>\n" +
    "          <button ng-click=\"editModel()\" ng-show=\"hasModel() && !options.selectOnly\" class=\"btn btn-default\" type=\"button\">Edit</button>\n" +
    "          <button ng-click=\"selectModel()\" class=\"btn btn-default\" type=\"button\">Select</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"showModel\" class=\"panel-footer\">\n" +
    "      <div cr-model-resource type=\"{{ schema.$ref }}\" model-id=\"modelId\" defaults=\"options.defaults\" options=\"modelOptions\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div cr-model-list-modal\n" +
    "       modal-id=\"{{selectModalId}}\"\n" +
    "       type=\"{{schema.$ref}}\"\n" +
    "       list=\"options.list\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-single-select-ref.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "\n" +
    "  <select class=\"form-control\" ng-model=\"selectedRow\" ng-options=\"r.name for r in rows\">\n" +
    "    <option value=\"\">-- choose --</option>\n" +
    "  </select>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-slug.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "  <div class=\"input-group\">\n" +
    "    <span class=\"input-group-btn\">\n" +
    "      <button ng-click=\"generate()\" class=\"btn btn-default\" type=\"button\">Generate</button>\n" +
    "    </span>\n" +
    "    <input class=\"form-control\" type=\"text\" ng-model=\"model\"/>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"dirty && !valid\">\n" +
    "    <p class=\"help-block\" ng-show=\"errors.maxLength\">Slug is longer than {{ schema.maxLength }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.minLength\">Slug is shorter than {{ schema.minLength }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.format\">Slug does not match format</p>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-string.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "  <input class=\"form-control\" type=\"text\" ng-model=\"model\"/>\n" +
    "\n" +
    "  <div ng-show=\"dirty && !valid\">\n" +
    "    <p class=\"help-block\" ng-show=\"errors.maxLength\">Text is longer than {{ schema.maxLength }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.minLength\">Text is shorter than {{ schema.minLength }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.pattern\">Text does not conform to pattern</p>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('cr-tags.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "\n" +
    "      <div class=\"input-group\">\n" +
    "        <input class=\"form-control\" type=\"text\" ng-model=\"currentTag\"/>\n" +
    "        <span class=\"input-group-btn\">\n" +
    "          <button ng-click=\"createTag()\" class=\"btn btn-default\" type=\"button\">Create</button>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"cr-tag-matches\">\n" +
    "        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "          <li ng-repeat=\"match in matches\" ng-class=\"{ active: activeListIndex === $index }\">\n" +
    "            <a ng-click=\"selectMatch(match)\">{{ match.doc.name }}</a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "\n" +
    "      <div>\n" +
    "        <ul class=\"list-inline\">\n" +
    "          <li ng-repeat=\"tag in model\" ng-click=\"removeTag($index)\">\n" +
    "            <span class=\"label label-primary\">{{ getTagName(tag.id_) }}  <span class=\"glyphicon glyphicon-remove\"></span> </span>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div ng-show=\"error\" class=\"alert alert-danger\">{{ error.message }}</div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('cr-text.html',
    "<div>\n" +
    "  <label class=\"control-label\" ng-show=\"options.showLabel\">{{ label }}:</label>\n" +
    "  <textarea class=\"form-control\" ng-model=\"model\" rows=\"1\"/>\n" +
    "\n" +
    "  <div ng-show=\"dirty && !valid\">\n" +
    "    <p class=\"help-block\" ng-show=\"errors.maxLength\">Text is longer than {{ schema.maxLength }}</p>\n" +
    "    <p class=\"help-block\" ng-show=\"errors.minLength\">Text is shorter than {{ schema.minLength }}</p>\n" +
    "  </div>\n" +
    "</div>"
  );

}]);

(function() {

  var module = angular.module('cores.filters');

  module.filter('crJsonPointer', function(crCommon, crJSONPointer) {

    return function(input, path) {
      if (!input) return null;
      return crJSONPointer.get(input, path);
    };
  });

})();
(function() {

  var module = angular.module('cores.services');


  module.factory('crBuild', function($compile, crCommon, crSchema, crJSONPointer) {

    function getType(schema) {
      var type = schema.type;

      // infer some types
      if (!schema.type) {
        if (schema.properties) type = 'object';
        if (schema.items) type = 'array';
      }

      // handle extended types
      if (schema.hasOwnProperty('enum')) {
        type = 'enum';
      }
      else if (schema.hasOwnProperty('$ref')) {
        type = 'ref';
      }

      // add namespace prefix for default views
      type = 'cr-' + type;

      if (schema.view) {
        if (!angular.isObject(schema.view)) {
          throw new Error('schema.view has to be an object ' + JSON.stringify(schema.view));
        }
        // custom type
        type = schema.view.type || type;
      }

      return type;
    }


    function getLabel(schema, path) {
      var label = schema.type;

      if (schema.title) {
        label = schema.title;
      }
      else if (schema.name) {
        label = crCommon.capitalize(schema.name);
      }
      else if (path) {
        var parts = path.split('.');
        label = crCommon.capitalize(parts[parts.length - 1]);
      }

      if (schema.hasOwnProperty('view') && angular.isObject(schema.view)) {
        label = schema.view.name || label;
      }
      return label;
    }


    function buildControl(scope, schemaPath, modelPath, absPath, required) {
      var tmpl = '<div cr-control'
            + ' model="' + (modelPath || 'model') + '"'
            + ' schema="' + (schemaPath || 'schema') + '"'
            + ' path="' + (absPath || '') + '"';
      if (required) {
        tmpl += ' required';
      }
      tmpl += '></div>';
      return $compile(tmpl)(scope);
    }


    function buildType(scope, schema) {
      var tmpl = '<div ' + getType(schema) + '></div>';
      return $compile(tmpl)(scope);
    }


    function buildProperties(scope, schema, model, path) {

      function isRequired(name) {
        var req = schema.required || [];
        return req.indexOf(name) !== -1;
      };

      return Object.keys(schema.properties).filter(function(key) {
        // ignore some keys
        return !crSchema.isPrivateProperty(key);

      }).map(function(key) {
        // create a control for each object property
        var subSchema = schema.properties[key];
        var absPath = (path ? path + '.' : '') + key;

        if (!model.hasOwnProperty(key)) {
          model[key] = crSchema.createValue(subSchema);
        }
        return {
          schema: subSchema,
          path: absPath,
          elem:  buildControl(scope,
                              'schema.properties.' + key,
                              'model.' + key,
                              absPath,
                              isRequired(key))
        };
      });
    }


    return {
      getType: getType,
      getLabel: getLabel,

      buildControl: buildControl,
      buildType: buildType,
      buildProperties: buildProperties
    };
  });

})();

(function() {

  var module = angular.module('cores.services');

  // Create a new file id
  var createFileId = (function(id) {
    return function() { return 'file' + ++id; };
  })(0);


  // Create a new modal id
  var createModalId = (function(id) {
    return function() { return 'modal-' + ++id; };
  })(0);


  var slugify = function(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    var slug = '';
    var map = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
                '/': '-', '_': '-', ',': '-', ':': '-', ';': '-', '.': '-' };

    for (var i = 0; i < str.length; ++i) {
      var c = str.charAt(i);
      slug += map[c] || c;
    }

    slug = slug.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes
      .replace(/^-|-$/g, ''); // trim dashes

    return slug;
  };


  var capitalize = function(str) {
    if (!str || str.length === 0) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.substr(1);
  };


  var trim = function(str) {
    return this.replace(/^\s+|\s+$/g, '');
  };


  module.service('crCommon', function($q) {

    return {
      createFileId: createFileId,
      createModalId: createModalId,

      slugify: slugify,
      capitalize: capitalize
    };
  });

})();
(function() {

  var module = angular.module('cores.services');

  // TODO: very incomplete implmentation


  function jsonPointerGet(obj, path) {
    // TODO: array paths
    if (!path) return obj;
    var parts = path.split('/');
    if (parts.length && parts[0] === '') parts.shift();
    if (parts.length && parts[parts.length - 1] === '') parts.pop();
    if (parts.length === 0) return obj;

    var value = obj[parts[0]];
    for (var i = 1; i < parts.length; ++i) {
      if (!value) break;
      value = value[parts[i]];
    }
    return value;
  }


  function jsonPointerSet(obj, path, value) {
    // TODO: array paths
    var parts = path.split('/');
    if (parts.length && parts[0] === '') parts.shift();
    if (parts.length && parts[parts.length - 1] === '') parts.pop();
    if (parts.length === 0) return;

    var o = obj;
    var p = parts[0];

    while(true) {
      parts.shift();
      if (parts.length === 0) {
        o[p] = value;
        return;
      }
      o = o[p];
      p = parts[0];
    }
  }


  function toObjectNotation(path) {
    var parts = path.split('/');
    var onot = '';

    parts.forEach(function(p) {
      if (p === '') return;
      if (isNaN(p)) {
        // property
        onot += (onot.length > 0 ? '.' : '') + p;
      }
      else {
        // array index
        onot += '[' + parseInt(p, 10) + ']';
      }
    });
    return onot;
  }


  //
  // json pointer get/set service
  //
  module.service('crJSONPointer', function() {

    return {
      get: jsonPointerGet,
      set: jsonPointerSet,
      toObjectNotation: toObjectNotation
    };
  });

})();
(function() {

  var module = angular.module('cores.services');

  //
  // Create an error object from a response
  //
  function makeError(response) {

    var msg = response.msg || '';
    if (!msg && response.data) {
      msg = response.data.message || response.data.error;
    }

    var err = new Error(msg);
    err.code = response.code || response.status;

    if (response.config) {
      err.config = response.config;
    }

    if (response.data && response.data.errors) {
      err.errors = response.data.errors;
    }
    return err;
  };


  //
  // crResource
  //
  module.factory('crResource', function($http, $q, $rootScope) {

    var Resource = function(type, config, apiUrl) {

      this.type = type;

      // add config to this
      angular.extend(
        this,
        { path: '', schemaPath: '', viewPaths: {} },
        config
      );

      if (apiUrl) {
        this.path = apiUrl + this.path;
        this.schemaPath = apiUrl + this.schemaPath;

        var self = this;
        angular.forEach(this.viewPaths, function(path, name) {
          self.viewPaths[name] = apiUrl + path;
        });
      }
    };


    //
    // Get a resource schema
    //
    Resource.prototype.schema = function() {

      return $http.get(this.schemaPath).then(
        function(res) { return res.data; },
        function(res) { return $q.reject(makeError(res)); }
      );
    };


    //
    // Load a resource from the server
    //
    Resource.prototype.load = function(id, params) {

      var path = this.path;

      if (id) {
        if (typeof id === 'string') {
          path += '/' + id;
        }
        else if (typeof id === 'object' && !params) {
          // params passed as first arg
          params = id;
        }
      }
      var config = { params: params };

      return $http.get(path, config).then(
        function(res) { return res.data; },
        function(res) { return $q.reject(makeError(res)); }
      );
    };


    //
    // Save/update a resource on the server
    //
    Resource.prototype.save = function(doc, files) {

      doc = JSON.parse(JSON.stringify(doc));

      if (files && !angular.isArray(files)) {
        files = [files];
      }
      var isMultipart = false;
      var docId = doc._id;
      var docRev = doc._rev;

      // create multipart formdata when saving files

      if (files && files.length) {
        var fd = new FormData();
        fd.append('type_', this.type);
        fd.append('doc', JSON.stringify(doc));

        files.forEach(function(file, i) {
          fd.append('file' + i, file);
        });
        fd.append('numFiles', files.length);

        // when updating, add the id and rev
        if (docId)  fd.append('_id', docId);
        if (docRev) fd.append('_rev', docRev);

        doc = fd;
        isMultipart = true;
      }

      var req  = {
        url: this.path,
        method: 'POST',
        data: doc
      };
      if (docId && docRev) {
        // update
        req.method = 'PUT';
        req.url += '/' + docId + '/' + docRev;
      }
      else if (docId) {
        // create with id
        req.method = 'PUT';
        req.url += '/' + docId;
      }

      if (isMultipart) {
        return this._sendMultipart(req);
      }
      else {
        return $http(req).then(
          function(res) { return res.data; },
          function(res) { return $q.reject(makeError(res)); }
        );
      }
    };


    Resource.prototype._sendMultipart = function(req) {
      var def = $q.defer();

      // send multipart manually with xhr for now, $http seems to have problems with it
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', function() {

        var data = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;

        if (xhr.status === 200) {
          def.resolve(data);
        }
        else {
          def.reject(makeError({code: xhr.status, data: data}));
        }
        // call apply, because we are outside the angular life-cycle
        $rootScope.$apply();
      });

      xhr.open(req.method, req.url);

      // inherit default http headers from angulars http service
      var headers = $http.defaults.headers.common;
      angular.forEach(headers, function(value, key) {
        xhr.setRequestHeader(key, value);
      });

      xhr.send(req.data);

      return def.promise;
    };


    //
    // Delete a resource on the server
    //
    Resource.prototype.destroy = function(doc) {

      if (!doc._id || !doc._rev) {
        throw new Error('Cannot delete doc without id or rev');
      }
      return $http.delete(this.path + '/' + doc._id + '/' + doc._rev).then(
        function(res) {},
        function(res) { return $q.reject(makeError(res)); }
      );
    };


    //
    // Call a couchdb view
    //
    Resource.prototype.view = function(name, params) {

      var path = this.viewPaths[name];
      if (!path) {
        throw new Error('No view with name found: ' + name);
      }

      var config = {
        params: {}
      };
      // stringify non string params as json, to preserve them
      // angularjs http will otherwise do funky stuff with array params
      for (var x in params) {
        if (typeof params[x] !== 'string') {
          config.params[x] = JSON.stringify(params[x]);
        }
        else {
          config.params[x] = params[x];
        }
      }
      return $http.get(path, config).then(
        function(res) { return res.data; },
        function(res) { return $q.reject(makeError(res)); }
      );
    };
    return Resource;
  });


  //
  // crResources
  //
  module.service('crResources', function($http, $q, $rootScope, crResource) {


    var Resources = function() {

      this._resources = {};
      this._apiUrl = '';
    };


    Resources.prototype.init = function(options) {

      options = options || {};
      this._apiUrl = options.url || '';

      var self = this;

      return $http.get(this._apiUrl + '/_index').then(

        function(res) {
          angular.forEach(res.data, function(config, key) {
            self._resources[key] = new crResource(key, config, self._apiUrl);
          });
          return self._resources;
        },
        function(res) {
          return $q.reject(makeError(res));
        }
      );
    };


    Resources.prototype.getIds = function(count) {

      count = count || 1;

      return $http.get(this._apiUrl + '/_uuids?count=' + count).then(
        function(res) {
          return res.data.uuids;
        },
        function(res) {
          return $q.reject(makeError(res));
        }
      );
    };


    Resources.prototype.get = function(type) {

      var r = this._resources[type];
      if (!r) {
        throw new Error('Resource with type not found: ' + type);
      }
      return r;
    };


    return new Resources();
  });

})();

(function() {

  var module = angular.module('cores.services');


  function isObjectSchema(schema) {
    return schema.type === 'object' || schema.properties;
  }

  function isArraySchema(schema) {
    return schema.type === 'array' || schema.items;
  }

  function isRefSchema(schema) {
    return typeof schema.$ref === 'string';
  }


  function isPrivateProperty(key) {
    return key === '_id' || key === '_rev' || key === 'type_';
  }


  //
  // create a object with default values from schema
  //

  function createValue(schema, typeName) {

    var hasDefaultValue = schema.hasOwnProperty('default');
    var type = schema.type;

    if (schema.enum) {
      return hasDefaultValue ? schema.default : schema.enum[0];
    }
    if (schema.$ref) {
      return hasDefaultValue ? schema.default : {};
    }
    if (!type) {
      // infer object and array
      if (schema.properties) type = 'object';
      if (schema.items) type = 'array';
    }

    if (!type) throw new Error('Cannot create default value for schema without type');

    switch(type) {
    case 'boolean': return hasDefaultValue ? schema.default : true;
    case 'integer': return hasDefaultValue ? schema.default : 0;
    case 'number': return hasDefaultValue ? schema.default : 0;
    case 'string': return hasDefaultValue ? schema.default : '';
    case 'object':
      if (hasDefaultValue) return schema.default;

      var obj = {};
      angular.forEach(schema.properties, function(propSchema, name) {
        // ignore some vals
        if (isPrivateProperty(name)) return;
        obj[name] = createValue(propSchema);
      });
      if (typeName) {
        obj.type_ = typeName;
      }
      return obj;
    case 'array': return hasDefaultValue ? schema.default : [];
    default: throw new Error('Cannot create default value for unknown type: ' + type);
    }
  }

  //
  // schema utility methods
  //

  module.service('crSchema', function() {

    return {
      createValue: createValue,

      isObjectSchema: isObjectSchema,
      isArraySchema: isArraySchema,
      isRefSchema: isRefSchema,

      isPrivateProperty: isPrivateProperty
    };
  });

})();
(function() {

  var module = angular.module('cores.services');


  module.factory('crTextareaAutosize', function() {

    return function($textarea) {
      var update = function() {
        var body = $('body')[0];
        var top = body.scrollTop;
        var p = 0;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
          // add padding to height in firefox
          p += parseInt($textarea.css('padding-top'), 10);
          p += parseInt($textarea.css('padding-bottom'), 10);
        }
        $textarea.css('height', 'auto');
        $textarea.css('height', $textarea[0].scrollHeight + p);
        if (top !== body.scrollTop) {
          body.scrollTop = top;
        }
      };
      $textarea.on('keyup', update);
      $textarea.on('input', update);
      $(window).on('resize', update);
      return update;
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crArrayItem', function($compile, crCommon, crBuild) {
    return {
      scope: {
        model: '=',
        getSchema: '&',
        path: '@',
        showName: '='
      },

      link: function(scope, elem, attrs) {

        scope.schema = scope.getSchema();

        var control = crBuild.buildControl(scope, 'schema', 'model', scope.path);
        elem.html(control);
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crArrayControls', function() {
    return {
      replace: true,
      templateUrl: 'cr-array-controls.html',

      scope: {
        index: '&',
        schemas: '='
      },

      link: function(scope, elem, attrs) {

        var names = Object.keys(scope.schemas);
        scope.numSchemas = names.length;

        if (scope.numSchemas === 1) {
          scope.addItem = function() {
            scope.$emit('cr:array:addItem', scope.index(), scope.schemas[names[0]]);
          };
        }
        else {
          scope.addItem = function(schema) {
            scope.$emit('cr:array:addItem', scope.index(), schema);
          };
        }
      }
    };
  });


  module.directive('crArray', function(crSchema) {
    return {
      replace: true,
      templateUrl: 'cr-array.html',

      link: function(scope, elem, attrs) {

        scope.schemas = {};
        scope.showSchemaName = false;

        if (scope.schema.items.hasOwnProperty('anyOf')) {
          // anyof array
          scope.schema.items.anyOf.forEach(function(s) {
            if (!s.name) throw new Error('AnyOf schema has to have a name ' + JSON.stringify(s));
            scope.schemas[s.name] = s;
          });
          scope.showSchemaName = true;
        }
        else if (scope.schema.items) {
          // standard array
          scope.schemas.item = scope.schema.items;
        }

        // hide label and dont indent items
        angular.forEach(scope.schemas, function(s) {
          s.view = s.view || {};
          if (!s.view.hasOwnProperty('showLabel')) {
            s.view.showLabel = false;
          }
          if (!s.view.hasOwnProperty('indent')) {
            s.view.indent = false;
          }
        });


        scope.moveUp = function(index) {
          if (index === 0) return;
          scope.model.splice(index - 1, 0, scope.model.splice(index, 1)[0]);
        };

        scope.moveDown = function(index) {
          if (index >= scope.model.length) return;
          scope.model.splice(index + 1, 0, scope.model.splice(index, 1)[0]);
        };

        scope.remove = function(index) {
          scope.model.splice(index, 1);
        };

        scope.$on('cr:array:addItem', function(e, index, schema) {
          e.stopPropagation();

          var obj = crSchema.createValue(schema, schema.name);
          if (index >= scope.model.length) {
            scope.model.push(obj);
          }
          else {
            scope.model.splice(index, 0, obj);
          }
        });

        scope.getSchema = function(type) {
          type = type || 'item';
          var schema = scope.schemas[type];

          // ngrepeat can only bind to references when it comes to form fields
          // thats why we can only work with items of type object not primitives
          if (!crSchema.isObjectSchema(schema) && !crSchema.isRefSchema(schema)) {
            throw new Error('Array items schema is not of type object: ' + JSON.stringify(schema));
          }
          return schema;
        };

      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crBoolean', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-boolean.html'
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crColumnObject', function(
    crBuild
  ) {
    return {
      replace: true,
      templateUrl: 'cr-object.html',

      link: function(scope, elem, attrs) {
        scope.options = angular.extend({
          showLabel: true,
          indent: true,
          inline: false
        }, scope.schema.view);

        var props = crBuild.buildProperties(scope, scope.schema, scope.model, scope.path);

        var cols = Math.round(12 / props.length);
        if (cols < 2) cols = 2;
        var colClass = 'col-md-' + cols;

        var columns = [];
        for (var i = 0; i < props.length; ++i) {
          columns.push($('<div class="cr-seperate ' + colClass + '"></div>').html(props[i].elem));
        }
        var row = $('<div class="row"></div>').html(columns);
        elem.find('.properties').append(row);
      }
    };
  });

})();

(function() {

  var module = angular.module('cores.directives');

  module.directive('crControl', function(crBuild) {
    return {
      require: 'crControl',
      scope: {
        model: '=',
        schema: '=',
        path: '@'
      },
      replace: true,
      templateUrl: 'cr-control.html',

      controller: function($scope) {
        var self = this;
        var validators = {};

        $scope.errors = {};
        $scope.valid = true;
        $scope.dirty = false;

        this.addValidator = function(name, fn) {
          validators[name] = fn;
        };

        this.setValidity = function(code, valid) {
          $scope.errors[code] = valid;
        };

        this.validate = function() {
          $scope.valid = true;
          angular.forEach(validators, function(validator, code) {
            var valid = validator($scope.model);
            if (!valid) {
              $scope.valid = false;
            }
            $scope.errors[code] = !valid;
            $scope.$emit('cr:model:setValidity', $scope.path + ':' + code, valid);
          });
        };

        $scope.$watch('model', function(newValue, oldValue) {
          if (newValue) {
            $scope.dirty = true;
          }
          self.validate();
        });
      },


      link: function(scope, elem, attrs, ctrl) {

        scope.required = attrs.hasOwnProperty('required');
        scope.label = crBuild.getLabel(scope.schema, scope.path);

        scope.options = angular.extend({
          showLabel: true
        }, scope.schema.view);

        scope.$on('cr:model:error', function(e, path, code, message) {
          if (path === scope.path) {
            e.handled = true;
            ctrl.setValidity(code, false);
          }
        });

        elem.html(crBuild.buildType(scope, scope.schema));
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crDatetime', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-datetime.html',

      link: function(scope, elem, attrs, crCtrl) {

        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value;
          });
        }

        // the date
        var date = scope.model ? new Date(scope.model) : new Date();
        if (!scope.model) {
          scope.model = date.toISOString();
        }

        // datepicker
        var dtDate = elem.find('.date').datetimepicker({
          maskInput: true,
          pickDate: true,
          pickTime: false
        });
        dtDate.data('DateTimePicker').setDate(date);
        dtDate.on('change.dp', function(e) {
          e.stopPropagation();
          if (!e.date) return;

          date.setFullYear(e.date.year());
          date.setMonth(e.date.month());
          date.setDate(e.date.date());

          scope.model = date.toISOString();
          scope.$apply();
          crCtrl.validate();
        });

        // timepicker
        var dtTime = elem.find('.time').datetimepicker({
          maskInput: true,
          pickDate: false,
          pickTime: true,
          pickSeconds: false
        });
        dtTime.data('DateTimePicker').setDate(date);
        dtTime.on('change.dp', function(e) {
          e.stopPropagation();
          if  (!e.date) return;

          date.setHours(e.date.hours());
          date.setMinutes(e.date.minutes());

          scope.model = date.toISOString();
          scope.$apply();
          crCtrl.validate();
        });
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crEnum', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-enum.html'
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crImage', function(crCommon) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-image.html',

      link: function(scope, elem, attrs, crCtrl) {

        var fileId = crCommon.createFileId();

        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return value && value.name;
          });
        }

        scope.imgSrc = '';

        // preview when already saved
        scope.$watch('model.url', function(value) {
          scope.imgSrc = value
            ? (scope.options.baseUrl || '') + value
            : '';
        });


        elem.find('input[type="file"]').on('change', function(e) {
          if (this.files.length === 0) {
            // no file selected
            return;
          }

          var file = this.files[0];

          // preview selected image
          var reader = new FileReader();
          reader.onload = function(e) {
            scope.imgSrc = e.target.result;
            scope.$apply();
          };
          reader.readAsDataURL(file);

          scope.model.name = file.name;

          // notify model about file
          scope.$emit('cr:file:set', fileId, file);
          scope.$digest();
          crCtrl.validate();
        });
      }
    };
  });


  //
  // preview
  //

  module.directive('crImagePreview', function(crResources) {
    return {
      scope: {
        model: '=',
        schema: '=',
        options: '='
      },

      replace: true,
      templateUrl: 'cr-image-preview.html',

      link: function(scope, elem, attr) {
        scope.baseUrl = '';

        // try to get the baseUrl from the referenced schemas file property's view object
        crResources.get(scope.schema.$ref).schema().then(function(imageSchema) {
          scope.baseUrl = imageSchema.properties.file.view.baseUrl || '';
        });
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crInteger', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-number.html',

      link: function(scope, elem, attrs, crCtrl) {

        if (scope.schema.hasOwnProperty('multipleOf')) {
          crCtrl.addValidator('multipleOf', function(value) {
            return (value % scope.schema.multipleOf) === 0;
          });
        }
        if (scope.schema.hasOwnProperty('maximum')) {
          crCtrl.addValidator('maximum', function(value) {
            return value <= scope.schema.maximum;
          });
        }
        if (scope.schema.hasOwnProperty('minimum')) {
          crCtrl.addValidator('minimum', function(value) {
            return value >= scope.schema.minimum;
          });
        }
        if (scope.options.isInteger) {
          crCtrl.addValidator('integer', function(value) {
            return Math.floor(value) === value;
          });
        }
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crMarkdown', function(
    crTextareaAutosize
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-markdown.html',

      link: function(scope, elem, attrs, crCtrl) {

        scope.options = angular.extend({
          showBorder: true
        }, scope.options);

        if (scope.schema.hasOwnProperty('maxLength')) {
          crCtrl.addValidator('maxLength', function(value) {
            return value.length <= scope.schema.maxLength;
          });
        }
        if (scope.schema.hasOwnProperty('minLength')) {
          crCtrl.addValidator('minLength', function(value) {
            return value.length >= scope.schema.minLength;
          });
        }


        var $area = elem.find('.cr-editor-area');
        var $preview = elem.find('.cr-editor-preview');

        var updateSize = crTextareaAutosize($area);

        scope.isPreview = false;
        scope.togglePreview = function() {
          scope.isPreview = !scope.isPreview;
          if (scope.isPreview) {
            $preview.html(markdown.toHTML($area.val()));
          }
          else {
            updateSize();
          }
          $area.toggle();
          $preview.toggle();
        };

        // manually trigger autosize on first model change
        var unwatch = scope.$watch('model', function(newValue, oldValue) {
          if (newValue) {
            unwatch();
            updateSize();
          }
        });
        // update size when tab changes
        scope.$on('cr:tab:shown', function(e) {
          updateSize();
        });
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelForm', function(crBuild, crSchema) {
    return {
      scope: {
        schema: '=',
        model: '=?',
        valid: '=?',
        debug: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-form.html',

      link: function(scope, elem, attrs) {

        var childScope;

        function build() {
          // cleanup dom and scope
          if (childScope) {
            elem.find('form').empty();
            childScope.$destroy();
          }
          childScope = scope.$new();
          var control = crBuild.buildControl(childScope);
          elem.find('form').html(control);
        }


        scope.$watch('schema', function(newValue, oldValue) {
          if (!newValue) {
            return;
          }
          if (!crSchema.isObjectSchema(newValue)) {
            throw new Error('Top level schema has to be an object ' + JSON.stringify(newValue));
          }
          scope.schema.view = angular.extend({
            indent: false,
            showLabel: false
          }, scope.schema.view);

          if (!scope.model) {
            // create default model
            scope.model = crSchema.createValue(newValue);
            build();
          }
        });


        scope.$watch('model', function(newValue) {
          if (!scope.schema) {
            return;
          }
          if (!newValue) {
            scope.model = crSchema.createValue(scope.schema);
          }
          build();
        });


        scope.errors = {};
        scope.valid = true;

        scope.$on('cr:model:setValidity', function(e, code, valid) {
          e.stopPropagation();
          scope.errors[code] = !valid;
          scope.valid = true;
          angular.forEach(scope.errors, function(error, key) {
            if (error) {
              scope.valid = false;
            }
          });
        });
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');

  module.directive('crModelList', function(
    $sce,
    crCommon,
    crResources,
    crSchema,
    crJSONPointer
  ) {
    return {
      scope: {
        type: '@',
        view: '=?',
        page: '=?',
        limit: '=?',
        columns: '=?',
        params: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-list.html',

      link: function(scope, elem, attrs) {

        var resource;
        var schema;

        scope.limit = scope.limit || 25;
        scope.page = scope.page || 0;
        scope.columns = scope.columns || [];
        scope.params = scope.params || {};

        function reset() {
          scope.isLoading = false;
          scope.rows = [];
          scope.enablePrev = false;
          scope.enableNext = false;
        }
        reset();


        function update() {
          scope.isLoading = true;

          var params = {
            include_docs: true,
            // fetch one more to see if there is a next page
            limit: scope.limit + 1,
            skip: scope.page * scope.limit
          };
          angular.extend(params, scope.params);

          resource.view(scope.view || 'all', params).then(function success(result) {

            if(result.total_rows === 0) return;

            scope.enablePrev = scope.page > 0;
            scope.enableNext = result.rows.length > scope.limit;
            scope.isLoading = false;

            if (result.rows.length > scope.limit) {
              result.rows.pop();
            }

            scope.rows = result.rows.map(function(row) {
              return {
                id: row.doc._id,
                items: scope.columns.map(function(header) {
                  var val = '';
                  if (header.path) {
                    val = crJSONPointer.get(row.doc, header.path);
                  }
                  else if (header.map) {
                    val = header.map(row.doc);
                  }
                  else if (header.title) {
                    val = row.doc[header.title.toLowerCase()];
                  }
                  return { value: $sce.trustAsHtml(String(val)) };
                })
              };
            });
          }, function(err) {
            throw err;
          });
        }

        //
        // scope methods
        //
        scope.select = function(id) {
          scope.$emit('cr:list:select', id);
        };

        scope.next = function() {
          scope.page += 1;
          update();
        };

        scope.prev = function() {
          scope.page -= 1;
          update();
        };

        scope.$on('cr:reload:list', function(e) {
          e.preventDefault();
          update();
        });


        //
        // load schema and fill list
        //
        scope.$watch('type', function(newType) {
          if (!newType) {
            return;
          }
          scope.type = newType;

          resource = crResources.get(scope.type);
          resource.schema().then(function(s) {
            schema = s;

            // auto generate headers when not set
            if (!scope.columns || scope.columns.length === 0) {
              scope.columns = Object.keys(schema.properties).filter(function(key) {
                return !crSchema.isPrivateProperty(key);
              }).map(function(key) {
                return { title: crCommon.capitalize(key).split('/')[0], path: key };
              });
            }
            // table column titles
            scope.titles = scope.columns.map(function(header) {
              return header.title ||
                (header.path ? crCommon.capitalize(header.path).split('/')[0] : '');
            });

            update();
          });

          scope.$watch('view', function(newValue, oldValue) {
            if (newValue === oldValue) return;
            if (!resource) return;
            // reload list on view change
            reset();
            update();
          });
        });
      }
    };
  });


  module.directive('crModelListModal', function() {
    return {
      scope: {
        type: '@',
        modalId: '@',
        list: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-list-modal.html',

      link: function(scope, elem, attrs) {

        if (!scope.list) scope.list = {};

        scope.$on('cr:list:select', function(e, id) {
          elem.modal('hide');
        });

        scope.$on('cr:showModal:list', function(e, modalId, reload) {

          if (modalId === scope.modalId) {
            e.preventDefault();
            elem.modal('show');
            if (reload) {
              scope.$broadcast('cr:reload:list');
            }
          }
        });
      }
    };
  });


})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crModelResource', function(
    $q, crSchema, crResources, crJSONPointer
  ) {
    return {
      scope: {
        type: '@',
        path: '@',
        modelId: '=?',
        defaults: '=?',
        options: '=?'
      },

      replace: true,
      templateUrl: 'cr-model-resource.html',


      link: function(scope, elem, attrs) {

        var STATE_EDITING = 'editing';
        var STATE_LOADING = 'loading';
        var STATE_SAVING = 'saving';
        var STATE_ERROR = 'error';

        scope.options = scope.options || {};
        scope.valid = true;
        scope.state = STATE_EDITING;
        scope.debug = false;
        scope.error = null;
        scope.unhandledErrors = [];

        var resource;
        var files = {};

        scope.$on('cr:file:set', function(e, id, file) {
          e.stopPropagation();
          files[id] = file;
        });

        scope.$on('cr:file:remove', function(e, id) {
          e.stopPropagation();
          delete files[id];
        });


        function setModel(model) {
          if (!model) {
            // create default model
            model = crSchema.createValue(scope.schema);
            // set custom default values
            if (scope.defaults) {
              angular.forEach(scope.defaults, function(value, key) {
                crJSONPointer.set(model, key, value);
              });
            }
          }
          // reset files dict when model changes
          files = {};
          scope.model = model;
        };


        function load(id) {
          scope.state = STATE_LOADING;
          return resource.load(id).then(function(doc) {
            setModel(doc);
            scope.state = STATE_EDITING;

          }, function(err) {
            scope.state = STATE_ERROR;
            scope.error = err;
          });
        };


        scope.save = function() {
          scope.$emit('cr:model:save');
          var def = $q.defer();

          if (!scope.valid) {
            def.reject(new Error('Model is not valid'));
            return def.promise;
          }
          scope.state = STATE_SAVING;

          var fs = Object.keys(files).map(function(k) { return files[k]; });

          resource.save(scope.model, fs).then(function(doc) {

            setModel(doc);
            scope.modelId = doc._id;
            scope.state = STATE_EDITING;
            scope.$emit('cr:model:saved', scope.model);
            def.resolve(doc);

          }, function(err) {
            scope.unhandledErrors = [];
            if (err.errors && angular.isArray(err.errors)) {
              // validation errors
              err.errors.forEach(function(ve) {
                var event = scope.$broadcast('cr:model:error', '/model' + ve.path, ve.code, ve.message);
                if (!event.handled) {
                  console.log('event handled');
                  scope.unhandledErrors.push(ve.message + ' - ' + ve.path);
                }
              });
            }
            scope.state = STATE_ERROR;
            scope.error = err;
            def.reject(err);
          });
          return def.promise;
        };


        scope.askDestroy = function() {
          elem.find('#delete-modal').modal('show');
        };


        scope.destroy = function() {
          // manually remove the modal's backdrop
          $('.modal-backdrop').remove();

          scope.$emit('cr:model:destroy');

          return resource.destroy(scope.model).then(
            function() {
              setModel();
              scope.$emit('cr:model:destroyed');
            }
          );
        };


        scope.toggleDebug = function() {
          scope.debug = !scope.debug;
        };


        scope.isNew = function() {
          if (!scope.model) return true;
          return !scope.model._rev;
        };


        scope.buttonClick = function(e, eventName) {
          e.stopPropagation();
          scope.$emit(eventName, scope.model);
        };


        //
        // update when type is set
        //
        scope.$watch('type', function(newType) {
          if (!newType) {
            return;
          }
          scope.type = newType;
          scope.state = STATE_LOADING;

          resource = crResources.get(scope.type);

          // load schema
          resource.schema().then(function(schema) {

            // load or create default model
            scope.schema = schema;
            var id = scope.modelId;

            if (!id) {
              setModel();
              scope.state = STATE_EDITING;
            }
            else {
              return load(id);
            }
          }).then(function() {

            // watch for modelId changes to load/clear the model
            scope.$watch('modelId', function(value) {
              if (value) {
                load(value);
              }
              else {
                setModel();
              }
            });
          });
        });

      }
    };
  });
})();

(function() {

  var module = angular.module('cores.directives');


  module.directive('crMultiSelectRef', function(
    crResources,
    crJSONPointer
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-multi-select-ref.html',

      link: function(scope, elem, attr, crCtrl) {

        scope.rows = [];

        // load models
        crResources.get(scope.schema.items.$ref).view(
          'all', { include_docs: true }
        ).then(function(result) {
          // create rows
          scope.rows = result.rows.map(function(row) {
            var r = {
              id: row.id,
              selected: false
            };
            if (scope.options.previewPath) {
              r.name = crJSONPointer.get(row.doc, scope.options.previewPath);
            }
            else if (scope.options.previewPaths) {
              r.name = '';
              scope.options.previewPaths.forEach(function(path) {
                r.name += crJSONPointer.get(row.doc, path) + ' ';
              });
            }
            return r;
          });
          // select rows when id is in model
          scope.model.forEach(function(ref) {
            scope.rows.forEach(function(row) {
              if (row.id == ref.id_) { row.selected = true; }
            });
          });
        });


        // watch for selection changes
        scope.$watch('rows', function(newValue, oldValue) {
          if (!newValue || (newValue && newValue.length === 0)) return;
          // sync selected rows with model
          scope.model = scope.rows.filter(function(row) {
            return row.selected;
          }).map(function(row) {
            return { id_: row.id };
          });
        }, true);
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crNumber', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-number.html',

      link: function(scope, elem, attrs, crCtrl) {

        if (scope.schema.hasOwnProperty('multipleOf')) {
          crCtrl.addValidator('multipleOf', function(value) {
            return (value % scope.schema.multipleOf) === 0;
          });
        }
        if (scope.schema.hasOwnProperty('maximum')) {
          crCtrl.addValidator('maximum', function(value) {
            return value <= scope.schema.maximum;
          });
        }
        if (scope.schema.hasOwnProperty('minimum')) {
          crCtrl.addValidator('minimum', function(value) {
            return value >= scope.schema.minimum;
          });
        }
        if (scope.options.isInteger) {
          crCtrl.addValidator('integer', function(value) {
            return Math.floor(value) === value;
          });
        }
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crObject', function(
    crBuild
  ) {
    return {
      replace: true,
      templateUrl: 'cr-object.html',

      link: function(scope, elem, attrs) {
        scope.options = angular.extend({
          showLabel: true,
          indent: true,
          inline: false
        }, scope.schema.view);

        var props = crBuild.buildProperties(scope, scope.schema, scope.model, scope.path);
        elem.find('.properties').html(
          props.map(function(p) { return p.elem; })
        );
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');

  module.directive('crPassword', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-password.html',

      link: function(scope, elem, attrs, crCtrl) {

        scope.pass1 = '';
        scope.pass2 = '';
        var oldPass = scope.model;

        crCtrl.addValidator('match', function() {
          return scope.pass1 === scope.pass2;
        });

        if (scope.schema.hasOwnProperty('maxLength')) {
          crCtrl.addValidator('maxLength', function(value) {
            return value.length <= scope.schema.maxLength;
          });
        }
        if (scope.schema.hasOwnProperty('minLength')) {
          crCtrl.addValidator('minLength', function(value) {
            return value.length >= scope.schema.minLength;
          });
        }


        var compareValue = function(v1, v2) {
          // only set model when passwords are equal and not empty
          if (v1 === v2) {
            if (v1 !== '') {
              scope.model = v1;
            }
            else {
              scope.model = oldPass;
            }
          }
          else {
            scope.model = oldPass;
            crCtrl.validate();
          }
        };

        scope.$watch('pass1', function(value) {
          if (value) {
            scope.dirty = true;
          }
          compareValue(value, scope.pass2);
          crCtrl.validate();
        });

        scope.$watch('pass2', function(value) {
          if (value) {
            scope.dirty = true;
          }
          compareValue(value, scope.pass1);
          crCtrl.validate();
        });
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crReadonly', function() {
    return {
      replace: true,
      templateUrl: 'cr-readonly.html'
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crRef', function(
    $compile,
    crResources,
    crCommon
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-ref.html',

      link: function(scope, elem, attrs, crCtrl) {

        scope.options = angular.extend({
          showLabel: true,
          indent: true,
          preview: 'cr-ref-preview',
          list: {}
        }, scope.schema.view);

        scope.modelId = scope.model.id_;
        scope.reset = false;
        scope.selectModalId = crCommon.createModalId();
        scope.showModel = false;
        scope.modelOptions = {
          buttons: [{ title: 'Close', event: 'cr:ref:close' }]
        };

        scope.newModel = function() {
          scope.modelId = null;
          scope.showModel = true;
        };

        scope.editModel = function() {
          scope.modelId = scope.model.id_;
          scope.showModel = true;
        };

        scope.selectModel = function() {
          scope.$broadcast('cr:showModal:list', scope.selectModalId, true);
        };

        scope.hasModel = function() {
          return !!scope.model.id_;
        };


        scope.$on('cr:model:saved', function(e, model) {
          e.stopPropagation();
          scope.showModel = false;
          scope.model.id_ = model._id;
          crCtrl.validate();
          update();
        });


        scope.$on('cr:list:select', function(e, id) {
          e.stopPropagation();
          scope.showModel = false;
          scope.modelId = scope.model.id_ = id;
          crCtrl.validate();
          update();
        });


        scope.$on('cr:ref:close', function(e) {
          e.stopPropagation();
          scope.showModel = false;
        });


        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return value && value.id_;
          });
        }

        function update() {
          if (scope.model.id_) {
            var resource = crResources.get(scope.schema.$ref);
            resource.load(scope.model.id_).then(function(doc) {
              scope.previewModel = doc;
            });
          }
        }
        update();

        // create preview directive
        var tmpl = '<div ' + scope.options.preview
              + ' model="previewModel"'
              + ' schema="schema"'
              + ' options="options">'
              + '</div>';

        var content = $compile(tmpl)(scope);
        elem.find('.cr-preview').html(content);
      }
    };
  });


  //
  // preview
  //

  module.directive('crRefPreview', function() {
    return {
      scope: {
        model: '=',
        schema: '=',
        options: '='
      },

      replace: true,
      templateUrl: 'cr-ref-preview.html',

      link: function(scope, elem, attrs) {
        // get the preview text from model properties pointed to by the preview paths
        if (scope.options.previewPath) {
          scope.options.previewPaths = [scope.options.previewPath];
        }
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crSingleSelectRef', function(
    crResources,
    crJSONPointer
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-single-select-ref.html',

      link: function(scope, elem, attrs, crCtrl) {

        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value;
          });
        }

        scope.rows = [];

        // load models
        crResources.get(scope.schema.$ref).view(
          'all', { include_docs: true }
        ).then(function(result) {
          // create rows
          scope.rows = result.rows.map(function(row) {
            var r = {
              id: row.id
            };
            if (scope.options.previewPath) {
              r.name = crJSONPointer.get(row.doc, scope.options.previewPath);
            }
            else if (scope.options.previewPaths) {
              r.name = '';
              scope.options.previewPaths.forEach(function(path) {
                r.name += crJSONPointer.get(row.doc, path) + ' ';
              });
            }
            if (scope.model.id_ && r.id === scope.model.id_) {
              scope.selectedRow = r;
            }
            return r;
          });
        });

        // watch for selection changes
        scope.$watch('selectedRow', function(newValue, oldValue) {
          if (newValue === oldValue) return;
          if (!newValue) {
            delete scope.model.id_;
          }
          else {
            scope.model.id_ = newValue.id;
          }
        });
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crSlug', function(crCommon) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-slug.html',

      link: function(scope, elem, attrs, crCtrl) {

        if (scope.schema.hasOwnProperty('maxLength')) {
          crCtrl.addValidator('maxLength', function(value) {
            return value.length <= scope.schema.maxLength;
          });
        }
        if (scope.schema.hasOwnProperty('minLength')) {
          crCtrl.addValidator('minLength', function(value) {
            return value.length >= scope.schema.minLength;
          });
        }

        scope.generate = function() {
          var sources = [];
          var val = '';

          // allow single string or array of strings for source option
          if (typeof scope.options.source === 'string') {
            sources = [scope.options.source];
          }
          else if (angular.isArray(scope.options.source)) {
            sources = scope.options.source;
          }

          angular.forEach(sources, function(src) {
            val += (val !== '' ? '-' : '') + scope.$parent.model[src];
          });
          scope.model = crCommon.slugify(val);
        };
      }
    };
  });

})();

(function() {

  var module = angular.module('cores.directives');

  module.directive('crString', function() {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-string.html',

      link: function(scope, elem, attrs, crCtrl) {

        if (scope.schema.hasOwnProperty('maxLength')) {
          crCtrl.addValidator('maxLength', function(value) {
            return value.length <= scope.schema.maxLength;
          });
        }
        if (scope.schema.hasOwnProperty('minLength')) {
          crCtrl.addValidator('minLength', function(value) {
            return value.length >= scope.schema.minLength;
          });
        }
        if (scope.schema.hasOwnProperty('pattern')) {
          crCtrl.addValidator('pattern', function(value) {
            return new RegExp(scope.schema.pattern).test(value);
          });
        }
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crTabObject', function(
    crBuild,
    crCommon
  ) {
    return {
      replace: true,
      templateUrl: 'cr-object.html',

      link: function(scope, elem, attrs) {

        scope.options = angular.extend({
          showLabel: true,
          indent: true,
          inline: false
        }, scope.schema.view);

        // default showLabel to false on all properties
        Object.keys(scope.schema.properties).forEach(function(key) {
          var prop = scope.schema.properties[key];
          prop.view = prop.view || {};
          prop.view.showLabel = prop.view.hasOwnProperty('showLabel') ? prop.view.showLabel : false;
        });

        var props = crBuild.buildProperties(scope, scope.schema, scope.model, scope.path);

        var navWrapper = $('<ul class="nav nav-tabs"></ul>');
        var contentWrapper = $('<div class="tab-content"></div>');
        var navElems = '';
        var contentElems = [];

        props.forEach(function(prop, i) {
          var id = 'tab' + prop.path.replace(/\./g, '-');

          navElems += '<li' + (i === 0 ? ' class="active"' : '') + '>' +
            '<a href="#' + id + '">' + crBuild.getLabel(prop.schema, prop.path) + '</a></li>';

          contentElems.push($('<div' +
                              + ' ng-class="{ \'cr-indent\': options.indent }"'
                              + ' class="tab-pane' + (i === 0 ? ' active' : '') + '"'
                              + ' id="' + id + '"></div>'
                             ).html(prop.elem));
        });
        navWrapper.html(navElems);
        contentWrapper.html(contentElems);

        elem.find('.properties').append([navWrapper, contentWrapper]);

        elem.find('.nav-tabs a').on('click', function(e) {
          e.preventDefault();
          $(this).tab('show');

        }).on('shown.bs.tab', function(e) {
          e.preventDefault();
          scope.$broadcast('cr:tab:shown');
        });
      }
    };
  });

})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crTags', function(
    crResources,
    crCommon
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-tags.html',

      link: function(scope, elem, attrs, crCtrl) {

        // validation
        if (scope.required) {
          crCtrl.addValidator('required', function(value) {
            return !!value;
          });
        }

        var allTags = [];
        var allTagsById = {};
        var resource = crResources.get(scope.schema.items.$ref);

        // load all tags
        resource.view('all', { include_docs: true }).then(function(result) {

          allTags = result.rows.map(function(row) {
            var doc = row.doc;

            allTagsById[doc._id] = doc;

            // return tag for lookup
            return {
              doc: doc,
              key: createKey(doc.name)
            };
          });
        });


        var tagInput = elem.find('input');
        var dropdown = elem.find('.dropdown-menu');

        scope.matches = [];
        scope.activeListIndex = 0;
        scope.currentTag = '';

        scope.$watch('currentTag', function(value) {
          if (!allTags) return;
          checkMatch(value);
        });


        function createKey(str) {
          return str.toLowerCase().replace(/ +?/g, '');
        }

        function match(str) {
          var re = new RegExp('^' + createKey(str));
          return allTags.filter(function(t) {
            return t.key.match(re);
          });
        }

        function checkMatch(value) {
          if (!value) {
            closeDropdown();
            return;
          }
          scope.matches = match(value);
          if (scope.matches.length) {
            if (scope.matches.length < scope.activeListIndex - 1) {
              scope.activeListIndex = scope.matches.length - 1;
            }
            openDropdown();
          }
          else {
            closeDropdown();
          }
        }

        function addTag(doc) {
          var exists = scope.model.some(function(t) {
            if (t.id_ === doc._id) {
              return true;
            }
            return false;
          });
          if (exists) return false;
          scope.model.push({ id_: doc._id });
          return true;
        }

        function createTag(name) {
          var doc = {
            name: name,
            slug: crCommon.slugify(name)
          };

          resource.save(doc).then(function(doc) {
            console.log('save success', doc);
            scope.currentTag = '';
            if (addTag(doc)) {
              allTags.push({
                doc: doc,
                key: createKey(doc.name)
              });
              allTagsById[doc._id] = doc;
            }

          }, function(err) {
            console.log('save error', err);
            scope.error = err;
          });
        }

        function removeTag(index) {
          scope.model.splice(index, 1);
        }

        function openDropdown() {
          scope.activeListIndex = 0;
          dropdown.css('display', 'block');
        }

        function closeDropdown() {
          dropdown.css('display', 'none');
        }



        scope.selectMatch = function(match) {
          closeDropdown();
          scope.currentTag = '';
          tagInput.val('');
          tagInput.focus();
          addTag(match.doc);
        };

        scope.createTag = function() {
          createTag(scope.currentTag);
        };

        scope.removeTag = function(index) {
          removeTag(index);
        };

        scope.getTagName = function(id) {
          return allTagsById[id].name;
        };

        tagInput.on('focus', function(e) {
          checkMatch(scope.currentTag);
        });

        tagInput.on('keyup', function(e) {
          var ENTER = 13;
          var TAB = 9;
          var UP = 38;
          var DOWN = 40;

          switch(e.keyCode) {
          case ENTER:
          case TAB:
            e.preventDefault();
            var l = scope.matches.length;
            if (l > 0 && scope.activeListIndex < l) {
              scope.selectMatch(scope.matches[scope.activeListIndex]);
              scope.$apply();
            }
            break;

          case UP:
            e.preventDefault();
            if (scope.activeListIndex > 0) {
              scope.activeListIndex--;
              scope.$apply();
            }
            break;

          case DOWN:
            e.preventDefault();
            if (scope.activeListIndex < scope.matches.length - 1) {
              scope.activeListIndex++;
              scope.$apply();
            }
            break;
          }
        });
      }
    };
  });
})();
(function() {

  var module = angular.module('cores.directives');


  module.directive('crText', function(
    crTextareaAutosize
  ) {
    return {
      require: '^crControl',
      replace: true,
      templateUrl: 'cr-text.html',

      link: function(scope, elem, attrs, crCtrl) {

        if (scope.schema.hasOwnProperty('maxLength')) {
          crCtrl.addValidator('maxLength', function(value) {
            return value.length <= scope.schema.maxLength;
          });
        }
        if (scope.schema.hasOwnProperty('minLength')) {
          crCtrl.addValidator('minLength', function(value) {
            return value.length >= scope.schema.minLength;
          });
        }

        var updateSize = crTextareaAutosize(elem.find('textarea'));

        // manually trigger autosize on first model change
        var unwatch = scope.$watch('model', function(newValue, oldValue) {
          if (newValue) {
            unwatch();
            updateSize();
          }
        });
        // update size when tab changes
        scope.$on('cr:tab:shown', function(e) {
          updateSize();
        });
      }
    };
  });
})();