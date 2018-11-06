(function( factory ) {
	if (typeof(require) === 'function') {
		module.exports = factory(jQuery);
	} else {
		factory(jQuery);
	}
})(function( $ ) {
	function Validate(selector) {
		this.selector = selector;

		return {
			empty: function() {
				return (selector.val()) ? false: true;
			},
			format: function(pattern) {
				var matches = selector.val().match(pattern);
				if (matches) {
					return true;
				}
				return false;
			},
			message: function(message) {
				selector.css(params.message.style);
				selector.val(message);
			},
			checkEmpty: function(message) {
				if (this.empty()) {
					this.message(message);
					return false;
				}
				return true;
			},
			checkFormat: function(pattern, message) {
				if (!this.format(pattern)) {
					this.message(message);
					return false;
				}
				return true;
			}
		};
	};

	function InputValidate() {
		var selector = this;
		if (selector.is('input')) {
			var Valid = new Validate(selector);
			return {
				checkEmpty: function() {
					return Valid.checkEmpty(params.message.required);
				},
				checkFormat: function() {
					var check_items = selector.data('check-item'),
	                                    is_legal = true, pattern, message;
					if (selector.attr('type') !== undefined) {
                                            pattern = params.format[selector.attr('type')];
                                            message = params.message.format[selector.attr('type')];
                                        }
                                        
                                        if (selector.data('check-item') !== undefined) {
                          		    var type = selector.data('check-item').replace(/ /g, '');
                                            pattern = params.format[type];
                                            message = params.message.format[type];
                                        }
                                         
				        if (pattern instanceof RegExp && message !== undefined) {
					    if (!Valid.checkFormat(pattern, message)) {
							is_legal = false;
					    }
					}
				
					return is_legal;
				}
			};
		}
		return false;
	}

	function SelectValidate() {
		var selector = this;
		if (selector.is('select')) {
			var Valid = new Validate(selector);
			return {
				checkEmpty: function() {
					return Valid.checkEmpty();
				},
				checkFormat: function() {
					console.error('Not support');
				}
			};
		}
	}

	function RadioValidate() {
		var selector = this;
		if (selector.is('input[type=radio]')) {
			var Valid = new Validate(selector);
			Valid.ptototype.empty = function() {
				var is_empty = true;
				selector.each(function() {
					if ($(this).prop('checked')) {
						is_empty = false;
					}
				});
				return is_empty;
			};
			return {
				checkEmpty: function() {
					return Valid.checkEmpty();
				},
				checkFormat: function() {
					console.error('Not support');
				}
			};
		}
		return false;
	}

	function CheckboxValidate() {
		var selector = this;
		if (selector.is('input[type=checkbox]')) {
			var Valid = new Validate(selector);
			Valid.ptototype.empty = function() {
				var is_empty = true;
				selector.each(function() {
					if ($(this).prop('checked')) {
						is_empty = false;
					}
				});
				return is_empty;
			};
			return {
				checkEmpty: function() {
					return Valid.checkEmpty();
				},
				checkFormat: function() {
					console.error('Not support');
				}
			};
		}
		return false;
	}

	function TextAreaValidate() {
		var selector = this;
		if (selector.is('textarea')) {
			var Valid = new Validate(selector);
			return {
				checkEmpty: function() {
					return Valid.checkEmpty();
				},
				checkFormat: function() {
					console.error('Not support');
				}
			};
		}
		return false;
	}

	var interFaceMap = {
			'input' : InputValidate,
			'textarea' : TextAreaValidate,
			'select' : SelectValidate,
			'checkbox' : CheckboxValidate,
			'radio' : RadioValidate
		},
		params = {
			format: {
				email: /^([\w\-]+)@([\w\-]+\.)?([\w]{2,3})/,
				phone: /^09(\d{2})(\d{6})$/,
				tel: /^0(\d{2,3})\-(\d{7,8})$/,
				number: /(\d+)/,
				alphabet: /([a-zA-Z]+)/,
				mix: /([a-zA-Z0-9]+)/
			},
			message: {
				required: "此為必填欄位",
				format: {
					email: "電子郵件地址格式錯誤",
					phone: "手機號碼格式錯誤",
					tel: "電話號碼格式錯誤",
					number: "只能為數字",
					alphabet: "只能為大小寫字母",
					mix: "只能為英數組合"
				},
				style: {
					borderColor: "#ff2d2d",
					backgroundColor: "#ffecec",
					color: "#ff2d2d"
				}
			}
		},
		elements = ['input', 'textarea', 'select', 'radio', 'checkbox'];

	$.fn.validate = function(opt) {
		var form = this,
			is_legal = true;

		$.extend(params, opt);
		form.filter('form').submit(function(e) {
			e.preventDefault();
			is_legal = true;
			form.find(elements.join(',')).each(function() {
				var selector = $(this),
					value = selector.val(),
					type = selector.prop('tagName').toLowerCase(),
					validator = (typeof interFaceMap[type] === 'function') ? interFaceMap[type].call(selector) : null,
					css = {
						backgroundColor: selector.css('backgroundColor'),
						color: selector.css('color'),
						borderColor: selector.css('borderColor')
					};

					if (validator !== null) {
						if (selector.is('[required]') && !validator.checkEmpty()) {
							selector.blur();
							selector.off().on('focus', function(e) {
								selector.val(value);
								selector.css(css);
							});
							is_legal = false;
						}

						if (!validator.checkFormat()) {
							selector.blur();
							selector.off().on('focus', function(e) {
								selector.val(value);
								selector.css(css);
							});
							is_legal = false;
						}
					}
			});

			if (!is_legal) {
				return false;
			}

			if (typeof params.success === 'function') {
				params.success.apply(null);
			} else {
				form.off().submit();
			}
		});
	};
});
