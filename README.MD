 #### Website:
 https://fastui.elcore.co.uk
 # FastUI
 An extremely lightweight JavaScript/HTML library designed for Rapid UI development. To get started with
FastUI you simply need this code below!
 ```
 <script src="/path/to/fastui.js"></script>
 <script src="/path/to/fastuicomponent.js"></script>
 
 <script>
     let App = new FastUI({
        environment: FastUI.ENV_WEB //Either ENV_WEB or ENV_NODEJS for electron etc.
     });
     App.listen();
 </script>
 ```
 
#### Using components
 ```
 <fast component="path/to/component_folder"></fast>
 <!-- DO NOT REFERENCE THE FILE DIRECTLY, FASTUI DOES THIS FOR YOU!-->
 <!-- EXAMPLE !-->
   - htdocs
     - Components
       - Headbar
         - component.js
	     - component.css
	 
    <fast component="Components/Headbar"></fast>
 <!-- END EXAMPLE !-->
 ```
 this loads a FastUI component into the webpage, components are not accessible within the Browser, All logic for a component
 must be done within the Component's `component.js` file. This is done to prevent tampering by users.
 
 #### Creating Components
 Lets say you want to create a Headbar component, for your website:
 ```
  - Headbar
    - component.js - all lower case, handles logic within Component
    - component.css - all lower case, handles styling within a Component
 ```
 ##### component.js
 ```
 class Headbar extends FastUI.Component{
	constructor(config)
	{
		super(config);

	}

	render()
	{
		return `<div class="headbar"></div>`;
	}
}
FastUI.export = Headbar;
 ```
 ##### component.css
 ```
     @media screen and (min-width:1200px){
         .headbar{
             position:absolute;top:0px;left:0px;right:0px;height:80px;
         }
     }
 ```
 
 ### Why Use FastUI?
 FastUI allows rapid development of web pages, without the hassle that comes with other Component Based Rendering Engines. Writing FastUI modules, means you write once, and reuse. Even better, within the render function you can reference other components in a hierarchal tree, some components let you alter certain behaviours and attributes from html attributes too, which gives you the opportunity to reuse components more freely. 
 
 FastUI also accommodates for Promise functionality, when defining the render update method in your component, you can have it return either a Promise, or a HTML String, this is completely optional, I've put this in for components that may require a server response to display your component correctly, such as search, notifications or live stats. 
 
 I've built FastUI to work great with data models, for instance you could use
 ```
 <fast component="Component/Listing/BlogPostSummary" article-id="128"></fast>
 ```
 This would be able to display either a loading spinner, or skeleton and fill the content on load, giving your website a truly professional finish. I'm even working on an IDE to create a full FastUI website. This will include a block drag and drop, CSS editor, and allow you to see responses from XMLHttpRequests and fetch.

 ### What about lots of requests for components?
 FastUI caches the modules when the page loads and they're initially rendered, to further improve, Browser Caching takes care of the rest. When a new user accesses your website, the page will load at a relatively normal speed. Requests after would be a lot faster as all the components get cached on the clients Browser!
