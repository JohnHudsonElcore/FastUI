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
	setState(params , ignoreUpdate = false){
		for(let prop in params){
			this.state[prop] = params[prop];
		}
		if( !ignoreUpdate ){
			this.update();
		}
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
		let res = this.render();

		if(res.constructor.name === 'Promise')
		{
			res.then( (html) => {
				this.domElement.innerHTML = html;
				this.reapplyEvents();
			} );
		}else{
			this.domElement.innerHTML = this.render();
			this.reapplyEvents();
		}
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
  /**
  * @param {String} qs - Query Selector of Component Descendant Node
  * @param {String} evName - Event to listen for
  * @param {Closure} callback - Function to execute when event is fired
  */
	listenForEvent(qs , evName , callback){
		if(!this.events[evName])
		{
			this.events[evName] = [];
		}
		this.events[evName].push({
			element: qs , 
			call: callback
		});
	}
  /**
  * @description - When update is called, this reapplies the events when innerHTML is
                 - reset, the Browser's Garbage collector destroys the previous
		 - elements events, so they need re-assigning.
  */
	reapplyEvents()
	{
		for(let ev in this.events)
		{
			this.events[ev].forEach( ( subscriber ) => { 
				let node = this.getNode( subscriber.element );

				if ( node )
				{
					node.addEventListener( ev , ( event ) => {

						subscriber.call.call( this , event );

					} );
				}
			} );
		}
	}
}
FastUI.Component = UIComponent;
