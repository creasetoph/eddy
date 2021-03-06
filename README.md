
# Guapi

Guapi is a GUI for an API or an GUAPI... it makes interacting with API's easier. 
Instead of having to do a `curl` or use Postman to play with and API, Eddy 
allows you to define a simple json config for your API and gives you user
friendly forms to fill out. 
 

### To install 
1. Clone this repo
1. Install `node.js`
1. install dependencies
```
npm install
bower install
```
### To run
1. Run ember
```
node node_modules/ember-cli/bin/ember s
```

### Config definitions
Content is a renderable object

Content Types
 - tabs
 - form
 
The `tabs` content type renders tabs to the page.
 ```
 {
   "name": "The name used for routes, this should only be camel case",
   "display": "The name displayed on the tab",
   "content": {
     "tabs|form": ... //Can be more nested tabs, or another type of content
   }
 }
 ```
 
 
The `form` content type renders a form to the page.
```
content": {
  "form": {
    "path": "Path to call",
    "method": "HTTP method to use [GET|PUT|POST]",
    "request": {
      "location": "Location of form data [query|body]",
      "auth": {
        "type": "Type of authentication [bearer|basic|none]"
      },
      "fields": [
        {
          "display": "Field display name",
          "name": "Name used when adding to query or body",
          "type": "Field type [text,password,select]",
          "disabled": "Weather field is disabled [true,false]"
        }
      ],
      "submitButton": "Name of submit button"
    },
    "response": {
      "root": "json root to get data from",
      "type": "Response type [array|object]",
      "fields": "Response fields to show, * for all that were retrieved, or array of fields to show"
    }
  }
}
```

 
## Config

There are 2 different types of configs `condensed` and `full`, the `full` config has every field
set and is very verbose, lots of duplicates. So there is also a `condensed` version that will get 
processed to create the `full` version, the processing will make sure the `condensed` version was
valid and generate any needed config content. This will also be where all the defaults are so
when in the code we don't have to worry about them.



### `full` config


 
#### Object Types
* `root`: (This holds all the global info, like name, settings, and auth)
* `tab` (Names of the tabs and its content)
* `form` (The good stuff, all info about how a form is processed)


##### `root` Type
This hold all the info for the top bar, name etc

* `display`: String
  * What is displayed on the top left of app, usually this is your company or app name
* `settings`: Array of objects
  * an array of objects that have `name` and `display` properties, 
    these are what settings are available in the "Settings" dropdown
* `content`: Object
** What content you want rendered, of `content` type 

##### `tab` Type

* `name`: String
* `display`: String
* `content`: Array of objects



##### `form` Type

* `name`: String
* `display`: String
* `request`
* `response`

##### `request` Type

* `url`: String
* `location`: String (form,query,json)
* `path`: String
* `method`: String (GET,POST,PUT,DELETE)
* `auth`: Auth
* `fields`: Array[Field]

 
 Content Types
  - tabs
  - form
The `tabs` content type renders tabs to the page.
 ```
 {
   "name": "The name used for routes, this should only be camel case",
   "display": "The name displayed on the tab",
   "content": {
     "tabs|form": ... //Can be more nested tabs, or another type of content
   }
 }
 ```
 
 
The `form` content type renders a form to the page.
```
{
  "type": "form",
  "request": {
    "url": "",
    "path": "Path to call",
     "method": "HTTP method to use [GET|PUT|POST]",
     "location": "Location of form data [query|body]",
     "auth": {
       "type": "Type of authentication [bearer|basic|none]"
     },
     "submit": {
       "display": "Submit",
       "type": "primary",
       "size": "sm"
     },
     "fields": [
       {
         "display": "Field display name",
         "name": "Name used when adding to query or body",
         "type": "Field type [text,password,select]",
         "disabled": "Weather field is disabled [true,false]"
       }
     ]
  },
  "response": {
    "root": "json root to get data from",
    "type": "Response type [array|object]",
    "fields": "Response fields to show, * for all that were retrieved, or array of fields to show"
  }
}
```

The `action` type
```
{
  "type": "icon|button",
  "link": "{{route.base}}.view",
  "params": ["id"],
  "autoSubmit": true,
  "icon": "info-sign"
}
{
  "type": "button",
  "display": "Update",
  "link": "{{route.base}}.update",
  "params": ["id","name","ownerOrgId"]
}
```



Condensed Config


Expander

`name` and `display` expander
This will expand a string to a object with `name` and `display`

```
"Display Name::nameName"
```
Becomes 
```
{
  "display": "Display Name",
  "name": "nameName"
}
```
Or you could
```
{
  "name": "Display Name::nameName"
}
```
Which would also become
```
{
  "display": "Display Name",
  "name": "nameName"
}
```

Also
```
"::someName"
```
Will auto format to
```
"Some Name::someName"
```
Which then follows the name display expander



The `rest` expander
If your endpont is really "REST",
then there is minimal config
```
{
  "name": "Roles::roles",
  "type": "rest",
  "path": "/v2/roles",
  "auth": "bearer",
  "root": "role",
  "fields": [
    "::id",
    "::name",
    "::ownerOrgId"
  ]
}
```
