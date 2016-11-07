


var AjaxPrettyUrl = (function(){
	function AjaxPrettyUrl($url, $id){
		AjaxPrettyUrl.numInstances = (AjaxPrettyUrl.numInstances || 0) + 1;
		this.intId = $id;

		this.strUrl = $url;

		console.log(AjaxPrettyUrl.numInstances)
	}

	AjaxPrettyUrl.prototype =  {
		init: function(){
			this.setHistory();
			this.setHistoryOnState();
		},
		setHistory: function(){
			var objHistory = window.History;

			var objElement = this.setSelector();
			var objActive = objElement.querySelector('li.active');
			var objAnchor = objActive.querySelector('a');

			var strDefaultState = objAnchor.textContent || objAnchor.innerText;

			var objPanel = this.getClosest(objAnchor, '.panel');
			var objPanelTitle = objPanel.querySelector('.panel-title');
			var objPanelAnchor = objPanelTitle.querySelector('a');
			var strPanelText = objPanelAnchor.textContent || objAnchor.innerText;

			var strDefaultStateCategory = strPanelText.toLowerCase().toString().trim(strDefaultState).replace(/\s+/g, '-');
			var strState = strDefaultState.toLowerCase().toString().trim(strDefaultState).replace(/\s+/g, '-');
			var objDefaultState = {page: this.strUrl+'/'+strDefaultStateCategory+'/'+strState, url: this.strUrl + '/' + strDefaultStateCategory + '/' + strState};

			//Set history on default page entry
			if (objHistory.enabled) {
				if(window.location.pathname === this.strUrl){
					objHistory.replaceState(objDefaultState, document.title, objDefaultState.url);
				}
			} else {
				return false;
			}

			var objTrigger = objElement.querySelector('[data-state="'+window.location.pathname+'"]');
			if(objTrigger){
				//If the url matches our data load the content by triggering the click on the item
				if(window.location.pathname == objTrigger.getAttribute('data-state')){
					objTrigger.click(); //Trigger ajax call
				}
			}
		},
		setHistoryOnState: function(){
			//Manage the browser back/forward buttons
			var self = this;
			window.History.Adapter.bind(window,'statechange',function(){
				var objHistory = window.History,
						objState = objHistory.getState();

				var objElement = self.setSelector();
				var objTrigger = objElement.querySelector('[data-state="'+objState.data.page+'"]');

				if(objTrigger){
					if(objState.data.url == window.location.pathname){
						objTrigger.click(); //Trigger ajax call
					}
				}
			});
		},
		ajaxCallback: function($obj){
			var obj = $obj,
					strObjText = obj.context.textContent || obj.context.innerText,
					strPushState = strObjText.toLowerCase().toString().trim().replace(/\s+/g, '-'),

					objPanel = this.getClosest(obj.context, '.panel'),
					objPanelTitle = objPanel.querySelector('.panel-title'),
					objPanelAnchor = objPanelTitle.querySelector('a'),
					strPanelText = objPanelAnchor.textContent || objAnchor.innerText,
					strPushStateCategory = strPanelText.toLowerCase().toString().trim(strPushState).replace(/\s+/g, '-'),
					objState = {page: this.strUrl+'/'+strPushStateCategory+'/'+strPushState, url: this.strUrl + '/' + strPushStateCategory + '/' + strPushState};

			var objHistory = window.History,
					objCurrentState = objHistory.getState();

			console.log(this.strUrl);

			// Bind to State Change
			objHistory.pushState(objState, document.title, objState.url);

		},
		setSelector: function(){
			return document.getElementById(this.intId);
		},
		getClosest: function (elem, selector) {
			/**
			 * Get the closest matching element up the DOM tree.
			 * @param  {Element} elem     Starting element
			 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
			 * @return {Boolean|Element}  Returns null if not match found
			 */
			// Variables
			var firstChar = selector.charAt(0);
			var supports = 'classList' in document.documentElement;
			var attribute, value;

			// If selector is a data attribute, split attribute from value
			if ( firstChar === '[' ) {
				selector = selector.substr( 1, selector.length - 2 );
				attribute = selector.split( '=' );

				if ( attribute.length > 1 ) {
					value = true;
					attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
				}
			}

			// Get closest match
			for ( ; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode ) {

				// If selector is a class
				if ( firstChar === '.' ) {
					if ( supports ) {
						if ( elem.classList.contains( selector.substr(1) ) ) {
							return elem;
						}
					} else {
						if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
							return elem;
						}
					}
				}

				// If selector is an ID
				if ( firstChar === '#' ) {
					if ( elem.id === selector.substr(1) ) {
						return elem;
					}
				}

				// If selector is a data attribute
				if ( firstChar === '[' ) {
					if ( elem.hasAttribute( attribute[0] ) ) {
						if ( value ) {
							if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
								return elem;
							}
						} else {
							return elem;
						}
					}
				}

				// If selector is a tag
				if ( elem.tagName.toLowerCase() === selector ) {
					return elem;
				}

			}

			return null;

		}
	};
	return AjaxPrettyUrl;
})();
