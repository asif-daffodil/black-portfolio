var pagetitle=$(document).find("title").text();

(function(window, undefined) {
			"use strict"; 	
	var Page	= (function() {
	
		var $container			= $( '#container' ),
			// the scroll container that wraps the articles
			$scroller			= $container.find( 'div.content-scroller' ),
			$menu				= $container.find( 'aside' ),
			// menu links
			$links				= $menu.find( 'nav > a' ),
			$articles			= $container.find( 'div.content-wrapper > article' ).not(".noscroll"),
			
		
			
			// button to scroll to the top of the page
			// only shown when screen size < 715
			$toTop				= $container.find( 'a.totop-link' ),
			// the browser nhistory object
			History 			= window.History,
			// animation options
			animation			= { speed : 800, easing : 'easeInOutExpo' },
			// jScrollPane options
			scrollOptions		= { verticalGutter : 0, hideFocus : true },
			// init function
			init				= function() {
				
				// initialize the jScrollPane on both the menu and articles
				_initCustomScroll();
				// initialize some events
				_initEvents();
				// sets some css properties 
				_layout();
				// jumps to the respective chapter
				// according to the url
				_goto();
				
			},
			_initCustomScroll	= function() {
			

				// Only add custom scroll to articles if screen size > 715.
				// If not the articles will be expanded
				if( $(window).width() > 767 ) {
				
					$articles.jScrollPane( scrollOptions );
				
				}
				// add custom scroll to menu
				$menu.children( 'nav' ).jScrollPane( scrollOptions );
			
			},
			_goto				= function( chapter ) {
				
				
				$(document).attr("title",pagetitle);
				
				
					// get the url from history state (e.g. chapter=3) and extract the chapter number
				var chapter 	= chapter || History.getState().url.queryStringToJSON().page,
					isHome		= ( chapter === undefined ),
					// we will jump to the introduction chapter if theres no chapter
					$article 	= $( chapter ? '#' + 'chapter' + chapter : '#' + 'introduction' );
				
				
				
					
					$('#link_introduction').removeClass('active');
					$('#link_about').removeClass('active');
					$('#link_skills').removeClass('active');
					$('#link_experience').removeClass('active');
					$('#link_education').removeClass('active');
					$('#link_portfolio').removeClass('active');
					$('#link_contact').removeClass('active');
					
					$('#link_'+chapter).addClass('active');
					
				if( $article.length ) {
				
						// left / top of the element
					var left		= $article.position().left,
						top			= $article.position().top,
						// check if we are scrolling down or left
						// is_v will be true when the screen size < 715
						is_v		= ( $(document).height() - $(window).height() > 0 ),
						// animation parameters:
						// if vertically scrolling then the body will animate the scrollTop,
						// otherwise the scroller (div.content-scroller) will animate the scrollLeft
						param		= ( is_v ) ? { scrollTop : (isHome) ? top : top + $menu.outerHeight( true ) } : { scrollLeft : left },
						$elScroller	= ( is_v ) ? $( 'html, body' ) : $scroller;
					
					$elScroller.stop().animate( param, animation.speed, animation.easing, function() {
						
						// active class for selected chapter
						///$articles.removeClass( 'content-active' );
						//$article.addClass( 'content-active' );
						
						
					} );
				
				}
			
			},
			_saveState			= function( chapter ) {
			
				// adds a new state to the history object
				// this will trigger the statechange on the window
				if( History.getState().url.queryStringToJSON().page !== chapter ) {
						
					History.pushState( null, null, '?page=' + chapter );
		
					$('#link_introduction').removeClass('active');
					$('#link_about').removeClass('active');
					$('#link_skills').removeClass('active');
					$('#link_experience').removeClass('active');
					$('#link_education').removeClass('active');
					$('#link_portfolio').removeClass('active');
					$('#link_contact').removeClass('active');
					
					$('#link_'+chapter).addClass('active');
				
				}
			
			},
			_layout				= function() {
			
				// control the overflow property of the scroller (div.content-scroller)
				var windowWidth	= $(window).width();
				
				var isipad = navigator.userAgent.toLowerCase().indexOf("ipad");
				if(isipad > -1)
				{
					//$('.totop-link').hide();
					switch( true ) {
					case ( windowWidth <= 768 ) : $scroller.scrollLeft( 0 ).css( 'overflow', 'visible' ); break;
					case ( windowWidth <= 1024 ): $scroller.css( 'overflow-x', 'hidden' ); break;
					case ( windowWidth > 1024 ) : $scroller.css( 'overflow', 'hidden' ); break;
					};
				}
				else
				{
					switch( true ) {
					case ( windowWidth <= 768 ) : $scroller.scrollLeft( 0 ).css( 'overflow', 'visible' ); break;
					case ( windowWidth <= 1024 ): $scroller.css( 'overflow-x', 'hidden' ); break;
					case ( windowWidth > 1024 ) : $scroller.css( 'overflow', 'hidden' ); break;
					};
				}
			
			},
			_initEvents			= function() {
				
				_initWindowEvents();
				_initMenuEvents();
				_initArticleEvents();
				
			},
			_initWindowEvents	= function() {
			
				$(window).on({

					// when resizing the window we need to reinitialize or destroy the jScrollPanes
					// depending on the screen size
					'smartresize' : function( event ) {
						
						var isipad = navigator.userAgent.toLowerCase().indexOf("ipad");
						var ismobile =  navigator.userAgent.toLowerCase().indexOf("mobile");
						if(isipad > -1 || ismobile > -1 )
						{
						}
						else
						{
							_layout();
							
							$('article.content').not(".noscroll").each( function() {
								
								var $article 	= $(this),
									aJSP		= $article.data( 'jsp' );
								
								if( $(window).width() > 767 ) {
									
									( aJSP === undefined ) ? $article.jScrollPane( scrollOptions ) : aJSP.reinitialise();
									
									_initArticleEvents();
									
								}	
								else {
									
									// destroy article's custom scroll if screen size <= 715px
									if( aJSP !== undefined )
										aJSP.destroy();
									
									$container.off( 'click', 'article.content' );
									
								}
								
							});
							
							var nJSP = $menu.children( 'nav' ).data( 'jsp' );
							nJSP.reinitialise();
							
							// jumps to the current chapter
							_goto();
						}
					
					},
					// triggered when the history state changes - jumps to the respective chapter
					'statechange' : function( event ) {
						
						_goto();
					
					}
				});
			
			},
			_initMenuEvents		= function() {
			
				// when we click a menu link we check which chapter the link refers to,
				// and we save the state on the history obj.
				// the statechange of the window is then triggered and the page/scroller scrolls to the 
				// respective chapter's position
				$links.on( 'click', function( event ) {
					
					var href		= $(this).attr('href'),
						chapter		= ( href.search(/chapter/) !== -1 ) ? href.substring(8) : 0;
					
					_saveState( chapter );
					if (href.indexOf("#") != -1) 
						return false;
					else 
						return true;
					
						
				
				});
			
				// scrolls to the top of the page.
				// this button will only be visible for screen size < 715
				$toTop.on( 'click', function( event ) {
					
					$( 'html, body' ).stop().animate( { scrollTop : 0 }, animation.speed, animation.easing );
					
					return false;
				
				});
			
			},
			_initArticleEvents	= function() {
			
				// when we click on an article we check which chapter the article refers to,
				// and we save the state on the history obj.
				// the statechange of the window is then triggered and the page/scroller scrolls to the 
				// respective chapter's position
				
					
					
					if($(window).width()>768)
					{
						$container.on( 'click', 'article.content', function( event ) {
							
							var id			= $(this).attr('id'),
								chapter		= ( id.search(/chapter/) !== -1 ) ? id.substring(7) : 0;
							
							_saveState( chapter );
							
							//return false;
						
						});
					}
					
					
					
				
			
			};
			
		return { init : init };	
	
	})();
	
	Page.init();
	
})(window);

