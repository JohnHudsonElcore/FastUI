class UIComponent
{
  /**
  * @param {Object} - Destructed
  */
	constructor({ domElement })
	{
		this.domElement = domElement;

		this.state = {

		};
		this.update();
	}
  /**
  * @param {Object} params - state properties to assign
                           - similar to React, components have states, 
                           - Only the component can modify its state as
                           - the creation of a component doesn't expose
                           - its class to make calls
  * @returns - void
  */
	setState(params){
		for(let prop in params){
			this.state[prop] = params[prop];
		}
		this.update();
	}
  /**
  * @param {String} key - the key for the state object
  * @returns {Mixed}
  */
	getState(key)
	{
		return this.state[key];
	}
  /**
  * @description - called by the system, 
  * never gets called by anything else other than the 
  * component internally
  */
	update()
	{
		this.domElement.innerHTML = this.render();
	}
  /**
  * @abstract
  * @returns {String}
  * @usage - returns a HTML string to update the component's innerHTML
  */
	render(){
		throw new Error("FastUI.Component Exception: render is an abstract method that needs implementing");
	}
	/**
	* @returns {HTMLElement}
	* @param {String} qs - Query String
	* @usage - Fetches a child element of the component.
	*/
	getNode(qs)
	{
		return this.domElement.querySelector(qs);
	}
}
FastUI.Component = UIComponent;
