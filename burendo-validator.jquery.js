(function( factory ) {
	if (typeof(require) === 'function') {
		module.exports = factory(jQuery);
	} else {
		factory(jQuery);
	}
})(function( $ ) {
	function Validator(selector) {
		var style = selector.data('orig_css');

		return {
			empty: function() {
				if (!selector.is('[data-required-field]')) {
					return false;
				}
				var value = typeof selector.data('validate-value') !== 'undefined' ? selector.data('validate-value') : selector.val();
				return value ? false: true;
			},
			format: function(pattern) {
				var value = typeof selector.data('validate-value') !== 'undefined' ? selector.data('validate-value') : selector.val(),
					matches = value.match(pattern);
				if (matches) {
					return true;
				}
				return false;
			},
			message: function(message) {
				selector.css(params.message.style);
				selector.data('validate-value', selector.val());
				selector.val(message);
			},
			resolve: function() {
				selector.css(style);
				if (typeof selector.data('validate-value') !== 'undefined') {
					selector.val(selector.data('validate-value'));
					selector.removeData('validate-value');
				}
			},
			checkEmpty: function() {
				selector.data('validate-legal', true);
				if (this.empty()) {
					if (typeof params.message.required === 'string') {
						this.message(params.message.required);
					}
					selector.data('validate-legal', false);
				}
			},
			checkFormat: function(pattern, message) {
				selector.data('validate-legal', true);
				if (typeof selector.data('validate-value') !== 'undefined') {
					selector.val(selector.data('validate-value'));
				}
				
				if (!this.format(pattern)) {
					this.message(message);
					selector.data('validate-legal', false);
				}
			}
		};
	};

	function TextValidator(selector) {
		var type = (typeof selector.data('validate-type') !== 'undefined') ? selector.data('validate-type') == 'text' : selector.is('input[type=text]');
		if (type) {
			var _parent = new Validator(selector); 
			return {
				resolve: function() {
					_parent.resolve();
				},
				checkEmpty: function() {
					_parent.checkEmpty();
					selector.blur();
					selector
					.on('focus', function() {
						_parent.resolve();
					});
					return this;
				},
				checkFormat: function() {
					if (params.format.text instanceof RegExp) {
						var message = '';
						if (typeof params.message.format.text === 'string') {
							message = params.message.format.text;
						}
						_parent.checkFormat(params.format.text, message);
						selector.blur();
						selector.on('focus', function() {
							_parent.resolve();
						});
					}
					return this;
				}
			}
		}
	}

	function NumberValidator(selector) {
		var type = (typeof selector.data('validate-type') !== 'undefined') ? selector.data('validate-type') == 'number' : selector.is('input[type=number]');
		if (type) {
			var _parent = new Validator(selector); 
			return {
				resolve: function() {
					_parent.resolve();
				},
				checkEmpty: function() {
					_parent.checkEmpty();
					selector.blur();
					selector
					.on('focus', function() {
						_parent.resolve();
					});
					return this;
				},
				checkFormat: function() {
					if (params.format.number instanceof RegExp) {
						var message = '';
						if (typeof params.message.format.number === 'string') {
							message = params.message.format.number;
						}
						_parent.checkFormat(params.format.number, message);
						selector.blur();
						selector.on('focus', function() {
							_parent.resolve();
						});
					}
					return this;
				}
			}
		}
	}

	function EmailValidator(selector) {
		var type = (typeof selector.data('validate-type') !== 'undefined') ? selector.data('validate-type') == 'email' : selector.is('input[type=email]');
		if (type) {
			var _parent = new Validator(selector); 
			return {
				resolve: function() {
					_parent.resolve();
				},
				checkEmpty: function() {
					_parent.checkEmpty();
					selector.blur();
					selector.on('focus', function() {
						_parent.resolve();
					});
					return this;
				},
				checkFormat: function() {
					if (params.format.email instanceof RegExp) {
						var message = '';
						if (typeof params.message.format.email === 'string') {
							message = params.message.format.email;
						}
						_parent.checkFormat(params.format.email, message);
						selector.blur();
						selector.on('focus', function() {
							_parent.resolve();
						});
					}
					return this;
				}
			}
		}
	}

	function PasswordValidator(selector) {
		var type = (typeof selector.data('validate-type') !== 'undefined') ? selector.data('validate-type') == 'password' : selector.is('input[type=password]'),
			style = selector.data('orig_css') ? selector.data('orig_css') : {}, 
			_parent = new Validator(selector);

		if (type) {
			return {
				message: function(message) {
					selector.data('validate-type', 'password');
					selector.attr('type', 'text');
					selector.css(params.message.style);
					selector.data('validate-value', selector.val());
					selector.val(message);
				},
				resolve: function() {
					selector.removeData('validate-type');
					selector.attr('type', 'password');
					selector.css(style);
					if (typeof selector.data('validate-value') !== 'undefined') {
						selector.val(selector.data('validate-value'));
						selector.removeData('validate-value');
					}
				},
				checkEmpty: function() {
					var _this = this, message = '';
					selector.data('validate-legal', true);
					if (_parent.empty()) {
						if (typeof params.message.required === 'string') {
							message = params.message.required;
						}
						_this.message(params.message.required);
						selector.blur();
						selector.on('focus', function() {
							_this.resolve();
							selector.val('');
						});
						selector.data('validate-legal', false);
					}
				},
				checkFormat: function() {
					var _this = this, message = '';
					selector.data('validate-legal', true);
					if (params.format.password instanceof RegExp) {
						if (typeof params.message.format.password === 'string') {
							message = params.message.format.password;
						}

						if (!_parent.format(params.format.password)) {
							_this.message(message);
							selector.blur();
							selector.on('focus', function() {
								_this.resolve();
								selector.val('');
							});
							selector.data('validate-legal', false);
						}
					}
				}
			}
		}
	}

	function SelectValidator(selector) {
		if (selector.is('select')) {
			var _parent = new Validator(selector);
			return {
				resolve: function() {
					_parent.resolve();
				},
				checkEmpty: function() {
					_parent.checkEmpty();
					selector.blur();
					selector.on('focus', function() {
						_parent.resolve();
					});
					return this;
				},
				checkFormat: function() {
					return this;
				}
			};
		}
	}

	function RadioValidator(selector) {
		if (selector.is('input[type=radio]')) {
			var _parent = new Validator(selector);
			_parent.empty = function() {
				var is_empty = true;
				selector.each(function() {
					if ($(this).prop('checked')) {
						is_empty = false;
					}
				});
				return is_empty;
			};
			return {
				resolve: function() {
					_parent.resolve();
				},
				checkEmpty: function() {
					_parent.checkEmpty();
					selector.blur();
					selector.on('focus', function() {
						_parent.resolve();
					});
					return this;
				},
				checkFormat: function() {
					return this;
				}
			};
		}
	}

	function CheckboxValidator(selector) {
		if (selector.is('input[type=checkbox]')) {
			var _parent = new Validator(selector);
			_parent.empty = function() {
				var is_empty = true;
				selector.each(function() {
					if ($(this).prop('checked')) {
						is_empty = false;
					}
				});
				return is_empty;
			};
			return {
				resolve: function() {
					_parent.resolve();
				},
				checkEmpty: function() {
					_parent.checkEmpty();
					selector.blur();
					selector.on('focus', function() {
						_parent.resolve();
					});
					return this;
				},
				checkFormat: function() {
					return this;
				}
			};
		}
	}

	function TextAreaValidator(selector) {
		if (selector.is('textarea')) {
			var _parent = new Validator(selector);
			return {
				resolve: function() {
					_parent.resolve();
				},
				checkEmpty: function() {
					_parent.checkEmpty();
					selector.blur();
					selector.on('focus', function() {
						_parent.resolve();
					});
				},
				checkFormat: function() {
					return this;
				}
			};
		}
	}

	var validators = {
			TextValidator,
			NumberValidator,
			PasswordValidator,
			EmailValidator,
			TextAreaValidator,
			SelectValidator,
			CheckboxValidator,
			RadioValidator,
		},
		params = {
			format: {
				email: /^([\w\-]+)@([\w\-]+\.)?([\w]{2,3})/,
				phone: /^09(\d{2})(\d{6})$/,
				tel: /^0(\d{2,3})\-(\d{7,8})$/,
				number: /(\d+)/,
				password: /^[A-Za-z0-9]{6,12}$/,
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
					password: "密碼須為6~12位英數組合",
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

		if (typeof opt === 'string') {
			form.filter('form').find($(elements.join(',')).each(function() {
				var elm = $(this);
				for (var i in validators) {
					var validator = validators[i].call(null, elm);
					if (typeof validator !== 'object') {
						continue;
					}

					if (typeof validator[opt] === 'function') {
						validator[opt].call();
					}
				}
			}));
		}

		if (typeof opt.format === 'object') {
			$.extend(params.format, opt.format);
		}

		if (typeof opt.message === 'object') {
			if (typeof opt.message.required == 'string') {
				params.message.required = opt.message.required;
			}

			if (typeof opt.message.format === 'object') {
				$.extend(params.message.format, opt.message.format);
			}

			if (typeof opt.message.style === 'object') {
				$.extend(params.message.style, opt.message.style);
			}
		}

		if (typeof opt.success === 'function') {
			params.success = opt.success;
		}

		form.filter('form').submit(function(e) {
			e.preventDefault();
			form.find(elements.join(',')).each(function() {
				var selector = $(this), style = {};
				if (typeof selector.data('orig_css') !== 'object') {
					style.borderColor = selector.css('borderColor');
					style.backgroundColor = selector.css('backgroundColor');
					style.color = selector.css('color');
					selector.data('orig_css', style);
				}

				for (var i in validators) {
					var validator = validators[i].call(null, selector);
					if (typeof validator !== 'object') {
						continue;
					}

					validator.resolve();
					validator.checkEmpty();
					if (selector.data('validate-legal')) {
						validator.checkFormat();
					}

					if (!selector.data('validate-legal')) {
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
