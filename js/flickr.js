var flickr = {
	apiKey: null,
	user_id: "60401789%40N06",
	photos: [],
	displayedItem: null,
	lightbox: null,
	lightboxContent: null,
	lightboxItem: null,
	lightboxCaption: null,
	lightboxCaptionText: null,
	limit: null,
	url: null,
	method: "flickr.photos.search",
	tags: "website",
	async: false,
	elementId: false,
	init: function(apiKey) {
		this.apiKey = apiKey;
		this.limit = 50;
		this.method = "flickr.photos.search"
		this.url = 'https://www.flickr.com/services/rest/?method='+this.method+'&api_key='+this.apiKey+'&tags='+this.tags+'&user_id='+this.user_id+'&format=json&per_page='+this.limit+'&extras=url_m,url_l,owner_name,tags',
		this.async = true;
		this.elementId = "flickr";

		// options passed to callback later
		var options = {
			limit: this.limit,
			async: this.async,
			elementId: this.elementId
		}

		// passing callback to handle async http call
		this.httpGet(this.url, this.getPhotos, options);
		return this;
	},
	// the object returned from Flickr
	jsonFlickrApi : function(code) {
		return code;
	},
	getPhotos : function(response, self) {
		var execute = 'flickr.'+response;
		var object = eval(execute);
		object.photos.photo.forEach(function(element) {
			self.photos.push(element);
		});
		self.render();
	},
	httpGet: function(url, callback, options) {
		var self = this;
		var xmlHttp = null;
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, this.async);
		xmlHttp.onload = function (e) {
			if (xmlHttp.readyState === 4) {
				if (xmlHttp.status === 200) {
					callback(xmlHttp.responseText, self);
				} else {
					document.write("An error occurred while connecting to Flickr");
				}
			}
		}
		xmlHttp.send(null);
	},
	createlightbox: function() {
		var self = this;
		// the lightbox container
		var lightbox = document.createElement("div");
		var lightboxContent = document.createElement("div");

		lightbox.className = "col-md-12 flickr-l";
		lightboxContent.className = "flickr-l-content"
		lightboxContent.id = "flickr-content"
		lightbox.appendChild(lightboxContent);

		lightboxCaption = document.createElement("div");
		lightboxCaption.className = "flickr-l-caption";
		lightboxCaptionText = document.createElement("p");
		lightboxCaptionText.innerHTML = "";
		lightboxCaption.append(lightboxCaptionText);
		lightbox.appendChild(lightboxCaption);
		
		// append prev & next button to the image container
		lightbox.append(self.createNavigation());
		lightboxContent.addEventListener("click", function(e){
			// hide element
			lightbox.style.visibility = "hidden";
		});
		self.lightbox = lightbox;
		self.lightboxContent = lightboxContent;
		self.lightboxCaption = lightboxCaption;
		self.lightboxCaptionText = lightboxCaptionText;
	},
	createNavigation: function() {
		var self = this;
		var navigation = document.createElement('div')
		navigation.className = 'flickr-l-navigation'
		var prev = document.createElement("a");
		var next = document.createElement("a");
		var prevText = document.createTextNode("<")
		var nextText = document.createTextNode(">")
		prev.append(prevText)
		next.append(nextText)
		prev.className = "prev";
		next.className = "next";
		navigation.append(prev, next);

		prev.addEventListener("click", function(e){
			self.prevImage();
		});
		next.addEventListener("click", function(e){
			self.nextImage();
		});

		document.onkeydown = function(e) {
			switch (e.keyCode) {
				case 27:
					self.lightbox.style.visibility = "hidden";
					break;
				case 37:
					self.prevImage();
					break;
				case 39:
					self.nextImage();
					break;
			}
		};

		return navigation;
	},
	nextImage: function() {
		var self = this;
		var nextElement = self.nextElement();
		self.displayedItem.src = nextElement.url_l;
		self.lightboxCaptionText.innerHTML = nextElement.title;
		self.lightboxItem = nextElement;
	},
	prevImage: function() {
		var self = this;
		var prevElement = self.previousElement();
		self.displayedItem.src = prevElement.url_l;
		self.lightboxCaptionText.innerHTML = prevElement.title;
		self.lightboxItem = prevElement;
	},
	nextElement: function() {
		var self = this;
		var currentIndex = self.photos.indexOf(self.lightboxItem);
		var nextIndex = (currentIndex + 1) % self.photos.length;
		return self.photos[nextIndex];
	},
	previousElement: function() {
		var self = this;
		var currentIndex = self.photos.indexOf(self.lightboxItem);
		var previousIndex = (currentIndex + self.photos.length -1) % self.photos.length;
		return self.photos[previousIndex];
	},
	render: function() {
		var self = this;
		var link, image;
		var flickrContainer = document.getElementById(self.elementId);
		self.createlightbox();
		
		self.photos.forEach(function(element){
			link = document.createElement('a');
			image = document.createElement("img");

			image.setAttribute('data-src', element.url_l);
			image.className = "zoom"
			image.src = element.url_l;
			link.appendChild(image);
			link.addEventListener("click", function(e){
				self.lightboxItem = element;
				self.lightboxContent.innerHTML = "";
				self.displayedItem = document.createElement("img");
				self.displayedItem.src = element.url_l;
				self.lightboxContent.appendChild(self.displayedItem);
				self.lightbox.style = "display: block"
				self.lightboxCaptionText.innerHTML = element.title
			});
			flickrContainer.appendChild(link);
		});

		flickrContainer.appendChild(self.lightbox);
	}
};