/*InvisiClues.js v2.1*/
var invisiClues = {
	index: 1,	
	numberedList: false,
	displayTOC: true,
	scrollTopPos: 0,
	navSections: [],
	processJSON: function() {
		var data = JSON.parse(document.getElementById('jsonData').textContent);
		var main = document.getElementById('section0');
		
		if ('numberedList' in data) {
			this.numberedList = data.numberedList;
		}
		if ('displayTOC' in data) {
			this.displayTOC = data.displayTOC;
		}
		
		this.processHeader(main, data.header);
				
				
		if (this.displayTOC) {
			var tocElem = this.processTOC(main);	
			var liElem = this.tocElement('section0', 'Introduction', true);
			this.navElement('section0', 'Introduction');
			tocElem.appendChild(liElem);	
			this.navElement('toc', 'Table of Contents');
		} else {
			var tocElem = null;
		};		
		if ('sections' in data) {
			for (var i = 0; i < data.sections.length; i++) {
				this.processSection(main, data.sections[i], tocElem, true);
			}
		}
		if (this.displayTOC) {
			document.querySelector("body").setAttribute('class', 'hasNavBar');
			window.addEventListener("resize", this.refreshTopPos);
			window.addEventListener("scroll", this.toggleTopButton);
			window.addEventListener("scrollend", this.refreshNavBar);
			document.querySelector(".topNav select").addEventListener("change", this.navSection);			
			this.populateNavSections();
			this.refreshTopPos();
			this.refreshNavBar();
			document.querySelector(".topNav select").focus();
		}
	},
	populateNavSections: function () {
		var navSections = document.querySelectorAll('.navSection');
		this.navSections = [...navSections];
		this.navSections.reverse();
	},
	refreshTopPos: function() {
		var toc = document.getElementById("toc");
		invisiClues.scrollTopPos = toc.offsetTop;
	},
	refreshNavBar: function () {
		for (var i = 0; i < invisiClues.navSections.length; i++) {
			var navSection = invisiClues.navSections[i];
			if (navSection.offsetTop < scrollY + 100) {
				document.querySelector(".topNav select").value = '#' + navSection.id;
				break;
			}
		}
	},
	toggleTopButton: function() {
		var top = document.querySelector("a.top");
		var scrollY = this.scrollY || 0;
		if (scrollY > invisiClues.scrollTopPos + 30) {
			top.setAttribute('class', 'top visible');
			top.setAttribute('href', '#toc');
		} else {
			top.setAttribute('class', 'top');
			top.removeAttribute('href');
		}
	},
	simpleElement: function(type, data) {
		var elem = document.createElement(type);
		elem.innerHTML = data;
		return elem;
	},
	processHeaderSection: function(headerElem, section) {
		if ('title' in section) {
			headerElem.appendChild(this.simpleElement('h3', section.title));
		}
		if ('content' in section) {
			for (var i = 0; i < section.content.length; i++) {
				headerElem.appendChild(this.simpleElement('p', section.content[i]));
			}
		}
	},
	processHeader: function(main, header) {
		var headerElem = document.createElement('div');
		headerElem.setAttribute('class', 'header');
		if ('image' in header) {
			var imgElem = document.createElement('img');
			imgElem.setAttribute('src', header.image);
			headerElem.appendChild(imgElem);
		}
		if ('title' in header) {
			headerElem.appendChild(this.simpleElement('h1', header.title + ' InvisiClues™'));
		}
		headerElem.appendChild(this.simpleElement('h2', "Introduction"));
		if ('section1' in header) {
			this.processHeaderSection(headerElem, header.section1);
		}
		if ('section2' in header) {
			this.processHeaderSection(headerElem, header.section2);
		}
		if ('sampleQuestions' in header) {
			var sampleElem = document.createElement('div');
			this.processSection(sampleElem, header.sampleQuestions, false);
			headerElem.appendChild(sampleElem);
		}
		if ('section3' in header) {
			this.processHeaderSection(headerElem, header.section3);
		}
		main.appendChild(headerElem);
	},
	processTOC: function(main) {
		var tocElem = this.titleElement('Table of Contents', 'h2', false, false, true);
		tocElem.setAttribute('id', 'toc');
		main.appendChild(tocElem);
		var elem = document.createElement('ul');
		elem.setAttribute('class', 'indented');
		main.appendChild(elem);
		return elem;
	},
	tocElement: function(sectionId, title, hasQuestions) {
		var elem = document.createElement('li');
		if (hasQuestions) {
			var aElem = document.createElement('a');
			aElem.innerHTML = title;
			aElem.setAttribute('href', '#' + sectionId);
			elem.appendChild(aElem);
		} else {
			elem.innerHTML = title;
		}
		return elem;
	},
	navGroup: function (title) {
		var optGroup = document.createElement('optgroup');
		optGroup.setAttribute('label', title);
		document.querySelector(".topNav select").appendChild(optGroup);
		return optGroup;
	},
	navElement: function (sectionId, title, optGroup) {
		var opt = document.createElement('option');
		opt.setAttribute('value', '#' + sectionId);
		opt.innerHTML = title;
		if (optGroup) {
			optGroup.appendChild(opt);
		} else {
			document.querySelector(".topNav select").appendChild(opt);
		}
	},
	processSection: function(main, section, ulElem, upper, optGroup) {
		if ('title' in section && section.title != '') {
			if (!('toc' in section)) {
				section.toc = true;
			}
			var title = section.title;
			if ('tocTitle' in section) {
				var tocTitle = section.tocTitle;
			} else {
				var tocTitle = section.title;
			}
			if ('upper' in section) {
				upper = section.upper;
			}
			var titleElem = this.titleElement(section.title, (section.toc ? 'h2' : 'h5'), section.toc, upper, section.toc);
			var sectionId = titleElem.getAttribute('id');
			main.appendChild(titleElem);	
			if (ulElem && section.toc) {
				var hasQuestions = 'questions' in section && section.questions.length > 0;
				var hasQuestions = hasQuestions || ('images' in section && section.images.length > 0);
				var liElem = this.tocElement(sectionId, tocTitle, hasQuestions);
				if (hasQuestions) {
					this.navElement(sectionId, tocTitle, optGroup);
				}
				ulElem.appendChild(liElem);
			} else {
				var liElem = null;
			}
		}
		if ('subTitle' in section && section.subTitle != '') {
			main.appendChild(this.titleElement(section.subTitle, 'h4', false, false));
		}
		if ('questions' in section) {
			for (var i = 0; i < section.questions.length; i++) {
				main.appendChild(this.questionElement(section.questions[i]));
			}
		}
		if ('images' in section) {
			for (var i = 0; i < section.images.length; i++) {
				main.appendChild(this.imageElement(section.images[i]));
			}
		}
		if ('subSections' in section) {
			if (section.subSections.length > 0) { 
				var subOptGroup = this.navGroup(tocTitle);
				for (var i = 0; i < section.subSections.length; i++) {
					if (liElem) {
						var ulSubElem = document.createElement('ul');
						ulSubElem.setAttribute('class', 'indented');
						liElem.appendChild(ulSubElem);
					} else {
						var ulSubElem = null;
					}
					this.processSection(main, section.subSections[i], ulSubElem, false, subOptGroup);
				}
			}
		}
	},
	titleElement: function(text, type, setId, upper, navSection) {
		var elem = document.createElement(type);
		if (setId) {
			elem.setAttribute('id', 'section' + this.index);
			this.index ++;
		}
		var classList = [];
		if (upper) {
			classList.push('upper');
		}
		if (navSection) {
			classList.push('navSection');
		}
		if (classList.length > 0) {
			elem.setAttribute('class', classList.join(' '));
		}
		elem.innerHTML = text;
		
		return elem;
	},
	answerElement: function(label, ariaLabel, text, question) {
		var elem = document.createElement('a');	
		elem.setAttribute('class', 'answer-row');
		if (!('alwaysShow' in question) || !question.alwaysShow) {
			elem.addEventListener('click', this.toggle);
		}
		var answerLabel = document.createElement('div');
		answerLabel.setAttribute('class', 'answer-label');
		answerLabel.innerHTML = label;
		elem.appendChild(answerLabel);
		var answerCell = document.createElement('div');
		answerCell.setAttribute('class', 'answer-cell');
		answerCell.setAttribute('aria-label', ariaLabel);
		answerCell.setAttribute('role', 'alert');
		var answer = document.createElement('span');
		answer.setAttribute('class', 'answer');
		if (!('alwaysShow' in question) || !question.alwaysShow) {
			answer.setAttribute('style', 'visibility:hidden');		
		}
		if ('columns' in question && Array.isArray(text)) {
			for (var i = 0; i < question.columns.length; i++) {
				var subAnswer = document.createElement('span');
				subAnswer.setAttribute('class', 'answer-col');
				var attributes = ['width: ' + question.columns[i].width];
				if ('align' in question.columns[i]) {
					attributes.push('text-align: ' + question.columns[i].align);
				}
				subAnswer.setAttribute('style', attributes.join('; '));
				if (text.length > i) {
					subAnswer.innerHTML = text[i];
				}
				answer.appendChild(subAnswer);
			}
		} else {
			answer.innerHTML = text;
		}
		answerCell.appendChild(answer);
		elem.appendChild(answerCell);
		
		return elem;
	},
	answerGap: function() {
		var gap = document.createElement('div');
		gap.setAttribute('class', 'gap');
		gap.appendChild(document.createTextNode('\u2009'));
		
		return gap;
	},
	columnHeaders: function(columns) {
		var header = document.createElement('div'); 
		header.setAttribute("class","answer-header");
		var answerLabel = document.createElement('div');
		answerLabel.setAttribute('class', 'answer-label');
		header.appendChild(answerLabel);
		var answerCell = document.createElement('div');
		answerCell.setAttribute('class', 'answer-cell');
		for (var i = 0; i < columns.length; i++) {
			var subAnswer = document.createElement('span');
			subAnswer.setAttribute('class', 'answer-col');
			var attributes = ['width: ' + columns[i].width];
			if ('align' in columns[i]) {
				attributes.push('text-align: ' + columns[i].align);
			}
			subAnswer.setAttribute('style', attributes.join('; '));
			subAnswer.appendChild(document.createTextNode(columns[i].header));
			answerCell.appendChild(subAnswer);
		}
		header.appendChild(answerCell);			
		return header;
	},
	answersElement: function(question) {
		var elem = document.createElement('div');
		var classes = ['answers'];
		if ('anyAnswer' in question && question.anyAnswer) {
			classes.push('anyAnswer');
		}
		elem.setAttribute('class',classes.join(' '));
		if ('columns' in question) {
			if (!('columnHeaders' in question) || question.columnHeaders) {
				elem.appendChild(this.columnHeaders(question.columns));
			}
		}
		var ariaLabel = '';
		var label = '';
		var numberedList = this.numberedList;
		if ('numberedList' in question) {
			numberedList = question.numberedList;
		}
		
		for (var i = 0; i < question.answers.length; i++) {
			var answer = question.answers[i];
			if ('customLabels' in question && question.customLabels && Array.isArray(answer)) {
				ariaLabel = answer.shift();
				label = ariaLabel;
			} else if (question.orderedList) {
				if (numberedList) {
					ariaLabel = (i + 1).toString();
				} else {
					ariaLabel = String.fromCharCode(65 + i % 26).repeat(Math.floor(i / 26) + 1);
				}			
				if ('listPrefix' in question) {
					ariaLabel = question.listPrefix + ariaLabel;
				}
				label = ariaLabel + ('listSuffix' in question ? question.listSuffix : '.');
			} else {
				label = '\u2022';
				ariaLabel = '';
			};
			elem.appendChild(this.answerElement(label, ariaLabel, answer, question));
			elem.appendChild(this.answerGap());						
		}
		return elem;
	},
	questionElement: function(question) {
		var elem = document.createElement('div');	
		var classes = ['question','indented'];
		if ('class' in question) {
			classes.push(question.class);
		}
		elem.setAttribute('class',classes.join(' '));
		if ('title' in question && question.title != '') {
			var titleElem = this.titleElement(question.title, 'h3', false, false);
			var span = titleElem.querySelector('span');
			if (span != null && span.classList.contains('hidden-title')) {
				span.removeAttribute("class");
				span.setAttribute("style", "visibility: hidden;");
				var h3Elem = span.closest('h3');
				h3Elem.setAttribute("class", "hidden-title");
				h3Elem.addEventListener("click", this.toggleTitle);
			}
			elem.appendChild(titleElem);
		}
		if ('subTitle' in question && question.subTitle != '') {
			elem.appendChild(this.titleElement(question.subTitle, 'h4', false, false));
		}
		if (!('orderedList' in question)) {
			question.orderedList = (question.answers.length > 1);
		}
		elem.appendChild(this.answersElement(question));
		return elem;
	},
	imageElement: function(image) {
		var elem = document.createElement('img');
		elem.setAttribute('class', 'indented');
		elem.setAttribute('src', image);
		return elem;
	},
	toggle: function() {
		var span = this.querySelector('.answer');
		var visible = (span.style.visibility !== "hidden");
		var parent = span.closest('.answers');
		var anyAnswer = parent.classList.contains('anyAnswer');
		if (anyAnswer) {
			span.setAttribute("style", visible ? "visibility: hidden;" : "visibility: visible;");
		} else {
			var answers = parent.querySelectorAll('.answer-row .answer-cell .answer');
			if (visible) {
				answers = [...answers];
				answers.reverse();
			}
			for (var i = 0; i < answers.length; i++) {
				answers[i].setAttribute("style", visible ? "visibility: hidden;" : "visibility: visible;");
				if (span === answers[i]) {
					break;
				}
			}
		}
	},
	toggleTitle: function() {
		var span = this.querySelector('span');
		var visible = (span.style.visibility !== "hidden");
		span.setAttribute("style", visible ? "visibility: hidden;" : "visibility: visible;");
	},
	navSection: function () {
		location.href = this.value;
		document.querySelector(".topNav select").focus();
	}
}
document.addEventListener("DOMContentLoaded", function(event) { 
	invisiClues.processJSON();
});