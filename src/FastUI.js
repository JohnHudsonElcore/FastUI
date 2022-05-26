class FastUI
{
	static ENV_NODEJS = 0x00001;
	static ENV_WEB = 0x00002;
	static export = null;
  
  /**
  * @param {Object} params
  */
	constructor(params)
	{
		if(!params) throw new Error("No FastUI Parameters passed");
		if(!params.environment) throw new Error("Please assign an environment, Either FastUI.ENV_NODEJS or FastUI.ENV_WEB");

		this._config = {
			environment: params.environment
		};
		this._componentRegistry = {

		};
	}
  /**
  * @param {String} path - Path to Asset
  * @returns Promise
  */
	getExternalAsset(path){
		console.log(path);
		return new Promise((resolve , reject) => {

			switch(this._config.environment)
			{
				case FastUI.ENV_NODEJS:

					let fs = require('fs');

					fs.readFile(path , 'UTF-8').then((content) => {
						resolve(content);
					}).catch((err) => {
						reject("Couldn't load asset: " + err);
					});

				break;
				case FastUI.ENV_WEB:

					let x = new XMLHttpRequest();
					x.open("GET" , path , true);
					x.onreadystatechange = () => {
						if(x.status == 200)
						{
							if(x.readyState == 4)
							{
								resolve(x.responseText);
							}
						}else{
							reject("Couldn't load asset: Object returned " + x.status + " response");
						}
					};
					x.send();

				break;
			}

		});
	}
  /**
  * @param {String} path - path to component 
  * @returns Promise
  */
	getComponent(path){
		let registryKey = path.split("/").join("_").toLowerCase();
		return new Promise((resolve , reject) => {

			if(this._componentRegistry[path])
			{
				resolve({
					component: this._componentRegistry[path]
				});
				return;
			}

			if(this._componentRegistry[registryKey])
			{
				resolve({
					component: this._componentRegistry[registryKey]
				});
				return;
			}

			this.getExternalAsset(path + "/component.js")
				.then((content) => {
					
					if(!document.querySelector("style[component='" + path + '"]'))
					{
						this.getExternalAsset(path + '/component.css')
							.then((css) => {
								eval(content);
								this._componentRegistry[registryKey] = FastUI.export;

								let s = document.createElement("style");
								s.setAttribute("component" , path);
								s.innerHTML = css;

								document.head.appendChild(s);

								resolve({
									component: FastUI.export
								});
							})
							.catch((csserr) => {
								reject(csserr);
							});
					}else{
						eval(content);
						this._componentRegistry[registryKey] = FastUI.export;
						resolve({
							component: FastUI.export
						});
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
  /**
  * @returns void
  * @usage - Listens in to the DOM to pick up 
  *        - new FastUI html components, allows Live 
  *        - Page modification
  */
	listen(){
		this.updateListener = setInterval(() => {
			document.querySelectorAll("fast:not([fast-initialized])").forEach((node) => {
				if(node.hasAttribute("component"))
				{
					this.getComponent(node.getAttribute("component"))
						.then((_export) => {
							
							let comp = _export.component;

							let a = new comp({
								domElement: node
							});
							
							
							node.setAttribute("fast-initialized" , "true");

						})
						.catch((err) => {
							console.error("Couldn't load component: " + err);
							node.setAttribute("fast-initialized" , "error");
							node.setAttribute("fast-error" , err);
						})
				}
			});
		} , 100);
	}
}
